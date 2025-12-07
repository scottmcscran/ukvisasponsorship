"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var nodemailer = require("nodemailer");

var pug = require("pug");

var _require = require("html-to-text"),
    convert = _require.convert;

module.exports =
/*#__PURE__*/
function () {
  function Email(user, url) {
    _classCallCheck(this, Email);

    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = "Uk Visa Sponsorship <".concat(process.env.EMAIL_FROM || "mail@ukvisasponsorship.com", ">");
  }

  _createClass(Email, [{
    key: "newTransport",
    value: function newTransport() {
      if (process.env.NODE_ENV === "production") return nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
          user: process.env.BREVO_USERNAME,
          pass: process.env.BREVO_SMTP_KEY
        }
      });
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD
        }
      });
    }
  }, {
    key: "send",
    value: function send(template, subject) {
      var html, mailOptions;
      return regeneratorRuntime.async(function send$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              html = pug.renderFile("".concat(__dirname, "/../views/email/").concat(template, ".pug"), {
                firstName: this.firstName,
                url: this.url,
                subject: subject
              });
              mailOptions = {
                from: this.from,
                to: this.to,
                subject: subject,
                html: html,
                text: convert(html)
              };
              _context.next = 4;
              return regeneratorRuntime.awrap(this.newTransport().sendMail(mailOptions));

            case 4:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendApplication",
    value: function sendApplication(applicant, job, cvFile) {
      var html, mailOptions;
      return regeneratorRuntime.async(function sendApplication$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              html = pug.renderFile("".concat(__dirname, "/../views/email/application.pug"), {
                employerName: this.firstName,
                applicantName: applicant.name,
                jobTitle: job.title,
                applicantEmail: applicant.email,
                subject: "New Application for ".concat(job.title)
              });
              mailOptions = {
                from: this.from,
                to: this.to,
                subject: "New Application: ".concat(job.title),
                html: html,
                text: convert(html),
                replyTo: applicant.email,
                attachments: [{
                  filename: cvFile.originalname,
                  content: cvFile.buffer
                }]
              };
              _context2.next = 4;
              return regeneratorRuntime.awrap(this.newTransport().sendMail(mailOptions));

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendWelcome",
    value: function sendWelcome() {
      return regeneratorRuntime.async(function sendWelcome$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.send("welcome", "Welcome to the Uk Visa Sponsorship Family!"));

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendPasswordReset",
    value: function sendPasswordReset() {
      return regeneratorRuntime.async(function sendPasswordReset$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.send("passwordReset", "Your password reset token (valid for 10 minutes)"));

            case 2:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendVerification",
    value: function sendVerification() {
      return regeneratorRuntime.async(function sendVerification$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return regeneratorRuntime.awrap(this.send("verifyEmail", "Verify your email address"));

            case 2:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendAccountVerified",
    value: function sendAccountVerified() {
      return regeneratorRuntime.async(function sendAccountVerified$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return regeneratorRuntime.awrap(this.send("accountVerified", "Your account has been verified!"));

            case 2:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendClaimAccount",
    value: function sendClaimAccount() {
      return regeneratorRuntime.async(function sendClaimAccount$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return regeneratorRuntime.awrap(this.send("claimAccount", "Claim your employer account"));

            case 2:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendClaimAccountNoJobs",
    value: function sendClaimAccountNoJobs() {
      return regeneratorRuntime.async(function sendClaimAccountNoJobs$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return regeneratorRuntime.awrap(this.send("claimAccountNoJobs", "Claim your employer account"));

            case 2:
            case "end":
              return _context8.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Email;
}();