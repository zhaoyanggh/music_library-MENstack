var middlewareObj = {};
var Music = require('../models/music');
var Comment = require('../models/comment');

middlewareObj.checkMusicOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Music.findById(req.params.id,function(err, foundMusic){
			if(err){
				req.flash('error','Music not found');
				res.redirect('back');
			} else {
				if(foundMusic.author.id.equals(req.user._id)){
					next()
				} else {
          req.flash('error','You do not have permisson to do that');
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error','You need to be logged in to do that!');
    res.redirect('back');
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comments_id,function(err, foundComment){
			if(err){
        req.flash('error','Comment not found');
				res.redirect('back');
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					next();
				} else {
          req.flash('error','You do not have permisson to do that');
					res.redirect('back');
				}
			}
		});
	} else {
    req.flash('error','You need to be logged in to do that!');
    res.redirect('back');
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
  req.flash('error','You need to be logged in to do that!');
	res.redirect('/login');
}


module.exports = middlewareObj
