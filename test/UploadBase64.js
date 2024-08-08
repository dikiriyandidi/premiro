'use strict'

const fs = require('fs')
const {expect} = require('chai')
const uploadHelper = require("../apps/v1/libs/upload")
const imageHelper = require("../apps/v1/libs/image_helper")
const path = require('path');
const rootPath = (stringPath="")=>{
  return [process.cwd(),stringPath].join("/")
}
const cases = {
  base64jpg:"test/upload-base64_cases/base64_jpeg.txt",
  base64jpgExe:"test/upload-base64_cases/base64_exe_jpg.txt"
}

describe("upload base 64",async()=>{
  let removeFileAfterTest = []
  before(async()=>{

  })

  it("JPG image base64",async()=>{
    let filePath = rootPath(cases.base64jpg)
    let fileContent = fs.readFileSync(filePath)
    fileContent = fileContent.toString("utf-8")
    // fileContent = ["data:image/jpg;base64,",fileContent].join("")
    
    let image = await uploadHelper.upload(fileContent)
    let imageMeta = await imageHelper.identify(image.full_path)
    removeFileAfterTest.push(image.full_path)
    
    expect(imageMeta,"base64jpg meta").to.be.an("object")
    expect(imageMeta,"file attribute").to.have.keys(["width","height","format","mime type"])
  })
  
  it("Non media (jpeg modified to exe) base64",async()=>{
    let filePath = rootPath(cases.base64jpgExe)
    let fileContent = fs.readFileSync(filePath)
    fileContent = fileContent.toString("utf-8")
    // fileContent = ["data:image/jpg;base64,",fileContent].join("")
    
    let image = await uploadHelper.upload(fileContent)
    removeFileAfterTest.push(image.full_path)
    
    let imageMeta = await imageHelper.identify(image.full_path)
    expect(imageMeta,"base64jpgExe meta").to.equal(false)
  })

  after(async()=>{
    for(let i in removeFileAfterTest){
      let deleteFile = removeFileAfterTest[i]
      try {
        let isDeleted = fs.unlinkSync(deleteFile)
        console.log(`Generated Test file deleted : ${deleteFile}`)
      } catch (error) {
        console.log(`Failed delete : ${deleteFile} - ${error.code}`)
      }
    }
  })


})
