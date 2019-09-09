(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["danplayer"] = factory();
	else
		root["danplayer"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "1441":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "5fe9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @desc 解决浮动运算问题，避免小数点后产生多位数和计算精度损失。
 * 问题示例：2.3 + 2.4 = 4.699999999999999，1.0 - 0.9 = 0.09999999999999998
 */
/**
 * 把错误的数据转正
 * strip(0.09999999999999998)=0.1
 */
function strip(num, precision) {
    if (precision === void 0) { precision = 12; }
    return +parseFloat(num.toPrecision(precision));
}
/**
 * Return digits length of a number
 * @param {*number} num Input number
 */
function digitLength(num) {
    // Get digit length of e
    var eSplit = num.toString().split(/[eE]/);
    var len = (eSplit[0].split('.')[1] || '').length - (+(eSplit[1] || 0));
    return len > 0 ? len : 0;
}
/**
 * 把小数转成整数，支持科学计数法。如果是小数则放大成整数
 * @param {*number} num 输入数
 */
function float2Fixed(num) {
    if (num.toString().indexOf('e') === -1) {
        return Number(num.toString().replace('.', ''));
    }
    var dLen = digitLength(num);
    return dLen > 0 ? strip(num * Math.pow(10, dLen)) : num;
}
/**
 * 检测数字是否越界，如果越界给出提示
 * @param {*number} num 输入数
 */
function checkBoundary(num) {
    if (_boundaryCheckingState) {
        if (num > Number.MAX_SAFE_INTEGER || num < Number.MIN_SAFE_INTEGER) {
            console.warn(num + " is beyond boundary when transfer to integer, the results may not be accurate");
        }
    }
}
/**
 * 精确乘法
 */
function times(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return times.apply(void 0, [times(num1, num2), others[0]].concat(others.slice(1)));
    }
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    var baseNum = digitLength(num1) + digitLength(num2);
    var leftValue = num1Changed * num2Changed;
    checkBoundary(leftValue);
    return leftValue / Math.pow(10, baseNum);
}
/**
 * 精确加法
 */
function plus(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return plus.apply(void 0, [plus(num1, num2), others[0]].concat(others.slice(1)));
    }
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) + times(num2, baseNum)) / baseNum;
}
/**
 * 精确减法
 */
function minus(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return minus.apply(void 0, [minus(num1, num2), others[0]].concat(others.slice(1)));
    }
    var baseNum = Math.pow(10, Math.max(digitLength(num1), digitLength(num2)));
    return (times(num1, baseNum) - times(num2, baseNum)) / baseNum;
}
/**
 * 精确除法
 */
function divide(num1, num2) {
    var others = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        others[_i - 2] = arguments[_i];
    }
    if (others.length > 0) {
        return divide.apply(void 0, [divide(num1, num2), others[0]].concat(others.slice(1)));
    }
    var num1Changed = float2Fixed(num1);
    var num2Changed = float2Fixed(num2);
    checkBoundary(num1Changed);
    checkBoundary(num2Changed);
    return times((num1Changed / num2Changed), Math.pow(10, digitLength(num2) - digitLength(num1)));
}
/**
 * 四舍五入
 */
function round(num, ratio) {
    var base = Math.pow(10, ratio);
    return divide(Math.round(times(num, base)), base);
}
var _boundaryCheckingState = true;
/**
 * 是否进行边界检查，默认开启
 * @param flag 标记开关，true 为开启，false 为关闭，默认为 true
 */
function enableBoundaryChecking(flag) {
    if (flag === void 0) { flag = true; }
    _boundaryCheckingState = flag;
}
var index = { strip: strip, plus: plus, minus: minus, times: times, divide: divide, round: round, digitLength: digitLength, float2Fixed: float2Fixed, enableBoundaryChecking: enableBoundaryChecking };

exports.strip = strip;
exports.plus = plus;
exports.minus = minus;
exports.times = times;
exports.divide = divide;
exports.round = round;
exports.digitLength = digitLength;
exports.float2Fixed = float2Fixed;
exports.enableBoundaryChecking = enableBoundaryChecking;
exports['default'] = index;


/***/ }),

/***/ "96cf":
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "a34a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("96cf");


/***/ }),

/***/ "ba10":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ "f6fd":
/***/ (function(module, exports) {

// document.currentScript polyfill by Adam Miller

// MIT license

(function(document){
  var currentScript = "currentScript",
      scripts = document.getElementsByTagName('script'); // Live NodeList collection

  // If browser needs currentScript polyfill, add get currentScript() to the document object
  if (!(currentScript in document)) {
    Object.defineProperty(document, currentScript, {
      get: function(){

        // IE 6-10 supports script readyState
        // IE 10+ support stack trace
        try { throw new Error(); }
        catch (err) {

          // Find the second match for the "at" string to get file src url from stack.
          // Specifically works with the format of stack traces in IE.
          var i, res = ((/.*at [^\(]*\((.*):.+:.+\)$/ig).exec(err.stack) || [false])[1];

          // For all scripts on the page, if src matches or if ready state is interactive, return the script tag
          for(i in scripts){
            if(scripts[i].src == res || scripts[i].readyState == "interactive"){
              return scripts[i];
            }
          }

          // If no match, return null
          return null;
        }
      }
    });
  }
})(document);


/***/ }),

/***/ "faa1":
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  if (true) {
    __webpack_require__("f6fd")
  }

  var setPublicPath_i
  if ((setPublicPath_i = window.document.currentScript) && (setPublicPath_i = setPublicPath_i.src.match(/(.+\/)[^/]+\.js(\?.*)?$/))) {
    __webpack_require__.p = setPublicPath_i[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// EXTERNAL MODULE: ./node_modules/@babel/runtime/regenerator/index.js
var regenerator = __webpack_require__("a34a");
var regenerator_default = /*#__PURE__*/__webpack_require__.n(regenerator);

// EXTERNAL MODULE: ./src/player/style.scss
var style = __webpack_require__("1441");

// EXTERNAL MODULE: ./node_modules/number-precision/build/index.js
var build = __webpack_require__("5fe9");
var build_default = /*#__PURE__*/__webpack_require__.n(build);

// CONCATENATED MODULE: ./src/player/buttonAndLayer.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ButtonAndLayer =
/*#__PURE__*/
function () {
  function ButtonAndLayer(ui) {
    _classCallCheck(this, ButtonAndLayer);

    this.layerHideDelay = 200;
    this.bottomOffset = 40;
    this.hideTimeout = -1;
    this._isShow = false;
    this.ui = ui;
    this.player = ui.player;
  }

  _createClass(ButtonAndLayer, [{
    key: "init",
    value: function init() {
      var _this = this;

      var mouseenterShowLayer = function mouseenterShowLayer() {
        clearTimeout(_this.hideTimeout);
        _this.ui.isMouseInUI = true;

        _this.showLayer();
      };

      var mouseleaveHideLayer = function mouseleaveHideLayer() {
        _this.ui.isMouseInUI = false;
        clearTimeout(_this.hideTimeout);
        _this.hideTimeout = setTimeout(function () {
          _this.hideLayer();
        }, _this.layerHideDelay);
      };

      this.$btn.addEventListener('mouseenter', mouseenterShowLayer);
      this.$btn.addEventListener('mouseleave', mouseleaveHideLayer);
      this.$layer.addEventListener('mouseenter', mouseenterShowLayer);
      this.$layer.addEventListener('mouseleave', mouseleaveHideLayer);
    }
  }, {
    key: "showLayer",
    value: function showLayer() {
      this._isShow = true;
      this.$layer.classList.add('show');
      this.updateLayerPosition();
    }
  }, {
    key: "hideLayer",
    value: function hideLayer() {
      this._isShow = false;
      this.$layer.classList.remove('show');
    }
  }, {
    key: "toggleLayer",
    value: function toggleLayer() {
      if (this._isShow) {
        this.hideLayer();
      } else {
        this.showLayer();
      }
    }
  }, {
    key: "showButton",
    value: function showButton() {
      this.$btn.style.display = '';
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      this.$btn.style.display = 'none';
    }
  }, {
    key: "updateLayerPosition",
    value: function updateLayerPosition() {
      if (!this._isShow) return;
      var rootRect = this.ui.player.$root.getBoundingClientRect();
      var btnRect = this.$btn.getBoundingClientRect();
      var layerRect = this.$layer.getBoundingClientRect();
      var left = btnRect.left + btnRect.width / 2 - rootRect.left - layerRect.width / 2;
      this.$layer.style.left = left + 'px';
      this.$layer.style.bottom = this.bottomOffset + 'px';
    }
  }, {
    key: "destroy",
    value: function destroy() {
      clearTimeout(this.hideTimeout);
    }
  }, {
    key: "isShow",
    get: function get() {
      return this._isShow;
    }
  }]);

  return ButtonAndLayer;
}();
// CONCATENATED MODULE: ./src/player/IconButton.js
function IconButton_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function IconButton_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function IconButton_createClass(Constructor, protoProps, staticProps) { if (protoProps) IconButton_defineProperties(Constructor.prototype, protoProps); if (staticProps) IconButton_defineProperties(Constructor, staticProps); return Constructor; }

var IconButton =
/*#__PURE__*/
function () {
  function IconButton($div) {
    IconButton_classCallCheck(this, IconButton);

    this.$root = $div;
    this.$use = this.$root.querySelector('use');
  }

  IconButton_createClass(IconButton, [{
    key: "switch",
    value: function _switch(iconAttr, titleAttr) {
      this.switchIcon(iconAttr);
      if (titleAttr) this.switchTitle(titleAttr);
    }
  }, {
    key: "switchIcon",
    value: function switchIcon(attributeName) {
      this.$use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + this.$root.getAttribute(attributeName));
    }
  }, {
    key: "switchTitle",
    value: function switchTitle(attributeName) {
      this.$root.setAttribute('title', this.$root.getAttribute(attributeName));
    }
  }]);

  return IconButton;
}();
// CONCATENATED MODULE: ./src/player/volumeLayer.js
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function volumeLayer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function volumeLayer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function volumeLayer_createClass(Constructor, protoProps, staticProps) { if (protoProps) volumeLayer_defineProperties(Constructor.prototype, protoProps); if (staticProps) volumeLayer_defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




build_default.a.enableBoundaryChecking(false);
var volumeLayer_VolumeLayer =
/*#__PURE__*/
function (_ButtonAndLayer) {
  _inherits(VolumeLayer, _ButtonAndLayer);

  function VolumeLayer(ui) {
    var _this;

    volumeLayer_classCallCheck(this, VolumeLayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VolumeLayer).call(this, ui));
    _this.volumeValue = 0;
    _this.areaHeight = 0;
    _this.$video = _this.player.$video;

    _this.$video.addEventListener('volumechange', function () {
      return _this.updateController();
    });

    _this.$layer = _this.player.$root.querySelector('.interactive-layer .volume-bar');
    _this.$valueLabel = _this.$layer.querySelector('.volume-num-label');
    _this.$btn = _this.player.$root.querySelector('.interactive-layer .buttons .button.volume');
    _this.btn = new IconButton(_this.$btn);

    _this.$btn.addEventListener('click', function () {
      return _this.toggleMuted();
    });

    _this.$dragArea = _this.$layer.querySelector('.volume-column-bar');
    _this.$controller = _this.$dragArea.querySelector('.bar-controller');
    _this.$current = _this.$dragArea.querySelector('.bar-current');
    _this.volumeValue = _this.$video.volume = _this.player.options.volume;

    if (_this.volumeValue === 0) {
      _this.volumeValue = 0.7;
    }

    var mousemoveControlVolume = function mousemoveControlVolume(e) {
      var y = e.pageY;

      var rect = _this.$dragArea.getBoundingClientRect();

      if (y < rect.top) {
        _this.$video.volume = 1;
      } else if (y > rect.bottom) {
        _this.$video.volume = 0;
      } else {
        var range = rect.bottom - rect.top;
        y -= rect.top;
        var value = y / range;
        _this.$video.volume = build_default.a.round(1 - value, 2);
      }

      _this.volumeValue = _this.$video.volume;

      _this.updateController();
    };

    var mouseupReleaseControl = function mouseupReleaseControl(e) {
      document.removeEventListener('mousemove', mousemoveControlVolume);
      document.removeEventListener('mouseup', mouseupReleaseControl);
      mousemoveControlVolume(e);
    };

    _this.$dragArea.addEventListener('mousedown', function () {
      document.addEventListener('mousemove', mousemoveControlVolume);
      document.addEventListener('mouseup', mouseupReleaseControl);
    });

    _this.init();

    _this.updateController();

    return _this;
  }

  volumeLayer_createClass(VolumeLayer, [{
    key: "up",
    value: function up() {
      if (this.$video.volume <= 0.9) {
        this.$video.volume = build_default.a.plus(this.$video.volume, 0.1);
      } else {
        this.$video.volume = 1;
      }

      this.volumeValue = this.$video.volume;
    }
  }, {
    key: "down",
    value: function down() {
      if (this.$video.volume >= 0.1) {
        this.$video.volume = build_default.a.minus(this.$video.volume, 0.1);
      } else {
        this.$video.volume = 0;
      }

      this.volumeValue = this.$video.volume;
    }
  }, {
    key: "toggleMuted",
    value: function toggleMuted() {
      if (this.$video.volume > 0) {
        this.$video.volume = 0;
      } else {
        if (this.volumeValue === 0) {
          this.$video.volume = 1;
        } else {
          this.$video.volume = this.volumeValue;
        }
      }

      this.updateButton();
    }
  }, {
    key: "updateButton",
    value: function updateButton() {
      var attr;

      if (this.$video.volume > 0) {
        attr = 'data-on';
      } else {
        attr = 'data-off';
      }

      this.btn.switch(attr);
    }
  }, {
    key: "updateController",
    value: function updateController() {
      var value = build_default.a.round(this.$video.volume * 100, 0);
      this.$valueLabel.innerText = value.toString();
      var y = this.$video.volume * this.areaHeight;
      this.$current.style.height = y + 'px';
      y = this.areaHeight - y;
      this.$controller.style.transform = "translateY(".concat(y, "px)");
      this.updateButton();
    }
  }, {
    key: "showLayer",
    value: function showLayer() {
      _get(_getPrototypeOf(VolumeLayer.prototype), "showLayer", this).call(this);

      this.areaHeight = this.$dragArea.clientHeight;
      this.updateController();
    }
  }, {
    key: "update",
    value: function update() {
      this.$controller.style.background = this.$current.style.background = this.player.options.color;
    }
  }]);

  return VolumeLayer;
}(ButtonAndLayer);
// CONCATENATED MODULE: ./src/player/qualitySelector.js
function qualitySelector_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { qualitySelector_typeof = function _typeof(obj) { return typeof obj; }; } else { qualitySelector_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return qualitySelector_typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function qualitySelector_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function qualitySelector_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function qualitySelector_createClass(Constructor, protoProps, staticProps) { if (protoProps) qualitySelector_defineProperties(Constructor.prototype, protoProps); if (staticProps) qualitySelector_defineProperties(Constructor, staticProps); return Constructor; }

function qualitySelector_possibleConstructorReturn(self, call) { if (call && (qualitySelector_typeof(call) === "object" || typeof call === "function")) { return call; } return qualitySelector_assertThisInitialized(self); }

function qualitySelector_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function qualitySelector_get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { qualitySelector_get = Reflect.get; } else { qualitySelector_get = function _get(target, property, receiver) { var base = qualitySelector_superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return qualitySelector_get(target, property, receiver || target); }

function qualitySelector_superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = qualitySelector_getPrototypeOf(object); if (object === null) break; } return object; }

function qualitySelector_getPrototypeOf(o) { qualitySelector_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return qualitySelector_getPrototypeOf(o); }

function qualitySelector_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) qualitySelector_setPrototypeOf(subClass, superClass); }

