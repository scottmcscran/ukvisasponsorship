// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/axios/lib/helpers/bind.js":[function(require,module,exports) {
'use strict';

/**
 * Create a bound version of a function with a specified `this` context
 *
 * @param {Function} fn - The function to bind
 * @param {*} thisArg - The value to be passed as the `this` parameter
 * @returns {Function} A new function that will call the original function with the specified `this` context
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bind;
function bind(fn, thisArg) {
  return function wrap() {
    return fn.apply(thisArg, arguments);
  };
}
},{}],"../../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;
function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}
(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }
  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  }
  // if setTimeout wasn't available but was latter defined
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  }
  // if clearTimeout wasn't available but was latter defined
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
};

// v8 likes predictible objects
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};
process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};
function noop() {}
process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;
process.listeners = function (name) {
  return [];
};
process.binding = function (name) {
  throw new Error('process.binding is not supported');
};
process.cwd = function () {
  return '/';
};
process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};
process.umask = function () {
  return 0;
};
},{}],"../../node_modules/axios/lib/utils.js":[function(require,module,exports) {
var global = arguments[3];
var define;
var process = require("process");
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _bind = _interopRequireDefault(require("./helpers/bind.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// utils is a library of generic helper functions non-specific to axios

const {
  toString
} = Object.prototype;
const {
  getPrototypeOf
} = Object;
const {
  iterator,
  toStringTag
} = Symbol;
const kindOf = (cache => thing => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));
const kindOfTest = type => {
  type = type.toLowerCase();
  return thing => kindOf(thing) === type;
};
const typeOfTest = type => thing => typeof thing === type;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */
const {
  isArray
} = Array;

/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */
const isUndefined = typeOfTest('undefined');

/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
const isArrayBuffer = kindOfTest('ArrayBuffer');

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */
const isString = typeOfTest('string');

/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
const isFunction = typeOfTest('function');

/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */
const isNumber = typeOfTest('number');

/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */
const isObject = thing => thing !== null && typeof thing === 'object';

/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */
const isBoolean = thing => thing === true || thing === false;

/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */
const isPlainObject = val => {
  if (kindOf(val) !== 'object') {
    return false;
  }
  const prototype = getPrototypeOf(val);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(toStringTag in val) && !(iterator in val);
};

/**
 * Determine if a value is an empty object (safely handles Buffers)
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an empty object, otherwise false
 */
const isEmptyObject = val => {
  // Early return for non-objects or Buffers to prevent RangeError
  if (!isObject(val) || isBuffer(val)) {
    return false;
  }
  try {
    return Object.keys(val).length === 0 && Object.getPrototypeOf(val) === Object.prototype;
  } catch (e) {
    // Fallback for any other objects that might cause RangeError with Object.keys()
    return false;
  }
};

/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */
const isDate = kindOfTest('Date');

/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFile = kindOfTest('File');

/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */
const isBlob = kindOfTest('Blob');

/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */
const isFileList = kindOfTest('FileList');

/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */
const isStream = val => isObject(val) && isFunction(val.pipe);

/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */
const isFormData = thing => {
  let kind;
  return thing && (typeof FormData === 'function' && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === 'formdata' ||
  // detect form-data instance
  kind === 'object' && isFunction(thing.toString) && thing.toString() === '[object FormData]'));
};

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
const isURLSearchParams = kindOfTest('URLSearchParams');
const [isReadableStream, isRequest, isResponse, isHeaders] = ['ReadableStream', 'Request', 'Response', 'Headers'].map(kindOfTest);

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */
const trim = str => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */
function forEach(obj, fn, {
  allOwnKeys = false
} = {}) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }
  let i;
  let l;

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }
  if (isArray(obj)) {
    // Iterate over array values
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Buffer check
    if (isBuffer(obj)) {
      return;
    }

    // Iterate over object keys
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  if (isBuffer(obj)) {
    return null;
  }
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  /*eslint no-undef:0*/
  if (typeof globalThis !== "undefined") return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== 'undefined' ? window : global;
})();
const isContextDefined = context => !isUndefined(context) && context !== _global;

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */
) {
  const {
    caseless,
    skipUndefined
  } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else if (!skipUndefined || !isUndefined(val)) {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */
const extend = (a, b, thisArg, {
  allOwnKeys
} = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = (0, _bind.default)(val, thisArg);
    } else {
      a[key] = val;
    }
  }, {
    allOwnKeys
  });
  return a;
};

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */
const stripBOM = content => {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
};

/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */
const inherits = (constructor, superConstructor, props, descriptors) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, 'super', {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};

/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */
const toFlatObject = (sourceObj, destObj, filter, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  // eslint-disable-next-line no-eq-null,eqeqeq
  if (sourceObj == null) return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};

/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};

/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */
const toArray = thing => {
  if (!thing) return null;
  if (isArray(thing)) return thing;
  let i = thing.length;
  if (!isNumber(i)) return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};

/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */
// eslint-disable-next-line func-names
const isTypedArray = (TypedArray => {
  // eslint-disable-next-line func-names
  return thing => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && getPrototypeOf(Uint8Array));

/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[iterator];
  const _iterator = generator.call(obj);
  let result;
  while ((result = _iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};

/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};

/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */
const isHTMLForm = kindOfTest('HTMLFormElement');
const toCamelCase = str => {
  return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
    return p1.toUpperCase() + p2;
  });
};

/* Creating a function that will check if an object has a property. */
const hasOwnProperty = (({
  hasOwnProperty
}) => (obj, prop) => hasOwnProperty.call(obj, prop))(Object.prototype);

/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */
const isRegExp = kindOfTest('RegExp');
const reduceDescriptors = (obj, reducer) => {
  const descriptors = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};

/**
 * Makes all methods read-only
 * @param {Object} obj
 */

const freezeMethods = obj => {
  reduceDescriptors(obj, (descriptor, name) => {
    // skip restricted props in strict mode
    if (isFunction(obj) && ['arguments', 'caller', 'callee'].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value)) return;
    descriptor.enumerable = false;
    if ('writable' in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error('Can not rewrite read-only method \'' + name + '\'');
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = arr => {
    arr.forEach(value => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop = () => {};
const toFiniteNumber = (value, defaultValue) => {
  return value != null && Number.isFinite(value = +value) ? value : defaultValue;
};

/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[toStringTag] === 'FormData' && thing[iterator]);
}
const toJSONObject = obj => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }

      //Buffer check
      if (isBuffer(source)) {
        return source;
      }
      if (!('toJSON' in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = undefined;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest('AsyncFunction');
const isThenable = thing => thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);

// original code
// https://github.com/DigitalBrainJS/AxiosPromise/blob/16deab13710ec09779922131f3fa5954320f83ab/lib/utils.js#L11-L34

const _setImmediate = ((setImmediateSupported, postMessageSupported) => {
  if (setImmediateSupported) {
    return setImmediate;
  }
  return postMessageSupported ? ((token, callbacks) => {
    _global.addEventListener("message", ({
      source,
      data
    }) => {
      if (source === _global && data === token) {
        callbacks.length && callbacks.shift()();
      }
    }, false);
    return cb => {
      callbacks.push(cb);
      _global.postMessage(token, "*");
    };
  })(`axios@${Math.random()}`, []) : cb => setTimeout(cb);
})(typeof setImmediate === 'function', isFunction(_global.postMessage));
const asap = typeof queueMicrotask !== 'undefined' ? queueMicrotask.bind(_global) : typeof process !== 'undefined' && process.nextTick || _setImmediate;

// *********************

const isIterable = thing => thing != null && isFunction(thing[iterator]);
var _default = exports.default = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isPlainObject,
  isEmptyObject,
  isReadableStream,
  isRequest,
  isResponse,
  isHeaders,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable,
  setImmediate: _setImmediate,
  asap,
  isIterable
};
},{"./helpers/bind.js":"../../node_modules/axios/lib/helpers/bind.js","process":"../../node_modules/process/browser.js"}],"../../node_modules/axios/lib/core/AxiosError.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */
function AxiosError(message, code, config, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = 'AxiosError';
  code && (this.code = code);
  config && (this.config = config);
  request && (this.request = request);
  if (response) {
    this.response = response;
    this.status = response.status ? response.status : null;
  }
}
_utils.default.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: _utils.default.toJSONObject(this.config),
      code: this.code,
      status: this.status
    };
  }
});
const prototype = AxiosError.prototype;
const descriptors = {};
['ERR_BAD_OPTION_VALUE', 'ERR_BAD_OPTION', 'ECONNABORTED', 'ETIMEDOUT', 'ERR_NETWORK', 'ERR_FR_TOO_MANY_REDIRECTS', 'ERR_DEPRECATED', 'ERR_BAD_RESPONSE', 'ERR_BAD_REQUEST', 'ERR_CANCELED', 'ERR_NOT_SUPPORT', 'ERR_INVALID_URL'
// eslint-disable-next-line func-names
].forEach(code => {
  descriptors[code] = {
    value: code
  };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype, 'isAxiosError', {
  value: true
});

// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps) => {
  const axiosError = Object.create(prototype);
  _utils.default.toFlatObject(error, axiosError, function filter(obj) {
    return obj !== Error.prototype;
  }, prop => {
    return prop !== 'isAxiosError';
  });
  const msg = error && error.message ? error.message : 'Error';

  // Prefer explicit code; otherwise copy the low-level error's code (e.g. ECONNREFUSED)
  const errCode = code == null && error ? error.code : code;
  AxiosError.call(axiosError, msg, errCode, config, request, response);

  // Chain the original error on the standard field; non-enumerable to avoid JSON noise
  if (error && axiosError.cause == null) {
    Object.defineProperty(axiosError, 'cause', {
      value: error,
      configurable: true
    });
  }
  axiosError.name = error && error.name || 'Error';
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
var _default = exports.default = AxiosError;
},{"../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/helpers/null.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// eslint-disable-next-line strict
var _default = exports.default = null;
},{}],"../../node_modules/base64-js/index.js":[function(require,module,exports) {
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],"../../node_modules/ieee754/index.js":[function(require,module,exports) {
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],"../../node_modules/isarray/index.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],"../../node_modules/buffer/index.js":[function(require,module,exports) {

var global = arguments[3];
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

},{"base64-js":"../../node_modules/base64-js/index.js","ieee754":"../../node_modules/ieee754/index.js","isarray":"../../node_modules/isarray/index.js","buffer":"../../node_modules/buffer/index.js"}],"../../node_modules/axios/lib/helpers/toFormData.js":[function(require,module,exports) {
var Buffer = require("buffer").Buffer;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("../utils.js"));
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
var _FormData = _interopRequireDefault(require("../platform/node/classes/FormData.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */
function isVisitable(thing) {
  return _utils.default.isPlainObject(thing) || _utils.default.isArray(thing);
}

/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */
function removeBrackets(key) {
  return _utils.default.endsWith(key, '[]') ? key.slice(0, -2) : key;
}

/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */
function renderKey(path, key, dots) {
  if (!path) return key;
  return path.concat(key).map(function each(token, i) {
    // eslint-disable-next-line no-param-reassign
    token = removeBrackets(token);
    return !dots && i ? '[' + token + ']' : token;
  }).join(dots ? '.' : '');
}

/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */
function isFlatArray(arr) {
  return _utils.default.isArray(arr) && !arr.some(isVisitable);
}
const predicates = _utils.default.toFlatObject(_utils.default, {}, null, function filter(prop) {
  return /^is[A-Z]/.test(prop);
});

/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/

/**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */
function toFormData(obj, formData, options) {
  if (!_utils.default.isObject(obj)) {
    throw new TypeError('target must be an object');
  }

  // eslint-disable-next-line no-param-reassign
  formData = formData || new (_FormData.default || FormData)();

  // eslint-disable-next-line no-param-reassign
  options = _utils.default.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    return !_utils.default.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  // eslint-disable-next-line no-use-before-define
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== 'undefined' && Blob;
  const useBlob = _Blob && _utils.default.isSpecCompliantForm(formData);
  if (!_utils.default.isFunction(visitor)) {
    throw new TypeError('visitor must be a function');
  }
  function convertValue(value) {
    if (value === null) return '';
    if (_utils.default.isDate(value)) {
      return value.toISOString();
    }
    if (_utils.default.isBoolean(value)) {
      return value.toString();
    }
    if (!useBlob && _utils.default.isBlob(value)) {
      throw new _AxiosError.default('Blob is not supported. Use a Buffer instead.');
    }
    if (_utils.default.isArrayBuffer(value) || _utils.default.isTypedArray(value)) {
      return useBlob && typeof Blob === 'function' ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }

  /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */
  function defaultVisitor(value, key, path) {
    let arr = value;
    if (value && !path && typeof value === 'object') {
      if (_utils.default.endsWith(key, '{}')) {
        // eslint-disable-next-line no-param-reassign
        key = metaTokens ? key : key.slice(0, -2);
        // eslint-disable-next-line no-param-reassign
        value = JSON.stringify(value);
      } else if (_utils.default.isArray(value) && isFlatArray(value) || (_utils.default.isFileList(value) || _utils.default.endsWith(key, '[]')) && (arr = _utils.default.toArray(value))) {
        // eslint-disable-next-line no-param-reassign
        key = removeBrackets(key);
        arr.forEach(function each(el, index) {
          !(_utils.default.isUndefined(el) || el === null) && formData.append(
          // eslint-disable-next-line no-nested-ternary
          indexes === true ? renderKey([key], index, dots) : indexes === null ? key : key + '[]', convertValue(el));
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path) {
    if (_utils.default.isUndefined(value)) return;
    if (stack.indexOf(value) !== -1) {
      throw Error('Circular reference detected in ' + path.join('.'));
    }
    stack.push(value);
    _utils.default.forEach(value, function each(el, key) {
      const result = !(_utils.default.isUndefined(el) || el === null) && visitor.call(formData, el, _utils.default.isString(key) ? key.trim() : key, path, exposedHelpers);
      if (result === true) {
        build(el, path ? path.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!_utils.default.isObject(obj)) {
    throw new TypeError('data must be an object');
  }
  build(obj);
  return formData;
}
var _default = exports.default = toFormData;
},{"../utils.js":"../../node_modules/axios/lib/utils.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","../platform/node/classes/FormData.js":"../../node_modules/axios/lib/helpers/null.js","buffer":"../../node_modules/buffer/index.js"}],"../../node_modules/axios/lib/helpers/AxiosURLSearchParams.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _toFormData = _interopRequireDefault(require("./toFormData.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */
function encode(str) {
  const charMap = {
    '!': '%21',
    "'": '%27',
    '(': '%28',
    ')': '%29',
    '~': '%7E',
    '%20': '+',
    '%00': '\x00'
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}

/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && (0, _toFormData.default)(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString(encoder) {
  const _encode = encoder ? function (value) {
    return encoder.call(this, value, encode);
  } : encode;
  return this._pairs.map(function each(pair) {
    return _encode(pair[0]) + '=' + _encode(pair[1]);
  }, '').join('&');
};
var _default = exports.default = AxiosURLSearchParams;
},{"./toFormData.js":"../../node_modules/axios/lib/helpers/toFormData.js"}],"../../node_modules/axios/lib/helpers/buildURL.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildURL;
var _utils = _interopRequireDefault(require("../utils.js"));
var _AxiosURLSearchParams = _interopRequireDefault(require("../helpers/AxiosURLSearchParams.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?(object|Function)} options
 *
 * @returns {string} The formatted url
 */
function buildURL(url, params, options) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  if (_utils.default.isFunction(options)) {
    options = {
      serialize: options
    };
  }
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = _utils.default.isURLSearchParams(params) ? params.toString() : new _AxiosURLSearchParams.default(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
}
},{"../utils.js":"../../node_modules/axios/lib/utils.js","../helpers/AxiosURLSearchParams.js":"../../node_modules/axios/lib/helpers/AxiosURLSearchParams.js"}],"../../node_modules/axios/lib/core/InterceptorManager.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("./../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {void}
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }

  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    _utils.default.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
var _default = exports.default = InterceptorManager;
},{"./../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/defaults/transitional.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = exports.default = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
},{}],"../../node_modules/axios/lib/platform/browser/classes/URLSearchParams.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AxiosURLSearchParams = _interopRequireDefault(require("../../../helpers/AxiosURLSearchParams.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = typeof URLSearchParams !== 'undefined' ? URLSearchParams : _AxiosURLSearchParams.default;
},{"../../../helpers/AxiosURLSearchParams.js":"../../node_modules/axios/lib/helpers/AxiosURLSearchParams.js"}],"../../node_modules/axios/lib/platform/browser/classes/FormData.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = exports.default = typeof FormData !== 'undefined' ? FormData : null;
},{}],"../../node_modules/axios/lib/platform/browser/classes/Blob.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = exports.default = typeof Blob !== 'undefined' ? Blob : null;
},{}],"../../node_modules/axios/lib/platform/browser/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _URLSearchParams = _interopRequireDefault(require("./classes/URLSearchParams.js"));
var _FormData = _interopRequireDefault(require("./classes/FormData.js"));
var _Blob = _interopRequireDefault(require("./classes/Blob.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = {
  isBrowser: true,
  classes: {
    URLSearchParams: _URLSearchParams.default,
    FormData: _FormData.default,
    Blob: _Blob.default
  },
  protocols: ['http', 'https', 'file', 'blob', 'url', 'data']
};
},{"./classes/URLSearchParams.js":"../../node_modules/axios/lib/platform/browser/classes/URLSearchParams.js","./classes/FormData.js":"../../node_modules/axios/lib/platform/browser/classes/FormData.js","./classes/Blob.js":"../../node_modules/axios/lib/platform/browser/classes/Blob.js"}],"../../node_modules/axios/lib/platform/common/utils.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.origin = exports.navigator = exports.hasStandardBrowserWebWorkerEnv = exports.hasStandardBrowserEnv = exports.hasBrowserEnv = void 0;
const hasBrowserEnv = exports.hasBrowserEnv = typeof window !== 'undefined' && typeof document !== 'undefined';
const _navigator = exports.navigator = typeof navigator === 'object' && navigator || undefined;

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */
const hasStandardBrowserEnv = exports.hasStandardBrowserEnv = hasBrowserEnv && (!_navigator || ['ReactNative', 'NativeScript', 'NS'].indexOf(_navigator.product) < 0);

/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */
const hasStandardBrowserWebWorkerEnv = exports.hasStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== 'undefined' &&
  // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === 'function';
})();
const origin = exports.origin = hasBrowserEnv && window.location.href || 'http://localhost';
},{}],"../../node_modules/axios/lib/platform/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = _interopRequireDefault(require("./node/index.js"));
var utils = _interopRequireWildcard(require("./common/utils.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = {
  ...utils,
  ..._index.default
};
},{"./node/index.js":"../../node_modules/axios/lib/platform/browser/index.js","./common/utils.js":"../../node_modules/axios/lib/platform/common/utils.js"}],"../../node_modules/axios/lib/helpers/toURLEncodedForm.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toURLEncodedForm;
var _utils = _interopRequireDefault(require("../utils.js"));
var _toFormData = _interopRequireDefault(require("./toFormData.js"));
var _index = _interopRequireDefault(require("../platform/index.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function toURLEncodedForm(data, options) {
  return (0, _toFormData.default)(data, new _index.default.classes.URLSearchParams(), {
    visitor: function (value, key, path, helpers) {
      if (_index.default.isNode && _utils.default.isBuffer(value)) {
        this.append(key, value.toString('base64'));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    },
    ...options
  });
}
},{"../utils.js":"../../node_modules/axios/lib/utils.js","./toFormData.js":"../../node_modules/axios/lib/helpers/toFormData.js","../platform/index.js":"../../node_modules/axios/lib/platform/index.js"}],"../../node_modules/axios/lib/helpers/formDataToJSON.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */
function parsePropPath(name) {
  // foo[x][y][z]
  // foo.x.y.z
  // foo-x-y-z
  // foo x y z
  return _utils.default.matchAll(/\w+|\[(\w*)]/g, name).map(match => {
    return match[0] === '[]' ? '' : match[1] || match[0];
  });
}

/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}

