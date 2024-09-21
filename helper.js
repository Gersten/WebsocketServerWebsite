const fs = require('fs');

// Asynchronously write data to a file
async function writeFile(data){
    // const data = 'This is the content to write into the file.';
    fs.writeFile('./settings.txt', data, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        } else {
            console.log('File written successfully!');
        }
    });
}


// Asynchronously read data from a file
async function readFile(data) {
    return fs.readFile('./settings.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading from file:', err);
        } else {
            console.log('File content:', data);
        }
    });
}
