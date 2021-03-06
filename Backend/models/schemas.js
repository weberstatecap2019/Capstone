const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

let userSchema = new Schema({
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    }
  });

  userSchema.statics.authenticate = function(username, password, callback){
    this.findOne({username: username }).exec(function(err, user){
      if(err) return callback(err);
      if(!user) return callback("Invalid username");
  
      bcrypt.compare(password, user.password, function(err, result){
        if(result) return callback(null, user);
        else return callback("Invalid password")
      })
    });
  }
  
  userSchema.pre('save', function(next){
    let user = this;
    bcrypt.hash(user.password, 10, function(err, hash){
      if(err) return next(err);
  
      user.password = hash;
      next();
    });
  });

  let jobsSchema = new Schema ({
    title: {type: String, required: "Title is required.", 
        minlength: [20, "Title is too short; must be at least 20 characters long."]},
    company_name: {type: String, required: true},
    pay:{type: String, required: true},
    posted_at: Date,
    updated_at: Date,
    body: {type: String, required: true}
})

jobsSchema.pre('save', function(next){
    if(this.isNew){
        this.posted_at = new Date();
        this.updated_at = new Date();
    }else{
        this.updated_at = new Date();
    }

    next();
});

let commentSchema = new Schema ({
    user: String,
    body: String,
    posted_at: Date
});

commentSchema.pre('save', function(next){
    if(this.isNew){
        this.posted_at = new Date();
    }

    next();
});

let postForumSchema = new Schema ({
    title: {type: String, required: "Title is required.", 
        minlength: [20, "Title is too short; must be at least 20 characters long."]},
    author: {type: String, required: true},
    summary:{type: String, required: true},
    posted_at: Date,
    updated_at: Date,
    body: {type: String, required: true},
    comments: [commentSchema]
})

postSchema.pre('save', function(next){
    if(this.isNew){
        this.posted_at = new Date();
        this.updated_at = new Date();
    }else{
        this.updated_at = new Date();
    }

    next();
});

module.exports.Jobs = mongoose.model("Jobs", userSchema);
module.exports.User = mongoose.model("User", userSchema);
module.exports.PostForum = mongoose.model("PostForum", postForumSchema);