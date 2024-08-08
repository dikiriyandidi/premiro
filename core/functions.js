'use strict'
const im = require('imagemagick');
const sizeOf = require('image-size');
const ffmpeg = require('fluent-ffmpeg');
const duration = require('get-video-duration');
const moment = require('moment');
const read_chunk = require('read-chunk');
const file_type = require('file-type');
const sharp = require('sharp');
const imageHelper = require("../apps/v1/libs/image_helper")
const AWS = require('aws-sdk');
const OSS = require('ali-oss');

// Set Off Sharp caching files
sharp.cache(false);

let uploadSingleFile = (file, destination, allowed_mime_type, type_file = null) => new Promise((resolve, reject) => {
    let new_name = file.originalname.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, '')
    let names = new_name.split(".")

    let n_name = ""
    for (let j = 0; j < names.length - 1; j++) {
        n_name += names[j]
        if (j < names.length - 2)
            n_name += "."
    }

    if (type_file) {
        n_name += (type_file + '_' + Math.round(new Date().getTime() / 1000) + "." + names[names.length - 1])
    }
    else {
        n_name += ('_' + Math.round(new Date().getTime() / 1000) + "." + names[names.length - 1])

    }
    
    let rd = fs.createReadStream(file.path);
    rd.on("error", function (err) {
        reject(err)
    })
    let wr = fs.createWriteStream(destination + n_name);

    wr.on("error", function (err) {
        reject(err)
    })
    wr.on("close", function (ex) {
        const buffer = read_chunk.sync(destination + n_name, 0, 4100)
        let types = file_type(buffer)

        let excluded_file = ['audience_file', 'json_file']
        if (types !== null) {
            if (file.mimetype == types.mime && allowed_mime_type.indexOf(types.mime) > -1) {
                resolve(n_name)
            } else if (file.fieldname != 'video' && allowed_mime_type.indexOf(types.mime) > -1) {
                resolve(n_name)
            } else if (file.mimetype == "video/webm" && types.mime == "video/x-matroska") {
                resolve(n_name)
            } else {
                fs.unlinkSync(destination + n_name)
                resolve("Invalid")
            }
        } else if (excluded_file.indexOf(file.fieldname) > -1 && allowed_mime_type.indexOf(file.mimetype) > -1) {
            resolve(n_name)
        } else {
            fs.unlinkSync(destination + n_name)
            resolve("Invalid")
        }
    })
    rd.pipe(wr)
})

let compressFileImageWebp = (file, destination, quality = 75) => new Promise((resolve,reject) => {
    (async () => {
        let new_name = file.originalname
        let names = new_name.split(".")

        const webp = await sharp(file.path)
        .webp({
            quality:quality,
            lossless: false
        })
        .toFile(destination + names[0] + Math.round(new Date().getTime() / 1000) + '.webp')
        .then( info => {
            // console.log(info); //commented
            resolve (names[0] + Math.round(new Date().getTime() / 1000) );
        })
        .catch(err => {
            reject (err);
        });

       
    })()
})

let compressFileImage = (file, destination = '', menu, quality = 80) => new Promise((resolve, reject) => {
    (async () => {
        let new_name = file.originalname
        let names = new_name.split(".")

        let n_name = names[0] + ( + Math.round(new Date().getTime() / 1000) + "." + names[names.length - 1])

        let option = {
            quality: quality,
            chromaSubsampling: '4:4:4' // set to '4:4:4' to prevent chroma subsampling set to '4:4:4' to prevent chroma subsampling otherwise defaults to '4:2:0' chroma subsampling
        }

        // Set new destination file
        let new_destination = ''
        if (destination == '') {
            new_destination = file.path
        } else {
            new_destination = destination + n_name
        }
        
        if (menu === "article") {
            // Resize width to 600px
            let buffer = await sharp(file.path)
                .resize({width: 600}) // Auto scale height
                .jpeg(option) // Compression Step
                .toBuffer()
            
            sharp(buffer).toFile(new_destination, (err, info) => {
                if (err) {
                    reject(err)
                }
                resolve(n_name)
            })
        }
        else {
            // No Resize width, only compression
            let buffer = await sharp(file.path)
                .jpeg(option) // Compression Step
                .toBuffer()
            
            sharp(buffer).toFile(new_destination, (err, info) => {
                if (err) {
                    reject(err)
                }
                resolve(n_name)
            })
        }
    })()
})

