const fs = require('fs');
const path = require('path');

let links = 0;
//const direc = '/Users/alissonsegura/Desktop/LIM015-md-links/index.js';

function mdLinks(path /* , options*/){ 
  const absolutePath = getPath(path) 
  const validDir = isaDirectory(path) 
  const validFile = verifyMdFile(path)
  if(!validDir && !validFile ){
    /* validDir and validFile are false returns log and finish it with a return */
    console.log('path does not exist');
    return
  }
  const countLinks = (file) => {
    links++;
  }
  const getFiles = (path) => {
    return [];
  }
  const getTotalLinks = (path) => {
    const files = readFile(path)
    files.forEach(file => {
      const validFile = verifyMdFile(path)
      if(validFile) {
        countLinks(file)
      }
      const validDir = isaDirectory(path)
      if(validDir){
        getTotalLinks(file)
      }
  
    })
  }
}

/* function getpath verify if the path is absolute and returns the path when true,
  if path is relative we call the function relativeToAbsolutePath to convert it to absolute
  and returns the new path */
function getPath(path) {
  let verifyAbsolutPath = absolutePath(path)
  if(verifyAbsolutPath === true){
    return path;
    /*returns absolute path*/
  }else {
    let convertingRelativeToAbsolut = relativeToAbsolutePath(path)
    return convertingRelativeToAbsolut;
     /*returns relative path convert it to absolut */
  }
}
getPath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system')

// // verify if a path exists
function pathExists(path) {
  return fs.existsSync(path) ? true : false;
}
 pathExists('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')

// // verify if its an absolute path, if not it changes to an absolute
function absolutePath(path) {
  return path.isAbsolute(path) ? true : false;
}

absolutePath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')
// // convert a relative to absolute path
function relativeToAbsolutePath(path) {
  return path.resolve(path);
}
relativeToAbsolutePath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')
// // Verify if is a directory or file with fs.statSync().isDirectory() 
function isaDirectory(path) {
  return fs.statSync(path).isDirectory() ? true : false;
}
// //Verify if is a md file with path.extname() 
function verifyMdFile(path) {
  return path.extname(path) === '.md' ? true : false;
}

// // read directory
function readDirectory(path) {
  console.log(path);
  return fs.readdirSync(path);
}

// // read file content
//readFileSync returns a buffer representation en text of my file(encrypted)
function readFile(path) {
  return fs.readFileSync(path).toString();
  }

/*------------ Prueba read direc -------------- */
// function readDirec (path) {
//   fs.readdirSync(path).forEach(file => {
//     console.log(file);
//   });
// } 
//readDirec('../test')
// /*------------ Prueba read path -------------- */

// let data = fs.readFileSync('data.txt' , 'utf8')
// console.log(data);