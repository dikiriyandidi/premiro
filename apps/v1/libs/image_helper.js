'use strict'

const fs = require('fs')
const im = require('imagemagick')
const path = require('path')
const ratify = require('node-ratify')
const exec = require('child_process').exec
const sharp = require('sharp')

let default_options = {
    'text' : 'Sample text',
    'override-image' : false,
    'change-format' : false,
    'output-format' : 'jpg',
    'gravity' : 'Southwest',
    'xycoordinate':"+35+95",
    "pointsize":"32",
    'color' : '#FFFFFF',
    'resize' : '100%'
}

//
// Check if the alignment passed
// is a valid alignment value
//
// Possible values of align are : dia1, dia2, ttb, btt, ltr, rtl
//
let isValidAlignment = (align) => {
    if (ratify.isEmpty(align)) {
        return false
    }

    //
    // dia1 : Diagonal 1
    // dia2 : Diagonal 2
    // ttb : top to bottom
    // btt : bottom to top
    // ltr : left to right
    // rtl : right to left
    //
    if (['dia1', 'dia2', 'ttb', 'btt', 'ltr', 'rtl', 'normal'].indexOf(align.toLowerCase()) > -1) {
        return true
    }
    return false
}

let parseOptions = (image_data, source, options) => {
    let obj_return = {}

    let width = image_data.width
    let height = image_data.height
    let fillColor = options.color
    let text_image = options.text
    let align = isValidAlignment(options.align) ? options.align.toLowerCase() : 'normal'
    let font = options.font
    let resize = options.resize ? options.resize : default_options.resize
    let output_path = (options.dstPath ? options.dstPath : path.dirname(source)) + '/' + options.filename + path.extname(source)
    let gravity = options.gravity
    let text_position = null
    let pointsize = options.pointsize
    let xycoordinate = options.xycoordinate

    // Check if fillColor is defined
    if (ratify.isEmpty(fillColor)) {
        fillColor = default_options.color
    }

    // Check if text is defined
    if (ratify.isEmpty(text_image)) {
        text_image = default_options.text
    }

    // Check if gravity is defined
    if (ratify.isEmpty(gravity)) {
        gravity = default_options.gravity
    }

    // Check if pointsize is defined
    if (ratify.isEmpty(pointsize)) {
        pointsize = default_options.pointsize
    }

    if (ratify.isEmpty(xycoordinate)) {
        xycoordinate = default_options.xycoordinate
    }

    // Check if image needs to be overriden
    if (options['override-image'] && ratify.isBoolean(options['override-image']) && options['override-image'].toString() === 'true') {
        output_path = source
    }

    // Check if output format needs to be changed
    if (options['change-format'] && ratify.isBoolean(options['change-format']) && options['change-format'].toString() === 'true') {

        let outputFormat = options['output-format']

        if (ratify.isEmpty(outputFormat) || outputFormat.length < 2) {
            outputFormat = path.extname(source).substr(1)
        }

        output_path = path.dirname(output_path) + '/' + path.basename(output_path, path.extname(output_path)) + '.' + outputFormat
    }

    // Check if extension of output path is valid
    if (output_path) {

        let ext = path.extname(output_path).substr(1)

        if (!ext || ext.length < 2) {
            output_path = path.dirname(output_path) + '/' + path.basename(output_path, path.extname(output_path)) + path.extname(source)
        }
    }

    let pointWidth = width,
        pointHeight = height

    if (resize.toString().indexOf('%') == -1) {
        resize = default_options.resize
    } else {
        let resizeFactor = parseFloat(resize) / 100
        pointWidth = width * resizeFactor
        pointHeight = height * resizeFactor
    }

    switch(align) {
    case 'normal' :
        text_position = xycoordinate
        pointsize = pointsize
        break
    case 'ltr' :
        text_position = 0
        pointsize = pointWidth / text_image.length
        break
    case 'rtl' :
        text_position = 180
        pointsize = pointWidth / text_image.length
        break
    case 'ttb' :
        text_position = 90
        pointsize = pointHeight / text_image.length
        break
    case 'btt' :
        text_position = 270
        pointsize = pointHeight / text_image.length
        break
    case 'dia1' :
        text_position = Math.atan(height / width) * (180 / Math.PI) * -1
        pointsize = Math.sqrt(pointWidth * pointWidth + pointHeight * pointHeight) / text_image.length
        break
    case 'dia2' :
        text_position = Math.atan(height / width) * (180 / Math.PI)
        pointsize = Math.sqrt(pointWidth * pointWidth + pointHeight * pointHeight) / text_image.length
        break
    default :
        text_position = xycoordinate
        pointsize = pointsize
        break
    }

    let args = []
    args.push(source) // original img path
    args.push('-size')
    args.push(width + 'x' + height)
    args.push('-resize')
    args.push(resize)
    if (!ratify.isEmpty(font)) {
        args.push('-font')
        args.push(font)
    }
    args.push('-fill')
    args.push(fillColor) // color of text
    args.push('-pointsize')
    args.push(pointsize) // this needs to be calculated dynamically based on image size and length of copyright message
    args.push('-gravity')
    args.push(gravity) // alignment of text.
    args.push('-annotate')
    args.push(text_position) // text_position of text message, with respect to X-axis
    args.push(text_image) // copyright text
    args.push(output_path) // img with embedded text

    obj_return.args = args
    obj_return.output_path = output_path

    return obj_return
}

