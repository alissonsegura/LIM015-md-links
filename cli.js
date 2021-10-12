const { mdLinks } = require('./mdlinks.js')

const args = process.argv.slice(2);

/* console.log(process.argv, 'processarg');*/

const options = {
    validate: false,
    stats: false
};

let path = args[0];

args.forEach((arg) => {
    if (arg === '--validate') options.validate = true;
    if (arg === '--stats') options.stats = true;
})

//0 = path

if (args.length === 0) {
    console.log('Insert a path, example: md-links ./some/example\n');
}
/*  */
// if only insert path
// 0
if (args.length) {
    /* shoud return href,text,file path */
    mdLinks(path, options)
        .then(response => console.log(response))
        // .then(resp => resp.map(values => console.log(` Path: ${values.file}\n Link: ${values.href}\n Status: ${values.status}\n StatusText: ${values.message}\n Text: ${values.text}\n`)))
        .catch(err => console.log('Error: ', err.message))
}