/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */
function formDataToJSON(formData) {
  function buildPath(path, value, target, index) {
    let name = path[index++];
    if (name === '__proto__') return true;
    const isNumericKey = Number.isFinite(+name);
    const isLast = index >= path.length;
    name = !name && _utils.default.isArray(target) ? target.length : name;
    if (isLast) {
      if (_utils.default.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !_utils.default.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path, value, target[name], index);
    if (result && _utils.default.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (_utils.default.isFormData(formData) && _utils.default.isFunction(formData.entries)) {
    const obj = {};
    _utils.default.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
var _default = exports.default = formDataToJSON;
},{"../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/defaults/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("../utils.js"));
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
var _transitional = _interopRequireDefault(require("./transitional.js"));
var _toFormData = _interopRequireDefault(require("../helpers/toFormData.js"));
var _toURLEncodedForm = _interopRequireDefault(require("../helpers/toURLEncodedForm.js"));
var _index = _interopRequireDefault(require("../platform/index.js"));
var _formDataToJSON = _interopRequireDefault(require("../helpers/formDataToJSON.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */
function stringifySafely(rawValue, parser, encoder) {
  if (_utils.default.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return _utils.default.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: _transitional.default,
  adapter: ['xhr', 'http', 'fetch'],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || '';
    const hasJSONContentType = contentType.indexOf('application/json') > -1;
    const isObjectPayload = _utils.default.isObject(data);
    if (isObjectPayload && _utils.default.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData = _utils.default.isFormData(data);
    if (isFormData) {
      return hasJSONContentType ? JSON.stringify((0, _formDataToJSON.default)(data)) : data;
    }
    if (_utils.default.isArrayBuffer(data) || _utils.default.isBuffer(data) || _utils.default.isStream(data) || _utils.default.isFile(data) || _utils.default.isBlob(data) || _utils.default.isReadableStream(data)) {
      return data;
    }
    if (_utils.default.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (_utils.default.isURLSearchParams(data)) {
      headers.setContentType('application/x-www-form-urlencoded;charset=utf-8', false);
      return data.toString();
    }
    let isFileList;
    if (isObjectPayload) {
      if (contentType.indexOf('application/x-www-form-urlencoded') > -1) {
        return (0, _toURLEncodedForm.default)(data, this.formSerializer).toString();
      }
      if ((isFileList = _utils.default.isFileList(data)) || contentType.indexOf('multipart/form-data') > -1) {
        const _FormData = this.env && this.env.FormData;
        return (0, _toFormData.default)(isFileList ? {
          'files[]': data
        } : data, _FormData && new _FormData(), this.formSerializer);
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType('application/json', false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    const JSONRequested = this.responseType === 'json';
    if (_utils.default.isResponse(data) || _utils.default.isReadableStream(data)) {
      return data;
    }
    if (data && _utils.default.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional && transitional.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data, this.parseReviver);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw _AxiosError.default.from(e, _AxiosError.default.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: _index.default.classes.FormData,
    Blob: _index.default.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': undefined
    }
  }
};
_utils.default.forEach(['delete', 'get', 'head', 'post', 'put', 'patch'], method => {
  defaults.headers[method] = {};
});
var _default = exports.default = defaults;
},{"../utils.js":"../../node_modules/axios/lib/utils.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","./transitional.js":"../../node_modules/axios/lib/defaults/transitional.js","../helpers/toFormData.js":"../../node_modules/axios/lib/helpers/toFormData.js","../helpers/toURLEncodedForm.js":"../../node_modules/axios/lib/helpers/toURLEncodedForm.js","../platform/index.js":"../../node_modules/axios/lib/platform/index.js","../helpers/formDataToJSON.js":"../../node_modules/axios/lib/helpers/formDataToJSON.js"}],"../../node_modules/axios/lib/helpers/parseHeaders.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("./../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = _utils.default.toObjectSet(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']);

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */
var _default = rawHeaders => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split('\n').forEach(function parser(line) {
    i = line.indexOf(':');
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  });
  return parsed;
};
exports.default = _default;
},{"./../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/core/AxiosHeaders.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("../utils.js"));
var _parseHeaders = _interopRequireDefault(require("../helpers/parseHeaders.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const $internals = Symbol('internals');
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return _utils.default.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = str => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
  if (_utils.default.isFunction(filter)) {
    return filter.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!_utils.default.isString(value)) return;
  if (_utils.default.isString(filter)) {
    return value.indexOf(filter) !== -1;
  }
  if (_utils.default.isRegExp(filter)) {
    return filter.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = _utils.default.toCamelCase(' ' + header);
  ['get', 'set', 'has'].forEach(methodName => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function (arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error('header name must be a non-empty string');
      }
      const key = _utils.default.findKey(self, lHeader);
      if (!key || self[key] === undefined || _rewrite === true || _rewrite === undefined && self[key] !== false) {
        self[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => _utils.default.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (_utils.default.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (_utils.default.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders((0, _parseHeaders.default)(header), valueOrRewrite);
    } else if (_utils.default.isObject(header) && _utils.default.isIterable(header)) {
      let obj = {},
        dest,
        key;
      for (const entry of header) {
        if (!_utils.default.isArray(entry)) {
          throw TypeError('Object iterator must return a key-value pair');
        }
        obj[key = entry[0]] = (dest = obj[key]) ? _utils.default.isArray(dest) ? [...dest, entry[1]] : [dest, entry[1]] : entry[1];
      }
      setHeaders(obj, valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = _utils.default.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (_utils.default.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (_utils.default.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError('parser must be boolean|regexp|function');
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = _utils.default.findKey(this, header);
      return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = _utils.default.findKey(self, _header);
        if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
          delete self[key];
          deleted = true;
        }
      }
    }
    if (_utils.default.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self = this;
    const headers = {};
    _utils.default.forEach(this, (value, header) => {
      const key = _utils.default.findKey(headers, header);
      if (key) {
        self[key] = normalizeValue(value);
        delete self[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self[header];
      }
      self[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = Object.create(null);
    _utils.default.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && _utils.default.isArray(value) ? value.join(', ') : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ': ' + value).join('\n');
  }
  getSetCookie() {
    return this.get("set-cookie") || [];
  }
  get [Symbol.toStringTag]() {
    return 'AxiosHeaders';
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach(target => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype, _header);
        accessors[lHeader] = true;
      }
    }
    _utils.default.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(['Content-Type', 'Content-Length', 'Accept', 'Accept-Encoding', 'User-Agent', 'Authorization']);

// reserved names hotfix
_utils.default.reduceDescriptors(AxiosHeaders.prototype, ({
  value
}, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
_utils.default.freezeMethods(AxiosHeaders);
var _default = exports.default = AxiosHeaders;
},{"../utils.js":"../../node_modules/axios/lib/utils.js","../helpers/parseHeaders.js":"../../node_modules/axios/lib/helpers/parseHeaders.js"}],"../../node_modules/axios/lib/core/transformData.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformData;
var _utils = _interopRequireDefault(require("./../utils.js"));
var _index = _interopRequireDefault(require("../defaults/index.js"));
var _AxiosHeaders = _interopRequireDefault(require("../core/AxiosHeaders.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */
function transformData(fns, response) {
  const config = this || _index.default;
  const context = response || config;
  const headers = _AxiosHeaders.default.from(context.headers);
  let data = context.data;
  _utils.default.forEach(fns, function transform(fn) {
    data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
  });
  headers.normalize();
  return data;
}
},{"./../utils.js":"../../node_modules/axios/lib/utils.js","../defaults/index.js":"../../node_modules/axios/lib/defaults/index.js","../core/AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js"}],"../../node_modules/axios/lib/cancel/isCancel.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isCancel;
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
},{}],"../../node_modules/axios/lib/cancel/CanceledError.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
var _utils = _interopRequireDefault(require("../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */
function CanceledError(message, config, request) {
  // eslint-disable-next-line no-eq-null,eqeqeq
  _AxiosError.default.call(this, message == null ? 'canceled' : message, _AxiosError.default.ERR_CANCELED, config, request);
  this.name = 'CanceledError';
}
_utils.default.inherits(CanceledError, _AxiosError.default, {
  __CANCEL__: true
});
var _default = exports.default = CanceledError;
},{"../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/core/settle.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = settle;
var _AxiosError = _interopRequireDefault(require("./AxiosError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */
function settle(resolve, reject, response) {
  const validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(new _AxiosError.default('Request failed with status code ' + response.status, [_AxiosError.default.ERR_BAD_REQUEST, _AxiosError.default.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
  }
}
},{"./AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js"}],"../../node_modules/axios/lib/helpers/parseProtocol.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseProtocol;
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || '';
}
},{}],"../../node_modules/axios/lib/helpers/speedometer.js":[function(require,module,exports) {
'use strict';

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== undefined ? min : 1000;
  return function push(chunkLength) {
    const now = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now - startedAt;
    return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
  };
}
var _default = exports.default = speedometer;
},{}],"../../node_modules/axios/lib/helpers/throttle.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */
function throttle(fn, freq) {
  let timestamp = 0;
  let threshold = 1000 / freq;
  let lastArgs;
  let timer;
  const invoke = (args, now = Date.now()) => {
    timestamp = now;
    lastArgs = null;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    fn(...args);
  };
  const throttled = (...args) => {
    const now = Date.now();
    const passed = now - timestamp;
    if (passed >= threshold) {
      invoke(args, now);
    } else {
      lastArgs = args;
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          invoke(lastArgs);
        }, threshold - passed);
      }
    }
  };
  const flush = () => lastArgs && invoke(lastArgs);
  return [throttled, flush];
}
var _default = exports.default = throttle;
},{}],"../../node_modules/axios/lib/helpers/progressEventReducer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progressEventReducer = exports.progressEventDecorator = exports.asyncDecorator = void 0;
var _speedometer2 = _interopRequireDefault(require("./speedometer.js"));
var _throttle = _interopRequireDefault(require("./throttle.js"));
var _utils = _interopRequireDefault(require("../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const progressEventReducer = (listener, isDownloadStream, freq = 3) => {
  let bytesNotified = 0;
  const _speedometer = (0, _speedometer2.default)(50, 250);
  return (0, _throttle.default)(e => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : undefined;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : undefined,
      bytes: progressBytes,
      rate: rate ? rate : undefined,
      estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
      event: e,
      lengthComputable: total != null,
      [isDownloadStream ? 'download' : 'upload']: true
    };
    listener(data);
  }, freq);
};
exports.progressEventReducer = progressEventReducer;
const progressEventDecorator = (total, throttled) => {
  const lengthComputable = total != null;
  return [loaded => throttled[0]({
    lengthComputable,
    total,
    loaded
  }), throttled[1]];
};
exports.progressEventDecorator = progressEventDecorator;
const asyncDecorator = fn => (...args) => _utils.default.asap(() => fn(...args));
exports.asyncDecorator = asyncDecorator;
},{"./speedometer.js":"../../node_modules/axios/lib/helpers/speedometer.js","./throttle.js":"../../node_modules/axios/lib/helpers/throttle.js","../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/helpers/isURLSameOrigin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = _interopRequireDefault(require("../platform/index.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = _index.default.hasStandardBrowserEnv ? ((origin, isMSIE) => url => {
  url = new URL(url, _index.default.origin);
  return origin.protocol === url.protocol && origin.host === url.host && (isMSIE || origin.port === url.port);
})(new URL(_index.default.origin), _index.default.navigator && /(msie|trident)/i.test(_index.default.navigator.userAgent)) : () => true;
},{"../platform/index.js":"../../node_modules/axios/lib/platform/index.js"}],"../../node_modules/axios/lib/helpers/cookies.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("./../utils.js"));
var _index = _interopRequireDefault(require("../platform/index.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = exports.default = _index.default.hasStandardBrowserEnv ?
// Standard browser envs support document.cookie
{
  write(name, value, expires, path, domain, secure, sameSite) {
    if (typeof document === 'undefined') return;
    const cookie = [`${name}=${encodeURIComponent(value)}`];
    if (_utils.default.isNumber(expires)) {
      cookie.push(`expires=${new Date(expires).toUTCString()}`);
    }
    if (_utils.default.isString(path)) {
      cookie.push(`path=${path}`);
    }
    if (_utils.default.isString(domain)) {
      cookie.push(`domain=${domain}`);
    }
    if (secure === true) {
      cookie.push('secure');
    }
    if (_utils.default.isString(sameSite)) {
      cookie.push(`SameSite=${sameSite}`);
    }
    document.cookie = cookie.join('; ');
  },
  read(name) {
    if (typeof document === 'undefined') return null;
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  },
  remove(name) {
    this.write(name, '', Date.now() - 86400000, '/');
  }
} :
// Non-standard browser env (web workers, react-native) lack needed support.
{
  write() {},
  read() {
    return null;
  },
  remove() {}
};
},{"./../utils.js":"../../node_modules/axios/lib/utils.js","../platform/index.js":"../../node_modules/axios/lib/platform/index.js"}],"../../node_modules/axios/lib/helpers/isAbsoluteURL.js":[function(require,module,exports) {
'use strict';

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAbsoluteURL;
function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
},{}],"../../node_modules/axios/lib/helpers/combineURLs.js":[function(require,module,exports) {
'use strict';

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = combineURLs;
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/?\/$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
}
},{}],"../../node_modules/axios/lib/core/buildFullPath.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildFullPath;
var _isAbsoluteURL = _interopRequireDefault(require("../helpers/isAbsoluteURL.js"));
var _combineURLs = _interopRequireDefault(require("../helpers/combineURLs.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */
function buildFullPath(baseURL, requestedURL, allowAbsoluteUrls) {
  let isRelativeUrl = !(0, _isAbsoluteURL.default)(requestedURL);
  if (baseURL && (isRelativeUrl || allowAbsoluteUrls == false)) {
    return (0, _combineURLs.default)(baseURL, requestedURL);
  }
  return requestedURL;
}
},{"../helpers/isAbsoluteURL.js":"../../node_modules/axios/lib/helpers/isAbsoluteURL.js","../helpers/combineURLs.js":"../../node_modules/axios/lib/helpers/combineURLs.js"}],"../../node_modules/axios/lib/core/mergeConfig.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeConfig;
var _utils = _interopRequireDefault(require("../utils.js"));
var _AxiosHeaders = _interopRequireDefault(require("./AxiosHeaders.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const headersToObject = thing => thing instanceof _AxiosHeaders.default ? {
  ...thing
} : thing;

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */
function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  const config = {};
  function getMergedValue(target, source, prop, caseless) {
    if (_utils.default.isPlainObject(target) && _utils.default.isPlainObject(source)) {
      return _utils.default.merge.call({
        caseless
      }, target, source);
    } else if (_utils.default.isPlainObject(source)) {
      return _utils.default.merge({}, source);
    } else if (_utils.default.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  // eslint-disable-next-line consistent-return
  function mergeDeepProperties(a, b, prop, caseless) {
    if (!_utils.default.isUndefined(b)) {
      return getMergedValue(a, b, prop, caseless);
    } else if (!_utils.default.isUndefined(a)) {
      return getMergedValue(undefined, a, prop, caseless);
    }
  }

  // eslint-disable-next-line consistent-return
  function valueFromConfig2(a, b) {
    if (!_utils.default.isUndefined(b)) {
      return getMergedValue(undefined, b);
    }
  }

  // eslint-disable-next-line consistent-return
  function defaultToConfig2(a, b) {
    if (!_utils.default.isUndefined(b)) {
      return getMergedValue(undefined, b);
    } else if (!_utils.default.isUndefined(a)) {
      return getMergedValue(undefined, a);
    }
  }

  // eslint-disable-next-line consistent-return
  function mergeDirectKeys(a, b, prop) {
    if (prop in config2) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(undefined, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    withXSRFToken: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b, prop) => mergeDeepProperties(headersToObject(a), headersToObject(b), prop, true)
  };
  _utils.default.forEach(Object.keys({
    ...config1,
    ...config2
  }), function computeConfigValue(prop) {
    const merge = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge(config1[prop], config2[prop], prop);
    _utils.default.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
  });
  return config;
}
},{"../utils.js":"../../node_modules/axios/lib/utils.js","./AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js"}],"../../node_modules/axios/lib/helpers/resolveConfig.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _index = _interopRequireDefault(require("../platform/index.js"));
var _utils = _interopRequireDefault(require("../utils.js"));
var _isURLSameOrigin = _interopRequireDefault(require("./isURLSameOrigin.js"));
var _cookies = _interopRequireDefault(require("./cookies.js"));
var _buildFullPath = _interopRequireDefault(require("../core/buildFullPath.js"));
var _mergeConfig = _interopRequireDefault(require("../core/mergeConfig.js"));
var _AxiosHeaders = _interopRequireDefault(require("../core/AxiosHeaders.js"));
var _buildURL = _interopRequireDefault(require("./buildURL.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var _default = config => {
  const newConfig = (0, _mergeConfig.default)({}, config);
  let {
    data,
    withXSRFToken,
    xsrfHeaderName,
    xsrfCookieName,
    headers,
    auth
  } = newConfig;
  newConfig.headers = headers = _AxiosHeaders.default.from(headers);
  newConfig.url = (0, _buildURL.default)((0, _buildFullPath.default)(newConfig.baseURL, newConfig.url, newConfig.allowAbsoluteUrls), config.params, config.paramsSerializer);

  // HTTP basic authentication
  if (auth) {
    headers.set('Authorization', 'Basic ' + btoa((auth.username || '') + ':' + (auth.password ? unescape(encodeURIComponent(auth.password)) : '')));
  }
  if (_utils.default.isFormData(data)) {
    if (_index.default.hasStandardBrowserEnv || _index.default.hasStandardBrowserWebWorkerEnv) {
      headers.setContentType(undefined); // browser handles it
    } else if (_utils.default.isFunction(data.getHeaders)) {
      // Node.js FormData (like form-data package)
      const formHeaders = data.getHeaders();
      // Only set safe headers to avoid overwriting security headers
      const allowedHeaders = ['content-type', 'content-length'];
      Object.entries(formHeaders).forEach(([key, val]) => {
        if (allowedHeaders.includes(key.toLowerCase())) {
          headers.set(key, val);
        }
      });
    }
  }

  // Add xsrf header
  // This is only done if running in a standard browser environment.
  // Specifically not if we're in a web worker, or react-native.

  if (_index.default.hasStandardBrowserEnv) {
    withXSRFToken && _utils.default.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(newConfig));
    if (withXSRFToken || withXSRFToken !== false && (0, _isURLSameOrigin.default)(newConfig.url)) {
      // Add xsrf header
      const xsrfValue = xsrfHeaderName && xsrfCookieName && _cookies.default.read(xsrfCookieName);
      if (xsrfValue) {
        headers.set(xsrfHeaderName, xsrfValue);
      }
    }
  }
  return newConfig;
};
exports.default = _default;
},{"../platform/index.js":"../../node_modules/axios/lib/platform/index.js","../utils.js":"../../node_modules/axios/lib/utils.js","./isURLSameOrigin.js":"../../node_modules/axios/lib/helpers/isURLSameOrigin.js","./cookies.js":"../../node_modules/axios/lib/helpers/cookies.js","../core/buildFullPath.js":"../../node_modules/axios/lib/core/buildFullPath.js","../core/mergeConfig.js":"../../node_modules/axios/lib/core/mergeConfig.js","../core/AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js","./buildURL.js":"../../node_modules/axios/lib/helpers/buildURL.js"}],"../../node_modules/axios/lib/adapters/xhr.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("./../utils.js"));
var _settle = _interopRequireDefault(require("./../core/settle.js"));
var _transitional = _interopRequireDefault(require("../defaults/transitional.js"));
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
var _CanceledError = _interopRequireDefault(require("../cancel/CanceledError.js"));
var _parseProtocol = _interopRequireDefault(require("../helpers/parseProtocol.js"));
var _index = _interopRequireDefault(require("../platform/index.js"));
var _AxiosHeaders = _interopRequireDefault(require("../core/AxiosHeaders.js"));
var _progressEventReducer = require("../helpers/progressEventReducer.js");
var _resolveConfig = _interopRequireDefault(require("../helpers/resolveConfig.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const isXHRAdapterSupported = typeof XMLHttpRequest !== 'undefined';
var _default = exports.default = isXHRAdapterSupported && function (config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    const _config = (0, _resolveConfig.default)(config);
    let requestData = _config.data;
    const requestHeaders = _AxiosHeaders.default.from(_config.headers).normalize();
    let {
      responseType,
      onUploadProgress,
      onDownloadProgress
    } = _config;
    let onCanceled;
    let uploadThrottled, downloadThrottled;
    let flushUpload, flushDownload;
    function done() {
      flushUpload && flushUpload(); // flush events
      flushDownload && flushDownload(); // flush events

      _config.cancelToken && _config.cancelToken.unsubscribe(onCanceled);
      _config.signal && _config.signal.removeEventListener('abort', onCanceled);
    }
    let request = new XMLHttpRequest();
    request.open(_config.method.toUpperCase(), _config.url, true);

    // Set the request timeout in MS
    request.timeout = _config.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      const responseHeaders = _AxiosHeaders.default.from('getAllResponseHeaders' in request && request.getAllResponseHeaders());
      const responseData = !responseType || responseType === 'text' || responseType === 'json' ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      };
      (0, _settle.default)(function _resolve(value) {
        resolve(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);

      // Clean up request
      request = null;
    }
    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new _AxiosError.default('Request aborted', _AxiosError.default.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError(event) {
      // Browsers deliver a ProgressEvent in XHR onerror
      // (message may be empty; when present, surface it)
      // See https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/error_event
      const msg = event && event.message ? event.message : 'Network Error';
      const err = new _AxiosError.default(msg, _AxiosError.default.ERR_NETWORK, config, request);
      // attach the underlying event for consumers who want details
      err.event = event || null;
      reject(err);
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = _config.timeout ? 'timeout of ' + _config.timeout + 'ms exceeded' : 'timeout exceeded';
      const transitional = _config.transitional || _transitional.default;
      if (_config.timeoutErrorMessage) {
        timeoutErrorMessage = _config.timeoutErrorMessage;
      }
      reject(new _AxiosError.default(timeoutErrorMessage, transitional.clarifyTimeoutError ? _AxiosError.default.ETIMEDOUT : _AxiosError.default.ECONNABORTED, config, request));

      // Clean up request
      request = null;
    };

    // Remove Content-Type if data is undefined
    requestData === undefined && requestHeaders.setContentType(null);

    // Add headers to the request
    if ('setRequestHeader' in request) {
      _utils.default.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }

    // Add withCredentials to request if needed
    if (!_utils.default.isUndefined(_config.withCredentials)) {
      request.withCredentials = !!_config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = _config.responseType;
    }

    // Handle progress if needed
    if (onDownloadProgress) {
      [downloadThrottled, flushDownload] = (0, _progressEventReducer.progressEventReducer)(onDownloadProgress, true);
      request.addEventListener('progress', downloadThrottled);
    }

    // Not all browsers support upload events
    if (onUploadProgress && request.upload) {
      [uploadThrottled, flushUpload] = (0, _progressEventReducer.progressEventReducer)(onUploadProgress);
      request.upload.addEventListener('progress', uploadThrottled);
      request.upload.addEventListener('loadend', flushUpload);
    }
    if (_config.cancelToken || _config.signal) {
      // Handle cancellation
      // eslint-disable-next-line func-names
      onCanceled = cancel => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new _CanceledError.default(null, config, request) : cancel);
        request.abort();
        request = null;
      };
      _config.cancelToken && _config.cancelToken.subscribe(onCanceled);
      if (_config.signal) {
        _config.signal.aborted ? onCanceled() : _config.signal.addEventListener('abort', onCanceled);
      }
    }
    const protocol = (0, _parseProtocol.default)(_config.url);
    if (protocol && _index.default.protocols.indexOf(protocol) === -1) {
      reject(new _AxiosError.default('Unsupported protocol ' + protocol + ':', _AxiosError.default.ERR_BAD_REQUEST, config));
      return;
    }

    // Send the request
    request.send(requestData || null);
  });
};
},{"./../utils.js":"../../node_modules/axios/lib/utils.js","./../core/settle.js":"../../node_modules/axios/lib/core/settle.js","../defaults/transitional.js":"../../node_modules/axios/lib/defaults/transitional.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","../cancel/CanceledError.js":"../../node_modules/axios/lib/cancel/CanceledError.js","../helpers/parseProtocol.js":"../../node_modules/axios/lib/helpers/parseProtocol.js","../platform/index.js":"../../node_modules/axios/lib/platform/index.js","../core/AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js","../helpers/progressEventReducer.js":"../../node_modules/axios/lib/helpers/progressEventReducer.js","../helpers/resolveConfig.js":"../../node_modules/axios/lib/helpers/resolveConfig.js"}],"../../node_modules/axios/lib/helpers/composeSignals.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CanceledError = _interopRequireDefault(require("../cancel/CanceledError.js"));
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
var _utils = _interopRequireDefault(require("../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const composeSignals = (signals, timeout) => {
  const {
    length
  } = signals = signals ? signals.filter(Boolean) : [];
  if (timeout || length) {
    let controller = new AbortController();
    let aborted;
    const onabort = function (reason) {
      if (!aborted) {
        aborted = true;
        unsubscribe();
        const err = reason instanceof Error ? reason : this.reason;
        controller.abort(err instanceof _AxiosError.default ? err : new _CanceledError.default(err instanceof Error ? err.message : err));
      }
    };
    let timer = timeout && setTimeout(() => {
      timer = null;
      onabort(new _AxiosError.default(`timeout ${timeout} of ms exceeded`, _AxiosError.default.ETIMEDOUT));
    }, timeout);
    const unsubscribe = () => {
      if (signals) {
        timer && clearTimeout(timer);
        timer = null;
        signals.forEach(signal => {
          signal.unsubscribe ? signal.unsubscribe(onabort) : signal.removeEventListener('abort', onabort);
        });
        signals = null;
      }
    };
    signals.forEach(signal => signal.addEventListener('abort', onabort));
    const {
      signal
    } = controller;
    signal.unsubscribe = () => _utils.default.asap(unsubscribe);
    return signal;
  }
};
var _default = exports.default = composeSignals;
},{"../cancel/CanceledError.js":"../../node_modules/axios/lib/cancel/CanceledError.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/helpers/trackStream.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trackStream = exports.streamChunk = exports.readBytes = void 0;
const streamChunk = function* (chunk, chunkSize) {
  let len = chunk.byteLength;
  if (!chunkSize || len < chunkSize) {
    yield chunk;
    return;
  }
  let pos = 0;
  let end;
  while (pos < len) {
    end = pos + chunkSize;
    yield chunk.slice(pos, end);
    pos = end;
  }
};
exports.streamChunk = streamChunk;
const readBytes = async function* (iterable, chunkSize) {
  for await (const chunk of readStream(iterable)) {
    yield* streamChunk(chunk, chunkSize);
  }
};
exports.readBytes = readBytes;
const readStream = async function* (stream) {
  if (stream[Symbol.asyncIterator]) {
    yield* stream;
    return;
  }
  const reader = stream.getReader();
  try {
    for (;;) {
      const {
        done,
        value
      } = await reader.read();
      if (done) {
        break;
      }
      yield value;
    }
  } finally {
    await reader.cancel();
  }
};
const trackStream = (stream, chunkSize, onProgress, onFinish) => {
  const iterator = readBytes(stream, chunkSize);
  let bytes = 0;
  let done;
  let _onFinish = e => {
    if (!done) {
      done = true;
      onFinish && onFinish(e);
    }
  };
  return new ReadableStream({
    async pull(controller) {
      try {
        const {
          done,
          value
        } = await iterator.next();
        if (done) {
          _onFinish();
          controller.close();
          return;
        }
        let len = value.byteLength;
        if (onProgress) {
          let loadedBytes = bytes += len;
          onProgress(loadedBytes);
        }
        controller.enqueue(new Uint8Array(value));
      } catch (err) {
        _onFinish(err);
        throw err;
      }
    },
    cancel(reason) {
      _onFinish(reason);
      return iterator.return();
    }
  }, {
    highWaterMark: 2
  });
};
exports.trackStream = trackStream;
},{}],"../../node_modules/axios/lib/adapters/fetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFetch = exports.default = void 0;
var _index = _interopRequireDefault(require("../platform/index.js"));
var _utils = _interopRequireDefault(require("../utils.js"));
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
var _composeSignals = _interopRequireDefault(require("../helpers/composeSignals.js"));
var _trackStream = require("../helpers/trackStream.js");
var _AxiosHeaders = _interopRequireDefault(require("../core/AxiosHeaders.js"));
var _progressEventReducer = require("../helpers/progressEventReducer.js");
var _resolveConfig = _interopRequireDefault(require("../helpers/resolveConfig.js"));
var _settle = _interopRequireDefault(require("../core/settle.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const DEFAULT_CHUNK_SIZE = 64 * 1024;
const {
  isFunction
} = _utils.default;
const globalFetchAPI = (({
  Request,
  Response
}) => ({
  Request,
  Response
}))(_utils.default.global);
const {
  ReadableStream,
  TextEncoder
} = _utils.default.global;
const test = (fn, ...args) => {
  try {
    return !!fn(...args);
  } catch (e) {
    return false;
  }
};
const factory = env => {
  env = _utils.default.merge.call({
    skipUndefined: true
  }, globalFetchAPI, env);
  const {
    fetch: envFetch,
    Request,
    Response
  } = env;
  const isFetchSupported = envFetch ? isFunction(envFetch) : typeof fetch === 'function';
  const isRequestSupported = isFunction(Request);
  const isResponseSupported = isFunction(Response);
  if (!isFetchSupported) {
    return false;
  }
  const isReadableStreamSupported = isFetchSupported && isFunction(ReadableStream);
  const encodeText = isFetchSupported && (typeof TextEncoder === 'function' ? (encoder => str => encoder.encode(str))(new TextEncoder()) : async str => new Uint8Array(await new Request(str).arrayBuffer()));
  const supportsRequestStream = isRequestSupported && isReadableStreamSupported && test(() => {
    let duplexAccessed = false;
    const hasContentType = new Request(_index.default.origin, {
      body: new ReadableStream(),
      method: 'POST',
      get duplex() {
        duplexAccessed = true;
        return 'half';
      }
    }).headers.has('Content-Type');
    return duplexAccessed && !hasContentType;
  });
  const supportsResponseStream = isResponseSupported && isReadableStreamSupported && test(() => _utils.default.isReadableStream(new Response('').body));
  const resolvers = {
    stream: supportsResponseStream && (res => res.body)
  };
  isFetchSupported && (() => {
    ['text', 'arrayBuffer', 'blob', 'formData', 'stream'].forEach(type => {
      !resolvers[type] && (resolvers[type] = (res, config) => {
        let method = res && res[type];
        if (method) {
          return method.call(res);
        }
        throw new _AxiosError.default(`Response type '${type}' is not supported`, _AxiosError.default.ERR_NOT_SUPPORT, config);
      });
    });
  })();
  const getBodyLength = async body => {
    if (body == null) {
      return 0;
    }
    if (_utils.default.isBlob(body)) {
      return body.size;
    }
    if (_utils.default.isSpecCompliantForm(body)) {
      const _request = new Request(_index.default.origin, {
        method: 'POST',
        body
      });
      return (await _request.arrayBuffer()).byteLength;
    }
    if (_utils.default.isArrayBufferView(body) || _utils.default.isArrayBuffer(body)) {
      return body.byteLength;
    }
    if (_utils.default.isURLSearchParams(body)) {
      body = body + '';
    }
    if (_utils.default.isString(body)) {
      return (await encodeText(body)).byteLength;
    }
  };
  const resolveBodyLength = async (headers, body) => {
    const length = _utils.default.toFiniteNumber(headers.getContentLength());
    return length == null ? getBodyLength(body) : length;
  };
  return async config => {
    let {
      url,
      method,
      data,
      signal,
      cancelToken,
      timeout,
      onDownloadProgress,
      onUploadProgress,
      responseType,
      headers,
      withCredentials = 'same-origin',
      fetchOptions
    } = (0, _resolveConfig.default)(config);
    let _fetch = envFetch || fetch;
    responseType = responseType ? (responseType + '').toLowerCase() : 'text';
    let composedSignal = (0, _composeSignals.default)([signal, cancelToken && cancelToken.toAbortSignal()], timeout);
    let request = null;
    const unsubscribe = composedSignal && composedSignal.unsubscribe && (() => {
      composedSignal.unsubscribe();
    });
    let requestContentLength;
    try {
      if (onUploadProgress && supportsRequestStream && method !== 'get' && method !== 'head' && (requestContentLength = await resolveBodyLength(headers, data)) !== 0) {
        let _request = new Request(url, {
          method: 'POST',
          body: data,
          duplex: "half"
        });
        let contentTypeHeader;
        if (_utils.default.isFormData(data) && (contentTypeHeader = _request.headers.get('content-type'))) {
          headers.setContentType(contentTypeHeader);
        }
        if (_request.body) {
          const [onProgress, flush] = (0, _progressEventReducer.progressEventDecorator)(requestContentLength, (0, _progressEventReducer.progressEventReducer)((0, _progressEventReducer.asyncDecorator)(onUploadProgress)));
          data = (0, _trackStream.trackStream)(_request.body, DEFAULT_CHUNK_SIZE, onProgress, flush);
        }
      }
      if (!_utils.default.isString(withCredentials)) {
        withCredentials = withCredentials ? 'include' : 'omit';
      }

      // Cloudflare Workers throws when credentials are defined
      // see https://github.com/cloudflare/workerd/issues/902
      const isCredentialsSupported = isRequestSupported && "credentials" in Request.prototype;
      const resolvedOptions = {
        ...fetchOptions,
        signal: composedSignal,
        method: method.toUpperCase(),
        headers: headers.normalize().toJSON(),
        body: data,
        duplex: "half",
        credentials: isCredentialsSupported ? withCredentials : undefined
      };
      request = isRequestSupported && new Request(url, resolvedOptions);
      let response = await (isRequestSupported ? _fetch(request, fetchOptions) : _fetch(url, resolvedOptions));
      const isStreamResponse = supportsResponseStream && (responseType === 'stream' || responseType === 'response');
      if (supportsResponseStream && (onDownloadProgress || isStreamResponse && unsubscribe)) {
        const options = {};
        ['status', 'statusText', 'headers'].forEach(prop => {
          options[prop] = response[prop];
        });
        const responseContentLength = _utils.default.toFiniteNumber(response.headers.get('content-length'));
        const [onProgress, flush] = onDownloadProgress && (0, _progressEventReducer.progressEventDecorator)(responseContentLength, (0, _progressEventReducer.progressEventReducer)((0, _progressEventReducer.asyncDecorator)(onDownloadProgress), true)) || [];
        response = new Response((0, _trackStream.trackStream)(response.body, DEFAULT_CHUNK_SIZE, onProgress, () => {
          flush && flush();
          unsubscribe && unsubscribe();
        }), options);
      }
      responseType = responseType || 'text';
      let responseData = await resolvers[_utils.default.findKey(resolvers, responseType) || 'text'](response, config);
      !isStreamResponse && unsubscribe && unsubscribe();
      return await new Promise((resolve, reject) => {
        (0, _settle.default)(resolve, reject, {
          data: responseData,
          headers: _AxiosHeaders.default.from(response.headers),
          status: response.status,
          statusText: response.statusText,
          config,
          request
        });
      });
    } catch (err) {
      unsubscribe && unsubscribe();
      if (err && err.name === 'TypeError' && /Load failed|fetch/i.test(err.message)) {
        throw Object.assign(new _AxiosError.default('Network Error', _AxiosError.default.ERR_NETWORK, config, request), {
          cause: err.cause || err
        });
      }
      throw _AxiosError.default.from(err, err && err.code, config, request);
    }
  };
};
const seedCache = new Map();
const getFetch = config => {
  let env = config && config.env || {};
  const {
    fetch,
    Request,
    Response
  } = env;
  const seeds = [Request, Response, fetch];
  let len = seeds.length,
    i = len,
    seed,
    target,
    map = seedCache;
  while (i--) {
    seed = seeds[i];
    target = map.get(seed);
    target === undefined && map.set(seed, target = i ? new Map() : factory(env));
    map = target;
  }
  return target;
};
exports.getFetch = getFetch;
const adapter = getFetch();
var _default = exports.default = adapter;
},{"../platform/index.js":"../../node_modules/axios/lib/platform/index.js","../utils.js":"../../node_modules/axios/lib/utils.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","../helpers/composeSignals.js":"../../node_modules/axios/lib/helpers/composeSignals.js","../helpers/trackStream.js":"../../node_modules/axios/lib/helpers/trackStream.js","../core/AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js","../helpers/progressEventReducer.js":"../../node_modules/axios/lib/helpers/progressEventReducer.js","../helpers/resolveConfig.js":"../../node_modules/axios/lib/helpers/resolveConfig.js","../core/settle.js":"../../node_modules/axios/lib/core/settle.js"}],"../../node_modules/axios/lib/adapters/adapters.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("../utils.js"));
var _http = _interopRequireDefault(require("./http.js"));
var _xhr = _interopRequireDefault(require("./xhr.js"));
var fetchAdapter = _interopRequireWildcard(require("./fetch.js"));
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Known adapters mapping.
 * Provides environment-specific adapters for Axios:
 * - `http` for Node.js
 * - `xhr` for browsers
 * - `fetch` for fetch API-based requests
 * 
 * @type {Object<string, Function|Object>}
 */
const knownAdapters = {
  http: _http.default,
  xhr: _xhr.default,
  fetch: {
    get: fetchAdapter.getFetch
  }
};

// Assign adapter names for easier debugging and identification
_utils.default.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, 'name', {
        value
      });
    } catch (e) {
      // eslint-disable-next-line no-empty
    }
    Object.defineProperty(fn, 'adapterName', {
      value
    });
  }
});

/**
 * Render a rejection reason string for unknown or unsupported adapters
 * 
 * @param {string} reason
 * @returns {string}
 */
const renderReason = reason => `- ${reason}`;

/**
 * Check if the adapter is resolved (function, null, or false)
 * 
 * @param {Function|null|false} adapter
 * @returns {boolean}
 */
const isResolvedHandle = adapter => _utils.default.isFunction(adapter) || adapter === null || adapter === false;

/**
 * Get the first suitable adapter from the provided list.
 * Tries each adapter in order until a supported one is found.
 * Throws an AxiosError if no adapter is suitable.
 * 
 * @param {Array<string|Function>|string|Function} adapters - Adapter(s) by name or function.
 * @param {Object} config - Axios request configuration
 * @throws {AxiosError} If no suitable adapter is available
 * @returns {Function} The resolved adapter function
 */
function getAdapter(adapters, config) {
  adapters = _utils.default.isArray(adapters) ? adapters : [adapters];
  const {
    length
  } = adapters;
  let nameOrAdapter;
  let adapter;
  const rejectedReasons = {};
  for (let i = 0; i < length; i++) {
    nameOrAdapter = adapters[i];
    let id;
    adapter = nameOrAdapter;
    if (!isResolvedHandle(nameOrAdapter)) {
      adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
      if (adapter === undefined) {
        throw new _AxiosError.default(`Unknown adapter '${id}'`);
      }
    }
    if (adapter && (_utils.default.isFunction(adapter) || (adapter = adapter.get(config)))) {
      break;
    }
    rejectedReasons[id || '#' + i] = adapter;
  }
  if (!adapter) {
    const reasons = Object.entries(rejectedReasons).map(([id, state]) => `adapter ${id} ` + (state === false ? 'is not supported by the environment' : 'is not available in the build'));
    let s = length ? reasons.length > 1 ? 'since :\n' + reasons.map(renderReason).join('\n') : ' ' + renderReason(reasons[0]) : 'as no adapter specified';
    throw new _AxiosError.default(`There is no suitable adapter to dispatch the request ` + s, 'ERR_NOT_SUPPORT');
  }
  return adapter;
}

/**
 * Exports Axios adapters and utility to resolve an adapter
 */