let embedTextToImage = (source, options) => new Promise((resolve, reject) => {
    let error
    // if ((arguments.length < 2) || (arguments.length === 2 && !ratify.isFunction(arguments[1])) || (arguments.length > 2 && !ratify.isFunction(arguments[2]))) {
    //     throw new Error('Invalid arguments to method embed_text_to_image')
    // } else if (arguments.length === 2 && ratify.isFunction(arguments[1])) {
    //     callback = arguments[1]
    //     options = null
    // }

    if (!source || source == '') {
        error = new Error('Specified an invalid image source')
        resolve({error:error})
    }

    // Check if file exists at the specified path
    fs.lstat(source, function (err, stats) {
        if (err || !stats.isFile()) {
            error = new Error('Image file doesn\'t exists at ' + source)
            resolve({error:error})
        } else if (!err) {

            // If options are not properly specified, use default options
            if (!options || typeof options !== 'object') {
                options = default_options
            }

            // If we reach here that means file exists
            im.identify(source, function (err, image_data) {
                if (err) {
                    error = new Error('Unable to process image file : ' + err)
                    resolve({error:error})
                }

                let obj_return = parseOptions(image_data, source, options)

                im.convert(obj_return.args, function (err) {
                    if (err) {
                        error = new Error('Error in applying text : ' + err)
                        resolve({error:error})
                    } else {
                        // fs.unlinkSync(source)
                        // //console.log('Successfully applied text. Please check it at :\n ' + obj_return.output_path)
                        resolve({error:null, image:obj_return.output_path})
                    }
                })
            })
        }
    })
    return
});

let embedText = (source, options) => new Promise((resolve, reject) => {
    let error
    if (!source || source == '') {
        error = new Error('Image file doesn\'t exists at ' + source)
        reject({error:error})
    }

    // Check if file exists at the specified path
    let stats = fs.lstatSync(source)

    if (!stats.isFile()) {
        error = new Error('Image file doesn\'t exists at ' + source)
        reject({error:error})
    }

    // If options are not properly specified, use default options
    if (!options || typeof options !== 'object') {
        options = default_options
    }

    // If we reach here that means file exists
    im.identify(source, function (err, image_data) {
        if (err) {
            error = new Error('Unable to process image file : ' + err)
            reject({error:error})
        }

        let obj_return = parseOptions(image_data, source, options)

        im.convert(obj_return.args, function (err, stdout) {
            // //console.log("============= STD +============== OUT===" + stdout)
            if(err) {
                error = new Error('Error in applying text : ' + err)
                reject({error:error})
            }else{
                resolve({error:error, image:obj_return.output_path})
            }
        })
    })
})

let joinTemplateWithQrcode = (file_name = "./template.png", qr_id_image, out_put = (new Date ()).getTime() + "_join_1.png") => new Promise((resolve, reject) => {
    // //console.log(out_put)
    let command = [
        'composite',
        '-dissolve', '100%',
        '-gravity', 'center',
        '-geometry', '-87-0',
        '-quality', 100,
        qr_id_image,
        file_name,
        out_put
    ]
    let cmd_process = exec(command.join(' '), function (err) {
        if(err == null) {
            fs.unlinkSync(qr_id_image)
        }
        //console.log(err)
    })
    cmd_process.addListener('exit', (code) => {
        if (code === 0) {
            resolve(out_put)
        } else {
            reject()
        }
    })
})

let createQr = (file_name, text) => new Promise((resolve) => {
    qr.image(text, {
        type: 'png',
        ec_level: 'L',
        size:16,
        margin:1,
        // customize
    }).pipe(
        require('fs').createWriteStream(file_name)
    )
    //console.log(file_name)
    resolve(file_name)
})

let rotateImage = (file_name, out_put, degree, remove = true) => new Promise((resolve, reject) => {
    let command = [
        'convert', file_name,
        '-rotate', degree,
        out_put
    ]
    let cmd_process = exec(command.join(' '), function (err) {
        if(err == null) {
            if(remove === true) {
                fs.unlinkSync(file_name)
            }
        }
        console.log(err)
    })
    cmd_process.addListener('exit', (code) => {
        if (code === 0) {
            resolve(out_put)
        } else {
            reject(code)
        }
    })
})