let compressFileVideo = (file, destination = '') => new Promise(
    async(resolve) => { //(resolve, reject)
        let new_name = file.originalname
        let names = new_name.split(".")
        let n_name = ""
        let percentage = 50

        for (let j = 0; j < names.length - 1; j++) {
            n_name += names[j]
            if (j < names.length - 2) {
                n_name += "."
            }
        }

        let thumb_name = ''
        if (destination == '') {
            thumb_name = file.originalname
        } else {
            thumb_name = n_name + '_' + Math.round(new Date().getTime() / 1000) + "." + "jpg"
        }


        n_name += ('_' + Math.round(new Date().getTime() / 1000) + "." + 'mp4')

        // Set new destination file
        let new_destination = ''
        if (destination == '') {
            new_destination = file.path
        } else {
            new_destination = destination
        }

        // disabled old function
        // process conversion should be waited
        // because converted video will upload to s3
        // duration.getVideoDurationInSeconds(file.path).then((duration) => {
        //     let duration_percen = moment()
        //         .startOf('day')
        //         .seconds(duration * (percentage / 100))
        //         .format('mm:ss')
        //     new ffmpeg(file.path)
        //         .toFormat('mp4')
        //         .save((destination == '') ? new_destination : new_destination + n_name)
        //         .takeScreenshots({ timestamps: ['100%', duration_percen], filename: thumb_name }, new_destination);
        // });

        let isConverted = await convertToMP4({
            file_path:file.path,
            destination:"uploads/converted/",
            filename:n_name
        },true)
        file.convertedName = n_name
        file.originalpath = file.path
        file.path = (isConverted.status) ? isConverted.path : file.path

        resolve(file)
})

let convertToMP4 = ({
    file_path:filePath="",
    destination:destinationPath="uploads/ss/",
    filename:filename=new Date().getTime()
  },returnOnFinish=false)=> new Promise(
    async(resolve,reject)=>{
      let basePath = process.cwd()
      let fullDestinationPath = `${basePath}/${destinationPath}`
    //   appHelper.mkdirSyncRecursive(fullDestinationPath)
      let pathDestination = `${fullDestinationPath}${filename}`
  
      try {
        ffmpeg({
          source:filePath,
        })
        .toFormat("mp4")
        .save(pathDestination)
        .on("end",function(){
          if(returnOnFinish){
            resolve({
              status:true,
              filename,
              path:pathDestination
            })
          }
        })
        
        if(returnOnFinish==false){
          resolve({
            status:true,
            filename,
            path:pathDestination
          })
        }
      } catch (error) {
        console.log(error)
        resolve({
          status:false,
          filename:"",
          path:""
        })
      }
    }
  )
  
let compressFileImageOld = (file, destination,menu, quality = '0.82') => new Promise((resolve, reject) => {
    let new_name = file.originalname
    let names = new_name.split(".")
    
    let n_name = ""
    // remove by Mudit to generalize file name between webp and original image
    // for (let j = 0; j < names.length - 1; j++) {
    //     n_name += names[j]
    //     if (j < names.length - 2)
    //         n_name += "."
    // }
    let general_name = names[0]  + Math.round(new Date().getTime() / 1000);
    n_name += names[0] + ( + Math.round(new Date().getTime() / 1000) + "." + names[names.length - 1])

    sizeOf(file.path, function (err, dimensions) {
        let option = null
        if (dimensions === undefined) {
            resolve('Invalid')
        }
        else if (menu === "article") {
            option = {
                srcPath: file.path,
                dstPath: destination + n_name,
                quality: quality,
                format: names[1].toLowerCase(),
                width: 600,
                //height: dimensions, //fixed width = heigh match the width
                gravity: 'Center'
            }
        }
        else {
            option = {
                srcPath: file.path,
                dstPath: destination + n_name,
                quality: quality,
                format: names[1].toLowerCase(),
                width: dimensions.width,
                height: dimensions.height,
                gravity: 'Center'
            }
        }

        im.resize(option, function (err) { //(err, stdout, stderr)
            if (err) {
                reject(err)
            }
            resolve(general_name)
        })
    });
})

let compressFileVideoOld = (file, destination) => new Promise((resolve) => { //(resolve, reject)
    let new_name = file.originalname
    let names = new_name.split(".")
    let n_name = ""
    let percentage = 50

    for (let j = 0; j < names.length - 1; j++) {
        n_name += names[j]
        if (j < names.length - 2) {
            n_name += "."
        }
    }

    let thumb_name = n_name + '_' + Math.round(new Date().getTime() / 1000) + "." + "jpg"

    n_name += ('_' + Math.round(new Date().getTime() / 1000) + "." + 'mp4')

    duration(file.path).then((duration) => {
        let duration_percen = moment()
            .startOf('day')
            .seconds(duration * (percentage / 100))
            .format('mm:ss')
        new ffmpeg(file.path)
            .toFormat('mp4')
            .save(destination + n_name)
            .takeScreenshots({ timestamps: ['100%', duration_percen], filename: thumb_name }, destination);
    });

    resolve(n_name)
})

