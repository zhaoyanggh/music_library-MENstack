var express = require('express');
var router = express.Router();
var Music = require('../models/music');
var middleware = require('../middleware');

router.get('/musics', function(req,res){
	Music.find({},function(err, allmusics){
		if(err){
			req.flash('error','Something went wrong!');
			console.log(err);
		} else {
			res.render('musics/index', {musics:allmusics});
		}
	});
});

router.get('/musics/new', middleware.isLoggedIn, function(req, res){
	res.render('musics/new');
});

router.post('/musics/new', middleware.isLoggedIn, function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var lyrics = req.body.lyrics;
	var author = {
		id:req.user._id,
		username:req.user.username
	};
	var newSong = {name:name, image:image, lyrics:lyrics, author:author};
	// console.log(req.user);

	Music.create(newSong, function(err,newlyCreateed){
		if(err){
			req.flash('error','Something went wrong!');
			console.log(err);
		} else {
			req.flash('success','Successfully created a Song');
			// console.log(newlyCreateed);
			res.redirect('/musics');
		}
	});
});

router.get('/musics/:id', function(req, res){
	Music.findById(req.params.id).populate('comments').exec(function(err, foundMusic){
		if(err){
			req.flash('error','Something went wrong!');
			console.log(err);
		} else {
			res.render('musics/show',{music:foundMusic});
		}
	});
});

router.get('/musics/:id/edit', middleware.checkMusicOwnership, function(req, res){
	Music.findById(req.params.id,function(err,foundMusic){
		res.render('musics/edit',{music:foundMusic});
	});
});

router.put('/musics/:id', middleware.checkMusicOwnership, function(req, res){
	var data = {name:req.body.name, image:req.body.image, lyrics: req.body.lyrics};
	Music.findByIdAndUpdate(req.params.id,data, function(err, updatedMusic){
		if(err){
			req.flash('error','Something went wrong!');
			res.redirect('/musics');
		} else {
			req.flash('success','Successfully editted Song');
			res.redirect('/musics/' + req.params.id);
		}
	})
});

router.delete('/musics/:id', middleware.checkMusicOwnership, function(req, res){
	Music.findByIdAndRemove(req.params.id, function(err, music){
		if(err){
			req.flash('error','Something went wrong!');
			res.redirect('/musics');
		} else {
			req.flash('success','Successfully deleted Song');
			res.redirect('/musics');
		}
	});
});

module.exports = router;
