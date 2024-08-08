'use strict'

let validator = require("validator");
let method = Validators.prototype;

function Validators(apppath)
{
    this.apppath = apppath;
    if(fs.existsSync(apppath + '/validator'))
        this.customs = require(apppath + '/validator');
    else
        this.customs = null;
}

method.validate = function(req, name, rules){
    let err = [];
    for(let i in rules)
    {
        let obj = (req.input.get[name] || req.input.post[name] || '')+"";
        let rules_arr = rules[i].split(':');
        switch(rules_arr[0])
        {
            case 'required':
                if(obj == '')
                {
                    err.push("Field " + name + " is required.");
                }
                break;
            case 'email':
                if(!validator.isEmail(obj))
                {
                    err.push("Field " + name + " must contain valid email address.");
                }
                break;
            case 'alpha':
                if(!validator.isAlpha(obj))
                {
                    err.push("Field " + name + " may only contain alphabetical characters.");
                }
                break;
            case 'alphanumeric':
                if(!validator.isAlphanumeric(obj))
                {
                    err.push("Field " + name + " may only contain alpha-numeric characters.");
                }
                break;
            case 'numeric':
                if(!validator.isNumeric(obj))
                {
                    err.push("Field " + name + " must contain only numeric characters.");
                }
                break;
            case 'max_length':
                if(obj.length > rules_arr[1])
                {
                    err.push("Field " + name + " cannot exceed " + rules_arr[1] + " characters in length.");
                }
                break;
            case 'min_length':
                if(obj.length < rules_arr[1])
                {
                    err.push("Field " + name + " cannot less than " + rules_arr[1] + " characters in length.");
                }
                break;
            //custom validator
            default:
                if(this.customs != null)
                {
                    let func = rules_arr[0];
                    if(typeof(this.customs[func]) != 'undefined')
                    {
                        let params = [];
                        params.push(name);
                        params.push(obj);
                        rules_arr.shift();
                        params = params.concat(rules_arr);
                        let res = this.customs[func].apply(this.customs, params);
                        if(res != "")
                            err.push(res);
                    }
                }
                break;
        }

    }
    return err;
}

module.exports = Validators;