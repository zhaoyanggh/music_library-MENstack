var mongoose = require('mongoose');
//SCHEMA SETUP

var musicSchema = new mongoose.Schema({
	name:String,
	image:String,
	lyrics:String,
	author: {
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username: String
	},
  comments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Comment'
    }
  ]
});

module.exports = mongoose.model("Music", musicSchema);
