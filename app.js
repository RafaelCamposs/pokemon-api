const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const UserModel = require('./model/model');

mongoose.connect(),{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./auth/auth');

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

const app = express();

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use('/', routes);

app.use('/user', passport.authenticate('jwt', {session:false}),secureRoute);

app.use(function(err,req,res,next){
    res.status(err.status || 500 );
    res.json({error:err});
});

app.listen(3030,()=>{
    console.log('Server started')
})