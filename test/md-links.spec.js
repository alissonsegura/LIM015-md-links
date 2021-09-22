// const mdLinks = require('../');

const path = require('../app.js');

describe('getPath', () => {
  it('Should be a function', () => {
    expect(typeof path.getPath).toBe('function');
  });
  // it('Should return path', () => {
  //   expect(path.getPath('/Users/alissonsegura/Desktop/LIM015-md-links/index.js')).toBe('/Users/alissonsegura/Desktop/LIM015-md-links/index.js');
  // });
});
