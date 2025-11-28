"use strict";

var mongoose = require('mongoose');

var dotenv = require('dotenv');

var Article = require('./models/articleModel');

var User = require('./models/userModel');

dotenv.config({
  path: './config.env'
});
var DB = process.env.DATABASE_URL.replace('<db_password>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB).then(function () {
  return console.log('DB connection successful!');
});

var seedArticle = function seedArticle() {
  var author, article;
  return regeneratorRuntime.async(function seedArticle$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            role: 'admin'
          }));

        case 3:
          author = _context.sent;

          if (!author) {
            console.log('No admin user found. Cannot create article without author.');
            process.exit();
          }

          article = {
            title: 'The Ultimate Guide to UK Visa Sponsorship in 2025',
            summary: 'Everything you need to know about finding a sponsored job in the UK, from Skilled Worker Visas to the Shortage Occupation List.',
            image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?q=80&w=2070&auto=format&fit=crop',
            tags: ['visa', 'sponsorship', 'guide', 'uk'],
            author: author._id,
            content: "\n        <h2>Introduction</h2>\n        <p>Moving to the UK for work is a dream for many professionals around the world. With its vibrant economy, rich history, and diverse culture, the United Kingdom offers incredible opportunities. However, navigating the visa system can be complex.</p>\n        \n        <p>In this guide, we'll break down the <strong>Skilled Worker Visa</strong> route, which is the primary path for skilled professionals to work in the UK.</p>\n\n        <h2>What is the Skilled Worker Visa?</h2>\n        <p>The Skilled Worker visa allows you to come to or stay in the UK to do an eligible job with an approved employer. This visa has replaced the Tier 2 (General) work visa.</p>\n\n        <h3>Eligibility Requirements</h3>\n        <ul>\n            <li>You must work for a UK employer that's been approved by the Home Office</li>\n            <li>You must have a 'certificate of sponsorship' from your employer with information about the role you've been offered in the UK</li>\n            <li>You must do a job that's on the list of eligible occupations</li>\n            <li>You must be paid a minimum salary - how much depends on the type of work you do</li>\n        </ul>\n\n        <h2>Finding a Sponsored Job</h2>\n        <p>The hardest part of the process is often finding an employer willing to sponsor you. That's where platforms like <strong>UK Visa Sponsorship</strong> come in. We curate jobs specifically from employers who hold a sponsorship license.</p>\n\n        <blockquote>\n            \"Persistence is key. Tailor your CV to the UK market and focus on companies that are already licensed to sponsor.\"\n        </blockquote>\n\n        <h2>Top Tips for Applicants</h2>\n        <ol>\n            <li><strong>Check your eligibility:</strong> Use the government website to ensure you meet the points-based system requirements.</li>\n            <li><strong>Polish your CV:</strong> UK CVs have a specific format. Keep it to 2 pages and focus on achievements.</li>\n            <li><strong>Network:</strong> LinkedIn is a powerful tool. Connect with recruiters in your industry.</li>\n        </ol>\n\n        <h2>Conclusion</h2>\n        <p>While the process can be daunting, thousands of people successfully secure sponsorship every year. Stay focused, keep applying, and ensure your documentation is in order.</p>\n      "
          };
          _context.next = 8;
          return regeneratorRuntime.awrap(Article.create(article));

        case 8:
          console.log('Test article created successfully!');
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 14:
          process.exit();

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

seedArticle();