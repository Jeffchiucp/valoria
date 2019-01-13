const express = require('express');
const app = express();
const Gun = require('gun');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
require('dotenv').config();
require('gun/lib/bye')

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/valoria', { useNewUrlParser: true });

//App Setting
app.set('views', './client/components')
app.set('view engine', 'pug');
app.use(Gun.serve).use(express.static(__dirname));
app.use(express.static('client'))
app.use('/client/components', express.static(__dirname + '/client/components'));
app.use(express.json());
app.use(cookieParser());

//Check that a user is logged in
let checkAuth = function (req, res, next) {
  if (typeof req.cookies.userToken === 'undefined' || req.cookies.userToken === null) {
    req.user = null;
  } else {
    // if the user has a JWT cookie, decode it and set the user
    var token = req.cookies.userToken;
    var decodedToken = jwt.decode(token, { complete: true }) || {};
    req.user = decodedToken.payload;
  }
  next();
}
app.use(checkAuth);


app.get('/', (req, res) => {
  if(req.user){
    User.findById(req.user.id).then((user) => {
      if(!user){
        res.clearCookie('userToken');
      }else{
        res.render('main', {currentUser : req.user})
      }
    })
  }else{
    res.clearCookie('userToken');
    res.render('main');
  }

})

//Controllers
require('./controllers/user.js')(app);
require('./controllers/dimension.js')(app);
require('./controllers/idea.js')(app);
require('./controllers/thing.js')(app);

let server = app.listen(process.env.PORT || '3000');
let gun = Gun({
  file: 'data.json', // local testing and development
  s3: {
    key: process.env.AWS_ACCESS_KEY_ID, // AWS Access Key
    secret: process.env.AWS_SECRET_ACCESS_KEY, // AWS Secret Token
    bucket: process.env.AWS_S3_BUCKET // The bucket you want to save into
  },
  web: server
});
