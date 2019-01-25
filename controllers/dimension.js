const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const Thing = require('../models/thing');

let Defaults = require('../defaults/receiveDefaults');
let defaultIdeas = Defaults.defaults;
let defaultThings = ['code', 'terminal', 'menu'];
let mainIdeas = Defaults.mainIdeas;
let mainThings = ['dev'];
let devIdeas = Defaults.devIdeas;
let devThings = ['main'];

function createDefaultDimension(key, creator, background, cb){
  let newDim = new Dimension();
  newDim.key = key;
  newDim.creator = creator;
  newDim.editors.push(creator);
  newDim.content = defaultIdeas.start;
  newDim.isPrivate = true;
  if(background){
    newDim.background = background;
  }

  for(idea in defaultIdeas){
    newDim.ideas.push(idea);
    newDim.defaultIdeas.push(idea);
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
    newThing.dimension = key;
    newThing.key = idea + newDim.thingCount;
    newDim.thingCount += 1;
    newThing.save();
  })
  newDim.save().then((newDim) => {
    if(cb){
      cb(newDim);
    }
  });
}

//Creating the first dimension known as Valoria
Dimension.findOne({key : "valoria"}).then((dimension) => {
  if(!dimension){

    //Create Valoria Main
    createDefaultDimension('valoria', 'james', '../defaults/valoria-bg.gif', (main) => {
      for(idea in mainIdeas){
        main.ideas.push(idea);
        main.defaultIdeas.push(idea);
        let newIdea = new Idea();
        newIdea.kind = idea;
        newIdea.creator = 'james';
        newIdea.editors.push('james');
        newIdea.content = mainIdeas[idea];
        newIdea.isPrivate = true;
        newIdea.dimension = 'valoria';
        newIdea.save();
      }
      mainThings.forEach((idea) => {
        main.things.push(idea + main.thingCount);
        let newThing = new Thing();
        newThing.kind = idea;
        newThing.creator = 'james';
        newThing.dimension = 'valoria';
        newThing.key = idea + main.thingCount;
        main.thingCount += 1;
        newThing.save();
      })
      main.save();
    });

    //Create Valoria Dev
    createDefaultDimension('valoria-dev', 'james', 'https://i.imgur.com/TbwEvfU.png', (dev) => {
      for(idea in devIdeas){
        dev.ideas.push(idea);
        dev.defaultIdeas.push(idea);
        let newIdea = new Idea();
        newIdea.kind = idea;
        newIdea.creator = 'james';
        newIdea.editors.push('james');
        newIdea.content = devIdeas[idea];
        newIdea.isPrivate = true;
        newIdea.dimension = 'valoria-dev';
        newIdea.save();
      }
      devThings.forEach((idea) => {
        dev.things.push(idea + dev.thingCount);
        let newThing = new Thing();
        newThing.kind = idea;
        newThing.creator = 'james';
        newThing.dimension = 'valoria-dev';
        newThing.key = idea + dev.thingCount;
        dev.thingCount += 1;
        newThing.save();
      })
      dev.save();
    });
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
