'use strict'

const upload = require('../../libs/upload')
const bucket_directory = 'uploads/images/article/i/'
const cs_config = {
    cs_name: myConfig.cs_name[0],
    cs_bucket_domain: myConfig.cs_bucket_domain[0],
    cs_bucket_name: myConfig.cs_bucket_name[0],
    cs_region: myConfig.cs_region[0],
    cs_access_key_id: myConfig.cs_access_key_id[0],
    cs_access_key_secret: myConfig.cs_access_key_secret[0]
}

/**
 * 
 * API For Testing Upload Files to Cloud Storage from base64 string
 */
exports.uploadCloudStorage = (req, res, next) => {
    (async () => {
        
        let base64raw = req.body.base64raw
        let filetype = req.body.filetype // image, video, others
        let allowed_mime_type = req.body.allowed_mime_type // ['application/pdf]

        let do_upload = await upload.uploadCs(base64raw, 'test_', bucket_directory, filetype, cs_config, allowed_mime_type)

        res.success(do_upload)
    })().catch(next);
}