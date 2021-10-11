const fs = require('fs');
const path = require('path');
const axios = require('axios').default;
// Axios is a Javascript library used to make HTTP requests from node.js

let links = [];
// const direc = '/Users/alissonsegura/Desktop/LIM015-md-links/file_system';

const regexValidation = (fileContent, file) => {
  const regexMdLinks = /\[([^\[]+)\](\(.*\))/gm
  /* reads md file */
  const regexUrl = /(\(https?:\/\/.*\))/gm
  /* Match only links that are https */
  const regexTitle = /\[([^\[]+)\]/gm
  //const singleMatch = /\[([^\[]+)\]\((.*)\)/
  const matches = fileContent.match(regexMdLinks)
  if (!matches) return false;

  const items = matches.map(item => {
    /* item is each value read in the file */
    const url = item.match(regexUrl);
    const href = removeCharacters(url[0], '(', ')');
    /* removes () in every link http o https */
    const title = item.match(regexTitle)
    const text = removeCharacters(title[0], '[', ']');
    /* removes [] in the text found in a file*/
    return {
      href,
      text,
      file
    }
  })
  return items;

}
/* function that takes the data and removes ()[]  */
const removeCharacters = (data, firstC, secondC) => {
  let text = data.replace(firstC, '');
  text = text.replace(secondC, '');
  return text;
}

// regexValidation(`hola
// [View the analytics docs](https://getanalytics.io/)
// [View MD](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)`);

/* function that reads and validates md file  content*/
function countLinks(file) {
  const fileContent = readFile(file)
  if (!fileContent) return false;
  const linksInFile = regexValidation(fileContent, file)
  if (!linksInFile) return false;
  /* linksinfile contains an [{}] with href,text,file*/
  return linksInFile;
}

const calculateStats = (links) => {
  const totalLinks = links.length;
  const arrayOfLinks = links.map(link => link.href)
  const uniqueLinks = [...new Set(arrayOfLinks)]
  /* Remove duplicate elements from the array*/
  return `Total : ${totalLinks} , Unique : ${uniqueLinks.length}`
};

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    const absolutePath = getAbsolutePath(path)
    const validDir = isDirectory(absolutePath)
    const validFile = verifyMdFile(absolutePath)
    let fileLinks = []
    if (!validDir && !validFile) {
      throw new Error
    }
    if (validFile) {
      fileLinks = countLinks(path);
    }
    if (validDir) {
      fileLinks = getTotalLinks(path)
    }

    // if user wants to get ONLY the stats 
    if (options.stats && !options.validate) {
      resolve(calculateStats(fileLinks))
    }

    const filePromises = fileLinks.map(file => {
      return checkStatusCode(file.href)
      //returns a promise
    })

    Promise.all(filePromises)
      /* Promise all receives an array and waits for all promises to complete */
      .then(statusArray => {
        if (options.validate && options.stats) {
          return Promise.all([calculateStats(fileLinks), calculateBrokenLinks(statusArray)]).then(el => resolve(el.join(', ')))
        }
        const files = fileLinks.map((item, index) => {
          if (options.validate === true) {
            return {
              ...item,
              ...statusArray[index]
            }
          }
          else {
            return {
              ...item
            }
          }
        })
        resolve(files);

      }).catch(error => {
        reject(error.message);
      })
  })
}


mdLinks('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/hello/hola.md', { stats: true, validate: true })
  .then(response => {
    console.log(response, 'response');
  })

/* end of mdLinks */



const calculateBrokenLinks = (statusArray) => {
  const brokenLinks = statusArray.filter(link => link.statusMessage === 'FAIL')
  return `Broken : ${brokenLinks.length}`
}

// getPath('/Users/alissonsegura/Desktop/LIM015-md-links/file_system')

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


const getTotalLinks = (path) => {
  const route = path /* directory path*/
  const files = readDirectory(path)
  files.forEach(file => {
    const newPath = `${route}${file}`
    /*concat the path + file name*/
    const validFile = verifyMdFile(newPath);
    if (validFile) {
      const linksInFile = countLinks(newPath);
      if (linksInFile) { /*links = [...links, ...linksInFile];*/
        links = [...links, ...linksInFile];
      }
    }
    const validDir = isDirectory(newPath)
    if (validDir) {
      getTotalLinks(`${newPath}/`)
      /* we call our function and pass the new path */
    }

  })
  return links;
}

const checkStatusCode = (url) => {
  return new Promise((resolve) => {
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
          /*control the error*/
        })
      });
  })

}
// checkStatusCode('https://nodejs.dev/learn/reading-files-with-nodejs')
//   .then(response => {
//     console.log('Response', response)
//   })

module.exports = {
  pathExists,
  getAbsolutePath,
  isDirectory,
  verifyMdFile,
  readDirectory,
  readFile
}