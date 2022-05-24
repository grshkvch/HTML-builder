const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const bundleCSS = path.join(__dirname, 'project-dist', 'bundle.css');

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

toBundle()