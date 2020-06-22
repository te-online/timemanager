(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	}; // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028


	var global_1 = // eslint-disable-next-line no-undef
	check(typeof globalThis == 'object' && globalThis) || check(typeof window == 'object' && window) || check(typeof self == 'object' && self) || check(typeof commonjsGlobal == 'object' && commonjsGlobal) || // eslint-disable-next-line no-new-func
	Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty


	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, {
	    get: function () {
	      return 7;
	    }
	  })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
	  1: 2
	}, 1); // `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split; // fallback for non-array-like ES3 and non-enumerable old V8 strings

	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings




	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string


	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document; // typeof document.createElement is 'object' in old IE

	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty


	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () {
	      return 7;
	    }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) {
	    /* empty */
	  }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  }

	  return it;
	};

	var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty

	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) {
	    /* empty */
	  }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  }

	  return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});
	var sharedStore = store;

	var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;
	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;

	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    }

	    return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;

	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };

	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;

	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };

	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };

	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');
	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;

	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }

	  if (O === global_1) {
	    if (simple) O[key] = value;else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }

	  if (simple) O[key] = value;else createNonEnumerableProperty(O, key, value); // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace]) : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor; // `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger

	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min; // `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength

	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min; // Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).

	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation


	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value; // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare

	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++]; // eslint-disable-next-line no-self-compare

	      if (value != value) return true; // Array#indexOf ignores holes, Array#includes - not
	    } else for (; length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    }
	    return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;



	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;

	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key); // Don't enum bug & hidden keys


	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }

	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = ['constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'toLocaleString', 'toString', 'valueOf'];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype'); // `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames

	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols


	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;

	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true : value == NATIVE ? false : typeof detection == 'function' ? fails(detection) : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';
	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;










	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/


	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;

	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }

	  if (target) for (key in source) {
	    sourceProperty = source[key];

	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];

	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced); // contained in target

	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    } // add a flag to not completely full polyfills


	    if (options.sham || targetProperty && targetProperty.sham) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    } // extend global


	    redefine(target, key, sourceProperty, options);
	  }
	};

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  }

	  return it;
	};

	// optional / simple context binding


	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;

	  switch (length) {
	    case 0:
	      return function () {
	        return fn.call(that);
	      };

	    case 1:
	      return function (a) {
	        return fn.call(that, a);
	      };

	    case 2:
	      return function (a, b) {
	        return fn.call(that, a, b);
	      };

	    case 3:
	      return function (a, b, c) {
	        return fn.call(that, a, b, c);
	      };
	  }

	  return function ()
	  /* ...args */
	  {
	    return fn.apply(that, arguments);
	  };
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject


	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray


	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol // eslint-disable-next-line no-undef
	&& !Symbol.sham // eslint-disable-next-line no-undef
	&& typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  }

	  return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate

	var arraySpeciesCreate = function (originalArray, length) {
	  var C;

	  if (isArray(originalArray)) {
	    C = originalArray.constructor; // cross-realm fallback

	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  }

	  return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push; // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation

	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;

	    for (; length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);

	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	            case 3:
	              return true;
	            // some

	            case 5:
	              return value;
	            // find

	            case 6:
	              return index;
	            // findIndex

	            case 2:
	              push.call(target, value);
	            // filter
	          } else if (IS_EVERY) return false; // every
	      }
	    }

	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () {
	      throw 1;
	    }, 1);
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) {
	  throw it;
	};

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;
	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = {
	      length: -1
	    };
	    if (ACCESSORS) defineProperty(O, 1, {
	      enumerable: true,
	      get: thrower
	    });else O[1] = 1;
	    method.call(O, argument0, argument1);
	  });
	};

	var $forEach = arrayIteration.forEach;





	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH = arrayMethodUsesToLength('forEach'); // `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach

	var arrayForEach = !STRICT_METHOD || !USES_TO_LENGTH ? function forEach(callbackfn
	/* , thisArg */
	) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach


	_export({
	  target: 'Array',
	  proto: true,
	  forced: [].forEach != arrayForEach
	}, {
	  forEach: arrayForEach
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype; // some Chrome versions have non-configurable methods on DOMTokenList

	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }

	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}

	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	        args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);

	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }

	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }

	      _next(undefined);
	    });
	  };
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys$1(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$1(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}

	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };

	  return _setPrototypeOf(o, p);
	}

	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;

	  try {
	    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}

	function _assertThisInitialized(self) {
	  if (self === void 0) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return self;
	}

	function _possibleConstructorReturn(self, call) {
	  if (call && (typeof call === "object" || typeof call === "function")) {
	    return call;
	  }

	  return _assertThisInitialized(self);
	}

	function _createSuper(Derived) {
	  var hasNativeReflectConstruct = _isNativeReflectConstruct();

	  return function _createSuperInternal() {
	    var Super = _getPrototypeOf(Derived),
	        result;

	    if (hasNativeReflectConstruct) {
	      var NewTarget = _getPrototypeOf(this).constructor;

	      result = Reflect.construct(Super, arguments, NewTarget);
	    } else {
	      result = Super.apply(this, arguments);
	    }

	    return _possibleConstructorReturn(this, result);
	  };
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
	}

	function _arrayWithHoles(arr) {
	  if (Array.isArray(arr)) return arr;
	}

	function _iterableToArrayLimit(arr, i) {
	  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;
	  var _e = undefined;

	  try {
	    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}

	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

	  return arr2;
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _createForOfIteratorHelper(o, allowArrayLike) {
	  var it;

	  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
	    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	      if (it) o = it;
	      var i = 0;

	      var F = function () {};

	      return {
	        s: F,
	        n: function () {
	          if (i >= o.length) return {
	            done: true
	          };
	          return {
	            done: false,
	            value: o[i++]
	          };
	        },
	        e: function (e) {
	          throw e;
	        },
	        f: F
	      };
	    }

	    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	  }

	  var normalCompletion = true,
	      didErr = false,
	      err;
	  return {
	    s: function () {
	      it = o[Symbol.iterator]();
	    },
	    n: function () {
	      var step = it.next();
	      normalCompletion = step.done;
	      return step;
	    },
	    e: function (e) {
	      didErr = true;
	      err = e;
	    },
	    f: function () {
	      try {
	        if (!normalCompletion && it.return != null) it.return();
	      } finally {
	        if (didErr) throw err;
	      }
	    }
	  };
	}

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));else object[propertyKey] = value;
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);

	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};

	    constructor[SPECIES$1] = function () {
	      return {
	        foo: 1
	      };
	    };

	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
	var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded'; // We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679

	var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});
	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray(O);
	};

	var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT; // `Array.prototype.concat` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: FORCED
	}, {
	  concat: function concat(arg) {
	    // eslint-disable-line no-unused-vars
	    var O = toObject(this);
	    var A = arraySpeciesCreate(O, 0);
	    var n = 0;
	    var i, k, length, len, E;

	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];

	      if (isConcatSpreadable(E)) {
	        len = toLength(E.length);
	        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);

	        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
	      } else {
	        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
	        createProperty(A, n++, E);
	      }
	    }

	    A.length = n;
	    return A;
	  }
	});

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$1 = arrayMethodUsesToLength('slice', {
	  ACCESSORS: true,
	  0: 0,
	  1: 2
	});
	var SPECIES$2 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max; // `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$1
	}, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length); // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible

	    var Constructor, result, n;

	    if (isArray(O)) {
	      Constructor = O.constructor; // cross-realm fallback

	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$2];
	        if (Constructor === null) Constructor = undefined;
	      }

	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }

	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));

	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);

	    result.length = n;
	    return result;
	  }
	});

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};
	test[TO_STRING_TAG] = 'z';
	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag'); // ES3 wrong here

	var CORRECT_ARGUMENTS = classofRaw(function () {
	  return arguments;
	}()) == 'Arguments'; // fallback for IE11 Script Access Denied error

	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) {
	    /* empty */
	  }
	}; // getting tag from ES6+ `Object.prototype.toString`


	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null' // @@toStringTag case
	  : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag // builtinTag case
	  : CORRECT_ARGUMENTS ? classofRaw(O) // ES3 arguments fallback
	  : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring


	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring


	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, {
	    unsafe: true
	  });
	}

	var nativePromiseConstructor = global_1.Promise;

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);

	  return target;
	};

	var defineProperty$1 = objectDefineProperty.f;





	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
	    defineProperty$1(it, TO_STRING_TAG$2, {
	      configurable: true,
	      value: TAG
	    });
	  }
	};

	var SPECIES$3 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
	    defineProperty(Constructor, SPECIES$3, {
	      configurable: true,
	      get: function () {
	        return this;
	      }
	    });
	  }
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  }

	  return it;
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype = Array.prototype; // check on default Array iterator

	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR] === it);
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1] || it['@@iterator'] || iterators[classof(it)];
	};

	// call something on iterator step with safe closing on error


	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value); // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterate_1 = createCommonjsModule(function (module) {
	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
	  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
	  var iterator, iterFn, index, length, result, next, step;

	  if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod(iterable);
	    if (typeof iterFn != 'function') throw TypeError('Target is not iterable'); // optimisation for array iterators

	    if (isArrayIteratorMethod(iterFn)) {
	      for (index = 0, length = toLength(iterable.length); length > index; index++) {
	        result = AS_ENTRIES ? boundFunction(anObject(step = iterable[index])[0], step[1]) : boundFunction(iterable[index]);
	        if (result && result instanceof Result) return result;
	      }

	      return new Result(false);
	    }

	    iterator = iterFn.call(iterable);
	  }

	  next = iterator.next;

	  while (!(step = next.call(iterator)).done) {
	    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
	    if (typeof result == 'object' && result && result instanceof Result) return result;
	  }

	  return new Result(false);
	};

	iterate.stop = function (result) {
	  return new Result(true, result);
	};
	});

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return {
	        done: !!called++
	      };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };

	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  }; // eslint-disable-next-line no-throw-literal


	  Array.from(iteratorWithReturn, function () {
	    throw 2;
	  });
	} catch (error) {
	  /* empty */
	}

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;

	  try {
	    var object = {};

	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return {
	            done: ITERATION_SUPPORT = true
	          };
	        }
	      };
	    };

	    exec(object);
	  } catch (error) {
	    /* empty */
	  }

	  return ITERATION_SUPPORT;
	};

	var SPECIES$4 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor

	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var html = getBuiltIn('document', 'documentElement');

	var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

	var location$1 = global_1.location;
	var set$1 = global_1.setImmediate;
	var clear = global_1.clearImmediate;
	var process$1 = global_1.process;
	var MessageChannel = global_1.MessageChannel;
	var Dispatch = global_1.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;

	var run = function (id) {
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global_1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
	}; // Node.js 0.9+ & IE10+ has setImmediate, otherwise:


	if (!set$1 || !clear) {
	  set$1 = function setImmediate(fn) {
	    var args = [];
	    var i = 1;

	    while (arguments.length > i) args.push(arguments[i++]);

	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
	    };

	    defer(counter);
	    return counter;
	  };

	  clear = function clearImmediate(id) {
	    delete queue[id];
	  }; // Node.js 0.8-


	  if (classofRaw(process$1) == 'process') {
	    defer = function (id) {
	      process$1.nextTick(runner(id));
	    }; // Sphere (JS game engine) Dispatch API

	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    }; // Browsers with MessageChannel, includes WebWorkers
	    // except iOS - https://github.com/zloirock/core-js/issues/624

	  } else if (MessageChannel && !engineIsIos) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = functionBindContext(port.postMessage, port, 1); // Browsers with postMessage, skip WebWorkers
	    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post) && location$1.protocol !== 'file:') {
	    defer = post;
	    global_1.addEventListener('message', listener, false); // IE8-
	  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
	    defer = function (id) {
	      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    }; // Rest old browsers

	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task = {
	  set: set$1,
	  clear: clear
	};

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;



	var macrotask = task.set;



	var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
	var process$2 = global_1.process;
	var Promise$1 = global_1.Promise;
	var IS_NODE = classofRaw(process$2) == 'process'; // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`

	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
	var flush, head, last, notify, toggle, node, promise, then; // modern engines have queueMicrotask method

	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE && (parent = process$2.domain)) parent.exit();

	    while (head) {
	      fn = head.fn;
	      head = head.next;

	      try {
	        fn();
	      } catch (error) {
	        if (head) notify();else last = undefined;
	        throw error;
	      }
	    }

	    last = undefined;
	    if (parent) parent.enter();
	  }; // Node.js


	  if (IS_NODE) {
	    notify = function () {
	      process$2.nextTick(flush);
	    }; // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339

	  } else if (MutationObserver && !engineIsIos) {
	    toggle = true;
	    node = document.createTextNode('');
	    new MutationObserver(flush).observe(node, {
	      characterData: true
	    });

	    notify = function () {
	      node.data = toggle = !toggle;
	    }; // environments with maybe non-completely correct, but existent Promise

	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    then = promise.then;

	    notify = function () {
	      then.call(promise, flush);
	    }; // for other environments - macrotask based on:
	    // - setImmediate
	    // - MessageChannel
	    // - window.postMessag
	    // - onreadystatechange
	    // - setTimeout

	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global_1, flush);
	    };
	  }
	}

	var microtask = queueMicrotask || function (fn) {
	  var task = {
	    fn: fn,
	    next: undefined
	  };
	  if (last) last.next = task;

	  if (!head) {
	    head = task;
	    notify();
	  }

	  last = task;
	};

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	}; // 25.4.1.5 NewPromiseCapability(C)


	var f$5 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$5
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var hostReportErrors = function (a, b) {
	  var console = global_1.console;

	  if (console && console.error) {
	    arguments.length === 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform = function (exec) {
	  try {
	    return {
	      error: false,
	      value: exec()
	    };
	  } catch (error) {
	    return {
	      error: true,
	      value: error
	    };
	  }
	};

	var task$1 = task.set;



















	var SPECIES$5 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var TypeError$1 = global_1.TypeError;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$3) == 'process';
	var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;
	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;
	var FORCED$1 = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);

	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true; // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test

	    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
	  } // We need Promise#finally in the pure version for preventing prototype pollution
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679

	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false; // Detect correctness of subclassing with @@species support

	  var promise = PromiseConstructor.resolve(1);

	  var FakePromise = function (exec) {
	    exec(function () {
	      /* empty */
	    }, function () {
	      /* empty */
	    });
	  };

	  var constructor = promise.constructor = {};
	  constructor[SPECIES$5] = FakePromise;
	  return !(promise.then(function () {
	    /* empty */
	  }) instanceof FakePromise);
	});
	var INCORRECT_ITERATION = FORCED$1 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () {
	    /* empty */
	  });
	}); // helpers

	var isThenable = function (it) {
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};

	var notify$1 = function (promise, state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  var chain = state.reactions;
	  microtask(function () {
	    var value = state.value;
	    var ok = state.state == FULFILLED;
	    var index = 0; // variable length - can't use forEach

	    while (chain.length > index) {
	      var reaction = chain[index++];
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;

	      try {
	        if (handler) {
	          if (!ok) {
	            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
	            state.rejection = HANDLED;
	          }

	          if (handler === true) result = value;else {
	            if (domain) domain.enter();
	            result = handler(value); // can throw

	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }

	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (error) {
	        if (domain && !exited) domain.exit();
	        reject(error);
	      }
	    }

	    state.reactions = [];
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(promise, state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;

	  if (DISPATCH_EVENT) {
	    event = document$2.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global_1.dispatchEvent(event);
	  } else event = {
	    promise: promise,
	    reason: reason
	  };

	  if (handler = global_1['on' + name]) handler(event);else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;

	    if (IS_UNHANDLED) {
	      result = perform(function () {
	        if (IS_NODE$1) {
	          process$3.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      }); // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should

	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (promise, state) {
	  task$1.call(global_1, function () {
	    if (IS_NODE$1) {
	      process$3.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind = function (fn, promise, state, unwrap) {
	  return function (value) {
	    fn(promise, state, value, unwrap);
	  };
	};

	var internalReject = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify$1(promise, state, true);
	};

	var internalResolve = function (promise, state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;

	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    var then = isThenable(value);

	    if (then) {
	      microtask(function () {
	        var wrapper = {
	          done: false
	        };

	        try {
	          then.call(value, bind(internalResolve, promise, wrapper, state), bind(internalReject, promise, wrapper, state));
	        } catch (error) {
	          internalReject(promise, wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify$1(promise, state, false);
	    }
	  } catch (error) {
	    internalReject(promise, {
	      done: false
	    }, error, state);
	  }
	}; // constructor polyfill


	if (FORCED$1) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal.call(this);
	    var state = getInternalState(this);

	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  }; // eslint-disable-next-line no-unused-vars


	  Internal = function Promise(executor) {
	    setInternalState(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };

	  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });

	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalState(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };

	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper ? new OwnPromiseCapability(C) : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then; // wrap native Promise#then for native async functions

	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected); // https://github.com/zloirock/core-js/issues/640
	    }, {
	      unsafe: true
	    }); // wrap fetch result

	    if (typeof $fetch == 'function') _export({
	      global: true,
	      enumerable: true,
	      forced: true
	    }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input
	      /* , init */
	      ) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({
	  global: true,
	  wrap: true,
	  forced: FORCED$1
	}, {
	  Promise: PromiseConstructor
	});
	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);
	PromiseWrapper = getBuiltIn(PROMISE); // statics

	_export({
	  target: PROMISE,
	  stat: true,
	  forced: FORCED$1
	}, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});
	_export({
	  target: PROMISE,
	  stat: true,
	  forced:  FORCED$1
	}, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});
	_export({
	  target: PROMISE,
	  stat: true,
	  forced: INCORRECT_ITERATION
	}, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var runtime_1 = createCommonjsModule(function (module) {
	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */
	var runtime = function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.

	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
	    var generator = Object.create(protoGenerator.prototype);
	    var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
	    // .throw, and .return methods.

	    generator._invoke = makeInvokeMethod(innerFn, self, context);
	    return generator;
	  }

	  exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
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
	      return {
	        type: "normal",
	        arg: fn.call(obj, arg)
	      };
	    } catch (err) {
	      return {
	        type: "throw",
	        arg: err
	      };
	    }
	  }

	  var GenStateSuspendedStart = "suspendedStart";
	  var GenStateSuspendedYield = "suspendedYield";
	  var GenStateExecuting = "executing";
	  var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
	  // breaking out of the dispatch switch statement.

	  var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
	  // .constructor.prototype properties for functions that return Generator
	  // objects. For full spec compliance, you may wish to configure your
	  // minifier not to mangle the names of these two functions.

	  function Generator() {}

	  function GeneratorFunction() {}

	  function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
	  // don't natively support it.


	  var IteratorPrototype = {};

	  IteratorPrototype[iteratorSymbol] = function () {
	    return this;
	  };

	  var getProto = Object.getPrototypeOf;
	  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

	  if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
	    // This environment has a native %IteratorPrototype%; use it instead
	    // of the polyfill.
	    IteratorPrototype = NativeIteratorPrototype;
	  }

	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
	  GeneratorFunctionPrototype.constructor = GeneratorFunction;
	  GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.

	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      prototype[method] = function (arg) {
	        return this._invoke(method, arg);
	      };
	    });
	  }

	  exports.isGeneratorFunction = function (genFun) {
	    var ctor = typeof genFun === "function" && genFun.constructor;
	    return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
	    // do is to check its .name property.
	    (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
	  };

	  exports.mark = function (genFun) {
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
	  }; // Within the body of any async function, `await x` is transformed to
	  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
	  // `hasOwn.call(value, "__await")` to determine if the yielded value is
	  // meant to be awaited.


	  exports.awrap = function (arg) {
	    return {
	      __await: arg
	    };
	  };

	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);

	      if (record.type === "throw") {
	        reject(record.arg);
	      } else {
	        var result = record.arg;
	        var value = result.value;

	        if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
	          return PromiseImpl.resolve(value.__await).then(function (value) {
	            invoke("next", value, resolve, reject);
	          }, function (err) {
	            invoke("throw", err, resolve, reject);
	          });
	        }

	        return PromiseImpl.resolve(value).then(function (unwrapped) {
	          // When a yielded Promise is resolved, its final value becomes
	          // the .value of the Promise<{value,done}> result for the
	          // current iteration.
	          result.value = unwrapped;
	          resolve(result);
	        }, function (error) {
	          // If a rejected Promise was yielded, throw the rejection back
	          // into the async generator function so it can be handled there.
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	    }

	    var previousPromise;

	    function enqueue(method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function (resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }

	      return previousPromise = // If enqueue has been called before, then we want to wait until
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
	      previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
	      // invocations of the iterator.
	      callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	    } // Define the unified helper method that is used to implement .next,
	    // .throw, and .return (see defineIteratorMethods).


	    this._invoke = enqueue;
	  }

	  defineIteratorMethods(AsyncIterator.prototype);

	  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
	    return this;
	  };

	  exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
	  // AsyncIterator objects; they just return a Promise for the value of
	  // the final result produced by the iterator.

	  exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    if (PromiseImpl === void 0) PromiseImpl = Promise;
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
	    return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
	    : iter.next().then(function (result) {
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
	        } // Be forgiving, per 25.3.3.3.3 of the spec:
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
	          state = context.done ? GenStateCompleted : GenStateSuspendedYield;

	          if (record.arg === ContinueSentinel) {
	            continue;
	          }

	          return {
	            value: record.arg,
	            done: context.done
	          };
	        } else if (record.type === "throw") {
	          state = GenStateCompleted; // Dispatch the exception by looping back around to the
	          // context.dispatchException(context.arg) call above.

	          context.method = "throw";
	          context.arg = record.arg;
	        }
	      }
	    };
	  } // Call delegate.iterator[context.method](context.arg) and handle the
	  // result, either by returning a { value, done } result from the
	  // delegate iterator, or by modifying context.method and context.arg,
	  // setting context.delegate to null, and returning the ContinueSentinel.


	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];

	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
	          maybeInvokeDelegate(delegate, context);

	          if (context.method === "throw") {
	            // If maybeInvokeDelegate(context) changed context.method from
	            // "return" to "throw", let that override the TypeError below.
	            return ContinueSentinel;
	          }
	        }

	        context.method = "throw";
	        context.arg = new TypeError("The iterator does not provide a 'throw' method");
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

	    if (!info) {
	      context.method = "throw";
	      context.arg = new TypeError("iterator result is not an object");
	      context.delegate = null;
	      return ContinueSentinel;
	    }

	    if (info.done) {
	      // Assign the result of the finished delegate to the temporary
	      // variable specified by delegate.resultName (see delegateYield).
	      context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

	      context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
	      // exception, let the outer generator proceed normally. If
	      // context.method was "next", forget context.arg since it has been
	      // "consumed" by the delegate iterator. If context.method was
	      // "return", allow the original .return call to continue in the
	      // outer generator.

	      if (context.method !== "return") {
	        context.method = "next";
	        context.arg = undefined$1;
	      }
	    } else {
	      // Re-yield the result returned by the delegate method.
	      return info;
	    } // The delegate iterator is finished, so forget it and continue with
	    // the outer generator.


	    context.delegate = null;
	    return ContinueSentinel;
	  } // Define Generator.prototype.{next,throw,return} in terms of the
	  // unified ._invoke helper method.


	  defineIteratorMethods(Gp);
	  Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.

	  Gp[iteratorSymbol] = function () {
	    return this;
	  };

	  Gp.toString = function () {
	    return "[object Generator]";
	  };

	  function pushTryEntry(locs) {
	    var entry = {
	      tryLoc: locs[0]
	    };

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
	    this.tryEntries = [{
	      tryLoc: "root"
	    }];
	    tryLocsList.forEach(pushTryEntry, this);
	    this.reset(true);
	  }

	  exports.keys = function (object) {
	    var keys = [];

	    for (var key in object) {
	      keys.push(key);
	    }

	    keys.reverse(); // Rather than returning an object with a next method, we keep
	    // things simple and return the next function itself.

	    return function next() {
	      while (keys.length) {
	        var key = keys.pop();

	        if (key in object) {
	          next.value = key;
	          next.done = false;
	          return next;
	        }
	      } // To avoid creating an additional object, we just hang the .value
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
	        var i = -1,
	            next = function next() {
	          while (++i < iterable.length) {
	            if (hasOwn.call(iterable, i)) {
	              next.value = iterable[i];
	              next.done = false;
	              return next;
	            }
	          }

	          next.value = undefined$1;
	          next.done = true;
	          return next;
	        };

	        return next.next = next;
	      }
	    } // Return an iterator with no values.


	    return {
	      next: doneResult
	    };
	  }

	  exports.values = values;

	  function doneResult() {
	    return {
	      value: undefined$1,
	      done: true
	    };
	  }

	  Context.prototype = {
	    constructor: Context,
	    reset: function (skipTempReset) {
	      this.prev = 0;
	      this.next = 0; // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.

	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;
	      this.method = "next";
	      this.arg = undefined$1;
	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
	          }
	        }
	      }
	    },
	    stop: function () {
	      this.done = true;
	      var rootEntry = this.tryEntries[0];
	      var rootRecord = rootEntry.completion;

	      if (rootRecord.type === "throw") {
	        throw rootRecord.arg;
	      }

	      return this.rval;
	    },
	    dispatchException: function (exception) {
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
	          context.arg = undefined$1;
	        }

	        return !!caught;
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
	    abrupt: function (type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];

	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }

	      if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
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
	    complete: function (record, afterLoc) {
	      if (record.type === "throw") {
	        throw record.arg;
	      }

	      if (record.type === "break" || record.type === "continue") {
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
	    finish: function (finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];

	        if (entry.finallyLoc === finallyLoc) {
	          this.complete(entry.completion, entry.afterLoc);
	          resetTryEntry(entry);
	          return ContinueSentinel;
	        }
	      }
	    },
	    "catch": function (tryLoc) {
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
	      } // The context.catch method must only be called with a location
	      // argument that corresponds to a known catch block.


	      throw new Error("illegal catch attempt");
	    },
	    delegateYield: function (iterable, resultName, nextLoc) {
	      this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      };

	      if (this.method === "next") {
	        // Deliberately forget the last sent value so that we don't
	        // accidentally pass it on to the delegate.
	        this.arg = undefined$1;
	      }

	      return ContinueSentinel;
	    }
	  }; // Regardless of whether this script is executing as a CommonJS module
	  // or not, return the runtime object so that we can declare the variable
	  // regeneratorRuntime in the outer scope, which allows this module to be
	  // injected easily by `bin/regenerator --include-runtime script.js`.

	  return exports;
	}( // If this script is executing as a CommonJS module, use module.exports
	// as the regeneratorRuntime namespace. Otherwise create a new empty
	// object. Either way, the resulting object will be used to initialize
	// the regeneratorRuntime variable at the top of this file.
	 module.exports );

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
	});

	function noop() { }
	function assign(tar, src) {
	    // @ts-ignore
	    for (const k in src)
	        tar[k] = src[k];
	    return tar;
	}
	function run$1(fn) {
	    return fn();
	}
	function blank_object() {
	    return Object.create(null);
	}
	function run_all(fns) {
	    fns.forEach(run$1);
	}
	function is_function(thing) {
	    return typeof thing === 'function';
	}
	function safe_not_equal(a, b) {
	    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}
	function create_slot(definition, ctx, $$scope, fn) {
	    if (definition) {
	        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
	        return definition[0](slot_ctx);
	    }
	}
	function get_slot_context(definition, ctx, $$scope, fn) {
	    return definition[1] && fn
	        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
	        : $$scope.ctx;
	}
	function get_slot_changes(definition, $$scope, dirty, fn) {
	    if (definition[2] && fn) {
	        const lets = definition[2](fn(dirty));
	        if ($$scope.dirty === undefined) {
	            return lets;
	        }
	        if (typeof lets === 'object') {
	            const merged = [];
	            const len = Math.max($$scope.dirty.length, lets.length);
	            for (let i = 0; i < len; i += 1) {
	                merged[i] = $$scope.dirty[i] | lets[i];
	            }
	            return merged;
	        }
	        return $$scope.dirty | lets;
	    }
	    return $$scope.dirty;
	}
	function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
	    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
	    if (slot_changes) {
	        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
	        slot.p(slot_context, slot_changes);
	    }
	}

	function append(target, node) {
	    target.appendChild(node);
	}
	function insert(target, node, anchor) {
	    target.insertBefore(node, anchor || null);
	}
	function detach(node) {
	    node.parentNode.removeChild(node);
	}
	function destroy_each(iterations, detaching) {
	    for (let i = 0; i < iterations.length; i += 1) {
	        if (iterations[i])
	            iterations[i].d(detaching);
	    }
	}
	function element(name) {
	    return document.createElement(name);
	}
	function text(data) {
	    return document.createTextNode(data);
	}
	function space() {
	    return text(' ');
	}
	function empty() {
	    return text('');
	}
	function listen(node, event, handler, options) {
	    node.addEventListener(event, handler, options);
	    return () => node.removeEventListener(event, handler, options);
	}
	function prevent_default(fn) {
	    return function (event) {
	        event.preventDefault();
	        // @ts-ignore
	        return fn.call(this, event);
	    };
	}
	function attr(node, attribute, value) {
	    if (value == null)
	        node.removeAttribute(attribute);
	    else if (node.getAttribute(attribute) !== value)
	        node.setAttribute(attribute, value);
	}
	function set_attributes(node, attributes) {
	    // @ts-ignore
	    const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
	    for (const key in attributes) {
	        if (attributes[key] == null) {
	            node.removeAttribute(key);
	        }
	        else if (key === 'style') {
	            node.style.cssText = attributes[key];
	        }
	        else if (key === '__value') {
	            node.value = node[key] = attributes[key];
	        }
	        else if (descriptors[key] && descriptors[key].set) {
	            node[key] = attributes[key];
	        }
	        else {
	            attr(node, key, attributes[key]);
	        }
	    }
	}
	function set_custom_element_data(node, prop, value) {
	    if (prop in node) {
	        node[prop] = value;
	    }
	    else {
	        attr(node, prop, value);
	    }
	}
	function to_number(value) {
	    return value === '' ? undefined : +value;
	}
	function children(element) {
	    return Array.from(element.childNodes);
	}
	function set_data(text, data) {
	    data = '' + data;
	    if (text.data !== data)
	        text.data = data;
	}
	function set_input_value(input, value) {
	    input.value = value == null ? '' : value;
	}
	function set_style(node, key, value, important) {
	    node.style.setProperty(key, value, important ? 'important' : '');
	}
	// unfortunately this can't be a constant as that wouldn't be tree-shakeable
	// so we cache the result instead
	let crossorigin;
	function is_crossorigin() {
	    if (crossorigin === undefined) {
	        crossorigin = false;
	        try {
	            if (typeof window !== 'undefined' && window.parent) {
	                void window.parent.document;
	            }
	        }
	        catch (error) {
	            crossorigin = true;
	        }
	    }
	    return crossorigin;
	}
	function add_resize_listener(node, fn) {
	    const computed_style = getComputedStyle(node);
	    const z_index = (parseInt(computed_style.zIndex) || 0) - 1;
	    if (computed_style.position === 'static') {
	        node.style.position = 'relative';
	    }
	    const iframe = element('iframe');
	    iframe.setAttribute('style', `display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ` +
	        `overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: ${z_index};`);
	    iframe.setAttribute('aria-hidden', 'true');
	    iframe.tabIndex = -1;
	    const crossorigin = is_crossorigin();
	    let unsubscribe;
	    if (crossorigin) {
	        iframe.src = `data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>`;
	        unsubscribe = listen(window, 'message', (event) => {
	            if (event.source === iframe.contentWindow)
	                fn();
	        });
	    }
	    else {
	        iframe.src = 'about:blank';
	        iframe.onload = () => {
	            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
	        };
	    }
	    append(node, iframe);
	    return () => {
	        if (crossorigin) {
	            unsubscribe();
	        }
	        else if (unsubscribe && iframe.contentWindow) {
	            unsubscribe();
	        }
	        detach(iframe);
	    };
	}
	function toggle_class(element, name, toggle) {
	    element.classList[toggle ? 'add' : 'remove'](name);
	}
	function custom_event(type, detail) {
	    const e = document.createEvent('CustomEvent');
	    e.initCustomEvent(type, false, false, detail);
	    return e;
	}
	class HtmlTag {
	    constructor(anchor = null) {
	        this.a = anchor;
	        this.e = this.n = null;
	    }
	    m(html, target, anchor = null) {
	        if (!this.e) {
	            this.e = element(target.nodeName);
	            this.t = target;
	            this.h(html);
	        }
	        this.i(anchor);
	    }
	    h(html) {
	        this.e.innerHTML = html;
	        this.n = Array.from(this.e.childNodes);
	    }
	    i(anchor) {
	        for (let i = 0; i < this.n.length; i += 1) {
	            insert(this.t, this.n[i], anchor);
	        }
	    }
	    p(html) {
	        this.d();
	        this.h(html);
	        this.i(this.a);
	    }
	    d() {
	        this.n.forEach(detach);
	    }
	}

	let current_component;
	function set_current_component(component) {
	    current_component = component;
	}
	function get_current_component() {
	    if (!current_component)
	        throw new Error(`Function called outside component initialization`);
	    return current_component;
	}
	function beforeUpdate(fn) {
	    get_current_component().$$.before_update.push(fn);
	}
	function onMount(fn) {
	    get_current_component().$$.on_mount.push(fn);
	}
	function onDestroy(fn) {
	    get_current_component().$$.on_destroy.push(fn);
	}
	function createEventDispatcher() {
	    const component = get_current_component();
	    return (type, detail) => {
	        const callbacks = component.$$.callbacks[type];
	        if (callbacks) {
	            // TODO are there situations where events could be dispatched
	            // in a server (non-DOM) environment?
	            const event = custom_event(type, detail);
	            callbacks.slice().forEach(fn => {
	                fn.call(component, event);
	            });
	        }
	    };
	}

	const dirty_components = [];
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];
	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	function schedule_update() {
	    if (!update_scheduled) {
	        update_scheduled = true;
	        resolved_promise.then(flush$1);
	    }
	}
	function tick() {
	    schedule_update();
	    return resolved_promise;
	}
	function add_render_callback(fn) {
	    render_callbacks.push(fn);
	}
	function add_flush_callback(fn) {
	    flush_callbacks.push(fn);
	}
	let flushing = false;
	const seen_callbacks = new Set();
	function flush$1() {
	    if (flushing)
	        return;
	    flushing = true;
	    do {
	        // first, call beforeUpdate functions
	        // and update components
	        for (let i = 0; i < dirty_components.length; i += 1) {
	            const component = dirty_components[i];
	            set_current_component(component);
	            update(component.$$);
	        }
	        dirty_components.length = 0;
	        while (binding_callbacks.length)
	            binding_callbacks.pop()();
	        // then, once components are updated, call
	        // afterUpdate functions. This may cause
	        // subsequent updates...
	        for (let i = 0; i < render_callbacks.length; i += 1) {
	            const callback = render_callbacks[i];
	            if (!seen_callbacks.has(callback)) {
	                // ...so guard against infinite loops
	                seen_callbacks.add(callback);
	                callback();
	            }
	        }
	        render_callbacks.length = 0;
	    } while (dirty_components.length);
	    while (flush_callbacks.length) {
	        flush_callbacks.pop()();
	    }
	    update_scheduled = false;
	    flushing = false;
	    seen_callbacks.clear();
	}
	function update($$) {
	    if ($$.fragment !== null) {
	        $$.update();
	        run_all($$.before_update);
	        const dirty = $$.dirty;
	        $$.dirty = [-1];
	        $$.fragment && $$.fragment.p($$.ctx, dirty);
	        $$.after_update.forEach(add_render_callback);
	    }
	}
	const outroing = new Set();
	let outros;
	function group_outros() {
	    outros = {
	        r: 0,
	        c: [],
	        p: outros // parent group
	    };
	}
	function check_outros() {
	    if (!outros.r) {
	        run_all(outros.c);
	    }
	    outros = outros.p;
	}
	function transition_in(block, local) {
	    if (block && block.i) {
	        outroing.delete(block);
	        block.i(local);
	    }
	}
	function transition_out(block, local, detach, callback) {
	    if (block && block.o) {
	        if (outroing.has(block))
	            return;
	        outroing.add(block);
	        outros.c.push(() => {
	            outroing.delete(block);
	            if (callback) {
	                if (detach)
	                    block.d(1);
	                callback();
	            }
	        });
	        block.o(local);
	    }
	}

	const globals = (typeof window !== 'undefined'
	    ? window
	    : typeof globalThis !== 'undefined'
	        ? globalThis
	        : global);
	function outro_and_destroy_block(block, lookup) {
	    transition_out(block, 1, 1, () => {
	        lookup.delete(block.key);
	    });
	}
	function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
	    let o = old_blocks.length;
	    let n = list.length;
	    let i = o;
	    const old_indexes = {};
	    while (i--)
	        old_indexes[old_blocks[i].key] = i;
	    const new_blocks = [];
	    const new_lookup = new Map();
	    const deltas = new Map();
	    i = n;
	    while (i--) {
	        const child_ctx = get_context(ctx, list, i);
	        const key = get_key(child_ctx);
	        let block = lookup.get(key);
	        if (!block) {
	            block = create_each_block(key, child_ctx);
	            block.c();
	        }
	        else if (dynamic) {
	            block.p(child_ctx, dirty);
	        }
	        new_lookup.set(key, new_blocks[i] = block);
	        if (key in old_indexes)
	            deltas.set(key, Math.abs(i - old_indexes[key]));
	    }
	    const will_move = new Set();
	    const did_move = new Set();
	    function insert(block) {
	        transition_in(block, 1);
	        block.m(node, next);
	        lookup.set(block.key, block);
	        next = block.first;
	        n--;
	    }
	    while (o && n) {
	        const new_block = new_blocks[n - 1];
	        const old_block = old_blocks[o - 1];
	        const new_key = new_block.key;
	        const old_key = old_block.key;
	        if (new_block === old_block) {
	            // do nothing
	            next = new_block.first;
	            o--;
	            n--;
	        }
	        else if (!new_lookup.has(old_key)) {
	            // remove old block
	            destroy(old_block, lookup);
	            o--;
	        }
	        else if (!lookup.has(new_key) || will_move.has(new_key)) {
	            insert(new_block);
	        }
	        else if (did_move.has(old_key)) {
	            o--;
	        }
	        else if (deltas.get(new_key) > deltas.get(old_key)) {
	            did_move.add(new_key);
	            insert(new_block);
	        }
	        else {
	            will_move.add(old_key);
	            o--;
	        }
	    }
	    while (o--) {
	        const old_block = old_blocks[o];
	        if (!new_lookup.has(old_block.key))
	            destroy(old_block, lookup);
	    }
	    while (n)
	        insert(new_blocks[n - 1]);
	    return new_blocks;
	}

	function get_spread_update(levels, updates) {
	    const update = {};
	    const to_null_out = {};
	    const accounted_for = { $$scope: 1 };
	    let i = levels.length;
	    while (i--) {
	        const o = levels[i];
	        const n = updates[i];
	        if (n) {
	            for (const key in o) {
	                if (!(key in n))
	                    to_null_out[key] = 1;
	            }
	            for (const key in n) {
	                if (!accounted_for[key]) {
	                    update[key] = n[key];
	                    accounted_for[key] = 1;
	                }
	            }
	            levels[i] = n;
	        }
	        else {
	            for (const key in o) {
	                accounted_for[key] = 1;
	            }
	        }
	    }
	    for (const key in to_null_out) {
	        if (!(key in update))
	            update[key] = undefined;
	    }
	    return update;
	}

	function bind$1(component, name, callback) {
	    const index = component.$$.props[name];
	    if (index !== undefined) {
	        component.$$.bound[index] = callback;
	        callback(component.$$.ctx[index]);
	    }
	}
	function create_component(block) {
	    block && block.c();
	}
	function mount_component(component, target, anchor) {
	    const { fragment, on_mount, on_destroy, after_update } = component.$$;
	    fragment && fragment.m(target, anchor);
	    // onMount happens before the initial afterUpdate
	    add_render_callback(() => {
	        const new_on_destroy = on_mount.map(run$1).filter(is_function);
	        if (on_destroy) {
	            on_destroy.push(...new_on_destroy);
	        }
	        else {
	            // Edge case - component was destroyed immediately,
	            // most likely as a result of a binding initialising
	            run_all(new_on_destroy);
	        }
	        component.$$.on_mount = [];
	    });
	    after_update.forEach(add_render_callback);
	}
	function destroy_component(component, detaching) {
	    const $$ = component.$$;
	    if ($$.fragment !== null) {
	        run_all($$.on_destroy);
	        $$.fragment && $$.fragment.d(detaching);
	        // TODO null out other refs, including component.$$ (but need to
	        // preserve final state?)
	        $$.on_destroy = $$.fragment = null;
	        $$.ctx = [];
	    }
	}
	function make_dirty(component, i) {
	    if (component.$$.dirty[0] === -1) {
	        dirty_components.push(component);
	        schedule_update();
	        component.$$.dirty.fill(0);
	    }
	    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
	}
	function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
	    const parent_component = current_component;
	    set_current_component(component);
	    const prop_values = options.props || {};
	    const $$ = component.$$ = {
	        fragment: null,
	        ctx: null,
	        // state
	        props,
	        update: noop,
	        not_equal,
	        bound: blank_object(),
	        // lifecycle
	        on_mount: [],
	        on_destroy: [],
	        before_update: [],
	        after_update: [],
	        context: new Map(parent_component ? parent_component.$$.context : []),
	        // everything else
	        callbacks: blank_object(),
	        dirty
	    };
	    let ready = false;
	    $$.ctx = instance
	        ? instance(component, prop_values, (i, ret, ...rest) => {
	            const value = rest.length ? rest[0] : ret;
	            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
	                if ($$.bound[i])
	                    $$.bound[i](value);
	                if (ready)
	                    make_dirty(component, i);
	            }
	            return ret;
	        })
	        : [];
	    $$.update();
	    ready = true;
	    run_all($$.before_update);
	    // `false` as a special case of no DOM component
	    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
	    if (options.target) {
	        if (options.hydrate) {
	            const nodes = children(options.target);
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.l(nodes);
	            nodes.forEach(detach);
	        }
	        else {
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            $$.fragment && $$.fragment.c();
	        }
	        if (options.intro)
	            transition_in(component.$$.fragment);
	        mount_component(component, options.target, options.anchor);
	        flush$1();
	    }
	    set_current_component(parent_component);
	}
	class SvelteComponent {
	    $destroy() {
	        destroy_component(this, 1);
	        this.$destroy = noop;
	    }
	    $on(type, callback) {
	        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
	        callbacks.push(callback);
	        return () => {
	            const index = callbacks.indexOf(callback);
	            if (index !== -1)
	                callbacks.splice(index, 1);
	        };
	    }
	    $set() {
	        // overridden by instance, if it has props
	    }
	}

	function toInteger$1(dirtyNumber) {
	  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
	    return NaN;
	  }

	  var number = Number(dirtyNumber);

	  if (isNaN(number)) {
	    return number;
	  }

	  return number < 0 ? Math.ceil(number) : Math.floor(number);
	}

	function requiredArgs(required, args) {
	  if (args.length < required) {
	    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
	  }
	}

	/**
	 * @name toDate
	 * @category Common Helpers
	 * @summary Convert the given argument to an instance of Date.
	 *
	 * @description
	 * Convert the given argument to an instance of Date.
	 *
	 * If the argument is an instance of Date, the function returns its clone.
	 *
	 * If the argument is a number, it is treated as a timestamp.
	 *
	 * If the argument is none of the above, the function returns Invalid Date.
	 *
	 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
	 *
	 * @param {Date|Number} argument - the value to convert
	 * @returns {Date} the parsed date in the local time zone
	 * @throws {TypeError} 1 argument required
	 *
	 * @example
	 * // Clone the date:
	 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
	 * //=> Tue Feb 11 2014 11:30:30
	 *
	 * @example
	 * // Convert the timestamp to date:
	 * const result = toDate(1392098430000)
	 * //=> Tue Feb 11 2014 11:30:30
	 */

	function toDate(argument) {
	  requiredArgs(1, arguments);
	  var argStr = Object.prototype.toString.call(argument); // Clone the date

	  if (argument instanceof Date || typeof argument === 'object' && argStr === '[object Date]') {
	    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
	    return new Date(argument.getTime());
	  } else if (typeof argument === 'number' || argStr === '[object Number]') {
	    return new Date(argument);
	  } else {
	    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
	      // eslint-disable-next-line no-console
	      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"); // eslint-disable-next-line no-console

	      console.warn(new Error().stack);
	    }

	    return new Date(NaN);
	  }
	}

	/**
	 * @name addDays
	 * @category Day Helpers
	 * @summary Add the specified number of days to the given date.
	 *
	 * @description
	 * Add the specified number of days to the given date.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the date to be changed
	 * @param {Number} amount - the amount of days to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
	 * @returns {Date} the new date with the days added
	 * @throws {TypeError} 2 arguments required
	 *
	 * @example
	 * // Add 10 days to 1 September 2014:
	 * var result = addDays(new Date(2014, 8, 1), 10)
	 * //=> Thu Sep 11 2014 00:00:00
	 */

	function addDays(dirtyDate, dirtyAmount) {
	  requiredArgs(2, arguments);
	  var date = toDate(dirtyDate);
	  var amount = toInteger$1(dirtyAmount);

	  if (isNaN(amount)) {
	    return new Date(NaN);
	  }

	  if (!amount) {
	    // If 0 days, no-op to avoid changing times in the hour before end of DST
	    return date;
	  }

	  date.setDate(date.getDate() + amount);
	  return date;
	}

	/**
	 * @name addMilliseconds
	 * @category Millisecond Helpers
	 * @summary Add the specified number of milliseconds to the given date.
	 *
	 * @description
	 * Add the specified number of milliseconds to the given date.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the date to be changed
	 * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
	 * @returns {Date} the new date with the milliseconds added
	 * @throws {TypeError} 2 arguments required
	 *
	 * @example
	 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
	 * var result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
	 * //=> Thu Jul 10 2014 12:45:30.750
	 */

	function addMilliseconds(dirtyDate, dirtyAmount) {
	  requiredArgs(2, arguments);
	  var timestamp = toDate(dirtyDate).getTime();
	  var amount = toInteger$1(dirtyAmount);
	  return new Date(timestamp + amount);
	}

	/**
	 * @name startOfWeek
	 * @category Week Helpers
	 * @summary Return the start of a week for the given date.
	 *
	 * @description
	 * Return the start of a week for the given date.
	 * The result will be in the local timezone.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the original date
	 * @param {Object} [options] - an object with options.
	 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
	 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @returns {Date} the start of a week
	 * @throws {TypeError} 1 argument required
	 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
	 *
	 * @example
	 * // The start of a week for 2 September 2014 11:55:00:
	 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Sun Aug 31 2014 00:00:00
	 *
	 * @example
	 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
	 * var result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
	 * //=> Mon Sep 01 2014 00:00:00
	 */

	function startOfWeek(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
	  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger$1(localeWeekStartsOn);
	  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger$1(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

	  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
	    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
	  }

	  var date = toDate(dirtyDate);
	  var day = date.getDay();
	  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
	  date.setDate(date.getDate() - diff);
	  date.setHours(0, 0, 0, 0);
	  return date;
	}

	var MILLISECONDS_IN_MINUTE = 60000;

	function getDateMillisecondsPart(date) {
	  return date.getTime() % MILLISECONDS_IN_MINUTE;
	}
	/**
	 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
	 * They usually appear for dates that denote time before the timezones were introduced
	 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
	 * and GMT+01:00:00 after that date)
	 *
	 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
	 * which would lead to incorrect calculations.
	 *
	 * This function returns the timezone offset in milliseconds that takes seconds in account.
	 */


	function getTimezoneOffsetInMilliseconds(dirtyDate) {
	  var date = new Date(dirtyDate.getTime());
	  var baseTimezoneOffset = Math.ceil(date.getTimezoneOffset());
	  date.setSeconds(0, 0);
	  var hasNegativeUTCOffset = baseTimezoneOffset > 0;
	  var millisecondsPartOfTimezoneOffset = hasNegativeUTCOffset ? (MILLISECONDS_IN_MINUTE + getDateMillisecondsPart(date)) % MILLISECONDS_IN_MINUTE : getDateMillisecondsPart(date);
	  return baseTimezoneOffset * MILLISECONDS_IN_MINUTE + millisecondsPartOfTimezoneOffset;
	}

	/**
	 * @name startOfDay
	 * @category Day Helpers
	 * @summary Return the start of a day for the given date.
	 *
	 * @description
	 * Return the start of a day for the given date.
	 * The result will be in the local timezone.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the original date
	 * @returns {Date} the start of a day
	 * @throws {TypeError} 1 argument required
	 *
	 * @example
	 * // The start of a day for 2 September 2014 11:55:00:
	 * var result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Tue Sep 02 2014 00:00:00
	 */

	function startOfDay(dirtyDate) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  date.setHours(0, 0, 0, 0);
	  return date;
	}

	/**
	 * @name addWeeks
	 * @category Week Helpers
	 * @summary Add the specified number of weeks to the given date.
	 *
	 * @description
	 * Add the specified number of week to the given date.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the date to be changed
	 * @param {Number} amount - the amount of weeks to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
	 * @returns {Date} the new date with the weeks added
	 * @throws {TypeError} 2 arguments required
	 *
	 * @example
	 * // Add 4 weeks to 1 September 2014:
	 * var result = addWeeks(new Date(2014, 8, 1), 4)
	 * //=> Mon Sep 29 2014 00:00:00
	 */

	function addWeeks(dirtyDate, dirtyAmount) {
	  requiredArgs(2, arguments);
	  var amount = toInteger$1(dirtyAmount);
	  var days = amount * 7;
	  return addDays(dirtyDate, days);
	}

	/**
	 * @name isValid
	 * @category Common Helpers
	 * @summary Is the given date valid?
	 *
	 * @description
	 * Returns false if argument is Invalid Date and true otherwise.
	 * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
	 * Invalid Date is a Date, whose time value is NaN.
	 *
	 * Time value of Date: http://es5.github.io/#x15.9.1.1
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * - Now `isValid` doesn't throw an exception
	 *   if the first argument is not an instance of Date.
	 *   Instead, argument is converted beforehand using `toDate`.
	 *
	 *   Examples:
	 *
	 *   | `isValid` argument        | Before v2.0.0 | v2.0.0 onward |
	 *   |---------------------------|---------------|---------------|
	 *   | `new Date()`              | `true`        | `true`        |
	 *   | `new Date('2016-01-01')`  | `true`        | `true`        |
	 *   | `new Date('')`            | `false`       | `false`       |
	 *   | `new Date(1488370835081)` | `true`        | `true`        |
	 *   | `new Date(NaN)`           | `false`       | `false`       |
	 *   | `'2016-01-01'`            | `TypeError`   | `false`       |
	 *   | `''`                      | `TypeError`   | `false`       |
	 *   | `1488370835081`           | `TypeError`   | `true`        |
	 *   | `NaN`                     | `TypeError`   | `false`       |
	 *
	 *   We introduce this change to make *date-fns* consistent with ECMAScript behavior
	 *   that try to coerce arguments to the expected type
	 *   (which is also the case with other *date-fns* functions).
	 *
	 * @param {*} date - the date to check
	 * @returns {Boolean} the date is valid
	 * @throws {TypeError} 1 argument required
	 *
	 * @example
	 * // For the valid date:
	 * var result = isValid(new Date(2014, 1, 31))
	 * //=> true
	 *
	 * @example
	 * // For the value, convertable into a date:
	 * var result = isValid(1393804800000)
	 * //=> true
	 *
	 * @example
	 * // For the invalid date:
	 * var result = isValid(new Date(''))
	 * //=> false
	 */

	function isValid(dirtyDate) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  return !isNaN(date);
	}

	/**
	 * @name isSameDay
	 * @category Day Helpers
	 * @summary Are the given dates in the same day?
	 *
	 * @description
	 * Are the given dates in the same day?
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} dateLeft - the first date to check
	 * @param {Date|Number} dateRight - the second date to check
	 * @returns {Boolean} the dates are in the same day
	 * @throws {TypeError} 2 arguments required
	 *
	 * @example
	 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
	 * var result = isSameDay(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 18, 0))
	 * //=> true
	 */

	function isSameDay(dirtyDateLeft, dirtyDateRight) {
	  requiredArgs(2, arguments);
	  var dateLeftStartOfDay = startOfDay(dirtyDateLeft);
	  var dateRightStartOfDay = startOfDay(dirtyDateRight);
	  return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
	}

	/**
	 * @name endOfDay
	 * @category Day Helpers
	 * @summary Return the end of a day for the given date.
	 *
	 * @description
	 * Return the end of a day for the given date.
	 * The result will be in the local timezone.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the original date
	 * @returns {Date} the end of a day
	 * @throws {TypeError} 1 argument required
	 *
	 * @example
	 * // The end of a day for 2 September 2014 11:55:00:
	 * var result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Tue Sep 02 2014 23:59:59.999
	 */

	function endOfDay(dirtyDate) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  date.setHours(23, 59, 59, 999);
	  return date;
	}

	/**
	 * @name endOfWeek
	 * @category Week Helpers
	 * @summary Return the end of a week for the given date.
	 *
	 * @description
	 * Return the end of a week for the given date.
	 * The result will be in the local timezone.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the original date
	 * @param {Object} [options] - an object with options.
	 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
	 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @returns {Date} the end of a week
	 * @throws {TypeError} 1 argument required
	 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
	 *
	 * @example
	 * // The end of a week for 2 September 2014 11:55:00:
	 * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
	 * //=> Sat Sep 06 2014 23:59:59.999
	 *
	 * @example
	 * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
	 * var result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
	 * //=> Sun Sep 07 2014 23:59:59.999
	 */

	function endOfWeek(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
	  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger$1(localeWeekStartsOn);
	  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger$1(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

	  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
	    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
	  }

	  var date = toDate(dirtyDate);
	  var day = date.getDay();
	  var diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
	  date.setDate(date.getDate() + diff);
	  date.setHours(23, 59, 59, 999);
	  return date;
	}

	var formatDistanceLocale = {
	  lessThanXSeconds: {
	    one: 'less than a second',
	    other: 'less than {{count}} seconds'
	  },
	  xSeconds: {
	    one: '1 second',
	    other: '{{count}} seconds'
	  },
	  halfAMinute: 'half a minute',
	  lessThanXMinutes: {
	    one: 'less than a minute',
	    other: 'less than {{count}} minutes'
	  },
	  xMinutes: {
	    one: '1 minute',
	    other: '{{count}} minutes'
	  },
	  aboutXHours: {
	    one: 'about 1 hour',
	    other: 'about {{count}} hours'
	  },
	  xHours: {
	    one: '1 hour',
	    other: '{{count}} hours'
	  },
	  xDays: {
	    one: '1 day',
	    other: '{{count}} days'
	  },
	  aboutXWeeks: {
	    one: 'about 1 week',
	    other: 'about {{count}} weeks'
	  },
	  xWeeks: {
	    one: '1 week',
	    other: '{{count}} weeks'
	  },
	  aboutXMonths: {
	    one: 'about 1 month',
	    other: 'about {{count}} months'
	  },
	  xMonths: {
	    one: '1 month',
	    other: '{{count}} months'
	  },
	  aboutXYears: {
	    one: 'about 1 year',
	    other: 'about {{count}} years'
	  },
	  xYears: {
	    one: '1 year',
	    other: '{{count}} years'
	  },
	  overXYears: {
	    one: 'over 1 year',
	    other: 'over {{count}} years'
	  },
	  almostXYears: {
	    one: 'almost 1 year',
	    other: 'almost {{count}} years'
	  }
	};
	function formatDistance(token, count, options) {
	  options = options || {};
	  var result;

	  if (typeof formatDistanceLocale[token] === 'string') {
	    result = formatDistanceLocale[token];
	  } else if (count === 1) {
	    result = formatDistanceLocale[token].one;
	  } else {
	    result = formatDistanceLocale[token].other.replace('{{count}}', count);
	  }

	  if (options.addSuffix) {
	    if (options.comparison > 0) {
	      return 'in ' + result;
	    } else {
	      return result + ' ago';
	    }
	  }

	  return result;
	}

	function buildFormatLongFn(args) {
	  return function (dirtyOptions) {
	    var options = dirtyOptions || {};
	    var width = options.width ? String(options.width) : args.defaultWidth;
	    var format = args.formats[width] || args.formats[args.defaultWidth];
	    return format;
	  };
	}

	var dateFormats = {
	  full: 'EEEE, MMMM do, y',
	  long: 'MMMM do, y',
	  medium: 'MMM d, y',
	  short: 'MM/dd/yyyy'
	};
	var timeFormats = {
	  full: 'h:mm:ss a zzzz',
	  long: 'h:mm:ss a z',
	  medium: 'h:mm:ss a',
	  short: 'h:mm a'
	};
	var dateTimeFormats = {
	  full: "{{date}} 'at' {{time}}",
	  long: "{{date}} 'at' {{time}}",
	  medium: '{{date}}, {{time}}',
	  short: '{{date}}, {{time}}'
	};
	var formatLong = {
	  date: buildFormatLongFn({
	    formats: dateFormats,
	    defaultWidth: 'full'
	  }),
	  time: buildFormatLongFn({
	    formats: timeFormats,
	    defaultWidth: 'full'
	  }),
	  dateTime: buildFormatLongFn({
	    formats: dateTimeFormats,
	    defaultWidth: 'full'
	  })
	};

	var formatRelativeLocale = {
	  lastWeek: "'last' eeee 'at' p",
	  yesterday: "'yesterday at' p",
	  today: "'today at' p",
	  tomorrow: "'tomorrow at' p",
	  nextWeek: "eeee 'at' p",
	  other: 'P'
	};
	function formatRelative(token, _date, _baseDate, _options) {
	  return formatRelativeLocale[token];
	}

	function buildLocalizeFn(args) {
	  return function (dirtyIndex, dirtyOptions) {
	    var options = dirtyOptions || {};
	    var context = options.context ? String(options.context) : 'standalone';
	    var valuesArray;

	    if (context === 'formatting' && args.formattingValues) {
	      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
	      var width = options.width ? String(options.width) : defaultWidth;
	      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
	    } else {
	      var _defaultWidth = args.defaultWidth;

	      var _width = options.width ? String(options.width) : args.defaultWidth;

	      valuesArray = args.values[_width] || args.values[_defaultWidth];
	    }

	    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
	    return valuesArray[index];
	  };
	}

	var eraValues = {
	  narrow: ['B', 'A'],
	  abbreviated: ['BC', 'AD'],
	  wide: ['Before Christ', 'Anno Domini']
	};
	var quarterValues = {
	  narrow: ['1', '2', '3', '4'],
	  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
	  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'] // Note: in English, the names of days of the week and months are capitalized.
	  // If you are making a new locale based on this one, check if the same is true for the language you're working on.
	  // Generally, formatted dates should look like they are in the middle of a sentence,
	  // e.g. in Spanish language the weekdays and months should be in the lowercase.

	};
	var monthValues = {
	  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
	  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	};
	var dayValues = {
	  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
	  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
	  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	};
	var dayPeriodValues = {
	  narrow: {
	    am: 'a',
	    pm: 'p',
	    midnight: 'mi',
	    noon: 'n',
	    morning: 'morning',
	    afternoon: 'afternoon',
	    evening: 'evening',
	    night: 'night'
	  },
	  abbreviated: {
	    am: 'AM',
	    pm: 'PM',
	    midnight: 'midnight',
	    noon: 'noon',
	    morning: 'morning',
	    afternoon: 'afternoon',
	    evening: 'evening',
	    night: 'night'
	  },
	  wide: {
	    am: 'a.m.',
	    pm: 'p.m.',
	    midnight: 'midnight',
	    noon: 'noon',
	    morning: 'morning',
	    afternoon: 'afternoon',
	    evening: 'evening',
	    night: 'night'
	  }
	};
	var formattingDayPeriodValues = {
	  narrow: {
	    am: 'a',
	    pm: 'p',
	    midnight: 'mi',
	    noon: 'n',
	    morning: 'in the morning',
	    afternoon: 'in the afternoon',
	    evening: 'in the evening',
	    night: 'at night'
	  },
	  abbreviated: {
	    am: 'AM',
	    pm: 'PM',
	    midnight: 'midnight',
	    noon: 'noon',
	    morning: 'in the morning',
	    afternoon: 'in the afternoon',
	    evening: 'in the evening',
	    night: 'at night'
	  },
	  wide: {
	    am: 'a.m.',
	    pm: 'p.m.',
	    midnight: 'midnight',
	    noon: 'noon',
	    morning: 'in the morning',
	    afternoon: 'in the afternoon',
	    evening: 'in the evening',
	    night: 'at night'
	  }
	};

	function ordinalNumber(dirtyNumber, _dirtyOptions) {
	  var number = Number(dirtyNumber); // If ordinal numbers depend on context, for example,
	  // if they are different for different grammatical genders,
	  // use `options.unit`:
	  //
	  //   var options = dirtyOptions || {}
	  //   var unit = String(options.unit)
	  //
	  // where `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
	  // 'day', 'hour', 'minute', 'second'

	  var rem100 = number % 100;

	  if (rem100 > 20 || rem100 < 10) {
	    switch (rem100 % 10) {
	      case 1:
	        return number + 'st';

	      case 2:
	        return number + 'nd';

	      case 3:
	        return number + 'rd';
	    }
	  }

	  return number + 'th';
	}

	var localize = {
	  ordinalNumber: ordinalNumber,
	  era: buildLocalizeFn({
	    values: eraValues,
	    defaultWidth: 'wide'
	  }),
	  quarter: buildLocalizeFn({
	    values: quarterValues,
	    defaultWidth: 'wide',
	    argumentCallback: function (quarter) {
	      return Number(quarter) - 1;
	    }
	  }),
	  month: buildLocalizeFn({
	    values: monthValues,
	    defaultWidth: 'wide'
	  }),
	  day: buildLocalizeFn({
	    values: dayValues,
	    defaultWidth: 'wide'
	  }),
	  dayPeriod: buildLocalizeFn({
	    values: dayPeriodValues,
	    defaultWidth: 'wide',
	    formattingValues: formattingDayPeriodValues,
	    defaultFormattingWidth: 'wide'
	  })
	};

	function buildMatchPatternFn(args) {
	  return function (dirtyString, dirtyOptions) {
	    var string = String(dirtyString);
	    var options = dirtyOptions || {};
	    var matchResult = string.match(args.matchPattern);

	    if (!matchResult) {
	      return null;
	    }

	    var matchedString = matchResult[0];
	    var parseResult = string.match(args.parsePattern);

	    if (!parseResult) {
	      return null;
	    }

	    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
	    value = options.valueCallback ? options.valueCallback(value) : value;
	    return {
	      value: value,
	      rest: string.slice(matchedString.length)
	    };
	  };
	}

	function buildMatchFn(args) {
	  return function (dirtyString, dirtyOptions) {
	    var string = String(dirtyString);
	    var options = dirtyOptions || {};
	    var width = options.width;
	    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
	    var matchResult = string.match(matchPattern);

	    if (!matchResult) {
	      return null;
	    }

	    var matchedString = matchResult[0];
	    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
	    var value;

	    if (Object.prototype.toString.call(parsePatterns) === '[object Array]') {
	      value = findIndex(parsePatterns, function (pattern) {
	        return pattern.test(matchedString);
	      });
	    } else {
	      value = findKey(parsePatterns, function (pattern) {
	        return pattern.test(matchedString);
	      });
	    }

	    value = args.valueCallback ? args.valueCallback(value) : value;
	    value = options.valueCallback ? options.valueCallback(value) : value;
	    return {
	      value: value,
	      rest: string.slice(matchedString.length)
	    };
	  };
	}

	function findKey(object, predicate) {
	  for (var key in object) {
	    if (object.hasOwnProperty(key) && predicate(object[key])) {
	      return key;
	    }
	  }
	}

	function findIndex(array, predicate) {
	  for (var key = 0; key < array.length; key++) {
	    if (predicate(array[key])) {
	      return key;
	    }
	  }
	}

	var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
	var parseOrdinalNumberPattern = /\d+/i;
	var matchEraPatterns = {
	  narrow: /^(b|a)/i,
	  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
	  wide: /^(before christ|before common era|anno domini|common era)/i
	};
	var parseEraPatterns = {
	  any: [/^b/i, /^(a|c)/i]
	};
	var matchQuarterPatterns = {
	  narrow: /^[1234]/i,
	  abbreviated: /^q[1234]/i,
	  wide: /^[1234](th|st|nd|rd)? quarter/i
	};
	var parseQuarterPatterns = {
	  any: [/1/i, /2/i, /3/i, /4/i]
	};
	var matchMonthPatterns = {
	  narrow: /^[jfmasond]/i,
	  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
	  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
	};
	var parseMonthPatterns = {
	  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
	  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
	};
	var matchDayPatterns = {
	  narrow: /^[smtwf]/i,
	  short: /^(su|mo|tu|we|th|fr|sa)/i,
	  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
	  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
	};
	var parseDayPatterns = {
	  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
	  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
	};
	var matchDayPeriodPatterns = {
	  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
	  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
	};
	var parseDayPeriodPatterns = {
	  any: {
	    am: /^a/i,
	    pm: /^p/i,
	    midnight: /^mi/i,
	    noon: /^no/i,
	    morning: /morning/i,
	    afternoon: /afternoon/i,
	    evening: /evening/i,
	    night: /night/i
	  }
	};
	var match$1 = {
	  ordinalNumber: buildMatchPatternFn({
	    matchPattern: matchOrdinalNumberPattern,
	    parsePattern: parseOrdinalNumberPattern,
	    valueCallback: function (value) {
	      return parseInt(value, 10);
	    }
	  }),
	  era: buildMatchFn({
	    matchPatterns: matchEraPatterns,
	    defaultMatchWidth: 'wide',
	    parsePatterns: parseEraPatterns,
	    defaultParseWidth: 'any'
	  }),
	  quarter: buildMatchFn({
	    matchPatterns: matchQuarterPatterns,
	    defaultMatchWidth: 'wide',
	    parsePatterns: parseQuarterPatterns,
	    defaultParseWidth: 'any',
	    valueCallback: function (index) {
	      return index + 1;
	    }
	  }),
	  month: buildMatchFn({
	    matchPatterns: matchMonthPatterns,
	    defaultMatchWidth: 'wide',
	    parsePatterns: parseMonthPatterns,
	    defaultParseWidth: 'any'
	  }),
	  day: buildMatchFn({
	    matchPatterns: matchDayPatterns,
	    defaultMatchWidth: 'wide',
	    parsePatterns: parseDayPatterns,
	    defaultParseWidth: 'any'
	  }),
	  dayPeriod: buildMatchFn({
	    matchPatterns: matchDayPeriodPatterns,
	    defaultMatchWidth: 'any',
	    parsePatterns: parseDayPeriodPatterns,
	    defaultParseWidth: 'any'
	  })
	};

	/**
	 * @type {Locale}
	 * @category Locales
	 * @summary English locale (United States).
	 * @language English
	 * @iso-639-2 eng
	 * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
	 * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
	 */

	var locale = {
	  code: 'en-US',
	  formatDistance: formatDistance,
	  formatLong: formatLong,
	  formatRelative: formatRelative,
	  localize: localize,
	  match: match$1,
	  options: {
	    weekStartsOn: 0
	    /* Sunday */
	    ,
	    firstWeekContainsDate: 1
	  }
	};

	/**
	 * @name subMilliseconds
	 * @category Millisecond Helpers
	 * @summary Subtract the specified number of milliseconds from the given date.
	 *
	 * @description
	 * Subtract the specified number of milliseconds from the given date.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the date to be changed
	 * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
	 * @returns {Date} the new date with the milliseconds subtracted
	 * @throws {TypeError} 2 arguments required
	 *
	 * @example
	 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
	 * var result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
	 * //=> Thu Jul 10 2014 12:45:29.250
	 */

	function subMilliseconds(dirtyDate, dirtyAmount) {
	  requiredArgs(2, arguments);
	  var amount = toInteger$1(dirtyAmount);
	  return addMilliseconds(dirtyDate, -amount);
	}

	function addLeadingZeros(number, targetLength) {
	  var sign = number < 0 ? '-' : '';
	  var output = Math.abs(number).toString();

	  while (output.length < targetLength) {
	    output = '0' + output;
	  }

	  return sign + output;
	}

	/*
	 * |     | Unit                           |     | Unit                           |
	 * |-----|--------------------------------|-----|--------------------------------|
	 * |  a  | AM, PM                         |  A* |                                |
	 * |  d  | Day of month                   |  D  |                                |
	 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
	 * |  m  | Minute                         |  M  | Month                          |
	 * |  s  | Second                         |  S  | Fraction of second             |
	 * |  y  | Year (abs)                     |  Y  |                                |
	 *
	 * Letters marked by * are not implemented but reserved by Unicode standard.
	 */

	var formatters = {
	  // Year
	  y: function (date, token) {
	    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
	    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
	    // |----------|-------|----|-------|-------|-------|
	    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
	    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
	    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
	    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
	    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |
	    var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

	    var year = signedYear > 0 ? signedYear : 1 - signedYear;
	    return addLeadingZeros(token === 'yy' ? year % 100 : year, token.length);
	  },
	  // Month
	  M: function (date, token) {
	    var month = date.getUTCMonth();
	    return token === 'M' ? String(month + 1) : addLeadingZeros(month + 1, 2);
	  },
	  // Day of the month
	  d: function (date, token) {
	    return addLeadingZeros(date.getUTCDate(), token.length);
	  },
	  // AM or PM
	  a: function (date, token) {
	    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';

	    switch (token) {
	      case 'a':
	      case 'aa':
	      case 'aaa':
	        return dayPeriodEnumValue.toUpperCase();

	      case 'aaaaa':
	        return dayPeriodEnumValue[0];

	      case 'aaaa':
	      default:
	        return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
	    }
	  },
	  // Hour [1-12]
	  h: function (date, token) {
	    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
	  },
	  // Hour [0-23]
	  H: function (date, token) {
	    return addLeadingZeros(date.getUTCHours(), token.length);
	  },
	  // Minute
	  m: function (date, token) {
	    return addLeadingZeros(date.getUTCMinutes(), token.length);
	  },
	  // Second
	  s: function (date, token) {
	    return addLeadingZeros(date.getUTCSeconds(), token.length);
	  },
	  // Fraction of second
	  S: function (date, token) {
	    var numberOfDigits = token.length;
	    var milliseconds = date.getUTCMilliseconds();
	    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
	    return addLeadingZeros(fractionalSeconds, token.length);
	  }
	};

	var MILLISECONDS_IN_DAY = 86400000; // This function will be a part of public API when UTC function will be implemented.
	// See issue: https://github.com/date-fns/date-fns/issues/376

	function getUTCDayOfYear(dirtyDate) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  var timestamp = date.getTime();
	  date.setUTCMonth(0, 1);
	  date.setUTCHours(0, 0, 0, 0);
	  var startOfYearTimestamp = date.getTime();
	  var difference = timestamp - startOfYearTimestamp;
	  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
	}

	// See issue: https://github.com/date-fns/date-fns/issues/376

	function startOfUTCISOWeek(dirtyDate) {
	  requiredArgs(1, arguments);
	  var weekStartsOn = 1;
	  var date = toDate(dirtyDate);
	  var day = date.getUTCDay();
	  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
	  date.setUTCDate(date.getUTCDate() - diff);
	  date.setUTCHours(0, 0, 0, 0);
	  return date;
	}

	// See issue: https://github.com/date-fns/date-fns/issues/376

	function getUTCISOWeekYear(dirtyDate) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  var year = date.getUTCFullYear();
	  var fourthOfJanuaryOfNextYear = new Date(0);
	  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
	  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
	  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
	  var fourthOfJanuaryOfThisYear = new Date(0);
	  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
	  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
	  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);

	  if (date.getTime() >= startOfNextYear.getTime()) {
	    return year + 1;
	  } else if (date.getTime() >= startOfThisYear.getTime()) {
	    return year;
	  } else {
	    return year - 1;
	  }
	}

	// See issue: https://github.com/date-fns/date-fns/issues/376

	function startOfUTCISOWeekYear(dirtyDate) {
	  requiredArgs(1, arguments);
	  var year = getUTCISOWeekYear(dirtyDate);
	  var fourthOfJanuary = new Date(0);
	  fourthOfJanuary.setUTCFullYear(year, 0, 4);
	  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
	  var date = startOfUTCISOWeek(fourthOfJanuary);
	  return date;
	}

	var MILLISECONDS_IN_WEEK = 604800000; // This function will be a part of public API when UTC function will be implemented.
	// See issue: https://github.com/date-fns/date-fns/issues/376

	function getUTCISOWeek(dirtyDate) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime(); // Round the number of days to the nearest integer
	  // because the number of milliseconds in a week is not constant
	  // (e.g. it's different in the week of the daylight saving time clock shift)

	  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
	}

	// See issue: https://github.com/date-fns/date-fns/issues/376

	function startOfUTCWeek(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeWeekStartsOn = locale && locale.options && locale.options.weekStartsOn;
	  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger$1(localeWeekStartsOn);
	  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger$1(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

	  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
	    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
	  }

	  var date = toDate(dirtyDate);
	  var day = date.getUTCDay();
	  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
	  date.setUTCDate(date.getUTCDate() - diff);
	  date.setUTCHours(0, 0, 0, 0);
	  return date;
	}

	// See issue: https://github.com/date-fns/date-fns/issues/376

	function getUTCWeekYear(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate, dirtyOptions);
	  var year = date.getUTCFullYear();
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
	  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger$1(localeFirstWeekContainsDate);
	  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger$1(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

	  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
	    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
	  }

	  var firstWeekOfNextYear = new Date(0);
	  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
	  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
	  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, dirtyOptions);
	  var firstWeekOfThisYear = new Date(0);
	  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
	  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
	  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, dirtyOptions);

	  if (date.getTime() >= startOfNextYear.getTime()) {
	    return year + 1;
	  } else if (date.getTime() >= startOfThisYear.getTime()) {
	    return year;
	  } else {
	    return year - 1;
	  }
	}

	// See issue: https://github.com/date-fns/date-fns/issues/376

	function startOfUTCWeekYear(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
	  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger$1(localeFirstWeekContainsDate);
	  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger$1(options.firstWeekContainsDate);
	  var year = getUTCWeekYear(dirtyDate, dirtyOptions);
	  var firstWeek = new Date(0);
	  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
	  firstWeek.setUTCHours(0, 0, 0, 0);
	  var date = startOfUTCWeek(firstWeek, dirtyOptions);
	  return date;
	}

	var MILLISECONDS_IN_WEEK$1 = 604800000; // This function will be a part of public API when UTC function will be implemented.
	// See issue: https://github.com/date-fns/date-fns/issues/376

	function getUTCWeek(dirtyDate, options) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime(); // Round the number of days to the nearest integer
	  // because the number of milliseconds in a week is not constant
	  // (e.g. it's different in the week of the daylight saving time clock shift)

	  return Math.round(diff / MILLISECONDS_IN_WEEK$1) + 1;
	}

	var dayPeriodEnum = {
	  am: 'am',
	  pm: 'pm',
	  midnight: 'midnight',
	  noon: 'noon',
	  morning: 'morning',
	  afternoon: 'afternoon',
	  evening: 'evening',
	  night: 'night'
	  /*
	   * |     | Unit                           |     | Unit                           |
	   * |-----|--------------------------------|-----|--------------------------------|
	   * |  a  | AM, PM                         |  A* | Milliseconds in day            |
	   * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
	   * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
	   * |  d  | Day of month                   |  D  | Day of year                    |
	   * |  e  | Local day of week              |  E  | Day of week                    |
	   * |  f  |                                |  F* | Day of week in month           |
	   * |  g* | Modified Julian day            |  G  | Era                            |
	   * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
	   * |  i! | ISO day of week                |  I! | ISO week of year               |
	   * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
	   * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
	   * |  l* | (deprecated)                   |  L  | Stand-alone month              |
	   * |  m  | Minute                         |  M  | Month                          |
	   * |  n  |                                |  N  |                                |
	   * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
	   * |  p! | Long localized time            |  P! | Long localized date            |
	   * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
	   * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
	   * |  s  | Second                         |  S  | Fraction of second             |
	   * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
	   * |  u  | Extended year                  |  U* | Cyclic year                    |
	   * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
	   * |  w  | Local week of year             |  W* | Week of month                  |
	   * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
	   * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
	   * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
	   *
	   * Letters marked by * are not implemented but reserved by Unicode standard.
	   *
	   * Letters marked by ! are non-standard, but implemented by date-fns:
	   * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
	   * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
	   *   i.e. 7 for Sunday, 1 for Monday, etc.
	   * - `I` is ISO week of year, as opposed to `w` which is local week of year.
	   * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
	   *   `R` is supposed to be used in conjunction with `I` and `i`
	   *   for universal ISO week-numbering date, whereas
	   *   `Y` is supposed to be used in conjunction with `w` and `e`
	   *   for week-numbering date specific to the locale.
	   * - `P` is long localized date format
	   * - `p` is long localized time format
	   */

	};
	var formatters$1 = {
	  // Era
	  G: function (date, token, localize) {
	    var era = date.getUTCFullYear() > 0 ? 1 : 0;

	    switch (token) {
	      // AD, BC
	      case 'G':
	      case 'GG':
	      case 'GGG':
	        return localize.era(era, {
	          width: 'abbreviated'
	        });
	      // A, B

	      case 'GGGGG':
	        return localize.era(era, {
	          width: 'narrow'
	        });
	      // Anno Domini, Before Christ

	      case 'GGGG':
	      default:
	        return localize.era(era, {
	          width: 'wide'
	        });
	    }
	  },
	  // Year
	  y: function (date, token, localize) {
	    // Ordinal number
	    if (token === 'yo') {
	      var signedYear = date.getUTCFullYear(); // Returns 1 for 1 BC (which is year 0 in JavaScript)

	      var year = signedYear > 0 ? signedYear : 1 - signedYear;
	      return localize.ordinalNumber(year, {
	        unit: 'year'
	      });
	    }

	    return formatters.y(date, token);
	  },
	  // Local week-numbering year
	  Y: function (date, token, localize, options) {
	    var signedWeekYear = getUTCWeekYear(date, options); // Returns 1 for 1 BC (which is year 0 in JavaScript)

	    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear; // Two digit year

	    if (token === 'YY') {
	      var twoDigitYear = weekYear % 100;
	      return addLeadingZeros(twoDigitYear, 2);
	    } // Ordinal number


	    if (token === 'Yo') {
	      return localize.ordinalNumber(weekYear, {
	        unit: 'year'
	      });
	    } // Padding


	    return addLeadingZeros(weekYear, token.length);
	  },
	  // ISO week-numbering year
	  R: function (date, token) {
	    var isoWeekYear = getUTCISOWeekYear(date); // Padding

	    return addLeadingZeros(isoWeekYear, token.length);
	  },
	  // Extended year. This is a single number designating the year of this calendar system.
	  // The main difference between `y` and `u` localizers are B.C. years:
	  // | Year | `y` | `u` |
	  // |------|-----|-----|
	  // | AC 1 |   1 |   1 |
	  // | BC 1 |   1 |   0 |
	  // | BC 2 |   2 |  -1 |
	  // Also `yy` always returns the last two digits of a year,
	  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
	  u: function (date, token) {
	    var year = date.getUTCFullYear();
	    return addLeadingZeros(year, token.length);
	  },
	  // Quarter
	  Q: function (date, token, localize) {
	    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

	    switch (token) {
	      // 1, 2, 3, 4
	      case 'Q':
	        return String(quarter);
	      // 01, 02, 03, 04

	      case 'QQ':
	        return addLeadingZeros(quarter, 2);
	      // 1st, 2nd, 3rd, 4th

	      case 'Qo':
	        return localize.ordinalNumber(quarter, {
	          unit: 'quarter'
	        });
	      // Q1, Q2, Q3, Q4

	      case 'QQQ':
	        return localize.quarter(quarter, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });
	      // 1, 2, 3, 4 (narrow quarter; could be not numerical)

	      case 'QQQQQ':
	        return localize.quarter(quarter, {
	          width: 'narrow',
	          context: 'formatting'
	        });
	      // 1st quarter, 2nd quarter, ...

	      case 'QQQQ':
	      default:
	        return localize.quarter(quarter, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // Stand-alone quarter
	  q: function (date, token, localize) {
	    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);

	    switch (token) {
	      // 1, 2, 3, 4
	      case 'q':
	        return String(quarter);
	      // 01, 02, 03, 04

	      case 'qq':
	        return addLeadingZeros(quarter, 2);
	      // 1st, 2nd, 3rd, 4th

	      case 'qo':
	        return localize.ordinalNumber(quarter, {
	          unit: 'quarter'
	        });
	      // Q1, Q2, Q3, Q4

	      case 'qqq':
	        return localize.quarter(quarter, {
	          width: 'abbreviated',
	          context: 'standalone'
	        });
	      // 1, 2, 3, 4 (narrow quarter; could be not numerical)

	      case 'qqqqq':
	        return localize.quarter(quarter, {
	          width: 'narrow',
	          context: 'standalone'
	        });
	      // 1st quarter, 2nd quarter, ...

	      case 'qqqq':
	      default:
	        return localize.quarter(quarter, {
	          width: 'wide',
	          context: 'standalone'
	        });
	    }
	  },
	  // Month
	  M: function (date, token, localize) {
	    var month = date.getUTCMonth();

	    switch (token) {
	      case 'M':
	      case 'MM':
	        return formatters.M(date, token);
	      // 1st, 2nd, ..., 12th

	      case 'Mo':
	        return localize.ordinalNumber(month + 1, {
	          unit: 'month'
	        });
	      // Jan, Feb, ..., Dec

	      case 'MMM':
	        return localize.month(month, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });
	      // J, F, ..., D

	      case 'MMMMM':
	        return localize.month(month, {
	          width: 'narrow',
	          context: 'formatting'
	        });
	      // January, February, ..., December

	      case 'MMMM':
	      default:
	        return localize.month(month, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // Stand-alone month
	  L: function (date, token, localize) {
	    var month = date.getUTCMonth();

	    switch (token) {
	      // 1, 2, ..., 12
	      case 'L':
	        return String(month + 1);
	      // 01, 02, ..., 12

	      case 'LL':
	        return addLeadingZeros(month + 1, 2);
	      // 1st, 2nd, ..., 12th

	      case 'Lo':
	        return localize.ordinalNumber(month + 1, {
	          unit: 'month'
	        });
	      // Jan, Feb, ..., Dec

	      case 'LLL':
	        return localize.month(month, {
	          width: 'abbreviated',
	          context: 'standalone'
	        });
	      // J, F, ..., D

	      case 'LLLLL':
	        return localize.month(month, {
	          width: 'narrow',
	          context: 'standalone'
	        });
	      // January, February, ..., December

	      case 'LLLL':
	      default:
	        return localize.month(month, {
	          width: 'wide',
	          context: 'standalone'
	        });
	    }
	  },
	  // Local week of year
	  w: function (date, token, localize, options) {
	    var week = getUTCWeek(date, options);

	    if (token === 'wo') {
	      return localize.ordinalNumber(week, {
	        unit: 'week'
	      });
	    }

	    return addLeadingZeros(week, token.length);
	  },
	  // ISO week of year
	  I: function (date, token, localize) {
	    var isoWeek = getUTCISOWeek(date);

	    if (token === 'Io') {
	      return localize.ordinalNumber(isoWeek, {
	        unit: 'week'
	      });
	    }

	    return addLeadingZeros(isoWeek, token.length);
	  },
	  // Day of the month
	  d: function (date, token, localize) {
	    if (token === 'do') {
	      return localize.ordinalNumber(date.getUTCDate(), {
	        unit: 'date'
	      });
	    }

	    return formatters.d(date, token);
	  },
	  // Day of year
	  D: function (date, token, localize) {
	    var dayOfYear = getUTCDayOfYear(date);

	    if (token === 'Do') {
	      return localize.ordinalNumber(dayOfYear, {
	        unit: 'dayOfYear'
	      });
	    }

	    return addLeadingZeros(dayOfYear, token.length);
	  },
	  // Day of week
	  E: function (date, token, localize) {
	    var dayOfWeek = date.getUTCDay();

	    switch (token) {
	      // Tue
	      case 'E':
	      case 'EE':
	      case 'EEE':
	        return localize.day(dayOfWeek, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });
	      // T

	      case 'EEEEE':
	        return localize.day(dayOfWeek, {
	          width: 'narrow',
	          context: 'formatting'
	        });
	      // Tu

	      case 'EEEEEE':
	        return localize.day(dayOfWeek, {
	          width: 'short',
	          context: 'formatting'
	        });
	      // Tuesday

	      case 'EEEE':
	      default:
	        return localize.day(dayOfWeek, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // Local day of week
	  e: function (date, token, localize, options) {
	    var dayOfWeek = date.getUTCDay();
	    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

	    switch (token) {
	      // Numerical value (Nth day of week with current locale or weekStartsOn)
	      case 'e':
	        return String(localDayOfWeek);
	      // Padded numerical value

	      case 'ee':
	        return addLeadingZeros(localDayOfWeek, 2);
	      // 1st, 2nd, ..., 7th

	      case 'eo':
	        return localize.ordinalNumber(localDayOfWeek, {
	          unit: 'day'
	        });

	      case 'eee':
	        return localize.day(dayOfWeek, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });
	      // T

	      case 'eeeee':
	        return localize.day(dayOfWeek, {
	          width: 'narrow',
	          context: 'formatting'
	        });
	      // Tu

	      case 'eeeeee':
	        return localize.day(dayOfWeek, {
	          width: 'short',
	          context: 'formatting'
	        });
	      // Tuesday

	      case 'eeee':
	      default:
	        return localize.day(dayOfWeek, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // Stand-alone local day of week
	  c: function (date, token, localize, options) {
	    var dayOfWeek = date.getUTCDay();
	    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;

	    switch (token) {
	      // Numerical value (same as in `e`)
	      case 'c':
	        return String(localDayOfWeek);
	      // Padded numerical value

	      case 'cc':
	        return addLeadingZeros(localDayOfWeek, token.length);
	      // 1st, 2nd, ..., 7th

	      case 'co':
	        return localize.ordinalNumber(localDayOfWeek, {
	          unit: 'day'
	        });

	      case 'ccc':
	        return localize.day(dayOfWeek, {
	          width: 'abbreviated',
	          context: 'standalone'
	        });
	      // T

	      case 'ccccc':
	        return localize.day(dayOfWeek, {
	          width: 'narrow',
	          context: 'standalone'
	        });
	      // Tu

	      case 'cccccc':
	        return localize.day(dayOfWeek, {
	          width: 'short',
	          context: 'standalone'
	        });
	      // Tuesday

	      case 'cccc':
	      default:
	        return localize.day(dayOfWeek, {
	          width: 'wide',
	          context: 'standalone'
	        });
	    }
	  },
	  // ISO day of week
	  i: function (date, token, localize) {
	    var dayOfWeek = date.getUTCDay();
	    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;

	    switch (token) {
	      // 2
	      case 'i':
	        return String(isoDayOfWeek);
	      // 02

	      case 'ii':
	        return addLeadingZeros(isoDayOfWeek, token.length);
	      // 2nd

	      case 'io':
	        return localize.ordinalNumber(isoDayOfWeek, {
	          unit: 'day'
	        });
	      // Tue

	      case 'iii':
	        return localize.day(dayOfWeek, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });
	      // T

	      case 'iiiii':
	        return localize.day(dayOfWeek, {
	          width: 'narrow',
	          context: 'formatting'
	        });
	      // Tu

	      case 'iiiiii':
	        return localize.day(dayOfWeek, {
	          width: 'short',
	          context: 'formatting'
	        });
	      // Tuesday

	      case 'iiii':
	      default:
	        return localize.day(dayOfWeek, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // AM or PM
	  a: function (date, token, localize) {
	    var hours = date.getUTCHours();
	    var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';

	    switch (token) {
	      case 'a':
	      case 'aa':
	      case 'aaa':
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });

	      case 'aaaaa':
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'narrow',
	          context: 'formatting'
	        });

	      case 'aaaa':
	      default:
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // AM, PM, midnight, noon
	  b: function (date, token, localize) {
	    var hours = date.getUTCHours();
	    var dayPeriodEnumValue;

	    if (hours === 12) {
	      dayPeriodEnumValue = dayPeriodEnum.noon;
	    } else if (hours === 0) {
	      dayPeriodEnumValue = dayPeriodEnum.midnight;
	    } else {
	      dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
	    }

	    switch (token) {
	      case 'b':
	      case 'bb':
	      case 'bbb':
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });

	      case 'bbbbb':
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'narrow',
	          context: 'formatting'
	        });

	      case 'bbbb':
	      default:
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // in the morning, in the afternoon, in the evening, at night
	  B: function (date, token, localize) {
	    var hours = date.getUTCHours();
	    var dayPeriodEnumValue;

	    if (hours >= 17) {
	      dayPeriodEnumValue = dayPeriodEnum.evening;
	    } else if (hours >= 12) {
	      dayPeriodEnumValue = dayPeriodEnum.afternoon;
	    } else if (hours >= 4) {
	      dayPeriodEnumValue = dayPeriodEnum.morning;
	    } else {
	      dayPeriodEnumValue = dayPeriodEnum.night;
	    }

	    switch (token) {
	      case 'B':
	      case 'BB':
	      case 'BBB':
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'abbreviated',
	          context: 'formatting'
	        });

	      case 'BBBBB':
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'narrow',
	          context: 'formatting'
	        });

	      case 'BBBB':
	      default:
	        return localize.dayPeriod(dayPeriodEnumValue, {
	          width: 'wide',
	          context: 'formatting'
	        });
	    }
	  },
	  // Hour [1-12]
	  h: function (date, token, localize) {
	    if (token === 'ho') {
	      var hours = date.getUTCHours() % 12;
	      if (hours === 0) hours = 12;
	      return localize.ordinalNumber(hours, {
	        unit: 'hour'
	      });
	    }

	    return formatters.h(date, token);
	  },
	  // Hour [0-23]
	  H: function (date, token, localize) {
	    if (token === 'Ho') {
	      return localize.ordinalNumber(date.getUTCHours(), {
	        unit: 'hour'
	      });
	    }

	    return formatters.H(date, token);
	  },
	  // Hour [0-11]
	  K: function (date, token, localize) {
	    var hours = date.getUTCHours() % 12;

	    if (token === 'Ko') {
	      return localize.ordinalNumber(hours, {
	        unit: 'hour'
	      });
	    }

	    return addLeadingZeros(hours, token.length);
	  },
	  // Hour [1-24]
	  k: function (date, token, localize) {
	    var hours = date.getUTCHours();
	    if (hours === 0) hours = 24;

	    if (token === 'ko') {
	      return localize.ordinalNumber(hours, {
	        unit: 'hour'
	      });
	    }

	    return addLeadingZeros(hours, token.length);
	  },
	  // Minute
	  m: function (date, token, localize) {
	    if (token === 'mo') {
	      return localize.ordinalNumber(date.getUTCMinutes(), {
	        unit: 'minute'
	      });
	    }

	    return formatters.m(date, token);
	  },
	  // Second
	  s: function (date, token, localize) {
	    if (token === 'so') {
	      return localize.ordinalNumber(date.getUTCSeconds(), {
	        unit: 'second'
	      });
	    }

	    return formatters.s(date, token);
	  },
	  // Fraction of second
	  S: function (date, token) {
	    return formatters.S(date, token);
	  },
	  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
	  X: function (date, token, _localize, options) {
	    var originalDate = options._originalDate || date;
	    var timezoneOffset = originalDate.getTimezoneOffset();

	    if (timezoneOffset === 0) {
	      return 'Z';
	    }

	    switch (token) {
	      // Hours and optional minutes
	      case 'X':
	        return formatTimezoneWithOptionalMinutes(timezoneOffset);
	      // Hours, minutes and optional seconds without `:` delimiter
	      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
	      // so this token always has the same output as `XX`

	      case 'XXXX':
	      case 'XX':
	        // Hours and minutes without `:` delimiter
	        return formatTimezone(timezoneOffset);
	      // Hours, minutes and optional seconds with `:` delimiter
	      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
	      // so this token always has the same output as `XXX`

	      case 'XXXXX':
	      case 'XXX': // Hours and minutes with `:` delimiter

	      default:
	        return formatTimezone(timezoneOffset, ':');
	    }
	  },
	  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
	  x: function (date, token, _localize, options) {
	    var originalDate = options._originalDate || date;
	    var timezoneOffset = originalDate.getTimezoneOffset();

	    switch (token) {
	      // Hours and optional minutes
	      case 'x':
	        return formatTimezoneWithOptionalMinutes(timezoneOffset);
	      // Hours, minutes and optional seconds without `:` delimiter
	      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
	      // so this token always has the same output as `xx`

	      case 'xxxx':
	      case 'xx':
	        // Hours and minutes without `:` delimiter
	        return formatTimezone(timezoneOffset);
	      // Hours, minutes and optional seconds with `:` delimiter
	      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
	      // so this token always has the same output as `xxx`

	      case 'xxxxx':
	      case 'xxx': // Hours and minutes with `:` delimiter

	      default:
	        return formatTimezone(timezoneOffset, ':');
	    }
	  },
	  // Timezone (GMT)
	  O: function (date, token, _localize, options) {
	    var originalDate = options._originalDate || date;
	    var timezoneOffset = originalDate.getTimezoneOffset();

	    switch (token) {
	      // Short
	      case 'O':
	      case 'OO':
	      case 'OOO':
	        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
	      // Long

	      case 'OOOO':
	      default:
	        return 'GMT' + formatTimezone(timezoneOffset, ':');
	    }
	  },
	  // Timezone (specific non-location)
	  z: function (date, token, _localize, options) {
	    var originalDate = options._originalDate || date;
	    var timezoneOffset = originalDate.getTimezoneOffset();

	    switch (token) {
	      // Short
	      case 'z':
	      case 'zz':
	      case 'zzz':
	        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
	      // Long

	      case 'zzzz':
	      default:
	        return 'GMT' + formatTimezone(timezoneOffset, ':');
	    }
	  },
	  // Seconds timestamp
	  t: function (date, token, _localize, options) {
	    var originalDate = options._originalDate || date;
	    var timestamp = Math.floor(originalDate.getTime() / 1000);
	    return addLeadingZeros(timestamp, token.length);
	  },
	  // Milliseconds timestamp
	  T: function (date, token, _localize, options) {
	    var originalDate = options._originalDate || date;
	    var timestamp = originalDate.getTime();
	    return addLeadingZeros(timestamp, token.length);
	  }
	};

	function formatTimezoneShort(offset, dirtyDelimiter) {
	  var sign = offset > 0 ? '-' : '+';
	  var absOffset = Math.abs(offset);
	  var hours = Math.floor(absOffset / 60);
	  var minutes = absOffset % 60;

	  if (minutes === 0) {
	    return sign + String(hours);
	  }

	  var delimiter = dirtyDelimiter || '';
	  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
	}

	function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
	  if (offset % 60 === 0) {
	    var sign = offset > 0 ? '-' : '+';
	    return sign + addLeadingZeros(Math.abs(offset) / 60, 2);
	  }

	  return formatTimezone(offset, dirtyDelimiter);
	}

	function formatTimezone(offset, dirtyDelimiter) {
	  var delimiter = dirtyDelimiter || '';
	  var sign = offset > 0 ? '-' : '+';
	  var absOffset = Math.abs(offset);
	  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
	  var minutes = addLeadingZeros(absOffset % 60, 2);
	  return sign + hours + delimiter + minutes;
	}

	function dateLongFormatter(pattern, formatLong) {
	  switch (pattern) {
	    case 'P':
	      return formatLong.date({
	        width: 'short'
	      });

	    case 'PP':
	      return formatLong.date({
	        width: 'medium'
	      });

	    case 'PPP':
	      return formatLong.date({
	        width: 'long'
	      });

	    case 'PPPP':
	    default:
	      return formatLong.date({
	        width: 'full'
	      });
	  }
	}

	function timeLongFormatter(pattern, formatLong) {
	  switch (pattern) {
	    case 'p':
	      return formatLong.time({
	        width: 'short'
	      });

	    case 'pp':
	      return formatLong.time({
	        width: 'medium'
	      });

	    case 'ppp':
	      return formatLong.time({
	        width: 'long'
	      });

	    case 'pppp':
	    default:
	      return formatLong.time({
	        width: 'full'
	      });
	  }
	}

	function dateTimeLongFormatter(pattern, formatLong) {
	  var matchResult = pattern.match(/(P+)(p+)?/);
	  var datePattern = matchResult[1];
	  var timePattern = matchResult[2];

	  if (!timePattern) {
	    return dateLongFormatter(pattern, formatLong);
	  }

	  var dateTimeFormat;

	  switch (datePattern) {
	    case 'P':
	      dateTimeFormat = formatLong.dateTime({
	        width: 'short'
	      });
	      break;

	    case 'PP':
	      dateTimeFormat = formatLong.dateTime({
	        width: 'medium'
	      });
	      break;

	    case 'PPP':
	      dateTimeFormat = formatLong.dateTime({
	        width: 'long'
	      });
	      break;

	    case 'PPPP':
	    default:
	      dateTimeFormat = formatLong.dateTime({
	        width: 'full'
	      });
	      break;
	  }

	  return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
	}

	var longFormatters = {
	  p: timeLongFormatter,
	  P: dateTimeLongFormatter
	};

	var protectedDayOfYearTokens = ['D', 'DD'];
	var protectedWeekYearTokens = ['YY', 'YYYY'];
	function isProtectedDayOfYearToken(token) {
	  return protectedDayOfYearTokens.indexOf(token) !== -1;
	}
	function isProtectedWeekYearToken(token) {
	  return protectedWeekYearTokens.indexOf(token) !== -1;
	}
	function throwProtectedError(token) {
	  if (token === 'YYYY') {
	    throw new RangeError('Use `yyyy` instead of `YYYY` for formatting years; see: https://git.io/fxCyr');
	  } else if (token === 'YY') {
	    throw new RangeError('Use `yy` instead of `YY` for formatting years; see: https://git.io/fxCyr');
	  } else if (token === 'D') {
	    throw new RangeError('Use `d` instead of `D` for formatting days of the month; see: https://git.io/fxCyr');
	  } else if (token === 'DD') {
	    throw new RangeError('Use `dd` instead of `DD` for formatting days of the month; see: https://git.io/fxCyr');
	  }
	}

	// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
	//   (one of the certain letters followed by `o`)
	// - (\w)\1* matches any sequences of the same letter
	// - '' matches two quote characters in a row
	// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
	//   except a single quote symbol, which ends the sequence.
	//   Two quote characters do not end the sequence.
	//   If there is no matching single quote
	//   then the sequence will continue until the end of the string.
	// - . matches any single character unmatched by previous parts of the RegExps

	var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g; // This RegExp catches symbols escaped by quotes, and also
	// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`

	var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
	var escapedStringRegExp = /^'([^]*?)'?$/;
	var doubleQuoteRegExp = /''/g;
	var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
	/**
	 * @name format
	 * @category Common Helpers
	 * @summary Format the date.
	 *
	 * @description
	 * Return the formatted date string in the given format. The result may vary by locale.
	 *
	 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
	 * > See: https://git.io/fxCyr
	 *
	 * The characters wrapped between two single quotes characters (') are escaped.
	 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
	 * (see the last example)
	 *
	 * Format of the string is based on Unicode Technical Standard #35:
	 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
	 * with a few additions (see note 7 below the table).
	 *
	 * Accepted patterns:
	 * | Unit                            | Pattern | Result examples                   | Notes |
	 * |---------------------------------|---------|-----------------------------------|-------|
	 * | Era                             | G..GGG  | AD, BC                            |       |
	 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
	 * |                                 | GGGGG   | A, B                              |       |
	 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
	 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
	 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
	 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
	 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
	 * |                                 | yyyyy   | ...                               | 3,5   |
	 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
	 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
	 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
	 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
	 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
	 * |                                 | YYYYY   | ...                               | 3,5   |
	 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
	 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
	 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
	 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
	 * |                                 | RRRRR   | ...                               | 3,5,7 |
	 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
	 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
	 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
	 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
	 * |                                 | uuuuu   | ...                               | 3,5   |
	 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
	 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
	 * |                                 | QQ      | 01, 02, 03, 04                    |       |
	 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
	 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
	 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
	 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
	 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
	 * |                                 | qq      | 01, 02, 03, 04                    |       |
	 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
	 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
	 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
	 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
	 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
	 * |                                 | MM      | 01, 02, ..., 12                   |       |
	 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
	 * |                                 | MMMM    | January, February, ..., December  | 2     |
	 * |                                 | MMMMM   | J, F, ..., D                      |       |
	 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
	 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
	 * |                                 | LL      | 01, 02, ..., 12                   |       |
	 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
	 * |                                 | LLLL    | January, February, ..., December  | 2     |
	 * |                                 | LLLLL   | J, F, ..., D                      |       |
	 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
	 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
	 * |                                 | ww      | 01, 02, ..., 53                   |       |
	 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
	 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
	 * |                                 | II      | 01, 02, ..., 53                   | 7     |
	 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
	 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
	 * |                                 | dd      | 01, 02, ..., 31                   |       |
	 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
	 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
	 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
	 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
	 * |                                 | DDDD    | ...                               | 3     |
	 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Su            |       |
	 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
	 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
	 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
	 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
	 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
	 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
	 * |                                 | iii     | Mon, Tue, Wed, ..., Su            | 7     |
	 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
	 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
	 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Su, Sa        | 7     |
	 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
	 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
	 * |                                 | ee      | 02, 03, ..., 01                   |       |
	 * |                                 | eee     | Mon, Tue, Wed, ..., Su            |       |
	 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
	 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
	 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
	 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
	 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
	 * |                                 | cc      | 02, 03, ..., 01                   |       |
	 * |                                 | ccc     | Mon, Tue, Wed, ..., Su            |       |
	 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
	 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
	 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Su, Sa        |       |
	 * | AM, PM                          | a..aaa  | AM, PM                            |       |
	 * |                                 | aaaa    | a.m., p.m.                        | 2     |
	 * |                                 | aaaaa   | a, p                              |       |
	 * | AM, PM, noon, midnight          | b..bbb  | AM, PM, noon, midnight            |       |
	 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
	 * |                                 | bbbbb   | a, p, n, mi                       |       |
	 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
	 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
	 * |                                 | BBBBB   | at night, in the morning, ...     |       |
	 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
	 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
	 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
	 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
	 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
	 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
	 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
	 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
	 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
	 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
	 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
	 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
	 * | Minute                          | m       | 0, 1, ..., 59                     |       |
	 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
	 * |                                 | mm      | 00, 01, ..., 59                   |       |
	 * | Second                          | s       | 0, 1, ..., 59                     |       |
	 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
	 * |                                 | ss      | 00, 01, ..., 59                   |       |
	 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
	 * |                                 | SS      | 00, 01, ..., 99                   |       |
	 * |                                 | SSS     | 000, 0001, ..., 999               |       |
	 * |                                 | SSSS    | ...                               | 3     |
	 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
	 * |                                 | XX      | -0800, +0530, Z                   |       |
	 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
	 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
	 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
	 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
	 * |                                 | xx      | -0800, +0530, +0000               |       |
	 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
	 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
	 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
	 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
	 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
	 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
	 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
	 * | Seconds timestamp               | t       | 512969520                         | 7     |
	 * |                                 | tt      | ...                               | 3,7   |
	 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
	 * |                                 | TT      | ...                               | 3,7   |
	 * | Long localized date             | P       | 05/29/1453                        | 7     |
	 * |                                 | PP      | May 29, 1453                      | 7     |
	 * |                                 | PPP     | May 29th, 1453                    | 7     |
	 * |                                 | PPPP    | Sunday, May 29th, 1453            | 2,7   |
	 * | Long localized time             | p       | 12:00 AM                          | 7     |
	 * |                                 | pp      | 12:00:00 AM                       | 7     |
	 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
	 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
	 * | Combination of date and time    | Pp      | 05/29/1453, 12:00 AM              | 7     |
	 * |                                 | PPpp    | May 29, 1453, 12:00:00 AM         | 7     |
	 * |                                 | PPPppp  | May 29th, 1453 at ...             | 7     |
	 * |                                 | PPPPpppp| Sunday, May 29th, 1453 at ...     | 2,7   |
	 * Notes:
	 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
	 *    are the same as "stand-alone" units, but are different in some languages.
	 *    "Formatting" units are declined according to the rules of the language
	 *    in the context of a date. "Stand-alone" units are always nominative singular:
	 *
	 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
	 *
	 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
	 *
	 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
	 *    the single quote characters (see below).
	 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
	 *    the output will be the same as default pattern for this unit, usually
	 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
	 *    are marked with "2" in the last column of the table.
	 *
	 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
	 *
	 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
	 *
	 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
	 *
	 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
	 *
	 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
	 *
	 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
	 *    The output will be padded with zeros to match the length of the pattern.
	 *
	 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
	 *
	 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
	 *    These tokens represent the shortest form of the quarter.
	 *
	 * 5. The main difference between `y` and `u` patterns are B.C. years:
	 *
	 *    | Year | `y` | `u` |
	 *    |------|-----|-----|
	 *    | AC 1 |   1 |   1 |
	 *    | BC 1 |   1 |   0 |
	 *    | BC 2 |   2 |  -1 |
	 *
	 *    Also `yy` always returns the last two digits of a year,
	 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
	 *
	 *    | Year | `yy` | `uu` |
	 *    |------|------|------|
	 *    | 1    |   01 |   01 |
	 *    | 14   |   14 |   14 |
	 *    | 376  |   76 |  376 |
	 *    | 1453 |   53 | 1453 |
	 *
	 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
	 *    except local week-numbering years are dependent on `options.weekStartsOn`
	 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
	 *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
	 *
	 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
	 *    so right now these tokens fall back to GMT timezones.
	 *
	 * 7. These patterns are not in the Unicode Technical Standard #35:
	 *    - `i`: ISO day of week
	 *    - `I`: ISO week of year
	 *    - `R`: ISO week-numbering year
	 *    - `t`: seconds timestamp
	 *    - `T`: milliseconds timestamp
	 *    - `o`: ordinal number modifier
	 *    - `P`: long localized date
	 *    - `p`: long localized time
	 *
	 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
	 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://git.io/fxCyr
	 *
	 * 9. `D` and `DD` tokens represent days of the year but they are ofthen confused with days of the month.
	 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://git.io/fxCyr
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * - The second argument is now required for the sake of explicitness.
	 *
	 *   ```javascript
	 *   // Before v2.0.0
	 *   format(new Date(2016, 0, 1))
	 *
	 *   // v2.0.0 onward
	 *   format(new Date(2016, 0, 1), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
	 *   ```
	 *
	 * - New format string API for `format` function
	 *   which is based on [Unicode Technical Standard #35](https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table).
	 *   See [this post](https://blog.date-fns.org/post/unicode-tokens-in-date-fns-v2-sreatyki91jg) for more details.
	 *
	 * - Characters are now escaped using single quote symbols (`'`) instead of square brackets.
	 *
	 * @param {Date|Number} date - the original date
	 * @param {String} format - the string of tokens
	 * @param {Object} [options] - an object with options.
	 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
	 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
	 * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
	 *   see: https://git.io/fxCyr
	 * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
	 *   see: https://git.io/fxCyr
	 * @returns {String} the formatted date string
	 * @throws {TypeError} 2 arguments required
	 * @throws {RangeError} `date` must not be Invalid Date
	 * @throws {RangeError} `options.locale` must contain `localize` property
	 * @throws {RangeError} `options.locale` must contain `formatLong` property
	 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
	 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
	 * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years; see: https://git.io/fxCyr
	 * @throws {RangeError} use `yy` instead of `YY` for formatting years; see: https://git.io/fxCyr
	 * @throws {RangeError} use `d` instead of `D` for formatting days of the month; see: https://git.io/fxCyr
	 * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month; see: https://git.io/fxCyr
	 * @throws {RangeError} format string contains an unescaped latin alphabet character
	 *
	 * @example
	 * // Represent 11 February 2014 in middle-endian format:
	 * var result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
	 * //=> '02/11/2014'
	 *
	 * @example
	 * // Represent 2 July 2014 in Esperanto:
	 * import { eoLocale } from 'date-fns/locale/eo'
	 * var result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
	 *   locale: eoLocale
	 * })
	 * //=> '2-a de julio 2014'
	 *
	 * @example
	 * // Escape string by single quote characters:
	 * var result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
	 * //=> "3 o'clock"
	 */

	function format(dirtyDate, dirtyFormatStr, dirtyOptions) {
	  requiredArgs(2, arguments);
	  var formatStr = String(dirtyFormatStr);
	  var options = dirtyOptions || {};
	  var locale$1 = options.locale || locale;
	  var localeFirstWeekContainsDate = locale$1.options && locale$1.options.firstWeekContainsDate;
	  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger$1(localeFirstWeekContainsDate);
	  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger$1(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

	  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
	    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
	  }

	  var localeWeekStartsOn = locale$1.options && locale$1.options.weekStartsOn;
	  var defaultWeekStartsOn = localeWeekStartsOn == null ? 0 : toInteger$1(localeWeekStartsOn);
	  var weekStartsOn = options.weekStartsOn == null ? defaultWeekStartsOn : toInteger$1(options.weekStartsOn); // Test if weekStartsOn is between 0 and 6 _and_ is not NaN

	  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
	    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
	  }

	  if (!locale$1.localize) {
	    throw new RangeError('locale must contain localize property');
	  }

	  if (!locale$1.formatLong) {
	    throw new RangeError('locale must contain formatLong property');
	  }

	  var originalDate = toDate(dirtyDate);

	  if (!isValid(originalDate)) {
	    throw new RangeError('Invalid time value');
	  } // Convert the date in system timezone to the same date in UTC+00:00 timezone.
	  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
	  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376


	  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
	  var utcDate = subMilliseconds(originalDate, timezoneOffset);
	  var formatterOptions = {
	    firstWeekContainsDate: firstWeekContainsDate,
	    weekStartsOn: weekStartsOn,
	    locale: locale$1,
	    _originalDate: originalDate
	  };
	  var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
	    var firstCharacter = substring[0];

	    if (firstCharacter === 'p' || firstCharacter === 'P') {
	      var longFormatter = longFormatters[firstCharacter];
	      return longFormatter(substring, locale$1.formatLong, formatterOptions);
	    }

	    return substring;
	  }).join('').match(formattingTokensRegExp).map(function (substring) {
	    // Replace two single quote characters with one single quote character
	    if (substring === "''") {
	      return "'";
	    }

	    var firstCharacter = substring[0];

	    if (firstCharacter === "'") {
	      return cleanEscapedString(substring);
	    }

	    var formatter = formatters$1[firstCharacter];

	    if (formatter) {
	      if (!options.useAdditionalWeekYearTokens && isProtectedWeekYearToken(substring)) {
	        throwProtectedError(substring);
	      }

	      if (!options.useAdditionalDayOfYearTokens && isProtectedDayOfYearToken(substring)) {
	        throwProtectedError(substring);
	      }

	      return formatter(utcDate, substring, locale$1.localize, formatterOptions);
	    }

	    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
	      throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
	    }

	    return substring;
	  }).join('');
	  return result;
	}

	function cleanEscapedString(input) {
	  return input.match(escapedStringRegExp)[1].replace(doubleQuoteRegExp, "'");
	}

	/**
	 * @name getWeekYear
	 * @category Week-Numbering Year Helpers
	 * @summary Get the local week-numbering year of the given date.
	 *
	 * @description
	 * Get the local week-numbering year of the given date.
	 * The exact calculation depends on the values of
	 * `options.weekStartsOn` (which is the index of the first day of the week)
	 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
	 * the first week of the week-numbering year)
	 *
	 * Week numbering: https://en.wikipedia.org/wiki/Week#Week_numbering
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the given date
	 * @param {Object} [options] - an object with options.
	 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
	 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @param {1|2|3|4|5|6|7} [options.firstWeekContainsDate=1] - the day of January, which is always in the first week of the year
	 * @returns {Number} the local week-numbering year
	 * @throws {TypeError} 1 argument required
	 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
	 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
	 *
	 * @example
	 * // Which week numbering year is 26 December 2004 with the default settings?
	 * var result = getWeekYear(new Date(2004, 11, 26))
	 * //=> 2005
	 *
	 * @example
	 * // Which week numbering year is 26 December 2004 if week starts on Saturday?
	 * var result = getWeekYear(new Date(2004, 11, 26), { weekStartsOn: 6 })
	 * //=> 2004
	 *
	 * @example
	 * // Which week numbering year is 26 December 2004 if the first week contains 4 January?
	 * var result = getWeekYear(new Date(2004, 11, 26), { firstWeekContainsDate: 4 })
	 * //=> 2004
	 */

	function getWeekYear(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  var year = date.getFullYear();
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
	  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger$1(localeFirstWeekContainsDate);
	  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger$1(options.firstWeekContainsDate); // Test if weekStartsOn is between 1 and 7 _and_ is not NaN

	  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
	    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
	  }

	  var firstWeekOfNextYear = new Date(0);
	  firstWeekOfNextYear.setFullYear(year + 1, 0, firstWeekContainsDate);
	  firstWeekOfNextYear.setHours(0, 0, 0, 0);
	  var startOfNextYear = startOfWeek(firstWeekOfNextYear, dirtyOptions);
	  var firstWeekOfThisYear = new Date(0);
	  firstWeekOfThisYear.setFullYear(year, 0, firstWeekContainsDate);
	  firstWeekOfThisYear.setHours(0, 0, 0, 0);
	  var startOfThisYear = startOfWeek(firstWeekOfThisYear, dirtyOptions);

	  if (date.getTime() >= startOfNextYear.getTime()) {
	    return year + 1;
	  } else if (date.getTime() >= startOfThisYear.getTime()) {
	    return year;
	  } else {
	    return year - 1;
	  }
	}

	/**
	 * @name startOfWeekYear
	 * @category Week-Numbering Year Helpers
	 * @summary Return the start of a local week-numbering year for the given date.
	 *
	 * @description
	 * Return the start of a local week-numbering year.
	 * The exact calculation depends on the values of
	 * `options.weekStartsOn` (which is the index of the first day of the week)
	 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
	 * the first week of the week-numbering year)
	 *
	 * Week numbering: https://en.wikipedia.org/wiki/Week#Week_numbering
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the original date
	 * @param {Object} [options] - an object with options.
	 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
	 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @param {1|2|3|4|5|6|7} [options.firstWeekContainsDate=1] - the day of January, which is always in the first week of the year
	 * @returns {Date} the start of a week-numbering year
	 * @throws {TypeError} 1 argument required
	 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
	 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
	 *
	 * @example
	 * // The start of an a week-numbering year for 2 July 2005 with default settings:
	 * var result = startOfWeekYear(new Date(2005, 6, 2))
	 * //=> Sun Dec 26 2004 00:00:00
	 *
	 * @example
	 * // The start of a week-numbering year for 2 July 2005
	 * // if Monday is the first day of week
	 * // and 4 January is always in the first week of the year:
	 * var result = startOfWeekYear(new Date(2005, 6, 2), {
	 *   weekStartsOn: 1,
	 *   firstWeekContainsDate: 4
	 * })
	 * //=> Mon Jan 03 2005 00:00:00
	 */

	function startOfWeekYear(dirtyDate, dirtyOptions) {
	  requiredArgs(1, arguments);
	  var options = dirtyOptions || {};
	  var locale = options.locale;
	  var localeFirstWeekContainsDate = locale && locale.options && locale.options.firstWeekContainsDate;
	  var defaultFirstWeekContainsDate = localeFirstWeekContainsDate == null ? 1 : toInteger$1(localeFirstWeekContainsDate);
	  var firstWeekContainsDate = options.firstWeekContainsDate == null ? defaultFirstWeekContainsDate : toInteger$1(options.firstWeekContainsDate);
	  var year = getWeekYear(dirtyDate, dirtyOptions);
	  var firstWeek = new Date(0);
	  firstWeek.setFullYear(year, 0, firstWeekContainsDate);
	  firstWeek.setHours(0, 0, 0, 0);
	  var date = startOfWeek(firstWeek, dirtyOptions);
	  return date;
	}

	var MILLISECONDS_IN_WEEK$2 = 604800000;
	/**
	 * @name getWeek
	 * @category Week Helpers
	 * @summary Get the local week index of the given date.
	 *
	 * @description
	 * Get the local week index of the given date.
	 * The exact calculation depends on the values of
	 * `options.weekStartsOn` (which is the index of the first day of the week)
	 * and `options.firstWeekContainsDate` (which is the day of January, which is always in
	 * the first week of the week-numbering year)
	 *
	 * Week numbering: https://en.wikipedia.org/wiki/Week#Week_numbering
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the given date
	 * @param {Object} [options] - an object with options.
	 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
	 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
	 * @param {1|2|3|4|5|6|7} [options.firstWeekContainsDate=1] - the day of January, which is always in the first week of the year
	 * @returns {Number} the week
	 * @throws {TypeError} 1 argument required
	 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
	 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
	 *
	 * @example
	 * // Which week of the local week numbering year is 2 January 2005 with default options?
	 * var result = getISOWeek(new Date(2005, 0, 2))
	 * //=> 2
	 *
	 * // Which week of the local week numbering year is 2 January 2005,
	 * // if Monday is the first day of the week,
	 * // and the first week of the year always contains 4 January?
	 * var result = getISOWeek(new Date(2005, 0, 2), {
	 *   weekStartsOn: 1,
	 *   firstWeekContainsDate: 4
	 * })
	 * //=> 53
	 */

	function getWeek(dirtyDate, options) {
	  requiredArgs(1, arguments);
	  var date = toDate(dirtyDate);
	  var diff = startOfWeek(date, options).getTime() - startOfWeekYear(date, options).getTime(); // Round the number of days to the nearest integer
	  // because the number of milliseconds in a week is not constant
	  // (e.g. it's different in the week of the daylight saving time clock shift)

	  return Math.round(diff / MILLISECONDS_IN_WEEK$2) + 1;
	}

	/**
	 * @name startOfToday
	 * @category Day Helpers
	 * @summary Return the start of today.
	 * @pure false
	 *
	 * @description
	 * Return the start of today.
	 *
	 * > ⚠️ Please note that this function is not present in the FP submodule as
	 * > it uses `Date.now()` internally hence impure and can't be safely curried.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @returns {Date} the start of today
	 *
	 * @example
	 * // If today is 6 October 2014:
	 * var result = startOfToday()
	 * //=> Mon Oct 6 2014 00:00:00
	 */

	function startOfToday() {
	  return startOfDay(Date.now());
	}

	/**
	 * @name subWeeks
	 * @category Week Helpers
	 * @summary Subtract the specified number of weeks from the given date.
	 *
	 * @description
	 * Subtract the specified number of weeks from the given date.
	 *
	 * ### v2.0.0 breaking changes:
	 *
	 * - [Changes that are common for the whole library](https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#Common-Changes).
	 *
	 * @param {Date|Number} date - the date to be changed
	 * @param {Number} amount - the amount of weeks to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
	 * @returns {Date} the new date with the weeks subtracted
	 * @throws {TypeError} 2 arguments required
	 *
	 * @example
	 * // Subtract 4 weeks from 1 September 2014:
	 * var result = subWeeks(new Date(2014, 8, 1), 4)
	 * //=> Mon Aug 04 2014 00:00:00
	 */

	function subWeeks(dirtyDate, dirtyAmount) {
	  requiredArgs(2, arguments);
	  var amount = toInteger$1(dirtyAmount);
	  return addWeeks(dirtyDate, -amount);
	}

	function get_each_context(ctx, list, i) {
	  var child_ctx = ctx.slice();
	  child_ctx[17] = list[i];
	  return child_ctx;
	} // (117:5) {#if day && day.stats}


	function create_if_block_2(ctx) {
	  var t0;
	  var div;
	  var t1_value = format(
	  /*day*/
	  ctx[17].date, "iiiiii d.M.") + "";
	  var t1;
	  var if_block =
	  /*day*/
	  ctx[17].stats.total > 0 && create_if_block_3(ctx);
	  return {
	    c() {
	      if (if_block) if_block.c();
	      t0 = space();
	      div = element("div");
	      t1 = text(t1_value);
	      attr(div, "class", "date-label");
	    },

	    m(target, anchor) {
	      if (if_block) if_block.m(target, anchor);
	      insert(target, t0, anchor);
	      insert(target, div, anchor);
	      append(div, t1);
	    },

	    p(ctx, dirty) {
	      if (
	      /*day*/
	      ctx[17].stats.total > 0) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block_3(ctx);
	          if_block.c();
	          if_block.m(t0.parentNode, t0);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }

	      if (dirty &
	      /*days*/
	      2 && t1_value !== (t1_value = format(
	      /*day*/
	      ctx[17].date, "iiiiii d.M.") + "")) set_data(t1, t1_value);
	    },

	    d(detaching) {
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(t0);
	      if (detaching) detach(div);
	    }

	  };
	} // (118:6) {#if day.stats.total > 0}


	function create_if_block_3(ctx) {
	  var span;
	  var t0_value =
	  /*day*/
	  ctx[17].stats.total + "";
	  var t0;
	  var t1;
	  var t2_value = window.t("timemanager", "hrs.") + "";
	  var t2;
	  var t3;
	  var div;
	  var div_style_value;
	  return {
	    c() {
	      span = element("span");
	      t0 = text(t0_value);
	      t1 = space();
	      t2 = text(t2_value);
	      t3 = space();
	      div = element("div");
	      attr(span, "class", "hours-label");
	      attr(div, "class", "column-inner");
	      attr(div, "style", div_style_value = "height: ".concat(
	      /*day*/
	      ctx[17].stats.total /
	      /*highest*/
	      ctx[4] * 100, "%"));
	    },

	    m(target, anchor) {
	      insert(target, span, anchor);
	      append(span, t0);
	      append(span, t1);
	      append(span, t2);
	      insert(target, t3, anchor);
	      insert(target, div, anchor);
	    },

	    p(ctx, dirty) {
	      if (dirty &
	      /*days*/
	      2 && t0_value !== (t0_value =
	      /*day*/
	      ctx[17].stats.total + "")) set_data(t0, t0_value);

	      if (dirty &
	      /*days, highest*/
	      18 && div_style_value !== (div_style_value = "height: ".concat(
	      /*day*/
	      ctx[17].stats.total /
	      /*highest*/
	      ctx[4] * 100, "%"))) {
	        attr(div, "style", div_style_value);
	      }
	    },

	    d(detaching) {
	      if (detaching) detach(span);
	      if (detaching) detach(t3);
	      if (detaching) detach(div);
	    }

	  };
	} // (115:3) {#each days as day}


	function create_each_block(ctx) {
	  var div;
	  var if_block =
	  /*day*/
	  ctx[17] &&
	  /*day*/
	  ctx[17].stats && create_if_block_2(ctx);
	  return {
	    c() {
	      div = element("div");
	      if (if_block) if_block.c();
	      attr(div, "class", "column");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      if (if_block) if_block.m(div, null);
	    },

	    p(ctx, dirty) {
	      if (
	      /*day*/
	      ctx[17] &&
	      /*day*/
	      ctx[17].stats) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block_2(ctx);
	          if_block.c();
	          if_block.m(div, null);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      if (if_block) if_block.d();
	    }

	  };
	} // (126:3) {#if !loading && weekTotal === 0}


	function create_if_block_1(ctx) {
	  var p;
	  return {
	    c() {
	      p = element("p");
	      p.textContent = "".concat(window.t("timemanager", "When you add entries for this week graphs will appear here."));
	      attr(p, "class", "empty");
	    },

	    m(target, anchor) {
	      insert(target, p, anchor);
	    },

	    p: noop,

	    d(detaching) {
	      if (detaching) detach(p);
	    }

	  };
	} // (143:3) {#if !isSameDay(startOfToday(), dayCursor)}


	function create_if_block(ctx) {
	  var button;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      button = element("button");
	      button.textContent = "".concat(window.t("timemanager", "Current week"));
	      attr(button, "class", "current");
	    },

	    m(target, anchor) {
	      insert(target, button, anchor);

	      if (!mounted) {
	        dispose = listen(button, "click", prevent_default(
	        /*click_handler_2*/
	        ctx[16]));
	        mounted = true;
	      }
	    },

	    p: noop,

	    d(detaching) {
	      if (detaching) detach(button);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function create_fragment(ctx) {
	  var h2;
	  var t1;
	  var div3;
	  var div0;
	  var figure0;
	  var figcaption0;
	  var t3;
	  var t4;
	  var t5;
	  var t6_value = window.t("timemanager", "hrs.") + "";
	  var t6;
	  var t7;
	  var figure1;
	  var figcaption1;
	  var t9;
	  var t10;
	  var t11;
	  var t12_value = window.t("timemanager", "hrs.") + "";
	  var t12;
	  var t13;
	  var div2;
	  var div1;
	  var t14;
	  var t15;
	  var nav;
	  var button0;
	  var t17;
	  var span1;
	  var t18_value = window.t("timemanager", "Week") + "";
	  var t18;
	  var t19;
	  var t20;
	  var t21;
	  var span0;
	  var t22;
	  var t23_value = format(startOfWeek(
	  /*dayCursor*/
	  ctx[5],
	  /*localeOptions*/
	  ctx[7]), "iiiiii d.MM.Y") + "";
	  var t23;
	  var t24;
	  var t25_value = format(endOfWeek(
	  /*dayCursor*/
	  ctx[5],
	  /*localeOptions*/
	  ctx[7]), "iiiiii d.MM.Y") + "";
	  var t25;
	  var t26;
	  var t27;
	  var button1;
	  var t29;
	  var show_if = !isSameDay(startOfToday(),
	  /*dayCursor*/
	  ctx[5]);
	  var div3_class_value;
	  var mounted;
	  var dispose;
	  var each_value =
	  /*days*/
	  ctx[1];
	  var each_blocks = [];

	  for (var i = 0; i < each_value.length; i += 1) {
	    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	  }

	  var if_block0 = !
	  /*loading*/
	  ctx[0] &&
	  /*weekTotal*/
	  ctx[2] === 0 && create_if_block_1();
	  var if_block1 = show_if && create_if_block(ctx);
	  return {
	    c() {
	      h2 = element("h2");
	      h2.textContent = "".concat(window.t("timemanager", "Statistics"));
	      t1 = space();
	      div3 = element("div");
	      div0 = element("div");
	      figure0 = element("figure");
	      figcaption0 = element("figcaption");
	      figcaption0.textContent = "".concat(window.t("timemanager", "Today"));
	      t3 = space();
	      t4 = text(
	      /*todayTotal*/
	      ctx[3]);
	      t5 = space();
	      t6 = text(t6_value);
	      t7 = space();
	      figure1 = element("figure");
	      figcaption1 = element("figcaption");
	      figcaption1.textContent = "".concat(window.t("timemanager", "Week"));
	      t9 = space();
	      t10 = text(
	      /*weekTotal*/
	      ctx[2]);
	      t11 = space();
	      t12 = text(t12_value);
	      t13 = space();
	      div2 = element("div");
	      div1 = element("div");

	      for (var _i = 0; _i < each_blocks.length; _i += 1) {
	        each_blocks[_i].c();
	      }

	      t14 = space();
	      if (if_block0) if_block0.c();
	      t15 = space();
	      nav = element("nav");
	      button0 = element("button");
	      button0.textContent = "".concat(window.t("timemanager", "Previous week"));
	      t17 = space();
	      span1 = element("span");
	      t18 = text(t18_value);
	      t19 = space();
	      t20 = text(
	      /*currentWeek*/
	      ctx[6]);
	      t21 = space();
	      span0 = element("span");
	      t22 = text("(");
	      t23 = text(t23_value);
	      t24 = text(" – ");
	      t25 = text(t25_value);
	      t26 = text(")");
	      t27 = space();
	      button1 = element("button");
	      button1.textContent = "".concat(window.t("timemanager", "Next week"));
	      t29 = space();
	      if (if_block1) if_block1.c();
	      attr(figcaption0, "class", "tm_label");
	      attr(figcaption1, "class", "tm_label");
	      attr(div0, "class", "top-stats");
	      attr(div1, "class", "hours-per-week");
	      attr(button0, "class", "previous");
	      attr(span0, "class", "dates");
	      attr(button1, "class", "next");
	      attr(nav, "class", "week-navigation");
	      attr(div2, "class", "graphs");
	      attr(div3, "class", div3_class_value = "".concat(
	      /*loading*/
	      ctx[0] ? "icon-loading" : ""));
	    },

	    m(target, anchor) {
	      insert(target, h2, anchor);
	      insert(target, t1, anchor);
	      insert(target, div3, anchor);
	      append(div3, div0);
	      append(div0, figure0);
	      append(figure0, figcaption0);
	      append(figure0, t3);
	      append(figure0, t4);
	      append(figure0, t5);
	      append(figure0, t6);
	      append(div0, t7);
	      append(div0, figure1);
	      append(figure1, figcaption1);
	      append(figure1, t9);
	      append(figure1, t10);
	      append(figure1, t11);
	      append(figure1, t12);
	      append(div3, t13);
	      append(div3, div2);
	      append(div2, div1);

	      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
	        each_blocks[_i2].m(div1, null);
	      }

	      append(div1, t14);
	      if (if_block0) if_block0.m(div1, null);
	      append(div2, t15);
	      append(div2, nav);
	      append(nav, button0);
	      append(nav, t17);
	      append(nav, span1);
	      append(span1, t18);
	      append(span1, t19);
	      append(span1, t20);
	      append(span1, t21);
	      append(span1, span0);
	      append(span0, t22);
	      append(span0, t23);
	      append(span0, t24);
	      append(span0, t25);
	      append(span0, t26);
	      append(nav, t27);
	      append(nav, button1);
	      append(nav, t29);
	      if (if_block1) if_block1.m(nav, null);

	      if (!mounted) {
	        dispose = [listen(button0, "click", prevent_default(
	        /*click_handler*/
	        ctx[14])), listen(button1, "click", prevent_default(
	        /*click_handler_1*/
	        ctx[15]))];
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*todayTotal*/
	      8) set_data(t4,
	      /*todayTotal*/
	      ctx[3]);
	      if (dirty &
	      /*weekTotal*/
	      4) set_data(t10,
	      /*weekTotal*/
	      ctx[2]);

	      if (dirty &
	      /*format, days, highest, window*/
	      18) {
	        each_value =
	        /*days*/
	        ctx[1];

	        var _i3;

	        for (_i3 = 0; _i3 < each_value.length; _i3 += 1) {
	          var child_ctx = get_each_context(ctx, each_value, _i3);

	          if (each_blocks[_i3]) {
	            each_blocks[_i3].p(child_ctx, dirty);
	          } else {
	            each_blocks[_i3] = create_each_block(child_ctx);

	            each_blocks[_i3].c();

	            each_blocks[_i3].m(div1, t14);
	          }
	        }

	        for (; _i3 < each_blocks.length; _i3 += 1) {
	          each_blocks[_i3].d(1);
	        }

	        each_blocks.length = each_value.length;
	      }

	      if (!
	      /*loading*/
	      ctx[0] &&
	      /*weekTotal*/
	      ctx[2] === 0) {
	        if (if_block0) {
	          if_block0.p(ctx, dirty);
	        } else {
	          if_block0 = create_if_block_1();
	          if_block0.c();
	          if_block0.m(div1, null);
	        }
	      } else if (if_block0) {
	        if_block0.d(1);
	        if_block0 = null;
	      }

	      if (dirty &
	      /*currentWeek*/
	      64) set_data(t20,
	      /*currentWeek*/
	      ctx[6]);
	      if (dirty &
	      /*dayCursor*/
	      32 && t23_value !== (t23_value = format(startOfWeek(
	      /*dayCursor*/
	      ctx[5],
	      /*localeOptions*/
	      ctx[7]), "iiiiii d.MM.Y") + "")) set_data(t23, t23_value);
	      if (dirty &
	      /*dayCursor*/
	      32 && t25_value !== (t25_value = format(endOfWeek(
	      /*dayCursor*/
	      ctx[5],
	      /*localeOptions*/
	      ctx[7]), "iiiiii d.MM.Y") + "")) set_data(t25, t25_value);
	      if (dirty &
	      /*dayCursor*/
	      32) show_if = !isSameDay(startOfToday(),
	      /*dayCursor*/
	      ctx[5]);

	      if (show_if) {
	        if (if_block1) {
	          if_block1.p(ctx, dirty);
	        } else {
	          if_block1 = create_if_block(ctx);
	          if_block1.c();
	          if_block1.m(nav, null);
	        }
	      } else if (if_block1) {
	        if_block1.d(1);
	        if_block1 = null;
	      }

	      if (dirty &
	      /*loading*/
	      1 && div3_class_value !== (div3_class_value = "".concat(
	      /*loading*/
	      ctx[0] ? "icon-loading" : ""))) {
	        attr(div3, "class", div3_class_value);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(h2);
	      if (detaching) detach(t1);
	      if (detaching) detach(div3);
	      destroy_each(each_blocks, detaching);
	      if (if_block0) if_block0.d();
	      if (if_block1) if_block1.d();
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function instance($$self, $$props, $$invalidate) {
	  var statsApiUrl = $$props.statsApiUrl;
	  var requestToken = $$props.requestToken;
	  var localeOptions = {
	    weekStartsOn: 1
	  };

	  var updateWeek = function updateWeek() {
	    $$invalidate(2, weekTotal = 0);
	    $$invalidate(3, todayTotal = 0);
	    $$invalidate(4, highest = 0);
	    $$invalidate(6, currentWeek = getWeek(dayCursor, localeOptions));
	  };

	  onMount( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            updateWeek();
	            loadData();

	          case 2:
	          case "end":
	            return _context.stop();
	        }
	      }
	    }, _callee);
	  })));

	  var loadData = /*#__PURE__*/function () {
	    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
	      var monday, _iterator, _step, day;

	      return regeneratorRuntime.wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              $$invalidate(0, loading = true);
	              monday = startOfWeek(dayCursor, localeOptions);
	              $$invalidate(1, days = [{
	                date: monday
	              }, {
	                date: addDays(monday, 1)
	              }, {
	                date: addDays(monday, 2)
	              }, {
	                date: addDays(monday, 3)
	              }, {
	                date: addDays(monday, 4)
	              }, {
	                date: addDays(monday, 5)
	              }, {
	                date: addDays(monday, 6)
	              }]);
	              _iterator = _createForOfIteratorHelper(days);
	              _context2.prev = 4;

	              _iterator.s();

	            case 6:
	              if ((_step = _iterator.n()).done) {
	                _context2.next = 13;
	                break;
	              }

	              day = _step.value;
	              _context2.next = 10;
	              return loadStatsForDay(day);

	            case 10:
	              day.stats = _context2.sent;

	            case 11:
	              _context2.next = 6;
	              break;

	            case 13:
	              _context2.next = 18;
	              break;

	            case 15:
	              _context2.prev = 15;
	              _context2.t0 = _context2["catch"](4);

	              _iterator.e(_context2.t0);

	            case 18:
	              _context2.prev = 18;

	              _iterator.f();

	              return _context2.finish(18);

	            case 21:
	              days.forEach(function (day) {
	                if (day.stats && day.stats.total) {
	                  // Find highest value
	                  if (day.stats.total > highest) {
	                    $$invalidate(4, highest = day.stats.total);
	                  } // Sum up total


	                  $$invalidate(2, weekTotal += day.stats.total); // Day total

	                  if (isSameDay(day.date, startOfToday())) {
	                    $$invalidate(3, todayTotal += day.stats.total);
	                  }
	                }
	              });
	              $$invalidate(0, loading = false);

	            case 23:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, null, [[4, 15, 18, 21]]);
	    }));

	    return function loadData() {
	      return _ref4.apply(this, arguments);
	    };
	  }();

	  var loadStatsForDay = /*#__PURE__*/function () {
	    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(day) {
	      var start, end, stats;
	      return regeneratorRuntime.wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              start = format(startOfDay(day.date), "yyyy-MM-dd HH:mm:ss");
	              end = format(endOfDay(day.date), "yyyy-MM-dd HH:mm:ss");
	              _context3.next = 4;
	              return fetch("".concat(statsApiUrl, "?start=").concat(start, "&end=").concat(end), {
	                method: "GET",
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 4:
	              stats = _context3.sent;
	              _context3.next = 7;
	              return stats.json();

	            case 7:
	              return _context3.abrupt("return", _context3.sent);

	            case 8:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3);
	    }));

	    return function loadStatsForDay(_x) {
	      return _ref5.apply(this, arguments);
	    };
	  }();

	  var weekNavigation = function weekNavigation(mode) {
	    if (mode === "reset") {
	      $$invalidate(5, dayCursor = startOfToday());
	    } else if (mode === "next") {
	      $$invalidate(5, dayCursor = addWeeks(dayCursor, 1));
	    } else {
	      $$invalidate(5, dayCursor = subWeeks(dayCursor, 1));
	    }

	    updateWeek();
	    loadData();
	  };

	  var click_handler = function click_handler() {
	    return weekNavigation("previous");
	  };

	  var click_handler_1 = function click_handler_1() {
	    return weekNavigation("next");
	  };

	  var click_handler_2 = function click_handler_2() {
	    return weekNavigation("reset");
	  };

	  $$self.$set = function ($$props) {
	    if ("statsApiUrl" in $$props) $$invalidate(9, statsApiUrl = $$props.statsApiUrl);
	    if ("requestToken" in $$props) $$invalidate(10, requestToken = $$props.requestToken);
	  };

	  var loading;
	  var days;
	  var weekTotal;
	  var todayTotal;
	  var highest;
	  var dayCursor;
	  var currentWeek;

	   $$invalidate(0, loading = false);

	   $$invalidate(1, days = []);

	   $$invalidate(2, weekTotal = 0);

	   $$invalidate(3, todayTotal = 0);

	   $$invalidate(4, highest = 0);

	   $$invalidate(5, dayCursor = startOfToday());

	   $$invalidate(6, currentWeek = null);

	  return [loading, days, weekTotal, todayTotal, highest, dayCursor, currentWeek, localeOptions, weekNavigation, statsApiUrl, requestToken, updateWeek, loadData, loadStatsForDay, click_handler, click_handler_1, click_handler_2];
	}

	var Statistics = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(Statistics, _SvelteComponent);

	  var _super = _createSuper(Statistics);

	  function Statistics(options) {
	    var _this;

	    _classCallCheck(this, Statistics);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
	      statsApiUrl: 9,
	      requestToken: 10
	    });
	    return _this;
	  }

	  return Statistics;
	}(SvelteComponent);

	function create_fragment$1(ctx) {
	  var div0;
	  var t;
	  var div1;
	  var div1_class_value;
	  var current;
	  var default_slot_template =
	  /*$$slots*/
	  ctx[2].default;
	  var default_slot = create_slot(default_slot_template, ctx,
	  /*$$scope*/
	  ctx[1], null);
	  return {
	    c() {
	      div0 = element("div");
	      t = space();
	      div1 = element("div");
	      if (default_slot) default_slot.c();
	      attr(div0, "class", "oc-dialog-dim");
	      attr(div1, "class", div1_class_value = "oc-dialog ".concat(
	      /*loading*/
	      ctx[0] ? "icon-loading" : ""));
	      set_style(div1, "position", "fixed");
	    },

	    m(target, anchor) {
	      insert(target, div0, anchor);
	      insert(target, t, anchor);
	      insert(target, div1, anchor);

	      if (default_slot) {
	        default_slot.m(div1, null);
	      }

	      current = true;
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (default_slot) {
	        if (default_slot.p && dirty &
	        /*$$scope*/
	        2) {
	          update_slot(default_slot, default_slot_template, ctx,
	          /*$$scope*/
	          ctx[1], dirty, null, null);
	        }
	      }

	      if (!current || dirty &
	      /*loading*/
	      1 && div1_class_value !== (div1_class_value = "oc-dialog ".concat(
	      /*loading*/
	      ctx[0] ? "icon-loading" : ""))) {
	        attr(div1, "class", div1_class_value);
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(default_slot, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(default_slot, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div0);
	      if (detaching) detach(t);
	      if (detaching) detach(div1);
	      if (default_slot) default_slot.d(detaching);
	    }

	  };
	}

	function instance$1($$self, $$props, $$invalidate) {
	  var _$$props$loading = $$props.loading,
	      loading = _$$props$loading === void 0 ? false : _$$props$loading;
	  var _$$props$$$slots = $$props.$$slots,
	      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
	      $$scope = $$props.$$scope;

	  $$self.$set = function ($$props) {
	    if ("loading" in $$props) $$invalidate(0, loading = $$props.loading);
	    if ("$$scope" in $$props) $$invalidate(1, $$scope = $$props.$$scope);
	  };

	  return [loading, $$scope, $$slots];
	}

	var Overlay = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(Overlay, _SvelteComponent);

	  var _super = _createSuper(Overlay);

	  function Overlay(options) {
	    var _this;

	    _classCallCheck(this, Overlay);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, {
	      loading: 0
	    });
	    return _this;
	  }

	  return Overlay;
	}(SvelteComponent);

	function create_if_block$1(ctx) {
	  var button;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      button = element("button");
	      button.textContent = "".concat(window.t("timemanager", "Cancel"));
	      attr(button, "type", "reset");
	      attr(button, "class", "button");
	    },

	    m(target, anchor) {
	      insert(target, button, anchor);

	      if (!mounted) {
	        dispose = listen(button, "click", prevent_default(function () {
	          if (is_function(
	          /*onCancel*/
	          ctx[3]))
	            /*onCancel*/
	            ctx[3].apply(this, arguments);
	        }));
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	    },

	    d(detaching) {
	      if (detaching) detach(button);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function create_fragment$2(ctx) {
	  var div1;
	  var h3;
	  var t0;
	  var t1;
	  var form;
	  var label0;
	  var t2_value = window.t("timemanager", "Client name") + "";
	  var t2;
	  var t3;
	  var br0;
	  var t4;
	  var input0;
	  var input0_placeholder_value;
	  var t5;
	  var label1;
	  var t6_value = window.t("timemanager", "Note") + "";
	  var t6;
	  var t7;
	  var br1;
	  var t8;
	  var textarea;
	  var t9;
	  var input1;
	  var t10;
	  var div0;
	  var button;
	  var t11;
	  var t12;
	  var mounted;
	  var dispose;
	  var if_block = !
	  /*isServer*/
	  ctx[2] && create_if_block$1(ctx);
	  return {
	    c() {
	      div1 = element("div");
	      h3 = element("h3");
	      t0 = text(
	      /*clientEditorCaption*/
	      ctx[5]);
	      t1 = space();
	      form = element("form");
	      label0 = element("label");
	      t2 = text(t2_value);
	      t3 = space();
	      br0 = element("br");
	      t4 = space();
	      input0 = element("input");
	      t5 = space();
	      label1 = element("label");
	      t6 = text(t6_value);
	      t7 = space();
	      br1 = element("br");
	      t8 = space();
	      textarea = element("textarea");
	      t9 = space();
	      input1 = element("input");
	      t10 = space();
	      div0 = element("div");
	      button = element("button");
	      t11 = text(
	      /*clientEditorButtonCaption*/
	      ctx[4]);
	      t12 = space();
	      if (if_block) if_block.c();
	      input0.autofocus = true;
	      attr(input0, "type", "text");
	      set_style(input0, "width", "100%");
	      attr(input0, "class", "input-wide");
	      attr(input0, "name", "name");
	      attr(input0, "placeholder", input0_placeholder_value = window.t("timemanager", "Example Corp."));
	      input0.required = true;
	      attr(label0, "class", "space-top");
	      set_style(textarea, "width", "100%");
	      attr(textarea, "class", "input-wide");
	      attr(textarea, "name", "note");
	      attr(textarea, "placeholder", "");
	      textarea.value =
	      /*note*/
	      ctx[7];
	      attr(label1, "class", "space-top");
	      attr(input1, "type", "hidden");
	      attr(input1, "name", "requesttoken");
	      input1.value =
	      /*requestToken*/
	      ctx[1];
	      attr(button, "type", "submit");
	      attr(button, "class", "button primary");
	      attr(div0, "class", "oc-dialog-buttonrow twobuttons reverse");
	      attr(form, "action",
	      /*action*/
	      ctx[0]);
	      attr(form, "method", "post");
	      attr(div1, "class", "inner tm_new-item");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, h3);
	      append(h3, t0);
	      append(div1, t1);
	      append(div1, form);
	      append(form, label0);
	      append(label0, t2);
	      append(label0, t3);
	      append(label0, br0);
	      append(label0, t4);
	      append(label0, input0);
	      set_input_value(input0,
	      /*name*/
	      ctx[6]);
	      append(form, t5);
	      append(form, label1);
	      append(label1, t6);
	      append(label1, t7);
	      append(label1, br1);
	      append(label1, t8);
	      append(label1, textarea);
	      append(form, t9);
	      append(form, input1);
	      append(form, t10);
	      append(form, div0);
	      append(div0, button);
	      append(button, t11);
	      append(div0, t12);
	      if (if_block) if_block.m(div0, null);
	      input0.focus();

	      if (!mounted) {
	        dispose = [listen(input0, "input",
	        /*input0_input_handler*/
	        ctx[11]), listen(textarea, "input",
	        /*input_handler*/
	        ctx[12]), listen(form, "submit", prevent_default(
	        /*submit*/
	        ctx[8]))];
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*clientEditorCaption*/
	      32) set_data(t0,
	      /*clientEditorCaption*/
	      ctx[5]);

	      if (dirty &
	      /*name*/
	      64 && input0.value !==
	      /*name*/
	      ctx[6]) {
	        set_input_value(input0,
	        /*name*/
	        ctx[6]);
	      }

	      if (dirty &
	      /*note*/
	      128) {
	        textarea.value =
	        /*note*/
	        ctx[7];
	      }

	      if (dirty &
	      /*requestToken*/
	      2) {
	        input1.value =
	        /*requestToken*/
	        ctx[1];
	      }

	      if (dirty &
	      /*clientEditorButtonCaption*/
	      16) set_data(t11,
	      /*clientEditorButtonCaption*/
	      ctx[4]);

	      if (!
	      /*isServer*/
	      ctx[2]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block$1(ctx);
	          if_block.c();
	          if_block.m(div0, null);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }

	      if (dirty &
	      /*action*/
	      1) {
	        attr(form, "action",
	        /*action*/
	        ctx[0]);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div1);
	      if (if_block) if_block.d();
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function instance$2($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var requestToken = $$props.requestToken;
	  var isServer = $$props.isServer;
	  var onCancel = $$props.onCancel;
	  var onSubmit = $$props.onSubmit;
	  var clientEditorButtonCaption = $$props.clientEditorButtonCaption;
	  var clientEditorCaption = $$props.clientEditorCaption;
	  var editClientData = $$props.editClientData;
	  var name = editClientData ? editClientData.name : "";
	  var note = editClientData ? editClientData.note : "";

	  var submit = function submit() {
	    onSubmit({
	      name,
	      note
	    });
	  };

	  function input0_input_handler() {
	    name = this.value;
	    $$invalidate(6, name);
	  }

	  var input_handler = function input_handler(e) {
	    return $$invalidate(7, note = e.target.value);
	  };

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("isServer" in $$props) $$invalidate(2, isServer = $$props.isServer);
	    if ("onCancel" in $$props) $$invalidate(3, onCancel = $$props.onCancel);
	    if ("onSubmit" in $$props) $$invalidate(9, onSubmit = $$props.onSubmit);
	    if ("clientEditorButtonCaption" in $$props) $$invalidate(4, clientEditorButtonCaption = $$props.clientEditorButtonCaption);
	    if ("clientEditorCaption" in $$props) $$invalidate(5, clientEditorCaption = $$props.clientEditorCaption);
	    if ("editClientData" in $$props) $$invalidate(10, editClientData = $$props.editClientData);
	  };

	  return [action, requestToken, isServer, onCancel, clientEditorButtonCaption, clientEditorCaption, name, note, submit, onSubmit, editClientData, input0_input_handler, input_handler];
	}

	var ClientEditor = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(ClientEditor, _SvelteComponent);

	  var _super = _createSuper(ClientEditor);

	  function ClientEditor(options) {
	    var _this;

	    _classCallCheck(this, ClientEditor);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, {
	      action: 0,
	      requestToken: 1,
	      isServer: 2,
	      onCancel: 3,
	      onSubmit: 9,
	      clientEditorButtonCaption: 4,
	      clientEditorCaption: 5,
	      editClientData: 10
	    });
	    return _this;
	  }

	  return ClientEditor;
	}(SvelteComponent);

	var Helpers = /*#__PURE__*/function () {
	  function Helpers() {
	    _classCallCheck(this, Helpers);
	  }

	  _createClass(Helpers, null, [{
	    key: "replaceNode",
	    // Helps replacing a SSR node with a Svelte component
	    value: function replaceNode(node) {
	      if (node) {
	        node.innerHTML = "";
	      }

	      return node;
	    }
	  }, {
	    key: "hideFallbacks",
	    value: function hideFallbacks(fileName) {
	      var nodes = document.querySelectorAll("[data-svelte-hide=\"".concat(fileName, "\"]"));

	      if (nodes && nodes.length) {
	        nodes.forEach(function (node) {
	          return node.remove();
	        });
	      }
	    }
	  }]);

	  return Helpers;
	}();

	function create_if_block$2(ctx) {
	  var current;
	  var overlay = new Overlay({
	    props: {
	      loading:
	      /*loading*/
	      ctx[6],
	      $$slots: {
	        default: [create_default_slot]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      create_component(overlay.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(overlay, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var overlay_changes = {};
	      if (dirty &
	      /*loading*/
	      64) overlay_changes.loading =
	      /*loading*/
	      ctx[6];

	      if (dirty &
	      /*$$scope, action, requestToken, show, clientEditorButtonCaption, clientEditorCaption, editClientData*/
	      4159) {
	        overlay_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      overlay.$set(overlay_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(overlay.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(overlay.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(overlay, detaching);
	    }

	  };
	} // (56:1) <Overlay {loading}>


	function create_default_slot(ctx) {
	  var current;
	  var clienteditor = new ClientEditor({
	    props: {
	      action:
	      /*action*/
	      ctx[0],
	      requestToken:
	      /*requestToken*/
	      ctx[1],
	      onCancel:
	      /*func*/
	      ctx[11],
	      onSubmit:
	      /*save*/
	      ctx[7],
	      clientEditorButtonCaption:
	      /*clientEditorButtonCaption*/
	      ctx[2],
	      clientEditorCaption:
	      /*clientEditorCaption*/
	      ctx[3],
	      editClientData:
	      /*editClientData*/
	      ctx[4]
	    }
	  });
	  return {
	    c() {
	      create_component(clienteditor.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(clienteditor, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var clienteditor_changes = {};
	      if (dirty &
	      /*action*/
	      1) clienteditor_changes.action =
	      /*action*/
	      ctx[0];
	      if (dirty &
	      /*requestToken*/
	      2) clienteditor_changes.requestToken =
	      /*requestToken*/
	      ctx[1];
	      if (dirty &
	      /*show*/
	      32) clienteditor_changes.onCancel =
	      /*func*/
	      ctx[11];
	      if (dirty &
	      /*clientEditorButtonCaption*/
	      4) clienteditor_changes.clientEditorButtonCaption =
	      /*clientEditorButtonCaption*/
	      ctx[2];
	      if (dirty &
	      /*clientEditorCaption*/
	      8) clienteditor_changes.clientEditorCaption =
	      /*clientEditorCaption*/
	      ctx[3];
	      if (dirty &
	      /*editClientData*/
	      16) clienteditor_changes.editClientData =
	      /*editClientData*/
	      ctx[4];
	      clienteditor.$set(clienteditor_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(clienteditor.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(clienteditor.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(clienteditor, detaching);
	    }

	  };
	}

	function create_fragment$3(ctx) {
	  var a;
	  var span;
	  var t0;
	  var t1;
	  var if_block_anchor;
	  var current;
	  var mounted;
	  var dispose;
	  var if_block =
	  /*show*/
	  ctx[5] && create_if_block$2(ctx);
	  return {
	    c() {
	      a = element("a");
	      span = element("span");
	      t0 = text(
	      /*clientEditorButtonCaption*/
	      ctx[2]);
	      t1 = space();
	      if (if_block) if_block.c();
	      if_block_anchor = empty();
	      attr(a, "href", "#/");
	      attr(a, "class", "button primary new");
	    },

	    m(target, anchor) {
	      insert(target, a, anchor);
	      append(a, span);
	      append(span, t0);
	      insert(target, t1, anchor);
	      if (if_block) if_block.m(target, anchor);
	      insert(target, if_block_anchor, anchor);
	      current = true;

	      if (!mounted) {
	        dispose = listen(a, "click", prevent_default(
	        /*click_handler*/
	        ctx[10]));
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (!current || dirty &
	      /*clientEditorButtonCaption*/
	      4) set_data(t0,
	      /*clientEditorButtonCaption*/
	      ctx[2]);

	      if (
	      /*show*/
	      ctx[5]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);

	          if (dirty &
	          /*show*/
	          32) {
	            transition_in(if_block, 1);
	          }
	        } else {
	          if_block = create_if_block$2(ctx);
	          if_block.c();
	          transition_in(if_block, 1);
	          if_block.m(if_block_anchor.parentNode, if_block_anchor);
	        }
	      } else if (if_block) {
	        group_outros();
	        transition_out(if_block, 1, 1, function () {
	          if_block = null;
	        });
	        check_outros();
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(a);
	      if (detaching) detach(t1);
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(if_block_anchor);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function instance$3($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var editAction = $$props.editAction;
	  var requestToken = $$props.requestToken;
	  var clientEditorButtonCaption = $$props.clientEditorButtonCaption;
	  var clientEditorCaption = $$props.clientEditorCaption;
	  var clientUuid = $$props.clientUuid;
	  var editClientData = $$props.editClientData;
	  onMount(function () {
	    Helpers.hideFallbacks("ClientEditor.svelte");
	  });

	  var save = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
	      var name, note, client, response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              name = _ref4.name, note = _ref4.note;
	              $$invalidate(6, loading = true);
	              _context.prev = 2;
	              client = {
	                name,
	                note
	              };

	              if (clientUuid) {
	                client = _objectSpread2(_objectSpread2({}, client), {}, {
	                  uuid: clientUuid
	                });
	              }

	              _context.next = 7;
	              return fetch(clientUuid ? editAction : action, {
	                method: clientUuid ? "PATCH" : "POST",
	                body: JSON.stringify(client),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 7:
	              response = _context.sent;

	              if (response && response.ok) {
	                $$invalidate(5, show = false);

	                if (clientUuid) {
	                  document.querySelector(".app-timemanager [data-current-link]").click();
	                } else {
	                  document.querySelector("#app-navigation a.active").click();
	                }
	              }

	              _context.next = 14;
	              break;

	            case 11:
	              _context.prev = 11;
	              _context.t0 = _context["catch"](2);
	              console.error(_context.t0);

	            case 14:
	              $$invalidate(6, loading = false);

	            case 15:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[2, 11]]);
	    }));

	    return function save(_x) {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var click_handler = function click_handler() {
	    return $$invalidate(5, show = !show);
	  };

	  var func = function func() {
	    return $$invalidate(5, show = false);
	  };

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("editAction" in $$props) $$invalidate(8, editAction = $$props.editAction);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("clientEditorButtonCaption" in $$props) $$invalidate(2, clientEditorButtonCaption = $$props.clientEditorButtonCaption);
	    if ("clientEditorCaption" in $$props) $$invalidate(3, clientEditorCaption = $$props.clientEditorCaption);
	    if ("clientUuid" in $$props) $$invalidate(9, clientUuid = $$props.clientUuid);
	    if ("editClientData" in $$props) $$invalidate(4, editClientData = $$props.editClientData);
	  };

	  var show;
	  var loading;

	   $$invalidate(5, show = false);

	   $$invalidate(6, loading = false);

	  return [action, requestToken, clientEditorButtonCaption, clientEditorCaption, editClientData, show, loading, save, editAction, clientUuid, click_handler, func];
	}

	var ClientEditorDialog = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(ClientEditorDialog, _SvelteComponent);

	  var _super = _createSuper(ClientEditorDialog);

	  function ClientEditorDialog(options) {
	    var _this;

	    _classCallCheck(this, ClientEditorDialog);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, {
	      action: 0,
	      editAction: 8,
	      requestToken: 1,
	      clientEditorButtonCaption: 2,
	      clientEditorCaption: 3,
	      clientUuid: 9,
	      editClientData: 4
	    });
	    return _this;
	  }

	  return ClientEditorDialog;
	}(SvelteComponent);

	function create_if_block$3(ctx) {
	  var button;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      button = element("button");
	      button.textContent = "".concat(window.t("timemanager", "Cancel"));
	      attr(button, "type", "reset");
	      attr(button, "class", "button");
	    },

	    m(target, anchor) {
	      insert(target, button, anchor);

	      if (!mounted) {
	        dispose = listen(button, "click", prevent_default(function () {
	          if (is_function(
	          /*onCancel*/
	          ctx[4]))
	            /*onCancel*/
	            ctx[4].apply(this, arguments);
	        }));
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	    },

	    d(detaching) {
	      if (detaching) detach(button);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function create_fragment$4(ctx) {
	  var div1;
	  var h3;
	  var t0;
	  var t1;
	  var form;
	  var label0;
	  var t2_value = window.t("timemanager", "Project name") + "";
	  var t2;
	  var t3;
	  var br0;
	  var t4;
	  var input0;
	  var input0_placeholder_value;
	  var t5;
	  var label1;
	  var t6_value = window.t("timemanager", "For client") + "";
	  var t6;
	  var t7;
	  var br1;
	  var t8;
	  var strong;
	  var t9;
	  var t10;
	  var br2;
	  var t11;
	  var input1;
	  var t12;
	  var div0;
	  var button;
	  var t13;
	  var t14;
	  var mounted;
	  var dispose;
	  var if_block = !
	  /*isServer*/
	  ctx[3] && create_if_block$3(ctx);
	  return {
	    c() {
	      div1 = element("div");
	      h3 = element("h3");
	      t0 = text(
	      /*projectEditorCaption*/
	      ctx[6]);
	      t1 = space();
	      form = element("form");
	      label0 = element("label");
	      t2 = text(t2_value);
	      t3 = space();
	      br0 = element("br");
	      t4 = space();
	      input0 = element("input");
	      t5 = space();
	      label1 = element("label");
	      t6 = text(t6_value);
	      t7 = space();
	      br1 = element("br");
	      t8 = space();
	      strong = element("strong");
	      t9 = text(
	      /*clientName*/
	      ctx[2]);
	      t10 = space();
	      br2 = element("br");
	      t11 = space();
	      input1 = element("input");
	      t12 = space();
	      div0 = element("div");
	      button = element("button");
	      t13 = text(
	      /*projectEditorButtonCaption*/
	      ctx[5]);
	      t14 = space();
	      if (if_block) if_block.c();
	      input0.autofocus = true;
	      attr(input0, "type", "text");
	      set_style(input0, "width", "100%");
	      attr(input0, "class", "input-wide");
	      attr(input0, "name", "name");
	      attr(input0, "placeholder", input0_placeholder_value = window.t("timemanager", "A project name"));
	      input0.required = true;
	      attr(label0, "class", "space-top");
	      attr(label1, "class", "space-top");
	      attr(input1, "type", "hidden");
	      attr(input1, "name", "requesttoken");
	      input1.value =
	      /*requestToken*/
	      ctx[1];
	      attr(button, "type", "submit");
	      attr(button, "class", "button primary");
	      attr(div0, "class", "oc-dialog-buttonrow twobuttons reverse");
	      attr(form, "action",
	      /*action*/
	      ctx[0]);
	      attr(form, "method", "post");
	      attr(div1, "class", "inner tm_new-item");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, h3);
	      append(h3, t0);
	      append(div1, t1);
	      append(div1, form);
	      append(form, label0);
	      append(label0, t2);
	      append(label0, t3);
	      append(label0, br0);
	      append(label0, t4);
	      append(label0, input0);
	      set_input_value(input0,
	      /*name*/
	      ctx[7]);
	      append(form, t5);
	      append(form, label1);
	      append(label1, t6);
	      append(label1, t7);
	      append(label1, br1);
	      append(label1, t8);
	      append(label1, strong);
	      append(strong, t9);
	      append(form, t10);
	      append(form, br2);
	      append(form, t11);
	      append(form, input1);
	      append(form, t12);
	      append(form, div0);
	      append(div0, button);
	      append(button, t13);
	      append(div0, t14);
	      if (if_block) if_block.m(div0, null);
	      input0.focus();

	      if (!mounted) {
	        dispose = [listen(input0, "input",
	        /*input0_input_handler*/
	        ctx[11]), listen(form, "submit", prevent_default(
	        /*submit*/
	        ctx[8]))];
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*projectEditorCaption*/
	      64) set_data(t0,
	      /*projectEditorCaption*/
	      ctx[6]);

	      if (dirty &
	      /*name*/
	      128 && input0.value !==
	      /*name*/
	      ctx[7]) {
	        set_input_value(input0,
	        /*name*/
	        ctx[7]);
	      }

	      if (dirty &
	      /*clientName*/
	      4) set_data(t9,
	      /*clientName*/
	      ctx[2]);

	      if (dirty &
	      /*requestToken*/
	      2) {
	        input1.value =
	        /*requestToken*/
	        ctx[1];
	      }

	      if (dirty &
	      /*projectEditorButtonCaption*/
	      32) set_data(t13,
	      /*projectEditorButtonCaption*/
	      ctx[5]);

	      if (!
	      /*isServer*/
	      ctx[3]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block$3(ctx);
	          if_block.c();
	          if_block.m(div0, null);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }

	      if (dirty &
	      /*action*/
	      1) {
	        attr(form, "action",
	        /*action*/
	        ctx[0]);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div1);
	      if (if_block) if_block.d();
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function instance$4($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var requestToken = $$props.requestToken;
	  var clientName = $$props.clientName;
	  var isServer = $$props.isServer;
	  var onCancel = $$props.onCancel;
	  var onSubmit = $$props.onSubmit;
	  var projectEditorButtonCaption = $$props.projectEditorButtonCaption;
	  var projectEditorCaption = $$props.projectEditorCaption;
	  var editProjectData = $$props.editProjectData;
	  var name = editProjectData ? editProjectData.name : "";

	  var submit = function submit() {
	    onSubmit({
	      name
	    });
	  };

	  function input0_input_handler() {
	    name = this.value;
	    $$invalidate(7, name);
	  }

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
	    if ("isServer" in $$props) $$invalidate(3, isServer = $$props.isServer);
	    if ("onCancel" in $$props) $$invalidate(4, onCancel = $$props.onCancel);
	    if ("onSubmit" in $$props) $$invalidate(9, onSubmit = $$props.onSubmit);
	    if ("projectEditorButtonCaption" in $$props) $$invalidate(5, projectEditorButtonCaption = $$props.projectEditorButtonCaption);
	    if ("projectEditorCaption" in $$props) $$invalidate(6, projectEditorCaption = $$props.projectEditorCaption);
	    if ("editProjectData" in $$props) $$invalidate(10, editProjectData = $$props.editProjectData);
	  };

	  return [action, requestToken, clientName, isServer, onCancel, projectEditorButtonCaption, projectEditorCaption, name, submit, onSubmit, editProjectData, input0_input_handler];
	}

	var ProjectEditor = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(ProjectEditor, _SvelteComponent);

	  var _super = _createSuper(ProjectEditor);

	  function ProjectEditor(options) {
	    var _this;

	    _classCallCheck(this, ProjectEditor);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, {
	      action: 0,
	      requestToken: 1,
	      clientName: 2,
	      isServer: 3,
	      onCancel: 4,
	      onSubmit: 9,
	      projectEditorButtonCaption: 5,
	      projectEditorCaption: 6,
	      editProjectData: 10
	    });
	    return _this;
	  }

	  return ProjectEditor;
	}(SvelteComponent);

	function create_if_block$4(ctx) {
	  var current;
	  var overlay = new Overlay({
	    props: {
	      loading:
	      /*loading*/
	      ctx[8],
	      $$slots: {
	        default: [create_default_slot$1]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      create_component(overlay.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(overlay, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var overlay_changes = {};
	      if (dirty &
	      /*loading*/
	      256) overlay_changes.loading =
	      /*loading*/
	      ctx[8];

	      if (dirty &
	      /*$$scope, action, requestToken, show, clientName, isServer, projectEditorButtonCaption, projectEditorCaption, editProjectData*/
	      16639) {
	        overlay_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      overlay.$set(overlay_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(overlay.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(overlay.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(overlay, detaching);
	    }

	  };
	} // (54:1) <Overlay {loading}>


	function create_default_slot$1(ctx) {
	  var current;
	  var projecteditor = new ProjectEditor({
	    props: {
	      action:
	      /*action*/
	      ctx[0],
	      requestToken:
	      /*requestToken*/
	      ctx[1],
	      onCancel:
	      /*func*/
	      ctx[13],
	      onSubmit:
	      /*save*/
	      ctx[9],
	      clientName:
	      /*clientName*/
	      ctx[2],
	      isServer:
	      /*isServer*/
	      ctx[3],
	      projectEditorButtonCaption:
	      /*projectEditorButtonCaption*/
	      ctx[4],
	      projectEditorCaption:
	      /*projectEditorCaption*/
	      ctx[5],
	      editProjectData:
	      /*editProjectData*/
	      ctx[6]
	    }
	  });
	  return {
	    c() {
	      create_component(projecteditor.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(projecteditor, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var projecteditor_changes = {};
	      if (dirty &
	      /*action*/
	      1) projecteditor_changes.action =
	      /*action*/
	      ctx[0];
	      if (dirty &
	      /*requestToken*/
	      2) projecteditor_changes.requestToken =
	      /*requestToken*/
	      ctx[1];
	      if (dirty &
	      /*show*/
	      128) projecteditor_changes.onCancel =
	      /*func*/
	      ctx[13];
	      if (dirty &
	      /*clientName*/
	      4) projecteditor_changes.clientName =
	      /*clientName*/
	      ctx[2];
	      if (dirty &
	      /*isServer*/
	      8) projecteditor_changes.isServer =
	      /*isServer*/
	      ctx[3];
	      if (dirty &
	      /*projectEditorButtonCaption*/
	      16) projecteditor_changes.projectEditorButtonCaption =
	      /*projectEditorButtonCaption*/
	      ctx[4];
	      if (dirty &
	      /*projectEditorCaption*/
	      32) projecteditor_changes.projectEditorCaption =
	      /*projectEditorCaption*/
	      ctx[5];
	      if (dirty &
	      /*editProjectData*/
	      64) projecteditor_changes.editProjectData =
	      /*editProjectData*/
	      ctx[6];
	      projecteditor.$set(projecteditor_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(projecteditor.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(projecteditor.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(projecteditor, detaching);
	    }

	  };
	}

	function create_fragment$5(ctx) {
	  var a;
	  var span;
	  var t0;
	  var t1;
	  var if_block_anchor;
	  var current;
	  var mounted;
	  var dispose;
	  var if_block =
	  /*show*/
	  ctx[7] && create_if_block$4(ctx);
	  return {
	    c() {
	      a = element("a");
	      span = element("span");
	      t0 = text(
	      /*projectEditorButtonCaption*/
	      ctx[4]);
	      t1 = space();
	      if (if_block) if_block.c();
	      if_block_anchor = empty();
	      attr(a, "href", "#/");
	      attr(a, "class", "button primary new");
	    },

	    m(target, anchor) {
	      insert(target, a, anchor);
	      append(a, span);
	      append(span, t0);
	      insert(target, t1, anchor);
	      if (if_block) if_block.m(target, anchor);
	      insert(target, if_block_anchor, anchor);
	      current = true;

	      if (!mounted) {
	        dispose = listen(a, "click", prevent_default(
	        /*click_handler*/
	        ctx[12]));
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (!current || dirty &
	      /*projectEditorButtonCaption*/
	      16) set_data(t0,
	      /*projectEditorButtonCaption*/
	      ctx[4]);

	      if (
	      /*show*/
	      ctx[7]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);

	          if (dirty &
	          /*show*/
	          128) {
	            transition_in(if_block, 1);
	          }
	        } else {
	          if_block = create_if_block$4(ctx);
	          if_block.c();
	          transition_in(if_block, 1);
	          if_block.m(if_block_anchor.parentNode, if_block_anchor);
	        }
	      } else if (if_block) {
	        group_outros();
	        transition_out(if_block, 1, 1, function () {
	          if_block = null;
	        });
	        check_outros();
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(a);
	      if (detaching) detach(t1);
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(if_block_anchor);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function instance$5($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var editAction = $$props.editAction;
	  var requestToken = $$props.requestToken;
	  var clientName = $$props.clientName;
	  var isServer = $$props.isServer;
	  var projectEditorButtonCaption = $$props.projectEditorButtonCaption;
	  var projectEditorCaption = $$props.projectEditorCaption;
	  var projectUuid = $$props.projectUuid;
	  var editProjectData = $$props.editProjectData;
	  onMount(function () {
	    Helpers.hideFallbacks("ProjectEditor.svelte");
	  });

	  var save = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
	      var name, project, response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              name = _ref4.name;
	              $$invalidate(8, loading = true);
	              _context.prev = 2;
	              project = {
	                name
	              };

	              if (projectUuid) {
	                project = _objectSpread2(_objectSpread2({}, project), {}, {
	                  uuid: projectUuid
	                });
	              }

	              _context.next = 7;
	              return fetch(projectUuid ? editAction : action, {
	                method: projectUuid ? "PATCH" : "POST",
	                body: JSON.stringify(project),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 7:
	              response = _context.sent;

	              if (response && response.ok) {
	                $$invalidate(7, show = false);
	                document.querySelector(".app-timemanager [data-current-link]").click();
	              }

	              _context.next = 14;
	              break;

	            case 11:
	              _context.prev = 11;
	              _context.t0 = _context["catch"](2);
	              console.error(_context.t0);

	            case 14:
	              $$invalidate(8, loading = false);

	            case 15:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[2, 11]]);
	    }));

	    return function save(_x) {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var click_handler = function click_handler() {
	    return $$invalidate(7, show = !show);
	  };

	  var func = function func() {
	    return $$invalidate(7, show = false);
	  };

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("editAction" in $$props) $$invalidate(10, editAction = $$props.editAction);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
	    if ("isServer" in $$props) $$invalidate(3, isServer = $$props.isServer);
	    if ("projectEditorButtonCaption" in $$props) $$invalidate(4, projectEditorButtonCaption = $$props.projectEditorButtonCaption);
	    if ("projectEditorCaption" in $$props) $$invalidate(5, projectEditorCaption = $$props.projectEditorCaption);
	    if ("projectUuid" in $$props) $$invalidate(11, projectUuid = $$props.projectUuid);
	    if ("editProjectData" in $$props) $$invalidate(6, editProjectData = $$props.editProjectData);
	  };

	  var show;
	  var loading;

	   $$invalidate(7, show = false);

	   $$invalidate(8, loading = false);

	  return [action, requestToken, clientName, isServer, projectEditorButtonCaption, projectEditorCaption, editProjectData, show, loading, save, editAction, projectUuid, click_handler, func];
	}

	var ProjectEditorDialog = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(ProjectEditorDialog, _SvelteComponent);

	  var _super = _createSuper(ProjectEditorDialog);

	  function ProjectEditorDialog(options) {
	    var _this;

	    _classCallCheck(this, ProjectEditorDialog);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, safe_not_equal, {
	      action: 0,
	      editAction: 10,
	      requestToken: 1,
	      clientName: 2,
	      isServer: 3,
	      projectEditorButtonCaption: 4,
	      projectEditorCaption: 5,
	      projectUuid: 11,
	      editProjectData: 6
	    });
	    return _this;
	  }

	  return ProjectEditorDialog;
	}(SvelteComponent);

	function create_if_block$5(ctx) {
	  var button;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      button = element("button");
	      button.textContent = "".concat(window.t("timemanager", "Cancel"));
	      attr(button, "type", "reset");
	      attr(button, "class", "button");
	    },

	    m(target, anchor) {
	      insert(target, button, anchor);

	      if (!mounted) {
	        dispose = listen(button, "click", prevent_default(function () {
	          if (is_function(
	          /*onCancel*/
	          ctx[5]))
	            /*onCancel*/
	            ctx[5].apply(this, arguments);
	        }));
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	    },

	    d(detaching) {
	      if (detaching) detach(button);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function create_fragment$6(ctx) {
	  var div1;
	  var h3;
	  var t0;
	  var t1;
	  var form;
	  var label0;
	  var t2_value = window.t("timemanager", "Task name") + "";
	  var t2;
	  var t3;
	  var br0;
	  var t4;
	  var input0;
	  var input0_placeholder_value;
	  var t5;
	  var label1;
	  var t6_value = window.t("timemanager", "For project") + "";
	  var t6;
	  var t7;
	  var br1;
	  var t8;
	  var strong0;
	  var t9;
	  var t10;
	  var label2;
	  var t11_value = window.t("timemanager", "For client") + "";
	  var t11;
	  var t12;
	  var br2;
	  var t13;
	  var strong1;
	  var t14;
	  var t15;
	  var br3;
	  var t16;
	  var input1;
	  var t17;
	  var div0;
	  var button;
	  var t18;
	  var t19;
	  var mounted;
	  var dispose;
	  var if_block = !
	  /*isServer*/
	  ctx[4] && create_if_block$5(ctx);
	  return {
	    c() {
	      div1 = element("div");
	      h3 = element("h3");
	      t0 = text(
	      /*taskEditorCaption*/
	      ctx[7]);
	      t1 = space();
	      form = element("form");
	      label0 = element("label");
	      t2 = text(t2_value);
	      t3 = space();
	      br0 = element("br");
	      t4 = space();
	      input0 = element("input");
	      t5 = space();
	      label1 = element("label");
	      t6 = text(t6_value);
	      t7 = space();
	      br1 = element("br");
	      t8 = space();
	      strong0 = element("strong");
	      t9 = text(
	      /*projectName*/
	      ctx[3]);
	      t10 = space();
	      label2 = element("label");
	      t11 = text(t11_value);
	      t12 = space();
	      br2 = element("br");
	      t13 = space();
	      strong1 = element("strong");
	      t14 = text(
	      /*clientName*/
	      ctx[2]);
	      t15 = space();
	      br3 = element("br");
	      t16 = space();
	      input1 = element("input");
	      t17 = space();
	      div0 = element("div");
	      button = element("button");
	      t18 = text(
	      /*taskEditorButtonCaption*/
	      ctx[6]);
	      t19 = space();
	      if (if_block) if_block.c();
	      input0.autofocus = true;
	      attr(input0, "type", "text");
	      set_style(input0, "width", "100%");
	      attr(input0, "class", "input-wide");
	      attr(input0, "name", "name");
	      attr(input0, "placeholder", input0_placeholder_value = window.t("timemanager", "A task name"));
	      input0.required = true;
	      attr(label0, "class", "space-top");
	      attr(label1, "class", "space-top");
	      attr(label2, "class", "space-top");
	      attr(input1, "type", "hidden");
	      attr(input1, "name", "requesttoken");
	      input1.value =
	      /*requestToken*/
	      ctx[1];
	      attr(button, "type", "submit");
	      attr(button, "class", "button primary");
	      attr(div0, "class", "oc-dialog-buttonrow twobuttons reverse");
	      attr(form, "action",
	      /*action*/
	      ctx[0]);
	      attr(form, "method", "post");
	      attr(div1, "class", "inner tm_new-item");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, h3);
	      append(h3, t0);
	      append(div1, t1);
	      append(div1, form);
	      append(form, label0);
	      append(label0, t2);
	      append(label0, t3);
	      append(label0, br0);
	      append(label0, t4);
	      append(label0, input0);
	      set_input_value(input0,
	      /*name*/
	      ctx[8]);
	      append(form, t5);
	      append(form, label1);
	      append(label1, t6);
	      append(label1, t7);
	      append(label1, br1);
	      append(label1, t8);
	      append(label1, strong0);
	      append(strong0, t9);
	      append(form, t10);
	      append(form, label2);
	      append(label2, t11);
	      append(label2, t12);
	      append(label2, br2);
	      append(label2, t13);
	      append(label2, strong1);
	      append(strong1, t14);
	      append(form, t15);
	      append(form, br3);
	      append(form, t16);
	      append(form, input1);
	      append(form, t17);
	      append(form, div0);
	      append(div0, button);
	      append(button, t18);
	      append(div0, t19);
	      if (if_block) if_block.m(div0, null);
	      input0.focus();

	      if (!mounted) {
	        dispose = [listen(input0, "input",
	        /*input0_input_handler*/
	        ctx[12]), listen(form, "submit", prevent_default(
	        /*submit*/
	        ctx[9]))];
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*taskEditorCaption*/
	      128) set_data(t0,
	      /*taskEditorCaption*/
	      ctx[7]);

	      if (dirty &
	      /*name*/
	      256 && input0.value !==
	      /*name*/
	      ctx[8]) {
	        set_input_value(input0,
	        /*name*/
	        ctx[8]);
	      }

	      if (dirty &
	      /*projectName*/
	      8) set_data(t9,
	      /*projectName*/
	      ctx[3]);
	      if (dirty &
	      /*clientName*/
	      4) set_data(t14,
	      /*clientName*/
	      ctx[2]);

	      if (dirty &
	      /*requestToken*/
	      2) {
	        input1.value =
	        /*requestToken*/
	        ctx[1];
	      }

	      if (dirty &
	      /*taskEditorButtonCaption*/
	      64) set_data(t18,
	      /*taskEditorButtonCaption*/
	      ctx[6]);

	      if (!
	      /*isServer*/
	      ctx[4]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block$5(ctx);
	          if_block.c();
	          if_block.m(div0, null);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }

	      if (dirty &
	      /*action*/
	      1) {
	        attr(form, "action",
	        /*action*/
	        ctx[0]);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div1);
	      if (if_block) if_block.d();
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function instance$6($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var requestToken = $$props.requestToken;
	  var clientName = $$props.clientName;
	  var projectName = $$props.projectName;
	  var isServer = $$props.isServer;
	  var onCancel = $$props.onCancel;
	  var onSubmit = $$props.onSubmit;
	  var taskEditorButtonCaption = $$props.taskEditorButtonCaption;
	  var taskEditorCaption = $$props.taskEditorCaption;
	  var editTaskData = $$props.editTaskData;
	  var name = editTaskData ? editTaskData.name : "";

	  var submit = function submit() {
	    onSubmit({
	      name
	    });
	  };

	  function input0_input_handler() {
	    name = this.value;
	    $$invalidate(8, name);
	  }

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
	    if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
	    if ("isServer" in $$props) $$invalidate(4, isServer = $$props.isServer);
	    if ("onCancel" in $$props) $$invalidate(5, onCancel = $$props.onCancel);
	    if ("onSubmit" in $$props) $$invalidate(10, onSubmit = $$props.onSubmit);
	    if ("taskEditorButtonCaption" in $$props) $$invalidate(6, taskEditorButtonCaption = $$props.taskEditorButtonCaption);
	    if ("taskEditorCaption" in $$props) $$invalidate(7, taskEditorCaption = $$props.taskEditorCaption);
	    if ("editTaskData" in $$props) $$invalidate(11, editTaskData = $$props.editTaskData);
	  };

	  return [action, requestToken, clientName, projectName, isServer, onCancel, taskEditorButtonCaption, taskEditorCaption, name, submit, onSubmit, editTaskData, input0_input_handler];
	}

	var TaskEditor = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(TaskEditor, _SvelteComponent);

	  var _super = _createSuper(TaskEditor);

	  function TaskEditor(options) {
	    var _this;

	    _classCallCheck(this, TaskEditor);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$6, create_fragment$6, safe_not_equal, {
	      action: 0,
	      requestToken: 1,
	      clientName: 2,
	      projectName: 3,
	      isServer: 4,
	      onCancel: 5,
	      onSubmit: 10,
	      taskEditorButtonCaption: 6,
	      taskEditorCaption: 7,
	      editTaskData: 11
	    });
	    return _this;
	  }

	  return TaskEditor;
	}(SvelteComponent);

	function create_if_block$6(ctx) {
	  var current;
	  var overlay = new Overlay({
	    props: {
	      loading:
	      /*loading*/
	      ctx[9],
	      $$slots: {
	        default: [create_default_slot$2]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      create_component(overlay.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(overlay, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var overlay_changes = {};
	      if (dirty &
	      /*loading*/
	      512) overlay_changes.loading =
	      /*loading*/
	      ctx[9];

	      if (dirty &
	      /*$$scope, action, requestToken, show, clientName, projectName, isServer, taskEditorButtonCaption, taskEditorCaption, editTaskData*/
	      33279) {
	        overlay_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      overlay.$set(overlay_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(overlay.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(overlay.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(overlay, detaching);
	    }

	  };
	} // (55:1) <Overlay {loading}>


	function create_default_slot$2(ctx) {
	  var current;
	  var taskeditor = new TaskEditor({
	    props: {
	      action:
	      /*action*/
	      ctx[0],
	      requestToken:
	      /*requestToken*/
	      ctx[1],
	      onCancel:
	      /*func*/
	      ctx[14],
	      onSubmit:
	      /*save*/
	      ctx[10],
	      clientName:
	      /*clientName*/
	      ctx[2],
	      projectName:
	      /*projectName*/
	      ctx[3],
	      isServer:
	      /*isServer*/
	      ctx[4],
	      taskEditorButtonCaption:
	      /*taskEditorButtonCaption*/
	      ctx[5],
	      taskEditorCaption:
	      /*taskEditorCaption*/
	      ctx[6],
	      editTaskData:
	      /*editTaskData*/
	      ctx[7]
	    }
	  });
	  return {
	    c() {
	      create_component(taskeditor.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(taskeditor, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var taskeditor_changes = {};
	      if (dirty &
	      /*action*/
	      1) taskeditor_changes.action =
	      /*action*/
	      ctx[0];
	      if (dirty &
	      /*requestToken*/
	      2) taskeditor_changes.requestToken =
	      /*requestToken*/
	      ctx[1];
	      if (dirty &
	      /*show*/
	      256) taskeditor_changes.onCancel =
	      /*func*/
	      ctx[14];
	      if (dirty &
	      /*clientName*/
	      4) taskeditor_changes.clientName =
	      /*clientName*/
	      ctx[2];
	      if (dirty &
	      /*projectName*/
	      8) taskeditor_changes.projectName =
	      /*projectName*/
	      ctx[3];
	      if (dirty &
	      /*isServer*/
	      16) taskeditor_changes.isServer =
	      /*isServer*/
	      ctx[4];
	      if (dirty &
	      /*taskEditorButtonCaption*/
	      32) taskeditor_changes.taskEditorButtonCaption =
	      /*taskEditorButtonCaption*/
	      ctx[5];
	      if (dirty &
	      /*taskEditorCaption*/
	      64) taskeditor_changes.taskEditorCaption =
	      /*taskEditorCaption*/
	      ctx[6];
	      if (dirty &
	      /*editTaskData*/
	      128) taskeditor_changes.editTaskData =
	      /*editTaskData*/
	      ctx[7];
	      taskeditor.$set(taskeditor_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(taskeditor.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(taskeditor.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(taskeditor, detaching);
	    }

	  };
	}

	function create_fragment$7(ctx) {
	  var a;
	  var span;
	  var t0;
	  var t1;
	  var if_block_anchor;
	  var current;
	  var mounted;
	  var dispose;
	  var if_block =
	  /*show*/
	  ctx[8] && create_if_block$6(ctx);
	  return {
	    c() {
	      a = element("a");
	      span = element("span");
	      t0 = text(
	      /*taskEditorButtonCaption*/
	      ctx[5]);
	      t1 = space();
	      if (if_block) if_block.c();
	      if_block_anchor = empty();
	      attr(a, "href", "#/");
	      attr(a, "class", "button primary new");
	    },

	    m(target, anchor) {
	      insert(target, a, anchor);
	      append(a, span);
	      append(span, t0);
	      insert(target, t1, anchor);
	      if (if_block) if_block.m(target, anchor);
	      insert(target, if_block_anchor, anchor);
	      current = true;

	      if (!mounted) {
	        dispose = listen(a, "click", prevent_default(
	        /*click_handler*/
	        ctx[13]));
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (!current || dirty &
	      /*taskEditorButtonCaption*/
	      32) set_data(t0,
	      /*taskEditorButtonCaption*/
	      ctx[5]);

	      if (
	      /*show*/
	      ctx[8]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);

	          if (dirty &
	          /*show*/
	          256) {
	            transition_in(if_block, 1);
	          }
	        } else {
	          if_block = create_if_block$6(ctx);
	          if_block.c();
	          transition_in(if_block, 1);
	          if_block.m(if_block_anchor.parentNode, if_block_anchor);
	        }
	      } else if (if_block) {
	        group_outros();
	        transition_out(if_block, 1, 1, function () {
	          if_block = null;
	        });
	        check_outros();
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(a);
	      if (detaching) detach(t1);
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(if_block_anchor);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function instance$7($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var editAction = $$props.editAction;
	  var requestToken = $$props.requestToken;
	  var clientName = $$props.clientName;
	  var projectName = $$props.projectName;
	  var isServer = $$props.isServer;
	  var taskEditorButtonCaption = $$props.taskEditorButtonCaption;
	  var taskEditorCaption = $$props.taskEditorCaption;
	  var taskUuid = $$props.taskUuid;
	  var editTaskData = $$props.editTaskData;
	  onMount(function () {
	    Helpers.hideFallbacks("TaskEditor.svelte");
	  });

	  var save = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
	      var name, task, response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              name = _ref4.name;
	              $$invalidate(9, loading = true);
	              _context.prev = 2;
	              task = {
	                name
	              };

	              if (taskUuid) {
	                task = _objectSpread2(_objectSpread2({}, task), {}, {
	                  uuid: taskUuid
	                });
	              }

	              _context.next = 7;
	              return fetch(taskUuid ? editAction : action, {
	                method: taskUuid ? "PATCH" : "POST",
	                body: JSON.stringify(task),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 7:
	              response = _context.sent;

	              if (response && response.ok) {
	                $$invalidate(8, show = false);
	                document.querySelector(".app-timemanager [data-current-link]").click();
	              }

	              _context.next = 14;
	              break;

	            case 11:
	              _context.prev = 11;
	              _context.t0 = _context["catch"](2);
	              console.error(_context.t0);

	            case 14:
	              $$invalidate(9, loading = false);

	            case 15:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[2, 11]]);
	    }));

	    return function save(_x) {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var click_handler = function click_handler() {
	    return $$invalidate(8, show = !show);
	  };

	  var func = function func() {
	    return $$invalidate(8, show = false);
	  };

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("editAction" in $$props) $$invalidate(11, editAction = $$props.editAction);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
	    if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
	    if ("isServer" in $$props) $$invalidate(4, isServer = $$props.isServer);
	    if ("taskEditorButtonCaption" in $$props) $$invalidate(5, taskEditorButtonCaption = $$props.taskEditorButtonCaption);
	    if ("taskEditorCaption" in $$props) $$invalidate(6, taskEditorCaption = $$props.taskEditorCaption);
	    if ("taskUuid" in $$props) $$invalidate(12, taskUuid = $$props.taskUuid);
	    if ("editTaskData" in $$props) $$invalidate(7, editTaskData = $$props.editTaskData);
	  };

	  var show;
	  var loading;

	   $$invalidate(8, show = false);

	   $$invalidate(9, loading = false);

	  return [action, requestToken, clientName, projectName, isServer, taskEditorButtonCaption, taskEditorCaption, editTaskData, show, loading, save, editAction, taskUuid, click_handler, func];
	}

	var TaskEditorDialog = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(TaskEditorDialog, _SvelteComponent);

	  var _super = _createSuper(TaskEditorDialog);

	  function TaskEditorDialog(options) {
	    var _this;

	    _classCallCheck(this, TaskEditorDialog);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$7, create_fragment$7, safe_not_equal, {
	      action: 0,
	      editAction: 11,
	      requestToken: 1,
	      clientName: 2,
	      projectName: 3,
	      isServer: 4,
	      taskEditorButtonCaption: 5,
	      taskEditorCaption: 6,
	      taskUuid: 12,
	      editTaskData: 7
	    });
	    return _this;
	  }

	  return TaskEditorDialog;
	}(SvelteComponent);

	function create_if_block$7(ctx) {
	  var button;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      button = element("button");
	      button.textContent = "".concat(window.t("timemanager", "Cancel"));
	      attr(button, "type", "reset");
	      attr(button, "class", "button");
	    },

	    m(target, anchor) {
	      insert(target, button, anchor);

	      if (!mounted) {
	        dispose = listen(button, "click", prevent_default(function () {
	          if (is_function(
	          /*onCancel*/
	          ctx[6]))
	            /*onCancel*/
	            ctx[6].apply(this, arguments);
	        }));
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	    },

	    d(detaching) {
	      if (detaching) detach(button);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function create_fragment$8(ctx) {
	  var div1;
	  var h3;
	  var t0;
	  var t1;
	  var form;
	  var label0;
	  var t2_value = window.t("timemanager", "Duration (in hrs.)") + "";
	  var t2;
	  var t3;
	  var br0;
	  var t4;
	  var input0;
	  var t5;
	  var br1;
	  var t6;
	  var label1;
	  var t7_value = window.t("timemanager", "Date") + "";
	  var t7;
	  var t8;
	  var br2;
	  var t9;
	  var input1;
	  var t10;
	  var br3;
	  var t11;
	  var label2;
	  var t12_value = window.t("timemanager", "Note") + "";
	  var t12;
	  var t13;
	  var br4;
	  var t14;
	  var textarea;
	  var textarea_placeholder_value;
	  var t15;
	  var br5;
	  var t16;
	  var label3;
	  var t17_value = window.t("timemanager", "For task") + "";
	  var t17;
	  var t18;
	  var br6;
	  var t19;
	  var strong0;
	  var t20;
	  var t21;
	  var label4;
	  var t22_value = window.t("timemanager", "For project") + "";
	  var t22;
	  var t23;
	  var br7;
	  var t24;
	  var strong1;
	  var t25;
	  var t26;
	  var label5;
	  var t27_value = window.t("timemanager", "For client") + "";
	  var t27;
	  var t28;
	  var br8;
	  var t29;
	  var strong2;
	  var t30;
	  var t31;
	  var br9;
	  var t32;
	  var input2;
	  var t33;
	  var div0;
	  var button;
	  var t34;
	  var t35;
	  var mounted;
	  var dispose;
	  var if_block = !
	  /*isServer*/
	  ctx[5] && create_if_block$7(ctx);
	  return {
	    c() {
	      div1 = element("div");
	      h3 = element("h3");
	      t0 = text(
	      /*timeEditorCaption*/
	      ctx[7]);
	      t1 = space();
	      form = element("form");
	      label0 = element("label");
	      t2 = text(t2_value);
	      t3 = space();
	      br0 = element("br");
	      t4 = space();
	      input0 = element("input");
	      t5 = space();
	      br1 = element("br");
	      t6 = space();
	      label1 = element("label");
	      t7 = text(t7_value);
	      t8 = space();
	      br2 = element("br");
	      t9 = space();
	      input1 = element("input");
	      t10 = space();
	      br3 = element("br");
	      t11 = space();
	      label2 = element("label");
	      t12 = text(t12_value);
	      t13 = space();
	      br4 = element("br");
	      t14 = space();
	      textarea = element("textarea");
	      t15 = space();
	      br5 = element("br");
	      t16 = space();
	      label3 = element("label");
	      t17 = text(t17_value);
	      t18 = space();
	      br6 = element("br");
	      t19 = space();
	      strong0 = element("strong");
	      t20 = text(
	      /*taskName*/
	      ctx[4]);
	      t21 = space();
	      label4 = element("label");
	      t22 = text(t22_value);
	      t23 = space();
	      br7 = element("br");
	      t24 = space();
	      strong1 = element("strong");
	      t25 = text(
	      /*projectName*/
	      ctx[3]);
	      t26 = space();
	      label5 = element("label");
	      t27 = text(t27_value);
	      t28 = space();
	      br8 = element("br");
	      t29 = space();
	      strong2 = element("strong");
	      t30 = text(
	      /*clientName*/
	      ctx[2]);
	      t31 = space();
	      br9 = element("br");
	      t32 = space();
	      input2 = element("input");
	      t33 = space();
	      div0 = element("div");
	      button = element("button");
	      t34 = text(
	      /*timeEditorButtonCaption*/
	      ctx[8]);
	      t35 = space();
	      if (if_block) if_block.c();
	      input0.autofocus = true;
	      attr(input0, "type", "number");
	      attr(input0, "name", "duration");
	      attr(input0, "step", "0.25");
	      attr(input0, "placeholder", "");
	      set_style(input0, "width", "100%");
	      attr(input0, "class", "input-wide");
	      input0.required = true;
	      attr(input1, "type", "date");
	      attr(input1, "name", "date");
	      set_style(input1, "width", "100%");
	      attr(input1, "class", "input-wide");
	      set_style(textarea, "width", "100%");
	      attr(textarea, "class", "input-wide");
	      attr(textarea, "name", "note");
	      attr(textarea, "placeholder", textarea_placeholder_value = window.t("timemanager", "Describe what you did..."));
	      textarea.value =
	      /*note*/
	      ctx[11];
	      attr(label3, "class", "space-top");
	      attr(label4, "class", "space-top");
	      attr(label5, "class", "space-top");
	      attr(input2, "type", "hidden");
	      attr(input2, "name", "requesttoken");
	      input2.value =
	      /*requestToken*/
	      ctx[1];
	      attr(button, "type", "submit");
	      attr(button, "class", "button primary");
	      attr(div0, "class", "oc-dialog-buttonrow twobuttons reverse");
	      attr(form, "action",
	      /*action*/
	      ctx[0]);
	      attr(form, "method", "post");
	      attr(div1, "class", "inner tm_new-item");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, h3);
	      append(h3, t0);
	      append(div1, t1);
	      append(div1, form);
	      append(form, label0);
	      append(label0, t2);
	      append(label0, t3);
	      append(label0, br0);
	      append(label0, t4);
	      append(label0, input0);
	      set_input_value(input0,
	      /*duration*/
	      ctx[9]);
	      append(form, t5);
	      append(form, br1);
	      append(form, t6);
	      append(form, label1);
	      append(label1, t7);
	      append(label1, t8);
	      append(label1, br2);
	      append(label1, t9);
	      append(label1, input1);
	      set_input_value(input1,
	      /*date*/
	      ctx[10]);
	      append(form, t10);
	      append(form, br3);
	      append(form, t11);
	      append(form, label2);
	      append(label2, t12);
	      append(label2, t13);
	      append(label2, br4);
	      append(label2, t14);
	      append(label2, textarea);
	      append(form, t15);
	      append(form, br5);
	      append(form, t16);
	      append(form, label3);
	      append(label3, t17);
	      append(label3, t18);
	      append(label3, br6);
	      append(label3, t19);
	      append(label3, strong0);
	      append(strong0, t20);
	      append(form, t21);
	      append(form, label4);
	      append(label4, t22);
	      append(label4, t23);
	      append(label4, br7);
	      append(label4, t24);
	      append(label4, strong1);
	      append(strong1, t25);
	      append(form, t26);
	      append(form, label5);
	      append(label5, t27);
	      append(label5, t28);
	      append(label5, br8);
	      append(label5, t29);
	      append(label5, strong2);
	      append(strong2, t30);
	      append(form, t31);
	      append(form, br9);
	      append(form, t32);
	      append(form, input2);
	      append(form, t33);
	      append(form, div0);
	      append(div0, button);
	      append(button, t34);
	      append(div0, t35);
	      if (if_block) if_block.m(div0, null);
	      input0.focus();

	      if (!mounted) {
	        dispose = [listen(input0, "input",
	        /*input0_input_handler*/
	        ctx[16]), listen(input1, "input",
	        /*input1_input_handler*/
	        ctx[17]), listen(textarea, "input",
	        /*input_handler*/
	        ctx[18]), listen(form, "submit", prevent_default(
	        /*submit*/
	        ctx[12]))];
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*timeEditorCaption*/
	      128) set_data(t0,
	      /*timeEditorCaption*/
	      ctx[7]);

	      if (dirty &
	      /*duration*/
	      512 && to_number(input0.value) !==
	      /*duration*/
	      ctx[9]) {
	        set_input_value(input0,
	        /*duration*/
	        ctx[9]);
	      }

	      if (dirty &
	      /*date*/
	      1024) {
	        set_input_value(input1,
	        /*date*/
	        ctx[10]);
	      }

	      if (dirty &
	      /*note*/
	      2048) {
	        textarea.value =
	        /*note*/
	        ctx[11];
	      }

	      if (dirty &
	      /*taskName*/
	      16) set_data(t20,
	      /*taskName*/
	      ctx[4]);
	      if (dirty &
	      /*projectName*/
	      8) set_data(t25,
	      /*projectName*/
	      ctx[3]);
	      if (dirty &
	      /*clientName*/
	      4) set_data(t30,
	      /*clientName*/
	      ctx[2]);

	      if (dirty &
	      /*requestToken*/
	      2) {
	        input2.value =
	        /*requestToken*/
	        ctx[1];
	      }

	      if (dirty &
	      /*timeEditorButtonCaption*/
	      256) set_data(t34,
	      /*timeEditorButtonCaption*/
	      ctx[8]);

	      if (!
	      /*isServer*/
	      ctx[5]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block$7(ctx);
	          if_block.c();
	          if_block.m(div0, null);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }

	      if (dirty &
	      /*action*/
	      1) {
	        attr(form, "action",
	        /*action*/
	        ctx[0]);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div1);
	      if (if_block) if_block.d();
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function instance$8($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var requestToken = $$props.requestToken;
	  var clientName = $$props.clientName;
	  var projectName = $$props.projectName;
	  var taskName = $$props.taskName;
	  var initialDate = $$props.initialDate;
	  var isServer = $$props.isServer;
	  var onCancel = $$props.onCancel;
	  var onSubmit = $$props.onSubmit;
	  var _$$props$editTimeEntr = $$props.editTimeEntryData,
	      editTimeEntryData = _$$props$editTimeEntr === void 0 ? {} : _$$props$editTimeEntr;
	  var timeEditorCaption = $$props.timeEditorCaption;
	  var timeEditorButtonCaption = $$props.timeEditorButtonCaption;
	  var duration = editTimeEntryData.duration;
	  var date = editTimeEntryData.date || initialDate;
	  var note = editTimeEntryData.note || "";

	  var submit = function submit() {
	    onSubmit({
	      duration,
	      date,
	      note
	    });
	  };

	  function input0_input_handler() {
	    duration = to_number(this.value);
	    $$invalidate(9, duration);
	  }

	  function input1_input_handler() {
	    date = this.value;
	    $$invalidate(10, date);
	  }

	  var input_handler = function input_handler(e) {
	    return $$invalidate(11, note = e.target.value);
	  };

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
	    if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
	    if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
	    if ("taskName" in $$props) $$invalidate(4, taskName = $$props.taskName);
	    if ("initialDate" in $$props) $$invalidate(13, initialDate = $$props.initialDate);
	    if ("isServer" in $$props) $$invalidate(5, isServer = $$props.isServer);
	    if ("onCancel" in $$props) $$invalidate(6, onCancel = $$props.onCancel);
	    if ("onSubmit" in $$props) $$invalidate(14, onSubmit = $$props.onSubmit);
	    if ("editTimeEntryData" in $$props) $$invalidate(15, editTimeEntryData = $$props.editTimeEntryData);
	    if ("timeEditorCaption" in $$props) $$invalidate(7, timeEditorCaption = $$props.timeEditorCaption);
	    if ("timeEditorButtonCaption" in $$props) $$invalidate(8, timeEditorButtonCaption = $$props.timeEditorButtonCaption);
	  };

	  return [action, requestToken, clientName, projectName, taskName, isServer, onCancel, timeEditorCaption, timeEditorButtonCaption, duration, date, note, submit, initialDate, onSubmit, editTimeEntryData, input0_input_handler, input1_input_handler, input_handler];
	}

	var TimeEditor = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(TimeEditor, _SvelteComponent);

	  var _super = _createSuper(TimeEditor);

	  function TimeEditor(options) {
	    var _this;

	    _classCallCheck(this, TimeEditor);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$8, create_fragment$8, safe_not_equal, {
	      action: 0,
	      requestToken: 1,
	      clientName: 2,
	      projectName: 3,
	      taskName: 4,
	      initialDate: 13,
	      isServer: 5,
	      onCancel: 6,
	      onSubmit: 14,
	      editTimeEntryData: 15,
	      timeEditorCaption: 7,
	      timeEditorButtonCaption: 8
	    });
	    return _this;
	  }

	  return TimeEditor;
	}(SvelteComponent);

	function create_else_block(ctx) {
	  var div;
	  var button;
	  var t;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      div = element("div");
	      button = element("button");
	      t = text(
	      /*timeEditorButtonCaption*/
	      ctx[7]);
	      attr(button, "type", "button");
	      attr(button, "class", "btn");
	      attr(div, "class", "tm_inline-hover-form");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      append(div, button);
	      append(button, t);

	      if (!mounted) {
	        dispose = listen(button, "click", prevent_default(
	        /*click_handler_1*/
	        ctx[16]));
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      if (dirty &
	      /*timeEditorButtonCaption*/
	      128) set_data(t,
	      /*timeEditorButtonCaption*/
	      ctx[7]);
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      mounted = false;
	      dispose();
	    }

	  };
	} // (53:0) {#if !timeUuid}


	function create_if_block_1$1(ctx) {
	  var a;
	  var span;
	  var t;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      a = element("a");
	      span = element("span");
	      t = text(
	      /*timeEditorButtonCaption*/
	      ctx[7]);
	      attr(a, "href", "#/");
	      attr(a, "class", "button primary new");
	    },

	    m(target, anchor) {
	      insert(target, a, anchor);
	      append(a, span);
	      append(span, t);

	      if (!mounted) {
	        dispose = listen(a, "click", prevent_default(
	        /*click_handler*/
	        ctx[15]));
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      if (dirty &
	      /*timeEditorButtonCaption*/
	      128) set_data(t,
	      /*timeEditorButtonCaption*/
	      ctx[7]);
	    },

	    d(detaching) {
	      if (detaching) detach(a);
	      mounted = false;
	      dispose();
	    }

	  };
	} // (62:0) {#if show}


	function create_if_block$8(ctx) {
	  var current;
	  var overlay = new Overlay({
	    props: {
	      loading:
	      /*loading*/
	      ctx[12],
	      $$slots: {
	        default: [create_default_slot$3]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      create_component(overlay.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(overlay, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var overlay_changes = {};
	      if (dirty &
	      /*loading*/
	      4096) overlay_changes.loading =
	      /*loading*/
	      ctx[12];

	      if (dirty &
	      /*$$scope, action, requestToken, show, clientName, projectName, taskName, initialDate, timeEditorButtonCaption, timeEditorCaption, editTimeEntryData, isServer*/
	      266237) {
	        overlay_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      overlay.$set(overlay_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(overlay.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(overlay.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(overlay, detaching);
	    }

	  };
	} // (63:1) <Overlay {loading}>


	function create_default_slot$3(ctx) {
	  var current;
	  var timeeditor = new TimeEditor({
	    props: {
	      action:
	      /*action*/
	      ctx[0],
	      requestToken:
	      /*requestToken*/
	      ctx[2],
	      onCancel:
	      /*func*/
	      ctx[17],
	      onSubmit:
	      /*save*/
	      ctx[13],
	      clientName:
	      /*clientName*/
	      ctx[3],
	      projectName:
	      /*projectName*/
	      ctx[4],
	      taskName:
	      /*taskName*/
	      ctx[5],
	      initialDate:
	      /*initialDate*/
	      ctx[6],
	      timeEditorButtonCaption:
	      /*timeEditorButtonCaption*/
	      ctx[7],
	      timeEditorCaption:
	      /*timeEditorCaption*/
	      ctx[8],
	      editTimeEntryData:
	      /*editTimeEntryData*/
	      ctx[9],
	      isServer:
	      /*isServer*/
	      ctx[10]
	    }
	  });
	  return {
	    c() {
	      create_component(timeeditor.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(timeeditor, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var timeeditor_changes = {};
	      if (dirty &
	      /*action*/
	      1) timeeditor_changes.action =
	      /*action*/
	      ctx[0];
	      if (dirty &
	      /*requestToken*/
	      4) timeeditor_changes.requestToken =
	      /*requestToken*/
	      ctx[2];
	      if (dirty &
	      /*show*/
	      2048) timeeditor_changes.onCancel =
	      /*func*/
	      ctx[17];
	      if (dirty &
	      /*clientName*/
	      8) timeeditor_changes.clientName =
	      /*clientName*/
	      ctx[3];
	      if (dirty &
	      /*projectName*/
	      16) timeeditor_changes.projectName =
	      /*projectName*/
	      ctx[4];
	      if (dirty &
	      /*taskName*/
	      32) timeeditor_changes.taskName =
	      /*taskName*/
	      ctx[5];
	      if (dirty &
	      /*initialDate*/
	      64) timeeditor_changes.initialDate =
	      /*initialDate*/
	      ctx[6];
	      if (dirty &
	      /*timeEditorButtonCaption*/
	      128) timeeditor_changes.timeEditorButtonCaption =
	      /*timeEditorButtonCaption*/
	      ctx[7];
	      if (dirty &
	      /*timeEditorCaption*/
	      256) timeeditor_changes.timeEditorCaption =
	      /*timeEditorCaption*/
	      ctx[8];
	      if (dirty &
	      /*editTimeEntryData*/
	      512) timeeditor_changes.editTimeEntryData =
	      /*editTimeEntryData*/
	      ctx[9];
	      if (dirty &
	      /*isServer*/
	      1024) timeeditor_changes.isServer =
	      /*isServer*/
	      ctx[10];
	      timeeditor.$set(timeeditor_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(timeeditor.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(timeeditor.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(timeeditor, detaching);
	    }

	  };
	}

	function create_fragment$9(ctx) {
	  var t;
	  var if_block1_anchor;
	  var current;

	  function select_block_type(ctx, dirty) {
	    if (!
	    /*timeUuid*/
	    ctx[1]) return create_if_block_1$1;
	    return create_else_block;
	  }

	  var current_block_type = select_block_type(ctx);
	  var if_block0 = current_block_type(ctx);
	  var if_block1 =
	  /*show*/
	  ctx[11] && create_if_block$8(ctx);
	  return {
	    c() {
	      if_block0.c();
	      t = space();
	      if (if_block1) if_block1.c();
	      if_block1_anchor = empty();
	    },

	    m(target, anchor) {
	      if_block0.m(target, anchor);
	      insert(target, t, anchor);
	      if (if_block1) if_block1.m(target, anchor);
	      insert(target, if_block1_anchor, anchor);
	      current = true;
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
	        if_block0.p(ctx, dirty);
	      } else {
	        if_block0.d(1);
	        if_block0 = current_block_type(ctx);

	        if (if_block0) {
	          if_block0.c();
	          if_block0.m(t.parentNode, t);
	        }
	      }

	      if (
	      /*show*/
	      ctx[11]) {
	        if (if_block1) {
	          if_block1.p(ctx, dirty);

	          if (dirty &
	          /*show*/
	          2048) {
	            transition_in(if_block1, 1);
	          }
	        } else {
	          if_block1 = create_if_block$8(ctx);
	          if_block1.c();
	          transition_in(if_block1, 1);
	          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
	        }
	      } else if (if_block1) {
	        group_outros();
	        transition_out(if_block1, 1, 1, function () {
	          if_block1 = null;
	        });
	        check_outros();
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block1);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block1);
	      current = false;
	    },

	    d(detaching) {
	      if_block0.d(detaching);
	      if (detaching) detach(t);
	      if (if_block1) if_block1.d(detaching);
	      if (detaching) detach(if_block1_anchor);
	    }

	  };
	}

	function instance$9($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var editTimeEntryAction = $$props.editTimeEntryAction;
	  var timeUuid = $$props.timeUuid;
	  var requestToken = $$props.requestToken;
	  var clientName = $$props.clientName;
	  var projectName = $$props.projectName;
	  var taskName = $$props.taskName;
	  var initialDate = $$props.initialDate;
	  var timeEditorButtonCaption = $$props.timeEditorButtonCaption;
	  var timeEditorCaption = $$props.timeEditorCaption;
	  var editTimeEntryData = $$props.editTimeEntryData;
	  var isServer = $$props.isServer;
	  onMount(function () {
	    Helpers.hideFallbacks("TimeEditor.svelte");
	  });

	  var save = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
	      var duration, date, note, entry, response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              duration = _ref4.duration, date = _ref4.date, note = _ref4.note;
	              $$invalidate(12, loading = true);
	              _context.prev = 2;
	              entry = {
	                duration,
	                date,
	                note
	              };

	              if (timeUuid) {
	                entry.uuid = timeUuid;
	              }

	              _context.next = 7;
	              return fetch(timeUuid ? editTimeEntryAction : action, {
	                method: timeUuid ? "PATCH" : "POST",
	                body: JSON.stringify(entry),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 7:
	              response = _context.sent;

	              if (response && response.ok) {
	                $$invalidate(11, show = false);
	                document.querySelector(".app-timemanager [data-current-link]").click();
	              }

	              _context.next = 14;
	              break;

	            case 11:
	              _context.prev = 11;
	              _context.t0 = _context["catch"](2);
	              console.error(_context.t0);

	            case 14:
	              $$invalidate(12, loading = false);

	            case 15:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[2, 11]]);
	    }));

	    return function save(_x) {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var click_handler = function click_handler() {
	    return $$invalidate(11, show = !show);
	  };

	  var click_handler_1 = function click_handler_1() {
	    return $$invalidate(11, show = !show);
	  };

	  var func = function func() {
	    return $$invalidate(11, show = false);
	  };

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(0, action = $$props.action);
	    if ("editTimeEntryAction" in $$props) $$invalidate(14, editTimeEntryAction = $$props.editTimeEntryAction);
	    if ("timeUuid" in $$props) $$invalidate(1, timeUuid = $$props.timeUuid);
	    if ("requestToken" in $$props) $$invalidate(2, requestToken = $$props.requestToken);
	    if ("clientName" in $$props) $$invalidate(3, clientName = $$props.clientName);
	    if ("projectName" in $$props) $$invalidate(4, projectName = $$props.projectName);
	    if ("taskName" in $$props) $$invalidate(5, taskName = $$props.taskName);
	    if ("initialDate" in $$props) $$invalidate(6, initialDate = $$props.initialDate);
	    if ("timeEditorButtonCaption" in $$props) $$invalidate(7, timeEditorButtonCaption = $$props.timeEditorButtonCaption);
	    if ("timeEditorCaption" in $$props) $$invalidate(8, timeEditorCaption = $$props.timeEditorCaption);
	    if ("editTimeEntryData" in $$props) $$invalidate(9, editTimeEntryData = $$props.editTimeEntryData);
	    if ("isServer" in $$props) $$invalidate(10, isServer = $$props.isServer);
	  };

	  var show;
	  var loading;

	   $$invalidate(11, show = false);

	   $$invalidate(12, loading = false);

	  return [action, timeUuid, requestToken, clientName, projectName, taskName, initialDate, timeEditorButtonCaption, timeEditorCaption, editTimeEntryData, isServer, show, loading, save, editTimeEntryAction, click_handler, click_handler_1, func];
	}

	var TimeEditorDialog = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(TimeEditorDialog, _SvelteComponent);

	  var _super = _createSuper(TimeEditorDialog);

	  function TimeEditorDialog(options) {
	    var _this;

	    _classCallCheck(this, TimeEditorDialog);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$9, create_fragment$9, safe_not_equal, {
	      action: 0,
	      editTimeEntryAction: 14,
	      timeUuid: 1,
	      requestToken: 2,
	      clientName: 3,
	      projectName: 4,
	      taskName: 5,
	      initialDate: 6,
	      timeEditorButtonCaption: 7,
	      timeEditorCaption: 8,
	      editTimeEntryData: 9,
	      isServer: 10
	    });
	    return _this;
	  }

	  return TimeEditorDialog;
	}(SvelteComponent);

	function create_if_block$9(ctx) {
	  var current;
	  var overlay = new Overlay({
	    props: {
	      $$slots: {
	        default: [create_default_slot$4]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      create_component(overlay.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(overlay, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var overlay_changes = {};

	      if (dirty &
	      /*$$scope, deleteQuestion*/
	      2056) {
	        overlay_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      overlay.$set(overlay_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(overlay.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(overlay.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(overlay, detaching);
	    }

	  };
	} // (37:1) <Overlay>


	function create_default_slot$4(ctx) {
	  var div1;
	  var t0;
	  var t1;
	  var div0;
	  var button0;
	  var t3;
	  var button1;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      div1 = element("div");
	      t0 = text(
	      /*deleteQuestion*/
	      ctx[3]);
	      t1 = space();
	      div0 = element("div");
	      button0 = element("button");
	      button0.textContent = "".concat(window.t("timemanager", "Delete"));
	      t3 = space();
	      button1 = element("button");
	      button1.textContent = "".concat(window.t("timemanager", "Cancel"));
	      attr(button0, "class", "button primary");
	      attr(button1, "class", "button");
	      attr(div0, "class", "oc-dialog-buttonrow twobuttons reverse");
	      attr(div1, "class", "inner tm_new-item");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, t0);
	      append(div1, t1);
	      append(div1, div0);
	      append(div0, button0);
	      append(div0, t3);
	      append(div0, button1);

	      if (!mounted) {
	        dispose = [listen(button0, "click", prevent_default(
	        /*doDelete*/
	        ctx[7])), listen(button1, "click", prevent_default(
	        /*cancelDelete*/
	        ctx[8]))];
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      if (dirty &
	      /*deleteQuestion*/
	      8) set_data(t0,
	      /*deleteQuestion*/
	      ctx[3]);
	    },

	    d(detaching) {
	      if (detaching) detach(div1);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function create_fragment$a(ctx) {
	  var t0;
	  var form_1;
	  var input0;
	  var t1;
	  var input1;
	  var t2;
	  var button;
	  var t3;
	  var current;
	  var if_block =
	  /*confirmation*/
	  ctx[6] && create_if_block$9(ctx);
	  return {
	    c() {
	      if (if_block) if_block.c();
	      t0 = space();
	      form_1 = element("form");
	      input0 = element("input");
	      t1 = space();
	      input1 = element("input");
	      t2 = space();
	      button = element("button");
	      t3 = text(
	      /*deleteButtonCaption*/
	      ctx[2]);
	      attr(input0, "type", "hidden");
	      attr(input0, "name", "uuid");
	      input0.value =
	      /*deleteUuid*/
	      ctx[1];
	      attr(input1, "type", "hidden");
	      attr(input1, "name", "requesttoken");
	      input1.value =
	      /*requestToken*/
	      ctx[4];
	      attr(button, "type", "submit");
	      attr(button, "name", "action");
	      button.value = "delete";
	      attr(button, "class", "btn");
	      attr(form_1, "action",
	      /*deleteAction*/
	      ctx[0]);
	      attr(form_1, "method", "post");
	    },

	    m(target, anchor) {
	      if (if_block) if_block.m(target, anchor);
	      insert(target, t0, anchor);
	      insert(target, form_1, anchor);
	      append(form_1, input0);
	      append(form_1, t1);
	      append(form_1, input1);
	      append(form_1, t2);
	      append(form_1, button);
	      append(button, t3);
	      /*form_1_binding*/

	      ctx[10](form_1);
	      current = true;
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (
	      /*confirmation*/
	      ctx[6]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);

	          if (dirty &
	          /*confirmation*/
	          64) {
	            transition_in(if_block, 1);
	          }
	        } else {
	          if_block = create_if_block$9(ctx);
	          if_block.c();
	          transition_in(if_block, 1);
	          if_block.m(t0.parentNode, t0);
	        }
	      } else if (if_block) {
	        group_outros();
	        transition_out(if_block, 1, 1, function () {
	          if_block = null;
	        });
	        check_outros();
	      }

	      if (!current || dirty &
	      /*deleteUuid*/
	      2) {
	        input0.value =
	        /*deleteUuid*/
	        ctx[1];
	      }

	      if (!current || dirty &
	      /*requestToken*/
	      16) {
	        input1.value =
	        /*requestToken*/
	        ctx[4];
	      }

	      if (!current || dirty &
	      /*deleteButtonCaption*/
	      4) set_data(t3,
	      /*deleteButtonCaption*/
	      ctx[2]);

	      if (!current || dirty &
	      /*deleteAction*/
	      1) {
	        attr(form_1, "action",
	        /*deleteAction*/
	        ctx[0]);
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block);
	      current = false;
	    },

	    d(detaching) {
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(t0);
	      if (detaching) detach(form_1);
	      /*form_1_binding*/

	      ctx[10](null);
	    }

	  };
	}

	function instance$a($$self, $$props, $$invalidate) {
	  var deleteAction = $$props.deleteAction;
	  var deleteUuid = $$props.deleteUuid;
	  var deleteButtonCaption = $$props.deleteButtonCaption;
	  var deleteQuestion = $$props.deleteQuestion;
	  var requestToken = $$props.requestToken;
	  var form;
	  onMount(function () {
	    Helpers.hideFallbacks("DeleteButton.svelte");
	    form.addEventListener("submit", submit);
	  });

	  var submit = function submit(e) {
	    e.preventDefault();
	    $$invalidate(6, confirmation = true);
	  };

	  var doDelete = function doDelete() {
	    $$invalidate(6, confirmation = false);
	    form.removeEventListener("submit", submit);
	    form.submit();
	  };

	  var cancelDelete = function cancelDelete() {
	    $$invalidate(6, confirmation = false);
	  };

	  function form_1_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](function () {
	      $$invalidate(5, form = $$value);
	    });
	  }

	  $$self.$set = function ($$props) {
	    if ("deleteAction" in $$props) $$invalidate(0, deleteAction = $$props.deleteAction);
	    if ("deleteUuid" in $$props) $$invalidate(1, deleteUuid = $$props.deleteUuid);
	    if ("deleteButtonCaption" in $$props) $$invalidate(2, deleteButtonCaption = $$props.deleteButtonCaption);
	    if ("deleteQuestion" in $$props) $$invalidate(3, deleteQuestion = $$props.deleteQuestion);
	    if ("requestToken" in $$props) $$invalidate(4, requestToken = $$props.requestToken);
	  };

	  var confirmation;

	   $$invalidate(6, confirmation = false);

	  return [deleteAction, deleteUuid, deleteButtonCaption, deleteQuestion, requestToken, form, confirmation, doDelete, cancelDelete, submit, form_1_binding];
	}

	var DeleteButton = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(DeleteButton, _SvelteComponent);

	  var _super = _createSuper(DeleteButton);

	  function DeleteButton(options) {
	    var _this;

	    _classCallCheck(this, DeleteButton);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$a, create_fragment$a, safe_not_equal, {
	      deleteAction: 0,
	      deleteUuid: 1,
	      deleteButtonCaption: 2,
	      deleteQuestion: 3,
	      requestToken: 4
	    });
	    return _this;
	  }

	  return DeleteButton;
	}(SvelteComponent);

	function create_if_block$a(ctx) {
	  var current;
	  var overlay = new Overlay({
	    props: {
	      $$slots: {
	        default: [create_default_slot$5]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      create_component(overlay.$$.fragment);
	    },

	    m(target, anchor) {
	      mount_component(overlay, target, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      var overlay_changes = {};

	      if (dirty &
	      /*$$scope*/
	      128) {
	        overlay_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      overlay.$set(overlay_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(overlay.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(overlay.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      destroy_component(overlay, detaching);
	    }

	  };
	} // (55:1) <Overlay>


	function create_default_slot$5(ctx) {
	  var div1;
	  var t0_value = window.t("timemanager", "Do you want to delete this time entry?") + "";
	  var t0;
	  var t1;
	  var div0;
	  var button0;
	  var t3;
	  var button1;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      div1 = element("div");
	      t0 = text(t0_value);
	      t1 = space();
	      div0 = element("div");
	      button0 = element("button");
	      button0.textContent = "".concat(window.t("timemanager", "Delete"));
	      t3 = space();
	      button1 = element("button");
	      button1.textContent = "".concat(window.t("timemanager", "Cancel"));
	      attr(button0, "class", "button primary");
	      attr(button1, "class", "button");
	      attr(div0, "class", "oc-dialog-buttonrow twobuttons reverse");
	      attr(div1, "class", "inner tm_new-item");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, t0);
	      append(div1, t1);
	      append(div1, div0);
	      append(div0, button0);
	      append(div0, t3);
	      append(div0, button1);

	      if (!mounted) {
	        dispose = [listen(button0, "click", prevent_default(
	        /*doDelete*/
	        ctx[5])), listen(button1, "click", prevent_default(
	        /*cancelDelete*/
	        ctx[6]))];
	        mounted = true;
	      }
	    },

	    p: noop,

	    d(detaching) {
	      if (detaching) detach(div1);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function create_fragment$b(ctx) {
	  var t0;
	  var form;
	  var input0;
	  var t1;
	  var input1;
	  var t2;
	  var button;
	  var current;
	  var mounted;
	  var dispose;
	  var if_block =
	  /*confirmation*/
	  ctx[3] && create_if_block$a(ctx);
	  return {
	    c() {
	      if (if_block) if_block.c();
	      t0 = space();
	      form = element("form");
	      input0 = element("input");
	      t1 = space();
	      input1 = element("input");
	      t2 = space();
	      button = element("button");
	      button.textContent = "".concat(window.t("timemanager", "Delete"));
	      attr(input0, "type", "hidden");
	      attr(input0, "name", "uuid");
	      input0.value =
	      /*deleteTimeEntryUuid*/
	      ctx[1];
	      attr(input1, "type", "hidden");
	      attr(input1, "name", "requesttoken");
	      input1.value =
	      /*requestToken*/
	      ctx[2];
	      attr(button, "type", "submit");
	      attr(button, "name", "action");
	      button.value = "delete";
	      attr(button, "class", "btn");
	      attr(form, "action",
	      /*deleteTimeEntryAction*/
	      ctx[0]);
	      attr(form, "method", "post");
	      attr(form, "class", "tm_inline-hover-form");
	    },

	    m(target, anchor) {
	      if (if_block) if_block.m(target, anchor);
	      insert(target, t0, anchor);
	      insert(target, form, anchor);
	      append(form, input0);
	      append(form, t1);
	      append(form, input1);
	      append(form, t2);
	      append(form, button);
	      current = true;

	      if (!mounted) {
	        dispose = listen(form, "submit",
	        /*submit*/
	        ctx[4]);
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (
	      /*confirmation*/
	      ctx[3]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);

	          if (dirty &
	          /*confirmation*/
	          8) {
	            transition_in(if_block, 1);
	          }
	        } else {
	          if_block = create_if_block$a(ctx);
	          if_block.c();
	          transition_in(if_block, 1);
	          if_block.m(t0.parentNode, t0);
	        }
	      } else if (if_block) {
	        group_outros();
	        transition_out(if_block, 1, 1, function () {
	          if_block = null;
	        });
	        check_outros();
	      }

	      if (!current || dirty &
	      /*deleteTimeEntryUuid*/
	      2) {
	        input0.value =
	        /*deleteTimeEntryUuid*/
	        ctx[1];
	      }

	      if (!current || dirty &
	      /*requestToken*/
	      4) {
	        input1.value =
	        /*requestToken*/
	        ctx[2];
	      }

	      if (!current || dirty &
	      /*deleteTimeEntryAction*/
	      1) {
	        attr(form, "action",
	        /*deleteTimeEntryAction*/
	        ctx[0]);
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block);
	      current = false;
	    },

	    d(detaching) {
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(t0);
	      if (detaching) detach(form);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function instance$b($$self, $$props, $$invalidate) {
	  var deleteTimeEntryAction = $$props.deleteTimeEntryAction;
	  var deleteTimeEntryUuid = $$props.deleteTimeEntryUuid;
	  var requestToken = $$props.requestToken;
	  onMount(function () {
	    Helpers.hideFallbacks("DeleteTimeEntryButton.svelte@".concat(deleteTimeEntryUuid));
	  });

	  var submit = function submit(e) {
	    e.preventDefault();
	    $$invalidate(3, confirmation = true);
	  };

	  var doDelete = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	      var _element, response;

	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              $$invalidate(3, confirmation = false);
	              _context.prev = 1;
	              _element = document.querySelector("#content.app-timemanager [data-remove-on-delete='".concat(deleteTimeEntryUuid, "']"));

	              if (_element) {
	                _element.classList.add("warning");
	              }

	              _context.next = 6;
	              return window.fetch(deleteTimeEntryAction, {
	                method: "POST",
	                body: JSON.stringify({
	                  uuid: deleteTimeEntryUuid
	                }),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 6:
	              response = _context.sent;

	              if (response && response.ok) {
	                _element.remove();

	                document.querySelector(".app-timemanager [data-current-link]").click();
	              }

	              _context.next = 13;
	              break;

	            case 10:
	              _context.prev = 10;
	              _context.t0 = _context["catch"](1);
	              console.error(_context.t0);

	            case 13:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[1, 10]]);
	    }));

	    return function doDelete() {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var cancelDelete = function cancelDelete() {
	    $$invalidate(3, confirmation = false);
	  };

	  $$self.$set = function ($$props) {
	    if ("deleteTimeEntryAction" in $$props) $$invalidate(0, deleteTimeEntryAction = $$props.deleteTimeEntryAction);
	    if ("deleteTimeEntryUuid" in $$props) $$invalidate(1, deleteTimeEntryUuid = $$props.deleteTimeEntryUuid);
	    if ("requestToken" in $$props) $$invalidate(2, requestToken = $$props.requestToken);
	  };

	  var confirmation;

	   $$invalidate(3, confirmation = false);

	  return [deleteTimeEntryAction, deleteTimeEntryUuid, requestToken, confirmation, submit, doDelete, cancelDelete];
	}

	var DeleteTimeEntryButton = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(DeleteTimeEntryButton, _SvelteComponent);

	  var _super = _createSuper(DeleteTimeEntryButton);

	  function DeleteTimeEntryButton(options) {
	    var _this;

	    _classCallCheck(this, DeleteTimeEntryButton);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$b, create_fragment$b, safe_not_equal, {
	      deleteTimeEntryAction: 0,
	      deleteTimeEntryUuid: 1,
	      requestToken: 2
	    });
	    return _this;
	  }

	  return DeleteTimeEntryButton;
	}(SvelteComponent);

	var $filter = arrayIteration.filter;





	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('filter'); // Edge 14- issue

	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('filter'); // `Array.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.filter
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2
	}, {
	  filter: function filter(callbackfn
	  /* , thisArg */
	  ) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys


	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties


	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;

	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);

	  return O;
	};

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () {
	  /* empty */
	};

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	}; // Create object with fake `null` prototype: use ActiveX Object with cleared prototype


	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak

	  return temp;
	}; // Create object with fake `null` prototype: use iframe Object with cleared prototype


	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe); // https://github.com/zloirock/core-js/issues/475

	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	}; // Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug


	var activeXDocument;

	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) {
	    /* ignore */
	  }

	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;

	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];

	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true; // `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create

	var objectCreate = Object.create || function create(O, Properties) {
	  var result;

	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null; // add "__proto__" for Object.getPrototypeOf polyfill

	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();

	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype$1 = Array.prototype; // Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	} // add a key to Array.prototype[@@unscopables]


	var addToUnscopables = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var $find = arrayIteration.find;





	var FIND = 'find';
	var SKIPS_HOLES = true;
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength(FIND); // Shouldn't skip holes

	if (FIND in []) Array(1)[FIND](function () {
	  SKIPS_HOLES = false;
	}); // `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find

	_export({
	  target: 'Array',
	  proto: true,
	  forced: SKIPS_HOLES || !USES_TO_LENGTH$3
	}, {
	  find: function find(callbackfn
	  /* , that = undefined */
	  ) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	}); // https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables

	addToUnscopables(FIND);

	var $map = arrayIteration.map;





	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map'); // FF49- issue

	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('map'); // `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species

	_export({
	  target: 'Array',
	  proto: true,
	  forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4
	}, {
	  map: function map(callbackfn
	  /* , thisArg */
	  ) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	/* node_modules/svelte-select/src/Item.svelte generated by Svelte v3.23.0 */

	function add_css() {
	  var style = element("style");
	  style.id = "svelte-bdnybl-style";
	  style.textContent = ".item.svelte-bdnybl{cursor:default;height:var(--height, 42px);line-height:var(--height, 42px);padding:var(--itemPadding, 0 20px);color:var(--itemColor, inherit);text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.groupHeader.svelte-bdnybl{text-transform:var(--groupTitleTextTransform, uppercase)}.groupItem.svelte-bdnybl{padding-left:var(--groupItemPaddingLeft, 40px)}.item.svelte-bdnybl:active{background:var(--itemActiveBackground, #b9daff)}.item.active.svelte-bdnybl{background:var(--itemIsActiveBG, #007aff);color:var(--itemIsActiveColor, #fff)}.item.first.svelte-bdnybl{border-radius:var(--itemFirstBorderRadius, 4px 4px 0 0)}.item.hover.svelte-bdnybl:not(.active){background:var(--itemHoverBG, #e7f2ff)}";
	  append(document.head, style);
	}

	function create_fragment$c(ctx) {
	  let div;
	  let raw_value =
	  /*getOptionLabel*/
	  ctx[0](
	  /*item*/
	  ctx[1],
	  /*filterText*/
	  ctx[2]) + "";
	  let div_class_value;
	  return {
	    c() {
	      div = element("div");
	      attr(div, "class", div_class_value = "item " +
	      /*itemClasses*/
	      ctx[3] + " svelte-bdnybl");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      div.innerHTML = raw_value;
	    },

	    p(ctx, [dirty]) {
	      if (dirty &
	      /*getOptionLabel, item, filterText*/
	      7 && raw_value !== (raw_value =
	      /*getOptionLabel*/
	      ctx[0](
	      /*item*/
	      ctx[1],
	      /*filterText*/
	      ctx[2]) + "")) div.innerHTML = raw_value;

	      if (dirty &
	      /*itemClasses*/
	      8 && div_class_value !== (div_class_value = "item " +
	      /*itemClasses*/
	      ctx[3] + " svelte-bdnybl")) {
	        attr(div, "class", div_class_value);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div);
	    }

	  };
	}

	function instance$c($$self, $$props, $$invalidate) {
	  let {
	    isActive = false
	  } = $$props;
	  let {
	    isFirst = false
	  } = $$props;
	  let {
	    isHover = false
	  } = $$props;
	  let {
	    getOptionLabel = undefined
	  } = $$props;
	  let {
	    item = undefined
	  } = $$props;
	  let {
	    filterText = ""
	  } = $$props;
	  let itemClasses = "";

	  $$self.$set = $$props => {
	    if ("isActive" in $$props) $$invalidate(4, isActive = $$props.isActive);
	    if ("isFirst" in $$props) $$invalidate(5, isFirst = $$props.isFirst);
	    if ("isHover" in $$props) $$invalidate(6, isHover = $$props.isHover);
	    if ("getOptionLabel" in $$props) $$invalidate(0, getOptionLabel = $$props.getOptionLabel);
	    if ("item" in $$props) $$invalidate(1, item = $$props.item);
	    if ("filterText" in $$props) $$invalidate(2, filterText = $$props.filterText);
	  };

	  $$self.$$.update = () => {
	    if ($$self.$$.dirty &
	    /*isActive, isFirst, isHover, item*/
	    114) {
	       {
	        const classes = [];

	        if (isActive) {
	          classes.push("active");
	        }

	        if (isFirst) {
	          classes.push("first");
	        }

	        if (isHover) {
	          classes.push("hover");
	        }

	        if (item.isGroupHeader) {
	          classes.push("groupHeader");
	        }

	        if (item.isGroupItem) {
	          classes.push("groupItem");
	        }

	        $$invalidate(3, itemClasses = classes.join(" "));
	      }
	    }
	  };

	  return [getOptionLabel, item, filterText, itemClasses, isActive, isFirst, isHover];
	}

	class Item extends SvelteComponent {
	  constructor(options) {
	    super();
	    if (!document.getElementById("svelte-bdnybl-style")) add_css();
	    init(this, options, instance$c, create_fragment$c, safe_not_equal, {
	      isActive: 4,
	      isFirst: 5,
	      isHover: 6,
	      getOptionLabel: 0,
	      item: 1,
	      filterText: 2
	    });
	  }

	}

	/* node_modules/svelte-select/src/VirtualList.svelte generated by Svelte v3.23.0 */

	function add_css$1() {
	  var style = element("style");
	  style.id = "svelte-p6ehlv-style";
	  style.textContent = "svelte-virtual-list-viewport.svelte-p6ehlv{position:relative;overflow-y:auto;-webkit-overflow-scrolling:touch;display:block}svelte-virtual-list-contents.svelte-p6ehlv,svelte-virtual-list-row.svelte-p6ehlv{display:block}svelte-virtual-list-row.svelte-p6ehlv{overflow:hidden}";
	  append(document.head, style);
	}

	const get_default_slot_changes = dirty => ({
	  item: dirty &
	  /*visible*/
	  32,
	  i: dirty &
	  /*visible*/
	  32,
	  hoverItemIndex: dirty &
	  /*hoverItemIndex*/
	  2
	});

	const get_default_slot_context = ctx => ({
	  item:
	  /*row*/
	  ctx[23].data,
	  i:
	  /*row*/
	  ctx[23].index,
	  hoverItemIndex:
	  /*hoverItemIndex*/
	  ctx[1]
	});

	function get_each_context$1(ctx, list, i) {
	  const child_ctx = ctx.slice();
	  child_ctx[23] = list[i];
	  return child_ctx;
	} // (160:57) Missing template


	function fallback_block(ctx) {
	  let t;
	  return {
	    c() {
	      t = text("Missing template");
	    },

	    m(target, anchor) {
	      insert(target, t, anchor);
	    },

	    d(detaching) {
	      if (detaching) detach(t);
	    }

	  };
	} // (158:2) {#each visible as row (row.index)}


	function create_each_block$1(key_1, ctx) {
	  let svelte_virtual_list_row;
	  let t;
	  let current;
	  const default_slot_template =
	  /*$$slots*/
	  ctx[19].default;
	  const default_slot = create_slot(default_slot_template, ctx,
	  /*$$scope*/
	  ctx[18], get_default_slot_context);
	  const default_slot_or_fallback = default_slot || fallback_block();
	  return {
	    key: key_1,
	    first: null,

	    c() {
	      svelte_virtual_list_row = element("svelte-virtual-list-row");
	      if (default_slot_or_fallback) default_slot_or_fallback.c();
	      t = space();
	      set_custom_element_data(svelte_virtual_list_row, "class", "svelte-p6ehlv");
	      this.first = svelte_virtual_list_row;
	    },

	    m(target, anchor) {
	      insert(target, svelte_virtual_list_row, anchor);

	      if (default_slot_or_fallback) {
	        default_slot_or_fallback.m(svelte_virtual_list_row, null);
	      }

	      append(svelte_virtual_list_row, t);
	      current = true;
	    },

	    p(ctx, dirty) {
	      if (default_slot) {
	        if (default_slot.p && dirty &
	        /*$$scope, visible, hoverItemIndex*/
	        262178) {
	          update_slot(default_slot, default_slot_template, ctx,
	          /*$$scope*/
	          ctx[18], dirty, get_default_slot_changes, get_default_slot_context);
	        }
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(default_slot_or_fallback, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(default_slot_or_fallback, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(svelte_virtual_list_row);
	      if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
	    }

	  };
	}

	function create_fragment$d(ctx) {
	  let svelte_virtual_list_viewport;
	  let svelte_virtual_list_contents;
	  let each_blocks = [];
	  let each_1_lookup = new Map();
	  let svelte_virtual_list_viewport_resize_listener;
	  let current;
	  let mounted;
	  let dispose;
	  let each_value =
	  /*visible*/
	  ctx[5];

	  const get_key = ctx =>
	  /*row*/
	  ctx[23].index;

	  for (let i = 0; i < each_value.length; i += 1) {
	    let child_ctx = get_each_context$1(ctx, each_value, i);
	    let key = get_key(child_ctx);
	    each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
	  }

	  return {
	    c() {
	      svelte_virtual_list_viewport = element("svelte-virtual-list-viewport");
	      svelte_virtual_list_contents = element("svelte-virtual-list-contents");

	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].c();
	      }

	      set_style(svelte_virtual_list_contents, "padding-top",
	      /*top*/
	      ctx[6] + "px");
	      set_style(svelte_virtual_list_contents, "padding-bottom",
	      /*bottom*/
	      ctx[7] + "px");
	      set_custom_element_data(svelte_virtual_list_contents, "class", "svelte-p6ehlv");
	      set_style(svelte_virtual_list_viewport, "height",
	      /*height*/
	      ctx[0]);
	      set_custom_element_data(svelte_virtual_list_viewport, "class", "svelte-p6ehlv");
	      add_render_callback(() =>
	      /*svelte_virtual_list_viewport_elementresize_handler*/
	      ctx[22].call(svelte_virtual_list_viewport));
	    },

	    m(target, anchor) {
	      insert(target, svelte_virtual_list_viewport, anchor);
	      append(svelte_virtual_list_viewport, svelte_virtual_list_contents);

	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].m(svelte_virtual_list_contents, null);
	      }
	      /*svelte_virtual_list_contents_binding*/


	      ctx[20](svelte_virtual_list_contents);
	      /*svelte_virtual_list_viewport_binding*/

	      ctx[21](svelte_virtual_list_viewport);
	      svelte_virtual_list_viewport_resize_listener = add_resize_listener(svelte_virtual_list_viewport,
	      /*svelte_virtual_list_viewport_elementresize_handler*/
	      ctx[22].bind(svelte_virtual_list_viewport));
	      current = true;

	      if (!mounted) {
	        dispose = listen(svelte_virtual_list_viewport, "scroll",
	        /*handle_scroll*/
	        ctx[8]);
	        mounted = true;
	      }
	    },

	    p(ctx, [dirty]) {
	      if (dirty &
	      /*$$scope, visible, hoverItemIndex*/
	      262178) {
	        const each_value =
	        /*visible*/
	        ctx[5];
	        group_outros();
	        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, svelte_virtual_list_contents, outro_and_destroy_block, create_each_block$1, null, get_each_context$1);
	        check_outros();
	      }

	      if (!current || dirty &
	      /*top*/
	      64) {
	        set_style(svelte_virtual_list_contents, "padding-top",
	        /*top*/
	        ctx[6] + "px");
	      }

	      if (!current || dirty &
	      /*bottom*/
	      128) {
	        set_style(svelte_virtual_list_contents, "padding-bottom",
	        /*bottom*/
	        ctx[7] + "px");
	      }

	      if (!current || dirty &
	      /*height*/
	      1) {
	        set_style(svelte_virtual_list_viewport, "height",
	        /*height*/
	        ctx[0]);
	      }
	    },

	    i(local) {
	      if (current) return;

	      for (let i = 0; i < each_value.length; i += 1) {
	        transition_in(each_blocks[i]);
	      }

	      current = true;
	    },

	    o(local) {
	      for (let i = 0; i < each_blocks.length; i += 1) {
	        transition_out(each_blocks[i]);
	      }

	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(svelte_virtual_list_viewport);

	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].d();
	      }
	      /*svelte_virtual_list_contents_binding*/


	      ctx[20](null);
	      /*svelte_virtual_list_viewport_binding*/

	      ctx[21](null);
	      svelte_virtual_list_viewport_resize_listener();
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function instance$d($$self, $$props, $$invalidate) {
	  let {
	    items = undefined
	  } = $$props;
	  let {
	    height = "100%"
	  } = $$props;
	  let {
	    itemHeight = 40
	  } = $$props;
	  let {
	    hoverItemIndex = 0
	  } = $$props;
	  let {
	    start = 0
	  } = $$props;
	  let {
	    end = 0
	  } = $$props; // local state

	  let height_map = [];
	  let rows;
	  let viewport;
	  let contents;
	  let viewport_height = 0;
	  let visible;
	  let mounted;
	  let top = 0;
	  let bottom = 0;
	  let average_height;

	  async function refresh(items, viewport_height, itemHeight) {
	    const {
	      scrollTop
	    } = viewport;
	    await tick(); // wait until the DOM is up to date

	    let content_height = top - scrollTop;
	    let i = start;

	    while (content_height < viewport_height && i < items.length) {
	      let row = rows[i - start];

	      if (!row) {
	        $$invalidate(10, end = i + 1);
	        await tick(); // render the newly visible row

	        row = rows[i - start];
	      }

	      const row_height = height_map[i] = itemHeight || row.offsetHeight;
	      content_height += row_height;
	      i += 1;
	    }

	    $$invalidate(10, end = i);
	    const remaining = items.length - end;
	    average_height = (top + content_height) / end;
	    $$invalidate(7, bottom = remaining * average_height);
	    height_map.length = items.length;
	    $$invalidate(2, viewport.scrollTop = 0, viewport);
	  }

	  async function handle_scroll() {
	    const {
	      scrollTop
	    } = viewport;
	    const old_start = start;

	    for (let v = 0; v < rows.length; v += 1) {
	      height_map[start + v] = itemHeight || rows[v].offsetHeight;
	    }

	    let i = 0;
	    let y = 0;

	    while (i < items.length) {
	      const row_height = height_map[i] || average_height;

	      if (y + row_height > scrollTop) {
	        $$invalidate(9, start = i);
	        $$invalidate(6, top = y);
	        break;
	      }

	      y += row_height;
	      i += 1;
	    }

	    while (i < items.length) {
	      y += height_map[i] || average_height;
	      i += 1;
	      if (y > scrollTop + viewport_height) break;
	    }

	    $$invalidate(10, end = i);
	    const remaining = items.length - end;
	    average_height = y / end;

	    while (i < items.length) height_map[i++] = average_height;

	    $$invalidate(7, bottom = remaining * average_height); // prevent jumping if we scrolled up into unknown territory

	    if (start < old_start) {
	      await tick();
	      let expected_height = 0;
	      let actual_height = 0;

	      for (let i = start; i < old_start; i += 1) {
	        if (rows[i - start]) {
	          expected_height += height_map[i];
	          actual_height += itemHeight || rows[i - start].offsetHeight;
	        }
	      }

	      const d = actual_height - expected_height;
	      viewport.scrollTo(0, scrollTop + d);
	    }
	  } // TODO if we overestimated the space these
	  // rows would occupy we may need to add some
	  // more. maybe we can just call handle_scroll again?
	  // trigger initial refresh


	  onMount(() => {
	    rows = contents.getElementsByTagName("svelte-virtual-list-row");
	    $$invalidate(15, mounted = true);
	  });
	  let {
	    $$slots = {},
	    $$scope
	  } = $$props;

	  function svelte_virtual_list_contents_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(3, contents = $$value);
	    });
	  }

	  function svelte_virtual_list_viewport_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(2, viewport = $$value);
	    });
	  }

	  function svelte_virtual_list_viewport_elementresize_handler() {
	    viewport_height = this.offsetHeight;
	    $$invalidate(4, viewport_height);
	  }

	  $$self.$set = $$props => {
	    if ("items" in $$props) $$invalidate(11, items = $$props.items);
	    if ("height" in $$props) $$invalidate(0, height = $$props.height);
	    if ("itemHeight" in $$props) $$invalidate(12, itemHeight = $$props.itemHeight);
	    if ("hoverItemIndex" in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
	    if ("start" in $$props) $$invalidate(9, start = $$props.start);
	    if ("end" in $$props) $$invalidate(10, end = $$props.end);
	    if ("$$scope" in $$props) $$invalidate(18, $$scope = $$props.$$scope);
	  };

	  $$self.$$.update = () => {
	    if ($$self.$$.dirty &
	    /*items, start, end*/
	    3584) {
	       $$invalidate(5, visible = items.slice(start, end).map((data, i) => {
	        return {
	          index: i + start,
	          data
	        };
	      }));
	    }

	    if ($$self.$$.dirty &
	    /*mounted, items, viewport_height, itemHeight*/
	    38928) {
	      // whenever `items` changes, invalidate the current heightmap
	       if (mounted) refresh(items, viewport_height, itemHeight);
	    }
	  };

	  return [height, hoverItemIndex, viewport, contents, viewport_height, visible, top, bottom, handle_scroll, start, end, items, itemHeight, height_map, rows, mounted, average_height, refresh, $$scope, $$slots, svelte_virtual_list_contents_binding, svelte_virtual_list_viewport_binding, svelte_virtual_list_viewport_elementresize_handler];
	}

	class VirtualList extends SvelteComponent {
	  constructor(options) {
	    super();
	    if (!document.getElementById("svelte-p6ehlv-style")) add_css$1();
	    init(this, options, instance$d, create_fragment$d, safe_not_equal, {
	      items: 11,
	      height: 0,
	      itemHeight: 12,
	      hoverItemIndex: 1,
	      start: 9,
	      end: 10
	    });
	  }

	}

	/* node_modules/svelte-select/src/List.svelte generated by Svelte v3.23.0 */

	function add_css$2() {
	  var style = element("style");
	  style.id = "svelte-ux0sbr-style";
	  style.textContent = ".listContainer.svelte-ux0sbr{box-shadow:var(--listShadow, 0 2px 3px 0 rgba(44, 62, 80, 0.24));border-radius:var(--listBorderRadius, 4px);max-height:var(--listMaxHeight, 250px);overflow-y:auto;background:var(--listBackground, #fff)}.virtualList.svelte-ux0sbr{height:var(--virtualListHeight, 200px)}.listGroupTitle.svelte-ux0sbr{color:var(--groupTitleColor, #8f8f8f);cursor:default;font-size:var(--groupTitleFontSize, 12px);font-weight:var(--groupTitleFontWeight, 600);height:var(--height, 42px);line-height:var(--height, 42px);padding:var(--groupTitlePadding, 0 20px);text-overflow:ellipsis;overflow-x:hidden;white-space:nowrap;text-transform:var(--groupTitleTextTransform, uppercase)}.empty.svelte-ux0sbr{text-align:var(--listEmptyTextAlign, center);padding:var(--listEmptyPadding, 20px 0);color:var(--listEmptyColor, #78848F)}";
	  append(document.head, style);
	}

	function get_each_context$2(ctx, list, i) {
	  const child_ctx = ctx.slice();
	  child_ctx[34] = list[i];
	  child_ctx[36] = i;
	  return child_ctx;
	} // (210:0) {#if isVirtualList}


	function create_if_block_3$1(ctx) {
	  let div;
	  let current;
	  const virtuallist = new VirtualList({
	    props: {
	      items:
	      /*items*/
	      ctx[4],
	      itemHeight:
	      /*itemHeight*/
	      ctx[7],
	      $$slots: {
	        default: [create_default_slot$6, ({
	          item,
	          i
	        }) => ({
	          34: item,
	          36: i
	        }), ({
	          item,
	          i
	        }) => [0, (item ? 8 : 0) | (i ? 32 : 0)]]
	      },
	      $$scope: {
	        ctx
	      }
	    }
	  });
	  return {
	    c() {
	      div = element("div");
	      create_component(virtuallist.$$.fragment);
	      attr(div, "class", "listContainer virtualList svelte-ux0sbr");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      mount_component(virtuallist, div, null);
	      /*div_binding*/

	      ctx[30](div);
	      current = true;
	    },

	    p(ctx, dirty) {
	      const virtuallist_changes = {};
	      if (dirty[0] &
	      /*items*/
	      16) virtuallist_changes.items =
	      /*items*/
	      ctx[4];
	      if (dirty[0] &
	      /*itemHeight*/
	      128) virtuallist_changes.itemHeight =
	      /*itemHeight*/
	      ctx[7];

	      if (dirty[0] &
	      /*Item, filterText, getOptionLabel, selectedValue, optionIdentifier, hoverItemIndex, items*/
	      4918 | dirty[1] &
	      /*$$scope, item, i*/
	      104) {
	        virtuallist_changes.$$scope = {
	          dirty,
	          ctx
	        };
	      }

	      virtuallist.$set(virtuallist_changes);
	    },

	    i(local) {
	      if (current) return;
	      transition_in(virtuallist.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(virtuallist.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      destroy_component(virtuallist);
	      /*div_binding*/

	      ctx[30](null);
	    }

	  };
	} // (213:2) <VirtualList {items} {itemHeight} let:item let:i>


	function create_default_slot$6(ctx) {
	  let div;
	  let current;
	  let mounted;
	  let dispose;
	  var switch_value =
	  /*Item*/
	  ctx[2];

	  function switch_props(ctx) {
	    return {
	      props: {
	        item:
	        /*item*/
	        ctx[34],
	        filterText:
	        /*filterText*/
	        ctx[12],
	        getOptionLabel:
	        /*getOptionLabel*/
	        ctx[5],
	        isFirst: isItemFirst(
	        /*i*/
	        ctx[36]),
	        isActive: isItemActive(
	        /*item*/
	        ctx[34],
	        /*selectedValue*/
	        ctx[8],
	        /*optionIdentifier*/
	        ctx[9]),
	        isHover: isItemHover(
	        /*hoverItemIndex*/
	        ctx[1],
	        /*item*/
	        ctx[34],
	        /*i*/
	        ctx[36],
	        /*items*/
	        ctx[4])
	      }
	    };
	  }

	  if (switch_value) {
	    var switch_instance = new switch_value(switch_props(ctx));
	  }

	  function mouseover_handler(...args) {
	    return (
	      /*mouseover_handler*/
	      ctx[28](
	      /*i*/
	      ctx[36], ...args)
	    );
	  }

	  function click_handler(...args) {
	    return (
	      /*click_handler*/
	      ctx[29](
	      /*item*/
	      ctx[34],
	      /*i*/
	      ctx[36], ...args)
	    );
	  }

	  return {
	    c() {
	      div = element("div");
	      if (switch_instance) create_component(switch_instance.$$.fragment);
	      attr(div, "class", "listItem");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);

	      if (switch_instance) {
	        mount_component(switch_instance, div, null);
	      }

	      current = true;

	      if (!mounted) {
	        dispose = [listen(div, "mouseover", mouseover_handler), listen(div, "click", click_handler)];
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	      const switch_instance_changes = {};
	      if (dirty[1] &
	      /*item*/
	      8) switch_instance_changes.item =
	      /*item*/
	      ctx[34];
	      if (dirty[0] &
	      /*filterText*/
	      4096) switch_instance_changes.filterText =
	      /*filterText*/
	      ctx[12];
	      if (dirty[0] &
	      /*getOptionLabel*/
	      32) switch_instance_changes.getOptionLabel =
	      /*getOptionLabel*/
	      ctx[5];
	      if (dirty[1] &
	      /*i*/
	      32) switch_instance_changes.isFirst = isItemFirst(
	      /*i*/
	      ctx[36]);
	      if (dirty[0] &
	      /*selectedValue, optionIdentifier*/
	      768 | dirty[1] &
	      /*item*/
	      8) switch_instance_changes.isActive = isItemActive(
	      /*item*/
	      ctx[34],
	      /*selectedValue*/
	      ctx[8],
	      /*optionIdentifier*/
	      ctx[9]);
	      if (dirty[0] &
	      /*hoverItemIndex, items*/
	      18 | dirty[1] &
	      /*item, i*/
	      40) switch_instance_changes.isHover = isItemHover(
	      /*hoverItemIndex*/
	      ctx[1],
	      /*item*/
	      ctx[34],
	      /*i*/
	      ctx[36],
	      /*items*/
	      ctx[4]);

	      if (switch_value !== (switch_value =
	      /*Item*/
	      ctx[2])) {
	        if (switch_instance) {
	          group_outros();
	          const old_component = switch_instance;
	          transition_out(old_component.$$.fragment, 1, 0, () => {
	            destroy_component(old_component, 1);
	          });
	          check_outros();
	        }

	        if (switch_value) {
	          switch_instance = new switch_value(switch_props(ctx));
	          create_component(switch_instance.$$.fragment);
	          transition_in(switch_instance.$$.fragment, 1);
	          mount_component(switch_instance, div, null);
	        } else {
	          switch_instance = null;
	        }
	      } else if (switch_value) {
	        switch_instance.$set(switch_instance_changes);
	      }
	    },

	    i(local) {
	      if (current) return;
	      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      if (switch_instance) destroy_component(switch_instance);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	} // (232:0) {#if !isVirtualList}


	function create_if_block$b(ctx) {
	  let div;
	  let current;
	  let each_value =
	  /*items*/
	  ctx[4];
	  let each_blocks = [];

	  for (let i = 0; i < each_value.length; i += 1) {
	    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	  }

	  const out = i => transition_out(each_blocks[i], 1, 1, () => {
	    each_blocks[i] = null;
	  });

	  let each_1_else = null;

	  if (!each_value.length) {
	    each_1_else = create_else_block_1(ctx);
	  }

	  return {
	    c() {
	      div = element("div");

	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].c();
	      }

	      if (each_1_else) {
	        each_1_else.c();
	      }

	      attr(div, "class", "listContainer svelte-ux0sbr");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);

	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].m(div, null);
	      }

	      if (each_1_else) {
	        each_1_else.m(div, null);
	      }
	      /*div_binding_1*/


	      ctx[33](div);
	      current = true;
	    },

	    p(ctx, dirty) {
	      if (dirty[0] &
	      /*getGroupHeaderLabel, items, handleHover, handleClick, Item, filterText, getOptionLabel, selectedValue, optionIdentifier, hoverItemIndex, noOptionsMessage, hideEmptyState*/
	      32630) {
	        each_value =
	        /*items*/
	        ctx[4];
	        let i;

	        for (i = 0; i < each_value.length; i += 1) {
	          const child_ctx = get_each_context$2(ctx, each_value, i);

	          if (each_blocks[i]) {
	            each_blocks[i].p(child_ctx, dirty);
	            transition_in(each_blocks[i], 1);
	          } else {
	            each_blocks[i] = create_each_block$2(child_ctx);
	            each_blocks[i].c();
	            transition_in(each_blocks[i], 1);
	            each_blocks[i].m(div, null);
	          }
	        }

	        group_outros();

	        for (i = each_value.length; i < each_blocks.length; i += 1) {
	          out(i);
	        }

	        check_outros();

	        if (!each_value.length && each_1_else) {
	          each_1_else.p(ctx, dirty);
	        } else if (!each_value.length) {
	          each_1_else = create_else_block_1(ctx);
	          each_1_else.c();
	          each_1_else.m(div, null);
	        } else if (each_1_else) {
	          each_1_else.d(1);
	          each_1_else = null;
	        }
	      }
	    },

	    i(local) {
	      if (current) return;

	      for (let i = 0; i < each_value.length; i += 1) {
	        transition_in(each_blocks[i]);
	      }

	      current = true;
	    },

	    o(local) {
	      each_blocks = each_blocks.filter(Boolean);

	      for (let i = 0; i < each_blocks.length; i += 1) {
	        transition_out(each_blocks[i]);
	      }

	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      destroy_each(each_blocks, detaching);
	      if (each_1_else) each_1_else.d();
	      /*div_binding_1*/

	      ctx[33](null);
	    }

	  };
	} // (254:2) {:else}


	function create_else_block_1(ctx) {
	  let if_block_anchor;
	  let if_block = !
	  /*hideEmptyState*/
	  ctx[10] && create_if_block_2$1(ctx);
	  return {
	    c() {
	      if (if_block) if_block.c();
	      if_block_anchor = empty();
	    },

	    m(target, anchor) {
	      if (if_block) if_block.m(target, anchor);
	      insert(target, if_block_anchor, anchor);
	    },

	    p(ctx, dirty) {
	      if (!
	      /*hideEmptyState*/
	      ctx[10]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block_2$1(ctx);
	          if_block.c();
	          if_block.m(if_block_anchor.parentNode, if_block_anchor);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }
	    },

	    d(detaching) {
	      if (if_block) if_block.d(detaching);
	      if (detaching) detach(if_block_anchor);
	    }

	  };
	} // (255:4) {#if !hideEmptyState}


	function create_if_block_2$1(ctx) {
	  let div;
	  let t;
	  return {
	    c() {
	      div = element("div");
	      t = text(
	      /*noOptionsMessage*/
	      ctx[11]);
	      attr(div, "class", "empty svelte-ux0sbr");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      append(div, t);
	    },

	    p(ctx, dirty) {
	      if (dirty[0] &
	      /*noOptionsMessage*/
	      2048) set_data(t,
	      /*noOptionsMessage*/
	      ctx[11]);
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	    }

	  };
	} // (237:4) { :else }


	function create_else_block$1(ctx) {
	  let div;
	  let t;
	  let current;
	  let mounted;
	  let dispose;
	  var switch_value =
	  /*Item*/
	  ctx[2];

	  function switch_props(ctx) {
	    return {
	      props: {
	        item:
	        /*item*/
	        ctx[34],
	        filterText:
	        /*filterText*/
	        ctx[12],
	        getOptionLabel:
	        /*getOptionLabel*/
	        ctx[5],
	        isFirst: isItemFirst(
	        /*i*/
	        ctx[36]),
	        isActive: isItemActive(
	        /*item*/
	        ctx[34],
	        /*selectedValue*/
	        ctx[8],
	        /*optionIdentifier*/
	        ctx[9]),
	        isHover: isItemHover(
	        /*hoverItemIndex*/
	        ctx[1],
	        /*item*/
	        ctx[34],
	        /*i*/
	        ctx[36],
	        /*items*/
	        ctx[4])
	      }
	    };
	  }

	  if (switch_value) {
	    var switch_instance = new switch_value(switch_props(ctx));
	  }

	  function mouseover_handler_1(...args) {
	    return (
	      /*mouseover_handler_1*/
	      ctx[31](
	      /*i*/
	      ctx[36], ...args)
	    );
	  }

	  function click_handler_1(...args) {
	    return (
	      /*click_handler_1*/
	      ctx[32](
	      /*item*/
	      ctx[34],
	      /*i*/
	      ctx[36], ...args)
	    );
	  }

	  return {
	    c() {
	      div = element("div");
	      if (switch_instance) create_component(switch_instance.$$.fragment);
	      t = space();
	      attr(div, "class", "listItem");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);

	      if (switch_instance) {
	        mount_component(switch_instance, div, null);
	      }

	      append(div, t);
	      current = true;

	      if (!mounted) {
	        dispose = [listen(div, "mouseover", mouseover_handler_1), listen(div, "click", click_handler_1)];
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	      const switch_instance_changes = {};
	      if (dirty[0] &
	      /*items*/
	      16) switch_instance_changes.item =
	      /*item*/
	      ctx[34];
	      if (dirty[0] &
	      /*filterText*/
	      4096) switch_instance_changes.filterText =
	      /*filterText*/
	      ctx[12];
	      if (dirty[0] &
	      /*getOptionLabel*/
	      32) switch_instance_changes.getOptionLabel =
	      /*getOptionLabel*/
	      ctx[5];
	      if (dirty[0] &
	      /*items, selectedValue, optionIdentifier*/
	      784) switch_instance_changes.isActive = isItemActive(
	      /*item*/
	      ctx[34],
	      /*selectedValue*/
	      ctx[8],
	      /*optionIdentifier*/
	      ctx[9]);
	      if (dirty[0] &
	      /*hoverItemIndex, items*/
	      18) switch_instance_changes.isHover = isItemHover(
	      /*hoverItemIndex*/
	      ctx[1],
	      /*item*/
	      ctx[34],
	      /*i*/
	      ctx[36],
	      /*items*/
	      ctx[4]);

	      if (switch_value !== (switch_value =
	      /*Item*/
	      ctx[2])) {
	        if (switch_instance) {
	          group_outros();
	          const old_component = switch_instance;
	          transition_out(old_component.$$.fragment, 1, 0, () => {
	            destroy_component(old_component, 1);
	          });
	          check_outros();
	        }

	        if (switch_value) {
	          switch_instance = new switch_value(switch_props(ctx));
	          create_component(switch_instance.$$.fragment);
	          transition_in(switch_instance.$$.fragment, 1);
	          mount_component(switch_instance, div, t);
	        } else {
	          switch_instance = null;
	        }
	      } else if (switch_value) {
	        switch_instance.$set(switch_instance_changes);
	      }
	    },

	    i(local) {
	      if (current) return;
	      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      if (switch_instance) destroy_component(switch_instance);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	} // (235:4) {#if item.isGroupHeader && !item.isSelectable}


	function create_if_block_1$2(ctx) {
	  let div;
	  let t_value =
	  /*getGroupHeaderLabel*/
	  ctx[6](
	  /*item*/
	  ctx[34]) + "";
	  let t;
	  return {
	    c() {
	      div = element("div");
	      t = text(t_value);
	      attr(div, "class", "listGroupTitle svelte-ux0sbr");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      append(div, t);
	    },

	    p(ctx, dirty) {
	      if (dirty[0] &
	      /*getGroupHeaderLabel, items*/
	      80 && t_value !== (t_value =
	      /*getGroupHeaderLabel*/
	      ctx[6](
	      /*item*/
	      ctx[34]) + "")) set_data(t, t_value);
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div);
	    }

	  };
	} // (234:2) {#each items as item, i}


	function create_each_block$2(ctx) {
	  let current_block_type_index;
	  let if_block;
	  let if_block_anchor;
	  let current;
	  const if_block_creators = [create_if_block_1$2, create_else_block$1];
	  const if_blocks = [];

	  function select_block_type(ctx, dirty) {
	    if (
	    /*item*/
	    ctx[34].isGroupHeader && !
	    /*item*/
	    ctx[34].isSelectable) return 0;
	    return 1;
	  }

	  current_block_type_index = select_block_type(ctx);
	  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	  return {
	    c() {
	      if_block.c();
	      if_block_anchor = empty();
	    },

	    m(target, anchor) {
	      if_blocks[current_block_type_index].m(target, anchor);
	      insert(target, if_block_anchor, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      let previous_block_index = current_block_type_index;
	      current_block_type_index = select_block_type(ctx);

	      if (current_block_type_index === previous_block_index) {
	        if_blocks[current_block_type_index].p(ctx, dirty);
	      } else {
	        group_outros();
	        transition_out(if_blocks[previous_block_index], 1, 1, () => {
	          if_blocks[previous_block_index] = null;
	        });
	        check_outros();
	        if_block = if_blocks[current_block_type_index];

	        if (!if_block) {
	          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	          if_block.c();
	        }

	        transition_in(if_block, 1);
	        if_block.m(if_block_anchor.parentNode, if_block_anchor);
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block);
	      current = false;
	    },

	    d(detaching) {
	      if_blocks[current_block_type_index].d(detaching);
	      if (detaching) detach(if_block_anchor);
	    }

	  };
	}

	function create_fragment$e(ctx) {
	  let t;
	  let if_block1_anchor;
	  let current;
	  let mounted;
	  let dispose;
	  let if_block0 =
	  /*isVirtualList*/
	  ctx[3] && create_if_block_3$1(ctx);
	  let if_block1 = !
	  /*isVirtualList*/
	  ctx[3] && create_if_block$b(ctx);
	  return {
	    c() {
	      if (if_block0) if_block0.c();
	      t = space();
	      if (if_block1) if_block1.c();
	      if_block1_anchor = empty();
	    },

	    m(target, anchor) {
	      if (if_block0) if_block0.m(target, anchor);
	      insert(target, t, anchor);
	      if (if_block1) if_block1.m(target, anchor);
	      insert(target, if_block1_anchor, anchor);
	      current = true;

	      if (!mounted) {
	        dispose = listen(window, "keydown",
	        /*handleKeyDown*/
	        ctx[15]);
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      if (
	      /*isVirtualList*/
	      ctx[3]) {
	        if (if_block0) {
	          if_block0.p(ctx, dirty);

	          if (dirty[0] &
	          /*isVirtualList*/
	          8) {
	            transition_in(if_block0, 1);
	          }
	        } else {
	          if_block0 = create_if_block_3$1(ctx);
	          if_block0.c();
	          transition_in(if_block0, 1);
	          if_block0.m(t.parentNode, t);
	        }
	      } else if (if_block0) {
	        group_outros();
	        transition_out(if_block0, 1, 1, () => {
	          if_block0 = null;
	        });
	        check_outros();
	      }

	      if (!
	      /*isVirtualList*/
	      ctx[3]) {
	        if (if_block1) {
	          if_block1.p(ctx, dirty);

	          if (dirty[0] &
	          /*isVirtualList*/
	          8) {
	            transition_in(if_block1, 1);
	          }
	        } else {
	          if_block1 = create_if_block$b(ctx);
	          if_block1.c();
	          transition_in(if_block1, 1);
	          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
	        }
	      } else if (if_block1) {
	        group_outros();
	        transition_out(if_block1, 1, 1, () => {
	          if_block1 = null;
	        });
	        check_outros();
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block0);
	      transition_in(if_block1);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block0);
	      transition_out(if_block1);
	      current = false;
	    },

	    d(detaching) {
	      if (if_block0) if_block0.d(detaching);
	      if (detaching) detach(t);
	      if (if_block1) if_block1.d(detaching);
	      if (detaching) detach(if_block1_anchor);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function isItemActive(item, selectedValue, optionIdentifier) {
	  return selectedValue && selectedValue[optionIdentifier] === item[optionIdentifier];
	}

	function isItemFirst(itemIndex) {
	  return itemIndex === 0;
	}

	function isItemHover(hoverItemIndex, item, itemIndex, items) {
	  return hoverItemIndex === itemIndex || items.length === 1;
	}

	function instance$e($$self, $$props, $$invalidate) {
	  const dispatch = createEventDispatcher();
	  let {
	    container = undefined
	  } = $$props;
	  let {
	    Item: Item$1 = Item
	  } = $$props;
	  let {
	    isVirtualList = false
	  } = $$props;
	  let {
	    items = []
	  } = $$props;
	  let {
	    getOptionLabel = (option, filterText) => {
	      if (option) return option.isCreator ? `Create \"${filterText}\"` : option.label;
	    }
	  } = $$props;
	  let {
	    getGroupHeaderLabel = option => {
	      return option.label;
	    }
	  } = $$props;
	  let {
	    itemHeight = 40
	  } = $$props;
	  let {
	    hoverItemIndex = 0
	  } = $$props;
	  let {
	    selectedValue = undefined
	  } = $$props;
	  let {
	    optionIdentifier = "value"
	  } = $$props;
	  let {
	    hideEmptyState = false
	  } = $$props;
	  let {
	    noOptionsMessage = "No options"
	  } = $$props;
	  let {
	    isMulti = false
	  } = $$props;
	  let {
	    activeItemIndex = 0
	  } = $$props;
	  let {
	    filterText = ""
	  } = $$props;
	  let isScrollingTimer = 0;
	  let isScrolling = false;
	  let prev_items;
	  let prev_activeItemIndex;
	  let prev_selectedValue;
	  onMount(() => {
	    if (items.length > 0 && !isMulti && selectedValue) {
	      const _hoverItemIndex = items.findIndex(item => item[optionIdentifier] === selectedValue[optionIdentifier]);

	      if (_hoverItemIndex) {
	        $$invalidate(1, hoverItemIndex = _hoverItemIndex);
	      }
	    }

	    scrollToActiveItem("active");
	    container.addEventListener("scroll", () => {
	      clearTimeout(isScrollingTimer);
	      isScrollingTimer = setTimeout(() => {
	        isScrolling = false;
	      }, 100);
	    }, false);
	  });
	  onDestroy(() => {}); // clearTimeout(isScrollingTimer);

	  beforeUpdate(() => {
	    if (items !== prev_items && items.length > 0) {
	      $$invalidate(1, hoverItemIndex = 0);
	    } // if (prev_activeItemIndex && activeItemIndex > -1) {
	    //   hoverItemIndex = activeItemIndex;
	    //   scrollToActiveItem('active');
	    // }
	    // if (prev_selectedValue && selectedValue) {
	    //   scrollToActiveItem('active');
	    //   if (items && !isMulti) {
	    //     const hoverItemIndex = items.findIndex((item) => item[optionIdentifier] === selectedValue[optionIdentifier]);
	    //     if (hoverItemIndex) {
	    //       hoverItemIndex = hoverItemIndex;
	    //     }
	    //   }
	    // }


	    prev_items = items;
	    prev_activeItemIndex = activeItemIndex;
	    prev_selectedValue = selectedValue;
	  });

	  function handleSelect(item) {
	    if (item.isCreator) return;
	    dispatch("itemSelected", item);
	  }

	  function handleHover(i) {
	    if (isScrolling) return;
	    $$invalidate(1, hoverItemIndex = i);
	  }

	  function handleClick(args) {
	    const {
	      item,
	      i,
	      event
	    } = args;
	    event.stopPropagation();
	    if (selectedValue && !isMulti && selectedValue[optionIdentifier] === item[optionIdentifier]) return closeList();

	    if (item.isCreator) {
	      dispatch("itemCreated", filterText);
	    } else {
	      $$invalidate(16, activeItemIndex = i);
	      $$invalidate(1, hoverItemIndex = i);
	      handleSelect(item);
	    }
	  }

	  function closeList() {
	    dispatch("closeList");
	  }

	  async function updateHoverItem(increment) {
	    if (isVirtualList) return;
	    let isNonSelectableItem = true;

	    while (isNonSelectableItem) {
	      if (increment > 0 && hoverItemIndex === items.length - 1) {
	        $$invalidate(1, hoverItemIndex = 0);
	      } else if (increment < 0 && hoverItemIndex === 0) {
	        $$invalidate(1, hoverItemIndex = items.length - 1);
	      } else {
	        $$invalidate(1, hoverItemIndex = hoverItemIndex + increment);
	      }

	      isNonSelectableItem = items[hoverItemIndex].isGroupHeader && !items[hoverItemIndex].isSelectable;
	    }

	    await tick();
	    scrollToActiveItem("hover");
	  }

	  function handleKeyDown(e) {
	    switch (e.key) {
	      case "ArrowDown":
	        e.preventDefault();
	        items.length && updateHoverItem(1);
	        break;

	      case "ArrowUp":
	        e.preventDefault();
	        items.length && updateHoverItem(-1);
	        break;

	      case "Enter":
	        e.preventDefault();
	        if (items.length === 0) break;
	        const hoverItem = items[hoverItemIndex];

	        if (selectedValue && !isMulti && selectedValue[optionIdentifier] === hoverItem[optionIdentifier]) {
	          closeList();
	          break;
	        }

	        if (hoverItem.isCreator) {
	          dispatch("itemCreated", filterText);
	        } else {
	          $$invalidate(16, activeItemIndex = hoverItemIndex);
	          handleSelect(items[hoverItemIndex]);
	        }

	        break;

	      case "Tab":
	        e.preventDefault();
	        if (items.length === 0) break;
	        if (selectedValue && selectedValue[optionIdentifier] === items[hoverItemIndex][optionIdentifier]) return closeList();
	        $$invalidate(16, activeItemIndex = hoverItemIndex);
	        handleSelect(items[hoverItemIndex]);
	        break;
	    }
	  }

	  function scrollToActiveItem(className) {
	    if (isVirtualList || !container) return;
	    let offsetBounding;
	    const focusedElemBounding = container.querySelector(`.listItem .${className}`);

	    if (focusedElemBounding) {
	      offsetBounding = container.getBoundingClientRect().bottom - focusedElemBounding.getBoundingClientRect().bottom;
	    }

	    $$invalidate(0, container.scrollTop -= offsetBounding, container);
	  }

	  const mouseover_handler = i => handleHover(i);

	  const click_handler = (item, i, event) => handleClick({
	    item,
	    i,
	    event
	  });

	  function div_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(0, container = $$value);
	    });
	  }

	  const mouseover_handler_1 = i => handleHover(i);

	  const click_handler_1 = (item, i, event) => handleClick({
	    item,
	    i,
	    event
	  });

	  function div_binding_1($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(0, container = $$value);
	    });
	  }

	  $$self.$set = $$props => {
	    if ("container" in $$props) $$invalidate(0, container = $$props.container);
	    if ("Item" in $$props) $$invalidate(2, Item$1 = $$props.Item);
	    if ("isVirtualList" in $$props) $$invalidate(3, isVirtualList = $$props.isVirtualList);
	    if ("items" in $$props) $$invalidate(4, items = $$props.items);
	    if ("getOptionLabel" in $$props) $$invalidate(5, getOptionLabel = $$props.getOptionLabel);
	    if ("getGroupHeaderLabel" in $$props) $$invalidate(6, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
	    if ("itemHeight" in $$props) $$invalidate(7, itemHeight = $$props.itemHeight);
	    if ("hoverItemIndex" in $$props) $$invalidate(1, hoverItemIndex = $$props.hoverItemIndex);
	    if ("selectedValue" in $$props) $$invalidate(8, selectedValue = $$props.selectedValue);
	    if ("optionIdentifier" in $$props) $$invalidate(9, optionIdentifier = $$props.optionIdentifier);
	    if ("hideEmptyState" in $$props) $$invalidate(10, hideEmptyState = $$props.hideEmptyState);
	    if ("noOptionsMessage" in $$props) $$invalidate(11, noOptionsMessage = $$props.noOptionsMessage);
	    if ("isMulti" in $$props) $$invalidate(17, isMulti = $$props.isMulti);
	    if ("activeItemIndex" in $$props) $$invalidate(16, activeItemIndex = $$props.activeItemIndex);
	    if ("filterText" in $$props) $$invalidate(12, filterText = $$props.filterText);
	  };

	  return [container, hoverItemIndex, Item$1, isVirtualList, items, getOptionLabel, getGroupHeaderLabel, itemHeight, selectedValue, optionIdentifier, hideEmptyState, noOptionsMessage, filterText, handleHover, handleClick, handleKeyDown, activeItemIndex, isMulti, isScrollingTimer, isScrolling, prev_items, prev_activeItemIndex, prev_selectedValue, dispatch, handleSelect, closeList, updateHoverItem, scrollToActiveItem, mouseover_handler, click_handler, div_binding, mouseover_handler_1, click_handler_1, div_binding_1];
	}

	class List extends SvelteComponent {
	  constructor(options) {
	    super();
	    if (!document.getElementById("svelte-ux0sbr-style")) add_css$2();
	    init(this, options, instance$e, create_fragment$e, safe_not_equal, {
	      container: 0,
	      Item: 2,
	      isVirtualList: 3,
	      items: 4,
	      getOptionLabel: 5,
	      getGroupHeaderLabel: 6,
	      itemHeight: 7,
	      hoverItemIndex: 1,
	      selectedValue: 8,
	      optionIdentifier: 9,
	      hideEmptyState: 10,
	      noOptionsMessage: 11,
	      isMulti: 17,
	      activeItemIndex: 16,
	      filterText: 12
	    }, [-1, -1]);
	  }

	}

	/* node_modules/svelte-select/src/Selection.svelte generated by Svelte v3.23.0 */

	function add_css$3() {
	  var style = element("style");
	  style.id = "svelte-ch6bh7-style";
	  style.textContent = ".selection.svelte-ch6bh7{text-overflow:ellipsis;overflow-x:hidden;white-space:nowrap}";
	  append(document.head, style);
	}

	function create_fragment$f(ctx) {
	  let div;
	  let raw_value =
	  /*getSelectionLabel*/
	  ctx[0](
	  /*item*/
	  ctx[1]) + "";
	  return {
	    c() {
	      div = element("div");
	      attr(div, "class", "selection svelte-ch6bh7");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      div.innerHTML = raw_value;
	    },

	    p(ctx, [dirty]) {
	      if (dirty &
	      /*getSelectionLabel, item*/
	      3 && raw_value !== (raw_value =
	      /*getSelectionLabel*/
	      ctx[0](
	      /*item*/
	      ctx[1]) + "")) div.innerHTML = raw_value;
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(div);
	    }

	  };
	}

	function instance$f($$self, $$props, $$invalidate) {
	  let {
	    getSelectionLabel = undefined
	  } = $$props;
	  let {
	    item = undefined
	  } = $$props;

	  $$self.$set = $$props => {
	    if ("getSelectionLabel" in $$props) $$invalidate(0, getSelectionLabel = $$props.getSelectionLabel);
	    if ("item" in $$props) $$invalidate(1, item = $$props.item);
	  };

	  return [getSelectionLabel, item];
	}

	class Selection extends SvelteComponent {
	  constructor(options) {
	    super();
	    if (!document.getElementById("svelte-ch6bh7-style")) add_css$3();
	    init(this, options, instance$f, create_fragment$f, safe_not_equal, {
	      getSelectionLabel: 0,
	      item: 1
	    });
	  }

	}

	/* node_modules/svelte-select/src/MultiSelection.svelte generated by Svelte v3.23.0 */

	function add_css$4() {
	  var style = element("style");
	  style.id = "svelte-rtzfov-style";
	  style.textContent = ".multiSelectItem.svelte-rtzfov.svelte-rtzfov{background:var(--multiItemBG, #EBEDEF);margin:var(--multiItemMargin, 5px 5px 0 0);border-radius:var(--multiItemBorderRadius, 16px);height:var(--multiItemHeight, 32px);line-height:var(--multiItemHeight, 32px);display:flex;cursor:default;padding:var(--multiItemPadding, 0 10px 0 15px)}.multiSelectItem_label.svelte-rtzfov.svelte-rtzfov{margin:var(--multiLabelMargin, 0 5px 0 0)}.multiSelectItem.svelte-rtzfov.svelte-rtzfov:hover,.multiSelectItem.active.svelte-rtzfov.svelte-rtzfov{background-color:var(--multiItemActiveBG, #006FFF);color:var(--multiItemActiveColor, #fff)}.multiSelectItem.disabled.svelte-rtzfov.svelte-rtzfov:hover{background:var(--multiItemDisabledHoverBg, #EBEDEF);color:var(--multiItemDisabledHoverColor, #C1C6CC)}.multiSelectItem_clear.svelte-rtzfov.svelte-rtzfov{border-radius:var(--multiClearRadius, 50%);background:var(--multiClearBG, #52616F);width:var(--multiClearWidth, 16px);height:var(--multiClearHeight, 16px);position:relative;top:var(--multiClearTop, 8px);text-align:var(--multiClearTextAlign, center);padding:var(--multiClearPadding, 1px)}.multiSelectItem_clear.svelte-rtzfov.svelte-rtzfov:hover,.active.svelte-rtzfov .multiSelectItem_clear.svelte-rtzfov{background:var(--multiClearHoverBG, #fff)}.multiSelectItem_clear.svelte-rtzfov:hover svg.svelte-rtzfov,.active.svelte-rtzfov .multiSelectItem_clear svg.svelte-rtzfov{fill:var(--multiClearHoverFill, #006FFF)}.multiSelectItem_clear.svelte-rtzfov svg.svelte-rtzfov{fill:var(--multiClearFill, #EBEDEF);vertical-align:top}";
	  append(document.head, style);
	}

	function get_each_context$3(ctx, list, i) {
	  const child_ctx = ctx.slice();
	  child_ctx[7] = list[i];
	  child_ctx[9] = i;
	  return child_ctx;
	} // (22:2) {#if !isDisabled}


	function create_if_block$c(ctx) {
	  let div;
	  let mounted;
	  let dispose;

	  function click_handler(...args) {
	    return (
	      /*click_handler*/
	      ctx[6](
	      /*i*/
	      ctx[9], ...args)
	    );
	  }

	  return {
	    c() {
	      div = element("div");
	      div.innerHTML = `<svg width="100%" height="100%" viewBox="-2 -2 50 50" focusable="false" role="presentation" class="svelte-rtzfov"><path d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124 l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"></path></svg>`;
	      attr(div, "class", "multiSelectItem_clear svelte-rtzfov");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);

	      if (!mounted) {
	        dispose = listen(div, "click", click_handler);
	        mounted = true;
	      }
	    },

	    p(new_ctx, dirty) {
	      ctx = new_ctx;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      mounted = false;
	      dispose();
	    }

	  };
	} // (17:0) {#each selectedValue as value, i}


	function create_each_block$3(ctx) {
	  let div1;
	  let div0;
	  let raw_value =
	  /*getSelectionLabel*/
	  ctx[3](
	  /*value*/
	  ctx[7]) + "";
	  let t0;
	  let t1;
	  let div1_class_value;
	  let if_block = !
	  /*isDisabled*/
	  ctx[2] && create_if_block$c(ctx);
	  return {
	    c() {
	      div1 = element("div");
	      div0 = element("div");
	      t0 = space();
	      if (if_block) if_block.c();
	      t1 = space();
	      attr(div0, "class", "multiSelectItem_label svelte-rtzfov");
	      attr(div1, "class", div1_class_value = "multiSelectItem " + (
	      /*activeSelectedValue*/
	      ctx[1] ===
	      /*i*/
	      ctx[9] ? "active" : "") + " " + (
	      /*isDisabled*/
	      ctx[2] ? "disabled" : "") + " svelte-rtzfov");
	    },

	    m(target, anchor) {
	      insert(target, div1, anchor);
	      append(div1, div0);
	      div0.innerHTML = raw_value;
	      append(div1, t0);
	      if (if_block) if_block.m(div1, null);
	      append(div1, t1);
	    },

	    p(ctx, dirty) {
	      if (dirty &
	      /*getSelectionLabel, selectedValue*/
	      9 && raw_value !== (raw_value =
	      /*getSelectionLabel*/
	      ctx[3](
	      /*value*/
	      ctx[7]) + "")) div0.innerHTML = raw_value;

	      if (!
	      /*isDisabled*/
	      ctx[2]) {
	        if (if_block) {
	          if_block.p(ctx, dirty);
	        } else {
	          if_block = create_if_block$c(ctx);
	          if_block.c();
	          if_block.m(div1, t1);
	        }
	      } else if (if_block) {
	        if_block.d(1);
	        if_block = null;
	      }

	      if (dirty &
	      /*activeSelectedValue, isDisabled*/
	      6 && div1_class_value !== (div1_class_value = "multiSelectItem " + (
	      /*activeSelectedValue*/
	      ctx[1] ===
	      /*i*/
	      ctx[9] ? "active" : "") + " " + (
	      /*isDisabled*/
	      ctx[2] ? "disabled" : "") + " svelte-rtzfov")) {
	        attr(div1, "class", div1_class_value);
	      }
	    },

	    d(detaching) {
	      if (detaching) detach(div1);
	      if (if_block) if_block.d();
	    }

	  };
	}

	function create_fragment$g(ctx) {
	  let each_1_anchor;
	  let each_value =
	  /*selectedValue*/
	  ctx[0];
	  let each_blocks = [];

	  for (let i = 0; i < each_value.length; i += 1) {
	    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	  }

	  return {
	    c() {
	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].c();
	      }

	      each_1_anchor = empty();
	    },

	    m(target, anchor) {
	      for (let i = 0; i < each_blocks.length; i += 1) {
	        each_blocks[i].m(target, anchor);
	      }

	      insert(target, each_1_anchor, anchor);
	    },

	    p(ctx, [dirty]) {
	      if (dirty &
	      /*activeSelectedValue, isDisabled, handleClear, getSelectionLabel, selectedValue*/
	      31) {
	        each_value =
	        /*selectedValue*/
	        ctx[0];
	        let i;

	        for (i = 0; i < each_value.length; i += 1) {
	          const child_ctx = get_each_context$3(ctx, each_value, i);

	          if (each_blocks[i]) {
	            each_blocks[i].p(child_ctx, dirty);
	          } else {
	            each_blocks[i] = create_each_block$3(child_ctx);
	            each_blocks[i].c();
	            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
	          }
	        }

	        for (; i < each_blocks.length; i += 1) {
	          each_blocks[i].d(1);
	        }

	        each_blocks.length = each_value.length;
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      destroy_each(each_blocks, detaching);
	      if (detaching) detach(each_1_anchor);
	    }

	  };
	}

	function instance$g($$self, $$props, $$invalidate) {
	  const dispatch = createEventDispatcher();
	  let {
	    selectedValue = []
	  } = $$props;
	  let {
	    activeSelectedValue = undefined
	  } = $$props;
	  let {
	    isDisabled = false
	  } = $$props;
	  let {
	    getSelectionLabel = undefined
	  } = $$props;

	  function handleClear(i, event) {
	    event.stopPropagation();
	    dispatch("multiItemClear", {
	      i
	    });
	  }

	  const click_handler = (i, event) => handleClear(i, event);

	  $$self.$set = $$props => {
	    if ("selectedValue" in $$props) $$invalidate(0, selectedValue = $$props.selectedValue);
	    if ("activeSelectedValue" in $$props) $$invalidate(1, activeSelectedValue = $$props.activeSelectedValue);
	    if ("isDisabled" in $$props) $$invalidate(2, isDisabled = $$props.isDisabled);
	    if ("getSelectionLabel" in $$props) $$invalidate(3, getSelectionLabel = $$props.getSelectionLabel);
	  };

	  return [selectedValue, activeSelectedValue, isDisabled, getSelectionLabel, handleClear, dispatch, click_handler];
	}

	class MultiSelection extends SvelteComponent {
	  constructor(options) {
	    super();
	    if (!document.getElementById("svelte-rtzfov-style")) add_css$4();
	    init(this, options, instance$g, create_fragment$g, safe_not_equal, {
	      selectedValue: 0,
	      activeSelectedValue: 1,
	      isDisabled: 2,
	      getSelectionLabel: 3
	    });
	  }

	}

	function isOutOfViewport (elem) {
	  const bounding = elem.getBoundingClientRect();
	  const out = {};
	  out.top = bounding.top < 0;
	  out.left = bounding.left < 0;
	  out.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
	  out.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
	  out.any = out.top || out.left || out.bottom || out.right;
	  return out;
	}

	function debounce(func, wait, immediate) {
	  let timeout;
	  return function executedFunction() {
	    let context = this;
	    let args = arguments;

	    let later = function () {
	      timeout = null;
	      if (!immediate) func.apply(context, args);
	    };

	    let callNow = immediate && !timeout;
	    clearTimeout(timeout);
	    timeout = setTimeout(later, wait);
	    if (callNow) func.apply(context, args);
	  };
	}

	/* node_modules/svelte-select/src/Select.svelte generated by Svelte v3.23.0 */
	const {
	  document: document_1
	} = globals;

	function add_css$5() {
	  var style = element("style");
	  style.id = "svelte-2eeumy-style";
	  style.textContent = ".selectContainer.svelte-2eeumy.svelte-2eeumy{--padding:0 16px;border:var(--border, 1px solid #d8dbdf);border-radius:var(--borderRadius, 3px);height:var(--height, 42px);position:relative;display:flex;align-items:center;padding:var(--padding);background:var(--background, #fff)}.selectContainer.svelte-2eeumy input.svelte-2eeumy{cursor:default;border:none;color:var(--inputColor, #3f4f5f);height:var(--height, 42px);line-height:var(--height, 42px);padding:var(--inputPadding, var(--padding));width:100%;background:transparent;font-size:var(--inputFontSize, 14px);letter-spacing:var(--inputLetterSpacing, -0.08px);position:absolute;left:var(--inputLeft, 0)}.selectContainer.svelte-2eeumy input.svelte-2eeumy::placeholder{color:var(--placeholderColor, #78848f)}.selectContainer.svelte-2eeumy input.svelte-2eeumy:focus{outline:none}.selectContainer.svelte-2eeumy.svelte-2eeumy:hover{border-color:var(--borderHoverColor, #b2b8bf)}.selectContainer.focused.svelte-2eeumy.svelte-2eeumy{border-color:var(--borderFocusColor, #006fe8)}.selectContainer.disabled.svelte-2eeumy.svelte-2eeumy{background:var(--disabledBackground, #ebedef);border-color:var(--disabledBorderColor, #ebedef);color:var(--disabledColor, #c1c6cc)}.selectContainer.disabled.svelte-2eeumy input.svelte-2eeumy::placeholder{color:var(--disabledPlaceholderColor, #c1c6cc)}.selectedItem.svelte-2eeumy.svelte-2eeumy{line-height:var(--height, 42px);height:var(--height, 42px);overflow-x:hidden;padding:var(--selectedItemPadding, 0 20px 0 0)}.selectedItem.svelte-2eeumy.svelte-2eeumy:focus{outline:none}.clearSelect.svelte-2eeumy.svelte-2eeumy{position:absolute;right:var(--clearSelectRight, 10px);top:var(--clearSelectTop, 11px);bottom:var(--clearSelectBottom, 11px);width:var(--clearSelectWidth, 20px);color:var(--clearSelectColor, #c5cacf);flex:none !important}.clearSelect.svelte-2eeumy.svelte-2eeumy:hover{color:var(--clearSelectHoverColor, #2c3e50)}.selectContainer.focused.svelte-2eeumy .clearSelect.svelte-2eeumy{color:var(--clearSelectFocusColor, #3f4f5f)}.indicator.svelte-2eeumy.svelte-2eeumy{position:absolute;right:var(--indicatorRight, 10px);top:var(--indicatorTop, 11px);width:var(--indicatorWidth, 20px);height:var(--indicatorHeight, 20px);color:var(--indicatorColor, #c5cacf)}.indicator.svelte-2eeumy svg.svelte-2eeumy{display:inline-block;fill:var(--indicatorFill, currentcolor);line-height:1;stroke:var(--indicatorStroke, currentcolor);stroke-width:0}.spinner.svelte-2eeumy.svelte-2eeumy{position:absolute;right:var(--spinnerRight, 10px);top:var(--spinnerLeft, 11px);width:var(--spinnerWidth, 20px);height:var(--spinnerHeight, 20px);color:var(--spinnerColor, #51ce6c);animation:svelte-2eeumy-rotate 0.75s linear infinite}.spinner_icon.svelte-2eeumy.svelte-2eeumy{display:block;height:100%;transform-origin:center center;width:100%;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;-webkit-transform:none}.spinner_path.svelte-2eeumy.svelte-2eeumy{stroke-dasharray:90;stroke-linecap:round}.multiSelect.svelte-2eeumy.svelte-2eeumy{display:flex;padding:var(--multiSelectPadding, 0 35px 0 16px);height:auto;flex-wrap:wrap}.multiSelect.svelte-2eeumy>.svelte-2eeumy{flex:1 1 50px}.selectContainer.multiSelect.svelte-2eeumy input.svelte-2eeumy{padding:var(--multiSelectInputPadding, 0);position:relative;margin:var(--multiSelectInputMargin, 0)}.hasError.svelte-2eeumy.svelte-2eeumy{border:var(--errorBorder, 1px solid #ff2d55)}@keyframes svelte-2eeumy-rotate{100%{transform:rotate(360deg)}}";
	  append(document_1.head, style);
	} // (789:2) {#if Icon}


	function create_if_block_6(ctx) {
	  let switch_instance_anchor;
	  let current;
	  var switch_value =
	  /*Icon*/
	  ctx[16];

	  function switch_props(ctx) {
	    return {};
	  }

	  if (switch_value) {
	    var switch_instance = new switch_value(switch_props());
	  }

	  return {
	    c() {
	      if (switch_instance) create_component(switch_instance.$$.fragment);
	      switch_instance_anchor = empty();
	    },

	    m(target, anchor) {
	      if (switch_instance) {
	        mount_component(switch_instance, target, anchor);
	      }

	      insert(target, switch_instance_anchor, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      if (switch_value !== (switch_value =
	      /*Icon*/
	      ctx[16])) {
	        if (switch_instance) {
	          group_outros();
	          const old_component = switch_instance;
	          transition_out(old_component.$$.fragment, 1, 0, () => {
	            destroy_component(old_component, 1);
	          });
	          check_outros();
	        }

	        if (switch_value) {
	          switch_instance = new switch_value(switch_props());
	          create_component(switch_instance.$$.fragment);
	          transition_in(switch_instance.$$.fragment, 1);
	          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
	        } else {
	          switch_instance = null;
	        }
	      }
	    },

	    i(local) {
	      if (current) return;
	      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(switch_instance_anchor);
	      if (switch_instance) destroy_component(switch_instance, detaching);
	    }

	  };
	} // (793:2) {#if isMulti && selectedValue && selectedValue.length > 0}


	function create_if_block_5(ctx) {
	  let switch_instance_anchor;
	  let current;
	  var switch_value =
	  /*MultiSelection*/
	  ctx[7];

	  function switch_props(ctx) {
	    return {
	      props: {
	        selectedValue:
	        /*selectedValue*/
	        ctx[3],
	        getSelectionLabel:
	        /*getSelectionLabel*/
	        ctx[12],
	        activeSelectedValue:
	        /*activeSelectedValue*/
	        ctx[20],
	        isDisabled:
	        /*isDisabled*/
	        ctx[9]
	      }
	    };
	  }

	  if (switch_value) {
	    var switch_instance = new switch_value(switch_props(ctx));
	    switch_instance.$on("multiItemClear",
	    /*handleMultiItemClear*/
	    ctx[24]);
	    switch_instance.$on("focus",
	    /*handleFocus*/
	    ctx[27]);
	  }

	  return {
	    c() {
	      if (switch_instance) create_component(switch_instance.$$.fragment);
	      switch_instance_anchor = empty();
	    },

	    m(target, anchor) {
	      if (switch_instance) {
	        mount_component(switch_instance, target, anchor);
	      }

	      insert(target, switch_instance_anchor, anchor);
	      current = true;
	    },

	    p(ctx, dirty) {
	      const switch_instance_changes = {};
	      if (dirty[0] &
	      /*selectedValue*/
	      8) switch_instance_changes.selectedValue =
	      /*selectedValue*/
	      ctx[3];
	      if (dirty[0] &
	      /*getSelectionLabel*/
	      4096) switch_instance_changes.getSelectionLabel =
	      /*getSelectionLabel*/
	      ctx[12];
	      if (dirty[0] &
	      /*activeSelectedValue*/
	      1048576) switch_instance_changes.activeSelectedValue =
	      /*activeSelectedValue*/
	      ctx[20];
	      if (dirty[0] &
	      /*isDisabled*/
	      512) switch_instance_changes.isDisabled =
	      /*isDisabled*/
	      ctx[9];

	      if (switch_value !== (switch_value =
	      /*MultiSelection*/
	      ctx[7])) {
	        if (switch_instance) {
	          group_outros();
	          const old_component = switch_instance;
	          transition_out(old_component.$$.fragment, 1, 0, () => {
	            destroy_component(old_component, 1);
	          });
	          check_outros();
	        }

	        if (switch_value) {
	          switch_instance = new switch_value(switch_props(ctx));
	          switch_instance.$on("multiItemClear",
	          /*handleMultiItemClear*/
	          ctx[24]);
	          switch_instance.$on("focus",
	          /*handleFocus*/
	          ctx[27]);
	          create_component(switch_instance.$$.fragment);
	          transition_in(switch_instance.$$.fragment, 1);
	          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
	        } else {
	          switch_instance = null;
	        }
	      } else if (switch_value) {
	        switch_instance.$set(switch_instance_changes);
	      }
	    },

	    i(local) {
	      if (current) return;
	      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(switch_instance_anchor);
	      if (switch_instance) destroy_component(switch_instance, detaching);
	    }

	  };
	} // (813:2) {:else}


	function create_else_block$2(ctx) {
	  let input_1;
	  let mounted;
	  let dispose;
	  let input_1_levels = [
	  /*_inputAttributes*/
	  ctx[21], {
	    placeholder:
	    /*placeholderText*/
	    ctx[23]
	  }, {
	    style:
	    /*inputStyles*/
	    ctx[14]
	  }];
	  let input_1_data = {};

	  for (let i = 0; i < input_1_levels.length; i += 1) {
	    input_1_data = assign(input_1_data, input_1_levels[i]);
	  }

	  return {
	    c() {
	      input_1 = element("input");
	      set_attributes(input_1, input_1_data);
	      toggle_class(input_1, "svelte-2eeumy", true);
	    },

	    m(target, anchor) {
	      insert(target, input_1, anchor);
	      /*input_1_binding_1*/

	      ctx[74](input_1);
	      set_input_value(input_1,
	      /*filterText*/
	      ctx[4]);

	      if (!mounted) {
	        dispose = [listen(input_1, "focus",
	        /*handleFocus*/
	        ctx[27]), listen(input_1, "input",
	        /*input_1_input_handler_1*/
	        ctx[75])];
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [dirty[0] &
	      /*_inputAttributes*/
	      2097152 &&
	      /*_inputAttributes*/
	      ctx[21], dirty[0] &
	      /*placeholderText*/
	      8388608 && {
	        placeholder:
	        /*placeholderText*/
	        ctx[23]
	      }, dirty[0] &
	      /*inputStyles*/
	      16384 && {
	        style:
	        /*inputStyles*/
	        ctx[14]
	      }]));

	      if (dirty[0] &
	      /*filterText*/
	      16 && input_1.value !==
	      /*filterText*/
	      ctx[4]) {
	        set_input_value(input_1,
	        /*filterText*/
	        ctx[4]);
	      }

	      toggle_class(input_1, "svelte-2eeumy", true);
	    },

	    d(detaching) {
	      if (detaching) detach(input_1);
	      /*input_1_binding_1*/

	      ctx[74](null);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	} // (804:2) {#if isDisabled}


	function create_if_block_4(ctx) {
	  let input_1;
	  let mounted;
	  let dispose;
	  let input_1_levels = [
	  /*_inputAttributes*/
	  ctx[21], {
	    placeholder:
	    /*placeholderText*/
	    ctx[23]
	  }, {
	    style:
	    /*inputStyles*/
	    ctx[14]
	  }, {
	    disabled: true
	  }];
	  let input_1_data = {};

	  for (let i = 0; i < input_1_levels.length; i += 1) {
	    input_1_data = assign(input_1_data, input_1_levels[i]);
	  }

	  return {
	    c() {
	      input_1 = element("input");
	      set_attributes(input_1, input_1_data);
	      toggle_class(input_1, "svelte-2eeumy", true);
	    },

	    m(target, anchor) {
	      insert(target, input_1, anchor);
	      /*input_1_binding*/

	      ctx[72](input_1);
	      set_input_value(input_1,
	      /*filterText*/
	      ctx[4]);

	      if (!mounted) {
	        dispose = [listen(input_1, "focus",
	        /*handleFocus*/
	        ctx[27]), listen(input_1, "input",
	        /*input_1_input_handler*/
	        ctx[73])];
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [dirty[0] &
	      /*_inputAttributes*/
	      2097152 &&
	      /*_inputAttributes*/
	      ctx[21], dirty[0] &
	      /*placeholderText*/
	      8388608 && {
	        placeholder:
	        /*placeholderText*/
	        ctx[23]
	      }, dirty[0] &
	      /*inputStyles*/
	      16384 && {
	        style:
	        /*inputStyles*/
	        ctx[14]
	      }, {
	        disabled: true
	      }]));

	      if (dirty[0] &
	      /*filterText*/
	      16 && input_1.value !==
	      /*filterText*/
	      ctx[4]) {
	        set_input_value(input_1,
	        /*filterText*/
	        ctx[4]);
	      }

	      toggle_class(input_1, "svelte-2eeumy", true);
	    },

	    d(detaching) {
	      if (detaching) detach(input_1);
	      /*input_1_binding*/

	      ctx[72](null);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	} // (823:2) {#if !isMulti && showSelectedItem}


	function create_if_block_3$2(ctx) {
	  let div;
	  let current;
	  let mounted;
	  let dispose;
	  var switch_value =
	  /*Selection*/
	  ctx[6];

	  function switch_props(ctx) {
	    return {
	      props: {
	        item:
	        /*selectedValue*/
	        ctx[3],
	        getSelectionLabel:
	        /*getSelectionLabel*/
	        ctx[12]
	      }
	    };
	  }

	  if (switch_value) {
	    var switch_instance = new switch_value(switch_props(ctx));
	  }

	  return {
	    c() {
	      div = element("div");
	      if (switch_instance) create_component(switch_instance.$$.fragment);
	      attr(div, "class", "selectedItem svelte-2eeumy");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);

	      if (switch_instance) {
	        mount_component(switch_instance, div, null);
	      }

	      current = true;

	      if (!mounted) {
	        dispose = listen(div, "focus",
	        /*handleFocus*/
	        ctx[27]);
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      const switch_instance_changes = {};
	      if (dirty[0] &
	      /*selectedValue*/
	      8) switch_instance_changes.item =
	      /*selectedValue*/
	      ctx[3];
	      if (dirty[0] &
	      /*getSelectionLabel*/
	      4096) switch_instance_changes.getSelectionLabel =
	      /*getSelectionLabel*/
	      ctx[12];

	      if (switch_value !== (switch_value =
	      /*Selection*/
	      ctx[6])) {
	        if (switch_instance) {
	          group_outros();
	          const old_component = switch_instance;
	          transition_out(old_component.$$.fragment, 1, 0, () => {
	            destroy_component(old_component, 1);
	          });
	          check_outros();
	        }

	        if (switch_value) {
	          switch_instance = new switch_value(switch_props(ctx));
	          create_component(switch_instance.$$.fragment);
	          transition_in(switch_instance.$$.fragment, 1);
	          mount_component(switch_instance, div, null);
	        } else {
	          switch_instance = null;
	        }
	      } else if (switch_value) {
	        switch_instance.$set(switch_instance_changes);
	      }
	    },

	    i(local) {
	      if (current) return;
	      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      if (switch_instance) destroy_component(switch_instance);
	      mounted = false;
	      dispose();
	    }

	  };
	} // (832:2) {#if showSelectedItem && isClearable && !isDisabled && !isWaiting}


	function create_if_block_2$2(ctx) {
	  let div;
	  let mounted;
	  let dispose;
	  return {
	    c() {
	      div = element("div");
	      div.innerHTML = `<svg width="100%" height="100%" viewBox="-2 -2 50 50" focusable="false" role="presentation" class="svelte-2eeumy"><path fill="currentColor" d="M34.923,37.251L24,26.328L13.077,37.251L9.436,33.61l10.923-10.923L9.436,11.765l3.641-3.641L24,19.047L34.923,8.124
          l3.641,3.641L27.641,22.688L38.564,33.61L34.923,37.251z"></path></svg>`;
	      attr(div, "class", "clearSelect svelte-2eeumy");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);

	      if (!mounted) {
	        dispose = listen(div, "click", prevent_default(
	        /*handleClear*/
	        ctx[19]));
	        mounted = true;
	      }
	    },

	    p: noop,

	    d(detaching) {
	      if (detaching) detach(div);
	      mounted = false;
	      dispose();
	    }

	  };
	} // (848:2) {#if showChevron && !selectedValue || (!isSearchable && !isDisabled && !isWaiting && ((showSelectedItem && !isClearable) || !showSelectedItem))}


	function create_if_block_1$3(ctx) {
	  let div;
	  return {
	    c() {
	      div = element("div");
	      div.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 20 20" focusable="false" class="css-19bqh2r svelte-2eeumy"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
          3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0
          1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
          0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
          0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg>`;
	      attr(div, "class", "indicator svelte-2eeumy");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	    }

	  };
	} // (866:2) {#if isWaiting}


	function create_if_block$d(ctx) {
	  let div;
	  return {
	    c() {
	      div = element("div");
	      div.innerHTML = `<svg class="spinner_icon svelte-2eeumy" viewBox="25 25 50 50"><circle class="spinner_path svelte-2eeumy" cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="5" stroke-miterlimit="10"></circle></svg>`;
	      attr(div, "class", "spinner svelte-2eeumy");
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	    }

	  };
	}

	function create_fragment$h(ctx) {
	  let div;
	  let t0;
	  let t1;
	  let t2;
	  let t3;
	  let t4;
	  let t5;
	  let div_class_value;
	  let current;
	  let mounted;
	  let dispose;
	  let if_block0 =
	  /*Icon*/
	  ctx[16] && create_if_block_6(ctx);
	  let if_block1 =
	  /*isMulti*/
	  ctx[8] &&
	  /*selectedValue*/
	  ctx[3] &&
	  /*selectedValue*/
	  ctx[3].length > 0 && create_if_block_5(ctx);

	  function select_block_type(ctx, dirty) {
	    if (
	    /*isDisabled*/
	    ctx[9]) return create_if_block_4;
	    return create_else_block$2;
	  }

	  let current_block_type = select_block_type(ctx);
	  let if_block2 = current_block_type(ctx);
	  let if_block3 = !
	  /*isMulti*/
	  ctx[8] &&
	  /*showSelectedItem*/
	  ctx[22] && create_if_block_3$2(ctx);
	  let if_block4 =
	  /*showSelectedItem*/
	  ctx[22] &&
	  /*isClearable*/
	  ctx[15] && !
	  /*isDisabled*/
	  ctx[9] && !
	  /*isWaiting*/
	  ctx[5] && create_if_block_2$2(ctx);
	  let if_block5 = (
	  /*showChevron*/
	  ctx[17] && !
	  /*selectedValue*/
	  ctx[3] || !
	  /*isSearchable*/
	  ctx[13] && !
	  /*isDisabled*/
	  ctx[9] && !
	  /*isWaiting*/
	  ctx[5] && (
	  /*showSelectedItem*/
	  ctx[22] && !
	  /*isClearable*/
	  ctx[15] || !
	  /*showSelectedItem*/
	  ctx[22])) && create_if_block_1$3();
	  let if_block6 =
	  /*isWaiting*/
	  ctx[5] && create_if_block$d();
	  return {
	    c() {
	      div = element("div");
	      if (if_block0) if_block0.c();
	      t0 = space();
	      if (if_block1) if_block1.c();
	      t1 = space();
	      if_block2.c();
	      t2 = space();
	      if (if_block3) if_block3.c();
	      t3 = space();
	      if (if_block4) if_block4.c();
	      t4 = space();
	      if (if_block5) if_block5.c();
	      t5 = space();
	      if (if_block6) if_block6.c();
	      attr(div, "class", div_class_value = "selectContainer " +
	      /*containerClasses*/
	      ctx[18] + " svelte-2eeumy");
	      attr(div, "style",
	      /*containerStyles*/
	      ctx[11]);
	      toggle_class(div, "hasError",
	      /*hasError*/
	      ctx[10]);
	      toggle_class(div, "multiSelect",
	      /*isMulti*/
	      ctx[8]);
	      toggle_class(div, "disabled",
	      /*isDisabled*/
	      ctx[9]);
	      toggle_class(div, "focused",
	      /*isFocused*/
	      ctx[2]);
	    },

	    m(target, anchor) {
	      insert(target, div, anchor);
	      if (if_block0) if_block0.m(div, null);
	      append(div, t0);
	      if (if_block1) if_block1.m(div, null);
	      append(div, t1);
	      if_block2.m(div, null);
	      append(div, t2);
	      if (if_block3) if_block3.m(div, null);
	      append(div, t3);
	      if (if_block4) if_block4.m(div, null);
	      append(div, t4);
	      if (if_block5) if_block5.m(div, null);
	      append(div, t5);
	      if (if_block6) if_block6.m(div, null);
	      /*div_binding*/

	      ctx[76](div);
	      current = true;

	      if (!mounted) {
	        dispose = [listen(window, "click",
	        /*handleWindowClick*/
	        ctx[28]), listen(window, "keydown",
	        /*handleKeyDown*/
	        ctx[26]), listen(window, "resize",
	        /*getPosition*/
	        ctx[25]), listen(div, "click",
	        /*handleClick*/
	        ctx[29])];
	        mounted = true;
	      }
	    },

	    p(ctx, dirty) {
	      if (
	      /*Icon*/
	      ctx[16]) {
	        if (if_block0) {
	          if_block0.p(ctx, dirty);

	          if (dirty[0] &
	          /*Icon*/
	          65536) {
	            transition_in(if_block0, 1);
	          }
	        } else {
	          if_block0 = create_if_block_6(ctx);
	          if_block0.c();
	          transition_in(if_block0, 1);
	          if_block0.m(div, t0);
	        }
	      } else if (if_block0) {
	        group_outros();
	        transition_out(if_block0, 1, 1, () => {
	          if_block0 = null;
	        });
	        check_outros();
	      }

	      if (
	      /*isMulti*/
	      ctx[8] &&
	      /*selectedValue*/
	      ctx[3] &&
	      /*selectedValue*/
	      ctx[3].length > 0) {
	        if (if_block1) {
	          if_block1.p(ctx, dirty);

	          if (dirty[0] &
	          /*isMulti, selectedValue*/
	          264) {
	            transition_in(if_block1, 1);
	          }
	        } else {
	          if_block1 = create_if_block_5(ctx);
	          if_block1.c();
	          transition_in(if_block1, 1);
	          if_block1.m(div, t1);
	        }
	      } else if (if_block1) {
	        group_outros();
	        transition_out(if_block1, 1, 1, () => {
	          if_block1 = null;
	        });
	        check_outros();
	      }

	      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block2) {
	        if_block2.p(ctx, dirty);
	      } else {
	        if_block2.d(1);
	        if_block2 = current_block_type(ctx);

	        if (if_block2) {
	          if_block2.c();
	          if_block2.m(div, t2);
	        }
	      }

	      if (!
	      /*isMulti*/
	      ctx[8] &&
	      /*showSelectedItem*/
	      ctx[22]) {
	        if (if_block3) {
	          if_block3.p(ctx, dirty);

	          if (dirty[0] &
	          /*isMulti, showSelectedItem*/
	          4194560) {
	            transition_in(if_block3, 1);
	          }
	        } else {
	          if_block3 = create_if_block_3$2(ctx);
	          if_block3.c();
	          transition_in(if_block3, 1);
	          if_block3.m(div, t3);
	        }
	      } else if (if_block3) {
	        group_outros();
	        transition_out(if_block3, 1, 1, () => {
	          if_block3 = null;
	        });
	        check_outros();
	      }

	      if (
	      /*showSelectedItem*/
	      ctx[22] &&
	      /*isClearable*/
	      ctx[15] && !
	      /*isDisabled*/
	      ctx[9] && !
	      /*isWaiting*/
	      ctx[5]) {
	        if (if_block4) {
	          if_block4.p(ctx, dirty);
	        } else {
	          if_block4 = create_if_block_2$2(ctx);
	          if_block4.c();
	          if_block4.m(div, t4);
	        }
	      } else if (if_block4) {
	        if_block4.d(1);
	        if_block4 = null;
	      }

	      if (
	      /*showChevron*/
	      ctx[17] && !
	      /*selectedValue*/
	      ctx[3] || !
	      /*isSearchable*/
	      ctx[13] && !
	      /*isDisabled*/
	      ctx[9] && !
	      /*isWaiting*/
	      ctx[5] && (
	      /*showSelectedItem*/
	      ctx[22] && !
	      /*isClearable*/
	      ctx[15] || !
	      /*showSelectedItem*/
	      ctx[22])) {
	        if (if_block5) ; else {
	          if_block5 = create_if_block_1$3();
	          if_block5.c();
	          if_block5.m(div, t5);
	        }
	      } else if (if_block5) {
	        if_block5.d(1);
	        if_block5 = null;
	      }

	      if (
	      /*isWaiting*/
	      ctx[5]) {
	        if (if_block6) ; else {
	          if_block6 = create_if_block$d();
	          if_block6.c();
	          if_block6.m(div, null);
	        }
	      } else if (if_block6) {
	        if_block6.d(1);
	        if_block6 = null;
	      }

	      if (!current || dirty[0] &
	      /*containerClasses*/
	      262144 && div_class_value !== (div_class_value = "selectContainer " +
	      /*containerClasses*/
	      ctx[18] + " svelte-2eeumy")) {
	        attr(div, "class", div_class_value);
	      }

	      if (!current || dirty[0] &
	      /*containerStyles*/
	      2048) {
	        attr(div, "style",
	        /*containerStyles*/
	        ctx[11]);
	      }

	      if (dirty[0] &
	      /*containerClasses, hasError*/
	      263168) {
	        toggle_class(div, "hasError",
	        /*hasError*/
	        ctx[10]);
	      }

	      if (dirty[0] &
	      /*containerClasses, isMulti*/
	      262400) {
	        toggle_class(div, "multiSelect",
	        /*isMulti*/
	        ctx[8]);
	      }

	      if (dirty[0] &
	      /*containerClasses, isDisabled*/
	      262656) {
	        toggle_class(div, "disabled",
	        /*isDisabled*/
	        ctx[9]);
	      }

	      if (dirty[0] &
	      /*containerClasses, isFocused*/
	      262148) {
	        toggle_class(div, "focused",
	        /*isFocused*/
	        ctx[2]);
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(if_block0);
	      transition_in(if_block1);
	      transition_in(if_block3);
	      current = true;
	    },

	    o(local) {
	      transition_out(if_block0);
	      transition_out(if_block1);
	      transition_out(if_block3);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(div);
	      if (if_block0) if_block0.d();
	      if (if_block1) if_block1.d();
	      if_block2.d();
	      if (if_block3) if_block3.d();
	      if (if_block4) if_block4.d();
	      if (if_block5) if_block5.d();
	      if (if_block6) if_block6.d();
	      /*div_binding*/

	      ctx[76](null);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	function instance$h($$self, $$props, $$invalidate) {
	  const dispatch = createEventDispatcher();
	  let {
	    container = undefined
	  } = $$props;
	  let {
	    input = undefined
	  } = $$props;
	  let {
	    Item: Item$1 = Item
	  } = $$props;
	  let {
	    Selection: Selection$1 = Selection
	  } = $$props;
	  let {
	    MultiSelection: MultiSelection$1 = MultiSelection
	  } = $$props;
	  let {
	    isMulti = false
	  } = $$props;
	  let {
	    isDisabled = false
	  } = $$props;
	  let {
	    isCreatable = false
	  } = $$props;
	  let {
	    isFocused = false
	  } = $$props;
	  let {
	    selectedValue = undefined
	  } = $$props;
	  let {
	    filterText = ""
	  } = $$props;
	  let {
	    placeholder = "Select..."
	  } = $$props;
	  let {
	    items = []
	  } = $$props;
	  let {
	    itemFilter = (label, filterText, option) => label.toLowerCase().includes(filterText.toLowerCase())
	  } = $$props;
	  let {
	    groupBy = undefined
	  } = $$props;
	  let {
	    groupFilter = groups => groups
	  } = $$props;
	  let {
	    isGroupHeaderSelectable = false
	  } = $$props;
	  let {
	    getGroupHeaderLabel = option => {
	      return option.label;
	    }
	  } = $$props;
	  let {
	    getOptionLabel = (option, filterText) => {
	      return option.isCreator ? `Create \"${filterText}\"` : option.label;
	    }
	  } = $$props;
	  let {
	    optionIdentifier = "value"
	  } = $$props;
	  let {
	    loadOptions = undefined
	  } = $$props;
	  let {
	    hasError = false
	  } = $$props;
	  let {
	    containerStyles = ""
	  } = $$props;
	  let {
	    getSelectionLabel = option => {
	      if (option) return option.label;
	    }
	  } = $$props;
	  let {
	    createGroupHeaderItem = groupValue => {
	      return {
	        value: groupValue,
	        label: groupValue
	      };
	    }
	  } = $$props;
	  let {
	    createItem = filterText => {
	      return {
	        value: filterText,
	        label: filterText
	      };
	    }
	  } = $$props;
	  let {
	    isSearchable = true
	  } = $$props;
	  let {
	    inputStyles = ""
	  } = $$props;
	  let {
	    isClearable = true
	  } = $$props;
	  let {
	    isWaiting = false
	  } = $$props;
	  let {
	    listPlacement = "auto"
	  } = $$props;
	  let {
	    listOpen = false
	  } = $$props;
	  let {
	    list = undefined
	  } = $$props;
	  let {
	    isVirtualList = false
	  } = $$props;
	  let {
	    loadOptionsInterval = 300
	  } = $$props;
	  let {
	    noOptionsMessage = "No options"
	  } = $$props;
	  let {
	    hideEmptyState = false
	  } = $$props;
	  let {
	    filteredItems = []
	  } = $$props;
	  let {
	    inputAttributes = {}
	  } = $$props;
	  let {
	    listAutoWidth = true
	  } = $$props;
	  let {
	    itemHeight = 40
	  } = $$props;
	  let {
	    Icon = undefined
	  } = $$props;
	  let {
	    showChevron = false
	  } = $$props;
	  let {
	    containerClasses = ""
	  } = $$props;
	  let target;
	  let activeSelectedValue;
	  let _items = [];
	  let originalItemsClone;
	  let prev_selectedValue;
	  let prev_listOpen;
	  let prev_filterText;
	  let prev_isFocused;
	  let prev_filteredItems;

	  async function resetFilter() {
	    await tick();
	    $$invalidate(4, filterText = "");
	  }

	  let getItemsHasInvoked = false;
	  const getItems = debounce(async () => {
	    getItemsHasInvoked = true;
	    $$invalidate(5, isWaiting = true);
	    $$invalidate(30, items = await loadOptions(filterText));
	    $$invalidate(5, isWaiting = false);
	    $$invalidate(2, isFocused = true);
	    $$invalidate(31, listOpen = true);
	  }, loadOptionsInterval);
	  let _inputAttributes = {};
	  beforeUpdate(() => {
	    if (isMulti && selectedValue && selectedValue.length > 1) {
	      checkSelectedValueForDuplicates();
	    }

	    if (!isMulti && selectedValue && prev_selectedValue !== selectedValue) {
	      if (!prev_selectedValue || JSON.stringify(selectedValue[optionIdentifier]) !== JSON.stringify(prev_selectedValue[optionIdentifier])) {
	        dispatch("select", selectedValue);
	      }
	    }

	    if (isMulti && JSON.stringify(selectedValue) !== JSON.stringify(prev_selectedValue)) {
	      if (checkSelectedValueForDuplicates()) {
	        dispatch("select", selectedValue);
	      }
	    }

	    if (container && listOpen !== prev_listOpen) {
	      if (listOpen) {
	        loadList();
	      } else {
	        removeList();
	      }
	    }

	    if (filterText !== prev_filterText) {
	      if (filterText.length > 0) {
	        $$invalidate(2, isFocused = true);
	        $$invalidate(31, listOpen = true);

	        if (loadOptions) {
	          getItems();
	        } else {
	          loadList();
	          $$invalidate(31, listOpen = true);

	          if (isMulti) {
	            $$invalidate(20, activeSelectedValue = undefined);
	          }
	        }
	      } else {
	        setList([]);
	      }

	      if (list) {
	        list.$set({
	          filterText
	        });
	      }
	    }

	    if (isFocused !== prev_isFocused) {
	      if (isFocused || listOpen) {
	        handleFocus();
	      } else {
	        resetFilter();
	        if (input) input.blur();
	      }
	    }

	    if (prev_filteredItems !== filteredItems) {
	      let _filteredItems = [...filteredItems];

	      if (isCreatable && filterText) {
	        const itemToCreate = createItem(filterText);
	        itemToCreate.isCreator = true;

	        const existingItemWithFilterValue = _filteredItems.find(item => {
	          return item[optionIdentifier] === itemToCreate[optionIdentifier];
	        });

	        let existingSelectionWithFilterValue;

	        if (selectedValue) {
	          if (isMulti) {
	            existingSelectionWithFilterValue = selectedValue.find(selection => {
	              return selection[optionIdentifier] === itemToCreate[optionIdentifier];
	            });
	          } else if (selectedValue[optionIdentifier] === itemToCreate[optionIdentifier]) {
	            existingSelectionWithFilterValue = selectedValue;
	          }
	        }

	        if (!existingItemWithFilterValue && !existingSelectionWithFilterValue) {
	          _filteredItems = [..._filteredItems, itemToCreate];
	        }
	      }

	      setList(_filteredItems);
	    }

	    prev_selectedValue = selectedValue;
	    prev_listOpen = listOpen;
	    prev_filterText = filterText;
	    prev_isFocused = isFocused;
	    prev_filteredItems = filteredItems;
	  });

	  function checkSelectedValueForDuplicates() {
	    let noDuplicates = true;

	    if (selectedValue) {
	      const ids = [];
	      const uniqueValues = [];
	      selectedValue.forEach(val => {
	        if (!ids.includes(val[optionIdentifier])) {
	          ids.push(val[optionIdentifier]);
	          uniqueValues.push(val);
	        } else {
	          noDuplicates = false;
	        }
	      });
	      $$invalidate(3, selectedValue = uniqueValues);
	    }

	    return noDuplicates;
	  }

	  async function setList(items) {
	    await tick();
	    if (list) return list.$set({
	      items
	    });
	    if (loadOptions && getItemsHasInvoked && items.length > 0) loadList();
	  }

	  function handleMultiItemClear(event) {
	    const {
	      detail
	    } = event;
	    const itemToRemove = selectedValue[detail ? detail.i : selectedValue.length - 1];

	    if (selectedValue.length === 1) {
	      $$invalidate(3, selectedValue = undefined);
	    } else {
	      $$invalidate(3, selectedValue = selectedValue.filter(item => {
	        return item !== itemToRemove;
	      }));
	    }

	    dispatch("clear", itemToRemove);
	    getPosition();
	  }

	  async function getPosition() {
	    await tick();
	    if (!target || !container) return;
	    const {
	      top,
	      height,
	      width
	    } = container.getBoundingClientRect();
	    target.style["min-width"] = `${width}px`;
	    target.style.width = `${listAutoWidth ? "auto" : "100%"}`;
	    target.style.left = "0";

	    if (listPlacement === "top") {
	      target.style.bottom = `${height + 5}px`;
	    } else {
	      target.style.top = `${height + 5}px`;
	    }

	    target = target;

	    if (listPlacement === "auto" && isOutOfViewport(target).bottom) {
	      target.style.top = ``;
	      target.style.bottom = `${height + 5}px`;
	    }

	    target.style.visibility = "";
	  }

	  function handleKeyDown(e) {
	    if (!isFocused) return;

	    switch (e.key) {
	      case "ArrowDown":
	        e.preventDefault();
	        $$invalidate(31, listOpen = true);
	        $$invalidate(20, activeSelectedValue = undefined);
	        break;

	      case "ArrowUp":
	        e.preventDefault();
	        $$invalidate(31, listOpen = true);
	        $$invalidate(20, activeSelectedValue = undefined);
	        break;

	      case "Tab":
	        if (!listOpen) $$invalidate(2, isFocused = false);
	        break;

	      case "Backspace":
	        if (!isMulti || filterText.length > 0) return;

	        if (isMulti && selectedValue && selectedValue.length > 0) {
	          handleMultiItemClear(activeSelectedValue !== undefined ? activeSelectedValue : selectedValue.length - 1);
	          if (activeSelectedValue === 0 || activeSelectedValue === undefined) break;
	          $$invalidate(20, activeSelectedValue = selectedValue.length > activeSelectedValue ? activeSelectedValue - 1 : undefined);
	        }

	        break;

	      case "ArrowLeft":
	        if (list) list.$set({
	          hoverItemIndex: -1
	        });
	        if (!isMulti || filterText.length > 0) return;

	        if (activeSelectedValue === undefined) {
	          $$invalidate(20, activeSelectedValue = selectedValue.length - 1);
	        } else if (selectedValue.length > activeSelectedValue && activeSelectedValue !== 0) {
	          $$invalidate(20, activeSelectedValue -= 1);
	        }

	        break;

	      case "ArrowRight":
	        if (list) list.$set({
	          hoverItemIndex: -1
	        });
	        if (!isMulti || filterText.length > 0 || activeSelectedValue === undefined) return;

	        if (activeSelectedValue === selectedValue.length - 1) {
	          $$invalidate(20, activeSelectedValue = undefined);
	        } else if (activeSelectedValue < selectedValue.length - 1) {
	          $$invalidate(20, activeSelectedValue += 1);
	        }

	        break;
	    }
	  }

	  function handleFocus() {
	    $$invalidate(2, isFocused = true);
	    if (input) input.focus();
	  }

	  function removeList() {
	    resetFilter();
	    $$invalidate(20, activeSelectedValue = undefined);
	    if (!list) return;
	    list.$destroy();
	    $$invalidate(32, list = undefined);
	    if (!target) return;
	    if (target.parentNode) target.parentNode.removeChild(target);
	    target = undefined;
	    $$invalidate(32, list);
	    target = target;
	  }

	  function handleWindowClick(event) {
	    if (!container) return;
	    const eventTarget = event.path && event.path.length > 0 ? event.path[0] : event.target;
	    if (container.contains(eventTarget)) return;
	    $$invalidate(2, isFocused = false);
	    $$invalidate(31, listOpen = false);
	    $$invalidate(20, activeSelectedValue = undefined);
	    if (input) input.blur();
	  }

	  function handleClick() {
	    if (isDisabled) return;
	    $$invalidate(2, isFocused = true);
	    $$invalidate(31, listOpen = !listOpen);
	  }

	  function handleClear() {
	    $$invalidate(3, selectedValue = undefined);
	    $$invalidate(31, listOpen = false);
	    dispatch("clear", selectedValue);
	    handleFocus();
	  }

	  async function loadList() {
	    await tick();
	    if (target && list) return;
	    const data = {
	      Item: Item$1,
	      filterText,
	      optionIdentifier,
	      noOptionsMessage,
	      hideEmptyState,
	      isVirtualList,
	      selectedValue,
	      isMulti,
	      getGroupHeaderLabel,
	      items: filteredItems,
	      itemHeight
	    };

	    if (getOptionLabel) {
	      data.getOptionLabel = getOptionLabel;
	    }

	    target = document.createElement("div");
	    Object.assign(target.style, {
	      position: "absolute",
	      "z-index": 2,
	      visibility: "hidden"
	    });
	    $$invalidate(32, list);
	    target = target;
	    if (container) container.appendChild(target);
	    $$invalidate(32, list = new List({
	      target,
	      props: data
	    }));
	    list.$on("itemSelected", event => {
	      const {
	        detail
	      } = event;

	      if (detail) {
	        const item = Object.assign({}, detail);

	        if (!item.isGroupHeader || item.isSelectable) {
	          if (isMulti) {
	            $$invalidate(3, selectedValue = selectedValue ? selectedValue.concat([item]) : [item]);
	          } else {
	            $$invalidate(3, selectedValue = item);
	          }

	          resetFilter();
	          $$invalidate(3, selectedValue), $$invalidate(43, optionIdentifier);
	          setTimeout(() => {
	            $$invalidate(31, listOpen = false);
	            $$invalidate(20, activeSelectedValue = undefined);
	          });
	        }
	      }
	    });
	    list.$on("itemCreated", event => {
	      const {
	        detail
	      } = event;

	      if (isMulti) {
	        $$invalidate(3, selectedValue = selectedValue || []);
	        $$invalidate(3, selectedValue = [...selectedValue, createItem(detail)]);
	      } else {
	        $$invalidate(3, selectedValue = createItem(detail));
	      }

	      $$invalidate(4, filterText = "");
	      $$invalidate(31, listOpen = false);
	      $$invalidate(20, activeSelectedValue = undefined);
	      resetFilter();
	    });
	    list.$on("closeList", () => {
	      $$invalidate(31, listOpen = false);
	    });
	    $$invalidate(32, list), target = target;
	    getPosition();
	  }

	  onMount(() => {
	    if (isFocused) input.focus();
	    if (listOpen) loadList();

	    if (items && items.length > 0) {
	      $$invalidate(56, originalItemsClone = JSON.stringify(items));
	    }

	    if (selectedValue) {
	      if (isMulti) {
	        $$invalidate(3, selectedValue = selectedValue.map(item => {
	          if (typeof item === "string") {
	            return {
	              value: item,
	              label: item
	            };
	          } else {
	            return item;
	          }
	        }));
	      }
	    }
	  });
	  onDestroy(() => {
	    removeList();
	  });

	  function input_1_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(1, input = $$value);
	    });
	  }

	  function input_1_input_handler() {
	    filterText = this.value;
	    $$invalidate(4, filterText);
	  }

	  function input_1_binding_1($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(1, input = $$value);
	    });
	  }

	  function input_1_input_handler_1() {
	    filterText = this.value;
	    $$invalidate(4, filterText);
	  }

	  function div_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](() => {
	      $$invalidate(0, container = $$value);
	    });
	  }

	  $$self.$set = $$props => {
	    if ("container" in $$props) $$invalidate(0, container = $$props.container);
	    if ("input" in $$props) $$invalidate(1, input = $$props.input);
	    if ("Item" in $$props) $$invalidate(34, Item$1 = $$props.Item);
	    if ("Selection" in $$props) $$invalidate(6, Selection$1 = $$props.Selection);
	    if ("MultiSelection" in $$props) $$invalidate(7, MultiSelection$1 = $$props.MultiSelection);
	    if ("isMulti" in $$props) $$invalidate(8, isMulti = $$props.isMulti);
	    if ("isDisabled" in $$props) $$invalidate(9, isDisabled = $$props.isDisabled);
	    if ("isCreatable" in $$props) $$invalidate(35, isCreatable = $$props.isCreatable);
	    if ("isFocused" in $$props) $$invalidate(2, isFocused = $$props.isFocused);
	    if ("selectedValue" in $$props) $$invalidate(3, selectedValue = $$props.selectedValue);
	    if ("filterText" in $$props) $$invalidate(4, filterText = $$props.filterText);
	    if ("placeholder" in $$props) $$invalidate(36, placeholder = $$props.placeholder);
	    if ("items" in $$props) $$invalidate(30, items = $$props.items);
	    if ("itemFilter" in $$props) $$invalidate(37, itemFilter = $$props.itemFilter);
	    if ("groupBy" in $$props) $$invalidate(38, groupBy = $$props.groupBy);
	    if ("groupFilter" in $$props) $$invalidate(39, groupFilter = $$props.groupFilter);
	    if ("isGroupHeaderSelectable" in $$props) $$invalidate(40, isGroupHeaderSelectable = $$props.isGroupHeaderSelectable);
	    if ("getGroupHeaderLabel" in $$props) $$invalidate(41, getGroupHeaderLabel = $$props.getGroupHeaderLabel);
	    if ("getOptionLabel" in $$props) $$invalidate(42, getOptionLabel = $$props.getOptionLabel);
	    if ("optionIdentifier" in $$props) $$invalidate(43, optionIdentifier = $$props.optionIdentifier);
	    if ("loadOptions" in $$props) $$invalidate(44, loadOptions = $$props.loadOptions);
	    if ("hasError" in $$props) $$invalidate(10, hasError = $$props.hasError);
	    if ("containerStyles" in $$props) $$invalidate(11, containerStyles = $$props.containerStyles);
	    if ("getSelectionLabel" in $$props) $$invalidate(12, getSelectionLabel = $$props.getSelectionLabel);
	    if ("createGroupHeaderItem" in $$props) $$invalidate(45, createGroupHeaderItem = $$props.createGroupHeaderItem);
	    if ("createItem" in $$props) $$invalidate(46, createItem = $$props.createItem);
	    if ("isSearchable" in $$props) $$invalidate(13, isSearchable = $$props.isSearchable);
	    if ("inputStyles" in $$props) $$invalidate(14, inputStyles = $$props.inputStyles);
	    if ("isClearable" in $$props) $$invalidate(15, isClearable = $$props.isClearable);
	    if ("isWaiting" in $$props) $$invalidate(5, isWaiting = $$props.isWaiting);
	    if ("listPlacement" in $$props) $$invalidate(47, listPlacement = $$props.listPlacement);
	    if ("listOpen" in $$props) $$invalidate(31, listOpen = $$props.listOpen);
	    if ("list" in $$props) $$invalidate(32, list = $$props.list);
	    if ("isVirtualList" in $$props) $$invalidate(48, isVirtualList = $$props.isVirtualList);
	    if ("loadOptionsInterval" in $$props) $$invalidate(49, loadOptionsInterval = $$props.loadOptionsInterval);
	    if ("noOptionsMessage" in $$props) $$invalidate(50, noOptionsMessage = $$props.noOptionsMessage);
	    if ("hideEmptyState" in $$props) $$invalidate(51, hideEmptyState = $$props.hideEmptyState);
	    if ("filteredItems" in $$props) $$invalidate(33, filteredItems = $$props.filteredItems);
	    if ("inputAttributes" in $$props) $$invalidate(52, inputAttributes = $$props.inputAttributes);
	    if ("listAutoWidth" in $$props) $$invalidate(53, listAutoWidth = $$props.listAutoWidth);
	    if ("itemHeight" in $$props) $$invalidate(54, itemHeight = $$props.itemHeight);
	    if ("Icon" in $$props) $$invalidate(16, Icon = $$props.Icon);
	    if ("showChevron" in $$props) $$invalidate(17, showChevron = $$props.showChevron);
	    if ("containerClasses" in $$props) $$invalidate(18, containerClasses = $$props.containerClasses);
	  };

	  let disabled;
	  let showSelectedItem;
	  let placeholderText;

	  $$self.$$.update = () => {
	    if ($$self.$$.dirty[0] &
	    /*isDisabled*/
	    512) {
	       disabled = isDisabled;
	    }

	    if ($$self.$$.dirty[0] &
	    /*selectedValue*/
	    8 | $$self.$$.dirty[1] &
	    /*optionIdentifier*/
	    4096) {
	       {
	        if (typeof selectedValue === "string") {
	          $$invalidate(3, selectedValue = {
	            [optionIdentifier]: selectedValue,
	            label: selectedValue
	          });
	        }
	      }
	    }

	    if ($$self.$$.dirty[0] &
	    /*selectedValue, filterText*/
	    24) {
	       $$invalidate(22, showSelectedItem = selectedValue && filterText.length === 0);
	    }

	    if ($$self.$$.dirty[0] &
	    /*selectedValue*/
	    8 | $$self.$$.dirty[1] &
	    /*placeholder*/
	    32) {
	       $$invalidate(23, placeholderText = selectedValue ? "" : placeholder);
	    }

	    if ($$self.$$.dirty[0] &
	    /*isSearchable*/
	    8192 | $$self.$$.dirty[1] &
	    /*inputAttributes*/
	    2097152) {
	       {
	        $$invalidate(21, _inputAttributes = Object.assign(inputAttributes, {
	          autocomplete: "off",
	          autocorrect: "off",
	          spellcheck: false
	        }));

	        if (!isSearchable) {
	          $$invalidate(21, _inputAttributes.readonly = true, _inputAttributes);
	        }
	      }
	    }

	    if ($$self.$$.dirty[0] &
	    /*items, filterText, isMulti, selectedValue*/
	    1073742104 | $$self.$$.dirty[1] &
	    /*loadOptions, originalItemsClone, optionIdentifier, itemFilter, getOptionLabel, groupBy, createGroupHeaderItem, isGroupHeaderSelectable, groupFilter*/
	    33586112) {
	       {
	        let _filteredItems;

	        let _items = items;

	        if (items && items.length > 0 && typeof items[0] !== "object") {
	          _items = items.map((item, index) => {
	            return {
	              index,
	              value: item,
	              label: item
	            };
	          });
	        }

	        if (loadOptions && filterText.length === 0 && originalItemsClone) {
	          _filteredItems = JSON.parse(originalItemsClone);
	          _items = JSON.parse(originalItemsClone);
	        } else {
	          _filteredItems = loadOptions ? filterText.length === 0 ? [] : _items : _items.filter(item => {
	            let keepItem = true;

	            if (isMulti && selectedValue) {
	              keepItem = !selectedValue.find(value => {
	                return value[optionIdentifier] === item[optionIdentifier];
	              });
	            }

	            if (!keepItem) return false;
	            if (filterText.length < 1) return true;
	            return itemFilter(getOptionLabel(item, filterText), filterText, item);
	          });
	        }

	        if (groupBy) {
	          const groupValues = [];
	          const groups = {};

	          _filteredItems.forEach(item => {
	            const groupValue = groupBy(item);

	            if (!groupValues.includes(groupValue)) {
	              groupValues.push(groupValue);
	              groups[groupValue] = [];

	              if (groupValue) {
	                groups[groupValue].push(Object.assign(createGroupHeaderItem(groupValue, item), {
	                  id: groupValue,
	                  isGroupHeader: true,
	                  isSelectable: isGroupHeaderSelectable
	                }));
	              }
	            }

	            groups[groupValue].push(Object.assign({
	              isGroupItem: !!groupValue
	            }, item));
	          });

	          const sortedGroupedItems = [];
	          groupFilter(groupValues).forEach(groupValue => {
	            sortedGroupedItems.push(...groups[groupValue]);
	          });
	          $$invalidate(33, filteredItems = sortedGroupedItems);
	        } else {
	          $$invalidate(33, filteredItems = _filteredItems);
	        }
	      }
	    }
	  };

	  return [container, input, isFocused, selectedValue, filterText, isWaiting, Selection$1, MultiSelection$1, isMulti, isDisabled, hasError, containerStyles, getSelectionLabel, isSearchable, inputStyles, isClearable, Icon, showChevron, containerClasses, handleClear, activeSelectedValue, _inputAttributes, showSelectedItem, placeholderText, handleMultiItemClear, getPosition, handleKeyDown, handleFocus, handleWindowClick, handleClick, items, listOpen, list, filteredItems, Item$1, isCreatable, placeholder, itemFilter, groupBy, groupFilter, isGroupHeaderSelectable, getGroupHeaderLabel, getOptionLabel, optionIdentifier, loadOptions, createGroupHeaderItem, createItem, listPlacement, isVirtualList, loadOptionsInterval, noOptionsMessage, hideEmptyState, inputAttributes, listAutoWidth, itemHeight, target, originalItemsClone, prev_selectedValue, prev_listOpen, prev_filterText, prev_isFocused, prev_filteredItems, getItemsHasInvoked, disabled, dispatch, _items, resetFilter, getItems, checkSelectedValueForDuplicates, setList, removeList, loadList, input_1_binding, input_1_input_handler, input_1_binding_1, input_1_input_handler_1, div_binding];
	}

	class Select extends SvelteComponent {
	  constructor(options) {
	    super();
	    if (!document_1.getElementById("svelte-2eeumy-style")) add_css$5();
	    init(this, options, instance$h, create_fragment$h, safe_not_equal, {
	      container: 0,
	      input: 1,
	      Item: 34,
	      Selection: 6,
	      MultiSelection: 7,
	      isMulti: 8,
	      isDisabled: 9,
	      isCreatable: 35,
	      isFocused: 2,
	      selectedValue: 3,
	      filterText: 4,
	      placeholder: 36,
	      items: 30,
	      itemFilter: 37,
	      groupBy: 38,
	      groupFilter: 39,
	      isGroupHeaderSelectable: 40,
	      getGroupHeaderLabel: 41,
	      getOptionLabel: 42,
	      optionIdentifier: 43,
	      loadOptions: 44,
	      hasError: 10,
	      containerStyles: 11,
	      getSelectionLabel: 12,
	      createGroupHeaderItem: 45,
	      createItem: 46,
	      isSearchable: 13,
	      inputStyles: 14,
	      isClearable: 15,
	      isWaiting: 5,
	      listPlacement: 47,
	      listOpen: 31,
	      list: 32,
	      isVirtualList: 48,
	      loadOptionsInterval: 49,
	      noOptionsMessage: 50,
	      hideEmptyState: 51,
	      filteredItems: 33,
	      inputAttributes: 52,
	      listAutoWidth: 53,
	      itemHeight: 54,
	      Icon: 16,
	      showChevron: 17,
	      containerClasses: 18,
	      handleClear: 19
	    }, [-1, -1, -1]);
	  }

	  get handleClear() {
	    return this.$$.ctx[19];
	  }

	}

	function create_fragment$i(ctx) {
	  var form;
	  var label0;
	  var t0_value = window.t("timemanager", "Note") + "";
	  var t0;
	  var t1;
	  var input0;
	  var input0_placeholder_value;
	  var t2;
	  var label1;
	  var html_tag;
	  var raw0_value = window.t("timemanager", "Duration (in hrs.) & Date") + "";
	  var t3;
	  var span0;
	  var input1;
	  var t4;
	  var input2;
	  var t5;
	  var label2;
	  var t6_value = window.t("timemanager", "Client") + "";
	  var t6;
	  var t7;
	  var updating_selectedValue;
	  var label2_class_value;
	  var t8;
	  var label3;
	  var span1;
	  var html_tag_1;
	  var raw1_value = window.t("timemanager", "Project & Task for") + "";
	  var t9;
	  var strong;
	  var t10_value = (
	  /*client*/
	  ctx[4] &&
	  /*client*/
	  ctx[4].label) + "";
	  var t10;
	  var t11;
	  var a;
	  var t13;
	  var updating_selectedValue_1;
	  var label3_class_value;
	  var t14;
	  var span2;
	  var button;
	  var t15_value = window.t("timemanager", "Add") + "";
	  var t15;
	  var form_class_value;
	  var current;
	  var mounted;
	  var dispose;

	  function select0_selectedValue_binding(value) {
	    /*select0_selectedValue_binding*/
	    ctx[22].call(null, value);
	  }

	  var select0_props = {
	    items:
	    /*clients*/
	    ctx[0]
	  };

	  if (
	  /*client*/
	  ctx[4] !== void 0) {
	    select0_props.selectedValue =
	    /*client*/
	    ctx[4];
	  }

	  var select0 = new Select({
	    props: select0_props
	  });
	  binding_callbacks.push(function () {
	    return bind$1(select0, "selectedValue", select0_selectedValue_binding);
	  });
	  select0.$on("select",
	  /*clientSelected*/
	  ctx[11]);

	  function select1_selectedValue_binding(value) {
	    /*select1_selectedValue_binding*/
	    ctx[25].call(null, value);
	  }

	  var select1_props = {
	    items:
	    /*tasksWithProject*/
	    ctx[9] &&
	    /*tasksWithProject*/
	    ctx[9].filter(
	    /*func*/
	    ctx[24]),
	    groupBy: func_1,
	    noOptionsMessage: window.t("timemanager", "No projects/tasks or no client selected.")
	  };

	  if (
	  /*task*/
	  ctx[5] !== void 0) {
	    select1_props.selectedValue =
	    /*task*/
	    ctx[5];
	  }

	  var select1 = new Select({
	    props: select1_props
	  });
	  binding_callbacks.push(function () {
	    return bind$1(select1, "selectedValue", select1_selectedValue_binding);
	  });
	  return {
	    c() {
	      form = element("form");
	      label0 = element("label");
	      t0 = text(t0_value);
	      t1 = space();
	      input0 = element("input");
	      t2 = space();
	      label1 = element("label");
	      t3 = space();
	      span0 = element("span");
	      input1 = element("input");
	      t4 = space();
	      input2 = element("input");
	      t5 = space();
	      label2 = element("label");
	      t6 = text(t6_value);
	      t7 = space();
	      create_component(select0.$$.fragment);
	      t8 = space();
	      label3 = element("label");
	      span1 = element("span");
	      t9 = space();
	      strong = element("strong");
	      t10 = text(t10_value);
	      t11 = space();
	      a = element("a");
	      a.textContent = "".concat(window.t("timemanager", "Change client"));
	      t13 = space();
	      create_component(select1.$$.fragment);
	      t14 = space();
	      span2 = element("span");
	      button = element("button");
	      t15 = text(t15_value);
	      attr(input0, "type", "text");
	      attr(input0, "name", "note");
	      attr(input0, "class", "note");
	      attr(input0, "placeholder", input0_placeholder_value = window.t("timemanager", "Describe what you did..."));
	      attr(label0, "class", "note");
	      html_tag = new HtmlTag(t3);
	      attr(input1, "type", "number");
	      attr(input1, "name", "duration");
	      attr(input1, "step", "0.25");
	      attr(input1, "placeholder", "");
	      attr(input1, "class", "duration-input");
	      attr(input2, "type", "date");
	      attr(input2, "name", "date");
	      attr(input2, "class", "date-input");
	      attr(span0, "class", "double");
	      attr(label2, "class", label2_class_value = "client".concat(
	      /*taskError*/
	      ctx[8] ? " error" : "").concat(
	      /*client*/
	      ctx[4] ? " hidden-visually" : ""));
	      html_tag_1 = new HtmlTag(t9);
	      attr(a, "href", "#/");
	      attr(a, "class", "change");
	      attr(span1, "class", "task-caption");
	      attr(label3, "class", label3_class_value = "task".concat(
	      /*taskError*/
	      ctx[8] ? " error" : "").concat(!
	      /*client*/
	      ctx[4] ? " hidden-visually" : ""));
	      button.disabled =
	      /*loading*/
	      ctx[7];
	      attr(button, "type", "submit");
	      attr(button, "class", "button primary");
	      attr(span2, "class", "actions");
	      attr(form, "class", form_class_value = "quick-add".concat(
	      /*loading*/
	      ctx[7] ? " icon-loading" : ""));
	    },

	    m(target, anchor) {
	      insert(target, form, anchor);
	      append(form, label0);
	      append(label0, t0);
	      append(label0, t1);
	      append(label0, input0);
	      set_input_value(input0,
	      /*note*/
	      ctx[3]);
	      /*input0_binding*/

	      ctx[19](input0);
	      append(form, t2);
	      append(form, label1);
	      html_tag.m(raw0_value, label1);
	      append(label1, t3);
	      append(label1, span0);
	      append(span0, input1);
	      set_input_value(input1,
	      /*duration*/
	      ctx[1]);
	      append(span0, t4);
	      append(span0, input2);
	      set_input_value(input2,
	      /*date*/
	      ctx[2]);
	      append(form, t5);
	      append(form, label2);
	      append(label2, t6);
	      append(label2, t7);
	      mount_component(select0, label2, null);
	      append(form, t8);
	      append(form, label3);
	      append(label3, span1);
	      html_tag_1.m(raw1_value, span1);
	      append(span1, t9);
	      append(span1, strong);
	      append(strong, t10);
	      append(span1, t11);
	      append(span1, a);
	      append(label3, t13);
	      mount_component(select1, label3, null);
	      append(form, t14);
	      append(form, span2);
	      append(span2, button);
	      append(button, t15);
	      current = true;

	      if (!mounted) {
	        dispose = [listen(input0, "input",
	        /*input0_input_handler*/
	        ctx[18]), listen(input1, "input",
	        /*input1_input_handler*/
	        ctx[20]), listen(input2, "input",
	        /*input2_input_handler*/
	        ctx[21]), listen(a, "click", prevent_default(
	        /*click_handler*/
	        ctx[23])), listen(form, "submit", prevent_default(
	        /*save*/
	        ctx[10]))];
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*note*/
	      8 && input0.value !==
	      /*note*/
	      ctx[3]) {
	        set_input_value(input0,
	        /*note*/
	        ctx[3]);
	      }

	      if (dirty &
	      /*duration*/
	      2 && to_number(input1.value) !==
	      /*duration*/
	      ctx[1]) {
	        set_input_value(input1,
	        /*duration*/
	        ctx[1]);
	      }

	      if (dirty &
	      /*date*/
	      4) {
	        set_input_value(input2,
	        /*date*/
	        ctx[2]);
	      }

	      var select0_changes = {};
	      if (dirty &
	      /*clients*/
	      1) select0_changes.items =
	      /*clients*/
	      ctx[0];

	      if (!updating_selectedValue && dirty &
	      /*client*/
	      16) {
	        updating_selectedValue = true;
	        select0_changes.selectedValue =
	        /*client*/
	        ctx[4];
	        add_flush_callback(function () {
	          return updating_selectedValue = false;
	        });
	      }

	      select0.$set(select0_changes);

	      if (!current || dirty &
	      /*taskError, client*/
	      272 && label2_class_value !== (label2_class_value = "client".concat(
	      /*taskError*/
	      ctx[8] ? " error" : "").concat(
	      /*client*/
	      ctx[4] ? " hidden-visually" : ""))) {
	        attr(label2, "class", label2_class_value);
	      }

	      if ((!current || dirty &
	      /*client*/
	      16) && t10_value !== (t10_value = (
	      /*client*/
	      ctx[4] &&
	      /*client*/
	      ctx[4].label) + "")) set_data(t10, t10_value);
	      var select1_changes = {};
	      if (dirty &
	      /*client*/
	      16) select1_changes.items =
	      /*tasksWithProject*/
	      ctx[9] &&
	      /*tasksWithProject*/
	      ctx[9].filter(
	      /*func*/
	      ctx[24]);

	      if (!updating_selectedValue_1 && dirty &
	      /*task*/
	      32) {
	        updating_selectedValue_1 = true;
	        select1_changes.selectedValue =
	        /*task*/
	        ctx[5];
	        add_flush_callback(function () {
	          return updating_selectedValue_1 = false;
	        });
	      }

	      select1.$set(select1_changes);

	      if (!current || dirty &
	      /*taskError, client*/
	      272 && label3_class_value !== (label3_class_value = "task".concat(
	      /*taskError*/
	      ctx[8] ? " error" : "").concat(!
	      /*client*/
	      ctx[4] ? " hidden-visually" : ""))) {
	        attr(label3, "class", label3_class_value);
	      }

	      if (!current || dirty &
	      /*loading*/
	      128) {
	        button.disabled =
	        /*loading*/
	        ctx[7];
	      }

	      if (!current || dirty &
	      /*loading*/
	      128 && form_class_value !== (form_class_value = "quick-add".concat(
	      /*loading*/
	      ctx[7] ? " icon-loading" : ""))) {
	        attr(form, "class", form_class_value);
	      }
	    },

	    i(local) {
	      if (current) return;
	      transition_in(select0.$$.fragment, local);
	      transition_in(select1.$$.fragment, local);
	      current = true;
	    },

	    o(local) {
	      transition_out(select0.$$.fragment, local);
	      transition_out(select1.$$.fragment, local);
	      current = false;
	    },

	    d(detaching) {
	      if (detaching) detach(form);
	      /*input0_binding*/

	      ctx[19](null);
	      destroy_component(select0);
	      destroy_component(select1);
	      mounted = false;
	      run_all(dispose);
	    }

	  };
	}

	var func_1 = function func_1(item) {
	  return item.project.label;
	};

	function instance$i($$self, $$props, $$invalidate) {
	  var action = $$props.action;
	  var requestToken = $$props.requestToken;
	  var clients = $$props.clients;
	  var projects = $$props.projects;
	  var tasks = $$props.tasks;
	  var initialDate = $$props.initialDate;
	  var duration = 1;
	  var date = initialDate;
	  var note;
	  var client;
	  var task;
	  var noteInput;
	  var tasksWithProject = tasks && tasks.length ? tasks.map(function (aTask) {
	    aTask.project = projects.find(function (aProject) {
	      return aProject.value === aTask.projectUuid;
	    });
	    return aTask;
	  }) : [];
	  onMount(function () {
	    document.addEventListener("DOMContentLoaded", function () {
	      if (noteInput) {
	        noteInput.focus();
	      }
	    });

	    if (noteInput) {
	      noteInput.focus();
	    }
	  });

	  var save = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	      var entry, response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              $$invalidate(7, loading = true);
	              $$invalidate(8, taskError = false);

	              if (task) {
	                _context.next = 6;
	                break;
	              }

	              $$invalidate(7, loading = false);
	              $$invalidate(8, taskError = true);
	              return _context.abrupt("return");

	            case 6:
	              _context.prev = 6;
	              entry = {
	                duration,
	                date,
	                note,
	                task: task.value
	              };
	              _context.next = 10;
	              return fetch(action, {
	                method: "POST",
	                body: JSON.stringify(entry),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 10:
	              response = _context.sent;

	              if (response && response.ok) {
	                show = false;
	                document.querySelector(".app-timemanager [data-current-link]").click();
	              }

	              _context.next = 17;
	              break;

	            case 14:
	              _context.prev = 14;
	              _context.t0 = _context["catch"](6);
	              console.error(_context.t0);

	            case 17:
	              $$invalidate(7, loading = false);

	            case 18:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[6, 14]]);
	    }));

	    return function save() {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var clientSelected = function clientSelected() {
	    var input = document.querySelector(".task input");

	    if (input) {
	      input.focus();
	    }
	  };

	  function input0_input_handler() {
	    note = this.value;
	    $$invalidate(3, note);
	  }

	  function input0_binding($$value) {
	    binding_callbacks[$$value ? "unshift" : "push"](function () {
	      $$invalidate(6, noteInput = $$value);
	    });
	  }

	  function input1_input_handler() {
	    duration = to_number(this.value);
	    $$invalidate(1, duration);
	  }

	  function input2_input_handler() {
	    date = this.value;
	    $$invalidate(2, date);
	  }

	  function select0_selectedValue_binding(value) {
	    client = value;
	    $$invalidate(4, client);
	  }

	  var click_handler = function click_handler() {
	    return $$invalidate(4, client = null);
	  };

	  var func = function func(oneTask) {
	    return client && oneTask.project.clientUuid === client.value;
	  };

	  function select1_selectedValue_binding(value) {
	    task = value;
	    $$invalidate(5, task);
	  }

	  $$self.$set = function ($$props) {
	    if ("action" in $$props) $$invalidate(12, action = $$props.action);
	    if ("requestToken" in $$props) $$invalidate(13, requestToken = $$props.requestToken);
	    if ("clients" in $$props) $$invalidate(0, clients = $$props.clients);
	    if ("projects" in $$props) $$invalidate(14, projects = $$props.projects);
	    if ("tasks" in $$props) $$invalidate(15, tasks = $$props.tasks);
	    if ("initialDate" in $$props) $$invalidate(16, initialDate = $$props.initialDate);
	  };

	  var show;
	  var loading;
	  var taskError;

	   show = false;

	   $$invalidate(7, loading = false);

	   $$invalidate(8, taskError = false);

	  return [clients, duration, date, note, client, task, noteInput, loading, taskError, tasksWithProject, save, clientSelected, action, requestToken, projects, tasks, initialDate, show, input0_input_handler, input0_binding, input1_input_handler, input2_input_handler, select0_selectedValue_binding, click_handler, func, select1_selectedValue_binding];
	}

	var QuickAdd = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(QuickAdd, _SvelteComponent);

	  var _super = _createSuper(QuickAdd);

	  function QuickAdd(options) {
	    var _this;

	    _classCallCheck(this, QuickAdd);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$i, create_fragment$i, safe_not_equal, {
	      action: 12,
	      requestToken: 13,
	      clients: 0,
	      projects: 14,
	      tasks: 15,
	      initialDate: 16
	    });
	    return _this;
	  }

	  return QuickAdd;
	}(SvelteComponent);

	function create_fragment$j(ctx) {
	  var span0;
	  var input;
	  var input_id_value;
	  var input_checked_value;
	  var t0;
	  var label;
	  var label_for_value;
	  var t1;
	  var span1;
	  var span1_class_value;
	  var mounted;
	  var dispose;
	  return {
	    c() {
	      span0 = element("span");
	      input = element("input");
	      t0 = space();
	      label = element("label");
	      t1 = space();
	      span1 = element("span");
	      attr(input, "type", "checkbox");
	      attr(input, "id", input_id_value = "check_".concat(
	      /*uuid*/
	      ctx[0]));
	      attr(input, "class", "checkbox");
	      input.checked = input_checked_value =
	      /*initialState*/
	      ctx[1] === "paid";
	      input.disabled =
	      /*loading*/
	      ctx[3];
	      attr(label, "for", label_for_value = "check_".concat(
	      /*uuid*/
	      ctx[0]));
	      attr(span0, "class", "checkbox-action");
	      attr(span1, "class", span1_class_value = "checkbox-action-loading".concat(
	      /*loading*/
	      ctx[3] ? " icon-loading" : ""));
	    },

	    m(target, anchor) {
	      insert(target, span0, anchor);
	      append(span0, input);
	      append(span0, t0);
	      append(span0, label);
	      insert(target, t1, anchor);
	      insert(target, span1, anchor);

	      if (!mounted) {
	        dispose = listen(input, "change", prevent_default(
	        /*change_handler*/
	        ctx[7]));
	        mounted = true;
	      }
	    },

	    p(ctx, _ref) {
	      var _ref2 = _slicedToArray(_ref, 1),
	          dirty = _ref2[0];

	      if (dirty &
	      /*uuid*/
	      1 && input_id_value !== (input_id_value = "check_".concat(
	      /*uuid*/
	      ctx[0]))) {
	        attr(input, "id", input_id_value);
	      }

	      if (dirty &
	      /*initialState*/
	      2 && input_checked_value !== (input_checked_value =
	      /*initialState*/
	      ctx[1] === "paid")) {
	        input.checked = input_checked_value;
	      }

	      if (dirty &
	      /*loading*/
	      8) {
	        input.disabled =
	        /*loading*/
	        ctx[3];
	      }

	      if (dirty &
	      /*uuid*/
	      1 && label_for_value !== (label_for_value = "check_".concat(
	      /*uuid*/
	      ctx[0]))) {
	        attr(label, "for", label_for_value);
	      }

	      if (dirty &
	      /*loading*/
	      8 && span1_class_value !== (span1_class_value = "checkbox-action-loading".concat(
	      /*loading*/
	      ctx[3] ? " icon-loading" : ""))) {
	        attr(span1, "class", span1_class_value);
	      }
	    },

	    i: noop,
	    o: noop,

	    d(detaching) {
	      if (detaching) detach(span0);
	      if (detaching) detach(t1);
	      if (detaching) detach(span1);
	      mounted = false;
	      dispose();
	    }

	  };
	}

	function instance$j($$self, $$props, $$invalidate) {
	  var uuid = $$props.uuid;
	  var initialState = $$props.initialState;
	  var action = $$props.action;
	  var requestToken = $$props.requestToken;
	  var state = initialState;
	  onMount(function () {
	    Helpers.hideFallbacks("Checkmark.svelte");
	  });

	  var save = /*#__PURE__*/function () {
	    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
	      var response;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              $$invalidate(3, loading = true);
	              _context.prev = 1;
	              _context.next = 4;
	              return fetch("".concat(action, "/").concat(state), {
	                method: "POST",
	                body: JSON.stringify({
	                  uuid
	                }),
	                headers: {
	                  requesttoken: requestToken,
	                  "content-type": "application/json"
	                }
	              });

	            case 4:
	              response = _context.sent;

	              if (!response || !response.ok) {
	                // Roll back selection
	                $$invalidate(2, state = state === "paid" ? "unpaid" : "paid");
	              }

	              _context.next = 11;
	              break;

	            case 8:
	              _context.prev = 8;
	              _context.t0 = _context["catch"](1);
	              console.error(_context.t0);

	            case 11:
	              $$invalidate(3, loading = false);

	            case 12:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, null, [[1, 8]]);
	    }));

	    return function save() {
	      return _ref3.apply(this, arguments);
	    };
	  }();

	  var change_handler = function change_handler() {
	    $$invalidate(2, state = state === "paid" ? "unpaid" : "paid");
	    save();
	  };

	  $$self.$set = function ($$props) {
	    if ("uuid" in $$props) $$invalidate(0, uuid = $$props.uuid);
	    if ("initialState" in $$props) $$invalidate(1, initialState = $$props.initialState);
	    if ("action" in $$props) $$invalidate(5, action = $$props.action);
	    if ("requestToken" in $$props) $$invalidate(6, requestToken = $$props.requestToken);
	  };

	  var loading;

	   $$invalidate(3, loading = false);

	  return [uuid, initialState, state, loading, save, action, requestToken, change_handler];
	}

	var Checkmark = /*#__PURE__*/function (_SvelteComponent) {
	  _inherits(Checkmark, _SvelteComponent);

	  var _super = _createSuper(Checkmark);

	  function Checkmark(options) {
	    var _this;

	    _classCallCheck(this, Checkmark);

	    _this = _super.call(this);
	    init(_assertThisInitialized(_this), options, instance$j, create_fragment$j, safe_not_equal, {
	      uuid: 0,
	      initialState: 1,
	      action: 5,
	      requestToken: 6
	    });
	    return _this;
	  }

	  return Checkmark;
	}(SvelteComponent);

	/* global HTMLCollection: true */
	var foreachEls = function (els, fn, context) {
	  if (els instanceof HTMLCollection || els instanceof NodeList || els instanceof Array) {
	    return Array.prototype.forEach.call(els, fn, context);
	  } // assume simple DOM element


	  return fn.call(context, els);
	};

	var evalScript = function (el) {
	  var code = el.text || el.textContent || el.innerHTML || "";
	  var src = el.src || "";
	  var parent = el.parentNode || document.querySelector("head") || document.documentElement;
	  var script = document.createElement("script");

	  if (code.match("document.write")) {
	    if (console && console.log) {
	      console.log("Script contains document.write. Can’t be executed correctly. Code skipped ", el);
	    }

	    return false;
	  }

	  script.type = "text/javascript";
	  script.id = el.id;
	  /* istanbul ignore if */

	  if (src !== "") {
	    script.src = src;
	    script.async = false; // force synchronous loading of peripheral JS
	  }

	  if (code !== "") {
	    try {
	      script.appendChild(document.createTextNode(code));
	    } catch (e) {
	      /* istanbul ignore next */
	      // old IEs have funky script nodes
	      script.text = code;
	    }
	  } // execute


	  parent.appendChild(script); // avoid pollution only in head or body tags

	  if ((parent instanceof HTMLHeadElement || parent instanceof HTMLBodyElement) && parent.contains(script)) {
	    parent.removeChild(script);
	  }

	  return true;
	};

	// Finds and executes scripts (used for newly added elements)
	// Needed since innerHTML does not run scripts


	var executeScripts = function (el) {
	  if (el.tagName.toLowerCase() === "script") {
	    evalScript(el);
	  }

	  foreachEls(el.querySelectorAll("script"), function (script) {
	    if (!script.type || script.type.toLowerCase() === "text/javascript") {
	      if (script.parentNode) {
	        script.parentNode.removeChild(script);
	      }

	      evalScript(script);
	    }
	  });
	};

	var on = function (els, events, listener, useCapture) {
	  events = typeof events === "string" ? events.split(" ") : events;
	  events.forEach(function (e) {
	    foreachEls(els, function (el) {
	      el.addEventListener(e, listener, useCapture);
	    });
	  });
	};

	var switches = {
	  outerHTML: function (oldEl, newEl) {
	    oldEl.outerHTML = newEl.outerHTML;
	    this.onSwitch();
	  },
	  innerHTML: function (oldEl, newEl) {
	    oldEl.innerHTML = newEl.innerHTML;

	    if (newEl.className === "") {
	      oldEl.removeAttribute("class");
	    } else {
	      oldEl.className = newEl.className;
	    }

	    this.onSwitch();
	  },
	  switchElementsAlt: function (oldEl, newEl) {
	    oldEl.innerHTML = newEl.innerHTML; // Copy attributes from the new element to the old one

	    if (newEl.hasAttributes()) {
	      var attrs = newEl.attributes;

	      for (var i = 0; i < attrs.length; i++) {
	        oldEl.attributes.setNamedItem(attrs[i].cloneNode());
	      }
	    }

	    this.onSwitch();
	  },
	  // Equivalent to outerHTML(), but doesn't require switchElementsAlt() for <head> and <body>
	  replaceNode: function (oldEl, newEl) {
	    oldEl.parentNode.replaceChild(newEl, oldEl);
	    this.onSwitch();
	  },
	  sideBySide: function (oldEl, newEl, options, switchOptions) {
	    var forEach = Array.prototype.forEach;
	    var elsToRemove = [];
	    var elsToAdd = [];
	    var fragToAppend = document.createDocumentFragment();
	    var animationEventNames = "animationend webkitAnimationEnd MSAnimationEnd oanimationend";
	    var animatedElsNumber = 0;

	    var sexyAnimationEnd = function (e) {
	      if (e.target !== e.currentTarget) {
	        // end triggered by an animation on a child
	        return;
	      }

	      animatedElsNumber--;

	      if (animatedElsNumber <= 0 && elsToRemove) {
	        elsToRemove.forEach(function (el) {
	          // browsing quickly can make the el
	          // already removed by last page update ?
	          if (el.parentNode) {
	            el.parentNode.removeChild(el);
	          }
	        });
	        elsToAdd.forEach(function (el) {
	          el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "");
	          el.removeAttribute("data-pjax-classes");
	        });
	        elsToAdd = null; // free memory

	        elsToRemove = null; // free memory
	        // this is to trigger some repaint (example: picturefill)

	        this.onSwitch();
	      }
	    }.bind(this);

	    switchOptions = switchOptions || {};
	    forEach.call(oldEl.childNodes, function (el) {
	      elsToRemove.push(el);

	      if (el.classList && !el.classList.contains("js-Pjax-remove")) {
	        // for fast switch, clean element that just have been added, & not cleaned yet.
	        if (el.hasAttribute("data-pjax-classes")) {
	          el.className = el.className.replace(el.getAttribute("data-pjax-classes"), "");
	          el.removeAttribute("data-pjax-classes");
	        }

	        el.classList.add("js-Pjax-remove");

	        if (switchOptions.callbacks && switchOptions.callbacks.removeElement) {
	          switchOptions.callbacks.removeElement(el);
	        }

	        if (switchOptions.classNames) {
	          el.className += " " + switchOptions.classNames.remove + " " + (options.backward ? switchOptions.classNames.backward : switchOptions.classNames.forward);
	        }

	        animatedElsNumber++;
	        on(el, animationEventNames, sexyAnimationEnd, true);
	      }
	    });
	    forEach.call(newEl.childNodes, function (el) {
	      if (el.classList) {
	        var addClasses = "";

	        if (switchOptions.classNames) {
	          addClasses = " js-Pjax-add " + switchOptions.classNames.add + " " + (options.backward ? switchOptions.classNames.forward : switchOptions.classNames.backward);
	        }

	        if (switchOptions.callbacks && switchOptions.callbacks.addElement) {
	          switchOptions.callbacks.addElement(el);
	        }

	        el.className += addClasses;
	        el.setAttribute("data-pjax-classes", addClasses);
	        elsToAdd.push(el);
	        fragToAppend.appendChild(el);
	        animatedElsNumber++;
	        on(el, animationEventNames, sexyAnimationEnd, true);
	      }
	    }); // pass all className of the parent

	    oldEl.className = newEl.className;
	    oldEl.appendChild(fragToAppend);
	  }
	};

	/* global _gaq: true, ga: true */


	var parseOptions = function (options) {
	  options = options || {};
	  options.elements = options.elements || "a[href], form[action]";
	  options.selectors = options.selectors || ["title", ".js-Pjax"];
	  options.switches = options.switches || {};
	  options.switchesOptions = options.switchesOptions || {};
	  options.history = typeof options.history === "undefined" ? true : options.history;
	  options.analytics = typeof options.analytics === "function" || options.analytics === false ? options.analytics : defaultAnalytics;
	  options.scrollTo = typeof options.scrollTo === "undefined" ? 0 : options.scrollTo;
	  options.scrollRestoration = typeof options.scrollRestoration !== "undefined" ? options.scrollRestoration : true;
	  options.cacheBust = typeof options.cacheBust === "undefined" ? true : options.cacheBust;
	  options.debug = options.debug || false;
	  options.timeout = options.timeout || 0;
	  options.currentUrlFullReload = typeof options.currentUrlFullReload === "undefined" ? false : options.currentUrlFullReload; // We can’t replace body.outerHTML or head.outerHTML.
	  // It creates a bug where a new body or head are created in the DOM.
	  // If you set head.outerHTML, a new body tag is appended, so the DOM has 2 body nodes, and vice versa

	  if (!options.switches.head) {
	    options.switches.head = switches.switchElementsAlt;
	  }

	  if (!options.switches.body) {
	    options.switches.body = switches.switchElementsAlt;
	  }

	  return options;
	};
	/* istanbul ignore next */


	function defaultAnalytics() {
	  if (window._gaq) {
	    _gaq.push(["_trackPageview"]);
	  }

	  if (window.ga) {
	    ga("send", "pageview", {
	      page: location.pathname,
	      title: document.title
	    });
	  }
	}

	var uniqueid = function () {
	  var counter = 0;
	  return function () {
	    var id = "pjax" + new Date().getTime() + "_" + counter;
	    counter++;
	    return id;
	  };
	}();

	var trigger = function (els, events, opts) {
	  events = typeof events === "string" ? events.split(" ") : events;
	  events.forEach(function (e) {
	    var event;
	    event = document.createEvent("HTMLEvents");
	    event.initEvent(e, true, true);
	    event.eventName = e;

	    if (opts) {
	      Object.keys(opts).forEach(function (key) {
	        event[key] = opts[key];
	      });
	    }

	    foreachEls(els, function (el) {
	      var domFix = false;

	      if (!el.parentNode && el !== document && el !== window) {
	        // THANK YOU IE (9/10/11)
	        // dispatchEvent doesn't work if the element is not in the DOM
	        domFix = true;
	        document.body.appendChild(el);
	      }

	      el.dispatchEvent(event);

	      if (domFix) {
	        el.parentNode.removeChild(el);
	      }
	    });
	  });
	};

	var clone = function (obj) {
	  /* istanbul ignore if */
	  if (null === obj || "object" !== typeof obj) {
	    return obj;
	  }

	  var copy = obj.constructor();

	  for (var attr in obj) {
	    if (obj.hasOwnProperty(attr)) {
	      copy[attr] = obj[attr];
	    }
	  }

	  return copy;
	};

	var contains = function contains(doc, selectors, el) {
	  for (var i = 0; i < selectors.length; i++) {
	    var selectedEls = doc.querySelectorAll(selectors[i]);

	    for (var j = 0; j < selectedEls.length; j++) {
	      if (selectedEls[j].contains(el)) {
	        return true;
	      }
	    }
	  }

	  return false;
	};

	var extend = function (target) {
	  if (target == null) {
	    return null;
	  }

	  var to = Object(target);

	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    if (source != null) {
	      for (var key in source) {
	        // Avoid bugs when hasOwnProperty is shadowed
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          to[key] = source[key];
	        }
	      }
	    }
	  }

	  return to;
	};

	var noop$1 = function () {};

	var log = function () {
	  if (this.options.debug && console) {
	    if (typeof console.log === "function") {
	      console.log.apply(console, arguments);
	    } // IE is weird
	    else if (console.log) {
	        console.log(arguments);
	      }
	  }
	};

	var attrState = "data-pjax-state";

	var parseElement = function (el) {
	  switch (el.tagName.toLowerCase()) {
	    case "a":
	      // only attach link if el does not already have link attached
	      if (!el.hasAttribute(attrState)) {
	        this.attachLink(el);
	      }

	      break;

	    case "form":
	      // only attach link if el does not already have link attached
	      if (!el.hasAttribute(attrState)) {
	        this.attachForm(el);
	      }

	      break;

	    default:
	      throw "Pjax can only be applied on <a> or <form> submit";
	  }
	};

	var attrState$1 = "data-pjax-state";

	var linkAction = function (el, event) {
	  if (isDefaultPrevented(event)) {
	    return;
	  } // Since loadUrl modifies options and we may add our own modifications below,
	  // clone it so the changes don't persist


	  var options = clone(this.options);
	  var attrValue = checkIfShouldAbort(el, event);

	  if (attrValue) {
	    el.setAttribute(attrState$1, attrValue);
	    return;
	  }

	  event.preventDefault(); // don’t do "nothing" if user try to reload the page by clicking the same link twice

	  if (this.options.currentUrlFullReload && el.href === window.location.href.split("#")[0]) {
	    el.setAttribute(attrState$1, "reload");
	    this.reload();
	    return;
	  }

	  el.setAttribute(attrState$1, "load");
	  options.triggerElement = el;
	  this.loadUrl(el.href, options);
	};

	function checkIfShouldAbort(el, event) {
	  // Don’t break browser special behavior on links (like page in new window)
	  if (event.which > 1 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
	    return "modifier";
	  } // we do test on href now to prevent unexpected behavior if for some reason
	  // user have href that can be dynamically updated
	  // Ignore external links.


	  if (el.protocol !== window.location.protocol || el.host !== window.location.host) {
	    return "external";
	  } // Ignore anchors on the same page (keep native behavior)


	  if (el.hash && el.href.replace(el.hash, "") === window.location.href.replace(location.hash, "")) {
	    return "anchor";
	  } // Ignore empty anchor "foo.html#"


	  if (el.href === window.location.href.split("#")[0] + "#") {
	    return "anchor-empty";
	  }
	}

	var isDefaultPrevented = function (event) {
	  return event.defaultPrevented || event.returnValue === false;
	};

	var attachLink = function (el) {
	  var that = this;
	  el.setAttribute(attrState$1, "");
	  on(el, "click", function (event) {
	    linkAction.call(that, el, event);
	  });
	  on(el, "keyup", function (event) {
	    if (event.keyCode === 13) {
	      linkAction.call(that, el, event);
	    }
	  }.bind(this));
	};

	var attrState$2 = "data-pjax-state";

	var formAction = function (el, event) {
	  if (isDefaultPrevented$1(event)) {
	    return;
	  } // Since loadUrl modifies options and we may add our own modifications below,
	  // clone it so the changes don't persist


	  var options = clone(this.options); // Initialize requestOptions

	  options.requestOptions = {
	    requestUrl: el.getAttribute("action") || window.location.href,
	    requestMethod: el.getAttribute("method") || "GET"
	  }; // create a testable virtual link of the form action

	  var virtLinkElement = document.createElement("a");
	  virtLinkElement.setAttribute("href", options.requestOptions.requestUrl);
	  var attrValue = checkIfShouldAbort$1(virtLinkElement, options);

	  if (attrValue) {
	    el.setAttribute(attrState$2, attrValue);
	    return;
	  }

	  event.preventDefault();

	  if (el.enctype === "multipart/form-data") {
	    options.requestOptions.formData = new FormData(el);
	  } else {
	    options.requestOptions.requestParams = parseFormElements(el);
	  }

	  el.setAttribute(attrState$2, "submit");
	  options.triggerElement = el;
	  this.loadUrl(virtLinkElement.href, options);
	};

	function parseFormElements(el) {
	  var requestParams = [];
	  var formElements = el.elements;

	  for (var i = 0; i < formElements.length; i++) {
	    var element = formElements[i];
	    var tagName = element.tagName.toLowerCase(); // jscs:disable disallowImplicitTypeConversion

	    if (!!element.name && element.attributes !== undefined && tagName !== "button") {
	      // jscs:enable disallowImplicitTypeConversion
	      var type = element.attributes.type;

	      if (!type || type.value !== "checkbox" && type.value !== "radio" || element.checked) {
	        // Build array of values to submit
	        var values = [];

	        if (tagName === "select") {
	          var opt;

	          for (var j = 0; j < element.options.length; j++) {
	            opt = element.options[j];

	            if (opt.selected && !opt.disabled) {
	              values.push(opt.hasAttribute("value") ? opt.value : opt.text);
	            }
	          }
	        } else {
	          values.push(element.value);
	        }

	        for (var k = 0; k < values.length; k++) {
	          requestParams.push({
	            name: encodeURIComponent(element.name),
	            value: encodeURIComponent(values[k])
	          });
	        }
	      }
	    }
	  }

	  return requestParams;
	}

	function checkIfShouldAbort$1(virtLinkElement, options) {
	  // Ignore external links.
	  if (virtLinkElement.protocol !== window.location.protocol || virtLinkElement.host !== window.location.host) {
	    return "external";
	  } // Ignore click if we are on an anchor on the same page


	  if (virtLinkElement.hash && virtLinkElement.href.replace(virtLinkElement.hash, "") === window.location.href.replace(location.hash, "")) {
	    return "anchor";
	  } // Ignore empty anchor "foo.html#"


	  if (virtLinkElement.href === window.location.href.split("#")[0] + "#") {
	    return "anchor-empty";
	  } // if declared as a full reload, just normally submit the form


	  if (options.currentUrlFullReload && virtLinkElement.href === window.location.href.split("#")[0]) {
	    return "reload";
	  }
	}

	var isDefaultPrevented$1 = function (event) {
	  return event.defaultPrevented || event.returnValue === false;
	};

	var attachForm = function (el) {
	  var that = this;
	  el.setAttribute(attrState$2, "");
	  on(el, "submit", function (event) {
	    formAction.call(that, el, event);
	  });
	};

	var foreachSelectors = function (selectors, cb, context, DOMcontext) {
	  DOMcontext = DOMcontext || document;
	  selectors.forEach(function (selector) {
	    foreachEls(DOMcontext.querySelectorAll(selector), cb, context);
	  });
	};

	var switchesSelectors = function (switches$1, switchesOptions, selectors, fromEl, toEl, options) {
	  var switchesQueue = [];
	  selectors.forEach(function (selector) {
	    var newEls = fromEl.querySelectorAll(selector);
	    var oldEls = toEl.querySelectorAll(selector);

	    if (this.log) {
	      this.log("Pjax switch", selector, newEls, oldEls);
	    }

	    if (newEls.length !== oldEls.length) {
	      throw "DOM doesn’t look the same on new loaded page: ’" + selector + "’ - new " + newEls.length + ", old " + oldEls.length;
	    }

	    foreachEls(newEls, function (newEl, i) {
	      var oldEl = oldEls[i];

	      if (this.log) {
	        this.log("newEl", newEl, "oldEl", oldEl);
	      }

	      var callback = switches$1[selector] ? switches$1[selector].bind(this, oldEl, newEl, options, switchesOptions[selector]) : switches.outerHTML.bind(this, oldEl, newEl, options);
	      switchesQueue.push(callback);
	    }, this);
	  }, this);
	  this.state.numPendingSwitches = switchesQueue.length;
	  switchesQueue.forEach(function (queuedSwitch) {
	    queuedSwitch();
	  });
	};

	var abortRequest = function (request) {
	  if (request && request.readyState < 4) {
	    request.onreadystatechange = noop$1;
	    request.abort();
	  }
	};

	var updateQueryString = function (uri, key, value) {
	  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
	  var separator = uri.indexOf("?") !== -1 ? "&" : "?";

	  if (uri.match(re)) {
	    return uri.replace(re, "$1" + key + "=" + value + "$2");
	  } else {
	    return uri + separator + key + "=" + value;
	  }
	};

	var sendRequest = function (location, options, callback) {
	  options = options || {};
	  var queryString;
	  var requestOptions = options.requestOptions || {};
	  var requestMethod = (requestOptions.requestMethod || "GET").toUpperCase();
	  var requestParams = requestOptions.requestParams || null;
	  var formData = requestOptions.formData || null;
	  var requestPayload = null;
	  var request = new XMLHttpRequest();
	  var timeout = options.timeout || 0;

	  request.onreadystatechange = function () {
	    if (request.readyState === 4) {
	      if (request.status === 200) {
	        callback(request.responseText, request, location, options);
	      } else if (request.status !== 0) {
	        callback(null, request, location, options);
	      }
	    }
	  };

	  request.onerror = function (e) {
	    console.log(e);
	    callback(null, request, location, options);
	  };

	  request.ontimeout = function () {
	    callback(null, request, location, options);
	  }; // Prepare the request payload for forms, if available


	  if (requestParams && requestParams.length) {
	    // Build query string
	    queryString = requestParams.map(function (param) {
	      return param.name + "=" + param.value;
	    }).join("&");

	    switch (requestMethod) {
	      case "GET":
	        // Reset query string to avoid an issue with repeat submissions where checkboxes that were
	        // previously checked are incorrectly preserved
	        location = location.split("?")[0]; // Append new query string

	        location += "?" + queryString;
	        break;

	      case "POST":
	        // Send query string as request payload
	        requestPayload = queryString;
	        break;
	    }
	  } else if (formData) {
	    requestPayload = formData;
	  } // Add a timestamp as part of the query string if cache busting is enabled


	  if (options.cacheBust) {
	    location = updateQueryString(location, "t", Date.now());
	  }

	  request.open(requestMethod, location, true);
	  request.timeout = timeout;
	  request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	  request.setRequestHeader("X-PJAX", "true");
	  request.setRequestHeader("X-PJAX-Selectors", JSON.stringify(options.selectors)); // Send the proper header information for POST forms

	  if (requestPayload && requestMethod === "POST" && !formData) {
	    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	  }

	  request.send(requestPayload);
	  return request;
	};

	var handleResponse = function (responseText, request, href, options) {
	  options = clone(options || this.options);
	  options.request = request; // Fail if unable to load HTML via AJAX

	  if (responseText === false) {
	    trigger(document, "pjax:complete pjax:error", options);
	    return;
	  } // push scroll position to history


	  var currentState = window.history.state || {};
	  window.history.replaceState({
	    url: currentState.url || window.location.href,
	    title: currentState.title || document.title,
	    uid: currentState.uid || uniqueid(),
	    scrollPos: [document.documentElement.scrollLeft || document.body.scrollLeft, document.documentElement.scrollTop || document.body.scrollTop]
	  }, document.title, window.location.href); // Check for redirects

	  var oldHref = href;

	  if (request.responseURL) {
	    if (href !== request.responseURL) {
	      href = request.responseURL;
	    }
	  } else if (request.getResponseHeader("X-PJAX-URL")) {
	    href = request.getResponseHeader("X-PJAX-URL");
	  } else if (request.getResponseHeader("X-XHR-Redirected-To")) {
	    href = request.getResponseHeader("X-XHR-Redirected-To");
	  } // Add back the hash if it was removed


	  var a = document.createElement("a");
	  a.href = oldHref;
	  var oldHash = a.hash;
	  a.href = href;

	  if (oldHash && !a.hash) {
	    a.hash = oldHash;
	    href = a.href;
	  }

	  this.state.href = href;
	  this.state.options = options;

	  try {
	    this.loadContent(responseText, options);
	  } catch (e) {
	    trigger(document, "pjax:error", options);

	    if (!this.options.debug) {
	      if (console && console.error) {
	        console.error("Pjax switch fail: ", e);
	      }

	      return this.latestChance(href);
	    } else {
	      throw e;
	    }
	  }
	};

	var isSupported = function () {
	  // Borrowed wholesale from https://github.com/defunkt/jquery-pjax
	  return window.history && window.history.pushState && window.history.replaceState && // pushState isn’t reliable on iOS until 5.
	  !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]\D|WebApps\/.+CFNetwork)/);
	};

	var pjax = createCommonjsModule(function (module) {
	var Pjax = function (options) {
	  this.state = {
	    numPendingSwitches: 0,
	    href: null,
	    options: null
	  };
	  this.options = parseOptions(options);
	  this.log("Pjax options", this.options);

	  if (this.options.scrollRestoration && "scrollRestoration" in history) {
	    history.scrollRestoration = "manual";
	  }

	  this.maxUid = this.lastUid = uniqueid();
	  this.parseDOM(document);
	  on(window, "popstate", function (st) {
	    if (st.state) {
	      var opt = clone(this.options);
	      opt.url = st.state.url;
	      opt.title = st.state.title; // Since state already exists, prevent it from being pushed again

	      opt.history = false;
	      opt.scrollPos = st.state.scrollPos;

	      if (st.state.uid < this.lastUid) {
	        opt.backward = true;
	      } else {
	        opt.forward = true;
	      }

	      this.lastUid = st.state.uid; // @todo implement history cache here, based on uid

	      this.loadUrl(st.state.url, opt);
	    }
	  }.bind(this));
	};

	Pjax.switches = switches;
	Pjax.prototype = {
	  log: log,
	  getElements: function (el) {
	    return el.querySelectorAll(this.options.elements);
	  },
	  parseDOM: function (el) {
	    var parseElement$1 = parseElement;

	    foreachEls(this.getElements(el), parseElement$1, this);
	  },
	  refresh: function (el) {
	    this.parseDOM(el || document);
	  },
	  reload: function () {
	    window.location.reload();
	  },
	  attachLink: attachLink,
	  attachForm: attachForm,
	  forEachSelectors: function (cb, context, DOMcontext) {
	    return foreachSelectors.bind(this)(this.options.selectors, cb, context, DOMcontext);
	  },
	  switchSelectors: function (selectors, fromEl, toEl, options) {
	    return switchesSelectors.bind(this)(this.options.switches, this.options.switchesOptions, selectors, fromEl, toEl, options);
	  },
	  latestChance: function (href) {
	    window.location = href;
	  },
	  onSwitch: function () {
	    trigger(window, "resize scroll");
	    this.state.numPendingSwitches--; // debounce calls, so we only run this once after all switches are finished.

	    if (this.state.numPendingSwitches === 0) {
	      this.afterAllSwitches();
	    }
	  },
	  loadContent: function (html, options) {
	    if (typeof html !== "string") {
	      trigger(document, "pjax:complete pjax:error", options);
	      return;
	    }

	    var tmpEl = document.implementation.createHTMLDocument("pjax"); // parse HTML attributes to copy them
	    // since we are forced to use documentElement.innerHTML (outerHTML can't be used for <html>)

	    var htmlRegex = /<html[^>]+>/gi;
	    var htmlAttribsRegex = /\s?[a-z:]+(?:=['"][^'">]+['"])*/gi;
	    var matches = html.match(htmlRegex);

	    if (matches && matches.length) {
	      matches = matches[0].match(htmlAttribsRegex);

	      if (matches.length) {
	        matches.shift();
	        matches.forEach(function (htmlAttrib) {
	          var attr = htmlAttrib.trim().split("=");

	          if (attr.length === 1) {
	            tmpEl.documentElement.setAttribute(attr[0], true);
	          } else {
	            tmpEl.documentElement.setAttribute(attr[0], attr[1].slice(1, -1));
	          }
	        });
	      }
	    }

	    tmpEl.documentElement.innerHTML = html;
	    this.log("load content", tmpEl.documentElement.attributes, tmpEl.documentElement.innerHTML.length); // Clear out any focused controls before inserting new page contents.

	    if (document.activeElement && contains(document, this.options.selectors, document.activeElement)) {
	      try {
	        document.activeElement.blur();
	      } catch (e) {} // eslint-disable-line no-empty

	    }

	    this.switchSelectors(this.options.selectors, tmpEl, document, options);
	  },
	  abortRequest: abortRequest,
	  doRequest: sendRequest,
	  handleResponse: handleResponse,
	  loadUrl: function (href, options) {
	    options = typeof options === "object" ? extend({}, this.options, options) : clone(this.options);
	    this.log("load href", href, options); // Abort any previous request

	    this.abortRequest(this.request);
	    trigger(document, "pjax:send", options); // Do the request

	    this.request = this.doRequest(href, options, this.handleResponse.bind(this));
	  },
	  afterAllSwitches: function () {
	    // FF bug: Won’t autofocus fields that are inserted via JS.
	    // This behavior is incorrect. So if theres no current focus, autofocus
	    // the last field.
	    //
	    // http://www.w3.org/html/wg/drafts/html/master/forms.html
	    var autofocusEl = Array.prototype.slice.call(document.querySelectorAll("[autofocus]")).pop();

	    if (autofocusEl && document.activeElement !== autofocusEl) {
	      autofocusEl.focus();
	    } // execute scripts when DOM have been completely updated


	    this.options.selectors.forEach(function (selector) {
	      foreachEls(document.querySelectorAll(selector), function (el) {
	        executeScripts(el);
	      });
	    });
	    var state = this.state;

	    if (state.options.history) {
	      if (!window.history.state) {
	        this.lastUid = this.maxUid = uniqueid();
	        window.history.replaceState({
	          url: window.location.href,
	          title: document.title,
	          uid: this.maxUid,
	          scrollPos: [0, 0]
	        }, document.title);
	      } // Update browser history


	      this.lastUid = this.maxUid = uniqueid();
	      window.history.pushState({
	        url: state.href,
	        title: state.options.title,
	        uid: this.maxUid,
	        scrollPos: [0, 0]
	      }, state.options.title, state.href);
	    }

	    this.forEachSelectors(function (el) {
	      this.parseDOM(el);
	    }, this); // Fire Events

	    trigger(document, "pjax:complete pjax:success", state.options);

	    if (typeof state.options.analytics === "function") {
	      state.options.analytics();
	    }

	    if (state.options.history) {
	      // First parse url and check for hash to override scroll
	      var a = document.createElement("a");
	      a.href = this.state.href;

	      if (a.hash) {
	        var name = a.hash.slice(1);
	        name = decodeURIComponent(name);
	        var curtop = 0;
	        var target = document.getElementById(name) || document.getElementsByName(name)[0];

	        if (target) {
	          // http://stackoverflow.com/questions/8111094/cross-browser-javascript-function-to-find-actual-position-of-an-element-in-page
	          if (target.offsetParent) {
	            do {
	              curtop += target.offsetTop;
	              target = target.offsetParent;
	            } while (target);
	          }
	        }

	        window.scrollTo(0, curtop);
	      } else if (state.options.scrollTo !== false) {
	        // Scroll page to top on new page load
	        if (state.options.scrollTo.length > 1) {
	          window.scrollTo(state.options.scrollTo[0], state.options.scrollTo[1]);
	        } else {
	          window.scrollTo(0, state.options.scrollTo);
	        }
	      }
	    } else if (state.options.scrollRestoration && state.options.scrollPos) {
	      window.scrollTo(state.options.scrollPos[0], state.options.scrollPos[1]);
	    }

	    this.state = {
	      numPendingSwitches: 0,
	      href: null,
	      options: null
	    };
	  }
	};
	Pjax.isSupported = isSupported; // arguably could do `if( require("./lib/is-supported")()) {` but that might be a little to simple

	if (Pjax.isSupported()) {
	  module.exports = Pjax;
	} // if there isn’t required browser functions, returning stupid api
	else {
	    var stupidPjax = noop$1;

	    for (var key in Pjax.prototype) {
	      if (Pjax.prototype.hasOwnProperty(key) && typeof Pjax.prototype[key] === "function") {
	        stupidPjax[key] = noop$1;
	      }
	    }

	    module.exports = stupidPjax;
	  }
	});

	var PagePjax = function PagePjax(reload) {
	  _classCallCheck(this, PagePjax);

	  /**
	   * Enable seamless page navigation with pjax.
	   */
	  this.pjaxInstance = new pjax({
	    elements: [".timemanager-pjax-link"],
	    selectors: [".app-timemanager #app-navigation", ".app-timemanager #app-content"],
	    cacheBust: false,
	    scrollTo: true
	  });
	  document.addEventListener("pjax:send", function () {
	    document.body.classList.add("loading");
	    document.body.classList.remove("loading-error");
	  });
	  document.addEventListener("pjax:success", function () {
	    setTimeout(function () {
	      document.body.classList.remove("loading");
	      reload();
	    }, 300);
	  });
	  document.addEventListener("pjax:error", function () {
	    document.body.classList.remove("loading");
	    document.body.classList.add("loading-error");
	  });
	};

	var components = [];
	$(document).ready(function () {
	  if ($('input[name="duration"]').length > 0) {
	    $('input[name="duration"]')[0].focus();
	  }
	});

	var init$1 = function init() {
	  var store = {};
	  var storeElement = document.querySelector("#content.app-timemanager [data-store]");

	  if (storeElement) {
	    try {
	      store = JSON.parse(storeElement.getAttribute("data-store"));
	    } catch (error) {
	      console.error(error);
	    }
	  }

	  components.push(new Statistics({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='Statistics.svelte']")),
	    props: _objectSpread2({}, store)
	  }));
	  components.push(new ClientEditorDialog({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='ClientEditorDialog.svelte']")),
	    props: _objectSpread2(_objectSpread2({}, store), {}, {
	      action: "",
	      requestToken: window.OC.requestToken
	    })
	  }));
	  components.push(new ProjectEditorDialog({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='ProjectEditorDialog.svelte']")),
	    props: _objectSpread2(_objectSpread2({}, store), {}, {
	      requestToken: window.OC.requestToken
	    })
	  }));
	  components.push(new TaskEditorDialog({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='TaskEditorDialog.svelte']")),
	    props: _objectSpread2(_objectSpread2({}, store), {}, {
	      requestToken: window.OC.requestToken
	    })
	  }));
	  components.push(new TimeEditorDialog({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='TimeEditorDialog.svelte']")),
	    props: _objectSpread2(_objectSpread2({}, store), {}, {
	      requestToken: window.OC.requestToken
	    })
	  }));
	  components.push(new DeleteButton({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='DeleteButton.svelte']")),
	    props: _objectSpread2(_objectSpread2({}, store), {}, {
	      requestToken: window.OC.requestToken
	    })
	  }));
	  var deleteTimeEntryButtons = document.querySelectorAll("#content.app-timemanager [data-svelte='DeleteTimeEntryButton.svelte']");

	  if (deleteTimeEntryButtons && deleteTimeEntryButtons.length > 0) {
	    deleteTimeEntryButtons.forEach(function (button) {
	      components.push(new DeleteTimeEntryButton({
	        target: Helpers.replaceNode(button),
	        props: _objectSpread2(_objectSpread2({}, store), {}, {
	          deleteTimeEntryUuid: button.getAttribute("data-uuid"),
	          requestToken: window.OC.requestToken
	        })
	      }));
	    });
	  }

	  var editTimeEntryButtons = document.querySelectorAll("#content.app-timemanager [data-svelte='EditTimeEntryButton.svelte']");

	  if (editTimeEntryButtons && editTimeEntryButtons.length > 0) {
	    editTimeEntryButtons.forEach(function (button) {
	      components.push(new TimeEditorDialog({
	        target: Helpers.replaceNode(button),
	        props: _objectSpread2(_objectSpread2({}, store), {}, {
	          timeUuid: button.getAttribute("data-uuid"),
	          editTimeEntryData: JSON.parse(button.getAttribute("data-edit-data")),
	          timeEditorButtonCaption: window.t("timemanager", "Edit"),
	          timeEditorCaption: window.t("timemanager", "Edit time entry"),
	          requestToken: window.OC.requestToken
	        })
	      }));
	    });
	  }

	  components.push(new QuickAdd({
	    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='QuickAdd.svelte']")),
	    props: _objectSpread2(_objectSpread2({}, store), {}, {
	      requestToken: window.OC.requestToken
	    })
	  }));
	  var checkmarkButtons = document.querySelectorAll("#content.app-timemanager [data-svelte='Checkmark.svelte']");

	  if (checkmarkButtons && checkmarkButtons.length > 0) {
	    checkmarkButtons.forEach(function (button) {
	      components.push(new Checkmark({
	        target: Helpers.replaceNode(button),
	        props: _objectSpread2(_objectSpread2({}, store), {}, {
	          uuid: button.getAttribute("data-uuid"),
	          action: button.getAttribute("data-action"),
	          initialState: button.getAttribute("data-initialState"),
	          requestToken: window.OC.requestToken
	        })
	      }));
	    });
	  }
	};

	init$1();
	components.push(new PagePjax(init$1));

}());
