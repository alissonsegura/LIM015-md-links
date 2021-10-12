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

// getTotalLinks('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/')
module.exports = {
  getTotalLinks,
  countLinks
}