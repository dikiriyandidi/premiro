let createStringId = (db, name, table, id = null, field_id = 'id') => new Promise((resolve, reject) => {
    (async () => {
        let addition = 1
        let stringid = buildStringId(name)
        let cekstring = await checkStringId(db, table, stringid)
        while (cekstring != null) {
            if (cekstring[field_id] == id) {
                break
            }
            stringid = buildStringId(name, addition)
            cekstring = await checkStringId(db, table, stringid)
            addition++
        }
        resolve(stringid)
    })()
})

let checkStringId = (db, table, string_id) => new Promise((resolve, reject) => {
    db.model(table).findOne({
        where: {
            string_id: string_id
        }
    }).then((data) => {
        resolve(data)
    }).catch(reject)
})

let buildStringId = (string_id, addition = '') => {
    string_id = ((string_id + addition).split(' ').join("-")).toLowerCase()
    string_id = (string_id.split('%').join("")).toLowerCase()
    string_id = (string_id.split('(').join("")).toLowerCase()
    string_id = (string_id.split(')').join("")).toLowerCase()
    string_id = (string_id.split('/').join("")).toLowerCase()
    string_id = (string_id.split('+').join("")).toLowerCase()
    let ret = ''
    for (let i = 0; i < string_id.length; i++) {
        if (!isNaN(string_id[i])) {
            ret += string_id[i]
        }
        if (string_id[i] == '-') {
            ret += string_id[i]
        }
        if (string_id[i] >= 'A' && string_id[i] <= 'Z') {
            ret += string_id[i]
        }
        if (string_id[i] >= 'a' && string_id[i] <= 'z') {
            ret += string_id[i]
        }
    }
    return ret.replace(/-{2,}/g, '-')
}

module.exports.createStringId = createStringId
// module.exports.buildStringId = buildStringId
// how to use:
// add : let string_id = yield req.lib("build_string_id").createStringId(req.db, req.body.title, "submission")
// edit : let string_id = yield req.lib("build_string_id").createStringId(req.db, req.body.title, "submission", 10, '')