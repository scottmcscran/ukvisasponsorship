"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv');

dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, {// useNewUrlParser: true, // Deprecated in newer drivers but usually harmless, removing to be safe
  // useUnifiedTopology: true, // Same
}).then(function _callee() {
  var User;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log('DB connection successful!');
          _context.prev = 1;
          User = require('./models/userModel');
          _context.next = 5;
          return regeneratorRuntime.awrap(User.collection.dropIndex('companyProfile.legalOrgName_1'));

        case 5:
          console.log('Index dropped successfully');
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](1);
          console.log('Error dropping index (it might not exist):', _context.t0.message);

        case 11:
          process.exit();

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 8]]);
});