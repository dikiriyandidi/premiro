'use strict'

let method = CustomValidator.prototype;

// method.constructor = CustomValidator;
function CustomValidator()
{
    let excludes = ['index.js','.env'];
    let files = fs.readdirSync(__dirname);
    for(let i in files)
    {
        if(excludes.indexOf(files[i]) < 0)
        {
            let names = files[i].split(".");
            let new_name = '';
            for(let j=0; j<names.length - 1 ; j++)
            {
                new_name += names[j];
                if(j<names.length - 2)
                    new_name += ".";
            }
            method[new_name] = require('./' + new_name);
        }
    }
}

module.exports = new CustomValidator();