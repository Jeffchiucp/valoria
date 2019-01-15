const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const Thing = require('../models/thing');

const fs = require('fs');
let defaultValoria;
let defaultCode;
let defaultSquare;
let defaultTerminal;

fs.readFile('./defaults/valoria.txt', 'utf8', (err, content) => {
  defaultValoria = content;
  fs.readFile('./defaults/code.txt', 'utf8', (err, content) => {
    defaultCode = content;
    fs.readFile('./defaults/square.txt', 'utf8', (err, content) => {
      defaultSquare = content;
      fs.readFile('./defaults/terminal.txt', 'utf8', (err, content) => {
        defaultTerminal = content;
      })
    })
  })
})

module.exports = (app) => {

  app.get('/dimension/:key', (req, res) => {
    Dimension.findOne({key : req.params.key.toLowerCase()}).then((dimension) => {
      //Create main valorian dimension with code idea and thing
      if(!dimension && req.params.key.toLowerCase() == 'valoria'){
        let valoria = new Dimension();
        valoria.key = 'valoria';
        valoria.creator = 'james';
        valoria.thingCount = 2;
        valoria.content = defaultValoria;
        //Create Valoria Idea
        valoria.ideas.push('valoria');
        let valoriaIdea = new Idea();
        valoriaIdea.kind = 'valoria';
        valoriaIdea.creator = 'james';
        valoriaIdea.content = defaultValoria;
        valoriaIdea.dimension = 'valoria';
        valoriaIdea.save().then((valoriaIdea) => {
          //Create Square Idea
          valoria.ideas.push('square');
          let squareIdea = new Idea();
          squareIdea.kind = 'square';
          squareIdea.creator = 'james';
          squareIdea.content = defaultSquare;
          squareIdea.dimension = 'valoria';
          squareIdea.save().then((squareIdea) => {
            //Create Code Idea
            valoria.ideas.push('code');
            valoria.things.push('code0');
            let codeIdea = new Idea();
            codeIdea.kind = 'code';
            codeIdea.creator = 'james';
            codeIdea.content = defaultCode;
            codeIdea.dimension = 'valoria';
            codeIdea.save().then((codeIdea) => {
              //Create code thing
              let codeThing = new Thing();
              codeThing.kind = 'code';
              codeThing.key = 'code0';
              codeThing.creator = 'james';
              codeThing.content = 'New Thing';
              codeThing.dimension = 'valoria';
              codeThing.save().then((codeThing) => {
                valoria.ideas.push('terminal');
                valoria.things.push('terminal1');
                let terminalIdea = new Idea();
                terminalIdea.kind = 'terminal';
                terminalIdea.creator = 'james';
                terminalIdea.content = defaultTerminal;
                terminalIdea.dimension = 'valoria';
                terminalIdea.save().then((terminalIdea) => {
                  let terminalThing = new Thing();
                  terminalThing.kind = 'terminal';
                  terminalThing.key = 'terminal1';
                  terminalThing.dimension = 'valoria';
                  terminalThing.save().then((terminalThing) => {
                    valoria.save().then((valoria) => {
                      res.send(valoriaIdea.content);
                    })
                  })
                })
              })
            })
          })
        })
      }else{
        if(!dimension){
          res.send({err : 'No dimension found'});
        }else{
          if(dimension.content == '' && dimension.key == 'valoria'){
            dimension.content = defaultValoria;
          }
          res.send(dimension);
        }
      }
    })
  })


  app.post('/dimension/:key/save', (req, res) => {
    Dimension.findOne({key : req.params.key, creator : req.user.username}).then((dimension) => {
      if(!dimension){
        res.send({err : "You cannot edit this dimension."});
      }else{
        dimension.content = req.body.content;
        dimension.save().then((dimension) => {
          res.send(dimension);
        })
      }
    })
  })

}