var _default = exports.default = {
  /**
   * Resolve an adapter from a list of adapter names or functions.
   * @type {Function}
   */
  getAdapter,
  /**
   * Exposes all known adapters
   * @type {Object<string, Function|Object>}
   */
  adapters: knownAdapters
};
},{"../utils.js":"../../node_modules/axios/lib/utils.js","./http.js":"../../node_modules/axios/lib/helpers/null.js","./xhr.js":"../../node_modules/axios/lib/adapters/xhr.js","./fetch.js":"../../node_modules/axios/lib/adapters/fetch.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js"}],"../../node_modules/axios/lib/core/dispatchRequest.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dispatchRequest;
var _transformData = _interopRequireDefault(require("./transformData.js"));
var _isCancel = _interopRequireDefault(require("../cancel/isCancel.js"));
var _index = _interopRequireDefault(require("../defaults/index.js"));
var _CanceledError = _interopRequireDefault(require("../cancel/CanceledError.js"));
var _AxiosHeaders = _interopRequireDefault(require("../core/AxiosHeaders.js"));
var _adapters = _interopRequireDefault(require("../adapters/adapters.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
  if (config.signal && config.signal.aborted) {
    throw new _CanceledError.default(null, config);
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */
function dispatchRequest(config) {
  throwIfCancellationRequested(config);
  config.headers = _AxiosHeaders.default.from(config.headers);

  // Transform request data
  config.data = _transformData.default.call(config, config.transformRequest);
  if (['post', 'put', 'patch'].indexOf(config.method) !== -1) {
    config.headers.setContentType('application/x-www-form-urlencoded', false);
  }
  const adapter = _adapters.default.getAdapter(config.adapter || _index.default.adapter, config);
  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = _transformData.default.call(config, config.transformResponse, response);
    response.headers = _AxiosHeaders.default.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!(0, _isCancel.default)(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = _transformData.default.call(config, config.transformResponse, reason.response);
        reason.response.headers = _AxiosHeaders.default.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
},{"./transformData.js":"../../node_modules/axios/lib/core/transformData.js","../cancel/isCancel.js":"../../node_modules/axios/lib/cancel/isCancel.js","../defaults/index.js":"../../node_modules/axios/lib/defaults/index.js","../cancel/CanceledError.js":"../../node_modules/axios/lib/cancel/CanceledError.js","../core/AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js","../adapters/adapters.js":"../../node_modules/axios/lib/adapters/adapters.js"}],"../../node_modules/axios/lib/env/data.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = void 0;
const VERSION = exports.VERSION = "1.13.2";
},{}],"../../node_modules/axios/lib/helpers/validator.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _data = require("../env/data.js");
var _AxiosError = _interopRequireDefault(require("../core/AxiosError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach((type, i) => {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});
const deprecatedWarnings = {};

/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  function formatMessage(opt, desc) {
    return '[Axios v' + _data.VERSION + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return (value, opt, opts) => {
    if (validator === false) {
      throw new _AxiosError.default(formatMessage(opt, ' has been removed' + (version ? ' in ' + version : '')), _AxiosError.default.ERR_DEPRECATED);
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(formatMessage(opt, ' has been deprecated since v' + version + ' and will be removed in the near future'));
    }
    return validator ? validator(value, opt, opts) : true;
  };
};
validators.spelling = function spelling(correctSpelling) {
  return (value, opt) => {
    // eslint-disable-next-line no-console
    console.warn(`${opt} is likely a misspelling of ${correctSpelling}`);
    return true;
  };
};

/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new _AxiosError.default('options must be an object', _AxiosError.default.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator = schema[opt];
    if (validator) {
      const value = options[opt];
      const result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new _AxiosError.default('option ' + opt + ' must be ' + result, _AxiosError.default.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new _AxiosError.default('Unknown option ' + opt, _AxiosError.default.ERR_BAD_OPTION);
    }
  }
}
var _default = exports.default = {
  assertOptions,
  validators
};
},{"../env/data.js":"../../node_modules/axios/lib/env/data.js","../core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js"}],"../../node_modules/axios/lib/core/Axios.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("./../utils.js"));
var _buildURL = _interopRequireDefault(require("../helpers/buildURL.js"));
var _InterceptorManager = _interopRequireDefault(require("./InterceptorManager.js"));
var _dispatchRequest = _interopRequireDefault(require("./dispatchRequest.js"));
var _mergeConfig = _interopRequireDefault(require("./mergeConfig.js"));
var _buildFullPath = _interopRequireDefault(require("./buildFullPath.js"));
var _validator = _interopRequireDefault(require("../helpers/validator.js"));
var _AxiosHeaders = _interopRequireDefault(require("./AxiosHeaders.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const validators = _validator.default.validators;

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig || {};
    this.interceptors = {
      request: new _InterceptorManager.default(),
      response: new _InterceptorManager.default()
    };
  }

  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  async request(configOrUrl, config) {
    try {
      return await this._request(configOrUrl, config);
    } catch (err) {
      if (err instanceof Error) {
        let dummy = {};
        Error.captureStackTrace ? Error.captureStackTrace(dummy) : dummy = new Error();

        // slice off the Error: ... line
        const stack = dummy.stack ? dummy.stack.replace(/^.+\n/, '') : '';
        try {
          if (!err.stack) {
            err.stack = stack;
            // match without the 2 top stack lines
          } else if (stack && !String(err.stack).endsWith(stack.replace(/^.+\n.+\n/, ''))) {
            err.stack += '\n' + stack;
          }
        } catch (e) {
          // ignore the case where "stack" is an un-writable property
        }
      }
      throw err;
    }
  }
  _request(configOrUrl, config) {
    /*eslint no-param-reassign:0*/
    // Allow for axios('example/url'[, config]) a la fetch API
    if (typeof configOrUrl === 'string') {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = (0, _mergeConfig.default)(this.defaults, config);
    const {
      transitional,
      paramsSerializer,
      headers
    } = config;
    if (transitional !== undefined) {
      _validator.default.assertOptions(transitional, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (_utils.default.isFunction(paramsSerializer)) {
        config.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        _validator.default.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }

    // Set config.allowAbsoluteUrls
    if (config.allowAbsoluteUrls !== undefined) {
      // do nothing
    } else if (this.defaults.allowAbsoluteUrls !== undefined) {
      config.allowAbsoluteUrls = this.defaults.allowAbsoluteUrls;
    } else {
      config.allowAbsoluteUrls = true;
    }
    _validator.default.assertOptions(config, {
      baseUrl: validators.spelling('baseURL'),
      withXsrfToken: validators.spelling('withXSRFToken')
    }, true);

    // Set config.method
    config.method = (config.method || this.defaults.method || 'get').toLowerCase();

    // Flatten headers
    let contextHeaders = headers && _utils.default.merge(headers.common, headers[config.method]);
    headers && _utils.default.forEach(['delete', 'get', 'head', 'post', 'put', 'patch', 'common'], method => {
      delete headers[method];
    });
    config.headers = _AxiosHeaders.default.concat(contextHeaders, headers);

    // filter out skipped interceptors
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [_dispatchRequest.default.bind(this), undefined];
      chain.unshift(...requestInterceptorChain);
      chain.push(...responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected.call(this, error);
        break;
      }
    }
    try {
      promise = _dispatchRequest.default.call(this, newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config) {
    config = (0, _mergeConfig.default)(this.defaults, config);
    const fullPath = (0, _buildFullPath.default)(config.baseURL, config.url, config.allowAbsoluteUrls);
    return (0, _buildURL.default)(fullPath, config.params, config.paramsSerializer);
  }
}

// Provide aliases for supported request methods
_utils.default.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function (url, config) {
    return this.request((0, _mergeConfig.default)(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
_utils.default.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/

  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config) {
      return this.request((0, _mergeConfig.default)(config || {}, {
        method,
        headers: isForm ? {
          'Content-Type': 'multipart/form-data'
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + 'Form'] = generateHTTPMethod(true);
});
var _default = exports.default = Axios;
},{"./../utils.js":"../../node_modules/axios/lib/utils.js","../helpers/buildURL.js":"../../node_modules/axios/lib/helpers/buildURL.js","./InterceptorManager.js":"../../node_modules/axios/lib/core/InterceptorManager.js","./dispatchRequest.js":"../../node_modules/axios/lib/core/dispatchRequest.js","./mergeConfig.js":"../../node_modules/axios/lib/core/mergeConfig.js","./buildFullPath.js":"../../node_modules/axios/lib/core/buildFullPath.js","../helpers/validator.js":"../../node_modules/axios/lib/helpers/validator.js","./AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js"}],"../../node_modules/axios/lib/cancel/CancelToken.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CanceledError = _interopRequireDefault(require("./CanceledError.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */
class CancelToken {
  constructor(executor) {
    if (typeof executor !== 'function') {
      throw new TypeError('executor must be a function.');
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    const token = this;

    // eslint-disable-next-line func-names
    this.promise.then(cancel => {
      if (!token._listeners) return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });

    // eslint-disable-next-line func-names
    this.promise.then = onfulfilled => {
      let _resolve;
      // eslint-disable-next-line func-names
      const promise = new Promise(resolve => {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config, request) {
      if (token.reason) {
        // Cancellation has already been requested
        return;
      }
      token.reason = new _CanceledError.default(message, config, request);
      resolvePromise(token.reason);
    });
  }

  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  /**
   * Subscribe to the cancel signal
   */

  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }

  /**
   * Unsubscribe from the cancel signal
   */

  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  }
  toAbortSignal() {
    const controller = new AbortController();
    const abort = err => {
      controller.abort(err);
    };
    this.subscribe(abort);
    controller.signal.unsubscribe = () => this.unsubscribe(abort);
    return controller.signal;
  }

  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
var _default = exports.default = CancelToken;
},{"./CanceledError.js":"../../node_modules/axios/lib/cancel/CanceledError.js"}],"../../node_modules/axios/lib/helpers/spread.js":[function(require,module,exports) {
'use strict';

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = spread;
function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
}
},{}],"../../node_modules/axios/lib/helpers/isAxiosError.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isAxiosError;
var _utils = _interopRequireDefault(require("./../utils.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
function isAxiosError(payload) {
  return _utils.default.isObject(payload) && payload.isAxiosError === true;
}
},{"./../utils.js":"../../node_modules/axios/lib/utils.js"}],"../../node_modules/axios/lib/helpers/HttpStatusCode.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511,
  WebServerIsDown: 521,
  ConnectionTimedOut: 522,
  OriginIsUnreachable: 523,
  TimeoutOccurred: 524,
  SslHandshakeFailed: 525,
  InvalidSslCertificate: 526
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
var _default = exports.default = HttpStatusCode;
},{}],"../../node_modules/axios/lib/axios.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _utils = _interopRequireDefault(require("./utils.js"));
var _bind = _interopRequireDefault(require("./helpers/bind.js"));
var _Axios = _interopRequireDefault(require("./core/Axios.js"));
var _mergeConfig = _interopRequireDefault(require("./core/mergeConfig.js"));
var _index = _interopRequireDefault(require("./defaults/index.js"));
var _formDataToJSON = _interopRequireDefault(require("./helpers/formDataToJSON.js"));
var _CanceledError = _interopRequireDefault(require("./cancel/CanceledError.js"));
var _CancelToken = _interopRequireDefault(require("./cancel/CancelToken.js"));
var _isCancel = _interopRequireDefault(require("./cancel/isCancel.js"));
var _data = require("./env/data.js");
var _toFormData = _interopRequireDefault(require("./helpers/toFormData.js"));
var _AxiosError = _interopRequireDefault(require("./core/AxiosError.js"));
var _spread = _interopRequireDefault(require("./helpers/spread.js"));
var _isAxiosError = _interopRequireDefault(require("./helpers/isAxiosError.js"));
var _AxiosHeaders = _interopRequireDefault(require("./core/AxiosHeaders.js"));
var _adapters = _interopRequireDefault(require("./adapters/adapters.js"));
var _HttpStatusCode = _interopRequireDefault(require("./helpers/HttpStatusCode.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  const context = new _Axios.default(defaultConfig);
  const instance = (0, _bind.default)(_Axios.default.prototype.request, context);

  // Copy axios.prototype to instance
  _utils.default.extend(instance, _Axios.default.prototype, context, {
    allOwnKeys: true
  });

  // Copy context to instance
  _utils.default.extend(instance, context, null, {
    allOwnKeys: true
  });

  // Factory for creating new instances
  instance.create = function create(instanceConfig) {
    return createInstance((0, _mergeConfig.default)(defaultConfig, instanceConfig));
  };
  return instance;
}

// Create the default instance to be exported
const axios = createInstance(_index.default);

// Expose Axios class to allow class inheritance
axios.Axios = _Axios.default;

// Expose Cancel & CancelToken
axios.CanceledError = _CanceledError.default;
axios.CancelToken = _CancelToken.default;
axios.isCancel = _isCancel.default;
axios.VERSION = _data.VERSION;
axios.toFormData = _toFormData.default;

// Expose AxiosError class
axios.AxiosError = _AxiosError.default;

// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = _spread.default;

// Expose isAxiosError
axios.isAxiosError = _isAxiosError.default;

// Expose mergeConfig
axios.mergeConfig = _mergeConfig.default;
axios.AxiosHeaders = _AxiosHeaders.default;
axios.formToJSON = thing => (0, _formDataToJSON.default)(_utils.default.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = _adapters.default.getAdapter;
axios.HttpStatusCode = _HttpStatusCode.default;
axios.default = axios;

// this module should only have a default export
var _default = exports.default = axios;
},{"./utils.js":"../../node_modules/axios/lib/utils.js","./helpers/bind.js":"../../node_modules/axios/lib/helpers/bind.js","./core/Axios.js":"../../node_modules/axios/lib/core/Axios.js","./core/mergeConfig.js":"../../node_modules/axios/lib/core/mergeConfig.js","./defaults/index.js":"../../node_modules/axios/lib/defaults/index.js","./helpers/formDataToJSON.js":"../../node_modules/axios/lib/helpers/formDataToJSON.js","./cancel/CanceledError.js":"../../node_modules/axios/lib/cancel/CanceledError.js","./cancel/CancelToken.js":"../../node_modules/axios/lib/cancel/CancelToken.js","./cancel/isCancel.js":"../../node_modules/axios/lib/cancel/isCancel.js","./env/data.js":"../../node_modules/axios/lib/env/data.js","./helpers/toFormData.js":"../../node_modules/axios/lib/helpers/toFormData.js","./core/AxiosError.js":"../../node_modules/axios/lib/core/AxiosError.js","./helpers/spread.js":"../../node_modules/axios/lib/helpers/spread.js","./helpers/isAxiosError.js":"../../node_modules/axios/lib/helpers/isAxiosError.js","./core/AxiosHeaders.js":"../../node_modules/axios/lib/core/AxiosHeaders.js","./adapters/adapters.js":"../../node_modules/axios/lib/adapters/adapters.js","./helpers/HttpStatusCode.js":"../../node_modules/axios/lib/helpers/HttpStatusCode.js"}],"../../node_modules/axios/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = exports.VERSION = exports.HttpStatusCode = exports.CanceledError = exports.CancelToken = exports.Cancel = exports.AxiosHeaders = exports.AxiosError = exports.Axios = void 0;
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _axios.default;
  }
});
exports.toFormData = exports.spread = exports.mergeConfig = exports.isCancel = exports.isAxiosError = exports.getAdapter = exports.formToJSON = void 0;
var _axios = _interopRequireDefault(require("./lib/axios.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const {
  Axios,
  AxiosError,
  CanceledError,
  isCancel,
  CancelToken,
  VERSION,
  all,
  Cancel,
  isAxiosError,
  spread,
  toFormData,
  AxiosHeaders,
  HttpStatusCode,
  formToJSON,
  getAdapter,
  mergeConfig
} = _axios.default;
exports.mergeConfig = mergeConfig;
exports.getAdapter = getAdapter;
exports.formToJSON = formToJSON;
exports.HttpStatusCode = HttpStatusCode;
exports.AxiosHeaders = AxiosHeaders;
exports.toFormData = toFormData;
exports.spread = spread;
exports.isAxiosError = isAxiosError;
exports.Cancel = Cancel;
exports.all = all;
exports.VERSION = VERSION;
exports.CancelToken = CancelToken;
exports.isCancel = isCancel;
exports.CanceledError = CanceledError;
exports.AxiosError = AxiosError;
exports.Axios = Axios;
},{"./lib/axios.js":"../../node_modules/axios/lib/axios.js"}],"alerts.js":[function(require,module,exports) {
var _this = this;
/* eslint-disable */

module.exports.hideAlert = function () {
  var el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
module.exports.showAlert = function (type, msg) {
  _this.hideAlert();
  var markup = "<div class=\"alert alert--".concat(type, "\">").concat(msg, "</div>");
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(_this.hideAlert, 5000);
};
},{}],"stripe.js":[function(require,module,exports) {
"use strict";

var _axios = _interopRequireDefault(require("axios"));
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } /* eslint-disable */
var stripe = Stripe("pk_live_51SSIpLA465v2gfXhbrBgOiEOe7xpbtI8rwP2zevGKpwadc7QmtXFzicLkoiLgMYg2x3mCwUkuJ4ZvrEOROMTYsfD000BF1oKyb");
exports.subscribe = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(plan) {
    var session, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return _axios.default.post("/api/v1/subscriptions/checkout-session/", plan);
        case 1:
          session = _context.v;
          _context.n = 2;
          return stripe.redirectToCheckout({
            sessionId: session.data.session.id
          });
        case 2:
          _context.n = 4;
          break;
        case 3:
          _context.p = 3;
          _t = _context.v;
          (0, _alerts.showAlert)("error", _t);
        case 4:
          return _context.a(2);
      }
    }, _callee, null, [[0, 3]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
exports.downgradeToStarter = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  var keepFeaturedJobIds,
    _err$response,
    _args2 = arguments,
    _t2;
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.p = _context2.n) {
      case 0:
        keepFeaturedJobIds = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : [];
        _context2.p = 1;
        _context2.n = 2;
        return _axios.default.post("/api/v1/subscriptions/downgrade-starter", {
          keepFeaturedJobIds: keepFeaturedJobIds
        });
      case 2:
        (0, _alerts.showAlert)("success", "Downgraded to Starter successfully");
        window.setTimeout(function () {
          location.reload();
        }, 1500);
        _context2.n = 4;
        break;
      case 3:
        _context2.p = 3;
        _t2 = _context2.v;
        (0, _alerts.showAlert)("error", ((_err$response = _t2.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.message) || "Error downgrading subscription");
      case 4:
        return _context2.a(2);
    }
  }, _callee2, null, [[1, 3]]);
}));
exports.manageBilling = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
  var res, _err$response2, _t3;
  return _regenerator().w(function (_context3) {
    while (1) switch (_context3.p = _context3.n) {
      case 0:
        _context3.p = 0;
        _context3.n = 1;
        return _axios.default.post("/api/v1/subscriptions/billing-portal");
      case 1:
        res = _context3.v;
        if (res.data.status === "success") {
          window.location.href = res.data.url;
        }
        _context3.n = 3;
        break;
      case 2:
        _context3.p = 2;
        _t3 = _context3.v;
        (0, _alerts.showAlert)("error", ((_err$response2 = _t3.response) === null || _err$response2 === void 0 || (_err$response2 = _err$response2.data) === null || _err$response2 === void 0 ? void 0 : _err$response2.message) || "Error redirecting to billing portal");
      case 3:
        return _context3.a(2);
    }
  }, _callee3, null, [[0, 2]]);
}));
},{"axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"../../node_modules/marked/lib/marked.umd.js":[function(require,module,exports) {
var define;
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(e, r) { return new BabelRegExp(e, void 0, r); }; var e = RegExp.prototype, r = new WeakMap(); function BabelRegExp(e, t, p) { var o = RegExp(e, t); return r.set(o, p || r.get(e)), _setPrototypeOf(o, BabelRegExp.prototype); } function buildGroups(e, t) { var p = r.get(t); return Object.keys(p).reduce(function (r, t) { var o = p[t]; if ("number" == typeof o) r[t] = e[o];else { for (var i = 0; void 0 === e[o[i]] && i + 1 < o.length;) i++; r[t] = e[o[i]]; } return r; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (r) { var t = e.exec.call(this, r); if (t) { t.groups = buildGroups(t, this); var p = t.indices; p && (p.groups = buildGroups(p, this)); } return t; }, BabelRegExp.prototype[Symbol.replace] = function (t, p) { if ("string" == typeof p) { var o = r.get(this); return e[Symbol.replace].call(this, t, p.replace(/\$<([^>]+)(>|$)/g, function (e, r, t) { if ("" === t) return e; var p = o[r]; return Array.isArray(p) ? "$" + p.join("$") : "number" == typeof p ? "$" + p : ""; })); } if ("function" == typeof p) { var i = this; return e[Symbol.replace].call(this, t, function () { var e = arguments; return "object" != _typeof(e[e.length - 1]) && (e = [].slice.call(e)).push(buildGroups(e, i)), p.apply(this, e); }); } return e[Symbol.replace].call(this, t, p); }, _wrapRegExp.apply(this, arguments); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
/**
 * marked v17.0.1 - a markdown parser
 * Copyright (c) 2018-2025, MarkedJS. (MIT License)
 * Copyright (c) 2011-2018, Christopher Jeffrey. (MIT License)
 * https://github.com/markedjs/marked
 */

/**
 * DO NOT EDIT THIS FILE
 * The code in this file is generated from files in ./src/
 */
(function (g, f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) == "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) < "u") {
    module.exports = f();
  } else if ("function" == typeof define && define.amd) {
    define("marked", f);
  } else {
    g["marked"] = f();
  }
})((typeof globalThis === "undefined" ? "undefined" : _typeof(globalThis)) < "u" ? globalThis : (typeof self === "undefined" ? "undefined" : _typeof(self)) < "u" ? self : this, function () {
  var _Class3;
  var exports = {};
  var __exports = exports;
  var module = {
    exports: exports
  };
  "use strict";
  var Z = Object.defineProperty;
  var xe = Object.getOwnPropertyDescriptor;
  var be = Object.getOwnPropertyNames;
  var Re = Object.prototype.hasOwnProperty;
  var Te = function Te(l, e) {
      for (var t in e) Z(l, t, {
        get: e[t],
        enumerable: !0
      });
    },
    Oe = function Oe(l, e, t, n) {
      if (e && _typeof(e) == "object" || typeof e == "function") {
        var _iterator = _createForOfIteratorHelper(be(e)),
          _step;
        try {
          var _loop = function _loop() {
            var r = _step.value;
            !Re.call(l, r) && r !== t && Z(l, r, {
              get: function get() {
                return e[r];
              },
              enumerable: !(n = xe(e, r)) || n.enumerable
            });
          };
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            _loop();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
      return l;
    };
  var we = function we(l) {
    return Oe(Z({}, "__esModule", {
      value: !0
    }), l);
  };
  var kt = {};
  Te(kt, {
    Hooks: function Hooks() {
      return S;
    },
    Lexer: function Lexer() {
      return x;
    },
    Marked: function Marked() {
      return A;
    },
    Parser: function Parser() {
      return b;
    },
    Renderer: function Renderer() {
      return P;
    },
    TextRenderer: function TextRenderer() {
      return $;
    },
    Tokenizer: function Tokenizer() {
      return y;
    },
    defaults: function defaults() {
      return T;
    },
    getDefaults: function getDefaults() {
      return _;
    },
    lexer: function lexer() {
      return ht;
    },
    marked: function marked() {
      return d;
    },
    options: function options() {
      return it;
    },
    parse: function parse() {
      return pt;
    },
    parseInline: function parseInline() {
      return ut;
    },
    parser: function parser() {
      return ct;
    },
    setOptions: function setOptions() {
      return ot;
    },
    use: function use() {
      return at;
    },
    walkTokens: function walkTokens() {
      return lt;
    }
  });
  module.exports = we(kt);
  function _() {
    return {
      async: !1,
      breaks: !1,
      extensions: null,
      gfm: !0,
      hooks: null,
      pedantic: !1,
      renderer: null,
      silent: !1,
      tokenizer: null,
      walkTokens: null
    };
  }
  var T = _();
  function G(l) {
    T = l;
  }
  var I = {
    exec: function exec() {
      return null;
    }
  };
  function k(l) {
    var e = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var t = typeof l == "string" ? l : l.source,
      n = {
        replace: function replace(r, i) {
          var s = typeof i == "string" ? i : i.source;
          return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
        },
        getRegex: function getRegex() {
          return new RegExp(t, e);
        }
      };
    return n;
  }
  var ye = function () {
      try {
        return !!new RegExp("(?<=1)(?<!1)");
      } catch (_unused) {
        return !1;
      }
    }(),
    m = {
      codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm,
      outputLinkReplace: /\\([\[\]])/g,
      indentCodeCompensation: /^(\s+)(?:```)/,
      beginningSpace: /^\s+/,
      endingHash: /#$/,
      startingSpaceChar: /^ /,
      endingSpaceChar: / $/,
      nonSpaceChar: /[^ ]/,
      newLineCharGlobal: /\n/g,
      tabCharGlobal: /\t/g,
      multipleSpaceGlobal: /\s+/g,
      blankLine: /^[ \t]*$/,
      doubleBlankLine: /\n[ \t]*\n[ \t]*$/,
      blockquoteStart: /^ {0,3}>/,
      blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g,
      blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm,
      listReplaceTabs: /^\t+/,
      listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g,
      listIsTask: /^\[[ xX]\] +\S/,
      listReplaceTask: /^\[[ xX]\] +/,
      listTaskCheckbox: /\[[ xX]\]/,
      anyLine: /\n.*\n/,
      hrefBrackets: /^<(.*)>$/,
      tableDelimiter: /[:|]/,
      tableAlignChars: /^\||\| *$/g,
      tableRowBlankLine: /\n[ \t]*$/,
      tableAlignRight: /^ *-+: *$/,
      tableAlignCenter: /^ *:-+: *$/,
      tableAlignLeft: /^ *:-+ *$/,
      startATag: /^<a /i,
      endATag: /^<\/a>/i,
      startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i,
      endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i,
      startAngleBracket: /^</,
      endAngleBracket: />$/,
      pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/,
      unicodeAlphaNumeric: /(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088F\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5C\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDC-\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7DC\uA7F1-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD40-\uDD59\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDD40-\uDD65\uDD6F-\uDD85\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC7\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDED0-\uDEE3\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0\uDFF0-\uDFF9]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDDB0-\uDDDB\uDDE0-\uDDE9\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD822\uD840-\uD868\uD86A-\uD86D\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD88C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D\uDD30-\uDD39]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDD70-\uDD79\uDE40-\uDE96\uDEA0-\uDEB8\uDEBB-\uDED3\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3\uDFF2-\uDFF6]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD1E\uDD80-\uDDF2]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD833[\uDCF0-\uDCF9]|\uD834[\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDCD0-\uDCEB\uDCF0-\uDCF9\uDDD0-\uDDED\uDDF0-\uDDFA\uDEC0-\uDEDE\uDEE0-\uDEE2\uDEE4\uDEE5\uDEE7-\uDEED\uDEF0-\uDEF4\uDEFE\uDEFF\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEAD\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD88D[\uDC00-\uDC79])/,
      escapeTest: /[&<>"']/,
      escapeReplace: /[&<>"']/g,
      escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/,
      escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g,
      unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig,
      caret: /(^|[^\[])\^/g,
      percentDecode: /%25/g,
      findPipe: /\|/g,
      splitPipe: / \|/,
      slashPipe: /\\\|/g,
      carriageReturn: /\r\n|\r/g,
      spaceLine: /^ +$/gm,
      notSpaceStart: /^\S*/,
      endingNewline: /\n$/,
      listItemRegex: function listItemRegex(l) {
        return new RegExp("^( {0,3}".concat(l, ")((?:[\t ][^\\n]*)?(?:\\n|$))"));
      },
      nextBulletRegex: function nextBulletRegex(l) {
        return new RegExp("^ {0,".concat(Math.min(3, l - 1), "}(?:[*+-]|\\d{1,9}[.)])((?:[ \t][^\\n]*)?(?:\\n|$))"));
      },
      hrRegex: function hrRegex(l) {
        return new RegExp("^ {0,".concat(Math.min(3, l - 1), "}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)"));
      },
      fencesBeginRegex: function fencesBeginRegex(l) {
        return new RegExp("^ {0,".concat(Math.min(3, l - 1), "}(?:```|~~~)"));
      },
      headingBeginRegex: function headingBeginRegex(l) {
        return new RegExp("^ {0,".concat(Math.min(3, l - 1), "}#"));
      },
      htmlBeginRegex: function htmlBeginRegex(l) {
        return new RegExp("^ {0,".concat(Math.min(3, l - 1), "}<(?:[a-z].*>|!--)"), "i");
      }
    },
    Pe = /^(?:[ \t]*(?:\n|$))+/,
    Se = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/,
    $e = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/,
    E = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/,
    _e = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
    Q = /(?:[*+-]|\d{1,9}[.)])/,
    se = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
    ie = k(se).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(),
    Le = k(se).replace(/bull/g, Q).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(),
    F = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/,
    Me = /^[^\n]+/,
    j = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/,
    ze = k(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", j).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(),
    Ae = k(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Q).getRegex(),
    v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",
    U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/,
    Ce = k("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),
    oe = k(F).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(),
    Ie = k(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", oe).getRegex(),
    K = {
      blockquote: Ie,
      code: Se,
      def: ze,
      fences: $e,
      heading: _e,
      hr: E,
      html: Ce,
      lheading: ie,
      list: Ae,
      newline: Pe,
      paragraph: oe,
      table: I,
      text: Me
    },
    ne = k("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(),
    Ee = _objectSpread(_objectSpread({}, K), {}, {
      lheading: Le,
      table: ne,
      paragraph: k(F).replace("hr", E).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", ne).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex()
    }),
    Be = _objectSpread(_objectSpread({}, K), {}, {
      html: k("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: I,
      lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
      paragraph: k(F).replace("hr", E).replace("heading", " *#{1,6} *[^\n]").replace("lheading", ie).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
    }),
    qe = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    ve = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    ae = /^( {2,}|\\)\n(?!\s*$)/,
    De = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
    D = /(?:[!-\/:-@\[-`\{-~\xA1-\xA9\xAB\xAC\xAE-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u037E\u0384\u0385\u0387\u03F6\u0482\u055A-\u055F\u0589\u058A\u058D-\u058F\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0606-\u060F\u061B\u061D-\u061F\u066A-\u066D\u06D4\u06DE\u06E9\u06FD\u06FE\u0700-\u070D\u07F6-\u07F9\u07FE\u07FF\u0830-\u083E\u085E\u0888\u0964\u0965\u0970\u09F2\u09F3\u09FA\u09FB\u09FD\u0A76\u0AF0\u0AF1\u0B70\u0BF3-\u0BFA\u0C77\u0C7F\u0C84\u0D4F\u0D79\u0DF4\u0E3F\u0E4F\u0E5A\u0E5B\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F85\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u104A-\u104F\u109E\u109F\u10FB\u1360-\u1368\u1390-\u1399\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DB\u1800-\u180A\u1940\u1944\u1945\u19DE-\u19FF\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2010-\u2027\u2030-\u205E\u207A-\u207E\u208A-\u208E\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2775\u2794-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3001-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F\u309B\u309C\u30A0\u30FB\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAA77-\uAA79\uAADE\uAADF\uAAF0\uAAF1\uAB5B\uAB6A\uAB6B\uABEB\uFB29\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD00-\uDD02\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDC77\uDC78\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEC8\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDD8E\uDD8F\uDEAD\uDED0-\uDED8\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3F]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFD5-\uDFF1\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3F\uDF44\uDF45]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F[\uDC9C\uDC9F]|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE8B]|\uD838[\uDD4F\uDEFF]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA])/,
    W = /(?:[\t-\r -\/:-@\[-`\{-~\xA0-\xA9\xAB\xAC\xAE-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u037E\u0384\u0385\u0387\u03F6\u0482\u055A-\u055F\u0589\u058A\u058D-\u058F\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0606-\u060F\u061B\u061D-\u061F\u066A-\u066D\u06D4\u06DE\u06E9\u06FD\u06FE\u0700-\u070D\u07F6-\u07F9\u07FE\u07FF\u0830-\u083E\u085E\u0888\u0964\u0965\u0970\u09F2\u09F3\u09FA\u09FB\u09FD\u0A76\u0AF0\u0AF1\u0B70\u0BF3-\u0BFA\u0C77\u0C7F\u0C84\u0D4F\u0D79\u0DF4\u0E3F\u0E4F\u0E5A\u0E5B\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F85\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u104A-\u104F\u109E\u109F\u10FB\u1360-\u1368\u1390-\u1399\u1400\u166D\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DB\u1800-\u180A\u1940\u1944\u1945\u19DE-\u19FF\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2000-\u200A\u2010-\u2029\u202F-\u205F\u207A-\u207E\u208A-\u208E\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2775\u2794-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F\u309B\u309C\u30A0\u30FB\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAA77-\uAA79\uAADE\uAADF\uAAF0\uAAF1\uAB5B\uAB6A\uAB6B\uABEB\uFB29\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD00-\uDD02\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDC77\uDC78\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEC8\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDD8E\uDD8F\uDEAD\uDED0-\uDED8\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3F]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFD5-\uDFF1\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3F\uDF44\uDF45]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F[\uDC9C\uDC9F]|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE8B]|\uD838[\uDD4F\uDEFF]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA])/,
    le = /(?:[\0-\x08\x0E-\x1F0-9A-Za-z\x7F-\x9F\xAA\xAD\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376-\u037D\u037F-\u0383\u0386\u0388-\u03F5\u03F7-\u0481\u0483-\u0559\u0560-\u0588\u058B\u058C\u0590-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7-\u05F2\u05F5-\u0605\u0610-\u061A\u061C\u0620-\u0669\u066E-\u06D3\u06D5-\u06DD\u06DF-\u06E8\u06EA-\u06FC\u06FF\u070E-\u07F5\u07FA-\u07FD\u0800-\u082F\u083F-\u085D\u085F-\u0887\u0889-\u0963\u0966-\u096F\u0971-\u09F1\u09F4-\u09F9\u09FC\u09FE-\u0A75\u0A77-\u0AEF\u0AF2-\u0B6F\u0B71-\u0BF2\u0BFB-\u0C76\u0C78-\u0C7E\u0C80-\u0C83\u0C85-\u0D4E\u0D50-\u0D78\u0D7A-\u0DF3\u0DF5-\u0E3E\u0E40-\u0E4E\u0E50-\u0E59\u0E5C-\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F84\u0F86-\u0FBD\u0FC6\u0FCD\u0FDB-\u1049\u1050-\u109D\u10A0-\u10FA\u10FC-\u135F\u1369-\u138F\u139A-\u13FF\u1401-\u166C\u166F-\u167F\u1681-\u169A\u169D-\u16EA\u16EE-\u1734\u1737-\u17D3\u17D7\u17DC-\u17FF\u180B-\u193F\u1941-\u1943\u1946-\u19DD\u1A00-\u1A1D\u1A20-\u1A9F\u1AA7\u1AAE-\u1B4D\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BFB\u1C00-\u1C3A\u1C40-\u1C7D\u1C80-\u1CBF\u1CC8-\u1CD2\u1CD4-\u1FBC\u1FBE\u1FC2-\u1FCC\u1FD0-\u1FDC\u1FE0-\u1FEC\u1FF0-\u1FFC\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u2079\u207F-\u2089\u208F-\u209F\u20C2-\u20FF\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u218C-\u218F\u242A-\u243F\u244B-\u249B\u24EA-\u24FF\u2776-\u2793\u2B74\u2B75\u2C00-\u2CE4\u2CEB-\u2CF8\u2CFD\u2D00-\u2D6F\u2D71-\u2DFF\u2E2F\u2E5E-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3040-\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u318F\u3192-\u3195\u31A0-\u31BF\u31E6-\u31EE\u31F0-\u31FF\u321F-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48F\uA4C7-\uA4FD\uA500-\uA60C\uA610-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA6F8-\uA6FF\uA717-\uA71F\uA722-\uA788\uA78B-\uA827\uA82C-\uA835\uA83A-\uA873\uA878-\uA8CD\uA8D0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA95E\uA960-\uA9C0\uA9CE-\uA9DD\uA9E0-\uAA5B\uAA60-\uAA76\uAA7A-\uAADD\uAAE0-\uAAEF\uAAF2-\uAB5A\uAB5C-\uAB69\uAB6C-\uABEA\uABEC-\uD7FF\uE000-\uFB28\uFB2A-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDD0-\uFDFB\uFE00-\uFE0F\uFE1A-\uFE2F\uFE53\uFE67\uFE6C-\uFEFE\uFF00\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]|\uD800[\uDC00-\uDCFF\uDD03-\uDD36\uDD40-\uDD78\uDD8A\uDD8B\uDD8F\uDD9D-\uDD9F\uDDA1-\uDDCF\uDDFD-\uDF9E\uDFA0-\uDFCF\uDFD1-\uDFFF]|\uD801[\uDC00-\uDD6E\uDD70-\uDFFF]|\uD802[\uDC00-\uDC56\uDC58-\uDC76\uDC79-\uDD1E\uDD20-\uDD3E\uDD40-\uDE4F\uDE59-\uDE7E\uDE80-\uDEC7\uDEC9-\uDEEF\uDEF7-\uDF38\uDF40-\uDF98\uDF9D-\uDFFF]|\uD803[\uDC00-\uDD6D\uDD6F-\uDD8D\uDD90-\uDEAC\uDEAE-\uDECF\uDED9-\uDF54\uDF5A-\uDF85\uDF8A-\uDFFF]|\uD804[\uDC00-\uDC46\uDC4E-\uDCBA\uDCBD\uDCC2-\uDD3F\uDD44-\uDD73\uDD76-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDDE0-\uDE37\uDE3E-\uDEA8\uDEAA-\uDFD3\uDFD6\uDFD9-\uDFFF]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5C\uDC5E-\uDCC5\uDCC7-\uDDC0\uDDD8-\uDE40\uDE44-\uDE5F\uDE6D-\uDEB8\uDEBA-\uDF3B\uDF40-\uDFFF]|\uD806[\uDC00-\uDC3A\uDC3C-\uDD43\uDD47-\uDDE1\uDDE3-\uDE3E\uDE47-\uDE99\uDE9D\uDEA3-\uDEFF\uDF0A-\uDFE0\uDFE2-\uDFFF]|\uD807[\uDC00-\uDC40\uDC46-\uDC6F\uDC72-\uDEF6\uDEF9-\uDF42\uDF50-\uDFD4\uDFF2-\uDFFE]|[\uD808\uD80A\uD80C-\uD819\uD81C-\uD82E\uD830-\uD832\uD837\uD83F-\uDBFF][\uDC00-\uDFFF]|\uD809[\uDC00-\uDC6F\uDC75-\uDFFF]|\uD80B[\uDC00-\uDFF0\uDFF3-\uDFFF]|\uD81A[\uDC00-\uDE6D\uDE70-\uDEF4\uDEF6-\uDF36\uDF40-\uDF43\uDF46-\uDFFF]|\uD81B[\uDC00-\uDD6C\uDD70-\uDE96\uDE9B-\uDFE1\uDFE3-\uDFFF]|\uD82F[\uDC00-\uDC9B\uDC9D\uDC9E\uDCA0-\uDFFF]|\uD833[\uDCF0-\uDCF9\uDCFD-\uDCFF\uDEB4-\uDEB9\uDED1-\uDEDF\uDEF1-\uDF4F\uDFC4-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD65-\uDD69\uDD6D-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDDEB-\uDDFF\uDE42-\uDE44\uDE46-\uDEFF\uDF57-\uDFFF]|\uD835[\uDC00-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE8C-\uDFFF]|\uD838[\uDC00-\uDD4E\uDD50-\uDEFE\uDF00-\uDFFF]|\uD839[\uDC00-\uDDFE\uDE00-\uDFFF]|\uD83A[\uDC00-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDD2D\uDD2F-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDD0C\uDDAE-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED9-\uDEDB\uDEED-\uDEEF\uDEFD-\uDEFF\uDFDA-\uDFDF\uDFEC-\uDFEF\uDFF1-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE\uDCAF\uDCBC-\uDCBF\uDCC2-\uDCCF\uDCD9-\uDCFF\uDE58-\uDE5F\uDE6E\uDE6F\uDE7D-\uDE7F\uDE8B-\uDE8D\uDEC7\uDEC9-\uDECC\uDEDD\uDEDE\uDEEB-\uDEEE\uDEF9-\uDEFF\uDF93\uDFF0-\uDFF9\uDFFB-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/,
    He = k(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, W).getRegex(),
    ue = /(?!~)(?:[!-\/:-@\[-`\{-~\xA1-\xA9\xAB\xAC\xAE-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u037E\u0384\u0385\u0387\u03F6\u0482\u055A-\u055F\u0589\u058A\u058D-\u058F\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0606-\u060F\u061B\u061D-\u061F\u066A-\u066D\u06D4\u06DE\u06E9\u06FD\u06FE\u0700-\u070D\u07F6-\u07F9\u07FE\u07FF\u0830-\u083E\u085E\u0888\u0964\u0965\u0970\u09F2\u09F3\u09FA\u09FB\u09FD\u0A76\u0AF0\u0AF1\u0B70\u0BF3-\u0BFA\u0C77\u0C7F\u0C84\u0D4F\u0D79\u0DF4\u0E3F\u0E4F\u0E5A\u0E5B\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F85\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u104A-\u104F\u109E\u109F\u10FB\u1360-\u1368\u1390-\u1399\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DB\u1800-\u180A\u1940\u1944\u1945\u19DE-\u19FF\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2010-\u2027\u2030-\u205E\u207A-\u207E\u208A-\u208E\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2775\u2794-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3001-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F\u309B\u309C\u30A0\u30FB\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAA77-\uAA79\uAADE\uAADF\uAAF0\uAAF1\uAB5B\uAB6A\uAB6B\uABEB\uFB29\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD00-\uDD02\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDC77\uDC78\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEC8\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDD8E\uDD8F\uDEAD\uDED0-\uDED8\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3F]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFD5-\uDFF1\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3F\uDF44\uDF45]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F[\uDC9C\uDC9F]|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE8B]|\uD838[\uDD4F\uDEFF]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA])/,
    Ze = /(?!~)(?:[\t-\r -\/:-@\[-`\{-~\xA0-\xA9\xAB\xAC\xAE-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u037E\u0384\u0385\u0387\u03F6\u0482\u055A-\u055F\u0589\u058A\u058D-\u058F\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0606-\u060F\u061B\u061D-\u061F\u066A-\u066D\u06D4\u06DE\u06E9\u06FD\u06FE\u0700-\u070D\u07F6-\u07F9\u07FE\u07FF\u0830-\u083E\u085E\u0888\u0964\u0965\u0970\u09F2\u09F3\u09FA\u09FB\u09FD\u0A76\u0AF0\u0AF1\u0B70\u0BF3-\u0BFA\u0C77\u0C7F\u0C84\u0D4F\u0D79\u0DF4\u0E3F\u0E4F\u0E5A\u0E5B\u0F01-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F85\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u104A-\u104F\u109E\u109F\u10FB\u1360-\u1368\u1390-\u1399\u1400\u166D\u166E\u1680\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DB\u1800-\u180A\u1940\u1944\u1945\u19DE-\u19FF\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2000-\u200A\u2010-\u2029\u202F-\u205F\u207A-\u207E\u208A-\u208E\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2775\u2794-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u303F\u309B\u309C\u30A0\u30FB\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAA77-\uAA79\uAADE\uAADF\uAAF0\uAAF1\uAB5B\uAB6A\uAB6B\uABEB\uFB29\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD00-\uDD02\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDC77\uDC78\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEC8\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDD8E\uDD8F\uDEAD\uDED0-\uDED8\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3F]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFD5-\uDFF1\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3F\uDF44\uDF45]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F[\uDC9C\uDC9F]|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE8B]|\uD838[\uDD4F\uDEFF]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA])/,
    Ge = /(?:(?:[\0-\x08\x0E-\x1F0-9A-Za-z\x7F-\x9F\xAA\xAD\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376-\u037D\u037F-\u0383\u0386\u0388-\u03F5\u03F7-\u0481\u0483-\u0559\u0560-\u0588\u058B\u058C\u0590-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7-\u05F2\u05F5-\u0605\u0610-\u061A\u061C\u0620-\u0669\u066E-\u06D3\u06D5-\u06DD\u06DF-\u06E8\u06EA-\u06FC\u06FF\u070E-\u07F5\u07FA-\u07FD\u0800-\u082F\u083F-\u085D\u085F-\u0887\u0889-\u0963\u0966-\u096F\u0971-\u09F1\u09F4-\u09F9\u09FC\u09FE-\u0A75\u0A77-\u0AEF\u0AF2-\u0B6F\u0B71-\u0BF2\u0BFB-\u0C76\u0C78-\u0C7E\u0C80-\u0C83\u0C85-\u0D4E\u0D50-\u0D78\u0D7A-\u0DF3\u0DF5-\u0E3E\u0E40-\u0E4E\u0E50-\u0E59\u0E5C-\u0F00\u0F18\u0F19\u0F20-\u0F33\u0F35\u0F37\u0F39\u0F3E-\u0F84\u0F86-\u0FBD\u0FC6\u0FCD\u0FDB-\u1049\u1050-\u109D\u10A0-\u10FA\u10FC-\u135F\u1369-\u138F\u139A-\u13FF\u1401-\u166C\u166F-\u167F\u1681-\u169A\u169D-\u16EA\u16EE-\u1734\u1737-\u17D3\u17D7\u17DC-\u17FF\u180B-\u193F\u1941-\u1943\u1946-\u19DD\u1A00-\u1A1D\u1A20-\u1A9F\u1AA7\u1AAE-\u1B4D\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BFB\u1C00-\u1C3A\u1C40-\u1C7D\u1C80-\u1CBF\u1CC8-\u1CD2\u1CD4-\u1FBC\u1FBE\u1FC2-\u1FCC\u1FD0-\u1FDC\u1FE0-\u1FEC\u1FF0-\u1FFC\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u2079\u207F-\u2089\u208F-\u209F\u20C2-\u20FF\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u218C-\u218F\u242A-\u243F\u244B-\u249B\u24EA-\u24FF\u2776-\u2793\u2B74\u2B75\u2C00-\u2CE4\u2CEB-\u2CF8\u2CFD\u2D00-\u2D6F\u2D71-\u2DFF\u2E2F\u2E5E-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3040-\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u318F\u3192-\u3195\u31A0-\u31BF\u31E6-\u31EE\u31F0-\u31FF\u321F-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48F\uA4C7-\uA4FD\uA500-\uA60C\uA610-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA6F8-\uA6FF\uA717-\uA71F\uA722-\uA788\uA78B-\uA827\uA82C-\uA835\uA83A-\uA873\uA878-\uA8CD\uA8D0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA95E\uA960-\uA9C0\uA9CE-\uA9DD\uA9E0-\uAA5B\uAA60-\uAA76\uAA7A-\uAADD\uAAE0-\uAAEF\uAAF2-\uAB5A\uAB5C-\uAB69\uAB6C-\uABEA\uABEC-\uD7FF\uE000-\uFB28\uFB2A-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDD0-\uFDFB\uFE00-\uFE0F\uFE1A-\uFE2F\uFE53\uFE67\uFE6C-\uFEFE\uFF00\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]|\uD800[\uDC00-\uDCFF\uDD03-\uDD36\uDD40-\uDD78\uDD8A\uDD8B\uDD8F\uDD9D-\uDD9F\uDDA1-\uDDCF\uDDFD-\uDF9E\uDFA0-\uDFCF\uDFD1-\uDFFF]|\uD801[\uDC00-\uDD6E\uDD70-\uDFFF]|\uD802[\uDC00-\uDC56\uDC58-\uDC76\uDC79-\uDD1E\uDD20-\uDD3E\uDD40-\uDE4F\uDE59-\uDE7E\uDE80-\uDEC7\uDEC9-\uDEEF\uDEF7-\uDF38\uDF40-\uDF98\uDF9D-\uDFFF]|\uD803[\uDC00-\uDD6D\uDD6F-\uDD8D\uDD90-\uDEAC\uDEAE-\uDECF\uDED9-\uDF54\uDF5A-\uDF85\uDF8A-\uDFFF]|\uD804[\uDC00-\uDC46\uDC4E-\uDCBA\uDCBD\uDCC2-\uDD3F\uDD44-\uDD73\uDD76-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDDE0-\uDE37\uDE3E-\uDEA8\uDEAA-\uDFD3\uDFD6\uDFD9-\uDFFF]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5C\uDC5E-\uDCC5\uDCC7-\uDDC0\uDDD8-\uDE40\uDE44-\uDE5F\uDE6D-\uDEB8\uDEBA-\uDF3B\uDF40-\uDFFF]|\uD806[\uDC00-\uDC3A\uDC3C-\uDD43\uDD47-\uDDE1\uDDE3-\uDE3E\uDE47-\uDE99\uDE9D\uDEA3-\uDEFF\uDF0A-\uDFE0\uDFE2-\uDFFF]|\uD807[\uDC00-\uDC40\uDC46-\uDC6F\uDC72-\uDEF6\uDEF9-\uDF42\uDF50-\uDFD4\uDFF2-\uDFFE]|[\uD808\uD80A\uD80C-\uD819\uD81C-\uD82E\uD830-\uD832\uD837\uD83F-\uDBFF][\uDC00-\uDFFF]|\uD809[\uDC00-\uDC6F\uDC75-\uDFFF]|\uD80B[\uDC00-\uDFF0\uDFF3-\uDFFF]|\uD81A[\uDC00-\uDE6D\uDE70-\uDEF4\uDEF6-\uDF36\uDF40-\uDF43\uDF46-\uDFFF]|\uD81B[\uDC00-\uDD6C\uDD70-\uDE96\uDE9B-\uDFE1\uDFE3-\uDFFF]|\uD82F[\uDC00-\uDC9B\uDC9D\uDC9E\uDCA0-\uDFFF]|\uD833[\uDCF0-\uDCF9\uDCFD-\uDCFF\uDEB4-\uDEB9\uDED1-\uDEDF\uDEF1-\uDF4F\uDFC4-\uDFFF]|\uD834[\uDCF6-\uDCFF\uDD27\uDD28\uDD65-\uDD69\uDD6D-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDDEB-\uDDFF\uDE42-\uDE44\uDE46-\uDEFF\uDF57-\uDFFF]|\uD835[\uDC00-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE8C-\uDFFF]|\uD838[\uDC00-\uDD4E\uDD50-\uDEFE\uDF00-\uDFFF]|\uD839[\uDC00-\uDDFE\uDE00-\uDFFF]|\uD83A[\uDC00-\uDD5D\uDD60-\uDFFF]|\uD83B[\uDC00-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDD2D\uDD2F-\uDEEF\uDEF2-\uDFFF]|\uD83C[\uDC2C-\uDC2F\uDC94-\uDC9F\uDCAF\uDCB0\uDCC0\uDCD0\uDCF6-\uDD0C\uDDAE-\uDDE5\uDE03-\uDE0F\uDE3C-\uDE3F\uDE49-\uDE4F\uDE52-\uDE5F\uDE66-\uDEFF]|\uD83D[\uDED9-\uDEDB\uDEED-\uDEEF\uDEFD-\uDEFF\uDFDA-\uDFDF\uDFEC-\uDFEF\uDFF1-\uDFFF]|\uD83E[\uDC0C-\uDC0F\uDC48-\uDC4F\uDC5A-\uDC5F\uDC88-\uDC8F\uDCAE\uDCAF\uDCBC-\uDCBF\uDCC2-\uDCCF\uDCD9-\uDCFF\uDE58-\uDE5F\uDE6E\uDE6F\uDE7D-\uDE7F\uDE8B-\uDE8D\uDEC7\uDEC9-\uDECC\uDEDD\uDEDE\uDEEB-\uDEEE\uDEF9-\uDEFF\uDF93\uDFF0-\uDFF9\uDFFB-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])|~)/,
    Ne = k(/link|precode-code|html/, "g").replace("link", /*#__PURE__*/_wrapRegExp(/\[(?:[^\[\]`]|(`+)[^`]+\1(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/, {
      a: 1
    })).replace("precode-", ye ? "(?<!`)()" : "(^^|[^`])").replace("code", /*#__PURE__*/_wrapRegExp(/(`+)[^`]+\1(?!`)/, {
      b: 1
    })).replace("html", /<(?! )[^<>]*?>/).getRegex(),
    pe = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/,
    Qe = k(pe, "u").replace(/punct/g, D).getRegex(),
    Fe = k(pe, "u").replace(/punct/g, ue).getRegex(),
    ce = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)",
    je = k(ce, "gu").replace(/notPunctSpace/g, le).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex(),
    Ue = k(ce, "gu").replace(/notPunctSpace/g, Ge).replace(/punctSpace/g, Ze).replace(/punct/g, ue).getRegex(),
    Ke = k("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, le).replace(/punctSpace/g, W).replace(/punct/g, D).getRegex(),
    We = k(/\\(punct)/, "gu").replace(/punct/g, D).getRegex(),
    Xe = k(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(),
    Je = k(U).replace("(?:-->|$)", "-->").getRegex(),
    Ve = k("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(),
    q = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/,
    Ye = k(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(),
    he = k(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", j).getRegex(),
    ke = k(/^!?\[(ref)\](?:\[\])?/).replace("ref", j).getRegex(),
    et = k("reflink|nolink(?!\\()", "g").replace("reflink", he).replace("nolink", ke).getRegex(),
    re = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/,
    X = {
      _backpedal: I,
      anyPunctuation: We,
      autolink: Xe,
      blockSkip: Ne,
      br: ae,
      code: ve,
      del: I,
      emStrongLDelim: Qe,
      emStrongRDelimAst: je,
      emStrongRDelimUnd: Ke,
      escape: qe,
      link: Ye,
      nolink: ke,
      punctuation: He,
      reflink: he,
      reflinkSearch: et,
      tag: Ve,
      text: De,
      url: I
    },
    tt = _objectSpread(_objectSpread({}, X), {}, {
      link: k(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(),
      reflink: k(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex()
    }),
    N = _objectSpread(_objectSpread({}, X), {}, {
      emStrongRDelimAst: Ue,
      emStrongLDelim: Fe,
      url: k(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", re).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
      _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/,
      text: k(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", re).getRegex()
    }),
    nt = _objectSpread(_objectSpread({}, N), {}, {
      br: k(ae).replace("{2,}", "*").getRegex(),
      text: k(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    }),
    B = {
      normal: K,
      gfm: Ee,
      pedantic: Be
    },
    M = {
      normal: X,
      gfm: N,
      breaks: nt,
      pedantic: tt
    };
  var rt = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    },
    de = function de(l) {
      return rt[l];
    };
  function w(l, e) {
    if (e) {
      if (m.escapeTest.test(l)) return l.replace(m.escapeReplace, de);
    } else if (m.escapeTestNoEncode.test(l)) return l.replace(m.escapeReplaceNoEncode, de);
    return l;
  }
  function J(l) {
    try {
      l = encodeURI(l).replace(m.percentDecode, "%");
    } catch (_unused2) {
      return null;
    }
    return l;
  }
  function V(l, e) {
    var _n$at;
    var t = l.replace(m.findPipe, function (i, s, a) {
        var o = !1,
          u = s;
        for (; --u >= 0 && a[u] === "\\";) o = !o;
        return o ? "|" : " |";
      }),
      n = t.split(m.splitPipe),
      r = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !((_n$at = n.at(-1)) !== null && _n$at !== void 0 && _n$at.trim()) && n.pop(), e) if (n.length > e) n.splice(e);else for (; n.length < e;) n.push("");
    for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
    return n;
  }
  function z(l, e, t) {
    var n = l.length;
    if (n === 0) return "";
    var r = 0;
    for (; r < n;) {
      var i = l.charAt(n - r - 1);
      if (i === e && !t) r++;else if (i !== e && t) r++;else break;
    }
    return l.slice(0, n - r);
  }
  function ge(l, e) {
    if (l.indexOf(e[1]) === -1) return -1;
    var t = 0;
    for (var n = 0; n < l.length; n++) if (l[n] === "\\") n++;else if (l[n] === e[0]) t++;else if (l[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function fe(l, e, t, n, r) {
    var i = e.href,
      s = e.title || null,
      a = l[1].replace(r.other.outputLinkReplace, "$1");
    n.state.inLink = !0;
    var o = {
      type: l[0].charAt(0) === "!" ? "image" : "link",
      raw: t,
      href: i,
      title: s,
      text: a,
      tokens: n.inlineTokens(a)
    };
    return n.state.inLink = !1, o;
  }
  function st(l, e, t) {
    var n = l.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    var r = n[1];
    return e.split("\n").map(function (i) {
      var s = i.match(t.other.beginningSpace);
      if (s === null) return i;
      var _s = _slicedToArray(s, 1),
        a = _s[0];
      return a.length >= r.length ? i.slice(r.length) : i;
    }).join("\n");
  }
  var y = /*#__PURE__*/function () {
    function y(e) {
      _classCallCheck(this, y);
      _defineProperty(this, "options", void 0);
      _defineProperty(this, "rules", void 0);
      _defineProperty(this, "lexer", void 0);
      this.options = e || T;
    }
    return _createClass(y, [{
      key: "space",
      value: function space(e) {
        var t = this.rules.block.newline.exec(e);
        if (t && t[0].length > 0) return {
          type: "space",
          raw: t[0]
        };
      }
    }, {
      key: "code",
      value: function code(e) {
        var t = this.rules.block.code.exec(e);
        if (t) {
          var n = t[0].replace(this.rules.other.codeRemoveIndent, "");
          return {
            type: "code",
            raw: t[0],
            codeBlockStyle: "indented",
            text: this.options.pedantic ? n : z(n, "\n")
          };
        }
      }
    }, {
      key: "fences",
      value: function fences(e) {
        var t = this.rules.block.fences.exec(e);
        if (t) {
          var n = t[0],
            r = st(n, t[3] || "", this.rules);
          return {
            type: "code",
            raw: n,
            lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2],
            text: r
          };
        }
      }
    }, {
      key: "heading",
      value: function heading(e) {
        var t = this.rules.block.heading.exec(e);
        if (t) {
          var n = t[2].trim();
          if (this.rules.other.endingHash.test(n)) {
            var r = z(n, "#");
            (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
          }
          return {
            type: "heading",
            raw: t[0],
            depth: t[1].length,
            text: n,
            tokens: this.lexer.inline(n)
          };
        }
      }
    }, {
      key: "hr",
      value: function hr(e) {
        var t = this.rules.block.hr.exec(e);
        if (t) return {
          type: "hr",
          raw: z(t[0], "\n")
        };
      }
    }, {
      key: "blockquote",
      value: function blockquote(e) {
        var t = this.rules.block.blockquote.exec(e);
        if (t) {
          var n = z(t[0], "\n").split("\n"),
            r = "",
            i = "",
            s = [];
          for (; n.length > 0;) {
            var a = !1,
              o = [],
              u = void 0;
            for (u = 0; u < n.length; u++) if (this.rules.other.blockquoteStart.test(n[u])) o.push(n[u]), a = !0;else if (!a) o.push(n[u]);else break;
            n = n.slice(u);
            var p = o.join("\n"),
              c = p.replace(this.rules.other.blockquoteSetextReplace, "\n    $1").replace(this.rules.other.blockquoteSetextReplace2, "");
            r = r ? "".concat(r, "\n").concat(p) : p, i = i ? "".concat(i, "\n").concat(c) : c;
            var g = this.lexer.state.top;
            if (this.lexer.state.top = !0, this.lexer.blockTokens(c, s, !0), this.lexer.state.top = g, n.length === 0) break;
            var h = s.at(-1);
            if ((h === null || h === void 0 ? void 0 : h.type) === "code") break;
            if ((h === null || h === void 0 ? void 0 : h.type) === "blockquote") {
              var R = h,
                f = R.raw + "\n" + n.join("\n"),
                O = this.blockquote(f);
              s[s.length - 1] = O, r = r.substring(0, r.length - R.raw.length) + O.raw, i = i.substring(0, i.length - R.text.length) + O.text;
              break;
            } else if ((h === null || h === void 0 ? void 0 : h.type) === "list") {
              var _R = h,
                _f = _R.raw + "\n" + n.join("\n"),
                _O = this.list(_f);
              s[s.length - 1] = _O, r = r.substring(0, r.length - h.raw.length) + _O.raw, i = i.substring(0, i.length - _R.raw.length) + _O.raw, n = _f.substring(s.at(-1).raw.length).split("\n");
              continue;
            }
          }
          return {
            type: "blockquote",
            raw: r,
            tokens: s,
            text: i
          };
        }
      }
    }, {
      key: "list",
      value: function list(e) {
        var _this = this;
        var t = this.rules.block.list.exec(e);
        if (t) {
          var n = t[1].trim(),
            r = n.length > 1,
            i = {
              type: "list",
              raw: "",
              ordered: r,
              start: r ? +n.slice(0, -1) : "",
              loose: !1,
              items: []
            };
          n = r ? "\\d{1,9}\\".concat(n.slice(-1)) : "\\".concat(n), this.options.pedantic && (n = r ? n : "[*+-]");
          var s = this.rules.other.listItemRegex(n),
            a = !1;
          for (; e;) {
            var u = !1,
              p = "",
              c = "";
            if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
            p = t[0], e = e.substring(p.length);
            var g = t[2].split("\n", 1)[0].replace(this.rules.other.listReplaceTabs, function (O) {
                return " ".repeat(3 * O.length);
              }),
              h = e.split("\n", 1)[0],
              R = !g.trim(),
              f = 0;
            if (this.options.pedantic ? (f = 2, c = g.trimStart()) : R ? f = t[1].length + 1 : (f = t[2].search(this.rules.other.nonSpaceChar), f = f > 4 ? 1 : f, c = g.slice(f), f += t[1].length), R && this.rules.other.blankLine.test(h) && (p += h + "\n", e = e.substring(h.length + 1), u = !0), !u) {
              var O = this.rules.other.nextBulletRegex(f),
                Y = this.rules.other.hrRegex(f),
                ee = this.rules.other.fencesBeginRegex(f),
                te = this.rules.other.headingBeginRegex(f),
                me = this.rules.other.htmlBeginRegex(f);
              for (; e;) {
                var H = e.split("\n", 1)[0],
                  C = void 0;
                if (h = H, this.options.pedantic ? (h = h.replace(this.rules.other.listReplaceNesting, "  "), C = h) : C = h.replace(this.rules.other.tabCharGlobal, "    "), ee.test(h) || te.test(h) || me.test(h) || O.test(h) || Y.test(h)) break;
                if (C.search(this.rules.other.nonSpaceChar) >= f || !h.trim()) c += "\n" + C.slice(f);else {
                  if (R || g.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ee.test(g) || te.test(g) || Y.test(g)) break;
                  c += "\n" + h;
                }
                !R && !h.trim() && (R = !0), p += H + "\n", e = e.substring(H.length + 1), g = C.slice(f);
              }
            }
            i.loose || (a ? i.loose = !0 : this.rules.other.doubleBlankLine.test(p) && (a = !0)), i.items.push({
              type: "list_item",
              raw: p,
              task: !!this.options.gfm && this.rules.other.listIsTask.test(c),
              loose: !1,
              text: c,
              tokens: []
            }), i.raw += p;
          }
          var o = i.items.at(-1);
          if (o) o.raw = o.raw.trimEnd(), o.text = o.text.trimEnd();else return;
          i.raw = i.raw.trimEnd();
          var _iterator2 = _createForOfIteratorHelper(i.items),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var _u2 = _step2.value;
              if (this.lexer.state.top = !1, _u2.tokens = this.lexer.blockTokens(_u2.text, []), _u2.task) {
                var _u2$tokens$, _u2$tokens$2;
                if (_u2.text = _u2.text.replace(this.rules.other.listReplaceTask, ""), ((_u2$tokens$ = _u2.tokens[0]) === null || _u2$tokens$ === void 0 ? void 0 : _u2$tokens$.type) === "text" || ((_u2$tokens$2 = _u2.tokens[0]) === null || _u2$tokens$2 === void 0 ? void 0 : _u2$tokens$2.type) === "paragraph") {
                  _u2.tokens[0].raw = _u2.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), _u2.tokens[0].text = _u2.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
                  for (var _c = this.lexer.inlineQueue.length - 1; _c >= 0; _c--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[_c].src)) {
                    this.lexer.inlineQueue[_c].src = this.lexer.inlineQueue[_c].src.replace(this.rules.other.listReplaceTask, "");
                    break;
                  }
                }
                var _p2 = this.rules.other.listTaskCheckbox.exec(_u2.raw);
                if (_p2) {
                  var _c2 = {
                    type: "checkbox",
                    raw: _p2[0] + " ",
                    checked: _p2[0] !== "[ ]"
                  };
                  _u2.checked = _c2.checked, i.loose ? _u2.tokens[0] && ["paragraph", "text"].includes(_u2.tokens[0].type) && "tokens" in _u2.tokens[0] && _u2.tokens[0].tokens ? (_u2.tokens[0].raw = _c2.raw + _u2.tokens[0].raw, _u2.tokens[0].text = _c2.raw + _u2.tokens[0].text, _u2.tokens[0].tokens.unshift(_c2)) : _u2.tokens.unshift({
                    type: "paragraph",
                    raw: _c2.raw,
                    text: _c2.raw,
                    tokens: [_c2]
                  }) : _u2.tokens.unshift(_c2);
                }
              }
              if (!i.loose) {
                var _p3 = _u2.tokens.filter(function (g) {
                    return g.type === "space";
                  }),
                  _c3 = _p3.length > 0 && _p3.some(function (g) {
                    return _this.rules.other.anyLine.test(g.raw);
                  });
                i.loose = _c3;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
          if (i.loose) {
            var _iterator3 = _createForOfIteratorHelper(i.items),
              _step3;
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                var _u = _step3.value;
                _u.loose = !0;
                var _iterator4 = _createForOfIteratorHelper(_u.tokens),
                  _step4;
                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    var _p = _step4.value;
                    _p.type === "text" && (_p.type = "paragraph");
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          }
          return i;
        }
      }
    }, {
      key: "html",
      value: function html(e) {
        var t = this.rules.block.html.exec(e);
        if (t) return {
          type: "html",
          block: !0,
          raw: t[0],
          pre: t[1] === "pre" || t[1] === "script" || t[1] === "style",
          text: t[0]
        };
      }
    }, {
      key: "def",
      value: function def(e) {
        var t = this.rules.block.def.exec(e);
        if (t) {
          var n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "),
            r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "",
            i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
          return {
            type: "def",
            tag: n,
            raw: t[0],
            href: r,
            title: i
          };
        }
      }
    }, {
      key: "table",
      value: function table(e) {
        var _t$,
          _this2 = this;
        var t = this.rules.block.table.exec(e);
        if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
        var n = V(t[1]),
          r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"),
          i = (_t$ = t[3]) !== null && _t$ !== void 0 && _t$.trim() ? t[3].replace(this.rules.other.tableRowBlankLine, "").split("\n") : [],
          s = {
            type: "table",
            raw: t[0],
            header: [],
            align: [],
            rows: []
          };
        if (n.length === r.length) {
          var _iterator5 = _createForOfIteratorHelper(r),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var _a = _step5.value;
              this.rules.other.tableAlignRight.test(_a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(_a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(_a) ? s.align.push("left") : s.align.push(null);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          for (var a = 0; a < n.length; a++) s.header.push({
            text: n[a],
            tokens: this.lexer.inline(n[a]),
            header: !0,
            align: s.align[a]
          });
          var _iterator6 = _createForOfIteratorHelper(i),
            _step6;
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var _a2 = _step6.value;
              s.rows.push(V(_a2, s.header.length).map(function (o, u) {
                return {
                  text: o,
                  tokens: _this2.lexer.inline(o),
                  header: !1,
                  align: s.align[u]
                };
              }));
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
          return s;
        }
      }
    }, {
      key: "lheading",
      value: function lheading(e) {
        var t = this.rules.block.lheading.exec(e);
        if (t) return {
          type: "heading",
          raw: t[0],
          depth: t[2].charAt(0) === "=" ? 1 : 2,
          text: t[1],
          tokens: this.lexer.inline(t[1])
        };
      }
    }, {
      key: "paragraph",
      value: function paragraph(e) {
        var t = this.rules.block.paragraph.exec(e);
        if (t) {
          var n = t[1].charAt(t[1].length - 1) === "\n" ? t[1].slice(0, -1) : t[1];
          return {
            type: "paragraph",
            raw: t[0],
            text: n,
            tokens: this.lexer.inline(n)
          };
        }
      }
    }, {
      key: "text",
      value: function text(e) {
        var t = this.rules.block.text.exec(e);
        if (t) return {
          type: "text",
          raw: t[0],
          text: t[0],
          tokens: this.lexer.inline(t[0])
        };
      }
    }, {
      key: "escape",
      value: function escape(e) {
        var t = this.rules.inline.escape.exec(e);
        if (t) return {
          type: "escape",
          raw: t[0],
          text: t[1]
        };
      }
    }, {
      key: "tag",
      value: function tag(e) {
        var t = this.rules.inline.tag.exec(e);
        if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = !1), {
          type: "html",
          raw: t[0],
          inLink: this.lexer.state.inLink,
          inRawBlock: this.lexer.state.inRawBlock,
          block: !1,
          text: t[0]
        };
      }
    }, {
      key: "link",
      value: function link(e) {
        var t = this.rules.inline.link.exec(e);
        if (t) {
          var n = t[2].trim();
          if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
            if (!this.rules.other.endAngleBracket.test(n)) return;
            var s = z(n.slice(0, -1), "\\");
            if ((n.length - s.length) % 2 === 0) return;
          } else {
            var _s2 = ge(t[2], "()");
            if (_s2 === -2) return;
            if (_s2 > -1) {
              var o = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + _s2;
              t[2] = t[2].substring(0, _s2), t[0] = t[0].substring(0, o).trim(), t[3] = "";
            }
          }
          var r = t[2],
            i = "";
          if (this.options.pedantic) {
            var _s3 = this.rules.other.pedanticHrefTitle.exec(r);
            _s3 && (r = _s3[1], i = _s3[3]);
          } else i = t[3] ? t[3].slice(1, -1) : "";
          return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), fe(t, {
            href: r && r.replace(this.rules.inline.anyPunctuation, "$1"),
            title: i && i.replace(this.rules.inline.anyPunctuation, "$1")
          }, t[0], this.lexer, this.rules);
        }
      }
    }, {
      key: "reflink",
      value: function reflink(e, t) {
        var n;
        if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
          var r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "),
            i = t[r.toLowerCase()];
          if (!i) {
            var s = n[0].charAt(0);
            return {
              type: "text",
              raw: s,
              text: s
            };
          }
          return fe(n, i, n[0], this.lexer, this.rules);
        }
      }
    }, {
      key: "emStrong",
      value: function emStrong(e, t) {
        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "";
        var r = this.rules.inline.emStrongLDelim.exec(e);
        if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
        if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
          var s = _toConsumableArray(r[0]).length - 1,
            a,
            o,
            u = s,
            p = 0,
            c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
          for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = c.exec(t)) != null;) {
            if (a = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !a) continue;
            if (o = _toConsumableArray(a).length, r[3] || r[4]) {
              u += o;
              continue;
            } else if ((r[5] || r[6]) && s % 3 && !((s + o) % 3)) {
              p += o;
              continue;
            }
            if (u -= o, u > 0) continue;
            o = Math.min(o, o + u + p);
            var g = _toConsumableArray(r[0])[0].length,
              h = e.slice(0, s + r.index + g + o);
            if (Math.min(s, o) % 2) {
              var f = h.slice(1, -1);
              return {
                type: "em",
                raw: h,
                text: f,
                tokens: this.lexer.inlineTokens(f)
              };
            }
            var R = h.slice(2, -2);
            return {
              type: "strong",
              raw: h,
              text: R,
              tokens: this.lexer.inlineTokens(R)
            };
          }
        }
      }
    }, {
      key: "codespan",
      value: function codespan(e) {
        var t = this.rules.inline.code.exec(e);
        if (t) {
          var n = t[2].replace(this.rules.other.newLineCharGlobal, " "),
            r = this.rules.other.nonSpaceChar.test(n),
            i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
          return r && i && (n = n.substring(1, n.length - 1)), {
            type: "codespan",
            raw: t[0],
            text: n
          };
        }
      }
    }, {
      key: "br",
      value: function br(e) {
        var t = this.rules.inline.br.exec(e);
        if (t) return {
          type: "br",
          raw: t[0]
        };
      }
    }, {
      key: "del",
      value: function del(e) {
        var t = this.rules.inline.del.exec(e);
        if (t) return {
          type: "del",
          raw: t[0],
          text: t[2],
          tokens: this.lexer.inlineTokens(t[2])
        };
      }
    }, {
      key: "autolink",
      value: function autolink(e) {
        var t = this.rules.inline.autolink.exec(e);
        if (t) {
          var n, r;
          return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), {
            type: "link",
            raw: t[0],
            text: n,
            href: r,
            tokens: [{
              type: "text",
              raw: n,
              text: n
            }]
          };
        }
      }
    }, {
      key: "url",
      value: function url(e) {
        var t;
        if (t = this.rules.inline.url.exec(e)) {
          var n, r;
          if (t[2] === "@") n = t[0], r = "mailto:" + n;else {
            var i;
            do {
              var _this$rules$inline$_b, _this$rules$inline$_b2;
              i = t[0], t[0] = (_this$rules$inline$_b = (_this$rules$inline$_b2 = this.rules.inline._backpedal.exec(t[0])) === null || _this$rules$inline$_b2 === void 0 ? void 0 : _this$rules$inline$_b2[0]) !== null && _this$rules$inline$_b !== void 0 ? _this$rules$inline$_b : "";
            } while (i !== t[0]);
            n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
          }
          return {
            type: "link",
            raw: t[0],
            text: n,
            href: r,
            tokens: [{
              type: "text",
              raw: n,
              text: n
            }]
          };
        }
      }
    }, {
      key: "inlineText",
      value: function inlineText(e) {
        var t = this.rules.inline.text.exec(e);
        if (t) {
          var n = this.lexer.state.inRawBlock;
          return {
            type: "text",
            raw: t[0],
            text: t[0],
            escaped: n
          };
        }
      }
    }]);
  }();
  var x = /*#__PURE__*/function () {
    function l(e) {
      _classCallCheck(this, l);
      _defineProperty(this, "tokens", void 0);
      _defineProperty(this, "options", void 0);
      _defineProperty(this, "state", void 0);
      _defineProperty(this, "inlineQueue", void 0);
      _defineProperty(this, "tokenizer", void 0);
      this.tokens = [], this.tokens.links = Object.create(null), this.options = e || T, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
        inLink: !1,
        inRawBlock: !1,
        top: !0
      };
      var t = {
        other: m,
        block: B.normal,
        inline: M.normal
      };
      this.options.pedantic ? (t.block = B.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = B.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
    }
    return _createClass(l, [{
      key: "lex",
      value: function lex(e) {
        e = e.replace(m.carriageReturn, "\n"), this.blockTokens(e, this.tokens);
        for (var t = 0; t < this.inlineQueue.length; t++) {
          var n = this.inlineQueue[t];
          this.inlineTokens(n.src, n.tokens);
        }
        return this.inlineQueue = [], this.tokens;
      }
    }, {
      key: "blockTokens",
      value: function blockTokens(e) {
        var _this3 = this;
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var n = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : !1;
        var _loop2 = function _loop2() {
            var _this3$options$extens, _this3$options$extens2;
            var r;
            if ((_this3$options$extens = _this3.options.extensions) !== null && _this3$options$extens !== void 0 && (_this3$options$extens = _this3$options$extens.block) !== null && _this3$options$extens !== void 0 && _this3$options$extens.some(function (s) {
              return (r = s.call({
                lexer: _this3
              }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), !0) : !1;
            })) return 0; // continue
            if (r = _this3.tokenizer.space(e)) {
              e = e.substring(r.raw.length);
              var s = t.at(-1);
              r.raw.length === 1 && s !== void 0 ? s.raw += "\n" : t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.code(e)) {
              e = e.substring(r.raw.length);
              var _s4 = t.at(-1);
              (_s4 === null || _s4 === void 0 ? void 0 : _s4.type) === "paragraph" || (_s4 === null || _s4 === void 0 ? void 0 : _s4.type) === "text" ? (_s4.raw += (_s4.raw.endsWith("\n") ? "" : "\n") + r.raw, _s4.text += "\n" + r.text, _this3.inlineQueue.at(-1).src = _s4.text) : t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.fences(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.heading(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.hr(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.blockquote(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.list(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.html(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.def(e)) {
              e = e.substring(r.raw.length);
              var _s5 = t.at(-1);
              (_s5 === null || _s5 === void 0 ? void 0 : _s5.type) === "paragraph" || (_s5 === null || _s5 === void 0 ? void 0 : _s5.type) === "text" ? (_s5.raw += (_s5.raw.endsWith("\n") ? "" : "\n") + r.raw, _s5.text += "\n" + r.raw, _this3.inlineQueue.at(-1).src = _s5.text) : _this3.tokens.links[r.tag] || (_this3.tokens.links[r.tag] = {
                href: r.href,
                title: r.title
              }, t.push(r));
              return 0; // continue
            }
            if (r = _this3.tokenizer.table(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            if (r = _this3.tokenizer.lheading(e)) {
              e = e.substring(r.raw.length), t.push(r);
              return 0; // continue
            }
            var i = e;
            if ((_this3$options$extens2 = _this3.options.extensions) !== null && _this3$options$extens2 !== void 0 && _this3$options$extens2.startBlock) {
              var _s6 = 1 / 0,
                a = e.slice(1),
                o;
              _this3.options.extensions.startBlock.forEach(function (u) {
                o = u.call({
                  lexer: _this3
                }, a), typeof o == "number" && o >= 0 && (_s6 = Math.min(_s6, o));
              }), _s6 < 1 / 0 && _s6 >= 0 && (i = e.substring(0, _s6 + 1));
            }
            if (_this3.state.top && (r = _this3.tokenizer.paragraph(i))) {
              var _s7 = t.at(-1);
              n && (_s7 === null || _s7 === void 0 ? void 0 : _s7.type) === "paragraph" ? (_s7.raw += (_s7.raw.endsWith("\n") ? "" : "\n") + r.raw, _s7.text += "\n" + r.text, _this3.inlineQueue.pop(), _this3.inlineQueue.at(-1).src = _s7.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
              return 0; // continue
            }
            if (r = _this3.tokenizer.text(e)) {
              e = e.substring(r.raw.length);
              var _s8 = t.at(-1);
              (_s8 === null || _s8 === void 0 ? void 0 : _s8.type) === "text" ? (_s8.raw += (_s8.raw.endsWith("\n") ? "" : "\n") + r.raw, _s8.text += "\n" + r.text, _this3.inlineQueue.pop(), _this3.inlineQueue.at(-1).src = _s8.text) : t.push(r);
              return 0; // continue
            }
            if (e) {
              var _s9 = "Infinite loop on byte: " + e.charCodeAt(0);
              if (_this3.options.silent) {
                console.error(_s9);
                return 1; // break
              } else throw new Error(_s9);
            }
          },
          _ret;
        for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e;) {
          _ret = _loop2();
          if (_ret === 0) continue;
          if (_ret === 1) break;
        }
        return this.state.top = !0, t;
      }
    }, {
      key: "inline",
      value: function inline(e) {
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        return this.inlineQueue.push({
          src: e,
          tokens: t
        }), t;
      }
    }, {
      key: "inlineTokens",
      value: function inlineTokens(e) {
        var _this$options$hooks$e,
          _this$options$hooks,
          _this4 = this;
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        var n = e,
          r = null;
        if (this.tokens.links) {
          var o = Object.keys(this.tokens.links);
          if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null;) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
        }
        for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null;) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
        var i;
        for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null;) i = r[2] ? r[2].length : 0, n = n.slice(0, r.index + i) + "[" + "a".repeat(r[0].length - i - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        n = (_this$options$hooks$e = (_this$options$hooks = this.options.hooks) === null || _this$options$hooks === void 0 || (_this$options$hooks = _this$options$hooks.emStrongMask) === null || _this$options$hooks === void 0 ? void 0 : _this$options$hooks.call({
          lexer: this
        }, n)) !== null && _this$options$hooks$e !== void 0 ? _this$options$hooks$e : n;
        var s = !1,
          a = "";
        var _loop3 = function _loop3() {
            var _this4$options$extens, _this4$options$extens2;
            s || (a = ""), s = !1;
            var o;
            if ((_this4$options$extens = _this4.options.extensions) !== null && _this4$options$extens !== void 0 && (_this4$options$extens = _this4$options$extens.inline) !== null && _this4$options$extens !== void 0 && _this4$options$extens.some(function (p) {
              return (o = p.call({
                lexer: _this4
              }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), !0) : !1;
            })) return 0; // continue
            if (o = _this4.tokenizer.escape(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.tag(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.link(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.reflink(e, _this4.tokens.links)) {
              e = e.substring(o.raw.length);
              var p = t.at(-1);
              o.type === "text" && (p === null || p === void 0 ? void 0 : p.type) === "text" ? (p.raw += o.raw, p.text += o.text) : t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.emStrong(e, n, a)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.codespan(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.br(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.del(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (o = _this4.tokenizer.autolink(e)) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            if (!_this4.state.inLink && (o = _this4.tokenizer.url(e))) {
              e = e.substring(o.raw.length), t.push(o);
              return 0; // continue
            }
            var u = e;
            if ((_this4$options$extens2 = _this4.options.extensions) !== null && _this4$options$extens2 !== void 0 && _this4$options$extens2.startInline) {
              var _p4 = 1 / 0,
                c = e.slice(1),
                g;
              _this4.options.extensions.startInline.forEach(function (h) {
                g = h.call({
                  lexer: _this4
                }, c), typeof g == "number" && g >= 0 && (_p4 = Math.min(_p4, g));
              }), _p4 < 1 / 0 && _p4 >= 0 && (u = e.substring(0, _p4 + 1));
            }
            if (o = _this4.tokenizer.inlineText(u)) {
              e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (a = o.raw.slice(-1)), s = !0;
              var _p5 = t.at(-1);
              (_p5 === null || _p5 === void 0 ? void 0 : _p5.type) === "text" ? (_p5.raw += o.raw, _p5.text += o.text) : t.push(o);
              return 0; // continue
            }
            if (e) {
              var _p6 = "Infinite loop on byte: " + e.charCodeAt(0);
              if (_this4.options.silent) {
                console.error(_p6);
                return 1; // break
              } else throw new Error(_p6);
            }
          },
          _ret2;
        for (; e;) {
          _ret2 = _loop3();
          if (_ret2 === 0) continue;
          if (_ret2 === 1) break;
        }
        return t;
      }
    }], [{
      key: "rules",
      get: function get() {
        return {
          block: B,
          inline: M
        };
      }
    }, {
      key: "lex",
      value: function lex(e, t) {
        return new l(t).lex(e);
      }
    }, {
      key: "lexInline",
      value: function lexInline(e, t) {
        return new l(t).inlineTokens(e);
      }
    }]);
  }();
  var P = /*#__PURE__*/function () {
    function P(e) {
      _classCallCheck(this, P);
      _defineProperty(this, "options", void 0);
      _defineProperty(this, "parser", void 0);
      this.options = e || T;
    }
    return _createClass(P, [{
      key: "space",
      value: function space(e) {
        return "";
      }
    }, {
      key: "code",
      value: function code(_ref) {
        var _match;
        var e = _ref.text,
          t = _ref.lang,
          n = _ref.escaped;
        var r = (_match = (t || "").match(m.notSpaceStart)) === null || _match === void 0 ? void 0 : _match[0],
          i = e.replace(m.endingNewline, "") + "\n";
        return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, !0)) + "</code></pre>\n" : "<pre><code>" + (n ? i : w(i, !0)) + "</code></pre>\n";
      }
    }, {
      key: "blockquote",
      value: function blockquote(_ref2) {
        var e = _ref2.tokens;
        return "<blockquote>\n".concat(this.parser.parse(e), "</blockquote>\n");
      }
    }, {
      key: "html",
      value: function html(_ref3) {
        var e = _ref3.text;
        return e;
      }
    }, {
      key: "def",
      value: function def(e) {
        return "";
      }
    }, {
      key: "heading",
      value: function heading(_ref4) {
        var e = _ref4.tokens,
          t = _ref4.depth;
        return "<h".concat(t, ">").concat(this.parser.parseInline(e), "</h").concat(t, ">\n");
      }
    }, {
      key: "hr",
      value: function hr(e) {
        return "<hr>\n";
      }
    }, {
      key: "list",
      value: function list(e) {
        var t = e.ordered,
          n = e.start,
          r = "";
        for (var a = 0; a < e.items.length; a++) {
          var o = e.items[a];
          r += this.listitem(o);
        }
        var i = t ? "ol" : "ul",
          s = t && n !== 1 ? ' start="' + n + '"' : "";
        return "<" + i + s + ">\n" + r + "</" + i + ">\n";
      }
    }, {
      key: "listitem",
      value: function listitem(e) {
        return "<li>".concat(this.parser.parse(e.tokens), "</li>\n");
      }
    }, {
      key: "checkbox",
      value: function checkbox(_ref5) {
        var e = _ref5.checked;
        return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
      }
    }, {
      key: "paragraph",
      value: function paragraph(_ref6) {
        var e = _ref6.tokens;
        return "<p>".concat(this.parser.parseInline(e), "</p>\n");
      }
    }, {
      key: "table",
      value: function table(e) {
        var t = "",
          n = "";
        for (var i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
        t += this.tablerow({
          text: n
        });
        var r = "";
        for (var _i = 0; _i < e.rows.length; _i++) {
          var s = e.rows[_i];
          n = "";
          for (var a = 0; a < s.length; a++) n += this.tablecell(s[a]);
          r += this.tablerow({
            text: n
          });
        }
        return r && (r = "<tbody>".concat(r, "</tbody>")), "<table>\n<thead>\n" + t + "</thead>\n" + r + "</table>\n";
      }
    }, {
      key: "tablerow",
      value: function tablerow(_ref7) {
        var e = _ref7.text;
        return "<tr>\n".concat(e, "</tr>\n");
      }
    }, {
      key: "tablecell",
      value: function tablecell(e) {
        var t = this.parser.parseInline(e.tokens),
          n = e.header ? "th" : "td";
        return (e.align ? "<".concat(n, " align=\"").concat(e.align, "\">") : "<".concat(n, ">")) + t + "</".concat(n, ">\n");
      }
    }, {
      key: "strong",
      value: function strong(_ref8) {
        var e = _ref8.tokens;
        return "<strong>".concat(this.parser.parseInline(e), "</strong>");
      }
    }, {
      key: "em",
      value: function em(_ref9) {
        var e = _ref9.tokens;
        return "<em>".concat(this.parser.parseInline(e), "</em>");
      }
    }, {
      key: "codespan",
      value: function codespan(_ref0) {
        var e = _ref0.text;
        return "<code>".concat(w(e, !0), "</code>");
      }
    }, {
      key: "br",
      value: function br(e) {
        return "<br>";
      }
    }, {
      key: "del",
      value: function del(_ref1) {
        var e = _ref1.tokens;
        return "<del>".concat(this.parser.parseInline(e), "</del>");
      }
    }, {
      key: "link",
      value: function link(_ref10) {
        var e = _ref10.href,
          t = _ref10.title,
          n = _ref10.tokens;
        var r = this.parser.parseInline(n),
          i = J(e);
        if (i === null) return r;
        e = i;
        var s = '<a href="' + e + '"';
        return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
      }
    }, {
      key: "image",
      value: function image(_ref11) {
        var e = _ref11.href,
          t = _ref11.title,
          n = _ref11.text,
          r = _ref11.tokens;
        r && (n = this.parser.parseInline(r, this.parser.textRenderer));
        var i = J(e);
        if (i === null) return w(n);
        e = i;
        var s = "<img src=\"".concat(e, "\" alt=\"").concat(n, "\"");
        return t && (s += " title=\"".concat(w(t), "\"")), s += ">", s;
      }
    }, {
      key: "text",
      value: function text(e) {
        return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
      }
    }]);
  }();
  var $ = /*#__PURE__*/function () {
    function $() {
      _classCallCheck(this, $);
    }
    return _createClass($, [{
      key: "strong",
      value: function strong(_ref12) {
        var e = _ref12.text;
        return e;
      }
    }, {
      key: "em",
      value: function em(_ref13) {
        var e = _ref13.text;
        return e;
      }
    }, {
      key: "codespan",
      value: function codespan(_ref14) {
        var e = _ref14.text;
        return e;
      }
    }, {
      key: "del",
      value: function del(_ref15) {
        var e = _ref15.text;
        return e;
      }
    }, {
      key: "html",
      value: function html(_ref16) {
        var e = _ref16.text;
        return e;
      }
    }, {
      key: "text",
      value: function text(_ref17) {
        var e = _ref17.text;
        return e;
      }
    }, {
      key: "link",
      value: function link(_ref18) {
        var e = _ref18.text;
        return "" + e;
      }
    }, {
      key: "image",
      value: function image(_ref19) {
        var e = _ref19.text;
        return "" + e;
      }
    }, {
      key: "br",
      value: function br() {
        return "";
      }
    }, {
      key: "checkbox",
      value: function checkbox(_ref20) {
        var e = _ref20.raw;
        return e;
      }
    }]);
  }();
  var b = /*#__PURE__*/function () {
    function l(e) {
      _classCallCheck(this, l);
      _defineProperty(this, "options", void 0);
      _defineProperty(this, "renderer", void 0);
      _defineProperty(this, "textRenderer", void 0);
      this.options = e || T, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new $();
    }
    return _createClass(l, [{
      key: "parse",
      value: function parse(e) {
        var t = "";
        for (var n = 0; n < e.length; n++) {
          var _this$options$extensi;
          var r = e[n];
          if ((_this$options$extensi = this.options.extensions) !== null && _this$options$extensi !== void 0 && (_this$options$extensi = _this$options$extensi.renderers) !== null && _this$options$extensi !== void 0 && _this$options$extensi[r.type]) {
            var s = r,
              a = this.options.extensions.renderers[s.type].call({
                parser: this
              }, s);
            if (a !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(s.type)) {
              t += a || "";
              continue;
            }
          }
          var i = r;
          switch (i.type) {
            case "space":
              {
                t += this.renderer.space(i);
                break;
              }
            case "hr":
              {
                t += this.renderer.hr(i);
                break;
              }
            case "heading":
              {
                t += this.renderer.heading(i);
                break;
              }
            case "code":
              {
                t += this.renderer.code(i);
                break;
              }
            case "table":
              {
                t += this.renderer.table(i);
                break;
              }
            case "blockquote":
              {
                t += this.renderer.blockquote(i);
                break;
              }
            case "list":
              {
                t += this.renderer.list(i);
                break;
              }
            case "checkbox":
              {
                t += this.renderer.checkbox(i);
                break;
              }
            case "html":
              {
                t += this.renderer.html(i);
                break;
              }
            case "def":
              {
                t += this.renderer.def(i);
                break;
              }
            case "paragraph":
              {
                t += this.renderer.paragraph(i);
                break;
              }
            case "text":
              {
                t += this.renderer.text(i);
                break;
              }
            default:
              {
                var _s0 = 'Token with "' + i.type + '" type was not found.';
                if (this.options.silent) return console.error(_s0), "";
                throw new Error(_s0);
              }
          }
        }
        return t;
      }
    }, {
      key: "parseInline",
      value: function parseInline(e) {
        var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.renderer;
        var n = "";
        for (var r = 0; r < e.length; r++) {
          var _this$options$extensi2;
          var i = e[r];
          if ((_this$options$extensi2 = this.options.extensions) !== null && _this$options$extensi2 !== void 0 && (_this$options$extensi2 = _this$options$extensi2.renderers) !== null && _this$options$extensi2 !== void 0 && _this$options$extensi2[i.type]) {
            var a = this.options.extensions.renderers[i.type].call({
              parser: this
            }, i);
            if (a !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
              n += a || "";
              continue;
            }
          }
          var s = i;
          switch (s.type) {
            case "escape":
              {
                n += t.text(s);
                break;
              }
            case "html":
              {
                n += t.html(s);
                break;
              }
            case "link":
              {
                n += t.link(s);
                break;
              }
            case "image":
              {
                n += t.image(s);
                break;
              }
            case "checkbox":
              {
                n += t.checkbox(s);
                break;
              }
            case "strong":
              {
                n += t.strong(s);
                break;
              }
            case "em":
              {
                n += t.em(s);
                break;
              }
            case "codespan":
              {
                n += t.codespan(s);
                break;
              }
            case "br":
              {
                n += t.br(s);
                break;
              }
            case "del":
              {
                n += t.del(s);
                break;
              }
            case "text":
              {
                n += t.text(s);
                break;
              }
            default:
              {
                var _a3 = 'Token with "' + s.type + '" type was not found.';
                if (this.options.silent) return console.error(_a3), "";
                throw new Error(_a3);
              }
          }
        }
        return n;
      }
    }], [{
      key: "parse",
      value: function parse(e, t) {
        return new l(t).parse(e);
      }
    }, {
      key: "parseInline",
      value: function parseInline(e, t) {
        return new l(t).parseInline(e);
      }
    }]);
  }();
  var S = (_Class3 = /*#__PURE__*/function () {
    function S(e) {
      _classCallCheck(this, S);
      _defineProperty(this, "options", void 0);
      _defineProperty(this, "block", void 0);
      this.options = e || T;
    }
    return _createClass(S, [{
      key: "preprocess",
      value: function preprocess(e) {
        return e;
      }
    }, {
      key: "postprocess",
      value: function postprocess(e) {
        return e;
      }
    }, {
      key: "processAllTokens",
      value: function processAllTokens(e) {
        return e;
      }
    }, {
      key: "emStrongMask",
      value: function emStrongMask(e) {
        return e;
      }
    }, {
      key: "provideLexer",
      value: function provideLexer() {
        return this.block ? x.lex : x.lexInline;
      }
    }, {
      key: "provideParser",
      value: function provideParser() {
        return this.block ? b.parse : b.parseInline;
      }
    }]);
  }(), _defineProperty(_Class3, "passThroughHooks", new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"])), _defineProperty(_Class3, "passThroughHooksRespectAsync", new Set(["preprocess", "postprocess", "processAllTokens"])), _Class3);
  var A = /*#__PURE__*/function () {
    function A() {
      _classCallCheck(this, A);
      _defineProperty(this, "defaults", _());
      _defineProperty(this, "options", this.setOptions);
      _defineProperty(this, "parse", this.parseMarkdown(!0));
      _defineProperty(this, "parseInline", this.parseMarkdown(!1));
      _defineProperty(this, "Parser", b);
      _defineProperty(this, "Renderer", P);
      _defineProperty(this, "TextRenderer", $);
      _defineProperty(this, "Lexer", x);
      _defineProperty(this, "Tokenizer", y);
      _defineProperty(this, "Hooks", S);
      this.use.apply(this, arguments);
    }
    return _createClass(A, [{
      key: "walkTokens",
      value: function walkTokens(e, t) {
        var _this5 = this;
        var n = [];
        var _iterator7 = _createForOfIteratorHelper(e),
          _step7;
        try {
          var _loop4 = function _loop4() {
            var r = _step7.value;
            switch (n = n.concat(t.call(_this5, r)), r.type) {
              case "table":
                {
                  var i = r;
                  var _iterator8 = _createForOfIteratorHelper(i.header),
                    _step8;
                  try {
                    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                      var s = _step8.value;
                      n = n.concat(_this5.walkTokens(s.tokens, t));
                    }
                  } catch (err) {
                    _iterator8.e(err);
                  } finally {
                    _iterator8.f();
                  }
                  var _iterator9 = _createForOfIteratorHelper(i.rows),
                    _step9;
                  try {
                    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                      var _s1 = _step9.value;
                      var _iterator0 = _createForOfIteratorHelper(_s1),
                        _step0;
                      try {
                        for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
                          var a = _step0.value;
                          n = n.concat(_this5.walkTokens(a.tokens, t));
                        }
                      } catch (err) {
                        _iterator0.e(err);
                      } finally {
                        _iterator0.f();
                      }
                    }
                  } catch (err) {
                    _iterator9.e(err);
                  } finally {
                    _iterator9.f();
                  }
                  break;
                }
              case "list":
                {
                  var _i2 = r;
                  n = n.concat(_this5.walkTokens(_i2.items, t));
                  break;
                }
              default:
                {
                  var _this5$defaults$exten;
                  var _i3 = r;
                  (_this5$defaults$exten = _this5.defaults.extensions) !== null && _this5$defaults$exten !== void 0 && (_this5$defaults$exten = _this5$defaults$exten.childTokens) !== null && _this5$defaults$exten !== void 0 && _this5$defaults$exten[_i3.type] ? _this5.defaults.extensions.childTokens[_i3.type].forEach(function (s) {
                    var a = _i3[s].flat(1 / 0);
                    n = n.concat(_this5.walkTokens(a, t));
                  }) : _i3.tokens && (n = n.concat(_this5.walkTokens(_i3.tokens, t)));
                }
            }
          };
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            _loop4();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
        return n;
      }
    }, {
      key: "use",
      value: function use() {
        var _this6 = this;
        var t = this.defaults.extensions || {
          renderers: {},
          childTokens: {}
        };
        for (var _len = arguments.length, e = new Array(_len), _key = 0; _key < _len; _key++) {
          e[_key] = arguments[_key];
        }
        return e.forEach(function (n) {
          var r = _objectSpread({}, n);
          if (r.async = _this6.defaults.async || r.async || !1, n.extensions && (n.extensions.forEach(function (i) {
            if (!i.name) throw new Error("extension name required");
            if ("renderer" in i) {
              var s = t.renderers[i.name];
              s ? t.renderers[i.name] = function () {
                for (var _len2 = arguments.length, a = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  a[_key2] = arguments[_key2];
                }
                var o = i.renderer.apply(this, a);
                return o === !1 && (o = s.apply(this, a)), o;
              } : t.renderers[i.name] = i.renderer;
            }
            if ("tokenizer" in i) {
              if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
              var _s10 = t[i.level];
              _s10 ? _s10.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
            }
            "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
          }), r.extensions = t), n.renderer) {
            var i = _this6.defaults.renderer || new P(_this6.defaults);
            var _loop5 = function _loop5() {
              if (!(s in i)) throw new Error("renderer '".concat(s, "' does not exist"));
              if (["options", "parser"].includes(s)) return 1; // continue
              var a = s,
                o = n.renderer[a],
                u = i[a];
              i[a] = function () {
                for (var _len3 = arguments.length, p = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                  p[_key3] = arguments[_key3];
                }
                var c = o.apply(i, p);
                return c === !1 && (c = u.apply(i, p)), c || "";
              };
            };
            for (var s in n.renderer) {
              if (_loop5()) continue;
            }
            r.renderer = i;
          }
          if (n.tokenizer) {
            var _i4 = _this6.defaults.tokenizer || new y(_this6.defaults);
            var _loop6 = function _loop6() {
              if (!(_s11 in _i4)) throw new Error("tokenizer '".concat(_s11, "' does not exist"));
              if (["options", "rules", "lexer"].includes(_s11)) return 1; // continue
              var a = _s11,
                o = n.tokenizer[a],
                u = _i4[a];
              _i4[a] = function () {
                for (var _len4 = arguments.length, p = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                  p[_key4] = arguments[_key4];
                }
                var c = o.apply(_i4, p);
                return c === !1 && (c = u.apply(_i4, p)), c;
              };
            };
            for (var _s11 in n.tokenizer) {
              if (_loop6()) continue;
            }
            r.tokenizer = _i4;
          }
          if (n.hooks) {
            var _i5 = _this6.defaults.hooks || new S();
            var _loop7 = function _loop7(_s12) {
              if (!(_s12 in _i5)) throw new Error("hook '".concat(_s12, "' does not exist"));
              if (["options", "block"].includes(_s12)) return 1; // continue
              var a = _s12,
                o = n.hooks[a],
                u = _i5[a];
              S.passThroughHooks.has(_s12) ? _i5[a] = function (p) {
                if (_this6.defaults.async && S.passThroughHooksRespectAsync.has(_s12)) return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
                  var g;
                  return _regenerator().w(function (_context) {
                    while (1) switch (_context.n) {
                      case 0:
                        _context.n = 1;
                        return o.call(_i5, p);
                      case 1:
                        g = _context.v;
                        return _context.a(2, u.call(_i5, g));
                    }
                  }, _callee);
                }))();
                var c = o.call(_i5, p);
                return u.call(_i5, c);
              } : _i5[a] = function () {
                for (var _len5 = arguments.length, p = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
                  p[_key5] = arguments[_key5];
                }
                if (_this6.defaults.async) return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
                  var g, _t;
                  return _regenerator().w(function (_context2) {
                    while (1) switch (_context2.n) {
                      case 0:
                        _context2.n = 1;
                        return o.apply(_i5, p);
                      case 1:
                        g = _context2.v;
                        _t = g === !1;
                        if (!_t) {
                          _context2.n = 3;
                          break;
                        }
                        _context2.n = 2;
                        return u.apply(_i5, p);
                      case 2:
                        g = _context2.v;
                      case 3:
                        return _context2.a(2, g);
                    }
                  }, _callee2);
                }))();
                var c = o.apply(_i5, p);
                return c === !1 && (c = u.apply(_i5, p)), c;
              };
            };
            for (var _s12 in n.hooks) {
              if (_loop7(_s12)) continue;
            }
            r.hooks = _i5;
          }
          if (n.walkTokens) {
            var _i6 = _this6.defaults.walkTokens,
              _s13 = n.walkTokens;
            r.walkTokens = function (a) {
              var o = [];
              return o.push(_s13.call(this, a)), _i6 && (o = o.concat(_i6.call(this, a))), o;
            };
          }
          _this6.defaults = _objectSpread(_objectSpread({}, _this6.defaults), r);
        }), this;
      }
    }, {
      key: "setOptions",
      value: function setOptions(e) {
        return this.defaults = _objectSpread(_objectSpread({}, this.defaults), e), this;
      }
    }, {
      key: "lexer",
      value: function lexer(e, t) {
        return x.lex(e, t !== null && t !== void 0 ? t : this.defaults);
      }
    }, {
      key: "parser",
      value: function parser(e, t) {
        return b.parse(e, t !== null && t !== void 0 ? t : this.defaults);
      }
    }, {
      key: "parseMarkdown",
      value: function parseMarkdown(e) {
        var _this7 = this;
        return function (n, r) {
          var i = _objectSpread({}, r),
            s = _objectSpread(_objectSpread({}, _this7.defaults), i),
            a = _this7.onError(!!s.silent, !!s.async);
          if (_this7.defaults.async === !0 && i.async === !1) return a(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
          if (_typeof(n) > "u" || n === null) return a(new Error("marked(): input parameter is undefined or null"));
          if (typeof n != "string") return a(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
          if (s.hooks && (s.hooks.options = s, s.hooks.block = e), s.async) return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
            var o, p, c, h, _t2, _t3, _t4, _t5, _t6, _t7, _t8, _t9;
            return _regenerator().w(function (_context3) {
              while (1) switch (_context3.n) {
                case 0:
                  if (!s.hooks) {
                    _context3.n = 2;
                    break;
                  }
                  _context3.n = 1;
                  return s.hooks.preprocess(n);
                case 1:
                  _t2 = _context3.v;
                  _context3.n = 3;
                  break;
                case 2:
                  _t2 = n;
                case 3:
                  o = _t2;
                  if (!s.hooks) {
                    _context3.n = 5;
                    break;
                  }
                  _context3.n = 4;
                  return s.hooks.provideLexer();
                case 4:
                  _t3 = _context3.v;
                  _context3.n = 6;
                  break;
                case 5:
                  _t3 = e ? x.lex : x.lexInline;
                case 6:
                  _t4 = _t3;
                  _context3.n = 7;
                  return _t4(o, s);
                case 7:
                  p = _context3.v;
                  if (!s.hooks) {
                    _context3.n = 9;
                    break;
                  }
                  _context3.n = 8;
                  return s.hooks.processAllTokens(p);
                case 8:
                  _t5 = _context3.v;
                  _context3.n = 10;
                  break;
                case 9:
                  _t5 = p;
                case 10:
                  c = _t5;
                  _t6 = s.walkTokens;
                  if (!_t6) {
                    _context3.n = 11;
                    break;
                  }
                  _context3.n = 11;
                  return Promise.all(_this7.walkTokens(c, s.walkTokens));
                case 11:
                  if (!s.hooks) {
                    _context3.n = 13;
                    break;
                  }
                  _context3.n = 12;
                  return s.hooks.provideParser();
                case 12:
                  _t7 = _context3.v;
                  _context3.n = 14;
                  break;
                case 13:
                  _t7 = e ? b.parse : b.parseInline;
                case 14:
                  _t8 = _t7;
                  _context3.n = 15;
                  return _t8(c, s);
                case 15:
                  h = _context3.v;
                  if (!s.hooks) {
                    _context3.n = 17;
                    break;
                  }
                  _context3.n = 16;
                  return s.hooks.postprocess(h);
                case 16:
                  _t9 = _context3.v;
                  _context3.n = 18;
                  break;
                case 17:
                  _t9 = h;
                case 18:
                  return _context3.a(2, _t9);
              }
            }, _callee3);
          }))().catch(a);
          try {
            s.hooks && (n = s.hooks.preprocess(n));
            var u = (s.hooks ? s.hooks.provideLexer() : e ? x.lex : x.lexInline)(n, s);
            s.hooks && (u = s.hooks.processAllTokens(u)), s.walkTokens && _this7.walkTokens(u, s.walkTokens);
            var c = (s.hooks ? s.hooks.provideParser() : e ? b.parse : b.parseInline)(u, s);
            return s.hooks && (c = s.hooks.postprocess(c)), c;
          } catch (o) {
            return a(o);
          }
        };
      }
    }, {
      key: "onError",
      value: function onError(e, t) {
        return function (n) {
          if (n.message += "\nPlease report this to https://github.com/markedjs/marked.", e) {
            var r = "<p>An error occurred:</p><pre>" + w(n.message + "", !0) + "</pre>";
            return t ? Promise.resolve(r) : r;
          }
          if (t) return Promise.reject(n);
          throw n;
        };
      }
    }]);
  }();
  var L = new A();
  function d(l, e) {
    return L.parse(l, e);
  }
  d.options = d.setOptions = function (l) {
    return L.setOptions(l), d.defaults = L.defaults, G(d.defaults), d;
  };
  d.getDefaults = _;
  d.defaults = T;
  d.use = function () {
    return L.use.apply(L, arguments), d.defaults = L.defaults, G(d.defaults), d;
  };
  d.walkTokens = function (l, e) {
    return L.walkTokens(l, e);
  };
  d.parseInline = L.parseInline;
  d.Parser = b;
  d.parser = b.parse;
  d.Renderer = P;
  d.TextRenderer = $;
  d.Lexer = x;
  d.lexer = x.lex;
  d.Tokenizer = y;
  d.Hooks = S;
  d.parse = d;
  var it = d.options,
    ot = d.setOptions,
    at = d.use,
    lt = d.walkTokens,
    ut = d.parseInline,
    pt = d,
    ct = b.parse,
    ht = x.lex;
  if (__exports != exports) module.exports = exports;
  return module.exports;
});
},{}],"jobs.js":[function(require,module,exports) {
"use strict";

var _axios = _interopRequireDefault(require("axios"));
var _marked = require("marked");
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var resultsContainer = document.querySelector(".results");

// Report Job Modal Logic
var reportJobModal = document.getElementById("reportJobModal");
var closeReportJobModal = document.getElementById("closeReportJobModal");
var cancelReportJobBtn = document.getElementById("cancelReportJobBtn");
var confirmReportJobBtn = document.getElementById("confirmReportJobBtn");
var jobToReportId = null;
var reportBtnToHide = null;
var closeReportModal = function closeReportModal() {
  if (reportJobModal) {
    reportJobModal.classList.add("hidden");
    jobToReportId = null;
    reportBtnToHide = null;
  }
};
var openReportModal = function openReportModal(jobId, btnElement) {
  if (reportJobModal) {
    jobToReportId = jobId;
    reportBtnToHide = btnElement;
    reportJobModal.classList.remove("hidden");
  }
};
if (reportJobModal) {
  closeReportJobModal.addEventListener("click", closeReportModal);
  cancelReportJobBtn.addEventListener("click", closeReportModal);
  reportJobModal.addEventListener("click", function (e) {
    if (e.target === reportJobModal) closeReportModal();
  });
  confirmReportJobBtn.addEventListener("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (jobToReportId) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          confirmReportJobBtn.textContent = "Reporting...";
          _context.p = 2;
          _context.n = 3;
          return _axios.default.patch("/api/v1/jobs/".concat(jobToReportId, "/report"));
        case 3:
          (0, _alerts.showAlert)("success", "Job reported. Thank you.");
          if (reportBtnToHide) reportBtnToHide.style.display = "none";
          closeReportModal();
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          (0, _alerts.showAlert)("error", "Error reporting job.");
        case 5:
          _context.p = 5;
          confirmReportJobBtn.textContent = "Report Job";
          return _context.f(5);
        case 6:
          return _context.a(2);
      }
    }, _callee, null, [[2, 4, 5, 6]]);
  })));
}
exports.loadJobData = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(id) {
    var detailsContainer, res, isSaved, userCv, isApplied, userRole, savedRes, savedJobs, meRes, appliedJobs, job, saveBtnText, saveBtnClass, applyHtml, isRestrictedUser, html, reportJobBtn, applyProfileCvBtn, applyUploadCvBtn, cvUpload, saveCvCheck, closeBtn, saveBtn, _t5, _t6, _t7;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          detailsContainer = document.querySelector(".details"); // Show loading state
          detailsContainer.innerHTML = '<div class="spinner">Loading...</div>';
          _context5.n = 1;
          return _axios.default.get("/api/v1/jobs/".concat(id));
        case 1:
          res = _context5.v;
          // Check if saved and get user info
          isSaved = false;
          userCv = null;
          isApplied = false;
          userRole = "candidate";
          _context5.p = 2;
          _context5.n = 3;
          return _axios.default.get("/api/v1/jobs/saved");
        case 3:
          savedRes = _context5.v;
          if (savedRes.data.status === "success") {
            savedJobs = savedRes.data.data.jobs;
            if (savedJobs && Array.isArray(savedJobs)) {
              isSaved = savedJobs.some(function (j) {
                return j._id === id;
              });
            }
          }

          // Try to get user info to check for CV
          _context5.p = 4;
          _context5.n = 5;
          return _axios.default.get("/api/v1/users/me");
        case 5:
          meRes = _context5.v;
          if (meRes.data.status === "success") {
            userCv = meRes.data.data.cv;
            userRole = meRes.data.data.role;
            appliedJobs = meRes.data.data.appliedJobs;
            if (appliedJobs && Array.isArray(appliedJobs)) {
              isApplied = appliedJobs.includes(id);
            }
          }
          _context5.n = 7;
          break;
        case 6:
          _context5.p = 6;
          _t5 = _context5.v;
        case 7:
          _context5.n = 9;
          break;
        case 8:
          _context5.p = 8;
          _t6 = _context5.v;
        case 9:
          if (res.data.status === "success") {
            job = res.data.data.job;
            saveBtnText = isSaved ? "Saved" : "Save Job";
            saveBtnClass = isSaved ? "btn--save btn--saved" : "btn--save";
            if (isApplied) {
              applyHtml = "<button class=\"btn--standard btn--apply\" disabled style=\"background-color: #1a73c2; cursor: default;\">Applied</button>";
            } else if (job.applicationLink) {
              applyHtml = "<a href=\"".concat(job.applicationLink, "\" class=\"btn--standard btn--apply\" target=\"_blank\">Apply Now</a>");
            } else {
              if (userCv) {
                applyHtml = "\n              <div class=\"apply-actions\">\n                  <button class=\"btn--standard btn--apply\" id=\"applyProfileCvBtn\">Apply with Profile CV</button>\n                  <button class=\"btn--text\" id=\"applyUploadCvBtn\" style=\"margin-top: 10px; display: block; font-size: 0.9em; background: none; border: none; color: var(--brand-primary); cursor: pointer; text-decoration: underline;\">Upload different CV</button>\n                  <input type=\"file\" id=\"cvUpload\" style=\"display: none;\" accept=\".pdf,.doc,.docx\" />\n              </div>\n            ";
              } else {
                applyHtml = "\n              <div class=\"apply-actions\">\n                  <button class=\"btn--standard btn--apply\" id=\"applyUploadCvBtn\">Apply Now</button>\n                  <input type=\"file\" id=\"cvUpload\" style=\"display: none;\" accept=\".pdf,.doc,.docx\" />\n                  <div class=\"save-cv-option\" style=\"margin-top: 10px;\">\n                      <input type=\"checkbox\" id=\"saveCvCheck\">\n                      <label for=\"saveCvCheck\" style=\"font-size: 1.2rem;\">Save CV to profile</label>\n                  </div>\n              </div>\n            ";
              }
            }
            isRestrictedUser = ["admin", "employer"].includes(userRole);
            html = "\n        <button class=\"btn-close btn-close-details\" id=\"closeDetailsBtn\">&times;</button>\n        <div class=\"job-details-content\">\n          <div class=\"job-header\">\n            <h2>".concat(job.title, "</h2>\n            <p class=\"company-name\">").concat(job.postedBy ? job.postedBy.name : "Company", "</p>\n            <div class=\"job-meta\">\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Location:</span>\n                 <span class=\"meta-value\">").concat(job.location.city, ", ").concat(job.location.postcode, "</span>\n               </div>\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Salary:</span>\n                 <span class=\"meta-value\">").concat(job.salaryRange ? (job.salaryRange.min === job.salaryRange.max ? "\xA3".concat(job.salaryRange.min.toLocaleString()) : "\xA3".concat(job.salaryRange.min.toLocaleString()).concat(job.salaryRange.max ? " - \xA3".concat(job.salaryRange.max.toLocaleString()) : "+")) + " per ".concat(job.salaryRange.period || "year") : "Negotiable", "</span>\n               </div>\n               <div class=\"meta-divider\"></div>\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Type:</span>\n                 <span class=\"meta-value\">").concat(job.jobType || "Full-time", "</span>\n               </div>\n               <div class=\"meta-item\">\n                 <span class=\"meta-label\">Remote:</span>\n                 <span class=\"meta-value\">").concat(job.location.remote ? job.location.remote.charAt(0).toUpperCase() + job.location.remote.slice(1) : "No", "</span>\n               </div>\n            </div>\n          </div>\n          \n          <div class=\"job-body\">\n            <h3>Description</h3>\n            <div class=\"job-description-content\">").concat(_marked.marked.parse(job.description), "</div>\n            \n            ").concat(job.requirements && job.requirements.length > 0 ? "<h3>Requirements</h3><div class=\"job-requirements-content\">".concat(_marked.marked.parse((job.requirements || "").toString().replace(/,/g, ", ")), "</div>") : "", "\n            \n            ").concat(job.visaTypes && job.visaTypes.length > 0 ? "<h3>Visa Types</h3>" : "", "\n            <div class=\"job-tags\">\n               ").concat(job.visaTypes ? job.visaTypes.map(function (type) {
              return "<span class=\"tag\">".concat(type, "</span>");
            }).join("") : "", "\n            </div>\n          </div>\n          \n          <div class=\"job-actions\">\n            ").concat(!isRestrictedUser ? applyHtml : "", "\n            ").concat(!isRestrictedUser ? "<button class=\"".concat(saveBtnClass, "\" id=\"saveJobBtn\" data-id=\"").concat(job._id, "\">").concat(saveBtnText, "</button>") : "", "\n            <button class=\"btn--text btn--report\" id=\"reportJobBtn\" data-id=\"").concat(job._id, "\" style=\"font-size: 1.2rem; color: #999; text-decoration: underline; margin-top: 1rem; background: none; border: none; cursor: pointer;\">Report Job</button>\n          </div>\n        </div>\n      ");
            detailsContainer.innerHTML = html;

            // Attach Report Listener
            reportJobBtn = document.getElementById("reportJobBtn");
            if (reportJobBtn) {
              reportJobBtn.addEventListener("click", function () {
                openReportModal(job._id, reportJobBtn);
              });
            }

            // Attach Apply Listeners
            applyProfileCvBtn = document.getElementById("applyProfileCvBtn");
            applyUploadCvBtn = document.getElementById("applyUploadCvBtn");
            cvUpload = document.getElementById("cvUpload");
            saveCvCheck = document.getElementById("saveCvCheck");
            if (applyProfileCvBtn) {
              applyProfileCvBtn.addEventListener("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
                var _t2;
                return _regenerator().w(function (_context2) {
                  while (1) switch (_context2.p = _context2.n) {
                    case 0:
                      _context2.p = 0;
                      applyProfileCvBtn.textContent = "Applying...";
                      applyProfileCvBtn.disabled = true;
                      _context2.n = 1;
                      return _axios.default.post("/api/v1/jobs/".concat(job._id, "/apply"), {
                        useProfileCv: "true"
                      });
                    case 1:
                      (0, _alerts.showAlert)("success", "Application sent successfully!");
                      applyProfileCvBtn.textContent = "Applied";
                      if (applyUploadCvBtn) applyUploadCvBtn.style.display = "none";
                      _context2.n = 3;
                      break;
                    case 2:
                      _context2.p = 2;
                      _t2 = _context2.v;
                      applyProfileCvBtn.disabled = false;
                      applyProfileCvBtn.textContent = "Apply with Profile CV";
                      (0, _alerts.showAlert)("error", _t2.response && _t2.response.data.message ? _t2.response.data.message : "Error applying");
                    case 3:
                      return _context2.a(2);
                  }
                }, _callee2, null, [[0, 2]]);
              })));
            }
            if (applyUploadCvBtn && cvUpload) {
              applyUploadCvBtn.addEventListener("click", function () {
                cvUpload.click();
              });
              cvUpload.addEventListener("change", /*#__PURE__*/function () {
                var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
                  var file, formData, _t3;
                  return _regenerator().w(function (_context3) {
                    while (1) switch (_context3.p = _context3.n) {
                      case 0:
                        file = e.target.files[0];
                        if (file) {
                          _context3.n = 1;
                          break;
                        }
                        return _context3.a(2);
                      case 1:
                        formData = new FormData();
                        formData.append("cv", file);
                        if (saveCvCheck && saveCvCheck.checked) {
                          formData.append("saveCvToProfile", "true");
                        }
                        _context3.p = 2;
                        applyUploadCvBtn.textContent = "Applying...";
                        applyUploadCvBtn.disabled = true;
                        _context3.n = 3;
                        return _axios.default.post("/api/v1/jobs/".concat(job._id, "/apply"), formData, {
                          headers: {
                            "Content-Type": "multipart/form-data"
                          }
                        });
                      case 3:
                        (0, _alerts.showAlert)("success", "Application sent successfully!");
                        applyUploadCvBtn.textContent = "Applied";
                        if (saveCvCheck) saveCvCheck.parentElement.style.display = "none";
                        _context3.n = 5;
                        break;
                      case 4:
                        _context3.p = 4;
                        _t3 = _context3.v;
                        applyUploadCvBtn.disabled = false;
                        applyUploadCvBtn.textContent = userCv ? "Upload different CV" : "Apply Now";
                        (0, _alerts.showAlert)("error", _t3.response && _t3.response.data.message ? _t3.response.data.message : "Error uploading CV");
                      case 5:
                        return _context3.a(2);
                    }
                  }, _callee3, null, [[2, 4]]);
                }));
                return function (_x2) {
                  return _ref4.apply(this, arguments);
                };
              }());
            }

            // Re-attach close listener
            closeBtn = document.getElementById("closeDetailsBtn");
            if (closeBtn) {
              closeBtn.addEventListener("click", function () {
                detailsContainer.classList.remove("details--open");
                document.body.classList.remove("no-scroll");
              });
            }

            // Attach Save Listener
            saveBtn = document.getElementById("saveJobBtn");
            if (saveBtn) {
              saveBtn.addEventListener("click", /*#__PURE__*/function () {
                var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
                  var jobId, wasSaved, _t4;
                  return _regenerator().w(function (_context4) {
                    while (1) switch (_context4.p = _context4.n) {
                      case 0:
                        e.preventDefault();
                        jobId = saveBtn.dataset.id;
                        wasSaved = saveBtn.classList.contains("btn--saved");
                        _context4.p = 1;
                        if (!wasSaved) {
                          _context4.n = 3;
                          break;
                        }
                        _context4.n = 2;
                        return _axios.default.delete("/api/v1/jobs/".concat(jobId, "/save"));
                      case 2:
                        saveBtn.textContent = "Save Job";
                        saveBtn.classList.remove("btn--saved");
                        (0, _alerts.showAlert)("success", "Job removed from saved list");
                        _context4.n = 5;
                        break;
                      case 3:
                        _context4.n = 4;
                        return _axios.default.post("/api/v1/jobs/".concat(jobId, "/save"));
                      case 4:
                        saveBtn.textContent = "Saved";
                        saveBtn.classList.add("btn--saved");
                        (0, _alerts.showAlert)("success", "Job saved successfully");
                      case 5:
                        _context4.n = 7;
                        break;
                      case 6:
                        _context4.p = 6;
                        _t4 = _context4.v;
                        (0, _alerts.showAlert)("error", "Please login to save jobs");
                      case 7:
                        return _context4.a(2);
                    }
                  }, _callee4, null, [[1, 6]]);
                }));
                return function (_x3) {
                  return _ref5.apply(this, arguments);
                };
              }());
            }
          }
          _context5.n = 11;
          break;
        case 10:
          _context5.p = 10;
          _t7 = _context5.v;
          (0, _alerts.showAlert)("error", "Error loading job details");
        case 11:
          return _context5.a(2);
      }
    }, _callee5, null, [[4, 6], [2, 8], [0, 10]]);
  }));
  return function (_x) {
    return _ref2.apply(this, arguments);
  };
}();
exports.initJobDetail = function () {
  var reportBtn = document.getElementById("reportJobBtn");
  if (reportBtn) {
    reportBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openReportModal(reportBtn.dataset.id, reportBtn);
    });
  }
};
exports.searchJobs = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(params) {
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.n) {
        case 0:
          _context6.n = 1;
          return fetchAndRenderJobs("/api/v1/jobs/search", params);
        case 1:
          return _context6.a(2);
      }
    }, _callee6);
  }));
  return function (_x4) {
    return _ref6.apply(this, arguments);
  };
}();
exports.searchSavedJobs = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(params) {
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return fetchAndRenderJobs("/api/v1/jobs/saved", params);
        case 1:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return function (_x5) {
    return _ref7.apply(this, arguments);
  };
}();
var fetchAndRenderJobs = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(url, params) {
    var res, jobs, noResultsMessage, statusHtml, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          if (resultsContainer) {
            _context8.n = 1;
            break;
          }
          return _context8.a(2);
        case 1:
          _context8.p = 1;
          _context8.n = 2;
          return _axios.default.get(url, {
            params: params
          });
        case 2:
          res = _context8.v;
          if (!(res.data.status === "success")) {
            _context8.n = 4;
            break;
          }
          jobs = res.data.data.jobs;
          resultsContainer.innerHTML = "";
          if (!(jobs.length === 0)) {
            _context8.n = 3;
            break;
          }
          noResultsMessage = url.includes("saved") ? "Saved jobs will show up here." : "No jobs found matching your criteria.";
          resultsContainer.innerHTML = "\n          <div class=\"no-results-container\">\n            <p class=\"no-results text-gradient\">".concat(noResultsMessage, "</p>\n          </div>\n        ");
          return _context8.a(2);
        case 3:
          jobs.forEach(function (job, index) {
            // Always show Featured tag if the job is featured
            var showFeaturedTag = job.featured;
            var html = "\n          <div class=\"job-card\" tabindex=\"0\" data-id=\"".concat(job._id, "\" data-index=\"").concat(index + 1, "\">\n            ").concat(showFeaturedTag ? '<p class="featured__label">Featured</p>' : "", "\n            <h3 class=\"job-card__title\">").concat(job.title, "</h3>\n            <p class=\"job-card__company\">").concat(job.postedBy ? job.postedBy.name : "Company", "</p>\n            <div class=\"job-card__location\">\n              <p>").concat(job.location.city, "</p>\n              <p>").concat(job.location.postcode, "</p>\n              <p>Remote: ").concat(job.location.remote ? job.location.remote.charAt(0).toUpperCase() + job.location.remote.slice(1) : "No", "</p>\n            </div>\n            <p class=\"job-card__description\">").concat(job.description, "</p>\n          </div>\n        ");
            resultsContainer.insertAdjacentHTML("beforeend", html);
          });
          statusHtml = "\n        <div class=\"results-status\" style=\"position: sticky; bottom: 0; background: var(--bg-body, #fff); padding: 10px; border-top: 1px solid #eee; font-size: 1.1rem; font-weight: 500; color: #555; z-index: 10;\">\n            ".concat(jobs.length, " results found\n        </div>\n      ");
          resultsContainer.insertAdjacentHTML("beforeend", statusHtml);
        case 4:
          _context8.n = 6;
          break;
        case 5:
          _context8.p = 5;
          _t8 = _context8.v;
          (0, _alerts.showAlert)("error", _t8);
        case 6:
          return _context8.a(2);
      }
    }, _callee8, null, [[1, 5]]);
  }));
  return function fetchAndRenderJobs(_x6, _x7) {
    return _ref8.apply(this, arguments);
  };
}();
},{"axios":"../../node_modules/axios/index.js","marked":"../../node_modules/marked/lib/marked.umd.js","./alerts":"alerts.js"}],"auth.js":[function(require,module,exports) {
"use strict";

var _axios = _interopRequireDefault(require("axios"));
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
exports.signupEmployer = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
    var res, form, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return (0, _axios.default)({
            method: "POST",
            url: "/api/v1/users/employersignup",
            data: data
          });
        case 1:
          res = _context.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Account created! Please check your email to verify.");
            form = document.querySelector(".form--signup-employer");
            if (form) {
              form.parentElement.innerHTML = '<div class="form__group" style="margin: 10rem 0; min-height: 40vh; display: flex; flex-direction: column; justify-content: center;"><h2 class="heading-secondary ma-bt-lg">Check your email!</h2><p class="text-center" style="font-size: 1.6rem;">We have sent a verification link to your email address. Please close this tab and check your email to activate your account.</p></div>';
            }
          }
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          (0, _alerts.showAlert)("error", _t.response.data.message);
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();
exports.logout = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  var res, _t2;
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.p = _context2.n) {
      case 0:
        _context2.p = 0;
        _context2.n = 1;
        return (0, _axios.default)({
          method: "GET",
          url: "/api/v1/users/logout"
        });
      case 1:
        res = _context2.v;
        if (res.data.status = "success") location.assign("/");
        _context2.n = 3;
        break;
      case 2:
        _context2.p = 2;
        _t2 = _context2.v;
        console.log(_t2.response);
        (0, _alerts.showAlert)("error", "Error logging out! Try again.");
      case 3:
        return _context2.a(2);
    }
  }, _callee2, null, [[0, 2]]);
}));
exports.login = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(email, password) {
    var res, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return (0, _axios.default)({
            method: "POST",
            url: "/api/v1/users/login",
            data: {
              email: email,
              password: password
            }
          });
        case 1:
          res = _context3.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Logged in successfully!");
            window.setTimeout(function () {
              location.assign("/");
            }, 1500);
          }
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          (0, _alerts.showAlert)("error", _t3.response.data.message);
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function (_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
}();
exports.signupCandidate = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(name, email, password, passwordConfirm) {
    var res, form, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return (0, _axios.default)({
            method: "POST",
            url: "/api/v1/users/signup",
            data: {
              name: name,
              email: email,
              password: password,
              passwordConfirm: passwordConfirm
            }
          });
        case 1:
          res = _context4.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Account created! Please check your email to verify.");
            form = document.querySelector(".form--signup");
            if (form) {
              form.parentElement.innerHTML = '<div class="form__group" style="margin: 10rem 0; min-height: 40vh; display: flex; flex-direction: column; justify-content: center;"><h2 class="heading-secondary ma-bt-lg">Check your email!</h2><p class="text-center" style="font-size: 1.6rem;">We have sent a verification link to your email address. Please close this tab and check your email to activate your account.</p></div>';
            }
          }
          _context4.n = 3;
          break;
        case 2:
          _context4.p = 2;
          _t4 = _context4.v;
          (0, _alerts.showAlert)("error", _t4.response.data.message);
        case 3:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 2]]);
  }));
  return function (_x4, _x5, _x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();
exports.updateSettings = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(data, type) {
    var url, res, typeCapitalized, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          url = type === "password" ? "/api/v1/users/updatePassword" : "/api/v1/users/updateMe";
          _context5.n = 1;
          return (0, _axios.default)({
            method: "PATCH",
            url: url,
            data: data
          });
        case 1:
          res = _context5.v;
          if (!(res.data.status === "success")) {
            _context5.n = 2;
            break;
          }
          typeCapitalized = type.charAt(0).toUpperCase() + type.slice(1);
          (0, _alerts.showAlert)("success", "".concat(typeCapitalized, " updated successfully!"));
          if (type === "password") {
            document.getElementById("password-current").value = "";
            document.getElementById("password").value = "";
            document.getElementById("password-confirm").value = "";
            document.querySelector(".btn--save-password").textContent = "Save password";
          }
          return _context5.a(2, res.data);
        case 2:
          _context5.n = 4;
          break;
        case 3:
          _context5.p = 3;
          _t5 = _context5.v;
          (0, _alerts.showAlert)("error", _t5.response.data.message);
        case 4:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 3]]);
  }));
  return function (_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();
exports.deleteCv = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
  var res, _t6;
  return _regenerator().w(function (_context6) {
    while (1) switch (_context6.p = _context6.n) {
      case 0:
        _context6.p = 0;
        _context6.n = 1;
        return (0, _axios.default)({
          method: "DELETE",
          url: "/api/v1/users/deleteCv"
        });
      case 1:
        res = _context6.v;
        if (!(res.data.status === "success")) {
          _context6.n = 2;
          break;
        }
        (0, _alerts.showAlert)("success", "CV deleted successfully!");
        return _context6.a(2, true);
      case 2:
        _context6.n = 4;
        break;
      case 3:
        _context6.p = 3;
        _t6 = _context6.v;
        (0, _alerts.showAlert)("error", _t6.response.data.message);
      case 4:
        return _context6.a(2);
    }
  }, _callee6, null, [[0, 3]]);
}));
exports.deleteAccount = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
  var res, _t7;
  return _regenerator().w(function (_context7) {
    while (1) switch (_context7.p = _context7.n) {
      case 0:
        _context7.p = 0;
        _context7.n = 1;
        return (0, _axios.default)({
          method: "DELETE",
          url: "/api/v1/users/deleteMe"
        });
      case 1:
        res = _context7.v;
        if (res.status === 204) {
          (0, _alerts.showAlert)("success", "Account deleted successfully! Redirecting...");
          window.setTimeout(function () {
            location.assign("/");
          }, 1500);
        }
        _context7.n = 3;
        break;
      case 2:
        _context7.p = 2;
        _t7 = _context7.v;
        (0, _alerts.showAlert)("error", "Error deleting account! Try again.");
      case 3:
        return _context7.a(2);
    }
  }, _callee7, null, [[0, 2]]);
}));
exports.forgotPassword = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(email) {
    var res, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return (0, _axios.default)({
            method: "POST",
            url: "/api/v1/users/forgotPassword",
            data: {
              email: email
            }
          });
        case 1:
          res = _context8.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Token sent to email!");
          }
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t8 = _context8.v;
          (0, _alerts.showAlert)("error", _t8.response.data.message);
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return function (_x0) {
    return _ref8.apply(this, arguments);
  };
}();
exports.resetPassword = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(token, password, passwordConfirm) {
    var res, _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          console.log("Sending reset password request...");
          _context9.n = 1;
          return (0, _axios.default)({
            method: "PATCH",
            url: "/api/v1/users/resetPassword/".concat(token),
            data: {
              password: password,
              passwordConfirm: passwordConfirm
            }
          });
        case 1:
          res = _context9.v;
          console.log("Reset password response:", res);
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Password reset successfully!");
            window.setTimeout(function () {
              location.assign("/");
            }, 1500);
          }
          _context9.n = 3;
          break;
        case 2:
          _context9.p = 2;
          _t9 = _context9.v;
          console.error("Reset password error:", _t9);
          (0, _alerts.showAlert)("error", _t9.response.data.message);
        case 3:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return function (_x1, _x10, _x11) {
    return _ref9.apply(this, arguments);
  };
}();
exports.claimAccount = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(token, password, passwordConfirm) {
    var res, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          _context0.p = 0;
          _context0.n = 1;
          return (0, _axios.default)({
            method: "PATCH",
            url: "/api/v1/users/claimAccount/".concat(token),
            data: {
              password: password,
              passwordConfirm: passwordConfirm
            }
          });
        case 1:
          res = _context0.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Account activated successfully!");
            window.setTimeout(function () {
              location.assign("/employer-dashboard");
            }, 1500);
          }
          _context0.n = 3;
          break;
        case 2:
          _context0.p = 2;
          _t0 = _context0.v;
          (0, _alerts.showAlert)("error", _t0.response.data.message);
        case 3:
          return _context0.a(2);
      }
    }, _callee0, null, [[0, 2]]);
  }));
  return function (_x12, _x13, _x14) {
    return _ref0.apply(this, arguments);
  };
}();
exports.resendVerification = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(email) {
    var res, btn, _t1;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          _context1.n = 1;
          return (0, _axios.default)({
            method: "POST",
            url: "/api/v1/users/resendVerification",
            data: {
              email: email
            }
          });
        case 1:
          res = _context1.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Verification email sent! Please check your inbox.");
            btn = document.getElementById("resendBtn");
            if (btn) {
              btn.textContent = "Email Sent!";
              btn.disabled = true;
            }
          }
          _context1.n = 3;
          break;
        case 2:
          _context1.p = 2;
          _t1 = _context1.v;
          (0, _alerts.showAlert)("error", _t1.response.data.message);
        case 3:
          return _context1.a(2);
      }
    }, _callee1, null, [[0, 2]]);
  }));
  return function (_x15) {
    return _ref1.apply(this, arguments);
  };
}();
},{"axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"dashboard.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateJob = exports.unfeatureJob = exports.initDashboard = exports.getJob = exports.deleteJob = exports.createJob = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var isEditing = false;
var currentJobId = null;
var createJob = exports.createJob = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data) {
    var res, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return (0, _axios.default)({
            method: "POST",
            url: "/api/v1/jobs",
            data: data
          });
        case 1:
          res = _context.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Job posted successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1500);
          }
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          (0, _alerts.showAlert)("error", _t.response.data.message);
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function createJob(_x) {
    return _ref.apply(this, arguments);
  };
}();
var updateJob = exports.updateJob = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(id, data) {
    var res, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return (0, _axios.default)({
            method: "PATCH",
            url: "/api/v1/jobs/".concat(id),
            data: data
          });
        case 1:
          res = _context2.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Job updated successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1500);
          }
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          (0, _alerts.showAlert)("error", _t2.response.data.message);
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function updateJob(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();
var deleteJob = exports.deleteJob = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(id) {
    var res, deleteBtns, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return (0, _axios.default)({
            method: "DELETE",
            url: "/api/v1/jobs/".concat(id)
          });
        case 1:
          res = _context3.v;
          if (res.status === 204) {
            (0, _alerts.showAlert)("success", "Job deleted successfully!");

            // Remove from DOM
            deleteBtns = document.querySelectorAll(".btn--delete[data-job-id=\"".concat(id, "\"]"));
            deleteBtns.forEach(function (btn) {
              var item = btn.closest(".job-item");
              if (item) {
                item.style.transition = "all 0.5s ease";
                item.style.opacity = "0";
                item.style.transform = "translateX(20px)";
                setTimeout(function () {
                  item.remove();
                  // Check if list is empty
                  var jobList = document.querySelector(".job-list");
                  if (jobList && jobList.children.length === 0) {
                    var noJobsMsg = document.createElement("p");
                    noJobsMsg.className = "no-jobs";
                    noJobsMsg.textContent = "You haven't posted any jobs yet.";
                    jobList.parentNode.replaceChild(noJobsMsg, jobList);
                  }
                }, 500);
              }
            });
          }
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          (0, _alerts.showAlert)("error", _t3.response.data.message);
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function deleteJob(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
var getJob = exports.getJob = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(id) {
    var res, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return (0, _axios.default)({
            method: "GET",
            url: "/api/v1/jobs/".concat(id)
          });
        case 1:
          res = _context4.v;
          if (!(res.data.status === "success")) {
            _context4.n = 2;
            break;
          }
          return _context4.a(2, res.data.data.job);
        case 2:
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t4 = _context4.v;
          (0, _alerts.showAlert)("error", "Error fetching job details");
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return function getJob(_x5) {
    return _ref4.apply(this, arguments);
  };
}();
var unfeatureJob = exports.unfeatureJob = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(id) {
    var res, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return (0, _axios.default)({
            method: "PATCH",
            url: "/api/v1/jobs/".concat(id, "/unfeature")
          });
        case 1:
          res = _context5.v;
          if (res.data.status === "success") {
            (0, _alerts.showAlert)("success", "Job updated successfully!");
            window.setTimeout(function () {
              location.reload();
            }, 1500);
          }
          _context5.n = 3;
          break;
        case 2:
          _context5.p = 2;
          _t5 = _context5.v;
          (0, _alerts.showAlert)("error", _t5.response.data.message);
        case 3:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return function unfeatureJob(_x6) {
    return _ref5.apply(this, arguments);
  };
}();
var initDashboard = exports.initDashboard = function initDashboard() {
  var postJobBtn = document.getElementById("postJobBtn");
  var postJobBtnEmpty = document.getElementById("postJobBtnEmpty");
  var postJobModal = document.getElementById("postJobModal");
  var closePostJobModal = document.getElementById("closePostJobModal");
  var postJobForm = document.querySelector(".form--post-job");
  var modalTitle = document.getElementById("modalTitle");
  var modalSubmitBtn = document.getElementById("modalSubmitBtn");
  var jobList = document.querySelector(".job-list");

  // Unfeature Job Modal Elements
  var unfeatureJobModal = document.getElementById("unfeatureJobModal");
  var closeUnfeatureJobModal = document.getElementById("closeUnfeatureJobModal");
  var cancelUnfeatureJobBtn = document.getElementById("cancelUnfeatureJobBtn");
  var confirmUnfeatureJobBtn = document.getElementById("confirmUnfeatureJobBtn");
  var jobToUnfeatureId = null;
  var openUnfeatureModal = function openUnfeatureModal(jobId) {
    jobToUnfeatureId = jobId;
    if (unfeatureJobModal) unfeatureJobModal.classList.remove("hidden");
  };
  var closeUnfeatureModal = function closeUnfeatureModal() {
    jobToUnfeatureId = null;
    if (unfeatureJobModal) unfeatureJobModal.classList.add("hidden");
  };
  if (unfeatureJobModal) {
    closeUnfeatureJobModal.addEventListener("click", closeUnfeatureModal);
    cancelUnfeatureJobBtn.addEventListener("click", closeUnfeatureModal);
    confirmUnfeatureJobBtn.addEventListener("click", function () {
      if (jobToUnfeatureId) {
        unfeatureJob(jobToUnfeatureId);
        closeUnfeatureModal();
      }
    });
    unfeatureJobModal.addEventListener("click", function (e) {
      if (e.target === unfeatureJobModal) {
        closeUnfeatureModal();
      }
    });
  }
  var openModal = function openModal() {
    postJobModal.classList.remove("hidden");
  };
  var closeModal = function closeModal() {
    postJobModal.classList.add("hidden");
    resetForm();
  };
  var resetForm = function resetForm() {
    postJobForm.reset();
    isEditing = false;
    currentJobId = null;
    if (modalTitle) modalTitle.textContent = "Post a New Job";
    if (modalSubmitBtn) modalSubmitBtn.textContent = "Post Job";

    // Reset checkboxes
    document.querySelectorAll('input[name="visaTypes"]').forEach(function (cb) {
      cb.checked = false;
    });
    if (document.getElementById("featured")) {
      document.getElementById("featured").checked = false;
    }
  };
  if (postJobModal) {
    if (postJobBtn) postJobBtn.addEventListener("click", function () {
      resetForm();
      openModal();
    });
    if (postJobBtnEmpty) postJobBtnEmpty.addEventListener("click", function () {
      resetForm();
      openModal();
    });
    closePostJobModal.addEventListener("click", closeModal);

    // Close on click outside
    postJobModal.addEventListener("click", function (e) {
      if (e.target === postJobModal) {
        closeModal();
      }
    });
  }

  // Event Delegation for Edit and Delete Buttons
  if (jobList) {
    jobList.addEventListener("click", /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(e) {
        var editBtn, deleteBtn, repostBtn, jobId, _jobId, job, visaTypes, _jobId2;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              editBtn = e.target.closest(".btn--edit");
              deleteBtn = e.target.closest(".btn--delete");
              repostBtn = e.target.closest(".btn--repost");
              if (repostBtn) {
                jobId = repostBtn.dataset.jobId;
                openUnfeatureModal(jobId);
              }
              if (!editBtn) {
                _context6.n = 2;
                break;
              }
              _jobId = editBtn.dataset.jobId;
              _context6.n = 1;
              return getJob(_jobId);
            case 1:
              job = _context6.v;
              if (job) {
                isEditing = true;
                currentJobId = _jobId;

                // Populate form
                document.getElementById("title").value = job.title;
                document.getElementById("description").value = job.description;
                document.getElementById("city").value = job.location.city;
                document.getElementById("postcode").value = job.location.postcode;
                document.getElementById("remote").value = job.location.remote;
                document.getElementById("jobType").value = job.jobType;
                document.getElementById("salaryMin").value = job.salaryRange.min;
                document.getElementById("salaryMax").value = job.salaryRange.max || "";
                document.getElementById("salaryPeriod").value = job.salaryRange.period;
                document.getElementById("experienceLevel").value = job.experienceLevel;
                document.getElementById("applicationUrl").value = job.applicationUrl || "";
                if (document.getElementById("featured")) {
                  document.getElementById("featured").checked = job.featured || false;
                }

                // Checkboxes
                visaTypes = job.visaTypes || [];
                document.querySelectorAll('input[name="visaTypes"]').forEach(function (cb) {
                  cb.checked = visaTypes.includes(cb.value);
                });
                if (modalTitle) modalTitle.textContent = "Edit Job";
                if (modalSubmitBtn) modalSubmitBtn.textContent = "Update Job";
                openModal();
              }
            case 2:
              if (deleteBtn) {
                _jobId2 = deleteBtn.dataset.jobId;
                if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
                  deleteJob(_jobId2);
                }
              }
            case 3:
              return _context6.a(2);
          }
        }, _callee6);
      }));
      return function (_x7) {
        return _ref6.apply(this, arguments);
      };
    }());
  }
  if (postJobForm) {
    postJobForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Gather form data
      var title = document.getElementById("title").value;
      var description = document.getElementById("description").value;
      var city = document.getElementById("city").value;
      var postcode = document.getElementById("postcode").value;
      var remote = document.getElementById("remote").value;
      var jobType = document.getElementById("jobType").value;
      var salaryMin = document.getElementById("salaryMin").value;
      var salaryMax = document.getElementById("salaryMax").value;
      var salaryPeriod = document.getElementById("salaryPeriod").value;
      var experienceLevel = document.getElementById("experienceLevel").value;
      var applicationUrl = document.getElementById("applicationUrl").value;
      var featured = document.getElementById("featured") ? document.getElementById("featured").checked : false;

      // Get checked visa types
      var visaTypes = [];
      document.querySelectorAll('input[name="visaTypes"]:checked').forEach(function (checkbox) {
        visaTypes.push(checkbox.value);
      });
      if (visaTypes.length === 0) {
        (0, _alerts.showAlert)("error", "Please select at least one visa sponsorship type.");
        return;
      }
      var data = {
        title: title,
        description: description,
        location: {
          city: city,
          postcode: postcode,
          remote: remote
        },
        jobType: jobType,
        salaryRange: {
          min: salaryMin,
          max: salaryMax || undefined,
          period: salaryPeriod
        },
        experienceLevel: experienceLevel,
        visaTypes: visaTypes,
        applicationUrl: applicationUrl,
        featured: featured
      };
      if (isEditing && currentJobId) {
        updateJob(currentJobId, data);
      } else {
        createJob(data);
      }
    });
  }
};
},{"axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"admin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initAdmin = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var initAdmin = exports.initAdmin = function initAdmin() {
  var dashboardContainer = document.querySelector(".dashboard-container");
  if (!dashboardContainer) return;

  // Only run if we are on the admin dashboard (check for specific element)
  var adminHeader = document.querySelector(".dashboard-header h2");
  if (!adminHeader || !adminHeader.textContent.includes("Admin Dashboard")) return;

  // --- TABS LOGIC ---
  var tabsContainer = document.querySelector(".dashboard-tabs");
  var tabs = document.querySelectorAll(".tab-btn");
  var tabContents = document.querySelectorAll(".tab-content");
  if (tabsContainer) {
    tabsContainer.addEventListener("click", function (e) {
      var clicked = e.target.closest(".tab-btn");
      if (!clicked) return;

      // Remove active class from all tabs and contents
      tabs.forEach(function (t) {
        return t.classList.remove("tab-btn--active");
      });
      tabContents.forEach(function (c) {
        return c.classList.remove("tab-content--active");
      });

      // Activate clicked tab and content
      clicked.classList.add("tab-btn--active");
      document.querySelector(".tab-content[id=\"".concat(clicked.dataset.tab, "\"]")).classList.add("tab-content--active");
    });
  }

  // --- MODAL LOGIC ---
  var modalOverlay = document.getElementById("confirmModal");
  var confirmBtn = document.getElementById("confirmBtn");
  var cancelBtn = document.getElementById("cancelBtn");
  var closeModalBtn = document.querySelector(".btn-close-modal");
  var confirmTitle = document.getElementById("confirmTitle");
  var confirmMessage = document.getElementById("confirmMessage");
  var currentAction = null;
  var currentId = null;
  var openModal = function openModal(title, message, action, id) {
    confirmTitle.textContent = title;
    confirmMessage.textContent = message;
    currentAction = action;
    currentId = id;
    modalOverlay.classList.remove("hidden");
  };
  var closeModal = function closeModal() {
    modalOverlay.classList.add("hidden");
    currentAction = null;
    currentId = null;
  };
  if (modalOverlay) {
    closeModalBtn.addEventListener("click", closeModal);
    cancelBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", function (e) {
      if (e.target === modalOverlay) closeModal();
    });
    confirmBtn.addEventListener("click", /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var originalText, selector, relatedButtons, _err$response, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            if (!(!currentAction || !currentId)) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            originalText = confirmBtn.textContent;
            confirmBtn.textContent = "Processing...";
            _context.p = 2;
            if (!(currentAction === "approveEmployer")) {
              _context.n = 4;
              break;
            }
            _context.n = 3;
            return _axios.default.post("/api/v1/admin/".concat(currentId, "/employer-verification"));
          case 3:
            (0, _alerts.showAlert)("success", "Employer approved successfully!");
            _context.n = 14;
            break;
          case 4:
            if (!(currentAction === "rejectEmployer")) {
              _context.n = 6;
              break;
            }
            _context.n = 5;
            return _axios.default.delete("/api/v1/admin/".concat(currentId, "/employer-verification"));
          case 5:
            (0, _alerts.showAlert)("success", "Employer rejected successfully!");
            _context.n = 14;
            break;
          case 6:
            if (!(currentAction === "deleteJob")) {
              _context.n = 8;
              break;
            }
            _context.n = 7;
            return _axios.default.delete("/api/v1/admin/jobs/".concat(currentId));
          case 7:
            (0, _alerts.showAlert)("success", "Job deleted successfully!");
            _context.n = 14;
            break;
          case 8:
            if (!(currentAction === "dismissReport")) {
              _context.n = 10;
              break;
            }
            _context.n = 9;
            return _axios.default.patch("/api/v1/admin/jobs/".concat(currentId, "/dismiss"));
          case 9:
            (0, _alerts.showAlert)("success", "Report dismissed successfully!");
            _context.n = 14;
            break;
          case 10:
            if (!(currentAction === "deleteBug")) {
              _context.n = 12;
              break;
            }
            _context.n = 11;
            return _axios.default.delete("/api/v1/bug-reports/".concat(currentId));
          case 11:
            (0, _alerts.showAlert)("success", "Bug report deleted successfully!");
            _context.n = 14;
            break;
          case 12:
            if (!(currentAction === "deleteDiscount")) {
              _context.n = 14;
              break;
            }
            _context.n = 13;
            return _axios.default.delete("/api/v1/admin/discounts/".concat(currentId));
          case 13:
            (0, _alerts.showAlert)("success", "Discount deleted successfully!");
            setTimeout(function () {
              return location.reload();
            }, 1000);
            return _context.a(2);
          case 14:
            if (currentAction === "approveEmployer" || currentAction === "rejectEmployer") {
              selector = "[data-user-id=\"".concat(currentId, "\"]");
            } else if (currentAction === "deleteBug") {
              selector = "[data-bug-id=\"".concat(currentId, "\"]");
            } else {
              selector = "[data-job-id=\"".concat(currentId, "\"]");
            }
            relatedButtons = document.querySelectorAll(".job-item ".concat(selector));
            relatedButtons.forEach(function (btn) {
              var item = btn.closest(".job-item");
              if (item) {
                // Add a fade out effect
                item.style.transition = "all 0.5s ease";
                item.style.opacity = "0";
                item.style.transform = "translateX(20px)";
                setTimeout(function () {
                  return item.remove();
                }, 500);
              }
            });
            closeModal();
            _context.n = 16;
            break;
          case 15:
            _context.p = 15;
            _t = _context.v;
            console.error(_t);
            (0, _alerts.showAlert)("error", ((_err$response = _t.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.message) || "Something went wrong!");
          case 16:
            _context.p = 16;
            confirmBtn.textContent = originalText;
            return _context.f(16);
          case 17:
            return _context.a(2);
        }
      }, _callee, null, [[2, 15, 16, 17]]);
    })));
  }

  // --- VIEW JOB MODAL LOGIC ---
  var viewJobModal = document.getElementById("viewJobModal");
  var closeViewModalBtns = document.querySelectorAll(".close-view-modal");
  var openViewJobModal = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(jobId) {
      var res, job, dismissBtn, deleteBtn, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.p = _context2.n) {
          case 0:
            _context2.p = 0;
            _context2.n = 1;
            return _axios.default.get("/api/v1/jobs/".concat(jobId));
          case 1:
            res = _context2.v;
            job = res.data.data.job;
            document.getElementById("viewJobTitle").textContent = job.title;
            document.getElementById("viewJobCompany").textContent = job.companyName || "N/A";
            document.getElementById("viewJobLocation").textContent = "".concat(job.location.city, ", ").concat(job.location.postcode);
            document.getElementById("viewJobSalary").textContent = "\xA3".concat(job.salaryRange.min, " - \xA3").concat(job.salaryRange.max || "N/A");
            document.getElementById("viewJobDescription").innerHTML = job.description;

            // Set IDs for action buttons in modal
            dismissBtn = document.getElementById("modalDismissBtn");
            deleteBtn = document.getElementById("modalDeleteBtn");
            if (dismissBtn) dismissBtn.dataset.jobId = job._id;
            if (deleteBtn) deleteBtn.dataset.jobId = job._id;
            viewJobModal.classList.remove("hidden");
            _context2.n = 3;
            break;
          case 2:
            _context2.p = 2;
            _t2 = _context2.v;
            console.error(_t2);
            (0, _alerts.showAlert)("error", "Could not fetch job details");
          case 3:
            return _context2.a(2);
        }
      }, _callee2, null, [[0, 2]]);
    }));
    return function openViewJobModal(_x) {
      return _ref2.apply(this, arguments);
    };
  }();
  var closeViewJobModal = function closeViewJobModal() {
    viewJobModal.classList.add("hidden");
  };
  if (viewJobModal) {
    closeViewModalBtns.forEach(function (btn) {
      return btn.addEventListener("click", closeViewJobModal);
    });
    viewJobModal.addEventListener("click", function (e) {
      if (e.target === viewJobModal) closeViewJobModal();
    });
  }

  // --- EVENT DELEGATION FOR ACTIONS ---
  // Use document body to catch events from modals as well
  document.body.addEventListener("click", function (e) {
    var btnApprove = e.target.closest(".btn--approve-employer");
    var btnReject = e.target.closest(".btn--reject-employer");
    var btnDeleteJob = e.target.closest(".btn--delete-job");
    var btnDismissReport = e.target.closest(".btn--dismiss-report");
    var btnViewJob = e.target.closest(".btn--view-job");
    var btnFixBug = e.target.closest(".btn--fix-bug");
    if (btnViewJob) {
      openViewJobModal(btnViewJob.dataset.jobId);
    }
    if (btnFixBug) {
      var bugId = btnFixBug.dataset.bugId;
      openModal("Delete Bug Report", "Are you sure you want to mark this bug as fixed and delete it?", "deleteBug", bugId);
    }
    if (btnApprove) {
      var _btnApprove$dataset = btnApprove.dataset,
        userId = _btnApprove$dataset.userId,
        companyName = _btnApprove$dataset.companyName;
      openModal("Approve Employer", "Are you sure you want to approve ".concat(companyName, "? They will be able to post jobs immediately."), "approveEmployer", userId);
    }
    if (btnReject) {
      var _btnReject$dataset = btnReject.dataset,
        _userId = _btnReject$dataset.userId,
        _companyName = _btnReject$dataset.companyName;
      openModal("Reject Employer", "Are you sure you want to reject ".concat(_companyName, "? This cannot be undone easily."), "rejectEmployer", _userId);
    }
    if (btnDeleteJob) {
      var jobId = btnDeleteJob.dataset.jobId;

      // Close view job modal if open
      if (viewJobModal && !viewJobModal.classList.contains("hidden")) {
        closeViewJobModal();
      }
      openModal("Delete Job", "Are you sure you want to delete this job? This action cannot be undone.", "deleteJob", jobId);
    }
    if (btnDismissReport) {
      var _jobId = btnDismissReport.dataset.jobId;

      // Close view job modal if open
      if (viewJobModal && !viewJobModal.classList.contains("hidden")) {
        closeViewJobModal();
      }
      openModal("Dismiss Report", "Are you sure you want to dismiss the reports on this job? It will be set to active again.", "dismissReport", _jobId);
    }
  });

  // --- EXPORT DATA LOGIC ---
  var exportForm = document.querySelector(".form--export-data");
  var exportOutput = document.getElementById("exportOutput");
  var exportResult = document.querySelector(".export-result");
  var btnDownloadJson = document.getElementById("btnDownloadJson");
  var currentExportData = null;
  if (exportForm) {
    exportForm.addEventListener("submit", /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
        var email, btn, res, _err$response2, _t3;
        return _regenerator().w(function (_context3) {
          while (1) switch (_context3.p = _context3.n) {
            case 0:
              e.preventDefault();
              email = document.getElementById("exportEmail").value;
              btn = document.getElementById("btnExportData");
              btn.textContent = "Exporting...";
              _context3.p = 1;
              _context3.n = 2;
              return _axios.default.post("/api/v1/admin/export-user-data", {
                email: email
              });
            case 2:
              res = _context3.v;
              currentExportData = res.data.data;
              exportOutput.textContent = JSON.stringify(currentExportData, null, 2);
              exportResult.classList.remove("hidden");
              (0, _alerts.showAlert)("success", "Data retrieved successfully");
              _context3.n = 4;
              break;
            case 3:
              _context3.p = 3;
              _t3 = _context3.v;
              console.error(_t3);
              (0, _alerts.showAlert)("error", ((_err$response2 = _t3.response) === null || _err$response2 === void 0 || (_err$response2 = _err$response2.data) === null || _err$response2 === void 0 ? void 0 : _err$response2.message) || "Error retrieving data");
              exportResult.classList.add("hidden");
            case 4:
              _context3.p = 4;
              btn.textContent = "Export Data";
              return _context3.f(4);
            case 5:
              return _context3.a(2);
          }
        }, _callee3, null, [[1, 3, 4, 5]]);
      }));
      return function (_x2) {
        return _ref3.apply(this, arguments);
      };
    }());
    if (btnDownloadJson) {
      btnDownloadJson.addEventListener("click", function () {
        if (!currentExportData) return;
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentExportData, null, 2));
        var downloadAnchorNode = document.createElement("a");
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "user_data_".concat(currentExportData.profile.email, ".json"));
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      });
    }
  }

  // --- SHADOW ACCOUNT LOGIC ---
  var createShadowBtn = document.getElementById("createShadowBtn");
  var shadowJobSection = document.getElementById("shadowJobSection");
  var shadowCompanyNameDisplay = document.getElementById("shadowCompanyNameDisplay");
  var shadowUserIdInput = document.getElementById("shadowUserId");
  var postShadowJobBtn = document.getElementById("postShadowJobBtn");
  var sendClaimEmailBtn = document.getElementById("sendClaimEmailBtn");
  var shadowJobsListUl = document.getElementById("shadowJobsListUl");
  if (createShadowBtn) {
    createShadowBtn.addEventListener("click", /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
        var companyName, email, industry, res, user, _err$response3, _t4;
        return _regenerator().w(function (_context4) {
          while (1) switch (_context4.p = _context4.n) {
            case 0:
              e.preventDefault(); // Prevent form submission
              companyName = document.getElementById("shadowCompanyName").value;
              email = document.getElementById("shadowEmail").value;
              industry = document.getElementById("shadowIndustry").value;
              if (!(!companyName || !email)) {
                _context4.n = 1;
                break;
              }
              return _context4.a(2, (0, _alerts.showAlert)("error", "Please provide company name and email"));
            case 1:
              createShadowBtn.textContent = "Creating...";
              _context4.p = 2;
              _context4.n = 3;
              return _axios.default.post("/api/v1/admin/shadow-employer", {
                companyName: companyName,
                email: email,
                industry: industry
              });
            case 3:
              res = _context4.v;
              if (res.data.status === "success") {
                (0, _alerts.showAlert)("success", "Shadow account created!");
                user = res.data.data.user; // Show job form
                shadowJobSection.classList.remove("hidden");
                shadowCompanyNameDisplay.textContent = user.companyProfile.companyName;
                shadowUserIdInput.value = user._id;

                // Disable create form to prevent confusion
                document.getElementById("shadowCompanyName").disabled = true;
                document.getElementById("shadowEmail").disabled = true;
                document.getElementById("shadowIndustry").disabled = true;
                createShadowBtn.disabled = true;
                createShadowBtn.textContent = "Created";
              }
              _context4.n = 5;
              break;
            case 4:
              _context4.p = 4;
              _t4 = _context4.v;
              (0, _alerts.showAlert)("error", ((_err$response3 = _t4.response) === null || _err$response3 === void 0 || (_err$response3 = _err$response3.data) === null || _err$response3 === void 0 ? void 0 : _err$response3.message) || "Error creating account");
              createShadowBtn.textContent = "Create Account";
            case 5:
              return _context4.a(2);
          }
        }, _callee4, null, [[2, 4]]);
      }));
      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());
  }
  if (postShadowJobBtn) {
    postShadowJobBtn.addEventListener("click", /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(e) {
        var userId, title, description, city, postcode, minSalary, maxSalary, jobType, experienceLevel, applicationUrl, visaSelect, visaTypes, res, li, _t5;
        return _regenerator().w(function (_context5) {
          while (1) switch (_context5.p = _context5.n) {
            case 0:
              e.preventDefault();
              userId = shadowUserIdInput.value;
              if (userId) {
                _context5.n = 1;
                break;
              }
              return _context5.a(2, (0, _alerts.showAlert)("error", "No user selected"));
            case 1:
              title = document.getElementById("shadowJobTitle").value;
              description = document.getElementById("shadowJobDescription").value;
              city = document.getElementById("shadowJobLocation").value;
              postcode = document.getElementById("shadowJobPostcode").value;
              minSalary = document.getElementById("shadowJobSalaryMin").value;
              maxSalary = document.getElementById("shadowJobSalaryMax").value;
              jobType = document.getElementById("shadowJobType").value;
              experienceLevel = document.getElementById("shadowJobExperience").value;
              applicationUrl = document.getElementById("shadowJobLink").value;
              visaSelect = document.getElementById("shadowJobVisa");
              visaTypes = Array.from(visaSelect.selectedOptions).map(function (option) {
                return option.value;
              });
              if (!(!title || !description || !city || !postcode || !minSalary || visaTypes.length === 0)) {
                _context5.n = 2;
                break;
              }
              return _context5.a(2, (0, _alerts.showAlert)("error", "Please fill in all required fields"));
            case 2:
              postShadowJobBtn.textContent = "Posting...";
              _context5.p = 3;
              _context5.n = 4;
              return _axios.default.post("/api/v1/jobs", {
                title: title,
                description: description,
                location: {
                  city: city,
                  postcode: postcode
                },
                salaryRange: {
                  min: minSalary,
                  max: maxSalary || minSalary
                },
                jobType: jobType,
                experienceLevel: experienceLevel,
                visaTypes: visaTypes,
                applicationUrl: applicationUrl,
                postedBy: userId // Admin override
              });
            case 4:
              res = _context5.v;
              if (res.data.status === "success") {
                (0, _alerts.showAlert)("success", "Job posted successfully!");
                postShadowJobBtn.textContent = "Post Job";

                // Add to list
                li = document.createElement("li");
                li.textContent = "".concat(title, " - ").concat(city, " (\xA3").concat(minSalary, ")");
                li.style.marginBottom = "5px";
                shadowJobsListUl.appendChild(li);

                // Clear form for next job
                document.querySelector(".form--shadow-job").reset();
                // Restore hidden ID
                shadowUserIdInput.value = userId;
              }
              _context5.n = 6;
              break;
            case 5:
              _context5.p = 5;
              _t5 = _context5.v;
              (0, _alerts.showAlert)("error", _t5.response.data.message);
              postShadowJobBtn.textContent = "Post Job";
            case 6:
              return _context5.a(2);
          }
        }, _callee5, null, [[3, 5]]);
      }));
      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());
  }

  // --- SHADOW QUEUE LOGIC ---
  var loadShadowQueue = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var list, res, queue, _t6;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.p = _context6.n) {
          case 0:
            list = document.getElementById("shadowQueueList");
            if (list) {
              _context6.n = 1;
              break;
            }
            return _context6.a(2);
          case 1:
            _context6.p = 1;
            _context6.n = 2;
            return _axios.default.get("/api/v1/admin/shadow-email-queue");
          case 2:
            res = _context6.v;
            queue = res.data.data.queue;
            if (!(queue.length === 0)) {
              _context6.n = 3;
              break;
            }
            list.innerHTML = "<p>No emails in queue.</p>";
            return _context6.a(2);
          case 3:
            list.innerHTML = queue.map(function (item) {
              return "\n        <div class=\"shadow-queue-item\">\n          <div class=\"shadow-queue-info\">\n            <h4>".concat(item.user.companyName, "</h4>\n            <p>").concat(item.user.email, "</p>\n            <p>Jobs: ").concat(item.user.jobCount, "</p>\n          </div>\n          <div class=\"shadow-queue-date\">\n            <p>Queued: ").concat(new Date(item.createdAt).toLocaleDateString(), "</p>\n          </div>\n        </div>\n      ");
            }).join("");
            _context6.n = 5;
            break;
          case 4:
            _context6.p = 4;
            _t6 = _context6.v;
            console.error(_t6);
            list.innerHTML = "<p>Error loading queue.</p>";
          case 5:
            return _context6.a(2);
        }
      }, _callee6, null, [[1, 4]]);
    }));
    return function loadShadowQueue() {
      return _ref6.apply(this, arguments);
    };
  }();
  if (document.getElementById("shadowQueueList")) {
    loadShadowQueue();
  }
  if (sendClaimEmailBtn) {
    sendClaimEmailBtn.addEventListener("click", /*#__PURE__*/function () {
      var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(e) {
        var userId, res, _t7;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              e.preventDefault();
              userId = shadowUserIdInput.value;
              if (userId) {
                _context7.n = 1;
                break;
              }
              return _context7.a(2, (0, _alerts.showAlert)("error", "No user selected"));
            case 1:
              if (confirm("Are you sure you want to queue the claim email? Make sure you have added all jobs first.")) {
                _context7.n = 2;
                break;
              }
              return _context7.a(2);
            case 2:
              sendClaimEmailBtn.textContent = "Queuing...";
              _context7.p = 3;
              _context7.n = 4;
              return _axios.default.post("/api/v1/admin/users/".concat(userId, "/send-claim-email"));
            case 4:
              res = _context7.v;
              if (!(res.data.status === "success")) {
                _context7.n = 6;
                break;
              }
              (0, _alerts.showAlert)("success", "Claim email queued!");
              sendClaimEmailBtn.textContent = "Email Queued";
              sendClaimEmailBtn.disabled = true;

              // Refresh queue list
              _context7.n = 5;
              return loadShadowQueue();
            case 5:
              // Reset form for next user after delay
              setTimeout(function () {
                // Reset UI for next entry
                document.querySelector(".form--shadow-employer").reset();
                document.querySelector(".form--shadow-job").reset();
                document.getElementById("shadowJobSection").classList.add("hidden");
                document.getElementById("shadowJobsListUl").innerHTML = "";
                sendClaimEmailBtn.textContent = "Queue Claim Email";
                sendClaimEmailBtn.disabled = false;

                // Clear hidden user ID
                shadowUserIdInput.value = "";
              }, 2000);
            case 6:
              _context7.n = 8;
              break;
            case 7:
              _context7.p = 7;
              _t7 = _context7.v;
              (0, _alerts.showAlert)("error", _t7.response.data.message);
              sendClaimEmailBtn.textContent = "Queue Claim Email";
            case 8:
              return _context7.a(2);
          }
        }, _callee7, null, [[3, 7]]);
      }));
      return function (_x5) {
        return _ref7.apply(this, arguments);
      };
    }());
  }

  // --- BLOG POST LOGIC ---
  var blogForm = document.querySelector(".form--create-blog");
  if (blogForm) {
    blogForm.addEventListener("submit", /*#__PURE__*/function () {
      var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(e) {
        var btn, title, summary, content, res, _err$response4, _t8;
        return _regenerator().w(function (_context8) {
          while (1) switch (_context8.p = _context8.n) {
            case 0:
              e.preventDefault();
              btn = document.getElementById("createBlogBtn");
              btn.textContent = "Publishing...";
              title = document.getElementById("blogTitle").value;
              summary = document.getElementById("blogSummary").value;
              content = document.getElementById("blogContent").value;
              _context8.p = 1;
              _context8.n = 2;
              return _axios.default.post("/api/v1/articles", {
                title: title,
                summary: summary,
                content: content
              });
            case 2:
              res = _context8.v;
              if (res.data.status === "success") {
                (0, _alerts.showAlert)("success", "Article published successfully!");
                btn.textContent = "Publish Article";
                blogForm.reset();
              }
              _context8.n = 4;
              break;
            case 3:
              _context8.p = 3;
              _t8 = _context8.v;
              (0, _alerts.showAlert)("error", ((_err$response4 = _t8.response) === null || _err$response4 === void 0 || (_err$response4 = _err$response4.data) === null || _err$response4 === void 0 ? void 0 : _err$response4.message) || "Error publishing article");
              btn.textContent = "Publish Article";
            case 4:
              return _context8.a(2);
          }
        }, _callee8, null, [[1, 3]]);
      }));
      return function (_x6) {
        return _ref8.apply(this, arguments);
      };
    }());
  }

  // --- DISCOUNT LOGIC ---
  var createDiscountForm = document.querySelector(".form--create-discount");
  if (createDiscountForm) {
    createDiscountForm.addEventListener("submit", /*#__PURE__*/function () {
      var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(e) {
        var code, percentage, expiresAt, btn, res, _t9;
        return _regenerator().w(function (_context9) {
          while (1) switch (_context9.p = _context9.n) {
            case 0:
              e.preventDefault();
              code = document.getElementById("discountCode").value;
              percentage = document.getElementById("discountPercentage").value;
              expiresAt = document.getElementById("discountExpires").value;
              btn = document.getElementById("createDiscountBtn");
              btn.textContent = "Creating...";
              _context9.p = 1;
              _context9.n = 2;
              return (0, _axios.default)({
                method: "POST",
                url: "/api/v1/admin/discounts",
                data: {
                  code: code,
                  percentage: percentage,
                  expiresAt: expiresAt
                }
              });
            case 2:
              res = _context9.v;
              if (res.data.status === "success") {
                (0, _alerts.showAlert)("success", "Discount created successfully!");
                setTimeout(function () {
                  return location.reload();
                }, 1500);
              }
              _context9.n = 4;
              break;
            case 3:
              _context9.p = 3;
              _t9 = _context9.v;
              (0, _alerts.showAlert)("error", _t9.response.data.message);
              btn.textContent = "Create Discount";
            case 4:
              return _context9.a(2);
          }
        }, _callee9, null, [[1, 3]]);
      }));
      return function (_x7) {
        return _ref9.apply(this, arguments);
      };
    }());
  }
  var deleteDiscountBtns = document.querySelectorAll(".btn--delete-discount");
  deleteDiscountBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var id = e.target.dataset.id;
      openModal("Delete Discount", "Are you sure you want to delete this discount?", "deleteDiscount", id);
    });
  });
  var toggleDiscountBtns = document.querySelectorAll(".btn--toggle-discount");
  toggleDiscountBtns.forEach(function (btn) {
    btn.addEventListener("click", /*#__PURE__*/function () {
      var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(e) {
        var id, action, res, _t0;
        return _regenerator().w(function (_context0) {
          while (1) switch (_context0.p = _context0.n) {
            case 0:
              id = e.target.dataset.id;
              action = e.target.dataset.action;
              _context0.p = 1;
              _context0.n = 2;
              return (0, _axios.default)({
                method: "PATCH",
                url: "/api/v1/admin/discounts/".concat(id),
                data: {
                  action: action
                }
              });
            case 2:
              res = _context0.v;
              if (res.data.status === "success") {
                (0, _alerts.showAlert)("success", "Discount status updated!");
                setTimeout(function () {
                  return location.reload();
                }, 1000);
              }
              _context0.n = 4;
              break;
            case 3:
              _context0.p = 3;
              _t0 = _context0.v;
              (0, _alerts.showAlert)("error", _t0.response.data.message);
            case 4:
              return _context0.a(2);
          }
        }, _callee0, null, [[1, 3]]);
      }));
      return function (_x8) {
        return _ref0.apply(this, arguments);
      };
    }());
  });
};
},{"axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"bugReport.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBugReport = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var initBugReport = exports.initBugReport = function initBugReport() {
  var reportBugBtn = document.getElementById("reportBugBtn");
  var bugReportModal = document.getElementById("bugReportModal");
  var closeBugReportModal = document.getElementById("closeBugReportModal");
  var bugReportForm = document.querySelector(".form--bug-report");
  var submitBtn = document.getElementById("submitBugReportBtn");
  var openModal = function openModal(e) {
    e.preventDefault();
    bugReportModal.classList.remove("hidden");
  };
  var closeModal = function closeModal() {
    bugReportModal.classList.add("hidden");
    bugReportForm.reset();
  };
  if (reportBugBtn && bugReportModal) {
    reportBugBtn.addEventListener("click", openModal);
    closeBugReportModal.addEventListener("click", closeModal);
    bugReportModal.addEventListener("click", function (e) {
      if (e.target === bugReportModal) closeModal();
    });
    bugReportForm.addEventListener("submit", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
        var title, description, res, _err$response, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              e.preventDefault();
              submitBtn.textContent = "Submitting...";
              title = document.getElementById("bugTitle").value;
              description = document.getElementById("bugDescription").value;
              _context.p = 1;
              _context.n = 2;
              return (0, _axios.default)({
                method: "POST",
                url: "/api/v1/bug-reports",
                data: {
                  title: title,
                  description: description
                }
              });
            case 2:
              res = _context.v;
              if (res.data.status === "success") {
                (0, _alerts.showAlert)("success", "Bug report submitted successfully!");
                closeModal();
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              (0, _alerts.showAlert)("error", ((_err$response = _t.response) === null || _err$response === void 0 || (_err$response = _err$response.data) === null || _err$response === void 0 ? void 0 : _err$response.message) || "Something went wrong");
            case 4:
              _context.p = 4;
              submitBtn.textContent = "Submit Report";
              return _context.f(4);
            case 5:
              return _context.a(2);
          }
        }, _callee, null, [[1, 3, 4, 5]]);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
};
},{"axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"cookieConsent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCookieConsent = void 0;
var initCookieConsent = exports.initCookieConsent = function initCookieConsent() {
  var cookieConsent = document.querySelector(".cookie-consent");
  var acceptBtn = document.querySelector(".cookie-consent__btn--accept");
  if (!cookieConsent || !acceptBtn) return;

  // Check if user has already consented
  var hasConsented = localStorage.getItem("cookieConsent");
  if (!hasConsented) {
    // Show modal after a small delay
    setTimeout(function () {
      cookieConsent.classList.add("show");
    }, 1000);
  } else {
    // User has already consented, update GTM
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });
    }
  }
  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "true");
    cookieConsent.classList.remove("show");

    // Update GTM consent
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });
    }
  });
};
},{}],"blog.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initBlog = void 0;
var _axios = _interopRequireDefault(require("axios"));
var _alerts = require("./alerts");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var initBlog = exports.initBlog = function initBlog() {
  var blogGrid = document.querySelector(".blog-grid");
  if (blogGrid) {
    blogGrid.addEventListener("click", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
        var deleteBtn, articleId, res, card, _t;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.p = _context.n) {
            case 0:
              deleteBtn = e.target.closest(".btn--delete-article");
              if (!deleteBtn) {
                _context.n = 4;
                break;
              }
              e.preventDefault();
              articleId = deleteBtn.dataset.articleId;
              if (!confirm("Are you sure you want to delete this article?")) {
                _context.n = 4;
                break;
              }
              deleteBtn.textContent = "Deleting...";
              _context.p = 1;
              _context.n = 2;
              return _axios.default.delete("/api/v1/articles/".concat(articleId));
            case 2:
              res = _context.v;
              if (res.status === 204) {
                (0, _alerts.showAlert)("success", "Article deleted successfully");
                // Remove card from DOM
                card = deleteBtn.closest(".blog-card");
                if (card) card.remove();
              }
              _context.n = 4;
              break;
            case 3:
              _context.p = 3;
              _t = _context.v;
              (0, _alerts.showAlert)("error", "Error deleting article");
              deleteBtn.textContent = "Delete";
            case 4:
              return _context.a(2);
          }
        }, _callee, null, [[1, 3]]);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());
  }
};
},{"axios":"../../node_modules/axios/index.js","./alerts":"alerts.js"}],"index.js":[function(require,module,exports) {
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var searchBar = document.getElementById("search");
var btnSubStarter = document.getElementById("sub-starter");
var btnSubPro = document.getElementById("sub-pro");
var btnDowngradeStarter = document.getElementById("btn-downgrade-starter");
var btnBillingPortal = document.getElementById("btn-billing-portal");
var _require = require("./stripe"),
  subscribe = _require.subscribe,
  downgradeToStarter = _require.downgradeToStarter,
  manageBilling = _require.manageBilling;
var _require2 = require("./jobs"),
  searchJobs = _require2.searchJobs,
  loadJobData = _require2.loadJobData,
  searchSavedJobs = _require2.searchSavedJobs,
  initJobDetail = _require2.initJobDetail;
var _require3 = require("./auth"),
  signupEmployer = _require3.signupEmployer,
  logout = _require3.logout,
  login = _require3.login,
  signupCandidate = _require3.signupCandidate,
  updateSettings = _require3.updateSettings,
  deleteCv = _require3.deleteCv,
  deleteAccount = _require3.deleteAccount,
  forgotPassword = _require3.forgotPassword,
  resetPassword = _require3.resetPassword,
  claimAccount = _require3.claimAccount,
  resendVerification = _require3.resendVerification;
var _require4 = require("./dashboard"),
  initDashboard = _require4.initDashboard;
var _require5 = require("./admin"),
  initAdmin = _require5.initAdmin;
var _require6 = require("./bugReport"),
  initBugReport = _require6.initBugReport;
var _require7 = require("./cookieConsent"),
  initCookieConsent = _require7.initCookieConsent;
var _require8 = require("./blog"),
  initBlog = _require8.initBlog;
var logOutBtn = document.querySelector(".nav__el--logout");
if (logOutBtn) logOutBtn.addEventListener("click", logout);

// Init Cookie Consent
initCookieConsent();

// Init Bug Report Modal
initBugReport();

// Init Job Detail (Standalone Page)
initJobDetail();

// Init Dashboard
initDashboard();

// Init Admin
initAdmin();

// Init Blog
initBlog();

// Profile Page Logic
var userDataForm = document.querySelector(".form-user-data");
var userPasswordForm = document.querySelector(".form-user-password");
var userCvForm = document.querySelector(".form-user-cv");
var deleteCvBtn = document.getElementById("deleteCvBtn");
var deleteAccountBtn = document.getElementById("deleteAccountBtn");
var forgotPasswordForm = document.querySelector(".form--forgot-password");
var resetPasswordForm = document.querySelector(".form--reset-password");
var claimAccountForm = document.querySelector(".form--claim-account");
if (userDataForm) {
  userDataForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var form = new FormData();
    form.append("name", document.getElementById("name").value);
    form.append("email", document.getElementById("email").value);

    // Check for company fields
    var companyName = document.getElementById("companyName");
    if (companyName) {
      var website = document.getElementById("website").value;
      var industry = document.getElementById("industry").value;
      var companySize = document.getElementById("companySize").value;
      var companyProfile = {
        companyName: companyName.value,
        website: website,
        industry: industry,
        companySize: companySize
      };

      // Append as JSON string or handle in controller as nested object
      // Since we are using FormData for potential file uploads (though not here yet),
      // we need to be careful. But updateSettings uses axios with data object if not file.
      // Wait, updateSettings takes a FormData object OR a plain object.
      // Let's construct a plain object if no file, or append to FormData.

      // Actually, the current updateSettings implementation handles FormData or JSON.
      // But passing nested objects in FormData is tricky.
      // Let's stick to JSON for this form since there's no file upload here (CV is separate).

      var data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        companyProfile: companyProfile
      };
      updateSettings(data, "data");
      return;
    }
    updateSettings(form, "data");
  });
}
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", function (e) {
    e.preventDefault();
    var modal = document.getElementById("deleteAccountModal");
    var closeBtn = document.getElementById("closeDeleteAccountModal");
    var cancelBtn = document.getElementById("cancelDeleteAccountBtn");
    var confirmBtn = document.getElementById("confirmDeleteAccountBtn");
    var emailInput = document.getElementById("deleteEmailConfirm");
    var deleteForm = document.getElementById("deleteAccountForm");

    // Get user email from the settings form
    var userEmail = document.getElementById("email").value;
    modal.classList.remove("hidden");
    emailInput.value = "";
    confirmBtn.disabled = true;
    emailInput.focus();
    var closeModal = function closeModal() {
      modal.classList.add("hidden");
    };
    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;
    emailInput.addEventListener("input", function (e) {
      if (e.target.value === userEmail) {
        confirmBtn.disabled = false;
      } else {
        confirmBtn.disabled = true;
      }
    });
    deleteForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (emailInput.value === userEmail) {
        confirmBtn.textContent = "Deleting...";
        deleteAccount();
      }
    });
  });
}
if (userPasswordForm) {
  userPasswordForm.addEventListener("submit", /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
      var passwordCurrent, password, passwordConfirm;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            e.preventDefault();
            document.querySelector(".btn--save-password").textContent = "Updating...";
            passwordCurrent = document.getElementById("password-current").value;
            password = document.getElementById("password").value;
            passwordConfirm = document.getElementById("password-confirm").value;
            _context.n = 1;
            return updateSettings({
              passwordCurrent: passwordCurrent,
              password: password,
              passwordConfirm: passwordConfirm
            }, "password");
          case 1:
            document.querySelector(".btn--save-password").textContent = "Save password";
            document.getElementById("password-current").value = "";
            document.getElementById("password").value = "";
            document.getElementById("password-confirm").value = "";
          case 2:
            return _context.a(2);
        }
      }, _callee);
    }));
    return function (_x) {
      return _ref.apply(this, arguments);
    };
  }());
}
var updateCvUI = function updateCvUI(cvFilename) {
  var container = document.getElementById("cv-status-container");
  if (!container) return;
  if (cvFilename) {
    container.innerHTML = "\n      <div class=\"cv-display\">\n        <a class=\"btn-text\" href=\"/cvs/".concat(cvFilename, "\" target=\"_blank\">View CV</a>\n        <button class=\"btn btn--small btn--standard\" id=\"deleteCvBtn\">Delete CV</button>\n      </div>\n    ");
  } else {
    container.innerHTML = "<p class=\"ma-bt-md\">No CV uploaded yet.</p>";
  }
};
if (userCvForm) {
  var cvInput = document.getElementById("cv-upload");
  var cvLabel = document.querySelector("label[for='cv-upload']");
  if (cvInput && cvLabel) {
    cvInput.addEventListener("change", function (e) {
      if (e.target.files && e.target.files.length > 0) {
        cvLabel.textContent = e.target.files[0].name;
      } else {
        cvLabel.textContent = "Choose new CV";
      }
    });
  }
  userCvForm.addEventListener("submit", /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(e) {
      var form, cvFile, res;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            e.preventDefault();
            form = new FormData();
            cvFile = document.getElementById("cv-upload").files[0];
            if (!cvFile) {
              _context2.n = 2;
              break;
            }
            form.append("cv", cvFile);
            _context2.n = 1;
            return updateSettings(form, "data");
          case 1:
            res = _context2.v;
            if (res && res.updatedUser && res.updatedUser.cv) {
              updateCvUI(res.updatedUser.cv);
              // Reset file input
              cvInput.value = "";
              cvLabel.textContent = "Choose new CV";
            }
          case 2:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return function (_x2) {
      return _ref2.apply(this, arguments);
    };
  }());
}

