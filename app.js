var express = require('express');
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local');
var User = require('./models/user');
var flash = require('connect-flash');
var commentRoutes = require('./routes/comments'),
		musicRoutes = require('./routes/musics'),
		indexRoutes = require('./routes/index')

require('dotenv').config();
app.use(flash());
app.use(methodOverride("_method"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use(require('express-session')({
	secret: process.env.SECRET,
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
})

app.use(indexRoutes);
app.use(musicRoutes);
app.use(commentRoutes);

mongoose.connect('mongodb+srv://zybu:' + process.env.PASSWORD + '@cluster0-q8uy8.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
}).then(()=>{
	console.log("connect to DB!");
}). catch(err => {
	console.log('ERROR:', err.message);
});

app.listen(3000,function(){
	console.log('Server is listening...');
})
