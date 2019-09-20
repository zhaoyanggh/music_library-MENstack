var express = require('express');
var router = express.Router();
var Music = require('../models/music');
var Comment = require('../models/comment');
var middleware = require('../middleware');


router.get('/musics/:id/comments/new', middleware.isLoggedIn,function(req, res){
	Music.findById(req.params.id, function(err, music){
		if(err){
			req.flash('error','Something went wrong!');
			console.log(err);
		} else {
			res.render('comments/new',{music:music});
		}
	});

});

router.post('/musics/:id/comments/new', middleware.isLoggedIn,function(req, res){
	Music.findById(req.params.id, function(err, music){
		if(err){
			console.log(err);
			req.flash('error','Something went wrong!');
			redirect('/musics');
		} else {
			var text = req.body.text;
			var author = {
				id:req.user._id,
				username:req.user.username
			};
			var newComment = {text:text, author:author};
			// console.log(newComment);
			Comment.create(newComment, function(err, comment){
				if(err){
					req.flash('error','Something went wrong!');
					console.log(err);
				} else {
					music.comments.push(comment);
					music.save();
					req.flash('success','Successfully added comment');
					res.redirect('/musics/' + music._id);
				}
			})
		}
	})
});

router.get('/musics/:id/comments/:comments_id/edit', middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comments_id, function(err, foundComment){
		if(err){
			console.log(err);
			req.flash('error','Something went wrong!');
			res.redirect('back');
		} else {
			res.render('comments/edit',{music:req.params.id, comments_id:req.params.comments_id, comment:foundComment});
		}
	});

});

router.put('/musics/:id/comments/:comments_id', middleware.checkCommentOwnership, function(req, res){
	var newComment = {text:req.body.text};
	Comment.findByIdAndUpdate(req.params.comments_id, newComment, function(err, updatedCommment){
		if(err){
			req.flash('error','Something went wrong!');
			console.log(err);
			res.redirect('back');
		} else {
			req.flash('success','Successfully editted comment');
			res.redirect('/musics/' + req.params.id);
		}
	});
});

router.delete('/musics/:id/comments/:comments_id', middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comments_id, function(err,comment){
		if(err){
			req.flash('error','Something went wrong!');
			console.log(err);
			res.redirect('/musics/' + req.params.id);
		} else {
			req.flash('success','Successfully deleted comment');
			res.redirect('/musics/' + req.params.id);
		}
	});
});


module.exports = router;
