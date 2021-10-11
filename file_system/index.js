const { readFile, readDirectory, verifyMdFile, isDirectory, } = require('./path.js');

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

/* function that reads and validates md file  content*/
const countLinks = (file) => {
  const fileContent = readFile(file)
  if (!fileContent) return false;
  const linksInFile = regexValidation(fileContent, file)
  if (!linksInFile) return false;
  /* linksinfile contains an [{}] with href,text,file*/
  return linksInFile;
}

// const calculateStats = (links) => {
//   const totalLinks = links.length;
//   const arrayOfLinks = links.map(link => link.href)
//   const uniqueLinks = [...new Set(arrayOfLinks)]
//   /* Remove duplicate elements from the array*/
//   return `Total : ${totalLinks} , Unique : ${uniqueLinks.length}`
// };

/* end of mdLinks */

// const calculateBrokenLinks = (statusArray) => {
//   const brokenLinks = statusArray.filter(link => link.statusMessage === 'FAIL')
//   return `Broken : ${brokenLinks.length}`
// }

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

// const checkStatusCode = (url) => {
//   return new Promise((resolve) => {
//     axios.get(url)
//       .then(response => {
//         if (response.status >= 200 && response.status < 400) {
//           resolve({
//             statusCode: response.status,
//             statusMessage: response.statusText
//           })
//         }
//         resolve({
//           statusMessage: 'FAIL',
//           statusCode: response.status,
//         });
//       })
//       .catch(err => {
//         resolve({
//           statusMessage: 'NOT FOUND',
//           statusCode: err.response.status,
//           /*control the error*/
//         })
//       });
//   })

// }

module.exports = {
  getTotalLinks,
  countLinks
}