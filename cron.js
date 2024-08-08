'use strict';

require('dotenv').config();
const fs = require('fs')
const path = require('path')
const basepath = 'apps/v1'

if(process.argv.length > 0){
    let file = __dirname + "/" + basepath + '/cron/' + process.argv[2]
    if(fs.existsSync(path.normalize( file )) || fs.existsSync(path.normalize( file + ".js" )))
        require(file)
    else
        console.log("There's no file " + file + " or " + file + ".js")
}
else
    console.log("There's no parameter.")