function qualitySelector_setPrototypeOf(o, p) { qualitySelector_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return qualitySelector_setPrototypeOf(o, p); }


var QualitySelector =
/*#__PURE__*/
function (_ButtonAndLayer) {
  qualitySelector_inherits(QualitySelector, _ButtonAndLayer);

  function QualitySelector(ui) {
    var _this;

    qualitySelector_classCallCheck(this, QualitySelector);

    _this = qualitySelector_possibleConstructorReturn(this, qualitySelector_getPrototypeOf(QualitySelector).call(this, ui));
    _this.autoLevel = {
      selected: false,
      name: '自动',
      index: -1,
      bitrate: 0
    };
    _this.levels = [];
    _this.currentLevel = -1;
    _this.$btn = _this.player.$root.querySelector('.button.quality');
    _this.$layer = _this.player.$root.querySelector('.float.quality-menu');

    _this.init();

    _this.$layer.addEventListener('click', function (e) {
      if (e.target) {
        var $item = e.target;

        if ($item.hasAttribute('data-value')) {
          var value = parseInt($item.getAttribute('data-value'));
          console.log('level click', value);

          _this.levels.forEach(function (level) {
            level.selected = level.index === value;
          });
        }
      }

      _this.updateButton();

      _this.hideLayer();
    });

    return _this;
  }

  qualitySelector_createClass(QualitySelector, [{
    key: "showButton",
    value: function showButton() {
      this.$btn.style.display = '';
    }
  }, {
    key: "hideButton",
    value: function hideButton() {
      this.$btn.style.display = 'none';
    }
  }, {
    key: "showLayer",
    value: function showLayer() {
      qualitySelector_get(qualitySelector_getPrototypeOf(QualitySelector.prototype), "showLayer", this).call(this);

      this._updateLevel();

      this.updateLayerPosition();
      this.updateButton();
    }
  }, {
    key: "updateButton",
    value: function updateButton() {
      var _this2 = this;

      this.levels.every(function (level) {
        if (level.selected) {
          _this2.$btn.innerText = level.name;
        }

        return !level.selected;
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.currentLevel = -1;
      this.$layer.innerHTML = '';
    }
  }, {
    key: "_updateLevel",
    value: function _updateLevel() {
      var _this3 = this;

      this.$layer.innerHTML = '';
      this.levels.forEach(function (level, index) {
        var $item = document.createElement('div');

        if (index === _this3.currentLevel) {
          $item.classList.add('current');
        }

        $item.innerText = level.name;
        $item.setAttribute('data-value', level.index.toString());

        _this3.$layer.append($item);
      });
    }
  }, {
    key: "updateLevel",
    value: function updateLevel(levels) {
      var _this$levels;

      console.log('update level', levels);
      this.levels.length = 0;
      this.autoLevel.selected = true;

      (_this$levels = this.levels).push.apply(_this$levels, _toConsumableArray(levels).concat([this.autoLevel]));

      this._updateLevel();

      this.updateLayerPosition();
      this.updateButton();
    }
  }]);

  return QualitySelector;
}(ButtonAndLayer);
// CONCATENATED MODULE: ./src/player/progressBar.js
function progressBar_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function progressBar_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function progressBar_createClass(Constructor, protoProps, staticProps) { if (protoProps) progressBar_defineProperties(Constructor.prototype, protoProps); if (staticProps) progressBar_defineProperties(Constructor, staticProps); return Constructor; }

var ProgressBar =
/*#__PURE__*/
function () {
  function ProgressBar(ui) {
    var _this = this;

    progressBar_classCallCheck(this, ProgressBar);

    this.barWidth = 0;
    this._currentTime = 0;
    this.percent = 0;
    this.offsetWidth = 0;
    this.player = ui.player;
    this.ui = ui;
    this.$root = this.player.$root.querySelector('.progress-bar');
    this.$controller = this.$root.querySelector('.bar-controller');
    this.$current = this.$root.querySelector('.bar-current');
    this.$time = this.player.$root.querySelector('.controller-bottom-bar .time');
    this.$buffer = this.$root.querySelector('.bar-buffer');
    this.player.$video.addEventListener('timeupdate', function () {
      _this._currentTime = _this.player.$video.currentTime;
      _this.percent = _this._currentTime / _this.player.$video.duration;

      _this.time();

      _this.update();
    });
    this.player.$video.addEventListener('progress', function () {
      _this.updateBufferBar();

      _this.time();
    });

    var mouseMoveChangeTime = function mouseMoveChangeTime(e) {
      var playerRect = _this.player.$root.getBoundingClientRect();

      var x = e.pageX - playerRect.left - _this.offsetWidth / 2;

      if (x < 0) {
        x = 0;
      } else if (x > _this.barWidth) {
        x = _this.barWidth;
      }

      _this.percent = x / _this.barWidth;
      _this.player.$video.currentTime = _this.percent * _this.player.$video.duration;

      _this.update();

      _this.ui.isMouseInUI = true;
    };

    var mouseup = function mouseup() {
      document.removeEventListener('mousemove', mouseMoveChangeTime);
      document.removeEventListener('mouseup', mouseup);
    };

    this.$root.addEventListener('mousedown', function () {
      document.addEventListener('mousemove', mouseMoveChangeTime);
      document.addEventListener('mouseup', mouseup);
    });
    this.$root.addEventListener('click', mouseMoveChangeTime);
    this.offsetWidth = this.player.width - this.$root.clientWidth;
    this.resize();
  }

  progressBar_createClass(ProgressBar, [{
    key: "time",
    value: function time() {
      if (this.player.options.live) return;
      this.$time.innerText = ProgressBar.getTimeString(this.player.$video.currentTime) + ' / ' + ProgressBar.getTimeString(this.player.$video.duration);
    }
  }, {
    key: "resize",
    value: function resize() {
      this.barWidth = this.player.width - this.offsetWidth;
      this.update();
      this.updateBufferBar();
    }
  }, {
    key: "update",
    value: function update() {
      var x = this.barWidth * this.percent;
      this.$current.style.width = x + 'px';
      this.$controller.style.transform = "translateX(".concat(x, "px)");
      this.$controller.style.background = this.player.options.color;
      this.$current.style.background = this.player.options.color;
    }
  }, {
    key: "resetTimeZone",
    value: function resetTimeZone() {
      if (this.player.options.live) {
        this.$time.innerText = '直播';
      } else {
        this.$time.innerText = '';
      }
    }
  }, {
    key: "updateBufferBar",
    value: function updateBufferBar() {
      for (var i = 0; i < this.player.$video.buffered.length; i++) {
        var start = this.player.$video.buffered.start(i);
        var end = this.player.$video.buffered.end(i);

        if (start < this._currentTime && this._currentTime < end) {
          this.$buffer.style.width = end / this.player.$video.duration * this.barWidth + 'px';
        }
      }
    }
  }], [{
    key: "getTimeString",
    value: function getTimeString(s) {
      var time = [];
      var temp = Math.floor(s / (60 * 60));

      if (temp > 0) {
        if (temp.toString().length === 1) {
          temp = '0' + temp;
        }

        time.push(temp);
      }

      temp = Math.floor(s / 60) - Math.floor(s / 3600) * 60;

      if (temp.toString().length === 1) {
        temp = '0' + temp;
      }

      time.push(temp);
      temp = Math.floor(s) - Math.floor(s / 60) * 60;

      if (temp.toString().length === 1) {
        temp = '0' + temp;
      }

      time.push(temp);
      return time.join(':');
    }
  }]);

  return ProgressBar;
}();
// CONCATENATED MODULE: ./src/player/danmaku/danmaku.js
function danmaku_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DanmakuType;

(function (DanmakuType) {
  DanmakuType[DanmakuType["Top"] = 0] = "Top";
  DanmakuType[DanmakuType["Flow"] = 1] = "Flow";
  DanmakuType[DanmakuType["Bottom"] = 2] = "Bottom";
})(DanmakuType || (DanmakuType = {}));

function MakeDanmakuOptions(_ref) {
  var _ref$currentTime = _ref.currentTime,
      currentTime = _ref$currentTime === void 0 ? 0 : _ref$currentTime,
      _ref$borderColor = _ref.borderColor,
      borderColor = _ref$borderColor === void 0 ? '' : _ref$borderColor,
      _ref$fill = _ref.fill,
      fill = _ref$fill === void 0 ? '#ffffff' : _ref$fill,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? DanmakuType.Flow : _ref$type,
      _ref$id = _ref.id,
      id = _ref$id === void 0 ? '' : _ref$id,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? 28 : _ref$fontSize;
  return {
    currentTime: currentTime,
    type: type,
    borderColor: borderColor,
    fill: fill,
    id: id,
    fontSize: fontSize
  };
}
var Danmaku = function Danmaku(text, options) {
  danmaku_classCallCheck(this, Danmaku);

  this.text = text;
  Object.assign(this, MakeDanmakuOptions(options || {}));
};
// CONCATENATED MODULE: ./src/player/danmaku/danmakuDrawer.js
function danmakuDrawer_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { danmakuDrawer_typeof = function _typeof(obj) { return typeof obj; }; } else { danmakuDrawer_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return danmakuDrawer_typeof(obj); }

function danmakuDrawer_possibleConstructorReturn(self, call) { if (call && (danmakuDrawer_typeof(call) === "object" || typeof call === "function")) { return call; } return danmakuDrawer_assertThisInitialized(self); }

function danmakuDrawer_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function danmakuDrawer_getPrototypeOf(o) { danmakuDrawer_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return danmakuDrawer_getPrototypeOf(o); }

function danmakuDrawer_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) danmakuDrawer_setPrototypeOf(subClass, superClass); }

