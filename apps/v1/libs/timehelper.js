'use strict'

exports.createTimestamp = (date = new Date()) => {
    let date_new = new Date(parseInt(date.substr(6)))
    return date_new
}

exports.createDateTime = (date = new Date()) => {
    let date_new = (new Date()).getTime()
    if(date != undefined) {
        date_new = (new Date (date)).getTime()
    }
    date_new += 7 * 60 * 60 * 1000
    let epoch_format = "/Date(" + date_new + "+0700)/"
    return epoch_format
}

exports.createDateTimeBulk = (date = new Date()) => {
    let date_new = (new Date()).getTime()
    if(date != undefined) {
        date_new = (new Date (date)).getTime()
    }
    date_new -= 24 * 60 * 60 * 1000
    let epoch_format = "/Date(" + date_new + "+0700)/"
    return epoch_format
}

let formatDate = (date = new Date()) => {
    let d = new Date(date)
    if(isNaN(d.getTime())) {
        return 'Not Set'
    }else{
        let month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        let day = date.getDate()
        let month_index = date.getMonth()
        let year = date.getFullYear()
        return day + ' ' + month_name[month_index] + ' ' + year
    }
}

let formatYmdHis = (date = new Date()) => {
    let dformat = ''
    let d = new Date(date)
    if(Object.prototype.toString.call(d) === "[object Date]") {
        if(isNaN(d.getTime())) {
            dformat = 'Not Set'
        }else{
            dformat = [
                d.getFullYear(),
                (d.getMonth() + 1).padLeft(),
                d.getDate().padLeft()
            ].join('-') + ' ' +
            [
                d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()
            ].join(':')
        }
    }else{
        dformat = 'Not Set'
    }
    return dformat
}

let formatHis = (date = new Date()) => {
    let dformat = ''
    let d = new Date(date)
    if(Object.prototype.toString.call(d) === "[object Date]") {
        if(isNaN(d.getTime())) {
            dformat = 'Not Set'
        }else{
            dformat =
            [
                d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()
            ].join(':')
        }
    }else{
        dformat = 'Not Set'
    }
    return dformat
}


let formatDateTime = (date = new Date()) => {
    let month_name = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let day = date.getDate()
    let d = new Date(date)
    let month_index = date.getMonth()
    let year = date.getFullYear()
    return day.padLeft() + ' ' + month_name[month_index] + ' ' + year + ' ' +
    [
        d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft()
    ].join(':')
}

Number.prototype.padLeft = function (base, chr) {
    let len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

let formatYmdhis = (date = new Date()) => {
    let d = new Date(date)
    let dformat = [
        d.getFullYear(),
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft()
    ].join('') +
    [
        d.getHours().padLeft(),
        d.getMinutes().padLeft(),
        d.getSeconds().padLeft()
    ].join('')
    return dformat
}

let formatYmdhi = (date = new Date()) => {
    let d = new Date(date)
    let dformat = [
        d.getFullYear(),
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft()
    ].join('') +
    [
        d.getHours().padLeft(),
        d.getMinutes().padLeft()/* ,
        d.getSeconds().padLeft() */
    ].join('')
    return dformat
}

let formatYmd = (date = new Date()) => {
    let dformat = ''
    let d = new Date(date)
    if(Object.prototype.toString.call(d) === "[object Date]") {
        if(isNaN(d.getTime())) {
            dformat = '00000000'
        }else{
            dformat = [
                d.getFullYear(),
                (d.getMonth() + 1).padLeft(),
                d.getDate().padLeft()
            ].join('')
        }
    }else{
        dformat = '00000000'
    }
    return dformat
}
let formatYmdStart = (date = new Date()) => {
    let d = new Date(date)
    let dformat = [
        d.getFullYear(),
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft()
    ].join('-') + " 00:00:00"
    return dformat
}
let formatYmdCustom = (date, custom) => {
    let d = new Date(date)
    let dformat = [
        d.getFullYear(),
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft()
    ].join('-')
    return dformat
}
let formatYmdEnd = (date = new Date()) => {
    let d = new Date(date)
    let dformat = [
        d.getFullYear(),
        (d.getMonth() + 1).padLeft(),
        d.getDate().padLeft()
    ].join('-') + " 23:59:59"
    return dformat
}

let formatYmdDash = (date = new Date()) => {
    let dformat = ''
    let d = new Date(date)
    if(Object.prototype.toString.call(d) === "[object Date]") {
        if(isNaN(d.getTime())) {
            dformat = 'Not Set'
        }else{
            dformat = [
                d.getFullYear(),
                (d.getMonth() + 1).padLeft(),
                d.getDate().padLeft()
            ].join('-')
        }
    }else{
        dformat = 'Not Set'
    }
    return dformat
}

let getDate = (date, days_before, state = 'start') => {
    if(Object.prototype.toString.call(date) === "[object Date]") {
        if(isNaN(date.getTime())) {
            date = new Date()
            date = date.setDate(date.getDate() - days_before)
            if(state == 'start') {
                date = formatYmdStart(date)
            }else{
                date = formatYmdEnd(date)
            }
        }else {
            date = date.setDate(date.getDate())
            if(state == 'start') {
                date = formatYmdStart(date)
            }else{
                date = formatYmdEnd(date)
            }
        }
    }else {
        date = new Date()
        date = date.setDate(date.getDate() - days_before)
        if(state == 'start') {
            date = formatYmdStart(date)
        }else{
            date = formatYmdEnd(date)
        }
    }
    return date
}

let getAge = (date) => { // birthday is a date
    let birthday = new Date(date)
    let ageDifMs = Date.now() - birthday.getTime()
    let ageDate = new Date(ageDifMs) // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)
}

let getYear = (date) => { // birthday is a date
    return Math.abs(date.getUTCFullYear())
}

let diffDate = (start, end) => {
    let date1 = new Date()
    if(start != '') {
        date1 = new Date(start)
    }
    let date2 = new Date()
    if(end != '') {
        date2 = new Date(end)
    }
    let timeDiff = /* Math.abs( */date2.getTime() - date1.getTime()/* ) */
    let diffYear = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365.25))
    let diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
    let difhour = Math.ceil(timeDiff / (1000 * 60 * 60))
    let difmin = Math.ceil(timeDiff / (1000 * 60))
    if(difmin < 45) {
        difhour = 0
    }
    return {date:diffDays, hour:difhour, minute:difmin, year:diffYear/* , startdate:date1, enddate:date2 */}
}

const subtractDay = (date, days) => {
    return new Date(date.setDate(date.getDate() - days))
}

exports.formatDate = formatDate
exports.formatYmdHis = formatYmdHis
exports.formatDateTime = formatDateTime
exports.formatYmdhis = formatYmdhis
exports.formatYmdStart = formatYmdStart
exports.formatYmdEnd = formatYmdEnd
exports.formatYmd = formatYmd
exports.formatYmdhi = formatYmdhi
exports.formatYmdDash = formatYmdDash
exports.formatHis = formatHis
exports.getYear = getYear
exports.getDate = getDate
exports.getAge = getAge
exports.diffDate = diffDate
exports.formatYmdCustom = formatYmdCustom
exports.subtractDay = subtractDay