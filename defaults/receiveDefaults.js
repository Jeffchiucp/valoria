const fs = require('fs');

let defaults = {};
fs.readdir('./defaults/ideas/', (err, files) => {
  files.forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    fs.readFile('./defaults/ideas/' + file, 'utf8', (err, content) => {
      defaults[name] = content;
    })
  });
})

module.exports = defaults
