const fs = require('fs');
const path = require('path');

//let links = 0;
// const direc = '/Users/alissonsegura/Desktop/LIM015-md-links/index.js';

function countLinks(file) {
  //links++;
  // pasar un md y consolear el contenido del md
  const read = readFile(file)
  if (read) {
    console.log(read);
    //detectar cuantos links (urls)
    return
  }
}

function mdLinks(path /* , options*/) {
  const absolutePath = getAbsolutePath(path)
  const validDir = isDirectory(absolutePath)
  const validFile = verifyMdFile(absolutePath)
  if (!validDir && !validFile) {
    /* validDir and validFile are false returns log and finish it with a return */
    throw new Error
  }
  if (validFile === true) {
    const result = countLinks(path)
    return result
  }
  if (validDir === true) {
    getTotalLinks(path)
  }
  // const getFiles = (path) => {
  //   return [];
  // }

}
mdLinks('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/')
/* end of mdLinks */

// getPath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system')

// // verify if a path exists
function pathExists(userPath) {
  return fs.existsSync(userPath) ? true : false;
}

// pathExists('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')

// // verify if its an absolute path, if not it changes to an absolute
function getAbsolutePath(userPath) {
  // return path.isAbsolute(userPath) ? true : false;
  return path.isAbsolute(userPath) ? userPath : path.resolve(userPath)
}

// relativeToAbsolutePath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')
// // Verify if is a directory or file with fs.statSync().isDirectory() 
function isDirectory(userPath) {
  return fs.statSync(userPath).isDirectory() ? true : false;
}
// //Verify if is a md file with path.extname() 
function verifyMdFile(userPath) {
  return path.extname(userPath) === '.md' ? true : false;
}

// // read directory
function readDirectory(userPath) {
  return fs.readdirSync(userPath);
}

// read file content
//readFileSync returns a buffer representation en text of my file(encrypted)
function readFile(userPath) {
  return fs.readFileSync(userPath).toString();
}


function getTotalLinks(path) {
  const files = readDirectory(path)
  const route = path;
  files.forEach(file => {
    const newPath = `${route}${file}`
    const validFile = verifyMdFile(newPath);
    if (validFile) {
      countLinks(newPath);
    }
    const validDir = isDirectory(newPath)
    if (validDir) {
      getTotalLinks(`${newPath}/`)
    }

  })
}

module.exports = {
  pathExists,
  getAbsolutePath,
  isDirectory,
  verifyMdFile,
  readDirectory,
  readFile
}