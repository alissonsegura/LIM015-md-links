const fs = require('fs');
const path = require('path');

let links = 0;
// const direc = '/Users/alissonsegura/Desktop/LIM015-md-links/index.js';
const regexValidation = (fileContent) => {
  /* Match only links that are fully qualified with https */
  const fullLinkOnlyRegex = /^\[([\w\s\d]+)\]\((https?:\/\/[\w\d./?=#]+)\)$/
  /* Match full links and relative paths */
  const regex = /^\[([\w\s\d]+)\]\(((?:\/|https?:\/\/)[\w\d./?=#]+)\)$/
  // grab all the links of a file
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm
  //
  const singleMatch = /\[([^\[]+)\]\((.*)\)/
  const myMatch = fileContent.match(regex)
  const matches = fileContent.match(regexMdLinks)
  if (myMatch) {
    console.log(myMatch);
  } else if (matches) {
    console.log(matches);
    return matches.length
  }
}

regexValidation(`hola

[View the analytics docs](https://getanalytics.io/)

[View MD](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
`);


function countLinks(file) {
  //links++;
  // pasar un md y consolear el contenido del md
  const read = readFile(file)
  if (read) {
    console.log(read);
    const linksInFile = regexValidation(read)
    links = links + linksInFile;
    //detectar cuantos links (urls)
    // const myMatch = fileContent.match(regex)
    // console.log(myMatch)
    //const [full, text, url] = myMatch
    // console.log(text)
    // console.log(url)
    // console.log(full);
    // //const matches = fileContent.match(regexMdLinks)
    // console.log(matches, 'links')

    // for (let i = 0; i < matches.length; i++) {
    //   let text = singleMatch.exec(matches[i])
    //   console.log(`Match #${i}:`, text)
    //   console.log(`Word  #${i}: ${text[1]}`)
    //   console.log(`Link  #${i}: ${text[2]}`)
    // }
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

  return links;

}
// mdLinks('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/')
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