const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profiles = require("./routes/api/profiles");

const app = express();
const db = require("./config/keys").mongoUri;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected."))
  .catch(err => console.log(err));

// bodyParser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

// app.get('/', (req, res) => res.send('Hello!!!!'));

// Use routes
app.use("/api/users", users);
app.use("/api/posts", posts);
app.use("/api/profiles", profiles);

// Server static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // everything that gets hit
  // direct to the react build file
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}.`));