function danmakuDrawer_setPrototypeOf(o, p) { danmakuDrawer_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return danmakuDrawer_setPrototypeOf(o, p); }

function danmakuDrawer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function danmakuDrawer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function danmakuDrawer_createClass(Constructor, protoProps, staticProps) { if (protoProps) danmakuDrawer_defineProperties(Constructor.prototype, protoProps); if (staticProps) danmakuDrawer_defineProperties(Constructor, staticProps); return Constructor; }

var font = 'px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
var DanmakuDrawer =
/*#__PURE__*/
function () {
  function DanmakuDrawer() {
    danmakuDrawer_classCallCheck(this, DanmakuDrawer);

    this.top = 0;
    this.left = 0;
    this.width = 0;
    this.height = 0;
    this.enable = false;
    this.selfCanvas = document.createElement('canvas');
    this.selfCanvas.width = 100;
    this.selfCanvas.height = 100;
    this.ctx = this.selfCanvas.getContext('2d');
  }

  danmakuDrawer_createClass(DanmakuDrawer, [{
    key: "getSize",
    value: function getSize() {
      this.ctx.textBaseline = 'top';
      this.ctx.textAlign = 'left';
      this.ctx.font = this.danmaku.fontSize + font;
      this.width = this.ctx.measureText(this.danmaku.text).width;
      this.height = this.ctx.measureText('M').width * 1.2;
    }
  }, {
    key: "draw",
    value: function draw() {
      var width = this.width + 4;
      var height = this.height;
      this.selfCanvas.width = width;
      this.selfCanvas.height = height;
      this.ctx.textBaseline = 'top';
      this.ctx.textAlign = 'left';
      this.ctx.font = this.danmaku.fontSize + font;
      this.ctx.clearRect(0, 0, width, height);

      if (this.danmaku.borderColor) {
        this.ctx.strokeStyle = this.danmaku.borderColor;
        this.ctx.strokeRect(1, 1, width - 4, height - 4);
      }

      this.ctx.strokeStyle = '#000000';
      this.ctx.strokeText(this.danmaku.text, 1, 1);
      this.ctx.fillStyle = this.danmaku.fill;
      this.ctx.fillText(this.danmaku.text, 1, 1);
    }
  }]);

  return DanmakuDrawer;
}();
var DanmakuFlowDrawer =
/*#__PURE__*/
function (_DanmakuDrawer) {
  danmakuDrawer_inherits(DanmakuFlowDrawer, _DanmakuDrawer);

  function DanmakuFlowDrawer() {
    danmakuDrawer_classCallCheck(this, DanmakuFlowDrawer);

    return danmakuDrawer_possibleConstructorReturn(this, danmakuDrawer_getPrototypeOf(DanmakuFlowDrawer).apply(this, arguments));
  }

  danmakuDrawer_createClass(DanmakuFlowDrawer, [{
    key: "set",
    value: function set(danmaku, left, top) {
      this.danmaku = danmaku;
      this.enable = true;
      this.left = left;
      this.top = top;
      this.getSize();
      this.draw();
    }
  }, {
    key: "update",
    value: function update(canvasWidth, duration, lastFrameTime) {
      var speed = (canvasWidth + this.width) / duration * lastFrameTime;
      this.left = this.left - speed;
      this.enable = this.left + this.width > 0;
    }
  }]);

  return DanmakuFlowDrawer;
}(DanmakuDrawer);
var DanmakuFixedDrawer =
/*#__PURE__*/
function (_DanmakuDrawer2) {
  danmakuDrawer_inherits(DanmakuFixedDrawer, _DanmakuDrawer2);

  function DanmakuFixedDrawer() {
    var _this;

    danmakuDrawer_classCallCheck(this, DanmakuFixedDrawer);

    _this = danmakuDrawer_possibleConstructorReturn(this, danmakuDrawer_getPrototypeOf(DanmakuFixedDrawer).apply(this, arguments));
    _this.timeout = 0;
    return _this;
  }

  danmakuDrawer_createClass(DanmakuFixedDrawer, [{
    key: "set",
    value: function set(danmaku, timeout, canvasWidth, top) {
      this.danmaku = danmaku;
      this.timeout = timeout;
      this.enable = true;
      this.getSize();
      this.left = (canvasWidth - this.width) / 2;
      this.top = top;
      this.draw();
      this.update(0);
    }
  }, {
    key: "update",
    value: function update(lastFrameTime) {
      console.log({
        timeout: this.timeout,
        lastFrameTime: lastFrameTime
      });
      this.timeout -= lastFrameTime;
      this.enable = this.timeout > 0;
    }
  }]);

  return DanmakuFixedDrawer;
}(DanmakuDrawer);
// EXTERNAL MODULE: ./node_modules/events/events.js
var events = __webpack_require__("faa1");

// CONCATENATED MODULE: ./src/player/danmaku/canvas.js
function canvas_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function canvas_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function canvas_createClass(Constructor, protoProps, staticProps) { if (protoProps) canvas_defineProperties(Constructor.prototype, protoProps); if (staticProps) canvas_defineProperties(Constructor, staticProps); return Constructor; }