/**
 * 
 * [UPLOAD TO CLOUD STORAGE SECTION]
 */

let uploadS3 = (aws_s3, params) => new Promise((resolve, reject) => {
    aws_s3.upload(params, function (err, data) {
        if (err) {
            reject(err)
            return
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        resolve(data.Location)
    })
})

let uploadOss = (ali_oss, params) => new Promise((resolve, reject) => {
    (async () => {
        let upload = await ali_oss.put(params.Key, params.Body).then(async (result) => {
            await ali_oss.putACL(params.Key, 'public-read')
            return result
        }).catch((err) => {
            reject(err)
        })
        console.log(upload)
        resolve(upload)
    })().catch(reject)
})

let fn = (fw, rootpath, basepath) => {
    const path = require('path')
    const fn = {}

    Number.prototype.format = function(n, x) {
        let re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')'
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,')
    }

    // attach rootpath and basepath
    fn.rootpath = rootpath
    fn.basepath = basepath

    // set main router
    fn.router = (param) => {
        const router = require('express').Router()

        param(fn, router)

        fw.use(router)
    }

    // require a route file
    fn.route = (routeName, dir) => {
        let callback = null
        if(dir != undefined && fs.existsSync(path.normalize(dir + '/' + routeName.toLowerCase() + '.js')))
            callback = require(path.normalize(dir + '/' + routeName.toLowerCase() + '.js'))
        else if(dir != undefined && fs.existsSync(path.normalize(dir + '/' + routeName.toLowerCase())))
            callback = require(path.normalize(dir + '/' + routeName.toLowerCase()))
        else if(dir != undefined && fs.existsSync(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase() + '.js'))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase()))
        else if(dir != undefined && fs.existsSync(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase()))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + dir + '/' + routeName.toLowerCase()))
        else if(fs.existsSync(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase() + '.js')))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase() + '.js'))
        else if (fs.existsSync(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase())))
            callback = require(path.normalize(rootpath + '/' + basepath + '/routes/' + routeName.toLowerCase()))
        else{
            throw new MyError("Route " + routeName + " is not found",200, 403)
            return
        }
        
        const router = require('express').Router()

        callback(fn, router)

        return router
    }

    // require a filter file
    fn.filter = (filterName) => require(path.normalize(rootpath + '/' + basepath + '/filters/' + filterName.toLowerCase() + '.js'))

    // require a controller file
    fn.controller = (controllerName) => {
        return require(path.normalize(rootpath + '/' + basepath + '/controllers/' + controllerName.toLowerCase() + '.js'))
    }

    // attach database handling on framework request object
    fw.request.db = fw.db

    // attach lib function on framework request object
    fw.request.lib = (libName) => {
        //[William]: move lib to core
        if(fs.existsSync(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'))
            return require(path.normalize(rootpath + '/' + basepath + '/libs/' + libName.toLowerCase() + '.js'))
        else
            return require(path.normalize(rootpath + '/core/libs/' + libName.toLowerCase() + '.js'))
    }
    //[William]: suggest to move query to another file not in controller
    fw.request.queries = (libName) => require(path.normalize(rootpath + '/' + basepath + '/queries/' + libName.toLowerCase() + '.js'))

    //[William]: suggest to check required
    fw.request.validate = (req, param)=> {
        let val = require(rootpath + '/core/validator')
        let validator = new val(rootpath + '/' + basepath)
        let err = []
        let res = []
        for(let i in param)
        {
            if(typeof(param[i]) == 'object' && typeof(param[i]['name']) == 'undefined')
                continue
            
            if(typeof(param[i]) == 'string')
                res = validator.validate(req,param[i], ['required'])
            else if(typeof(param[i]) == 'object' && typeof(param[i]['rules']) == 'undefined')
                res = validator.validate(req,param[i]['name'], ['required'])
            else
                res = validator.validate(req,param[i]['name'], param[i]['rules'])
            if(res.length > 0)
            {
                if(typeof(param[i]['message']) != 'undefined')
                    err.push(param[i]['message'])
                else
                    err = err.concat(res)
            }
        }
        if(err.length > 0)   
                throw new MyError(err,400,400) // Aswin [09/09/2020] update res.error for validate
        
    }

    //type: image, video, others
    fw.request.move_uploaded_file = (req, fieldname, destination, type, is_array = false, is_compress = false, allowed_mime_type = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'video/mp4', 'video/mov', 'video/x-flv', 'video/quicktime', 'video/mpeg', 'video/avi', 'video/x-matroska'], is_webp = false, keep_original_file = true) => new Promise((resolve, reject) => {
        (async () => {
            let found = false
            let ret = new Array()
            let res

            for (let i in req.files) {

                if (req.files[i].fieldname == fieldname) {
                    let currentFile = req.files[i]
                    
                    if(type == 'image') {
                        let imageIdentity = await imageHelper.identifySharp(currentFile.path)
                        if(!imageIdentity){
                            resolve("Invalid")
                        }
                    }

                    if (allowed_mime_type.indexOf(req.files[i].mimetype) < 0) {
                        resolve("Invalid")
                    }

                    if(is_webp){
                        //generate webp file with 'originalname'.webp
                        res = await compressFileImageWebp(req.files[i], destination);
                    }

                    if (is_compress) {
                        res = await compressFileImage(req.files[i], destination)

                        if (keep_original_file) {
                            let type_file = '_ori'
                            await uploadSingleFile(req.files[i], destination, allowed_mime_type, type_file)
                        }
                    }
                    else {
                        res = await uploadSingleFile(req.files[i], destination, allowed_mime_type)
                    }

                    if (!is_array) {
                        resolve(res);
                    } else
                        found = true
                }
            }
            if (!found)
                reject("No selected file")
            else
                resolve(ret)
        })()
    })

    // Upload Image or Video or Others from Static Files to Cloud Storage Main Function
    fw.request.move_uploaded_file_cs = (req, fieldname, destination, type = 'image' /* (image, video, others) */, cs_config /* Cloud Storage Name (S3, OSS) */, allowed_mime_type, is_compress = false) => new Promise((resolve, reject) => {
        (async () => {
            // Set default mime_type for image and video
            if (!Array.isArray(allowed_mime_type)) {
                if (type == 'image') {
                    allowed_mime_type = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
                } else if (type == 'video') {
                    allowed_mime_type = ['video/mp4', 'video/mov', 'video/x-flv', 'video/quicktime', 'video/mpeg', 'video/avi', 'video/x-matroska']
                } else {
                    if (!Array.isArray(allowed_mime_type)) {
                        throw new MyError('Please provide mime type!')
                    }
                }
            }

            let new_name = ""
            let cs_params = {}
            if (req.files) {
                for (let i in req.files) {
                    if (req.files[i].fieldname == fieldname) {
                        //[Mudita] add allowed mime type validation
                        if (allowed_mime_type.indexOf(req.files[i].mimetype) < 0) {
                            throw new MyError('Please provide the correct mime type!')
                        }

                        new_name = req.files[i].originalname.replace(/[&\/\\#,+()$~%'":*?<>{}\s]/g, '');

                        let temp_names = new_name.split(".")
                        new_name = ''

                        for (let j = 0; j < temp_names.length - 1; j++) {
                            new_name += temp_names[j]
                            if (j < temp_names.length - 2) {
                                new_name += "."
                            }
                        }

                        new_name += ('_' + Math.round(new Date().getTime() / 1000) + "." + temp_names[1].toLowerCase())

                        // Compress File
                        if (is_compress) {
                            if (type == 'image') {
                                await compressFileImage(req.files[i])

                            } else if (type == 'video') {
                                let compressedVideo = await compressFileVideo(req.files[i])
                                new_name = (compressedVideo.convertedName) ? compressedVideo.convertedName : new_name

                            }
                        }

                        // Uploading files to the Cloud Storage
                        if (cs_config.cs_name == 'S3') {
                            let config_s3 = {
                                accessKeyId: cs_config.cs_access_key_id,
                                secretAccessKey: cs_config.cs_access_key_secret,
                                region: cs_config.cs_region,
                            }

                            let aws_s3 = new AWS.S3(config_s3);

                            cs_params = {
                                Bucket: cs_config.cs_bucket_name,
                                Key: destination + new_name, // File name you want to save as in S3
                                Body: fs.readFileSync(req.files[i].path),
                                ContentType: req.files[i].mimetype
                            }

                            await uploadS3(aws_s3, cs_params)
                        }

                        if (cs_config.cs_name == 'OSS') {
                            let config_oss = {
                                accessKeyId: cs_config.cs_access_key_id,
                                accessKeySecret: cs_config.cs_access_key_secret,
                                bucket: cs_config.cs_bucket_name,
                                region: cs_config.cs_region,
                            }
                        
                            let ali_oss = OSS(config_oss);

                            cs_params = {
                                Key: destination + new_name, // File name you want to save as in OSS
                                Body: req.files[i].path
                            }
                            await uploadOss(ali_oss, cs_params)
                        }

                        fs.unlinkSync(req.files[i].path)
                        resolve(new_name)
                    }
                }
            }
            
        })().catch((err) => {
            reject(err)
        })
    })

    fw.request.rootpath = rootpath

    return fn
}

module.exports = fn
