'use strict'

exports.index = (req, res, next) => {
    try {
        const currentTime = new Date()
        const files = req
            .lib('file_helper')
            .getFilesRecursively(myConfig.log_path, myConfig.log_exceptions)
            .filter(file => {
                // console.log(file)

                let { mtime } = req.lib('file_helper').getFileInfo(file)
                // console.log(mtime)

                let { date: diffDate } = req.lib('timehelper').diffDate(mtime, currentTime)
                // console.log(diffDate)

                if (req.query.backdate) {
                    return diffDate > req.query.backdate
                } else {
                    return true
                }
            })
            .map(file => {
                let { mtime, size } = req.lib('file_helper').getFileInfo(file)

                mtime = req.lib('timehelper').formatYmdHis(mtime)
                size = req.lib('file_helper').convertSize(size)
                // console.log(mtime)
                // console.log(size)

                return {
                    file,
                    mtime,
                    size
                }
            })
        // console.log(files)

        res.success(files)
    } catch (error) {
        // console.log(error)
        next({
            message: 'Something went wrong!'
        })
    }
}