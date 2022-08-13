// Requiring packages and files
const path = require("path");
const express = require("express");
const mysql = require("mysql");
const websites = require("./websites");

// Creating express app and setting the port
const app = express();
const port = process.env.PORT || 3000;

// Setting up the path for public directory, views and partials
const publicDirectoryPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
// const partialsPath = path.join(__dirname, "../templates/views/partials");

// Setting up the view engine and views path and registering the partialsPath
app.set("view engine", "ejs");
app.set("views", viewsPath);
// app.set("partials", partialsPath);

// Using express static public direcotry
app.use(express.static(publicDirectoryPath));

// Creating a date variable for mysql
var date = new Date().toLocaleDateString();
var splitDate = date.split("/");
var reverseSplitDate = splitDate.reverse();
date = reverseSplitDate.join("-");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "websites_overview",
});

// Website home path
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("index");
});

// Website add path
app.get("/add", (req, res) => {
  // console.log(req.query);
  if (Object.keys(req.query).length !== 0) {
    websites.addWebsite(
      req.query.websiteName,
      req.query.websiteUrl,
      req.query.websiteDescription,
      req.query.websiteGenre,
      date
    );
  }
  res.render("add", {
    success: "Added Successfully!",
    failure: "Something Went Wrong!",
  });
});

// Website remove path
app.get("/remove", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    websites.removeWebsite(req.query.websiteName);
  }

  res.render("remove");
});

// Website search path
var websiteName = "";
var websiteUrl = "";
var websiteDescription = "";
var websiteGenre = "";

app.get("/search", (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    websites.searchWebsite(req.query.websiteName);
  }

  const searchQuery = `SELECT * FROM websites_overview WHERE NAME="${req.query.websiteName}"`;

  // console.log(req.query.websiteName);

  con.query(searchQuery, (err, data) => {
    if (err) throw err;
    console.log(data);
    // websiteName = data[0].NAME;
    // websiteUrl = data[0].URL;
    // websiteDescription = data[0].DESCRIPTION;
    // websiteGenre = data[0].GENRE;
    // console.log(websiteData);
  });

  res.render("search", {
    websiteName,
    websiteUrl,
    websiteDescription,
    websiteGenre,
  });
});

// List Route
var websiteData = [];

con.query(
  `SELECT NAME, URL, DESCRIPTION, GENRE FROM websites_overview`,
  (err, data) => {
    if (err) throw err;
    data.forEach((item) => {
      websiteData.push({
        websiteName: item.NAME,
        websiteUrl: item.URL,
        websiteDescription: item.DESCRIPTION,
        websiteGenre: item.GENRE,
      });
    });
    // console.log(websiteData);
  }
);

app.get("/list", (req, res) => {
  // websites.listWebsites();

  res.render("list", {
    websiteData,
  });
});

// Setting up the listener
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
