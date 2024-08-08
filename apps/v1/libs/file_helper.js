'use strict'

const _fs = require('fs')
const _path = require('path')

const getDirectories = path => {
    return _fs
        .readdirSync(path)
        .map(name => _path.join(path, name))
        .filter(isDirectory)
}

const isDirectory = path => {
    return _fs
        .statSync(path)
        .isDirectory()
}

const getFiles = (path, exceptions) => {
    return _fs
        .readdirSync(path)
        .filter(name => !exceptions.includes(name))
        .map(name => _path.join(path, name))
        .filter(isFile)
}

const isFile = path => {
    return _fs
        .statSync(path)
        .isFile()
}

const getFilesRecursively = (path, exceptions = []) => {
    let directories = getDirectories(path)
    let files = directories
        .map(directory => getFilesRecursively(directory)) // go through each directory
        .reduce((a, b) => a.concat(b), []) // map returns a 2d array (array of file arrays) so flatten

    return files.concat(getFiles(path, exceptions))
}

const getFileInfo = path => {
    // console.log(_fs.statSync(path))
    return _fs.statSync(path)
}

const removeFile = path => {
    return _fs.unlinkSync(path)
}

const convertSize = (byte) => {
    const units = [
        'Byte',
        'KB',
        'MB',
        'GB',
        'TB'
    ]

    let idx = 0
    while (byte > 999 && idx < 5) {
        byte = Math.round(byte * 100 / 1000) / 100
        idx++
    }

    let size = ''
    if (idx >= 0 && idx <= units.length - 1) {
        size = ' ' + units[idx]
    }
    if (byte < 0) {
        byte = 0
    }
    return byte.format(2, 3) + size
}

module.exports = {
    getFilesRecursively,
    getFileInfo,
    removeFile,
    convertSize
}