// Event delegation for delete CV button since it can be dynamically added/removed
var cvSection = document.getElementById("cv");
if (cvSection) {
  cvSection.addEventListener("click", /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(e) {
      var success;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            if (!(e.target && e.target.id === "deleteCvBtn")) {
              _context3.n = 2;
              break;
            }
            e.preventDefault();
            if (!confirm("Are you sure you want to delete your CV?")) {
              _context3.n = 2;
              break;
            }
            _context3.n = 1;
            return deleteCv();
          case 1:
            success = _context3.v;
            if (success) {
              updateCvUI(null);
            }
          case 2:
            return _context3.a(2);
        }
      }, _callee3);
    }));
    return function (_x3) {
      return _ref3.apply(this, arguments);
    };
  }());
}

// Tab Logic
var tabsContainer = document.querySelector(".user-view__tabs");
if (tabsContainer) {
  tabsContainer.addEventListener("click", function (e) {
    var btn = e.target.closest(".tab-btn");
    if (!btn) return;
    e.preventDefault();

    // Remove active class from all tabs
    document.querySelectorAll(".tab-btn").forEach(function (el) {
      return el.classList.remove("tab-btn--active");
    });
    document.querySelectorAll(".tab-content").forEach(function (el) {
      return el.classList.remove("tab-content--active");
    });

    // Add active class to clicked tab
    btn.classList.add("tab-btn--active");
    var tabId = btn.dataset.tab;
    document.getElementById(tabId).classList.add("tab-content--active");

    // Save active tab to localStorage
    localStorage.setItem("activeTab", tabId);
  });

  // Restore active tab on page load
  var activeTab = localStorage.getItem("activeTab");
  if (activeTab) {
    var btn = document.querySelector(".tab-btn[data-tab='".concat(activeTab, "']"));
    if (btn) {
      // Simulate click to activate tab
      btn.click();
    }
  }
}
var loginForm = document.querySelector(".form--login");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    login(email, password);
  });
}
var signupForm = document.querySelector(".form--signup");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    signupCandidate(name, email, password, passwordConfirm);
  });
}
if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    forgotPassword(email);
  });
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    console.log("Reset password form submitted");
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("password-confirm").value;
    // Get token from URL
    var token = window.location.pathname.split("/")[2];
    console.log("Token extracted:", token);
    console.log("Password:", password);
    console.log("Password Confirm:", passwordConfirm);
    resetPassword(token, password, passwordConfirm);
  });
}
if (claimAccountForm) {
  claimAccountForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    var btn = document.getElementById("claimAccountBtn");
    var token = btn.dataset.token;
    btn.textContent = "Activating...";
    claimAccount(token, password, passwordConfirm);
  });
}

