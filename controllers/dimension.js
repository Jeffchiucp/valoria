const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const Thing = require('../models/thing');


//Creating the first dimension known as Valoria
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
        Dimension.findOne({key : "valoria"}).then((dimension) => {
          if(!dimension){
            let valoria = new Dimension();
            valoria.key = 'valoria';
            valoria.creator = 'james';
            valoria.editors.push('james');
            valoria.thingCount = 2;
            valoria.content = defaultValoria;
            valoria.isPrivate = true;
            //Create Valoria Idea
            valoria.ideas.push('valoria');
            let valoriaIdea = new Idea();
            valoriaIdea.kind = 'valoria';
            valoriaIdea.creator = 'james';
            valoriaIdea.editors.push('james');
            valoriaIdea.content = defaultValoria;
            valoriaIdea.isPrivate = true;
            valoriaIdea.dimension = 'valoria';
            valoriaIdea.save().then((valoriaIdea) => {
              //Create Square Idea
              valoria.ideas.push('square');
              let squareIdea = new Idea();
              squareIdea.kind = 'square';
              squareIdea.creator = 'james';
              squareIdea.editors.push('james');
              squareIdea.content = defaultSquare;
              squareIdea.isPrivate = true;
              squareIdea.dimension = 'valoria';
              squareIdea.save().then((squareIdea) => {
                //Create Code Idea
                valoria.ideas.push('code');
                valoria.things.push('code0');
                let codeIdea = new Idea();
                codeIdea.kind = 'code';
                codeIdea.creator = 'james';
                codeIdea.editors.push('james');
                codeIdea.content = defaultCode;
                codeIdea.isPrivate = true;
                codeIdea.dimension = 'valoria';
                codeIdea.save().then((codeIdea) => {
                  //Create code thing
                  let codeThing = new Thing();
                  codeThing.kind = 'code';
                  codeThing.key = 'code0';
                  codeThing.creator = 'james';
                  codeThing.content = `{
                    "isPrivate" : false,
                    "ideaName" : "New Thing"
                  }`;
                  codeThing.dimension = 'valoria';
                  codeThing.save().then((codeThing) => {
                    valoria.ideas.push('terminal');
                    valoria.things.push('terminal1');
                    let terminalIdea = new Idea();
                    terminalIdea.kind = 'terminal';
                    terminalIdea.creator = 'james';
                    terminalIdea.editors.push('james');
                    terminalIdea.content = defaultTerminal;
                    terminalIdea.isPrivate = true;
                    terminalIdea.dimension = 'valoria';
                    terminalIdea.save().then((terminalIdea) => {
                      let terminalThing = new Thing();
                      terminalThing.kind = 'terminal';
                      terminalThing.key = 'terminal1';
                      terminalThing.dimension = 'valoria';
                      terminalThing.save().then((terminalThing) => {
                        valoria.save();
                      })
                    })
                  })
                })
              })
            })
          }
        })
      })
    })
  })
})

module.exports = (app) => {

  app.get('/dimension/:key', (req, res) => {
    Dimension.findOne({key : req.params.key.toLowerCase()}).then((dimension) => {
      if(!dimension){
        res.send({err : 'No dimension found'});
      }else{
        if(dimension.content == '' && dimension.key == 'valoria'){
          dimension.content = defaultValoria;
        }
        res.send(dimension);
      }
    })
  })


  app.post('/dimension/:key/save', (req, res) => {
    Dimension.findOne({key : req.params.key, creator : req.user.username}).then((dimension) => {
      if(!dimension){
        res.send({err : "You cannot edit this dimension."});
      }else{
        if(
          (!dimension.isPrivate) ||
          (dimension.isPrivate && dimension.editors.includes(req.user.username))
        ){
          dimension.isPrivate = req.body.isPrivate;
          dimension.content = req.body.content;
          dimension.save().then((dimension) => {
            res.send(dimension);
          })
        }else{
          res.send({err : "You can't edit this dimension"});
        }
      }
    })
  })

}
