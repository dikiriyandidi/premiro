'use strict';
const childProcess = require("child_process")
const path = require('path')
const fs = require('fs')
const AWS = require('aws-sdk')
const cliProgress = require('cli-progress');

exports.selectLog = (pathToLog) => {
  return path.resolve(`logs/${pathToLog}`)
}

exports.uploadPreparation = (option={})=>{
  let {
    file:fileSourcePath="",
    destination:pathS3Location="",
    config:s3Config={}
  } = (option) ? option : {}

  let {
    cs_bucket_name:csBucketName,
    cs_access_key_id:csAccessKeyId="",
    cs_access_key_secret:csAccessKeySecret="",
    cs_region:csRegion=""
  } = s3Config

  return {
    aws_s3:new AWS.S3({
      accessKeyId: csAccessKeyId,
      secretAccessKey: csAccessKeySecret,
      region: csRegion,
    }),
    cs_params:{
      Bucket:csBucketName,
      Key:pathS3Location,
      Body:fs.readFileSync(fileSourcePath)
    }
  }
}

exports.barVisualizer = (filename)=>{
  const bar = new cliProgress.Bar({
    format: `Uploading [{bar}] | {filename} |{percentage}%\n`
  });
  bar.start(100, 0, { speed: "N/A" ,filename:filename});
  return bar
}

exports.progressListener = (uploader,progressVisualizer)=>{
  uploader.on('httpUploadProgress', function(evt) {
    let percentage = parseInt((evt.loaded * 100) / evt.total)
    
    if(progressVisualizer) progressVisualizer.update(percentage);

  })
}

exports.upload = (aws_s3, params,callback=false) => new Promise((resolve, reject) => {
  let uploader = aws_s3
  .upload(params, function (err, data) {
      if (err) {
          reject(err)
          return
      }
      console.log(`\nFile uploaded successfully. ${data.Location}`);
      resolve(data.Location)
  })

  if(callback){ callback(uploader) }
})

exports.moveFile = async (sourceFile,targetFile)=>{
  return fs.renameSync(sourceFile,targetFile)
}

exports.isExist = async (sourceFile)=>{
  return fs.existsSync(sourceFile)
}

exports.removeFile = async (sourcePath,callback=()=>{})=>{
  return fs.unlink(sourcePath,callback)
}

exports.emptyFile = async (sourcePath)=>{
  return fs.writeFileSync(sourcePath,'')
}

exports.readFile = async (sourcePath)=>{
  return fs.readFileSync(sourcePath,{encoding: "utf8",flag: "r"})
}

exports.run = async (stringCommand,argumentsCommand=[],callback=false,silent=true)=>{
  try {
    let child = childProcess.exec(stringCommand,argumentsCommand)
    let scriptOutput = ""
    if(silent==false && callback){
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', function(data) {
          //Here is where the output goes
          console.log('stdout: ' + data);
          data=data.toString();
          scriptOutput+=data;
      });
  
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', function(data) {
          //Here is where the error output goes
          console.log('stderr: ' + data);
          data=data.toString();
          scriptOutput+=data;
      });
  
      child.on('close', function(code) {
          //Here you can get the exit code of the script
          console.log('closing code: ' + code);
          console.log('Full output of script: ',scriptOutput);
          if(callback) callback(scriptOutput,code)
      });
    }
    return scriptOutput
  } catch (error) {
    throw error
  }
}