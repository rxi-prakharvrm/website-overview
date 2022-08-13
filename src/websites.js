const chalk = require("chalk");
const fs = require("fs");
const mysql = require("mysql");

// Creating a connection for mysql database
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "websites_overview",
});

con.connect((err) => {
  if (err) throw err;
});

// Adding a website to the list
const addWebsite = (name, url, description, genre, date) => {
  // Capitalize
  description = description.charAt(0).toUpperCase() + description.slice(1);

  // Capitalize first letter of each word of website name
  const splitName = name.split(" ");
  const splitNameCapitalize = splitName.map((a) => {
    return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
  });
  name = splitNameCapitalize.join(" ");

  // Capitalize first letter of each word of website genre
  const splitGenre = genre.split(" ");
  const splitGenreCapitalize = splitGenre.map((a) => {
    return a.charAt(0).toUpperCase() + a.slice(1).toLowerCase();
  });
  genre = splitGenreCapitalize.join(" ");

  // Lower Case
  url = url.toLowerCase();

  const websites = loadWebsites();
  const duplicateWebsite = websites.find(
    (website) => website.name.toUpperCase() === name.toUpperCase()
  );
  // console.log(duplicateWebsite);

  if (!duplicateWebsite) {
    websites.unshift({
      name,
      url,
      description,
      genre,
      date,
    });

    // Insert website data into database
    const sql = `INSERT INTO websites_overview VALUES ("${name}", "${url}", "${description}", "${genre}", "${date}")`;
    con.query(sql, (err) => {
      if (err) throw err;
      console.log(
        chalk.green("Website is added in the database successfully!")
      );
    });
    //End

    console.log(chalk.bgGreen("Website Added"));
  } else {
    console.log(chalk.red.inverse("This Website Already registered!"));
  }
  saveWebsites(websites);
};

// Removing the website form the list
const removeWebsite = (name) => {
  const websites = loadWebsites();
  const websitesToKeep = websites.filter((website) => {
    return website.name.toUpperCase() !== name.toUpperCase();
  });

  if (websites.length > websitesToKeep.length) {
    // Removing the website from the database
    const sql = `DELETE FROM websites_overview WHERE websites_overview.NAME = "${name}"`;
    con.query(sql, (err) => {
      if (err) throw err;
      console.log(
        chalk.red("Website is deleted from the database successfully!")
      );
    });

    console.log(chalk.green.inverse("Website Removed"));
    saveWebsites(websitesToKeep);
  } else {
    console.log(chalk.red.inverse("No Website found!"));
  }
};

// Lising the websites fromt the list
const listWebsites = () => {
  const websites = loadWebsites();
  var counter = 1;

  // Listing all the websites extracting from database
  const sql = `SELECT NAME, URL, GENRE FROM websites_overview`;

  con.query(sql, (err, websitesFromDatabase) => {
    if (err) throw err;
    console.log(chalk.yellow.bold("Your websites ----------"));
    websitesFromDatabase.forEach((websiteFromDatabase) => {
      console.log(
        counter++ +
          ". " +
          chalk.greenBright(websiteFromDatabase.NAME) +
          " - " +
          chalk.magenta(websiteFromDatabase.URL) +
          " - " +
          chalk.green(websiteFromDatabase.GENRE)
      );
    });
  });
};

// Searching website
const searchWebsite = (name, genre) => {
  // const websites = loadWebsites();
  console.log(name, genre);

  // Reading website from the database
  const sql = `SELECT * FROM websites_overview`;
  con.query(sql, (err, websiteInfoFromDatabase) => {
    if (err) throw err;
    const matchedWebsite = websiteInfoFromDatabase.filter(
      (webInfoFromDatabase) => {
        if (name === undefined) {
          return (
            webInfoFromDatabase.GENRE.toUpperCase() === genre.toUpperCase()
          );
        } else if (genre === undefined) {
          return webInfoFromDatabase.NAME.toUpperCase() === name.toUpperCase();
        }
      }
    );

    console.log(matchedWebsite);

    if (matchedWebsite) {
      console.log(
        chalk.yellow.bold.underline("You website details ----------")
      );
      matchedWebsite.forEach((website) => {
        console.log("Name: " + chalk.green(website.NAME));
        console.log("URL: " + chalk.green(website.URL));
        console.log("Description: " + chalk.green(website.DESCRIPTION));
        console.log("Genre: " + chalk.green(website.GENRE));
        console.log("Date: " + chalk.green(website.DATE).slice(0, 20));
        console.log("========================================");
      });
    } else {
      console.log(chalk.red.inverse("No Match Found!"));
    }
  });
};

const saveWebsites = (websites) =>
  fs.writeFileSync("websites_list.json", JSON.stringify(websites));

// Loading websites
const loadWebsites = () => {
  try {
    const websitesBuffer = fs.readFileSync("websites_list.json");
    const websitesJSON = websitesBuffer.toString();
    return JSON.parse(websitesJSON);
  } catch (err) {
    return [];
  }
};

module.exports = {
  addWebsite,
  removeWebsite,
  listWebsites,
  searchWebsite,
};