var canvas_font = 'px "Hiragino Sans GB", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif';
var Canvas =
/*#__PURE__*/
function () {
  function Canvas(player) {
    canvas_classCallCheck(this, Canvas);

    this.caches = [];
    this.player = player;
    this.$canvas = player.$root.querySelector('canvas');
    this.ctx = this.$canvas.getContext('2d');
    this.$canvas.addEventListener('click', function () {
      player.toggle();
    });
  }

  canvas_createClass(Canvas, [{
    key: "addDrawer",
    value: function addDrawer(drawer) {
      this.caches.push(drawer);
    }
  }, {
    key: "removeDrawer",
    value: function removeDrawer(drawer) {
      var index = this.caches.indexOf(drawer);
      if (index > -1) this.caches.splice(index, 1);
    }
  }, {
    key: "renderAll",
    value: function renderAll() {
      this.clear();

      if (this.caches.length > 0) {
        for (var i = 0; i < this.caches.length; i++) {
          var drawer = this.caches[i];
          this.ctx.drawImage(drawer.selfCanvas, drawer.left, drawer.top);
        }
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(0, 0, this.player.width, this.player.height);
    }
  }, {
    key: "clearCache",
    value: function clearCache() {
      this.caches.length = 0;
    }
  }, {
    key: "fontHeight",
    value: function fontHeight(fontSize) {
      this.ctx.font = fontSize + canvas_font;
      var size = this.ctx.measureText('M');
      return size.width * 1.2;
    }
  }, {
    key: "fontWidth",
    value: function fontWidth(drawer) {
      this.ctx.font = drawer.danmaku.fontSize + canvas_font;
      var size = this.ctx.measureText(drawer.danmaku.text);
      return size.width;
    }
  }, {
    key: "resize",
    value: function resize() {
      this.$canvas.setAttribute('width', this.player.width + 'px');
      this.$canvas.setAttribute('height', this.player.height + 'px');
    }
  }, {
    key: "alpha",
    set: function set(val) {
      this.ctx.globalAlpha = val;
    }
  }]);

  return Canvas;
}();
// CONCATENATED MODULE: ./src/player/danmaku/danmakuLayer.js
function danmakuLayer_toConsumableArray(arr) { return danmakuLayer_arrayWithoutHoles(arr) || danmakuLayer_iterableToArray(arr) || danmakuLayer_nonIterableSpread(); }

function danmakuLayer_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function danmakuLayer_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function danmakuLayer_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function danmakuLayer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function danmakuLayer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function danmakuLayer_createClass(Constructor, protoProps, staticProps) { if (protoProps) danmakuLayer_defineProperties(Constructor.prototype, protoProps); if (staticProps) danmakuLayer_defineProperties(Constructor, staticProps); return Constructor; }





var LimitType;

(function (LimitType) {
  LimitType[LimitType["UnLimited"] = 0] = "UnLimited";
  LimitType[LimitType["UnOverlap"] = 1] = "UnOverlap";
  LimitType[LimitType["Percent25"] = 0.25] = "Percent25";
  LimitType[LimitType["Half"] = 0.5] = "Half";
  LimitType[LimitType["Percent75"] = 0.25] = "Percent75";
})(LimitType || (LimitType = {}));

var template = '<div class="content"></div><div class="buttons"><span class="copy">复制</span></div>';

function MakeDanmakuDrawerMenu(d, menus, copyFn) {
  var $div = document.createElement('div');
  $div.innerHTML = template;
  var $content = $div.querySelector('.content');
  $content.innerText = d.danmaku.text;
  var $buttons = $div.querySelector('.buttons');

  for (var key in menus) {
    var $span = document.createElement('span');
    $span.innerText = key;
    $span.onclick = menus[key];
    $buttons.prepend($span);
  }

  var $copy = $div.querySelector('.copy');

  if ($copy) {
    $copy.addEventListener('click', function () {
      return copyFn(d.danmaku.text);
    });
  }

  return $div;
}

function MakeDanmakuLayerOptions() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$alpha = _ref.alpha,
      alpha = _ref$alpha === void 0 ? 1 : _ref$alpha,
      _ref$enable = _ref.enable,
      enable = _ref$enable === void 0 ? true : _ref$enable,
      _ref$flowDuration = _ref.flowDuration,
      flowDuration = _ref$flowDuration === void 0 ? 8 : _ref$flowDuration,
      _ref$fadeoutDuration = _ref.fadeoutDuration,
      fadeoutDuration = _ref$fadeoutDuration === void 0 ? 5 : _ref$fadeoutDuration,
      _ref$limit = _ref.limit,
      limit = _ref$limit === void 0 ? LimitType.UnOverlap : _ref$limit,
      _ref$contextMenu = _ref.contextMenu,
      contextMenu = _ref$contextMenu === void 0 ? undefined : _ref$contextMenu;

  return {
    alpha: alpha,
    enable: enable,
    flowDuration: flowDuration,
    limit: limit,
    fadeoutDuration: fadeoutDuration,
    contextMenu: contextMenu
  };
}
var danmakuLayer_DanmakuLayer =
/*#__PURE__*/
function () {
  function DanmakuLayer(player) {
    var _this = this;

    danmakuLayer_classCallCheck(this, DanmakuLayer);

    this.danmakus = [];
    this.showed = [];
    this.topEnables = [];
    this.topAndBottomDisables = [];
    this.bottomEnables = [];
    this.flowEnables = [];
    this.flowDisables = [];
    this.lineHeights = [];
    this.topLines = {};
    this.bottomLines = {};
    this.flowLines = {};
    this.displayArea = 0;
    this.topY = 0;
    this.flowY = 0;
    this.bottomY = 0;
    this.frameTime = 0;
    this.calcDanmakuTime = 0;
    this.isShow = true;
    this.width = 0;
    this.height = 0;
    this.calcTopInterval = -1;
    this.destroied = false;
    this.addDanmakuToCanvasTime = 0;
    this.lastFrame = 0;
    this.player = player;
    this.event = new events["EventEmitter"]();
    this.canvas = new Canvas(player);

    var hideMenu = function hideMenu() {
      document.removeEventListener('click', hideMenu);
      document.removeEventListener('contextmenu', hideMenu);

      _this.$menu.remove();
    };

    this.canvas.$canvas.addEventListener('contextmenu', function (e) {
      var found = _this.findDrawers(e);

      if (found.length > 0) {
        _this.createDanmakuMenu(found);

        var x = e.pageX;
        var y = e.pageY;
        var right = e.clientX + _this.$menu.clientWidth;
        var bottom = e.clientY + _this.$menu.clientHeight;

        if (right > document.body.clientWidth) {
          x -= right - document.body.clientWidth;
        }

        if (bottom > document.body.clientHeight) {
          y -= bottom - document.body.clientHeight;
        }

        _this.$menu.style.left = x + 'px';
        _this.$menu.style.top = y + 'px';
        document.addEventListener('click', hideMenu);
        document.addEventListener('touchstart', hideMenu);
        document.addEventListener('contextmenu', hideMenu);
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    this.canvas.$canvas.addEventListener('dblclick', function () {
      _this.player.toggleFullScreen();
    });
    this.player.$video.addEventListener('seeked', function () {
      _this.clear();
    });

    if (this.player.options.danmaku.enable) {
      this.show();
    } else {
      this.hide();
    }

    this.loop();
  }

  danmakuLayer_createClass(DanmakuLayer, [{
    key: "createDanmakuMenu",
    value: function createDanmakuMenu(drawers) {
      var _this2 = this;

      if (this.$menu) this.$menu.remove();
      this.$menu = document.createElement('div');
      this.$menu.className = 'float show danmaku-context-menu';

      for (var i = 0; i < drawers.length; i++) {
        var drawer = drawers[i];

        if (this.player.options.danmaku.contextMenu) {
          var $menu = MakeDanmakuDrawerMenu(drawer, this.player.options.danmaku.contextMenu(drawer.danmaku), function (text) {
            return _this2.copyText(text);
          });
          this.$menu.append($menu);
        }
      }

      document.body.append(this.$menu);
    }
  }, {
    key: "show",
    value: function show() {
      this.isShow = true;
    }
  }, {
    key: "hide",
    value: function hide() {
      this.isShow = false;
      this.canvas.clear();
    }
  }, {
    key: "clear",
    value: function clear() {
      var _this$topAndBottomDis, _this$flowDisables;

      this.showed.length = 0;
      this.canvas.clear();
      this.canvas.clearCache();

      (_this$topAndBottomDis = this.topAndBottomDisables).push.apply(_this$topAndBottomDis, danmakuLayer_toConsumableArray(this.topEnables));

      this.topEnables.length = 0;

      (_this$flowDisables = this.flowDisables).push.apply(_this$flowDisables, danmakuLayer_toConsumableArray(this.flowEnables));

      this.flowEnables.length = 0;
    }
  }, {
    key: "resize",
    value: function resize() {
      this.width = this.player.$root.clientWidth;
      this.height = this.player.$root.clientHeight;
      this.lineHeight = Math.round(this.canvas.fontHeight(this.player.options.fontSize));
      this.lineHeights.length = 0;

      for (var y = 0; y < window.screen.height; y++) {
        var height = y * this.lineHeight;
        if (height > window.screen.height) break;
        this.lineHeights.push(height);

        if (!this.topLines.hasOwnProperty(height)) {
          this.topLines[height] = null;
        }

        if (!this.bottomLines.hasOwnProperty(height)) {
          this.bottomLines[height] = [];
        }

        if (!this.flowLines.hasOwnProperty(height)) {
          this.flowLines[height] = [];
        }
      }

      this.canvas.resize();
      var limit = this.player.options.danmaku.limit;

      if (limit === LimitType.Percent75) {
        this.displayArea = this.player.height * 0.75;
      } else if (limit === LimitType.Half) {
        this.displayArea = this.player.height * 0.5;
      } else if (limit === LimitType.Percent25) {
        this.displayArea = this.player.height * 0.25;
      } else {
        this.displayArea = this.player.height;
      }

      this.canvas.alpha = this.player.options.danmaku.alpha;
      this.canvas.renderAll();
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.isShow) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: "send",
    value: function send(d) {
      d.text = d.text.trim();
      this.danmakus.push(d);
    }
  }, {
    key: "findDrawers",
    value: function findDrawers(e) {
      return [].concat(danmakuLayer_toConsumableArray(this.topEnables.filter(function (drawer) {
        return DanmakuLayer.find(e, drawer);
      })), danmakuLayer_toConsumableArray(this.bottomEnables.filter(function (drawer) {
        return DanmakuLayer.find(e, drawer);
      })), danmakuLayer_toConsumableArray(this.flowEnables.filter(function (drawer) {
        return DanmakuLayer.find(e, drawer);
      })));
    }
  }, {
    key: "addDanmakuToCanvas",
    value: function addDanmakuToCanvas() {
      if (this.danmakus.length === 0) return;

      for (var i = 0; i < this.danmakus.length; i++) {
        var danmaku = this.danmakus[i];
        var time = Math.abs(this.player.currentTime - danmaku.currentTime);
        if (this.showed.includes(danmaku)) continue;
        if (time > 0.1) continue;
        this.showed.push(danmaku);
        var top = void 0;

        if (danmaku.type === DanmakuType.Flow) {
          var drawer = this.flowDisables.shift() || new DanmakuFlowDrawer();
          drawer.enable = true;
          drawer.set(danmaku, this.width, this.calcFlowTop(drawer));
          drawer.update(this.width, this.player.options.danmaku.flowDuration, 0);
          this.flowEnables.push(drawer);
          this.canvas.addDrawer(drawer);
        } else {
          var _drawer = this.topAndBottomDisables.shift() || new DanmakuFixedDrawer();

          _drawer.enable = true;

          if (danmaku.type === DanmakuType.Top) {
            _drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, this.calcTopTop(_drawer));

            this.topEnables.push(_drawer);
          } else {
            var _top = this.calcBottomTop(_drawer) + this.lineHeight;

            _top = this.height - _top;

            _drawer.set(danmaku, this.player.options.danmaku.fadeoutDuration, this.width, _top);

            this.bottomEnables.push(_drawer);
          }

          _drawer.update(0);

          this.canvas.addDrawer(_drawer);
        }

        this.canvas.renderAll();
      }
    }
  }, {
    key: "copyText",
    value: function copyText(text) {
      if (!this.$input) {
        this.$input = this.player.$root.querySelector('input.copy-tool');
      }

      this.$input.value = text;
      this.$input.select();
      document.execCommand('copy');
    }
  }, {
    key: "calcFlowTop",
    value: function calcFlowTop(drawer) {
      for (var key in this.flowLines) {
        var _d = this.flowLines[key];
        var height = Number(key);
        var right = _d.left + _d.width;
        if (_d && _d.enable && right > this.width) continue;
        if (height > this.displayArea) break;
        console.log('发现空行', key);
        this.flowLines[key] = drawer;
        this.flowY = height;
        return height;
      }

      this.flowY += this.lineHeight;
      if (this.flowY > this.displayArea) this.flowY = 0;
      this.flowLines[this.flowY] = drawer;
      return this.flowY;
    }
  }, {
    key: "calcTopTop",
    value: function calcTopTop(drawer) {
      for (var key in this.topLines) {
        var _d = this.topLines[key];
        var height = Number(key);
        if (_d && _d.enable) continue;
        if (height > this.displayArea) break;
        console.log('发现空行', key);
        this.topLines[key] = drawer;
        this.topY = height;
        return height;
      }

      this.topY += this.lineHeight;
      if (this.topY > this.displayArea) this.topY = 0;
      this.topLines[this.topY] = drawer;
      return this.topY;
    }
  }, {
    key: "calcBottomTop",
    value: function calcBottomTop(drawer) {
      for (var key in this.bottomLines) {
        var _d = this.bottomLines[key];
        var height = Number(key);
        if (_d && _d.enable) continue;
        if (height > this.displayArea) break;
        console.log('发现空行', key);
        this.bottomLines[key] = drawer;
        this.bottomY = height;
        return height;
      }

      this.bottomY += this.lineHeight;
      if (this.bottomY > this.displayArea) this.bottomY = 0;
      this.bottomLines[this.bottomY] = drawer;
      return this.bottomY;
    }
  }, {
    key: "drawDanmaku",
    value: function drawDanmaku() {
      var _this3 = this;

      this.topEnables = this.topEnables.filter(function (drawer) {
        if (drawer.enable) {
          drawer.update(_this3.frameTime);
          return true;
        } else {
          _this3.canvas.removeDrawer(drawer);

          _this3.topAndBottomDisables.push(drawer);

          return false;
        }
      });
      this.bottomEnables = this.bottomEnables.filter(function (drawer) {
        if (drawer.enable) {
          drawer.update(_this3.frameTime);
          return true;
        } else {
          _this3.canvas.removeDrawer(drawer);

          _this3.topAndBottomDisables.push(drawer);

          return false;
        }
      });
      this.flowEnables = this.flowEnables.filter(function (drawer) {
        if (drawer.enable) {
          drawer.update(_this3.width, _this3.player.options.danmaku.flowDuration, _this3.frameTime);
          return true;
        } else {
          _this3.canvas.removeDrawer(drawer);

          _this3.flowDisables.push(drawer);

          return false;
        }
      });
    }
  }, {
    key: "loop",
    value: function loop() {
      var _this4 = this;

      if (this.destroied) return;
      this.addDanmakuToCanvas();
      this.addDanmakuToCanvasTime = (Date.now() - this.lastFrame) / 1000;

      if (!this.player.paused) {
        this.drawDanmaku();
        this.calcDanmakuTime = (Date.now() - this.lastFrame) / 1000;

        if (this.isShow) {
          this.canvas.renderAll();
        } else {
          this.canvas.clear();
        }
      }

      this.frameTime = (Date.now() - this.lastFrame) / 1000;
      this.lastFrame = Date.now();
      window.requestAnimationFrame(function () {
        _this4.loop();
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.destroied = true;
      clearInterval(this.calcTopInterval);

      if (this.$menu) {
        this.$menu.remove();
      }
    }
  }, {
    key: "debug",
    get: function get() {
      return {
        isShow: this.isShow,
        all: this.danmakus.length,
        showed: this.showed.length,
        time: {
          addDanmakuToCanvas: this.addDanmakuToCanvasTime,
          drawDanmaku: this.calcDanmakuTime,
          frameTime: this.frameTime
        },
        'on screen danmakus': {
          top: this.topEnables.length,
          bottom: this.bottomEnables.length,
          flow: this.flowEnables.length
        },
        'danmaku pool': {
          fixed: this.topAndBottomDisables.length,
          flow: this.flowDisables.length
        },
        positionY: {
          top: this.topY,
          flow: this.flowY,
          bottom: this.bottomY
        }
      };
    }
  }], [{
    key: "find",
    value: function find(e, drawer) {
      if (e.offsetX > drawer.left && e.offsetX < drawer.left + drawer.width) {
        if (e.offsetY > drawer.top && e.offsetY < drawer.top + drawer.height) {
          return true;
        }
      }

      return false;
    }
  }]);

  return DanmakuLayer;
}();
// CONCATENATED MODULE: ./src/player/danmaku/danmakuStyleLayer.js
function danmakuStyleLayer_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { danmakuStyleLayer_typeof = function _typeof(obj) { return typeof obj; }; } else { danmakuStyleLayer_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return danmakuStyleLayer_typeof(obj); }

function danmakuStyleLayer_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function danmakuStyleLayer_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function danmakuStyleLayer_createClass(Constructor, protoProps, staticProps) { if (protoProps) danmakuStyleLayer_defineProperties(Constructor.prototype, protoProps); if (staticProps) danmakuStyleLayer_defineProperties(Constructor, staticProps); return Constructor; }

function danmakuStyleLayer_possibleConstructorReturn(self, call) { if (call && (danmakuStyleLayer_typeof(call) === "object" || typeof call === "function")) { return call; } return danmakuStyleLayer_assertThisInitialized(self); }

function danmakuStyleLayer_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function danmakuStyleLayer_getPrototypeOf(o) { danmakuStyleLayer_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return danmakuStyleLayer_getPrototypeOf(o); }

function danmakuStyleLayer_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) danmakuStyleLayer_setPrototypeOf(subClass, superClass); }

function danmakuStyleLayer_setPrototypeOf(o, p) { danmakuStyleLayer_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return danmakuStyleLayer_setPrototypeOf(o, p); }



var danmakuStyleLayer_template = "<div>\u7C7B\u578B\n<div class=\"types\">\n  <div class=\"type\" data-type=\"1\"><div><svg class=\"icon\"><use xlink:href=\"#danplayer-danmugundongkai\"></use></svg></div>\u6D41\u52A8</div>\n  <div class=\"type\" data-type=\"0\"><div><svg class=\"icon\"><use xlink:href=\"#danplayer-danmudingbukai\"></use></svg></div>\u9876\u90E8</div>\n  <div class=\"type\" data-type=\"2\"><div><svg class=\"icon\"><use xlink:href=\"#danplayer-danmudibukai\"></use></svg></div>\u5E95\u90E8</div>\n</div>\n</div>\n<div>\u989C\u8272\n<div class=\"colors\">\n{colors}\n</div>\n</div>";
var danmakuStyleLayer_DanmakuStyleLayer =
/*#__PURE__*/
function (_ButtonAndLayer) {
  danmakuStyleLayer_inherits(DanmakuStyleLayer, _ButtonAndLayer);

  function DanmakuStyleLayer(ui) {
    var _this;

    danmakuStyleLayer_classCallCheck(this, DanmakuStyleLayer);

    _this = danmakuStyleLayer_possibleConstructorReturn(this, danmakuStyleLayer_getPrototypeOf(DanmakuStyleLayer).call(this, ui));
    _this.fill = '#ffffff';
    _this.type = DanmakuType.Flow;
    _this.$layer = _this.player.$root.querySelector('.float.danmaku-style-layer');
    _this.$btn = _this.player.$root.querySelector('.intern-button.danmaku-style');
    _this.$layer.innerHTML = danmakuStyleLayer_template.replace('{colors}', DanmakuStyleLayer.colors.map(function (color) {
      return "<span style=\"background: ".concat(color, "\" data-color=\"").concat(color, "\"></span>");
    }).join(''));

    _this.init();

    _this.$types = Array.from(_this.$layer.querySelectorAll('.types > .type'));
    _this.$colors = Array.from(_this.$layer.querySelectorAll('.colors > span'));

    _this.$types.forEach(function ($dom) {
      return $dom.addEventListener('click', function () {
        _this.$types.forEach(function ($dom) {
          return $dom.classList.remove('selected');
        });

        $dom.classList.add('selected');
        _this.type = Number($dom.getAttribute('data-type'));
      });
    });

    _this.$colors.forEach(function ($dom) {
      return $dom.addEventListener('click', function () {
        _this.$colors.forEach(function ($dom) {
          return $dom.classList.remove('selected');
        });

        $dom.classList.add('selected');
        _this.fill = $dom.getAttribute('data-color');
      });
    });

    _this.$types[0].classList.add('selected');

    _this.$colors[_this.$colors.length - 1].classList.add('selected');

    return _this;
  }

  danmakuStyleLayer_createClass(DanmakuStyleLayer, [{
    key: "getStyle",
    value: function getStyle() {
      return {
        fill: this.fill,
        type: this.type,
        borderColor: 'white'
      };
    }
  }]);

  return DanmakuStyleLayer;
}(ButtonAndLayer);
danmakuStyleLayer_DanmakuStyleLayer.colors = ['#FE0302', '#FF7204', '#FFAA02', '#FFD302', '#FFFF00', '#A0EE00', '#00CD00', '#019899', '#4266BE', '#89D5FF', '#CC0273', '#222222', '#9B9B9B', '#FFFFFF'];
// CONCATENATED MODULE: ./src/player/danmaku/danmakuForm.js
function danmakuForm_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function danmakuForm_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function danmakuForm_createClass(Constructor, protoProps, staticProps) { if (protoProps) danmakuForm_defineProperties(Constructor.prototype, protoProps); if (staticProps) danmakuForm_defineProperties(Constructor, staticProps); return Constructor; }



var danmakuForm_DanmakuForm =
/*#__PURE__*/
function () {
  function DanmakuForm(ui) {
    var _this = this;

    danmakuForm_classCallCheck(this, DanmakuForm);

    this.isShow = false;
    this.ui = ui;
    this.styleLayer = new danmakuStyleLayer_DanmakuStyleLayer(ui);
    this.$root = ui.player.$root.querySelector('.danmaku-form');
    this.$input = this.$root.querySelector('input');
    this.$btn = this.$root.querySelector('.send');
    this.$btn.addEventListener('click', function () {
      return _this.send();
    });
    this.$input.addEventListener('keypress', function (e) {
      if (e.key === 'Enter' && _this.ui.isShow && _this.$input.value) {
        _this.send();
      }
    });
    this.$input.addEventListener('keydown', function (e) {
      if (e.key.startsWith('Arrow') || e.key === ' ') {
        e.stopPropagation();
      }
    });
    this.$input.addEventListener('keyup', function (e) {
      if (e.key === 'Escape') {
        _this.ui.player.$root.focus();

        _this.ui.hide();
      }

      e.stopPropagation();
    });
    this.$input.addEventListener('focus', function () {
      _this.ui.isMouseInUI = true;
    });
    this.$input.addEventListener('blur', function () {
      _this.ui.isMouseInUI = false;
    });
  }

  danmakuForm_createClass(DanmakuForm, [{
    key: "send",
    value: function send() {
      var options = this.styleLayer.getStyle();
      options.currentTime = this.ui.player.currentTime;
      this.ui.danmakuLayer.send(new Danmaku(this.$input.value, options));
      this.$input.value = '';
      this.ui.player.$root.focus();
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.isShow) {
        this.hide();
      } else {
        this.show();
      }
    }
  }, {
    key: "show",
    value: function show() {
      this.isShow = true;
      this.$root.style.display = '';
    }
  }, {
    key: "hide",
    value: function hide() {
      this.isShow = false;
      this.$root.style.display = 'none';
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "focus",
    value: function focus() {
      this.$input.focus();
    }
  }]);

  return DanmakuForm;
}();
// CONCATENATED MODULE: ./src/player/UI.js


function UI_toConsumableArray(arr) { return UI_arrayWithoutHoles(arr) || UI_iterableToArray(arr) || UI_nonIterableSpread(); }

function UI_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function UI_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function UI_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function UI_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function UI_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function UI_createClass(Constructor, protoProps, staticProps) { if (protoProps) UI_defineProperties(Constructor.prototype, protoProps); if (staticProps) UI_defineProperties(Constructor, staticProps); return Constructor; }








var UI_UI =
/*#__PURE__*/
function () {
  function UI(player) {
    var _this = this;

    UI_classCallCheck(this, UI);

    this._isMouseInUI = false;
    this.isShow = false;
    this.extraButtons = [];
    this.hideTimeout = -1;
    this.player = player;
    this.$root = player.$root.querySelector('.interactive-layer .controller-bottom-bar');
    this.$root.addEventListener('mouseenter', function () {
      _this.isMouseInUI = true;
    });
    this.$root.addEventListener('mouseleave', function () {
      _this.isMouseInUI = false;
    });
    this.$gradientBG = player.$root.querySelector('.bg-gradient');
    this.volume = new volumeLayer_VolumeLayer(this);
    this.qualitySelector = new QualitySelector(this);
    this.progressBar = new ProgressBar(this);
    this.styleLayer = new danmakuStyleLayer_DanmakuStyleLayer(this);
    this.danmakuForm = new danmakuForm_DanmakuForm(this);
    this.$controllerButtonsRightLayout = this.$root.querySelector('.buttons .right');
    this.btnFullScreen = new IconButton(this.$root.querySelector('.button.full-screen'));
    this.btnFullScreen.$root.addEventListener('click',
    /*#__PURE__*/
    _asyncToGenerator(
    /*#__PURE__*/
    regenerator_default.a.mark(function _callee() {
      return regenerator_default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.player.toggleFullScreen();

            case 2:
              _this.updateFullScreenButton();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    this.btnPlay = new IconButton(this.$root.querySelector('.button.play'));
    this.btnPlay.$root.addEventListener('click', function () {
      _this.player.toggle();

      _this.updatePlayButton();
    });
    this.btnShowDanmaku = new IconButton(this.$root.querySelector('.button.toggle-danamaku'));
    this.btnShowDanmaku.$root.addEventListener('click', function () {
      _this.danmakuLayer.toggle();

      _this.updateDanmakuButton();
    });
    this.danmakuLayer = new danmakuLayer_DanmakuLayer(player);
    this.insertExtraButtons();
  }

  UI_createClass(UI, [{
    key: "show",
    value: function show() {
      this.isShow = true;
      this.$root.classList.add('show');
      this.$gradientBG.classList.add('show');
    }
  }, {
    key: "hide",
    value: function hide() {
      this.isShow = false;
      this.$root.classList.remove('show');
      this.$gradientBG.classList.remove('show');
      this.qualitySelector.hideLayer();
      this.volume.hideLayer();
      this.danmakuForm.styleLayer.hideLayer();
      this.player.$root.focus();
    }
  }, {
    key: "hideUIDelay",
    value: function hideUIDelay() {
      var _this2 = this;

      this.cancelHideUIDelay();
      return new Promise(function (resolve) {
        _this2.hideTimeout = window.setTimeout(function () {
          _this2.hide();

          resolve();
        }, _this2.player.options.uiFadeOutDelay);
      });
    }
  }, {
    key: "cancelHideUIDelay",
    value: function cancelHideUIDelay() {
      clearTimeout(this.hideTimeout);
    }
  }, {
    key: "clearExtraButtons",
    value: function clearExtraButtons() {
      this.extraButtons.forEach(function ($btn) {
        return $btn.remove();
      });
      this.extraButtons.length = 0;
    }
  }, {
    key: "insertExtraButtons",
    value: function insertExtraButtons() {
      this.clearExtraButtons();

      if (this.player.options.extraButtons) {
        var _this$$controllerButt, _this$extraButtons;

        this.player.options.extraButtons.forEach(function ($btn) {
          $btn.classList.add('button');
          $btn.classList.remove('intern-button');
        });

        (_this$$controllerButt = this.$controllerButtonsRightLayout).prepend.apply(_this$$controllerButt, UI_toConsumableArray(this.player.options.extraButtons));

        (_this$extraButtons = this.extraButtons).push.apply(_this$extraButtons, UI_toConsumableArray(this.player.options.extraButtons));
      }
    }
  }, {
    key: "update",
    value: function update() {
      this.updateDanmakuButton();
      this.updateFullScreenButton();
      this.updatePlayButton();
      this.danmakuForm.update();
      this.progressBar.update();
      this.volume.update();
    }
  }, {
    key: "updatePlayButton",
    value: function updatePlayButton() {
      if (this.player.paused) {
        this.btnPlay.switch('data-on', 'data-on-title');
      } else {
        this.btnPlay.switch('data-off', 'data-off-title');
      }
    }
  }, {
    key: "updateFullScreenButton",
    value: function updateFullScreenButton() {
      if (this.player.isFullScreen) {
        this.btnFullScreen.switch('data-off', 'data-off-title');
      } else {
        this.btnFullScreen.switch('data-on', 'data-on-title');
      }
    }
  }, {
    key: "updateDanmakuButton",
    value: function updateDanmakuButton() {
      var attr;
      var title;

      if (this.danmakuLayer.isShow) {
        attr = 'data-off';
        title = 'data-off-title';
      } else {
        attr = 'data-on';
        title = 'data-on-title';
      }

      this.btnShowDanmaku.switch(attr, title);
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.volume.isShow) this.volume.updateLayerPosition();
      if (this.qualitySelector.isShow) this.qualitySelector.updateLayerPosition();
      this.progressBar.resize();
      this.danmakuLayer.resize();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      clearTimeout(this.hideTimeout);
      this.danmakuLayer.destroy();
      this.qualitySelector.destroy();
      this.volume.destroy();
    }
  }, {
    key: "isMouseInUI",
    set: function set(val) {
      this._isMouseInUI = val;
      this.cancelHideUIDelay();
    },
    get: function get() {
      return this._isMouseInUI;
    }
  }, {
    key: "debug",
    get: function get() {
      return {
        isShow: this.isShow,
        isMouseInUI: this._isMouseInUI,
        danmakuLayer: this.danmakuLayer.debug
      };
    }
  }]);

  return UI;
}();
// EXTERNAL MODULE: ./node_modules/eventemitter3/index.js
var eventemitter3 = __webpack_require__("ba10");

// CONCATENATED MODULE: ./src/player/qualityLevelAdapter.js
function qualityLevelAdapter_typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { qualityLevelAdapter_typeof = function _typeof(obj) { return typeof obj; }; } else { qualityLevelAdapter_typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return qualityLevelAdapter_typeof(obj); }

function qualityLevelAdapter_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function qualityLevelAdapter_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function qualityLevelAdapter_createClass(Constructor, protoProps, staticProps) { if (protoProps) qualityLevelAdapter_defineProperties(Constructor.prototype, protoProps); if (staticProps) qualityLevelAdapter_defineProperties(Constructor, staticProps); return Constructor; }

function qualityLevelAdapter_possibleConstructorReturn(self, call) { if (call && (qualityLevelAdapter_typeof(call) === "object" || typeof call === "function")) { return call; } return qualityLevelAdapter_assertThisInitialized(self); }

function qualityLevelAdapter_assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function qualityLevelAdapter_getPrototypeOf(o) { qualityLevelAdapter_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return qualityLevelAdapter_getPrototypeOf(o); }

function qualityLevelAdapter_inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) qualityLevelAdapter_setPrototypeOf(subClass, superClass); }

function qualityLevelAdapter_setPrototypeOf(o, p) { qualityLevelAdapter_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return qualityLevelAdapter_setPrototypeOf(o, p); }


var AdapterEvents = {
  OnLoad: 'OnLoaded',
  OnChanged: 'OnChanged'
};

function createLevelsFromHls(hls) {
  var levels = {};
  hls.levels.forEach(function (item, index) {
    var name = item.height + 'p';
    if (levels[name] && levels[name].bitrate > item.bitrate) return;
    levels[name] = {
      selected: false,
      name: name,
      index: item.level,
      bitrate: item.bitrate
    };
  });
  return Object.values(levels);
}

function createLevelsFromDash(dash) {
  var levels = {};
  var list = dash.getBitrateInfoListFor('video');
  list.forEach(function (item, index) {
    var name = item.height + 'p';
    if (levels[name] && levels[name].bitrate > item.bitrate) return;
    levels[name] = {
      selected: false,
      name: name,
      index: item.qualityIndex,
      bitrate: item.bitrate
    };
  });
  return Object.values(levels);
}

var QualityLevelAdapter =
/*#__PURE__*/
function (_EventEmitter) {
  qualityLevelAdapter_inherits(QualityLevelAdapter, _EventEmitter);

  function QualityLevelAdapter() {
    var _this;

    qualityLevelAdapter_classCallCheck(this, QualityLevelAdapter);

    _this = qualityLevelAdapter_possibleConstructorReturn(this, qualityLevelAdapter_getPrototypeOf(QualityLevelAdapter).call(this));
    console.log('event', QualityLevelAdapter.Events);
    return _this;
  }

  qualityLevelAdapter_createClass(QualityLevelAdapter, [{
    key: "useHls",
    value: function useHls(hls) {
      var _this2 = this;

      this.hls = hls;
      hls.on(Hls.Events.LEVEL_LOADED, function () {
        _this2.emit(QualityLevelAdapter.Events.OnLoad, createLevelsFromHls(hls));
      });
    }
  }, {
    key: "useDash",
    value: function useDash(dash) {
      var _this3 = this;

      this.dash = dash;
      dash.on('streamInitialized', function () {
        _this3.emit(QualityLevelAdapter.Events.OnLoad, createLevelsFromDash(dash));
      });
    }
  }, {
    key: "trigger",
    value: function trigger(event) {
      for (var _len = arguments.length, data = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        data[_key - 1] = arguments[_key];
      }

      this.emit.apply(this, [event, event].concat(data));
    }
  }]);

  return QualityLevelAdapter;
}(eventemitter3["EventEmitter"]);
QualityLevelAdapter.Events = AdapterEvents;
// CONCATENATED MODULE: ./src/player/player.js


function player_toConsumableArray(arr) { return player_arrayWithoutHoles(arr) || player_iterableToArray(arr) || player_nonIterableSpread(); }

function player_nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function player_iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function player_arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function player_asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function player_asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { player_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { player_asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function player_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function player_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function player_createClass(Constructor, protoProps, staticProps) { if (protoProps) player_defineProperties(Constructor.prototype, protoProps); if (staticProps) player_defineProperties(Constructor, staticProps); return Constructor; }





var icon = '//at.alicdn.com/t/font_1373341_m9a3piei0s.js';
var player_template = "{video-layer}\n<input class=\"copy-tool\" />\n<div class=\"interactive-layer\">\n  <canvas class=\"danmaku-layer\"></canvas>\n  \n  <div class=\"bg-gradient show\"></div>\n  \n  \n  <div class=\"float danmaku-style-layer\"></div>\n  \n  <div class=\"float volume-bar\">\n    <div class=\"volume-num-label\"></div>\n    <div class=\"volume-column-bar\">\n      <div class=\"bar-ui bar-full\"></div>\n      <div class=\"bar-ui bar-current\"></div>\n      <div class=\"bar-controller\"></div>\n    </div>\n  </div>\n  \n  <div class=\"float quality-menu\"></div>\n  \n  <div class=\"controller-bottom-bar\">\n    <div class=\"progress-bar live-hide\">\n      <div class=\"bar-full\"></div>\n      <div class=\"bar-buffer\"></div>\n      <div class=\"bar-current\"></div>\n      <div class=\"bar-controller\"></div>    \n    </div>\n    \n    <div class=\"buttons\">\n      <div class=\"left\">\n        <div class=\"button intern-button play\" data-on=\"danplayer-bofang\" data-off=\"danplayer-zanting\"\n          data-on-title=\"\u64AD\u653E\u89C6\u9891\" data-off-title=\"\u6682\u505C\u64AD\u653E\">\n          <svg class=\"icon\" aria-hidden=\"true\"><use xlink:href=\"#danplayer-bofang\"></use></svg>\n        </div>\n        <div class=\"time\"></div>\n      </div>\n      \n      <div class=\"middle danmaku-form\">\n        <div class=\"button intern-button danmaku-style\">\n          <svg class=\"icon\"><use xlink:href=\"#danplayer-style\"></use></svg>\n        </div>\n        <input placeholder=\"\u8F93\u5165\u5F39\u5E55\u5185\u5BB9\" tabindex=\"1\">\n        <div class=\"send\">\u53D1\u9001</div>\n      </div>\n      <div class=\"right\">\n      \n        <div class=\"button intern-button volume\" data-on=\"danplayer-yinliang\" data-off=\"danplayer-jingyin\" title=\"\u97F3\u91CF\">\n          <svg class=\"icon\"><use xlink:href=\"#danplayer-yinliang\"></use></svg>\n        </div>\n        \n        <div class=\"button intern-button toggle-danamaku\" title=\"\u9690\u85CF\u5F39\u5E55\"\n          data-on=\"danplayer-danmukai\" data-off=\"danplayer-danmuguan\" \n          data-on-title=\"\u663E\u793A\u5F39\u5E55\" data-off-title=\"\u9690\u85CF\u5F39\u5E55\">\n          <svg class=\"icon\"><use xlink:href=\"#danplayer-danmukai\"></use></svg>\n        </div>\n        \n        <div class=\"button quality\" title=\"\u5207\u6362\u753B\u8D28\"></div>\n        \n        <div class=\"button intern-button full-screen\" data-on=\"danplayer-quanping\" data-off=\"danplayer-zuixiaohua\"\n        data-on-title=\"\u5168\u5C4F\u89C2\u770B\" data-off-title=\"\u53D6\u6D88\u5168\u5C4F\">\n          <svg class=\"icon\"><use xlink:href=\"#danplayer-quanping\"></use></svg>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>";
var VideoType;

(function (VideoType) {
  VideoType[VideoType["Normal"] = 0] = "Normal";
  VideoType[VideoType["Hls"] = 1] = "Hls";
  VideoType[VideoType["Dash"] = 2] = "Dash";
})(VideoType || (VideoType = {}));

function MakeDefaultOptions(_ref) {
  var _ref$autoplay = _ref.autoplay,
      autoplay = _ref$autoplay === void 0 ? false : _ref$autoplay,
      _ref$color = _ref.color,
      color = _ref$color === void 0 ? '#00a1d6' : _ref$color,
      _ref$live = _ref.live,
      live = _ref$live === void 0 ? false : _ref$live,
      _ref$volume = _ref.volume,
      volume = _ref$volume === void 0 ? 0.7 : _ref$volume,
      _ref$fontSize = _ref.fontSize,
      fontSize = _ref$fontSize === void 0 ? 28 : _ref$fontSize,
      _ref$width = _ref.width,
      width = _ref$width === void 0 ? 600 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === void 0 ? 350 : _ref$height,
      _ref$uiFadeOutDelay = _ref.uiFadeOutDelay,
      uiFadeOutDelay = _ref$uiFadeOutDelay === void 0 ? 3000 : _ref$uiFadeOutDelay,
      _ref$extraButtons = _ref.extraButtons,
      extraButtons = _ref$extraButtons === void 0 ? [] : _ref$extraButtons,
      _ref$src = _ref.src,
      src = _ref$src === void 0 ? '' : _ref$src,
      _ref$iconSrc = _ref.iconSrc,
      iconSrc = _ref$iconSrc === void 0 ? icon : _ref$iconSrc,
      _ref$danmakuForm = _ref.danmakuForm,
      danmakuForm = _ref$danmakuForm === void 0 ? true : _ref$danmakuForm,
      _ref$fullScreen = _ref.fullScreen,
      fullScreen = _ref$fullScreen === void 0 ? true : _ref$fullScreen,
      _ref$danmaku = _ref.danmaku,
      danmaku = _ref$danmaku === void 0 ? {} : _ref$danmaku,
      _ref$onlyOne = _ref.onlyOne,
      onlyOne = _ref$onlyOne === void 0 ? false : _ref$onlyOne;
  return {
    autoplay: autoplay,
    color: color,
    live: live,
    fontSize: fontSize,
    height: height,
    danmaku: MakeDanmakuLayerOptions(danmaku),
    danmakuForm: danmakuForm,
    fullScreen: fullScreen,
    src: src,
    iconSrc: iconSrc,
    uiFadeOutDelay: uiFadeOutDelay,
    extraButtons: extraButtons,
    onlyOne: onlyOne,
    volume: volume,
    width: width
  };
}

var player_Player =
/*#__PURE__*/
function () {
  function Player($e, options) {
    var _this = this;

    player_classCallCheck(this, Player);

    this.type = VideoType.Normal;
    this._width = '';
    this._height = '';
    this.isFullScreen = false;
    this._duration = 0;
    this._loading = true;
    this._paused = true;
    this.delayResize = -1;

    if (!document.querySelector('script#danplayer-icon')) {
      var $icon = document.createElement('script');
      $icon.src = icon;
      $icon.id = 'danplayer-icon';
      document.body.append($icon);
    }

    Player.instances.push(this);
    var parent = $e.parentElement;
    this.$root = document.createElement('div');
    this.$root.setAttribute('tabIndex', '0');
    this.$root.classList.add('video-player');
    parent.insertBefore(this.$root, $e);
    $e.classList.add('video-layer');
    $e.removeAttribute('id');
    this.$root.innerHTML = player_template.replace('{video-layer}', $e.outerHTML);
    $e.remove();
    this.$root.addEventListener('keypress', function (e) {
      var stop = true;

      if (e.key === 'Enter') {
        _this.ui.show();

        _this.ui.danmakuForm.focus();
      } else if (e.key === ' ') {} else {
        stop = false;
      }

      if (stop) {
        e.stopPropagation();
        e.preventDefault();
      }
    });
    this.$root.addEventListener('keyup', function (e) {
      if (e.key === ' ') {
        _this.toggle();

        e.stopPropagation();
        e.preventDefault();
      }
    });
    document.addEventListener('fullscreenchange', function () {
      _this.isFullScreen = document.fullscreenElement === _this.$root;

      _this.ui.updateFullScreenButton();
    });
    this.$root.addEventListener('keydown', function (e) {
      var stop = true;

      if (e.key === 'ArrowLeft' && !_this.options.live) {
        _this.$video.currentTime -= 5;
      } else if (e.key === 'ArrowRight' && !_this.options.live) {
        _this.$video.currentTime += 5;
      } else if (e.key === 'ArrowUp') {
        _this.ui.volume.up();
      } else if (e.key === 'ArrowDown') {
        _this.ui.volume.down();
      } else {
        stop = false;
      }

      if (stop) {
        e.stopPropagation();
        e.preventDefault();
      }
    });
    this.$root.addEventListener('mousemove', function () {
      _this.$root.classList.remove('mouse-idle');

      _this.ui.show();

      if (_this.paused) {} else {
        if (_this.ui.isMouseInUI) return;

        _this.ui.hideUIDelay().then(function () {
          _this.$root.classList.add('mouse-idle');
        });
      }
    });
    this.$root.addEventListener('mouseenter', function () {
      _this.ui.show();

      _this.ui.cancelHideUIDelay();
    });
    this.$root.addEventListener('mouseleave', function () {
      _this.ui.hide();

      _this.ui.cancelHideUIDelay();
    });
    this.$video = this.$root.querySelector('.video-layer');
    this.$video.removeAttribute('controls');
    this.$video.addEventListener('durationchange', function () {
      _this._duration = _this.$video.duration;
    });
    this.$video.addEventListener('playing', function () {
      return _this.ui.hideUIDelay();
    });
    this.$video.addEventListener('play', function () {
      return _this.ui.updatePlayButton();
    });
    this.$video.addEventListener('pause', function () {
      return _this.ui.updatePlayButton();
    });
    window.addEventListener('resize', function () {
      return _this.resizeEvt(1000);
    });
    this.options = MakeDefaultOptions(options || {
      autoplay: this.$video.hasAttribute('autoplay')
    });
    this.adapter = new QualityLevelAdapter();
    this.ui = new UI_UI(this);
    this.ui.update();
    this.adapter.on(QualityLevelAdapter.Events['OnLoad'], function (levels) {
      _this.ui.qualitySelector.updateLevel(levels);
    });

    this._setSrc().then();

    this._setUI();
  }

  player_createClass(Player, [{
    key: "_setSrc",
    value: function () {
      var _setSrc2 = player_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee() {
        return regenerator_default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (this.options.src) {
                  this.$video.setAttribute('src', this.options.src);
                }

                _context.next = 3;
                return this.getContentType();

              case 3:
                if (this.hls) {
                  this.adapter.useHls(this.hls);
                } else if (this.dash) {
                  this.adapter.useDash(this.dash);
                }

                if (this.type === VideoType.Normal) {
                  this.ui.qualitySelector.hideButton();
                } else {
                  this.ui.qualitySelector.showButton();
                }

                console.log('_set', {
                  autoplay: this.options.autoplay,
                  paused: this._paused
                });

                if (this.options.autoplay || !this.paused) {
                  console.log('_set 播放');
                  this.play();
                }

                if (this.options.live) {
                  this.$root.classList.add('live');
                } else {
                  this.$root.classList.remove('live');
                }

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _setSrc() {
        return _setSrc2.apply(this, arguments);
      }

      return _setSrc;
    }()
  }, {
    key: "_setUI",
    value: function _setUI() {
      this.ui.insertExtraButtons();
      this.ui.update();
      this.ui.progressBar.resize();
      this.ui.progressBar.resetTimeZone();
      this.resize();

      if (this.$style) {
        this.$style.remove();
      }

      this.$style = document.createElement('style');
      this.$style.innerHTML = ".video-player .colors .selected{border-color:".concat(this.options.color, " !important}\n.video-player .types .selected{color:").concat(this.options.color, " !important}");
      document.body.append(this.$style);
    }
  }, {
    key: "set",
    value: function set(options) {
      options.danmaku = Object.assign({}, this.options.danmaku, options.danmaku);
      var newOptions = Object.assign({}, this.options, options);
      var hasChange = newOptions.src !== this.options.src || this.options.live !== newOptions.live;
      this.options = newOptions;

      if (hasChange) {
        if (this.hls) {
          this.hls.detachMedia();
          this.hls = undefined;
        }

        if (this.dash) {
          this.dash.reset();
          this.dash = undefined;
        }

        this._setSrc().then();
      }

      this._setUI();
    }
  }, {
    key: "resize",
    value: function resize() {
      if (this.options.width) {
        if (typeof this.options.width === 'number' || parseInt(this.options.width).toString() === this.options.width) {
          this._width = this.options.width + 'px';
        } else {
          this._width = this.options.width;
        }
      }

      if (this.options.height) {
        if (typeof this.options.height === 'number' || parseInt(this.options.height).toString() === this.options.height) {
          this._height = this.options.height + 'px';
        } else {
          this._height = this.options.height;
        }
      }

      if (!this.isFullScreen) {
        this.$root.style.width = this._width;
        this.$root.style.height = this._height;
      }

      this.ui.resize();
    }
  }, {
    key: "resizeEvt",
    value: function resizeEvt(ms) {
      var _this2 = this;

      window.clearTimeout(this.delayResize);
      this.delayResize = window.setTimeout(function () {
        _this2.resize();
      }, ms);
    }
  }, {
    key: "fillDanmakus",
    value: function fillDanmakus(array) {
      var _this$ui$danmakuLayer;

      (_this$ui$danmakuLayer = this.ui.danmakuLayer.danmakus).push.apply(_this$ui$danmakuLayer, player_toConsumableArray(array));
    }
  }, {
    key: "sendDanmaku",
    value: function sendDanmaku(danmaku) {
      this.ui.danmakuLayer.send(danmaku);
    }
  }, {
    key: "toggle",
    value: function toggle() {
      if (this.paused) {
        this.play();
      } else {
        this.pause();
      }
    }
  }, {
    key: "play",
    value: function play() {
      var _this3 = this;

      this._paused = false;
      this.$video.play().then();

      if (this.options.onlyOne) {
        Player.instances.forEach(function (player) {
          if (player !== _this3) {
            player.pause();
          }
        });
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      this._paused = true;
      this.$video.pause();
    }
  }, {
    key: "getContentType",
    value: function () {
      var _getContentType = player_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee2() {
        var src, http, contentType;
        return regenerator_default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                src = this.$video.getAttribute('src');
                console.log('视频网址', src);

                if (src) {
                  this.options.src = src;
                  if (src.match(/\.m3u[8]/)) this.type = VideoType.Hls;
                  if (src.match(/\.mpd/)) this.type = VideoType.Dash;
                }

                if (!(this.type === VideoType.Hls)) {
                  _context2.next = 10;
                  break;
                }

                console.log('使用Hls.js');

                if (Hls) {
                  _context2.next = 7;
                  break;
                }

                throw Error('播放Hls视频资源请加载hls.js的代码');

              case 7:
                if (Hls.isSupported()) {
                  this.hls = new Hls();
                  this.hls.config.capLevelToPlayerSize = true;
                  this.hls.attachMedia(this.$video);
                  this.hls.loadSource(src);
                }

                _context2.next = 26;
                break;

              case 10:
                if (!(this.type === VideoType.Dash)) {
                  _context2.next = 18;
                  break;
                }

                console.log('使用dash.js');

                if (dashjs) {
                  _context2.next = 14;
                  break;
                }

                throw Error('播放MPD视频资源前加载dash.js的代码');

              case 14:
                this.dash = dashjs.MediaPlayer().create();
                this.dash.initialize(this.$video, src, false);
                _context2.next = 26;
                break;

              case 18:
                http = new XMLHttpRequest();
                http.open('Get', src);
                http.send();
                _context2.next = 23;
                return new Promise(function (resolve) {
                  http.onreadystatechange = function () {
                    if (http.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
                      if (http.status === 200) {
                        resolve(http.getResponseHeader('Content-Type'));
                      } else {
                        resolve(null);
                      }

                      http.abort();
                    }
                  };
                });

              case 23:
                contentType = _context2.sent;
                console.log({
                  contentType: contentType
                });

                if (contentType && this.$video.canPlayType(contentType)) {
                  this.options.src = this.$video.src = src;
                }

              case 26:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getContentType() {
        return _getContentType.apply(this, arguments);
      }

      return getContentType;
    }()
  }, {
    key: "toggleFullScreen",
    value: function () {
      var _toggleFullScreen = player_asyncToGenerator(
      /*#__PURE__*/
      regenerator_default.a.mark(function _callee3() {
        return regenerator_default.a.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                this.isFullScreen = !this.isFullScreen;

                if (!this.isFullScreen) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 4;
                return this.$root.requestFullscreen();

              case 4:
                _context3.next = 8;
                break;

              case 6:
                _context3.next = 8;
                return document.exitFullscreen();

              case 8:
                this.resize();

              case 9:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function toggleFullScreen() {
        return _toggleFullScreen.apply(this, arguments);
      }

      return toggleFullScreen;
    }()
  }, {
    key: "destroy",
    value: function destroy() {
      Player.instances.splice(Player.instances.indexOf(this), 1);
      this.ui.destroy();

      if (this.hls) {
        this.hls.detachMedia();
      }

      if (this.dash) {
        this.dash.reset();
      }

      if (this.$style) {
        this.$style.remove();
      }
    }
  }, {
    key: "width",
    get: function get() {
      return this.$root.clientWidth;
    }
  }, {
    key: "height",
    get: function get() {
      return this.$root.clientHeight;
    }
  }, {
    key: "loading",
    get: function get() {
      return this._loading;
    }
  }, {
    key: "currentTime",
    get: function get() {
      return this.$video.currentTime;
    }
  }, {
    key: "paused",
    get: function get() {
      return this._paused;
    }
  }, {
    key: "debug",
    get: function get() {
      var quality = '默认';
      var src = this.options.src;

      if (this.hls) {
        if (this.ui.qualitySelector.currentLevel === -1) {
          quality = '自动 ';
        } else {
          quality = '';
        }

        if (this.hls.currentLevel !== -1) {
          quality += this.hls.levels[this.hls.currentLevel].name + 'P';
        }
      }

      var type = 'native';

      if (this.type === VideoType.Normal) {
        type = 'native';
      } else if (this.type === VideoType.Dash) {
        type = 'dash.js';
      } else {
        type = 'hls.js';
      }

      return {
        width: this.width,
        height: this.height,
        type: type,
        src: src,
        quality: quality,
        ui: this.ui.debug
      };
    }
  }]);

  return Player;
}();
player_Player.instances = [];
// CONCATENATED MODULE: ./src/player/index.ts




/* harmony default export */ var src_player = ({
  Player: player_Player,
  MakeDanmakuOptions: MakeDanmakuOptions,
  MakeDanmakuLayerOptions: MakeDanmakuLayerOptions,
  Danmaku: Danmaku,
  DanmakuDrawer: DanmakuDrawer,
  DanmakuType: DanmakuType
});
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src_player);



/***/ })

/******/ })["default"];
});
//# sourceMappingURL=danplayer.umd.js.map