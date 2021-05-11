const mongoose = require("mongoose");

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

module.exports = mongoose.model("Admin", adminSchema);