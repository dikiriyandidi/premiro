'use strict'

/**
 * GET IMAGE DATATABLE
 */
exports.datatableImage = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT * FROM data_image) as SRC",
        'id',
        ['id', 'url','created_date'],
        req.input.post
    )
    return data
}

exports.manageImage = (db, post) => new Promise((resolve, reject) => {
    let values = {
        url: post.image,
    }

        db.model('data_image').create(values).then((data) => {
            resolve(data)
        }).catch(reject)
   
})