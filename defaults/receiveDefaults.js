const fs = require('fs');

let defaults = {};
let devIdeas = {};
let mainIdeas = {};

fs.readdir('./defaults/ideas/', (err, files) => {
  files.forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    fs.readFile('./defaults/ideas/' + file, 'utf8', (err, content) => {
      defaults[name] = content;
    })
  });
})

fs.readdir('./defaults/valoria/main/', (err, files) => {
  files.forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    fs.readFile('./defaults/valoria/main/' + file, 'utf8', (err, content) => {
      mainIdeas[name] = content;
    })
  });
})

fs.readdir('./defaults/valoria/dev/', (err, files) => {
  files.forEach(file => {
    let name = file.substr(0, file.indexOf('.'));
    fs.readFile('./defaults/valoria/dev/' + file, 'utf8', (err, content) => {
      devIdeas[name] = content;
    })
  });
})



module.exports = {
  defaults, mainIdeas, devIdeas
}
