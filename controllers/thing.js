const Thing = require('../models/thing');
const Idea = require('../models/idea');
const Dimension = require('../models/dimension');

module.exports = (app) => {

  app.post('/dimension/:key/thing/new', (req, res) => {
    Dimension.findOne({key : req.params.key}).then((dimension) => {
      if(!dimension){
        res.send({err : "Dimension does not exist"});
      }else{
        let newThing = new Thing();
        newThing.kind = req.body.kind;
        newThing.content = JSON.stringify(req.body.content);
        newThing.key = req.body.kind + dimension.thingCount;
        newThing.creator = req.user.username;
        newThing.dimension = dimension.key;
        newThing.save().then((newThing) => {
          dimension.things.push(newThing.key);
          dimension.thingCount += 1;
          dimension.save().then((dimension) => {
            res.send(newThing);
          })
        })
      }
    })
  })

  app.get('/dimension/:key/thing/:thingKey', (req, res) => {
    Dimension.findOne({key : req.params.key}).then((dimension) => {
      if(!dimension){
        res.send({err : "Dimension does not exist"});
      }else{
        Thing.findOne({dimension : req.params.key, key : req.params.thingKey}).then((thing) => {
          if(!thing && req.params.thingKey == 'code0'){
            let codeThing = new Thing();
            codeThing.kind = 'code';
            codeThing.key = 'code0';
            codeThing.creator = 'james';
            codeThing.dimension = 'valoria';
            codeThing.save().then((codeThing) => {
              dimension.things.push(codeThing.key);
              dimension.save().then(() => {
                res.send(codeThing)
              })
            })
          }else if(!thing){
            res.send({err : "Thing does not exist"})
          }else{
            res.send(thing);
          }
        })
      }
    })
  })

  //Saving content to a thing
  app.post('/dimension/:key/thing/:thingKey/save', (req, res) => {
    Dimension.findOne({key : req.params.key}).then((dimension) => {
      if(!dimension){
        res.send({err : "Dimension does not exist!"});
      }else{
        Thing.findOne({dimension : req.params.key, key : req.params.thingKey}).then((thing) => {
          if(!thing){
            res.send({err : "Thing does not exist!"});
          }else{
            thing.content = JSON.stringify(req.body.content);
            thing.save().then((thing) => {
              res.send(thing);
            });
          }
        })
      }
    })
  });

  app.post('/dimension/:key/thing/:thingKey/delete', (req, res) => {
    Dimension.findOneAndDelete({key : req.params.key}).then((dimension) => {
      if(!dimension){
        res.send({err : "Dimension does not exist!"})
      }else{
        Thing.findOne({key : req.params.thingKey, dimension : req.params.dimension}).then((thing) => {
          if(!thing){
            res.send({err : "Thing does not exist!"});
          }else{
            res.send("Deleted the thing");
          }
        });
      }
    });
  });


}
