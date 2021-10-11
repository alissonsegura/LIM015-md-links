const { getAbsolutePath, isDirectory, verifyMdFile } = require('./file_system/path.js')

const { countLinks, getTotalLinks, } = require('./file_system/index.js')

const axios = require('axios').default;
// Axios is a Javascript library used to make HTTP requests from node.js

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

const calculateStats = (links) => {
    const totalLinks = links.length;
    const arrayOfLinks = links.map(link => link.href)
    const uniqueLinks = [...new Set(arrayOfLinks)]
    //console.log(uniqueLinks, 'unique');
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


mdLinks('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/lib/test.md', { stats: true, validate: true })
    .then(response => {
        console.log(response);
    }).catch(error => {
        console.log(error.message);
    })

const calculateBrokenLinks = (statusArray) => {
    const errors = ['NOT FOUND', 'FAIL']
    const brokenLinks = statusArray.filter(link => errors.includes(link.statusMessage))
    return `Broken : ${brokenLinks.length}`
}

module.exports = {
    mdLinks,
    calculateStats,
    calculateBrokenLinks,
    checkStatusCode
}