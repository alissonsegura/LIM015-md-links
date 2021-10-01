// const mdLinks = require('../');

const path = require('../file_system/index.js');
// import { pathExists } from '../file_system/index.js';
//destructuring

describe('pathExists', () => {
  it('Should be a function', () => {
    expect(typeof path.pathExists).toBe('function');
  });

  it('Should return true', () => {
    expect(path.pathExists('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js')).toBeTruthy();
  });

  it('Should return false', () => {
    expect(path.pathExists('/Users/alissonsegura/Desktop/LIM015-md-links/ind.js')).toBeFalsy();
  });
});

describe('absolutePath', () => {
  it('Should be a function', () => {
    expect(typeof path.absolutePath).toBe('function');
  })

  // it('Should return absolute path', () => {
  //   expect(absolutePath('file_system/index.js')).toBe('/Users/alissonsegura/Desktop/LIM015-md-links/file_system/index.js');
  // })
})

describe('isDirectory', () => {
  it('Should be a function', () => {
    expect(typeof path.isDirectory).toBe('function');
  })
  it('Should return true for a directory', () => {
    expect(path.isDirectory('file_system')).toBeTruthy();
  });
  it('Should return false for a file', () => {
    expect(path.isDirectory('file_system/index.js')).toBeFalsy();
  });
})

describe('verifyMdFile', () => {
  it('Should be a function', () => {
    expect(typeof path.verifyMdFile).toBe('function');
  });

  it('Should return true to .md', () => {
    expect(path.verifyMdFile('file_system/Readme.md')).toBeTruthy();
  });

  it('Debería ser false para .md', () => {
    expect(path.verifyMdFile('file_system/index.js')).toBeFalsy();
  });
});

describe('readDirectory', () => {
  it('Should be a function', () => {
    expect(typeof path.readDirectory).toBe('function');
  });
  it('Should show all directories', () => {
    expect(path.readDirectory('file_system')).toEqual(['data.txt', 'index.js', 'Readme.md']);
  });
});

describe('readFile', () => {
  it('Should be a function', () => {
    expect(typeof path.readFile).toBe('function');
  });
  it('Should read file content', () => {
    expect(path.readFile('file_system/data.txt')).toBe("Hello world")
  })
});
