/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (io, _) {
  var usersHistory = [];
  var freeId = [];
  var online = [];
  io.on('connection', function (socket) {
    var id = !freeId[0] ? _.uniqueId('user_') : freeId[0];
    freeId.shift();
    socket.emit("assigning-userid-and-history", { userId: id, history: usersHistory, onlineUsers: online });
    console.log('New connection detected id assigned: ' + id);
    socket.on("new-message", function (msg) {
      //_.merge(msg, {userId:id});
      usersHistory.push(msg);
      console.log('New Message: ' + msg.message + ' from: ' + msg.userName);
      io.emit("receive-message", msg);
    });
    var userCapture = "";
    socket.on("new-user", function (userName) {
      userCapture = userName;
      online.push(userName);
      console.log(userName + ' Joined!');
      io.emit("list-online", online);
      io.emit("user-joined", userName);
    });
    socket.on("disconnect", function () {
      console.log("One connection was closed!");
      console.log(userCapture + ' Left!');
      freeId.push(id);
      freeId.sort();
      _.remove(online, function (n) {
        return n == userCapture;
      });
      io.emit("user-left", userCapture);
      io.emit("list-online", online);
      console.log('Free user ids: ' + freeId);
    });
  });
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _morgan = __webpack_require__(4);

var _morgan2 = _interopRequireDefault(_morgan);

var _lodash = __webpack_require__(3);

var _lodash2 = _interopRequireDefault(_lodash);

var _path = __webpack_require__(5);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var http = __webpack_require__(2).Server(app);
var io = __webpack_require__(6)(http);

var port = process.env.PORT || 3000;

app.use(_express2.default.static(_path2.default.join(__dirname, 'bundled')));
app.use((0, _morgan2.default)('dev'));
__webpack_require__(0)(io, _lodash2.default);

app.get('/', function (req, res) {
  res.sendFile(_path2.default.join(__dirname, 'bundled') + '/index.html');
});

http.listen(port, function () {
  console.log('Chat app running on port ' + port);
});

/***/ })
/******/ ]);