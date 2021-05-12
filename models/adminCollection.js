const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const adminSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        reqruired: true
    },
    password: {
        type: String,
        reqruired: true
    }
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);