const mongoose = require('mongoose');
const UserAccount = mongoose.model('UserAccount', { 
    name: String,
    email: String,
    interests: String
});

module.exports = UserAccount;