//setting up the .env files to pull environment variables from
require('dotenv').config();
//required modules and middleware
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');



const homeRoute = require('./routes/index.js');
const loginRoute = require('./routes/users.js');
const bloodRoute = require('./routes/blood.js');
const archiveRoute = require('./routes/archives.js');
const editRoute = require('./routes/edit.js');

//initialize the app
const app = express();

//passport config
require('./config/passport.js')(passport);

const PORT = process.env.PORT;
//database configuration
const db = process.env.MongoURI;

//connect to the database
mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if(err) throw err;
    else
    console.log('MongoDB Connected successfully');
})



//setting up middleware to handle view engine and templates

app.use(expressLayouts);
app.set('view engine', 'ejs');

//bodyparser middleware to handle data from forms
app.use(express.urlencoded({extended: false}));

//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //passport middleware
 app.use(passport.initialize());
 app.use(passport.session());

  //connect flash
  app.use(flash());

  //setting up a global variables to be accessed later from anywhere
  app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg');
      res.locals.error_msg = req.flash('error_msg');
      res.locals.error = req.flash('error');
      next();
  });

  //global user
  app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});
//setting up the static files
app.use('/public',express.static(path.join(__dirname, 'public')));

//handling the routes
app.use('/', homeRoute);
app.use('/users', loginRoute );
app.use('/blood', bloodRoute);
app.use('/archives', archiveRoute);
app.use('/edit', editRoute);


app.listen(PORT, (err) => {
    if(err) throw err
    else
    console.log(`server started on localhost:${PORT}...`)
});