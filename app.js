const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Notification = require("./models/notificationCollection");
const Admin = require("./models/adminCollection");
const Image = require("./models/activityCollection");

const app = express();
const port = 3000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => console.log("Database connection is successful."))
    .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

app.get("/", (req, res) => {
    const getNotification = async () => {
        try {
            notifications = await Notification.find();
            res.render("index", { notifications });
        } catch (err) {
            console.log(err);
        }
    };
    getNotification();
});

app.get("/facultyList", (req, res) => res.render("facultyList"));

app.get("/activities", (req, res) => {
    const getActivities = async () => {
        try {
            const activities = await Image.find();
            res.render("activities", { activities })
        } catch (err) {
            console.log(err);
            res.redirect("/");
        }
    };
    getActivities();
});

app.get("/notifications", (req, res) => {
    const getNotification = async () => {
        try {
            const notifications = await Notification.find();
            res.render("notifications", { notifications });
        } catch (err) {
            console.log(err);
        }
    };
    getNotification();
});

//ADMIN ROUTES
app.get("/adminSignUp", (req, res) => res.render("adminSignUp"));

app.get("/adminManage", (req, res) => res.render("manage"));

// Notification Management route for Admin
app.get("/adminManageNotifications", (req, res) => {
    const getNotification = async () => {
        try {
            const notifications = await Notification.find();
            res.render("manageNotifications", { notifications });
        } catch (err) {
            console.log(err);
        }
    };
    getNotification();
});

// Shows the form to add a new notification
app.get("/adminManageNotifications/new", (req, res) => res.render("addNotification"));

// Adding notification to the database
app.post("/adminManageNotifications", (req, res) => {
    const createNotification = async () => {
        try {
            const notification = {
                content: req.body.content
            };
            const result = await Notification.insertMany([notification]);
            res.redirect("/adminManageNotifications");
        } catch (err) {
            console.log(err);
            res.redirect("/adminManageNotifications");
        }
    };
    createNotification();
});

// Delete a particular notification from database
app.post("/adminManageNotifications/:id", async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    await notification.remove();
    res.redirect("/adminManageNotifications");
});

// Activity Management route for Admin
app.get("/adminManageActivities", (req, res) => {
    const getActivities = async () => {
        try {
            const activities = await Image.find();
            res.render("manageActivities", { activities })
        } catch (err) {
            console.log(err);
            res.redirect("/");
        }
    };
    getActivities();
});

// Adding activity to the database
app.post("/adminManageActivities", upload.single('image'), (req, res, next) => {
    const createImage = async () => {
        try {
            var image = {
                caption: req.body.caption,
                img: {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                    contentType: 'image/png'
                }
            };
            const result = await Image.insertMany([image]);
            res.redirect("/adminManageActivities");
        } catch (err) {
            console.log(err);
            res.redirect("/adminManageActivities");
        }
    };
    createImage();
});

// Deleting a particular activity from the database
app.post("/adminManageActivities/:id", async (req, res) => {
    const activity = await Image.findById(req.params.id);
    await activity.remove();
    res.redirect("/adminManageActivities");
});

app.listen(port, () => console.log(`Sevrer is listening at port ${port}...`));