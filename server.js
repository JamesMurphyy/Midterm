// load .env data into process.env
require("dotenv").config();

// Web server config

const PORT = process.env.PORT || 8080;

const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require('cookie-session');
// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));


app.use(cookieSession({
  name: "session",
  keys: ["a", "d"]
}));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));
app.use(express.static("images"));
app.use(express.static("db"));


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");
const registrationRoutes = require("./routes/registration");
const loginRoutes = require("./routes/login");
const logoutRoutes = require("./routes/logout");
const searchRoutes = require("./routes/search");
const myItemsRoutes = require("./routes/myItems");
const favouritesRoutes = require("./routes/favourites");
const editRoutes = require("./routes/edit");
// const messagesRoutes = require("./routes/messages");
const conversations = require("./routes/conversations")
const messages = require("./routes/messages")



// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
app.use("/register", registrationRoutes(db));
app.use("/login", loginRoutes(db));
app.use("/logout", logoutRoutes(db));
app.use("/search", searchRoutes(db));
app.use("/myItems", myItemsRoutes(db));
app.use("/favourites", favouritesRoutes(db));
app.use("/edit", editRoutes(db));
// app.use("/messages", messagesRoutes(db));


app.use("/", conversations(db));
app.use("/", messages(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
const sqlQuery = "SELECT * FROM posts ORDER BY created_at DESC;";
app.get("/", (req, res) => {db.query(sqlQuery)
  .then(data => {
  const user = req.session.user;
  const templateVars = {
    user: user,
    posts: data.rows
  };

  res.render("index", templateVars);
  });
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
