const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const Thing = require('../models/thing');

let defaultIdeas = require('../defaults/receiveDefaults');
let defaultThings = ['code', 'terminal', 'use', 'main'];

function createDefaultDimension(key, creator, cb){
  let newDim = new Dimension();
  newDim.key = key;
  newDim.creator = creator;
  newDim.editors.push(creator);
  newDim.content = defaultIdeas.start;
  newDim.isPrivate = true;
  for(idea in defaultIdeas){
    newDim.ideas.push(idea);
    let newIdea = new Idea();
    newIdea.kind = idea;
    newIdea.creator = creator;
    newIdea.editors.push(creator);
    newIdea.content = defaultIdeas[idea];
    newIdea.isPrivate = true;
    newIdea.dimension = key;
    newIdea.save();
  }
  defaultThings.forEach((idea) => {
    newDim.things.push(idea + newDim.thingCount);
    let newThing = new Thing();
    newThing.kind = idea;
    newThing.creator = creator;
    newThing.content = '{}';
    newThing.dimension = key;
    newThing.key = idea + newDim.thingCount;
    newDim.thingCount += 1;
    newThing.save();
  })
  newDim.save().then((newDim) => {
    cb(newDim);
  });
}

//Creating the first dimension known as Valoria
Dimension.findOne({key : "valoria"}).then((dimension) => {
  if(!dimension){
    createDefaultDimension('valoria', 'james');
  }
})

module.exports = (app) => {

  app.get('/dimension/:key', (req, res) => {
    Dimension.findOne({key : req.params.key.toLowerCase()}).then((dimension) => {
      if(!dimension){
        res.send({err : 'No dimension found'});
      }else{
        if(!dimension.content && dimension.key == 'valoria'){
          dimension.content = defaultDimension;
          dimension.save();
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

  app.post('/dimension/new', (req, res) => {
    if(req.user){
      Dimension.findOne({key : req.body.key}).then((dimension) => {
        if(dimension){
          res.send({err : "Dimension already exists!"});
        }else{
          createDefaultDimension(req.body.key, req.user.username, (newDim) => {
            res.send(newDim);
          });
        }
      })
    }
  })

}
