//Created by KayLeigh Semeraro
//19/9/2017

var mongoose = require('mongoose');
Schema = mongoose.Schema;

var userSchema = new Schema({
        username: {type: String},
        password: {type: String},
        type: String, enum: ['online', 'busy', 'invisible', 'disable'],
        contacts: {type: Array, unique: true, arrayType: String},
        email: {type: String},
        phoneNumber: {type: Number},
    },
    {
        versionKey: false
    });
module.exports = mongoose.model('User', userSchema);
