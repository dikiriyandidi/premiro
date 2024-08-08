'use strict'
let op = Sequelize.Op;
/**

 * GET ARTICLE DATATABLE
 */
exports.datatable = async (db, req) => {
    let data = await req.lib('general').getDataPaging(
        db,
        "(SELECT id, string_id, title, is_highlight, publishdate, view_count, status FROM article where status not like 'Trash') as SRC",
        'id',
        ['id', 'string_id', 'title' , 'is_highlight', 'publishdate', 'view_count', 'status'],
        req.input.post
    )
    return data
}

/**

 * GET ARTICLE DETAIL
 */
exports.getArticleByStringId = (db, string_id) => new Promise((resolve, reject) => {

    db.model('article').findOne({
        where: {
            string_id: string_id
        },
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

exports.getArticleById = (db, id) => new Promise((resolve, reject) => {
    db.model('article').findOne({
        where: {
            id: id
        },
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

/**

 * SAVE TO DATABASE
 */
exports.manage = (db, post) => new Promise((resolve, reject) => {
    let values = {
        title: post.title,
        content: post.content,
        preview_content: post.preview_content,
        type: post.type,
        is_highlight: post.is_highlight,
        publishdate: post.publishdate,
        status: post.status
    }

    if(post.id == null || post.id == '') {
        values.string_id = post.string_id
        values.featured_image = post.featured_image
        values.video_file = post.video_file
        values.video_cover = post.video_cover

        db.model('article').create(values).then((data) => {
            resolve(data)
        }).catch(reject)
    }else{
        if(post.featured_image !== '') {
            values.featured_image = post.featured_image
        }

        if(post.video_file !== '') {
            values.video_file = post.video_file
        }

        if(post.video_cover !== '') {
            values.video_cover = post.video_cover
        }

        db.model('article').update(values, {
            where: {id: post.id}
        }).then((data) => {
            resolve(data)
        }).catch(reject)
    }
})

/**

 * UPDATE STATUS TO TRASH
 */
exports.destroy = (db, id) => new Promise((resolve, reject) => {
    db.model('article').update({
        status: 'Trash'
    }, {
        where: {id: id}
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})


