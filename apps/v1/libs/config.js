
exports.s3Config = (myConfig,getIndex=-1)=>{
  try {
    let configLabel = ['cs_name','cs_bucket_domain','cs_bucket_name','cs_region','cs_access_key_id','cs_access_key_secret'];
    let buildConfig = [];
    let defaultConfig = {};
  
    configLabel.map(function(key){
      let currentConfig = myConfig[key];
      defaultConfig[key] = "";
      currentConfig.map(function(configRow,configIndex){
        if(typeof buildConfig[configIndex]=="undefined") buildConfig[configIndex] = {}
        buildConfig[configIndex][key] = configRow
      })
      return key;
    })
  
    if(getIndex==-1){
      return buildConfig
    }
  
    return buildConfig[getIndex] || defaultConfig;
    
  } catch (error) {
    throw error;
  }
}