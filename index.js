const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
// Axios is a Javascript library used to make HTTP requests from node.js

let links = [];
const direc = '/Users/alissonsegura/Desktop/LIM015-md-links/file_system';

const regexValidation = (fileContent, file) => {
  /* Match only links that are fully qualified with https */
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm
  const regexUrl = /(\(https?:\/\/.*\))/gm
  const regexTitle = /\[([^\[]+)\]/gm
  //const singleMatch = /\[([^\[]+)\]\((.*)\)/
  const matches = fileContent.match(regexMdLinks)
  if (!matches) return false;

  const items = matches.map(item => {
    const url = item.match(regexUrl);
    const href = removeCharacters(url[0], '(', ')')
    const title = item.match(regexTitle)
    const text = removeCharacters(title[0], '[', ']')

    return {
      href,
      text,
      file
    }
  })
  return items;

}

const removeCharacters = (data, firstC, secondC) => {
  let text = data.replace(firstC, '');
  text = text.replace(secondC, '');
  return text;
}

// regexValidation(`hola
// [View the analytics docs](https://getanalytics.io/)
// [View MD](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)`);


function countLinks(file) {
  const fileContent = readFile(file)
  if (!fileContent) return false;
  const linksInFile = regexValidation(fileContent, file)
  if (!linksInFile) return false;
  return linksInFile;
}

function mdLinks(path /* , options*/) {
  const absolutePath = getAbsolutePath(path)
  const validDir = isDirectory(absolutePath)
  const validFile = verifyMdFile(absolutePath)
  if (!validDir && !validFile) {
    /* validDir and validFile are false returns log and finish it with a return */
    throw new Error
  }
  if (validFile) {
    const fileLinks = countLinks(path);
    return fileLinks || null;
  }
  if (validDir) {
    const fileLinks = getTotalLinks(path)
    return fileLinks || null;
  }
}
// const data = mdLinks('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/')
// console.log('Data', data)
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
      const linksInFile = countLinks(newPath);
      if (linksInFile) links = [...links, ...linksInFile];
    }
    const validDir = isDirectory(newPath)
    if (validDir) {
      getTotalLinks(`${newPath}/`)
    }

  })
  return links;
}

function checkStatusCode(url) {
  return new Promise((resolve, reject) => {
    // Aqui tienes que revisar el status code de la URL 
    axios.get(url)
      .then(response => {
        if (response.status >= 200 && response.status < 400) {
          resolve({
            statusCode: response.status,
            statusMessage: response.statusText
          })
        }
        resolve({
          statusMessage: 'FAIL',
          statusCode: response.status,
        });
      })
      .catch(err => {
        resolve({
          statusMessage: 'NOT FOUND',
          statusCode: err.response.status,
        })
      });
  })

}
// console.log(response);
// console.log(response.status);
// console.log(response.statusText);

checkStatusCode('https://nodejs.dev/learn/reading-files-with-nodejs')
  .then(response => {
    console.log('Response', response)
  })

module.exports = {
  pathExists,
  getAbsolutePath,
  isDirectory,
  verifyMdFile,
  readDirectory,
  readFile
}