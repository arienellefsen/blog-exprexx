//App Setup
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/blog-app");

app.use(bodyParser.urlencoded({ extended: true })); // include body parser
app.use(express.static("public")); // include css file
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

//Schema Setup
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});

var Blog = mongoose.model("Blog", blogSchema);

//Restful Routes
//Index page
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

//Show Form
app.get("/blogs/news", function(req, res) {
    res.render("new");
});

//Create Post
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});

//Show all Post
app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

// Show Routes
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            res.render("show", { blog: foundBlog });
        }
    });
});

// Edit Routes
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.render("edit", { blog: foundBlog });
        }
    });
});

//Update Routes
app.put("/blogs/:id", function(req, res) {

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//Delete Routes
app.delete("/blogs/:id", function(req, res) {

    Blog.findByIdAndRemove(req.params.id, function(err, foundBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//Listen app
app.listen(3000, function() {
    console.log("Server is listening!")
});