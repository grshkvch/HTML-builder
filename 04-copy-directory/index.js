const fs = require('fs');
const path = require('path');
const files = path.join(__dirname, 'files')
const filesCopy = path.join(__dirname, 'files-copy')

async function createFolder () {
    await fs.promises.mkdir(filesCopy, { recursive: true })
}

async function copyDir () {
    fs.readdir(files, { withFileTypes: true }, (err, data) => {
        if (err) throw err;
        for (const file of data) {
            fs.promises.copyFile(path.join(files, file.name), path.join(filesCopy, file.name))  
        }
    })
}

async function removePreviousFolder () {
    await fs.promises.rm(filesCopy, { recursive: true, force: true })
    createFolder()
    copyDir()
}

removePreviousFolder()