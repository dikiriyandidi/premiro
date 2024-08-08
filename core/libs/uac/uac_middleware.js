'use strict'

exports.whitelisted = ()=>{
  return ['', 'login', 'logout', 'change_password']
}

exports.whitelistedAction = ()=>{
  return ['/cms/setting/user_access','/cms/setting/menu']
}

exports.whitelistActionAllowed = ()=>{
  return ["add","edit","view","delete"]
}

exports.superAdminRoleId = ()=>{
  return 1
}


exports.cmsUac = async(req,res,next)=>{
  try {
    let getPath = req.originalUrl
    let path = getPath.split("/");

    let whitelist = this.whitelisted()
    let whitelistAction = this.whitelistedAction()
    let superAdminRoleId = this.superAdminRoleId();
    
    if(
      path[1].toLowerCase()!="cms"
      || whitelist.indexOf(path[2])>-1
      || !myConfig.validate_admin
    ){
      return next()
    }

    let menuActionAllowed = await this.asyncMenuActionIsAllowed(req)
    let {
      allowed_menu,
      granted_access,
      action_allowed,
      role_ids
    } = menuActionAllowed
   
    // check action authorization for rendering view
    action_allowed = action_allowed.includes("view")
    
    // whitelisted access for superadmin
    let isWhitelisted = whitelistAction.filter(row=>{
      return getPath.indexOf(row)>-1
    })
    
    if( 
      isWhitelisted.length 
      && role_ids.includes(superAdminRoleId)
      ){
        action_allowed = true; allowed_menu = true ; granted_access = true
        // console.log({message:"This action is middleware whitelisted"})

    }
    
    if (
      allowed_menu === null 
      || granted_access === false 
      || action_allowed===false) {
        res.render('403_cms', {})
        return
    }

    next()
  } catch (error) {
    console.log(error)
    throw new Error('menu validation unhandled error')
  }
}

exports.asyncMenuActionIsAllowed = (req)=> new Promise(
  async(resolve,reject)=>{
    let getPath = req.originalUrl

    let getBaseRootAccess = [
      '/cms/article/manage_image',
    ]
    let accessRelated = {
        '/cms/article/manage_image':"/cms/article/upload_image",
    }

    let allowed_menu = await req.queries('admin').getAllowedMenu(req.db, req.session.admin_id)
    let admin_role = (req.session.admin_id) ? await req.queries('admin').getRoleIds(req.db, req.session.admin_id) : []

    let role_ids = admin_role.map(row=>row.role_id)
    
    let granted_access = allowed_menu.some(function (element) {
      let matchIndex = getPath.indexOf(element.role_menu.menu.link) >= 0
      return matchIndex
    })

    // some functions use first segmented url others use second segment
    // cms/article/upload_image but post to manage data use cms/article base url 
    // granted related base url based on accessRelated and getBaseRootAccess
    // it's for mapped action only    
    let match_menu = this._allowedPath(getPath,allowed_menu)
    if(match_menu.length>1 && req.xhr==false){
      match_menu = this._pathSegmentTolerance(getPath,match_menu)
    }

    if(req.xhr){
      let root_access_granted = await this._asycnGrantRootAccess(req,getPath,{
        need_base_root_access:getBaseRootAccess,
        access_related:accessRelated
      })
      match_menu = [...match_menu,...root_access_granted]
    }

    match_menu = match_menu.map(row=>row.id)
    let action_allowed = (match_menu.length) ? await req.queries('admin').getMenuActionByRoleId(req.db,role_ids,match_menu) : []
    action_allowed = action_allowed.map(row=>row.action_type)
    resolve({
      path:getPath,
      allowed_menu: allowed_menu || [],
      granted_access: granted_access || [],
      action_allowed: (action_allowed.length) ? action_allowed : [],
      role_ids:(role_ids.length) ? role_ids : []
    })
  }
)

exports._allowedPath = (curentPath,allowed_menu=[])=>{
  let match_menu = []
  allowed_menu.map(element=>{
      // let matchIndex = curentPath.indexOf(element.role_menu.menu.link) >= 0

      let link = element.role_menu.menu.link
      let matchIndex = link
        .split('/')
        .every(segment => {
          return curentPath
            .split('/')
            .includes(segment)
        })

      if(matchIndex){
          match_menu.push(element.role_menu.menu)
      }
  })
  return match_menu
}

exports._pathSegmentTolerance = (curentPath,match_menu)=>{
  // console.log({curentPath,match_menu})
  // http://localhost:2008/cms/ugc_moderation/judges/
  let matchMenuFiltered = this._matchOnSelectedSegment(curentPath,match_menu,3,3)
  if(matchMenuFiltered.length==0){
    // http://localhost:2008/cms/ugc_moderation/cimpliance
    matchMenuFiltered = this._matchOnSelectedSegment(curentPath,match_menu,3,4)
  }
  return matchMenuFiltered
}

exports._matchOnSelectedSegment = (currentPath,match_menu,matchIndex=3,getPathSegment=3)=>{
  let match_path = currentPath
  if(currentPath.match(/\//g).length>matchIndex){
      let new_match_path = currentPath.split("/")
      new_match_path = new_match_path.slice(0,getPathSegment)
      match_path = new_match_path.join("/")
  }

  return match_menu.filter(row=>{
    return row.link==match_path
  })
}

exports._asycnGrantRootAccess = async(req,currentPath="",option={})=>{
  let {
    need_base_root_access:baseRootWhitelist=[],
    access_related:accessRelated=[]
  } = option

  let get_base_root_access = baseRootWhitelist.filter(row=>{
    return currentPath.indexOf(row)>=0;
  })

  let menu_index_ids = []
  if(get_base_root_access.length){
      let access_related_base = get_base_root_access.map(row=>{
          return accessRelated[row]
      })
      menu_index_ids = await req.queries("admin").get_menu_by_link(req.db,access_related_base)
  }
  return menu_index_ids
}