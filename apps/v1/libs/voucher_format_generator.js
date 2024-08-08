exports.generateVoucher = () => {
    let date = new Date();

    let date_data = date.getDate();
    let month = date.getMonth();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    if (date_data < 10) {
        date_data = "0" + date_data
    }
    if (month < 10) {
        month = "0" + month
    }
    if (hour < 10) {
        hour = "0" + hour
    }
    if (minute < 10) {
        minute = "0" + minute
    }
    if (second < 10) {
        second = "0" + second
    }

    let random_text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"; //text to randomize
    let length = 10; //text length

    for (var i = 0; i < length; i++)
        random_text += possible.charAt(Math.floor(Math.random() * possible.length));

    let code = random_text
    // let code = date_data + "" + month + "" + String(date.getFullYear()).substring(2, 4) + "" + hour + "" + minute+""+second+""+random_text
    
    return code
}