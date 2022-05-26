// modules
const fs = require('fs');
const path = require('path');
const projectDist = path.join(__dirname, 'project-dist')

// copying assets
const assets = path.join(__dirname, 'assets')
const projectDistAssets = path.join(__dirname, 'project-dist', 'assets')

async function copyDir (src, dest) {
    fs.readdir(src, { withFileTypes: true }, (err, data) => {
        if (err) throw err;
        for (const file of data) {
            if (file.isDirectory()) {
                fs.promises.mkdir(path.join(dest, file.name), { recursive: true });
                copyDir(path.join(src, file.name), path.join(dest, file.name))
            } else {
                fs.promises.copyFile(path.join(src, file.name), path.join(dest, file.name))  
            }
        }
    })
}

//creating style.css
const stylesFolder = path.join(__dirname, 'styles');
const bundleCSS = path.join(__dirname, 'project-dist', 'style.css');
async function toBundle () {
    fs.readdir(stylesFolder, {withFileTypes: true}, (err, data) => {
        if (err) throw err
        fs.promises.writeFile(bundleCSS, '')
        for (const style of data) {
            if (style.name.endsWith('.css') && style.isFile()) {
                const readableStream = fs.createReadStream(path.join(stylesFolder, style.name))
                readableStream.on('data', chunk => {
                    fs.promises.appendFile(bundleCSS, chunk)
                })
            }
        }
    })
}

// replacing template.html, creating index.html
const components = path.join(__dirname, 'components');
async function toCreateHTML () {
    const writableStream = fs.createWriteStream(path.join(projectDist, 'index.html'), (err) => {
        if (err) throw err
    })
    const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8', (err) => {
        if (err) throw err
    })
    let template = '';
    readableStream.on('data', chunk => template += chunk)
    readableStream.on('end', () => {
        let arr = template.split('\r\n')
        
        arr.forEach((elem, ind) => {
            if (elem.indexOf('{{') !== elem.lastIndexOf('{{')) {
                arr.splice(ind + 1, 0, arr[ind].slice(arr[ind].lastIndexOf('{{')))
                arr[ind] = arr[ind].slice(0, (arr[ind].lastIndexOf('{{')))
            }
        })

        arr.forEach((elem, ind) => {
            if (elem.includes('{{')) {
                let temp = '';
                const componentReadStream = fs.createReadStream(path.join(components, `${elem.trim().slice(2, -2)}.html`), 'utf-8', (err) => {
                    if (err) throw err
                })
                componentReadStream.on('data', chunk => temp += chunk)
                componentReadStream.on('end', () => {
                    arr.splice(ind, 1, temp)
                    let j = 0
                    for (let i = ind; i < arr.length; i++) {          
                        if (arr[i].includes('{{')) {
                            j += 1
                        }
                    }
                    if (j === 0) {
                        const finalTemplate = arr.join('\r\n')
                        writableStream.write(finalTemplate)
                    } 
                })          
            }
        })
    })
}

// creating project-dist, doing all functions
async function toBuildPage () {
    await fs.promises.rm(projectDist, { recursive: true, force: true })
    await fs.promises.mkdir(projectDist, { recursive: true })
    await fs.promises.mkdir(projectDistAssets, { recursive: true })
    toBundle()
    copyDir(assets, projectDistAssets)
    toCreateHTML()
}

toBuildPage()