const fs = require('fs');
const path = require('path');

// // verify if a path exists
const pathExists = (userPath) => {
    return fs.existsSync(userPath) ? true : false;
}
// pathExists('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')

// // verify if its an absolute path, if not it changes to an absolute
const getAbsolutePath = (userPath) => {
    // return path.isAbsolute(userPath) ? true : false;
    return path.isAbsolute(userPath) ? userPath : path.resolve(userPath)
}
// relativeToAbsolutePath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')
// // Verify if is a directory or file with fs.statSync().isDirectory() 
const isDirectory = (userPath) => {
    return fs.statSync(userPath).isDirectory() ? true : false;
}
// //Verify if is a md file with path.extname() 
const verifyMdFile = (userPath) => {
    return path.extname(userPath) === '.md' ? true : false;
}
// // read directory
const readDirectory = (userPath) => {
    return fs.readdirSync(userPath);
}
// read file content
//readFileSync returns a buffer representation en text of my file(encrypted)
const readFile = (userPath) => {
    return fs.readFileSync(userPath).toString();
}

module.exports = {
    pathExists,
    getAbsolutePath,
    isDirectory,
    verifyMdFile,
    readDirectory,
    readFile
}