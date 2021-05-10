const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    content: {
        type: String,
        reqruired: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notificationSchema);