'use stricts'
const fs = require("fs");
const ENV = process.env.NODE_ENV || 'development'
/*
   - Validate email is disposable or not
   - Disposable list location is in "assets/assets/json/disposable.json"
*/

module.exports = (name, value) => {
    let message = ""

    if(myConfig.disposable_email){
        // Get content from file
        let disposable_json = fs.readFileSync("assets/assets/json/disposable.json");

        // Define to JSON type
        let disposable_list = JSON.parse(disposable_json);

        let email_domain = value.split('@');
        email_domain = email_domain[1];
        //check if email_domain is one of disposable email
        if(disposable_list.indexOf(email_domain) > 0){
            message = "Email not valid";
        }
    }
    
    return message
}