// Subscription Logic
if (btnSubStarter) {
  btnSubStarter.addEventListener("click", function (e) {
    e.target.textContent = "Processing...";
    subscribe({
      plan: "starter"
    });
  });
}
if (btnSubPro) {
  btnSubPro.addEventListener("click", function (e) {
    e.target.textContent = "Processing...";
    subscribe({
      plan: "professional"
    });
  });
}
if (btnDowngradeStarter) {
  btnDowngradeStarter.addEventListener("click", /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(e) {
      var modal, closeBtn, keepProBtn, confirmBtn, featuredJobSelectionContainer, featuredJobSelectionList, featuredJobs, featuredJobCount, checkboxes, closeModal;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            e.preventDefault();
            modal = document.getElementById("downgradeStarterModal");
            closeBtn = document.getElementById("closeDowngradeStarterModal");
            keepProBtn = document.getElementById("keepProSubBtn");
            confirmBtn = document.getElementById("confirmDowngradeStarterBtn");
            featuredJobSelectionContainer = document.getElementById("featuredJobSelectionContainer");
            featuredJobSelectionList = document.getElementById("featuredJobSelectionList"); // Open Modal
            modal.classList.remove("hidden");

            // Check featured jobs count
            featuredJobs = Array.from(document.querySelectorAll(".job-item--featured"));
            featuredJobCount = featuredJobs.length;
            if (featuredJobCount > 3) {
              featuredJobSelectionContainer.classList.remove("hidden");
              featuredJobSelectionList.innerHTML = "";
              featuredJobs.forEach(function (job, index) {
                var id = job.dataset.id;
                var title = job.querySelector(".job-item__title").textContent;
                var uniqueId = "keep-featured-".concat(id, "-").concat(index);
                var html = "\n          <div class=\"job-select-item\">\n            <input type=\"checkbox\" class=\"job-keep-checkbox\" value=\"".concat(id, "\" id=\"").concat(uniqueId, "\">\n            <label for=\"").concat(uniqueId, "\">").concat(title, "</label>\n          </div>\n        ");
                featuredJobSelectionList.insertAdjacentHTML("beforeend", html);
              });

              // Limit selection to 3
              checkboxes = featuredJobSelectionList.querySelectorAll(".job-keep-checkbox");
              checkboxes.forEach(function (checkbox) {
                checkbox.addEventListener("change", function () {
                  var checkedCount = featuredJobSelectionList.querySelectorAll(".job-keep-checkbox:checked").length;
                  if (checkedCount >= 3) {
                    checkboxes.forEach(function (cb) {
                      if (!cb.checked) cb.disabled = true;
                    });
                  } else {
                    checkboxes.forEach(function (cb) {
                      cb.disabled = false;
                    });
                  }
                });
              });
            } else {
              featuredJobSelectionContainer.classList.add("hidden");
            }
            closeModal = function closeModal() {
              modal.classList.add("hidden");
            };
            closeBtn.onclick = closeModal;
            keepProBtn.onclick = closeModal;
            confirmBtn.onclick = function () {
              var selectedJobIds = Array.from(featuredJobSelectionList.querySelectorAll(".job-keep-checkbox:checked")).map(function (cb) {
                return cb.value;
              });
              if (featuredJobCount > 3 && selectedJobIds.length === 0) {
                alert("Please select at least one job to keep featured (up to 3).");
                return;
              }
              confirmBtn.textContent = "Processing...";
              downgradeToStarter(selectedJobIds);
            };
          case 1:
            return _context4.a(2);
        }
      }, _callee4);
    }));
    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }());
}
if (btnBillingPortal) {
  btnBillingPortal.addEventListener("click", function (e) {
    e.target.textContent = "Loading...";
    manageBilling();
  });
}
var handleSearch = function handleSearch() {
  var search, location;

  // Check if we are on the saved jobs page
  if (window.location.pathname.startsWith("/saved")) {
    // On saved jobs page, location is in the sidebar filter
    var _locationInput = document.querySelector('input[name="location"]');
    if (_locationInput) {
      location = _locationInput.value;
    }
    // Search term might not exist or be different on saved page,
    // but currently saved-jobs.pug doesn't have a main search bar,
    // it relies on filters.
  } else if (searchBar) {
    // On main search page
    var inputs = searchBar.querySelectorAll(".search-bar__input");
    search = inputs[0].value;
    location = inputs[1].value;
  }
  var visaTypes = Array.from(document.querySelectorAll('input[name="visaTypes"]:checked')).map(function (el) {
    return el.value;
  }).join(",");
  var remoteWork = Array.from(document.querySelectorAll('input[name="remoteWork"]:checked')).map(function (el) {
    return el.value;
  }).join(",");
  var experienceLevel = Array.from(document.querySelectorAll('input[name="experienceLevel"]:checked')).map(function (el) {
    return el.value;
  }).join(",");
  var salaryMinInput = document.querySelector('input[name="salaryMin"]');
  var salaryMaxInput = document.querySelector('input[name="salaryMax"]');
  var distanceInput = document.querySelector('input[name="distance"]');
  var distanceToggle = document.getElementById("distanceToggle");
  var salaryMin = salaryMinInput && !salaryMinInput.disabled ? salaryMinInput.value : undefined;
  var salaryMax = salaryMaxInput && !salaryMaxInput.disabled ? salaryMaxInput.value : undefined;
  var distance = undefined;
  if (distanceInput) {
    // If toggle exists, rely on its checked state
    if (distanceToggle) {
      if (distanceToggle.checked) {
        distance = distanceInput.value;
      }
    }
    // Fallback to disabled attribute (e.g. saved jobs page)
    else if (!distanceInput.disabled) {
      distance = distanceInput.value;
    }
  }
  var params = {
    search: search,
    location: location || undefined,
    visaTypes: visaTypes || undefined,
    remoteWork: remoteWork || undefined,
    experienceLevel: experienceLevel || undefined,
    salaryMin: salaryMin || undefined,
    salaryMax: salaryMax || undefined,
    distance: distance || undefined
  };
  if (window.location.pathname.startsWith("/saved")) {
    searchSavedJobs(params);
  } else {
    searchJobs(params);
  }
};
if (searchBar) {
  searchBar.addEventListener("submit", function (e) {
    if (document.querySelector(".results")) {
      e.preventDefault();
      handleSearch();
    }
  });
}
var filterInputs = document.querySelectorAll(".filter-input");
if (filterInputs) {
  var updateSliderDisplay = function updateSliderDisplay(input) {
    if (input.name === "distance") {
      var distVal = document.getElementById("distanceValue");
      if (distVal) distVal.textContent = "".concat(input.value, " miles");

      // Update single slider background
      var percent = (input.value - input.min) / (input.max - input.min) * 100;
      input.style.background = "linear-gradient(to right, #2563eb 0%, #2563eb ".concat(percent, "%, #dadae5 ").concat(percent, "%, #dadae5 100%)");
    }
    if (input.name === "salaryMin" || input.name === "salaryMax") {
      var minInput = document.querySelector('input[name="salaryMin"]');
      var maxInput = document.querySelector('input[name="salaryMax"]');
      var minVal = parseInt(minInput.value);
      var maxVal = parseInt(maxInput.value);
      var minMaxGap = 1000;
      if (input.name === "salaryMin") {
        if (minVal > maxVal - minMaxGap) {
          minInput.value = maxVal - minMaxGap;
        }
      } else {
        if (maxVal < minVal + minMaxGap) {
          maxInput.value = minVal + minMaxGap;
        }
      }
      var minValDisplay = document.getElementById("salaryMinValue");
      var maxValDisplay = document.getElementById("salaryMaxValue");
      if (minValDisplay) minValDisplay.textContent = "\xA3".concat((minInput.value / 1000).toFixed(0), "k");
      if (maxValDisplay) maxValDisplay.textContent = "\xA3".concat((maxInput.value / 1000).toFixed(0), "k");
      fillSlider(minInput, maxInput);
    }
  };
  var fillSlider = function fillSlider(minInput, maxInput) {
    var range = parseInt(minInput.max) - parseInt(minInput.min);
    var percent1 = (parseInt(minInput.value) - parseInt(minInput.min)) / range * 100;
    var percent2 = (parseInt(maxInput.value) - parseInt(minInput.min)) / range * 100;
    var sliderTrack = document.querySelector(".slider-track");
    if (sliderTrack) {
      sliderTrack.style.background = "linear-gradient(to right, #dadae5 ".concat(percent1, "%, #2563eb ").concat(percent1, "%, #2563eb ").concat(percent2, "%, #dadae5 ").concat(percent2, "%)");
    }
  };
  filterInputs.forEach(function (input) {
    input.addEventListener("change", handleSearch);
    input.addEventListener("input", function (e) {
      return updateSliderDisplay(e.target);
    });
    // Initialize slider display on load
    updateSliderDisplay(input);
  });
}
var distanceToggle = document.getElementById("distanceToggle");
var salaryToggle = document.getElementById("salaryToggle");
if (distanceToggle) {
  // Sync initial state
  var slider = document.getElementById("distanceSlider");
  var input = slider.querySelector(".range-input");
  if (!distanceToggle.checked) {
    slider.classList.add("disabled-filter");
    input.disabled = true;
  } else {
    slider.classList.remove("disabled-filter");
    input.disabled = false;
  }
  distanceToggle.addEventListener("change", function (e) {
    var slider = document.getElementById("distanceSlider");
    var input = slider.querySelector(".range-input");
    if (e.target.checked) {
      slider.classList.remove("disabled-filter");
      input.disabled = false;
    } else {
      slider.classList.add("disabled-filter");
      input.disabled = true;
    }
    handleSearch();
  });
}
if (salaryToggle) {
  // Sync initial state
  var _slider = document.getElementById("salarySlider");
  var inputs = _slider.querySelectorAll(".range-input");
  var values = document.getElementById("salaryValues");
  if (!salaryToggle.checked) {
    _slider.classList.add("disabled-filter");
    values.classList.add("disabled-text");
    inputs.forEach(function (input) {
      return input.disabled = true;
    });
  } else {
    _slider.classList.remove("disabled-filter");
    values.classList.remove("disabled-text");
    inputs.forEach(function (input) {
      return input.disabled = false;
    });
  }
  salaryToggle.addEventListener("change", function (e) {
    var slider = document.getElementById("salarySlider");
    var inputs = slider.querySelectorAll(".range-input");
    var values = document.getElementById("salaryValues");
    if (e.target.checked) {
      slider.classList.remove("disabled-filter");
      values.classList.remove("disabled-text");
      inputs.forEach(function (input) {
        return input.disabled = false;
      });
    } else {
      slider.classList.add("disabled-filter");
      values.classList.add("disabled-text");
      inputs.forEach(function (input) {
        return input.disabled = true;
      });
    }
    handleSearch();
  });
}
var locationSearchBtn = document.getElementById("locationSearchBtn");
if (locationSearchBtn) {
  locationSearchBtn.addEventListener("click", function (e) {
    e.preventDefault();
    handleSearch();
  });
}
var locationInput = document.querySelector('input[name="location"]');
if (locationInput) {
  locationInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      // Only intercept if we are on a page with results (AJAX search)
      if (document.querySelector(".results")) {
        e.preventDefault();
        handleSearch();
      }
      // Otherwise, let the form submit naturally
    }
  });
}

