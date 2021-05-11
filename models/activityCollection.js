const mongoose = require("mongoose");

const activitySchema = mongoose.Schema({
    caption: {
        type: String,
        reqruired: true
    },
    img: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model("Activity", activitySchema);