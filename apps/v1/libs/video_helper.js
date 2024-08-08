'use strict'

const { exec } = require('child_process');
const GetVideoDuration = require('get-video-duration');

// Get video duration from path
// return FLOAT value if video have duration
// return FALSE if package failed to get duration 
//    usually on webm file(s)
exports.duration = (filePath=false)=> new Promise(
  async(resolve,reject)=>{
    GetVideoDuration.default(filePath)
      .then(resolve).catch(error=>{
        console.log(error)
        resolve(false)
      })
  }
)

// Get metadata from video path
// return object with audio and video object
exports.videoMeta = (filePath=false)=> new Promise(
  async(resolve,reject)=>{
    let cmsFfprobe = `ffprobe -v quiet -print_format json -show_streams ${filePath}`;

    exec(cmsFfprobe, (error, meta, stderr) => {
      if (error || stderr)
        return resolve(false)
        meta = JSON.parse(meta)
        let metaAudio = meta.streams.filter(row=>row.codec_type=="audio")
        let metaVideo = meta.streams.filter(row=>row.codec_type=="video")

        resolve({
          audio:metaAudio,
          video:metaVideo
        })
    });

  }
)
// alias for videoMeta function
exports.identify = this.videoMeta