// Mobile Filters & Details Logic
var showFiltersBtn = document.getElementById("showFiltersBtn");
var closeFiltersBtn = document.getElementById("closeFiltersBtn");
var filtersModal = document.getElementById("filtersModal");
var clearFiltersBtn = document.getElementById("clearFiltersBtn");
var clearFiltersBtnMobile = document.getElementById("clearFiltersBtnMobile");
var detailsModal = document.getElementById("detailsModal");
var closeDetailsBtn = document.getElementById("closeDetailsBtn");
var resultsContainer = document.querySelector(".results");

// Global Event Delegation for Mobile Interactions
document.addEventListener("click", function (e) {
  // 1. Show Filters Button
  var showFiltersBtn = e.target.closest("#showFiltersBtn");
  if (showFiltersBtn) {
    e.preventDefault();
    var _filtersModal = document.getElementById("filtersModal");
    if (_filtersModal) {
      _filtersModal.classList.add("filters--open");
      document.body.classList.add("no-scroll");
    }
    return;
  }

  // 2. Close Filters Button
  var closeFiltersBtn = e.target.closest("#closeFiltersBtn");
  if (closeFiltersBtn) {
    e.preventDefault();
    var _filtersModal2 = document.getElementById("filtersModal");
    if (_filtersModal2) {
      _filtersModal2.classList.remove("filters--open");
      document.body.classList.remove("no-scroll");
    }
    return;
  }

  // 3. Close Details Button
  var closeDetailsBtn = e.target.closest("#closeDetailsBtn");
  if (closeDetailsBtn) {
    e.preventDefault();
    var _detailsModal = document.getElementById("detailsModal");
    if (_detailsModal) {
      _detailsModal.classList.remove("details--open");
      document.body.classList.remove("no-scroll");
    }
    return;
  }

  // 4. Job Card Click
  var card = e.target.closest(".job-card");
  if (card) {
    var _detailsModal2 = document.getElementById("detailsModal");
    if (_detailsModal2) {
      _detailsModal2.classList.add("details--open");
      document.body.classList.add("no-scroll");
      var jobId = card.dataset.id;
      var index = card.dataset.index;
      var total = document.querySelectorAll(".job-card").length;
      var statusEl = document.querySelector(".results-status");
      if (statusEl && index) {
        statusEl.textContent = "Result ".concat(index, " of ").concat(total);
      }
      if (jobId) {
        loadJobData(jobId);
      }
    }
    return;
  }

  // 5. Custom Select Trigger
  var selectTrigger = e.target.closest(".custom-select__trigger");
  if (selectTrigger) {
    var customSelect = selectTrigger.closest(".custom-select");
    if (customSelect) {
      customSelect.classList.toggle("open");
    }
    return;
  }

  // 6. Custom Select Option
  var selectOption = e.target.closest(".custom-option");
  if (selectOption) {
    var _customSelect = selectOption.closest(".custom-select");
    if (_customSelect) {
      var triggerSpan = _customSelect.querySelector(".custom-select__trigger span");
      var hiddenInput = document.getElementById("distanceInput");
      if (triggerSpan) triggerSpan.textContent = selectOption.textContent;
      if (hiddenInput) hiddenInput.value = selectOption.dataset.value;
      var options = _customSelect.querySelectorAll(".custom-option");
      options.forEach(function (opt) {
        return opt.classList.remove("selected");
      });
      selectOption.classList.add("selected");
      _customSelect.classList.remove("open");
    }
    return;
  }

  // 7. Close Custom Select when clicking outside
  var openSelect = document.querySelector(".custom-select.open");
  if (openSelect && !e.target.closest(".custom-select")) {
    openSelect.classList.remove("open");
  }
});
var clearFiltersHandler = function clearFiltersHandler() {
  var inputs = document.querySelectorAll(".filter-input");
  inputs.forEach(function (input) {
    if (input.type === "checkbox") input.checked = false;
    if (input.type === "range") {
      if (input.name === "distance") input.value = 25;
      if (input.name === "salaryMin") input.value = 20000;
      if (input.name === "salaryMax") input.value = 150000;
      input.dispatchEvent(new Event("input"));
    }
  });

  // Reset Toggles
  var distanceToggle = document.getElementById("distanceToggle");
  var salaryToggle = document.getElementById("salaryToggle");
  if (distanceToggle) {
    distanceToggle.checked = false;
    distanceToggle.dispatchEvent(new Event("change"));
  }
  if (salaryToggle) {
    salaryToggle.checked = false;
    salaryToggle.dispatchEvent(new Event("change"));
  }
  handleSearch();
  if (filtersModal) filtersModal.classList.remove("filters--open");
};
if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearFiltersHandler);
}
if (clearFiltersBtnMobile) {
  clearFiltersBtnMobile.addEventListener("click", clearFiltersHandler);
}

