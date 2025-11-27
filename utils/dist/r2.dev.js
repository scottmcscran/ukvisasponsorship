"use strict";

function _asyncIterator(iterable) { var method; if (typeof Symbol !== "undefined") { if (Symbol.asyncIterator) { method = iterable[Symbol.asyncIterator]; if (method != null) return method.call(iterable); } if (Symbol.iterator) { method = iterable[Symbol.iterator]; if (method != null) return method.call(iterable); } } throw new TypeError("Object is not async iterable"); }

var _require = require("@aws-sdk/client-s3"),
    S3Client = _require.S3Client,
    PutObjectCommand = _require.PutObjectCommand,
    DeleteObjectCommand = _require.DeleteObjectCommand,
    GetObjectCommand = _require.GetObjectCommand;

var _require2 = require("@aws-sdk/s3-request-presigner"),
    getSignedUrl = _require2.getSignedUrl;

var s3Client = new S3Client({
  region: "auto",
  endpoint: "https://".concat(process.env.R2_ACCOUNT_ID, ".r2.cloudflarestorage.com"),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
  }
});

exports.uploadFile = function _callee(fileBuffer, fileName, mimeType) {
  var uploadParams;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName,
            Body: fileBuffer,
            ContentType: mimeType
          };
          _context.next = 3;
          return regeneratorRuntime.awrap(s3Client.send(new PutObjectCommand(uploadParams)));

        case 3:
          return _context.abrupt("return", fileName);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.deleteFile = function _callee2(fileName) {
  var deleteParams;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          deleteParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName
          };
          _context2.next = 3;
          return regeneratorRuntime.awrap(s3Client.send(new DeleteObjectCommand(deleteParams)));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.getFileStream = function _callee3(fileName) {
  var downloadParams, response;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          downloadParams = {
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName
          };
          _context3.next = 3;
          return regeneratorRuntime.awrap(s3Client.send(new GetObjectCommand(downloadParams)));

        case 3:
          response = _context3.sent;
          return _context3.abrupt("return", {
            stream: response.Body,
            contentType: response.ContentType
          });

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.getFileBuffer = function _callee4(fileName) {
  var _ref, stream, chunks, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _value, chunk;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(exports.getFileStream(fileName));

        case 2:
          _ref = _context4.sent;
          stream = _ref.stream;
          chunks = [];
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _context4.prev = 7;
          _iterator = _asyncIterator(stream);

        case 9:
          _context4.next = 11;
          return regeneratorRuntime.awrap(_iterator.next());

        case 11:
          _step = _context4.sent;
          _iteratorNormalCompletion = _step.done;
          _context4.next = 15;
          return regeneratorRuntime.awrap(_step.value);

        case 15:
          _value = _context4.sent;

          if (_iteratorNormalCompletion) {
            _context4.next = 22;
            break;
          }

          chunk = _value;
          chunks.push(chunk);

        case 19:
          _iteratorNormalCompletion = true;
          _context4.next = 9;
          break;

        case 22:
          _context4.next = 28;
          break;

        case 24:
          _context4.prev = 24;
          _context4.t0 = _context4["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context4.t0;

        case 28:
          _context4.prev = 28;
          _context4.prev = 29;

          if (!(!_iteratorNormalCompletion && _iterator["return"] != null)) {
            _context4.next = 33;
            break;
          }

          _context4.next = 33;
          return regeneratorRuntime.awrap(_iterator["return"]());

        case 33:
          _context4.prev = 33;

          if (!_didIteratorError) {
            _context4.next = 36;
            break;
          }

          throw _iteratorError;

        case 36:
          return _context4.finish(33);

        case 37:
          return _context4.finish(28);

        case 38:
          return _context4.abrupt("return", Buffer.concat(chunks));

        case 39:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[7, 24, 28, 38], [29,, 33, 37]]);
};

exports.getSignedUrl = function _callee5(fileName) {
  var command;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          command = new GetObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: fileName
          });
          _context5.next = 3;
          return regeneratorRuntime.awrap(getSignedUrl(s3Client, command, {
            expiresIn: 3600
          }));

        case 3:
          return _context5.abrupt("return", _context5.sent);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};