"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configFilePath = exports.config = void 0;
exports.findSelectedEntry = findSelectedEntry;
exports.getAppropriateGreeting = getAppropriateGreeting;
exports.getAverage = getAverage;
exports.getColor = getColor;
exports.getHexColor = getHexColor;
exports.journalFilePath = void 0;
exports.listAvailableEditors = listAvailableEditors;
exports.loadEntries = loadEntries;
exports.log = void 0;
exports.mostCommonValue = mostCommonValue;
exports.openInEditor = openInEditor;
exports.openInVSCode = openInVSCode;
exports.saveEntry = saveEntry;
var _chalk = _interopRequireDefault(require("chalk"));
var _child_process = require("child_process");
var _inquirer = _interopRequireDefault(require("inquirer"));
var _lodash = _interopRequireDefault(require("lodash"));
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var journalFilePath = exports.journalFilePath = 'journal.json';
var configFilePath = exports.configFilePath = 'config.json';
var config = exports.config = {};
if (_fs["default"].existsSync(configFilePath)) {
  var data = _fs["default"].readFileSync(configFilePath, 'utf8');
  exports.config = config = JSON.parse(data);
}
var log = exports.log = {
  red: function red(text) {
    return console.log(_chalk["default"].red(text));
  },
  green: function green(text) {
    return console.log(_chalk["default"].green(text));
  },
  yellow: function yellow(text) {
    return console.log(_chalk["default"].yellow(text));
  },
  blue: function blue(text) {
    return console.log(_chalk["default"].blue(text));
  },
  magenta: function magenta(text) {
    return console.log(_chalk["default"].magenta(text));
  },
  cyan: function cyan(text) {
    return console.log(_chalk["default"].cyan(text));
  },
  favoriteColor: function favoriteColor(text) {
    return console.log(_chalk["default"].hex(config.color)(text));
  },
  custom: function custom(text, hexColor) {
    return console.log(_chalk["default"].hex(hexColor)(text));
  },
  "default": console.log
};
function mostCommonValue(arr) {
  var counts = _lodash["default"].countBy(arr);
  var maxCount = Math.max.apply(Math, _toConsumableArray(Object.values(counts)));
  return Object.keys(counts).find(function (key) {
    return counts[key] === maxCount;
  });
}
function getHexColor(value) {
  if (value >= 5) {
    // Yellow to green gradient
    var red = Math.floor(255 - 255 * (value - 5) / 5).toString(16).padStart(2, '0');
    return "#".concat(red, "ff00");
  } else {
    // Red to yellow gradient
    var green = Math.floor(255 * value / 5).toString(16).padStart(2, '0');
    return "#ff".concat(green, "00");
  }
}
function getColor(value) {
  if (value === 5) {
    return _chalk["default"].yellow; // Yellow for 5
  } else if (value > 5) {
    var intensity = 150 + (value - 5) * 10; // Adjust intensity for values > 5
    return _chalk["default"].rgb(255, intensity, 0); // Yellow to green gradient
  } else {
    var _intensity = 255 - (5 - value) * 25; // Adjust intensity for values < 5
    return _chalk["default"].rgb(255, _intensity, 0); // Yellow to red gradient
  }
}
function getAppropriateGreeting() {
  var currentTime = new Date();
  var currentHour = currentTime.getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return 'Good morning';
  } else if (currentHour >= 12 && currentHour < 18) {
    return 'Good afternoon';
  } else if (currentHour >= 18 && currentHour < 22) {
    return 'Good evening';
  } else {
    return "Woah! It's late";
  }
}
function listAvailableEditors() {
  var editors = [];
  try {
    var output = (0, _child_process.execSync)('command -v vim nano code emacs ed joe jed tilde ne micro subl atom notepad++ notepad gedit geany').toString();
    editors = output.trim().split('\n');
    editors = editors.map(function (editorPath) {
      return editorPath.split('/').pop();
    });
  } catch (error) {
    console.error('Error listing editors:', error.message);
  }
  return editors;
}
function getAverage(values) {
  var sum = values.reduce(function (acc, curr) {
    return acc + curr;
  }, 0);
  var average = sum / values.length;
  return Math.floor(average);
}
function findSelectedEntry(_x, _x2, _x3) {
  return _findSelectedEntry.apply(this, arguments);
}
function _findSelectedEntry() {
  _findSelectedEntry = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(date, timeOrIndex, entries) {
    var dateEntries, selectedEntry, index, entryChoices, _yield$inquirer$promp, chosenEntry;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          dateEntries = entries.filter(function (entry) {
            return entry.date.startsWith(date);
          });
          if (!(dateEntries.length === 0)) {
            _context.next = 3;
            break;
          }
          return _context.abrupt("return", null);
        case 3:
          if (!(timeOrIndex && /^\d+$/.test(timeOrIndex))) {
            _context.next = 8;
            break;
          }
          // If a numeric index is provided, use it to select the entry
          index = parseInt(timeOrIndex);
          selectedEntry = dateEntries[index];
          _context.next = 22;
          break;
        case 8:
          if (!timeOrIndex) {
            _context.next = 12;
            break;
          }
          // If a time is provided, find the entry with the matching time
          selectedEntry = dateEntries.find(function (entry) {
            return entry.time === timeOrIndex;
          });
          _context.next = 22;
          break;
        case 12:
          if (!(dateEntries.length === 1)) {
            _context.next = 16;
            break;
          }
          // If there's only one entry for the date, select it automatically
          selectedEntry = dateEntries[0];
          _context.next = 22;
          break;
        case 16:
          // Prompt the user to select an entry from the date
          entryChoices = dateEntries.map(function (entry) {
            return {
              name: "".concat(entry.time, ": ").concat(entry.journalEntry.substring(0, 30), "..."),
              value: entry
            };
          });
          _context.next = 19;
          return _inquirer["default"].prompt({
            type: 'list',
            name: 'selectedEntry',
            message: 'Select an entry:',
            choices: entryChoices
          });
        case 19:
          _yield$inquirer$promp = _context.sent;
          chosenEntry = _yield$inquirer$promp.selectedEntry;
          selectedEntry = chosenEntry;
        case 22:
          return _context.abrupt("return", selectedEntry);
        case 23:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _findSelectedEntry.apply(this, arguments);
}
function openInVSCode() {
  return _openInVSCode.apply(this, arguments);
}
function _openInVSCode() {
  _openInVSCode = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var tempFileName, isFileModified, checkInterval, stats, modifiedTime, newStats, newModifiedTime, editedText;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          tempFileName = 'temp-cli-input.txt';
          _fs["default"].writeFileSync(tempFileName, "Your entry will be saved once you save this file.");
          (0, _child_process.execSync)("code --new-window ".concat(tempFileName), {
            stdio: 'inherit'
          });
          isFileModified = false;
          checkInterval = 1000; // 1 second interval
        case 5:
          if (isFileModified) {
            _context2.next = 15;
            break;
          }
          stats = _fs["default"].statSync(tempFileName);
          modifiedTime = stats.mtimeMs;
          _context2.next = 10;
          return new Promise(function (resolve) {
            return setTimeout(resolve, checkInterval);
          });
        case 10:
          newStats = _fs["default"].statSync(tempFileName);
          newModifiedTime = newStats.mtimeMs;
          if (newModifiedTime > modifiedTime) {
            isFileModified = true;
          }
          _context2.next = 5;
          break;
        case 15:
          editedText = _fs["default"].readFileSync(tempFileName, 'utf8');
          _fs["default"].unlinkSync(tempFileName);
          return _context2.abrupt("return", editedText);
        case 18:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _openInVSCode.apply(this, arguments);
}
function openInEditor(_x4) {
  return _openInEditor.apply(this, arguments);
}
function _openInEditor() {
  _openInEditor = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(editor) {
    var tempFileName, isFileModified, checkInterval, stats, modifiedTime, newStats, newModifiedTime, editedText;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          tempFileName = 'temp-cli-input.txt';
          _fs["default"].writeFileSync(tempFileName, "Your entry will be saved once you save this file.");
          _context3.prev = 2;
          (0, _child_process.execSync)("".concat(editor, " ").concat(tempFileName, " --new-window"), {
            stdio: 'inherit'
          });
          _context3.next = 9;
          break;
        case 6:
          _context3.prev = 6;
          _context3.t0 = _context3["catch"](2);
          throw new Error("Unsupported editor: ".concat(editor));
        case 9:
          isFileModified = false;
          checkInterval = 1000; // 1 second interval
        case 11:
          if (isFileModified) {
            _context3.next = 21;
            break;
          }
          stats = _fs["default"].statSync(tempFileName);
          modifiedTime = stats.mtimeMs;
          _context3.next = 16;
          return new Promise(function (resolve) {
            return setTimeout(resolve, checkInterval);
          });
        case 16:
          newStats = _fs["default"].statSync(tempFileName);
          newModifiedTime = newStats.mtimeMs;
          if (newModifiedTime > modifiedTime) {
            isFileModified = true;
          }
          _context3.next = 11;
          break;
        case 21:
          editedText = _fs["default"].readFileSync(tempFileName, 'utf8');
          _fs["default"].unlinkSync(tempFileName);
          return _context3.abrupt("return", editedText);
        case 24:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[2, 6]]);
  }));
  return _openInEditor.apply(this, arguments);
}
function saveEntry(entry) {
  var entries = [];
  if (_fs["default"].existsSync(journalFilePath)) {
    var _data = _fs["default"].readFileSync(journalFilePath, 'utf8');
    entries = JSON.parse(_data);
  }
  entries.push(entry);
  _fs["default"].writeFileSync(journalFilePath, JSON.stringify(entries, null, 2));
  log.favoriteColor('Entry saved successfully.');
}
function loadEntries() {
  if (_fs["default"].existsSync(journalFilePath)) {
    var _data2 = _fs["default"].readFileSync(journalFilePath, 'utf8');
    return JSON.parse(_data2);
  }
  return [];
}