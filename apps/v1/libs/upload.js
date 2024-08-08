'use strict'

const fs = require('fs') // Load the filesystem module
const read_chunk = require('read-chunk')
const file_type = require('file-type')
const AWS = require('aws-sdk');
const OSS = require('ali-oss');

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

// checking base64 in string format
// return type based on base64string
// return false if error happend
// sample base64 error provide on folder test/upload-base64_cases
// [Eka] Update function into general (also can decode base64 without content type), update Buffer syntax
let decodedBase64 = (data_string) => {
    try {
        let matches = data_string.match(/^data:([A-Za-z-.+@\/]+);base64,(.+)$/)
        let response = {
            type: '',
            data: ''
        }

        // Check base64 is in Data URI format or Plain format (just base64 value)
        if (matches !== null) {
            if (matches.length === 3) {
                response.type = matches[1]
                response.data = Buffer.from(matches[2], 'base64')
            } else {
                return new Error('Invalid input string')
            }
        } else {
            response.data = Buffer.from(data_string, 'base64')
        }

        return response
    } catch (error) {
        return false
    }
}

// read and upload base64string to image on preffered location
// this function four kinds of return
// object response retur
// {
//     code:"boolean",
//     img_name:"string",
//     file_name:"string",
//     full_path:"string"
// }
// return object object with code false
// return object object with code true
// return false if invalid base64 string
// return error invalid image type
let imageUpload = (base64raw, store_location, opt = {}) => new Promise((resolve, reject) => {
    let {
        whitelist_filetype,
        prefix
    } = opt
    if (!whitelist_filetype || whitelist_filetype[0] === undefined) {
        whitelist_filetype = ['jpg', 'jpeg', 'png']
    }
    if (!prefix) {
        prefix = "base64pic"
    }

    let image_type_regular_expression = /\/(.*?)$/
    let base64_data = decodedBase64(base64raw)
    if (!base64_data) {
        resolve(false)
    }
    let image_type_detected = base64_data.type.match(image_type_regular_expression)
    let image_type_file = image_type_detected[1].toLowerCase()

    let defaultStore = require.main.filename.split("\\").slice(0, 3).join("\\")
    let folder = (store_location) ? store_location : defaultStore + "/uploads/base64/";
    if (!store_location) {
        if (fs.existsSync(folder) == false) {
            fs.mkdirSync(folder, {
                recursive: true
            });
        }
    }

    if (whitelist_filetype.indexOf(image_type_file) > -1) {
        let img_name = (new Date()).getTime() + "." + image_type_file
        let image_name = prefix + "_" + img_name
        let full_path = folder + image_name

        fs.writeFile(full_path, base64_data.data, 'base64', function (err) {
            const buffer = read_chunk.sync(full_path, 0, 4100)
            let types = file_type(buffer)
            if (err) {
                reject(err)
            }

            let fileIsUploaded = true
            let response = {
                code: fileIsUploaded,
                img_name: img_name,
                file_name: image_name,
                full_path: full_path
            }


            if (types !== null) {
                if (whitelist_filetype.indexOf(types.ext) > -1) {
                    fileIsUploaded = true
                } else {
                    fileIsUploaded = false
                    fs.unlinkSync(full_path)
                }
            } else {
                fileIsUploaded = false
                fs.unlinkSync(full_path)
            }
            response.code = fileIsUploaded

            resolve(response)
        })
    } else {
        throw new Error("Invalid Image Type!")
    }
})

/**
 * 
 * Upload Image or Video or Others from base64string to Cloud Storage Main Function
 * - Set default allowed_mime_type if param allowed_mime_type empty
 * - Check mime type in the base64 string, if mime type exists in base64 string
 * - Upload file to local
 * - Check mime type again, compare with allowed_mime_type
 * - Generate new filename that consist file extension
 * - Upload local file to cloud storage with new filename
 * - Remove local file
 * 
 * You can try this function using api in api/test/upload_cs
 */

let uploadCs = (base64raw, naming = 'avatar_' /* Filename prefix you desire */ , destination, type = 'image' /* (image, video, others) */ , cs_config /* Cloud Storage Name (S3, OSS) */ , allowed_mime_type) => new Promise((resolve, reject) => {
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

        // Check mime type base64 string
        let base64_data = decodedBase64(base64raw)
        if (base64_data.type != '') {
            if (allowed_mime_type.indexOf(base64_data.type) < 0) {
                throw new MyError('Please provide the correct mime type!')
            }
        }

        //upload to current folder project
        let folder = "./uploads/";

        if (fs.existsSync(folder) == false) {
            fs.mkdirSync(folder, {
                recursive: true
            });
        }

        let file_name = naming + (new Date()).getTime()
        let full_path = folder + file_name
        let cs_params = {}

        fs.writeFile(full_path, base64_data.data, 'base64', function (err) {
            (async () => {
                const buffer = read_chunk.sync(full_path, 0, 4100)
                let types = file_type(buffer)
                if (err) {
                    reject(err)
                }

                let response = {
                    upload_status: true,
                    file_name: '',
                    file_url: ''
                }

                if (types !== null) {
                    // Check mime type again from uploaded file
                    if (allowed_mime_type.indexOf(types.mime) > -1) {
                        let new_filename = file_name + "." + types.ext

                        // Begin upload to Cloud Storage
                        if (cs_config.cs_name == 'S3') {
                            let config_s3 = {
                                accessKeyId: cs_config.cs_access_key_id,
                                secretAccessKey: cs_config.cs_access_key_secret,
                                region: cs_config.cs_region,
                            }

                            let aws_s3 = new AWS.S3(config_s3);

                            cs_params = {
                                Bucket: cs_config.cs_bucket_name,
                                Key: destination + new_filename, // File name you want to save as in S3
                                Body: fs.readFileSync(full_path),
                                ContentType: types.mime
                            }

                            let do_upload = await uploadS3(aws_s3, cs_params)

                            response.file_url = do_upload
                            response.file_name = new_filename
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
                                Key: destination + new_filename, // File name you want to save as in OSS
                                Body: fs.readFileSync(full_path)
                            }
                            let do_upload = await uploadOss(ali_oss, cs_params)

                            response.file_url = do_upload.url
                            response.file_name = new_filename
                        }

                        fs.unlinkSync(full_path)
                    } else {
                        fs.unlinkSync(full_path)
                        throw new MyError('Please provide the correct mime type.')
                    }
                } else {
                    fs.unlinkSync(full_path)
                    throw new MyError('Unable to get file type.')
                }

                resolve(response)

            })().catch((err) => {
                reject(err)
            })
        })

    })().catch((err) => {
        reject(err)
    })
})

// check if string is in base64 string
exports.isBase64String = (string) => {
    try {
        return string.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/) ? true : false;
    } catch (err) {
        return false;
    }
}

// alias of decodedBase64 function
exports.decodedBase64 = decodedBase64

// alias imageUpload function
module.exports.upload = imageUpload

module.exports.uploadCs = uploadCs

exports.uploadS3 = uploadS3