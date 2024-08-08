const { init,next,logHandler} = require("../libs/cron_config")
const req = init()
logHandler('cron_check_extended')

// How to call
// direct call from rootpath web : node cron.js cron_check
// crontab call : * * * * * /usr/bin/node /path/to/app/cron.js cron_check > path/to/file_result 2>&1
const query = async(db,queryString,{replacements={}})=>{
  try {
    return await db.getConnection().query(queryString,{ 
      type: Sequelize.QueryTypes.SELECT,
      replacements:replacements
    });
  } catch (error) {
    throw error
  }
}

const rawQuery = async(req)=>{
  let queryResult = await query(req.db,"SELECT 1=1 as summary",{})
  return queryResult
}

const callQueries = async(req)=>{
  let queryResult = await req.queries("admin").get_admin_by_email(req.db,"admin@weekendinc.com")
  return queryResult.get()
}

const callLib = async(req)=>{
  let stringGenerated = req.lib("build_string_id").createStringId(req.db,"testeroke",'article')
  return {stringGenerated}
}

const callMyConfig = ()=>{
  return myConfig
}

const runProcess = async()=>{
  console.log(await rawQuery(req))
  console.log(await callQueries(req))
  console.log(await callLib(req))
  console.log(callMyConfig())

  let sum = 1+1
  if(sum==2){
    throw new MyError('error will append to service.log',400,400)
  }
  console.log("pass the condition")
  
  return true
}

(async()=>{
  info('Starting')
  let isProcessDone = await runProcess()
  console.log({isProcessDone})
  info(`Process result : ${isProcessDone}.`)
})().catch(next)