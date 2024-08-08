'use strict'

const { init,next,logHandler,cliArguments } = require("../libs/cron_config")
const req = init()
logHandler('cron_log_housekeeping',false)
const houseKeepingHelper = req.lib("log_housekeeping")
const cliParams = cliArguments(['file-source','destination','stored-name'])
let {
  // path or name file rootbased on folder logs
  'file-source':paramsFileSource="service.log",
  // path without close slash where the log stored on cloud
  'destination':paramsFileDestination="housekeeping/app-logs_ENV",
  // file naming stored in the cloud, replaced string ymdhis with timestamp
  'stored-name':paramsStoredName=`log-ymdhis.log`,
} = cliParams

// how to call 
// npm run app:housekeeping -- --file-source=service.log --destination=housekeeping/apps-logs_ENV --stored-name=servce-log-ymdhis.log"

// house keeping service.log (default) or file that locate on folder logs
// clear log file
// upload file to destination path
const runProcess = async()=>{
  let s3Config = req.lib("config").s3Config(myConfig,0)
  
  // file that needs to be uploaded
  // let targetFileName = "service.log"
  let targetFileName = paramsFileSource
  let ymdhis = req.lib("timehelper").formatYmdhis()
  
  // cut-of log and stored log name
  // let renamedFilename = `log-${ymdhis}.log`
  let renamedFilename = paramsStoredName.replace(/ymdhis/,ymdhis)
  // paramsFileDestination = `housekeeping/app-logs_${ENV}`
  paramsFileDestination = paramsFileDestination.replace(/ENV/,process.env.NODE_ENV)
  info(`cli params \n ${JSON.stringify({paramsFileSource,paramsFileDestination,paramsStoredName})}\n`)

  // path destination on the cloud
  let storedDestination = `${paramsFileDestination}/${renamedFilename}`
  
  let logPath = houseKeepingHelper.selectLog(targetFileName)
  // let logRenamedPath = houseKeepingHelper.selectLog(renamedFilename)

  let isExist = await houseKeepingHelper.isExist(logPath)
  info(`Use current log file \t: ${targetFileName} | ${isExist}`)
  info(`Upload as \t: ${renamedFilename}`)
  if(isExist==false){
    let message = `${logPath} is not found`
    info(message,'error')
    throw message
  }
  
  let uploadPreparation = houseKeepingHelper.uploadPreparation({
    file:logPath,
    destination:storedDestination,
    config:s3Config
  })

  info(`Uploading \t\t: ${logPath}`)
  let {
    aws_s3:awsS3Config={},
    cs_params:csParams={}
  } = uploadPreparation

  let progress = houseKeepingHelper.barVisualizer(targetFileName)

  let callbackUploader = (uploader)=>{
    houseKeepingHelper.progressListener(uploader,progress)
  }

  // clear file content as a cut-off log
  await houseKeepingHelper.emptyFile(logPath)
  info(`Emptying log files \t : ${logPath}`)

  console.time('Upload Duration')
  let location = await houseKeepingHelper.upload(awsS3Config,csParams,callbackUploader)
  progress.stop();
  console.timeEnd('Upload Duration')
  info('Uploaded log is deleted')
  
  return true
}

(async()=>{
  let startingProcess = new Date()
  info(`Starting ${startingProcess.toISOString()}`)
  let isProcessDone = await runProcess()
  let endingProcessing = new Date()
  info(`Process Done : ${isProcessDone} | ${endingProcessing.toISOString()} | ${endingProcessing-startingProcess}`)
})().catch(next)