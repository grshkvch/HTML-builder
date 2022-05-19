const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), (err) => {        // creating writable stream
    if (err) throw err
})

stdout.write('CONSOLE: Enter text to write it in text.txt\n')                    // stdout.write -- analogue for console.log
stdin.on('data', data => {                                                       // listening to data input in our console
    if (data.toString().trim() === 'exit') {                                     // data.toString() has line break at the end, that's why we need .trim() 
        stdout.write('CONSOLE: See all your lines in text.txt\nCONSOLE: Bye!')  
        process.exit()
    } else {
        writableStream.write(data)
    }
})

process.on('SIGINT', () => {                                                     // 'SIGINT' === ctrl + c
    stdout.write('CONSOLE: See all your lines in text.txt\nCONSOLE: Bye!')  
    process.exit()
})



