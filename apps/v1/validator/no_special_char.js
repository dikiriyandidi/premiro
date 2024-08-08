'use stricts'
module.exports = (name, value) => {
    if (value.search(/[!"#$%&'()*+,\:;<=>?@\[\\\]^`{|}~]/) != -1) {
        return name + " can contain alphabet, space , -, /"
    }
    return ""
}