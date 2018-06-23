const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profiles = require('./routes/api/profiles');

const app = express();
const db = require('./config/keys').mongoUri;
mongoose
  .connect(db)
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.log(err));

// bodyParser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello!!!!'));

// Use routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profiles', profiles);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}.`));