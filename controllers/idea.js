const Idea = require('../models/idea');
const Dimension = require('../models/dimension');

const fs = require('fs');
let defaultValoria;
let defaultCode;

fs.readFile('./defaults/valoria.txt', 'utf8', (err, content) => {
  defaultValoria = content;
  fs.readFile('./defaults/code.txt', 'utf8', (err, content) => {
    defaultCode = content;
  })
})

module.exports = (app) => {

  app.post('/dimension/:key/idea/:kind/save', (req, res) => {
    Dimension.findOne({key : req.params.key}).then((dimension) => {
      if(!dimension){
        res.send({err : "Dimension does not exist!"});
      }else{
        Idea.findOne({kind : req.params.kind, dimension : req.params.key}).then((idea) => {
          if(!idea){
            res.send({err : "Idea does not exist!"});
          }else{
            idea.content = req.body.content;
            idea.save().then((idea) => {
              res.send(idea);
            })
          }
        })
      }
    })
  });

  app.post('/dimension/:key/idea/new', (req, res) => {
    Dimension.findOne({key : req.params.key}).then((dimension) => {
      if(!dimension){
        res.send({err : "Dimension does not exist"});
      }else{
        Idea.findOne({key : req.body.kind, dimension : req.params.key}).then((idea) => {
          if(idea){
            res.send({err : "Idea already exists"});
          }else{
            let newIdea = new Idea();
            newIdea.kind = req.body.kind;
            newIdea.content = req.body.content;
            newIdea.dimension = req.params.key;
            dimension.ideas.push(req.body.kind);
            newIdea.save().then((newIdea) => {
              dimension.save().then(() => {
                res.send(newIdea);
              })
            })
          }
        })
      }
    })
  })


  app.get('/dimension/:key/idea/:kind', (req, res) => {
    Idea.findOne({kind : req.params.kind, dimension : req.params.key}).then((idea) => {
      if(idea){
        //Retrieve Default Code if shit hits the fan
        if(!idea.content){
          if(idea.kind == 'valoria'){
            idea.content = defaultValoria;
          }else if(idea.kind == 'code'){
            idea.content = defaultCode;
          }
          idea.save();
        }
        res.send(idea);
      }else{
        res.send({err : "Idea does not exist in this dimension"})
      }
    })
  })

}
