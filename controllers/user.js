const User = require('../models/user');
const Dimension = require('../models/dimension');
const jwt = require('jsonwebtoken');

const fs = require('fs');
let defaultDimension;
fs.readFile('./defaults/dimension.txt', 'utf8', (err, content) => {
  defaultDimension = content;
});

module.exports = (app) => {

  app.post('/register', (req, res) => {
    User.findOne({username : req.body.username.toLowerCase()}).then((user) => {
      if(user){
        res.send({err : "User Already Exists"});
      }else{
        let newUser = new User;
        newUser.username = req.body.username.toLowerCase();
        newUser.password = newUser.generateHash(req.body.password);
        newUser.save((err, user) => {
          // generate a JWT for this user from the user's id and the secret key
          let userData = {
            id: user._id,
            username : user.username,
            currentDimension : user.currentDimension
          }
          let token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "60 days"});
          res.cookie('userToken', token);
          res.redirect('/')
        });
      }
    })
  });

  app.post('/login', (req, res) => {
    User.findOne({username : req.body.username.toLowerCase()}).then((user) => {
      if(!user){
        res.send({err : "Username does not exist" });
      }
      else if(!user.validPassword(req.body.password)){
        res.send({err : "Incorrect Password" });
      }else{
        // generate a JWT for this user from the user's id and the secret key
        let userData = {
          id: user._id,
          username : user.username,
          currentDimension : user.currentDimension
        }
        let token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: "60 days"});
        res.cookie('userToken', token);
        res.redirect('/')
      }
    })
  });

  app.get('/logout', (req, res) => {
    res.clearCookie('userToken');
    res.send();
  })

  app.get('/user/current_dimension', (req, res) => {
    User.findOne({
      _id : req.user.id,
      current_dimension : req.user.current_dimension
    }).then((user) => {
      if(!user){
        res.send({err : "You can't load this dimension"});
      }else{
        Dimension.findOne({key : req.user.currentDimension}).then((dimension) => {
          if(!dimension){
            res.send({err : "Dimension not found"});
          }else{
            if(!dimension.content && dimension.key == 'valoria'){
              dimension.content = defaultDimension;
              dimension.save();
            }
            res.send(dimension);
          }
        })
      }
    })
  })

}
