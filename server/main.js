const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const AuthRoutes = require('./AuthRoutes');
const LibraryRoutes = require('./LibraryRoutes');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

module.exports = class Troubadour {
  constructor() {
    this.setupExpress = this.setupExpress.bind(this);
    this.setupMongo = this.setupMongo.bind(this);
    this.launch = this.launch.bind(this);

    this.setupExpress();
    this.setupMongo();
    this._authRoutes = new AuthRoutes(this);
    this._libraryRoutes = new LibraryRoutes(this);

    // Catchall handler: makes the server serve React whenever we don't
    // match a route
    this._express.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });

    // TODO: Wait until Mongo is ready to do this
    this.launch();
  }

  setupExpress() {
    const app = express();
    app.use(bodyParser());
    app.use(cookieParser());

    // Enable CORS on dev environments
    if (process.env.NODE_ENV !== 'production') {
      app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', true);
        next();
      });
    }

    // Only used in production, makes the server serve React files
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.set('port', process.env.PORT || 3001);

    this._express = app;
  }

  setupMongo() {
    mongoose.connect(process.env.DATABASE_URI, { useNewUrlParser: true });
  }

  launch() {
    this._express.listen(this._express.get('port'), () => {
      console.log(`Find the server at: http://localhost:${this._express.get('port')}/`); // eslint-disable-line no-console
    });
  }
}
