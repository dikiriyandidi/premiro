'use strict';

exports.generateFile = (token_log_id,type,value) => {
    // token_log_id = id generate from token_log
    // type = request/response
    // value = json request or json response

    //check `service_log` folder in /logs 
        //if not exist create one

    if (!fs.existsSync('./logs/service_log/')){
        fs.mkdirSync('./logs/service_log/');
    }

    if (!fs.existsSync('./logs/service_log/'+type)){
        fs.mkdirSync('./logs/service_log/'+type);
    }

    //check file today already exist or no
        //if not exist create one
    const currentDate = new Date().toISOString().replace('-', '').split('T')[0].replace('-', '');

    const file_path = './logs/service_log/'+type+'/'+currentDate;
    
    //1st time create file
    if(!fs.existsSync(file_path)){
        fs.writeFile(file_path, token_log_id+ "|"+ value+"\r\n", (err) => {
            if (err) throw err;
        }); 
        return;
    }

    //append file 
    fs.appendFile(file_path,token_log_id+ "|"+ value+"\r\n",(err)=>{
        if (err) throw err;
    });

}