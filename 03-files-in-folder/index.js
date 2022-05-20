const fs = require('fs');
const path = require('path');
const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, {withFileTypes: true}, (err, data) => {                                    // reading folder and getting array with dirint objects
    if (err) throw err                                                                              
    for (file of data) {                                                                            // looping through every dirint obj
        if (file.isFile()) {                                                                        // if dirint === file, starting work with it
            const filePath = path.join(secretFolder, file.name);
            const fileExtention = path.extname(filePath);
            const fileName = path.basename(filePath, fileExtention);
            fs.stat(filePath, (err, stats) => {                                                     // getting stats object with all info about file
                if (err) throw err
                const sizeKB = (stats.size / 1024).toFixed(3);
                console.log(`${fileName} - ${fileExtention.slice(1)} - ${sizeKB}kb`);
            }) 
        }
    }
})