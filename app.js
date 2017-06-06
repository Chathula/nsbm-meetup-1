var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
var expressValidator = require('express-validator');

var ObjectId = mongojs.ObjectId;
var db = mongojs('customerapp', ['users']);
var app = express();

// Custom  Middleware
/*
var logger = function (req, res, next) {
  console.log("Logging... " + req.url);
  next();
};

app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// SET static path
app.use(express.static(path.join(__dirname, 'public')));

// SET global vars
app.use(function (req, res, next) {
  res.locals.errors = null;
  next();
});

// SET express-validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.get('/', function (req, res) {
  db.users.find(function (err, docs) {
    res.render('index', {
      title: 'Customers',
      users: docs,
      errors: res.locals.errors
    });
  });
});

app.post('/users/add', function (req, res) {
  req.checkBody('first_name', 'First Name is required.').notEmpty();
  req.checkBody('last_name', 'Last Name is required.').notEmpty();
  req.checkBody('age', 'Age is required.').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    res.locals.errors = errors;
    res.redirect('/');

  } else {
    var user = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age
    };

    db.users.insert(user, function (err, result) {
      if (err) {
        console.log('errors', err);
      }

      res.redirect('/');
    });
  }

});

app.delete('/users/:id', function (req, res) {
  var id = req.params.id;
  db.users.remove({ _id: ObjectId(id) }, function (err, result) {
    if (err) {
      res.json({ success: false });
    }

    res.json({ success: true });
  });

});

app.listen(3000, function () {
  console.log('server started');
});
