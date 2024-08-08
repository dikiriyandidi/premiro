'use stricts'
module.exports = (name, value, dob, gender) => {
    let dktp = value[6] + value[7]
    let mktp = value[8] + value[9]
    let yktp = value[10] + value[11]
    let genderktp = "M"
    if(parseInt(dktp) > 40) {
        genderktp = "F"
        dktp = dktp - 40
    }
    if(dktp < 10) {
        dktp = "0" + parseInt(dktp)
    }
    let byear = 19
    if(parseInt(yktp) < 20) {
        byear = 20
    }

    let dob_ktp = byear + yktp + "-" + mktp + "-" + dktp
    if(dob != 'null' && dob_ktp != dob) {
        return "Invalid KTP Number"
    }else if(gender != 'null' && genderktp != gender) {
        return "Invalid KTP Number"
    }else{
        if(parseInt(dktp) > 31 || parseInt(dktp) < 1 || parseInt(mktp) < 1 || parseInt(mktp) > 12) {
            return "Invalid KTP Number"
        }
    }
    return ""
}