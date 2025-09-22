const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

// passport-local-mongoose will add username and password fields to the schema
// and also some methods to the schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);
//adds username,password fields and some methods to the schema

module.exports = mongoose.model("User", UserSchema);