// Removed individual listeners in favor of global delegation above
/*
if (resultsContainer && detailsModal) {
  resultsContainer.addEventListener("click", (e) => {
    const card = e.target.closest(".job-card");
    if (card) {
      detailsModal.classList.add("details--open");
      document.body.classList.add("no-scroll");
      const jobId = card.dataset.id;

      // Update Status Text
      const index = card.dataset.index;
      const total = document.querySelectorAll(".job-card").length;
      const statusEl = document.querySelector(".results-status");
      if (statusEl && index) {
        statusEl.textContent = `Result ${index} of ${total}`;
      }

      if (jobId) {
        loadJobData(jobId);
      }
    }
  });
}

if (closeDetailsBtn && detailsModal) {
  closeDetailsBtn.addEventListener("click", () => {
    detailsModal.classList.remove("details--open");
    document.body.classList.remove("no-scroll");
  });
}
*/

// Custom Select Logic - Moved to Global Delegation above
/*
const customSelect = document.querySelector(".custom-select");
if (customSelect) {
  const trigger = customSelect.querySelector(".custom-select__trigger");
  const options = customSelect.querySelectorAll(".custom-option");
  const hiddenInput = document.getElementById("distanceInput");

  trigger.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      trigger.querySelector("span").textContent = option.textContent;
      if (hiddenInput) hiddenInput.value = option.dataset.value;

      options.forEach((opt) => opt.classList.remove("selected"));
      option.classList.add("selected");

      customSelect.classList.remove("open");
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
}
*/

