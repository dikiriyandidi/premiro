'use stricts'
module.exports = (name, value) => {
    if (value.search(/\d/) == -1) {
        return name + " must contain at least 9 characters, 1 lowercase, 1 uppercase, 1 special character, and 1 number (0–9)."// (!@#$%^&*)
    }else if (value.search(/[a-z]/) == -1) {
        return name + " must contain at least 9 characters, 1 lowercase, 1 uppercase, 1 special character, and 1 number (0–9)."// (!@#$%^&*)
    }else if (value.search(/[A-Z]/) == -1) {
        return name + " must contain at least 9 characters, 1 lowercase, 1 uppercase, 1 special character, and 1 number (0–9)."// (!@#$%^&*)
    }else if (value.search(/[!"#$%&'()*+.,\/:;<=>?@\[\\\]^_`{|}~-]/) == -1) {
        return name + " must contain at least 9 characters, 1 lowercase, 1 uppercase, 1 special character, and 1 number (0–9)."// (!@#$%^&*)
    }else if (value.length < 9) {
        return name + " must contain at least 9 characters, 1 lowercase, 1 uppercase, 1 special character, and 1 number (0–9)."// (!@#$%^&*)
    }
    return "";
}