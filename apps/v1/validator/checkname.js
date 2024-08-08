'use stricts'
module.exports = (name, value) => {
    if (value.search(/\d/) != -1 || value.search(/[!"#$%&'()*+.,\/:;<=>?@\[\\\]^_`{|}~-]/) != -1) {
        return "name can contain alphabet and space only"
    }
    return ""
}