var signupEmployerForm = document.querySelector(".form--signup-employer");
if (signupEmployerForm) {
  signupEmployerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var companyName = document.getElementById("companyName").value;
    var legalOrgName = document.getElementById("legalOrgName").value;
    var website = document.getElementById("website").value;
    var industry = document.getElementById("industry").value;
    var companySize = document.getElementById("companySize").value;
    var password = document.getElementById("password").value;
    var passwordConfirm = document.getElementById("passwordConfirm").value;
    signupEmployer({
      name: name,
      email: email,
      companyName: companyName,
      legalOrgName: legalOrgName,
      website: website,
      industry: industry,
      companySize: companySize,
      password: password,
      passwordConfirm: passwordConfirm
    });
  });
}
var resendVerificationForm = document.querySelector(".form--resend-verification");
if (resendVerificationForm) {
  resendVerificationForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = document.getElementById("email").value;
    var btn = document.getElementById("resendBtn");
    btn.textContent = "Sending...";
    resendVerification(email);
  });
}
},{"./stripe":"stripe.js","./jobs":"jobs.js","./auth":"auth.js","./dashboard":"dashboard.js","./admin":"admin.js","./bugReport":"bugReport.js","./cookieConsent":"cookieConsent.js","./blog":"blog.js"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59611" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/bundle.js.map