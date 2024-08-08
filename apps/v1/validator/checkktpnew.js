'use stricts'
const timehelper = require("../libs/timehelper.js")

let getNumberOfDays = (year, month) => {
    var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
    return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}

module.exports = (name, value) => {
    let ktp = value
    ktp = ktp.split("")

    let current_date = new Date()
    let current_year = current_date.getFullYear()
    current_year = current_year.toString()
    current_year = current_year.slice(2, 4)

    let day = ktp[6] + ktp[7]
    let month = ktp[8] + ktp[9]
    let year = ktp[10] + ktp[11]

    if (current_year > parseInt(year)) {
        year = "20" + year
    } else {
        year = "19" + year
    }

    let date = year + "-" + month + '-' + day

    date = timehelper.formatYmdStart(date)

    age = timehelper.getAge(date)


    let total_day = getNumberOfDays(parseInt(year), parseInt(month))

    if (day > 31) {
        day = day - 40
    }

    if (day < 0 || day > total_day) {
        return "Format KTP Salah"
    }

    if (month > 12 || month < 1) {
        return "Format KTP Salah"
    }

    if (age <= 17) {
        return "Umur di bawah 17 tahun"
    }

    return ""
}