exports = module.exports = {
    embedTextToImage : embedTextToImage,
    joinTemplateWithQrcode : joinTemplateWithQrcode,
    rotateImage : rotateImage,
    createQr : createQr,
    embedText : embedText
}

/**

 * VALIDATE MIME TYPE FOR ALL FILES
 */
exports.validateAllMimeType = (files, allowed_mime_type) => {
    let result = true
    files.forEach(function (file) {
        if(allowed_mime_type.indexOf(file.mimetype) < 0) {
            result = false
            return
        }
    })

    return result
}

/**

 * VALIDATE MIME TYPE
 */
exports.validateMimeType = (file, allowed_mime_type) => {
    let result = true
    if(allowed_mime_type.indexOf(file.mimetype) < 0) {
        result = false
    }

    return result
}

/**

 * RESIZE IMAGE
 */
exports.resizeImage = (source, destination, width, height = null) => new Promise((resolve, reject) => {
    let options = {
        width: width,
        srcPath: source,
        dstPath: destination
    }

    if(height != null) {
        options.height = height
    }
    im.resize(options, function (err) {
        if(err) {
            reject(err)
        }
        resolve("success")
    })
})

/**

 * VALIDATE DIMENSION
 * [13-11-2020] Updated by Ade Eka
 */

exports.validateDimension = (file, type, width = null, height = null) => new Promise((resolve, reject) => {
    sharp(file)
        .metadata()
        .then((metadata) => {
            let result
            if (type == 'equal') {
                result = equalRule(width, height, metadata)
            } else if (type == 'min') {
                result = minRule(width, height, metadata)
            } else if (type == 'max') {
                result = maxRule(width, height, metadata)
            } else if (type == 'banner_no_event') {
                result = bannerNoEvent(width, height, metadata)
            } else if (type == 'equal_ratio') {
                result = equal_ratio(metadata)
            }
            resolve(result)

        }).catch((err) => {
            reject(err);
        })

    // im.identify(file, function (err, features) {
    //     if(err) {
    //         reject(err)
    //     }else{
    //         let result
    //         if(type == 'equal') {
    //             result = equalRule(width, height, features)
    //         }else if (type == 'min') {
    //             result = minRule(width, height, features)
    //         }else if (type == 'max') {
    //             result = maxRule(width, height, features)
    //         }else if (type == 'banner_no_event') {
    //             result = bannerNoEvent(width, height, features)
    //         }
    //         resolve(result)
    //     }
    // })
})

let equalRule = (w, h, metadata) => {
    let result = false
    if(w != null & h != null) {
        if(w == metadata.width && h == metadata.height) {
            result = true
        }
    }else if(w != null & h == null) {
        result = (w == metadata.width)
    }else if(w == null & h != null) {
        result = (h == metadata.height)
    }

    return result
}

let minRule = (w, h, metadata) => {
    let result = false
    if(w != null & h != null) {
        if(w <= metadata.width && h <= metadata.height) {
            result = true
        }
    }else if(w != null & h == null) {
        result = (w <= metadata.width)
    }else if(w == null & h != null) {
        result = (h <= metadata.height)
    }

    return result
}

let maxRule = (w, h, metadata) => {
    let result = false
    if(w != null & h != null) {
        if(w >= metadata.width && h >= metadata.height) {
            result = true
        }
    }else if(w != null & h == null) {
        result = (w >= metadata.width)
    }else if(w == null & h != null) {
        result = (h >= metadata.height)
    }

    return result
}

let bannerNoEvent = (w, h, metadata) => {
    let result = false
    if((metadata.width == w[0] || metadata.width == w[1]) && metadata.height == h ) {
        result = true
    }

    return result
}

// Get metadata from image path
// return SELECT image meta [width, height, format, mime type]
// return ALL image meta
exports.identify = (file,params=false) => new Promise((resolve, reject) => {
    im.identify(file, function (err, features) {
        if(err) {
            // reject(err)
            resolve(false)
        }

        if(features && params==false){
            resolve({
                width:features.width,
                height:features.height,
                format:features.format,
                'mime type':features["mime type"]
            })
        }

        resolve(features)
    })
})

// Get metadata from image path with sharp library
// return SELECT image meta [width, height, format]
// return ALL image meta
exports.identifySharp = (file,params=false) => new Promise((resolve, reject) => {
    sharp(file)
        .metadata()
        .then((metadata) => {
            if (metadata && params == false) {
                resolve({
                    width: metadata.width,
                    height: metadata.height,
                    format: metadata.format
                })
            }

            resolve(metadata)
        }).catch((err) => {
            resolve(false)
        })
})