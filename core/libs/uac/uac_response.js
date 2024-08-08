'use strict'
const uacMiddleware = require("./uac_middleware")
const {
  asyncMenuActionIsAllowed
} = uacMiddleware


exports.response = (req,res,next)=>{
  res._asyncUacActionFor = async(currentPath,option=false)=>{

      let commandCollection = (option) ? option : {}
      let keys =  Object.keys(commandCollection)
      let grantBaseRule = []
      
      for(let i in keys){
        let userAction = keys[i]
        let command = commandCollection[userAction]
        command = command.filter(row=>{
          return currentPath.indexOf(row.url) > -1
        })

        for(let j in command){
          let param = {url:"",option:false,...command[j]}
          if(param.options) param.option = param.options ; delete param.options;

          let actionFromPathAllowed = res._isActionAllowFrom(param.url,param.option)
          let actionGranted = false
          if(actionFromPathAllowed){
            actionGranted = await res._canUserAction(userAction)
            if(actionGranted){
              grantBaseRule
                .push({ 
                  action:userAction,
                  path:req.originalUrl,
                  allowed:actionGranted
                })
            }
          }
        }
      }

      return {
        status:grantBaseRule.length ? true : false,
        grantBaseRule
      }
  }

  // check if current request path is match with url
  res._isActionAllowFrom = (url,option=false)=>{
      option = (option) ? option : {}
      option = {
          checkInputHasId:false,fieldId:"id",fieldValue:false,
          ...option
      }

      let {
          checkInputHasId,
          fieldId,
          fieldValue
      } = option

      let getPath = req.originalUrl
      
      let isIdHasValue = true
      let collectionCheck = []
      if(checkInputHasId){
          let inputPost = req.input.post
          isIdHasValue = (inputPost[fieldId]) ? true : false
          if(fieldValue!==false){
              isIdHasValue = (inputPost[fieldId]==fieldValue) ? true : false
          }
          collectionCheck.push(isIdHasValue)
      }
      let isUrlPass = getPath.indexOf(url) > -1 ? true : false
      collectionCheck.push(isUrlPass)

      // console.log({
      //     checkInputHasId,fieldId,fieldValue,collectionCheck
      // })
      return (isIdHasValue && isUrlPass)
  }

  res._canUserAction = async(action="",allowWhiteList=true)=>{
      let superAdminRoleId = uacMiddleware.superAdminRoleId()
      let whitelistAction = uacMiddleware.whitelistedAction()
      let getPath = req.originalUrl

      let {
          action_allowed,
          role_ids
      } = await asyncMenuActionIsAllowed(req)

      let isWhitelisted = whitelistAction.filter(row=>{
          return getPath.indexOf(row)>-1
      })

      if( allowWhiteList && isWhitelisted.length && role_ids.includes(superAdminRoleId)){
          action_allowed = uacMiddleware.whitelistActionAllowed()
          // console.log({message:"This action is response whitelisted"})
      }
      
      // console.log({
      //   allowWhiteList,action,action_allowed
      // })
      if(allowWhiteList && action ) {
          if (action == null || action == ''){
              action = 'view'
          }
      }
      
      if(Array.isArray(action)){
        let action_match = action.filter(row=>{
            return action_allowed.includes(row)
        }).length
        return (action_match) ? true : false
      }
      return action_allowed.includes(action)
  }

  res._userActionRespond = ()=>{
      console.log({
        locate:"user action response",
        path:req.originalUrl,
        message:"not allowed"
      })
      if(req.xhr){
          return res.error("Invalid access")
      }
      return res.status(403).render('403_cms', {})
  }

  next()
}

exports.renderData = async(req,data)=>{
  if(!req.session.admin_id) return data
  
  let superAdminRoleId = uacMiddleware.superAdminRoleId()
  let whitelistAction = uacMiddleware.whitelistedAction()
  let getPath = req.originalUrl

  let {
    action_allowed,
    role_ids
  } = await asyncMenuActionIsAllowed(req)

  data._canUserAction = (action="",allowWhiteList=true)=>{
    let isWhitelisted = whitelistAction.filter(row=>{
        return getPath.indexOf(row)>-1
    })

    if( allowWhiteList && isWhitelisted.length && role_ids.includes(superAdminRoleId)){
        action_allowed = uacMiddleware.whitelistActionAllowed()
        // console.log({message:"This action is render whitelisted"})
    }
    
    if(Array.isArray(action)){
      let action_match = action.filter(row=>{
          return action_allowed.includes(row)
      }).length
      return (action_match) ? true : false
    }

    return action_allowed.includes(action)
  }

  data._actionAllowed = ()=>{
      return action_allowed
  }

  return data
}