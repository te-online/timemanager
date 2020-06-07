(function () {
  'use strict';

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

  function ownKeys(object, enumerableOnly) {
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
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
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

  function noop() { }
  function assign(tar, src) {
      // @ts-ignore
      for (const k in src)
          tar[k] = src[k];
      return tar;
  }
  function run(fn) {
      return fn();
  }
  function blank_object() {
      return Object.create(null);
  }
  function run_all(fns) {
      fns.forEach(run);
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

  let current_component;
  function set_current_component(component) {
      current_component = component;
  }
  function get_current_component() {
      if (!current_component)
          throw new Error(`Function called outside component initialization`);
      return current_component;
  }
  function onMount(fn) {
      get_current_component().$$.on_mount.push(fn);
  }
  function onDestroy(fn) {
      get_current_component().$$.on_destroy.push(fn);
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
          resolved_promise.then(flush);
      }
  }
  function add_render_callback(fn) {
      render_callbacks.push(fn);
  }
  let flushing = false;
  const seen_callbacks = new Set();
  function flush() {
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
  function create_component(block) {
      block && block.c();
  }
  function mount_component(component, target, anchor) {
      const { fragment, on_mount, on_destroy, after_update } = component.$$;
      fragment && fragment.m(target, anchor);
      // onMount happens before the initial afterUpdate
      add_render_callback(() => {
          const new_on_destroy = on_mount.map(run).filter(is_function);
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
          flush();
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

  function create_fragment(ctx) {
    var section;
    return {
      c() {
        section = element("section");
        section.innerHTML = "<p>Coming soon</p>";
        attr(section, "class", "section");
      },

      m(target, anchor) {
        insert(target, section, anchor);
      },

      p: noop,
      i: noop,
      o: noop,

      d(detaching) {
        if (detaching) detach(section);
      }

    };
  }

  function instance($$self) {
    onMount(function () {
      // Subscribe to changes of the viewmode
      console.log("Mount");
    });
    onDestroy(function () {
      // Unsubscribe from store to avoid memory leaks
      console.log("Unmount");
    });
    return [];
  }

  var Statistics = /*#__PURE__*/function (_SvelteComponent) {
    _inherits(Statistics, _SvelteComponent);

    var _super = _createSuper(Statistics);

    function Statistics(options) {
      var _this;

      _classCallCheck(this, Statistics);

      _this = _super.call(this);
      init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
      return _this;
    }

    return Statistics;
  }(SvelteComponent);

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

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
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

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    }

    return it;
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

  var nativeDefineProperty = Object.defineProperty; // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty

  var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
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

  var shared = createCommonjsModule(function (module) {
  (module.exports = function (key, value) {
    return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.6.5',
    mode:  'global',
    copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
  });
  });

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var id = 0;
  var postfix = Math.random();

  var uid = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
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

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');
  var test = {};
  test[TO_STRING_TAG] = 'z';
  var toStringTagSupport = String(test) === '[object z]';

  var functionToString = Function.toString; // this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper

  if (typeof sharedStore.inspectSource != 'function') {
    sharedStore.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource = sharedStore.inspectSource;

  var WeakMap = global_1.WeakMap;
  var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

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

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

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

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // Nashorn ~ JDK8 bug

  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({
    1: 2
  }, 1); // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable

  var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$1
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

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor; // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor

  var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
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
  	f: f$2
  };

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


  var ownKeys$1 = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = objectGetOwnPropertyNames.f(anObject(it));
    var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var copyConstructorProperties = function (target, source) {
    var keys = ownKeys$1(source);
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

  var nativePromiseConstructor = global_1.Promise;

  var redefineAll = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);

    return target;
  };

  var defineProperty = objectDefineProperty.f;





  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC) {
    if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
      defineProperty(it, TO_STRING_TAG$2, {
        configurable: true,
        value: TAG
      });
    }
  };

  var SPECIES = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES]) {
      defineProperty(Constructor, SPECIES, {
        configurable: true,
        get: function () {
          return this;
        }
      });
    }
  };

  var aFunction$1 = function (it) {
    if (typeof it != 'function') {
      throw TypeError(String(it) + ' is not a function');
    }

    return it;
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

  var SPECIES$1 = wellKnownSymbol('species'); // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor

  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$1]) == undefined ? defaultConstructor : aFunction$1(S);
  };

  var html = getBuiltIn('document', 'documentElement');

  var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

  var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  var location$1 = global_1.location;
  var set$1 = global_1.setImmediate;
  var clear = global_1.clearImmediate;
  var process = global_1.process;
  var MessageChannel = global_1.MessageChannel;
  var Dispatch = global_1.Dispatch;
  var counter = 0;
  var queue = {};
  var ONREADYSTATECHANGE = 'onreadystatechange';
  var defer, channel, port;

  var run$1 = function (id) {
    // eslint-disable-next-line no-prototype-builtins
    if (queue.hasOwnProperty(id)) {
      var fn = queue[id];
      delete queue[id];
      fn();
    }
  };

  var runner = function (id) {
    return function () {
      run$1(id);
    };
  };

  var listener = function (event) {
    run$1(event.data);
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


    if (classofRaw(process) == 'process') {
      defer = function (id) {
        process.nextTick(runner(id));
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
          run$1(id);
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
  var process$1 = global_1.process;
  var Promise$1 = global_1.Promise;
  var IS_NODE = classofRaw(process$1) == 'process'; // Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`

  var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
  var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;
  var flush$1, head, last, notify, toggle, node, promise, then; // modern engines have queueMicrotask method

  if (!queueMicrotask) {
    flush$1 = function () {
      var parent, fn;
      if (IS_NODE && (parent = process$1.domain)) parent.exit();

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
        process$1.nextTick(flush$1);
      }; // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339

    } else if (MutationObserver && !engineIsIos) {
      toggle = true;
      node = document.createTextNode('');
      new MutationObserver(flush$1).observe(node, {
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
        then.call(promise, flush$1);
      }; // for other environments - macrotask based on:
      // - setImmediate
      // - MessageChannel
      // - window.postMessag
      // - onreadystatechange
      // - setTimeout

    } else {
      notify = function () {
        // strange IE + webpack dev server bug - use .call(global)
        macrotask.call(global_1, flush$1);
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

  var process$2 = global_1.process;
  var versions = process$2 && process$2.versions;
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

  var task$1 = task.set;



















  var SPECIES$2 = wellKnownSymbol('species');
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
  var FORCED = isForced_1(PROMISE, function () {
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
    constructor[SPECIES$2] = FakePromise;
    return !(promise.then(function () {
      /* empty */
    }) instanceof FakePromise);
  });
  var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
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


  if (FORCED) {
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
    forced: FORCED
  }, {
    Promise: PromiseConstructor
  });
  setToStringTag(PromiseConstructor, PROMISE, false);
  setSpecies(PROMISE);
  PromiseWrapper = getBuiltIn(PROMISE); // statics

  _export({
    target: PROMISE,
    stat: true,
    forced: FORCED
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
    forced:  FORCED
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

  function create_if_block(ctx) {
    var button;
    var mounted;
    var dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Cancel";
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
    var t1;
    var form;
    var label0;
    var t2;
    var br0;
    var t3;
    var input0;
    var t4;
    var label1;
    var t5;
    var br1;
    var t6;
    var textarea;
    var t7;
    var input1;
    var t8;
    var div0;
    var t9;
    var button;
    var mounted;
    var dispose;
    var if_block = !
    /*isServer*/
    ctx[2] && create_if_block(ctx);
    return {
      c() {
        div1 = element("div");
        h3 = element("h3");
        h3.textContent = "New client";
        t1 = space();
        form = element("form");
        label0 = element("label");
        t2 = text("Client name\n\t\t\t");
        br0 = element("br");
        t3 = space();
        input0 = element("input");
        t4 = space();
        label1 = element("label");
        t5 = text("Note\n\t\t\t");
        br1 = element("br");
        t6 = space();
        textarea = element("textarea");
        t7 = space();
        input1 = element("input");
        t8 = space();
        div0 = element("div");
        if (if_block) if_block.c();
        t9 = space();
        button = element("button");
        button.textContent = "Add client";
        input0.autofocus = true;
        attr(input0, "type", "text");
        set_style(input0, "width", "100%");
        attr(input0, "class", "input-wide");
        attr(input0, "name", "name");
        attr(input0, "placeholder", "Example Corp.");
        input0.required = true;
        attr(label0, "class", "space-top");
        set_style(textarea, "width", "100%");
        attr(textarea, "class", "input-wide");
        attr(textarea, "name", "note");
        attr(textarea, "placeholder", "A long text ...");
        textarea.value =
        /*note*/
        ctx[5];
        attr(label1, "class", "space-top");
        attr(input1, "type", "hidden");
        attr(input1, "name", "requesttoken");
        input1.value =
        /*requestToken*/
        ctx[1];
        attr(button, "type", "submit");
        attr(button, "class", "button primary");
        attr(div0, "class", "oc-dialog-buttonrow twobuttons");
        attr(form, "action",
        /*action*/
        ctx[0]);
        attr(form, "method", "post");
        attr(div1, "class", "inner tm_new-item");
      },

      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, h3);
        append(div1, t1);
        append(div1, form);
        append(form, label0);
        append(label0, t2);
        append(label0, br0);
        append(label0, t3);
        append(label0, input0);
        set_input_value(input0,
        /*name*/
        ctx[4]);
        append(form, t4);
        append(form, label1);
        append(label1, t5);
        append(label1, br1);
        append(label1, t6);
        append(label1, textarea);
        append(form, t7);
        append(form, input1);
        append(form, t8);
        append(form, div0);
        if (if_block) if_block.m(div0, null);
        append(div0, t9);
        append(div0, button);
        input0.focus();

        if (!mounted) {
          dispose = [listen(input0, "input",
          /*input0_input_handler*/
          ctx[8]), listen(textarea, "input",
          /*input_handler*/
          ctx[9]), listen(form, "submit", prevent_default(
          /*submit*/
          ctx[6]))];
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (dirty &
        /*name*/
        16 && input0.value !==
        /*name*/
        ctx[4]) {
          set_input_value(input0,
          /*name*/
          ctx[4]);
        }

        if (dirty &
        /*note*/
        32) {
          textarea.value =
          /*note*/
          ctx[5];
        }

        if (dirty &
        /*requestToken*/
        2) {
          input1.value =
          /*requestToken*/
          ctx[1];
        }

        if (!
        /*isServer*/
        ctx[2]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block(ctx);
            if_block.c();
            if_block.m(div0, t9);
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
    var name;
    var note = "";

    var submit = function submit() {
      onSubmit({
        name,
        note
      });
    };

    function input0_input_handler() {
      name = this.value;
      $$invalidate(4, name);
    }

    var input_handler = function input_handler(e) {
      return $$invalidate(5, note = e.target.value);
    };

    $$self.$set = function ($$props) {
      if ("action" in $$props) $$invalidate(0, action = $$props.action);
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("isServer" in $$props) $$invalidate(2, isServer = $$props.isServer);
      if ("onCancel" in $$props) $$invalidate(3, onCancel = $$props.onCancel);
      if ("onSubmit" in $$props) $$invalidate(7, onSubmit = $$props.onSubmit);
    };

    return [action, requestToken, isServer, onCancel, name, note, submit, onSubmit, input0_input_handler, input_handler];
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
        onSubmit: 7
      });
      return _this;
    }

    return ClientEditor;
  }(SvelteComponent);

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

  var SPECIES$3 = wellKnownSymbol('species'); // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate

  var arraySpeciesCreate = function (originalArray, length) {
    var C;

    if (isArray(originalArray)) {
      C = originalArray.constructor; // cross-realm fallback

      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;else if (isObject(C)) {
        C = C[SPECIES$3];
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

  var defineProperty$1 = Object.defineProperty;
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
      if (ACCESSORS) defineProperty$1(O, 1, {
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

  function create_if_block$1(ctx) {
    var current;
    var overlay = new Overlay({
      props: {
        loading:
        /*loading*/
        ctx[3],
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
        8) overlay_changes.loading =
        /*loading*/
        ctx[3];

        if (dirty &
        /*$$scope, action, requestToken, show*/
        135) {
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
  } // (43:1) <Overlay {loading}>


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
        ctx[6],
        onSubmit:
        /*save*/
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
        4) clienteditor_changes.onCancel =
        /*func*/
        ctx[6];
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
    var t1;
    var if_block_anchor;
    var current;
    var mounted;
    var dispose;
    var if_block =
    /*show*/
    ctx[2] && create_if_block$1(ctx);
    return {
      c() {
        a = element("a");
        a.innerHTML = "<span>Add client</span>";
        t1 = space();
        if (if_block) if_block.c();
        if_block_anchor = empty();
        attr(a, "href", "#/");
        attr(a, "class", "button primary new");
      },

      m(target, anchor) {
        insert(target, a, anchor);
        insert(target, t1, anchor);
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;

        if (!mounted) {
          dispose = listen(a, "click", prevent_default(
          /*click_handler*/
          ctx[5]));
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (
        /*show*/
        ctx[2]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty &
            /*show*/
            4) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$1(ctx);
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
    var requestToken = $$props.requestToken;
    onMount(function () {
      Helpers.hideFallbacks("ClientEditor.svelte");
    });

    var save = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
        var name, note, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                name = _ref4.name, note = _ref4.note;
                $$invalidate(3, loading = true);
                _context.prev = 2;
                _context.next = 5;
                return fetch(window.location.href, {
                  method: "POST",
                  body: JSON.stringify({
                    name,
                    note
                  }),
                  headers: {
                    requesttoken: requestToken,
                    "content-type": "application/json"
                  }
                });

              case 5:
                response = _context.sent;

                if (response && response.ok) {
                  $$invalidate(2, show = false);
                  document.querySelector("#app-navigation a.active").click();
                }

                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 12:
                $$invalidate(3, loading = false);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
      }));

      return function save(_x) {
        return _ref3.apply(this, arguments);
      };
    }();

    var click_handler = function click_handler() {
      return $$invalidate(2, show = !show);
    };

    var func = function func() {
      return $$invalidate(2, show = false);
    };

    $$self.$set = function ($$props) {
      if ("action" in $$props) $$invalidate(0, action = $$props.action);
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
    };

    var show;
    var loading;

     $$invalidate(2, show = false);

     $$invalidate(3, loading = false);

    return [action, requestToken, show, loading, save, click_handler, func];
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
        requestToken: 1
      });
      return _this;
    }

    return ClientEditorDialog;
  }(SvelteComponent);

  function create_if_block$2(ctx) {
    var button;
    var mounted;
    var dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Cancel";
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
    var t1;
    var form;
    var label0;
    var t2;
    var br0;
    var t3;
    var input0;
    var t4;
    var label1;
    var t5;
    var br1;
    var t6;
    var strong;
    var t7;
    var t8;
    var br2;
    var t9;
    var input1;
    var t10;
    var div0;
    var t11;
    var button;
    var mounted;
    var dispose;
    var if_block = !
    /*isServer*/
    ctx[3] && create_if_block$2(ctx);
    return {
      c() {
        div1 = element("div");
        h3 = element("h3");
        h3.textContent = "New project";
        t1 = space();
        form = element("form");
        label0 = element("label");
        t2 = text("Project name\n\t\t\t");
        br0 = element("br");
        t3 = space();
        input0 = element("input");
        t4 = space();
        label1 = element("label");
        t5 = text("For client\n\t\t\t");
        br1 = element("br");
        t6 = space();
        strong = element("strong");
        t7 = text(
        /*clientName*/
        ctx[2]);
        t8 = space();
        br2 = element("br");
        t9 = space();
        input1 = element("input");
        t10 = space();
        div0 = element("div");
        if (if_block) if_block.c();
        t11 = space();
        button = element("button");
        button.textContent = "Add project";
        input0.autofocus = true;
        attr(input0, "type", "text");
        set_style(input0, "width", "100%");
        attr(input0, "class", "input-wide");
        attr(input0, "name", "name");
        attr(input0, "placeholder", "Very special project");
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
        attr(div0, "class", "oc-dialog-buttonrow twobuttons");
        attr(form, "action",
        /*action*/
        ctx[0]);
        attr(form, "method", "post");
        attr(div1, "class", "inner tm_new-item");
      },

      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, h3);
        append(div1, t1);
        append(div1, form);
        append(form, label0);
        append(label0, t2);
        append(label0, br0);
        append(label0, t3);
        append(label0, input0);
        set_input_value(input0,
        /*name*/
        ctx[5]);
        append(form, t4);
        append(form, label1);
        append(label1, t5);
        append(label1, br1);
        append(label1, t6);
        append(label1, strong);
        append(strong, t7);
        append(form, t8);
        append(form, br2);
        append(form, t9);
        append(form, input1);
        append(form, t10);
        append(form, div0);
        if (if_block) if_block.m(div0, null);
        append(div0, t11);
        append(div0, button);
        input0.focus();

        if (!mounted) {
          dispose = [listen(input0, "input",
          /*input0_input_handler*/
          ctx[8]), listen(form, "submit", prevent_default(
          /*submit*/
          ctx[6]))];
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (dirty &
        /*name*/
        32 && input0.value !==
        /*name*/
        ctx[5]) {
          set_input_value(input0,
          /*name*/
          ctx[5]);
        }

        if (dirty &
        /*clientName*/
        4) set_data(t7,
        /*clientName*/
        ctx[2]);

        if (dirty &
        /*requestToken*/
        2) {
          input1.value =
          /*requestToken*/
          ctx[1];
        }

        if (!
        /*isServer*/
        ctx[3]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$2(ctx);
            if_block.c();
            if_block.m(div0, t11);
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
    var name;

    var submit = function submit() {
      onSubmit({
        name
      });
    };

    function input0_input_handler() {
      name = this.value;
      $$invalidate(5, name);
    }

    $$self.$set = function ($$props) {
      if ("action" in $$props) $$invalidate(0, action = $$props.action);
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
      if ("isServer" in $$props) $$invalidate(3, isServer = $$props.isServer);
      if ("onCancel" in $$props) $$invalidate(4, onCancel = $$props.onCancel);
      if ("onSubmit" in $$props) $$invalidate(7, onSubmit = $$props.onSubmit);
    };

    return [action, requestToken, clientName, isServer, onCancel, name, submit, onSubmit, input0_input_handler];
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
        onSubmit: 7
      });
      return _this;
    }

    return ProjectEditor;
  }(SvelteComponent);

  function create_if_block$3(ctx) {
    var current;
    var overlay = new Overlay({
      props: {
        loading:
        /*loading*/
        ctx[5],
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
        32) overlay_changes.loading =
        /*loading*/
        ctx[5];

        if (dirty &
        /*$$scope, action, requestToken, show, clientName, isServer*/
        543) {
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
  } // (45:1) <Overlay {loading}>


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
        ctx[8],
        onSubmit:
        /*save*/
        ctx[6],
        clientName:
        /*clientName*/
        ctx[2],
        isServer:
        /*isServer*/
        ctx[3]
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
        16) projecteditor_changes.onCancel =
        /*func*/
        ctx[8];
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
    var t1;
    var if_block_anchor;
    var current;
    var mounted;
    var dispose;
    var if_block =
    /*show*/
    ctx[4] && create_if_block$3(ctx);
    return {
      c() {
        a = element("a");
        a.innerHTML = "<span>Add project</span>";
        t1 = space();
        if (if_block) if_block.c();
        if_block_anchor = empty();
        attr(a, "href", "#/");
        attr(a, "class", "button primary new");
      },

      m(target, anchor) {
        insert(target, a, anchor);
        insert(target, t1, anchor);
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;

        if (!mounted) {
          dispose = listen(a, "click", prevent_default(
          /*click_handler*/
          ctx[7]));
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (
        /*show*/
        ctx[4]) {
          if (if_block) {
            if_block.p(ctx, dirty);

            if (dirty &
            /*show*/
            16) {
              transition_in(if_block, 1);
            }
          } else {
            if_block = create_if_block$3(ctx);
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
    var requestToken = $$props.requestToken;
    var clientName = $$props.clientName;
    var isServer = $$props.isServer;
    onMount(function () {
      Helpers.hideFallbacks("ProjectEditor.svelte");
    });

    var save = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
        var name, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                name = _ref4.name;
                $$invalidate(5, loading = true);
                _context.prev = 2;
                _context.next = 5;
                return fetch(action, {
                  method: "POST",
                  body: JSON.stringify({
                    name
                  }),
                  headers: {
                    requesttoken: requestToken,
                    "content-type": "application/json"
                  }
                });

              case 5:
                response = _context.sent;

                if (response && response.ok) {
                  $$invalidate(4, show = false);
                  document.querySelector(".app-timemanager [data-current-link]").click();
                }

                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 12:
                $$invalidate(5, loading = false);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
      }));

      return function save(_x) {
        return _ref3.apply(this, arguments);
      };
    }();

    var click_handler = function click_handler() {
      return $$invalidate(4, show = !show);
    };

    var func = function func() {
      return $$invalidate(4, show = false);
    };

    $$self.$set = function ($$props) {
      if ("action" in $$props) $$invalidate(0, action = $$props.action);
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
      if ("isServer" in $$props) $$invalidate(3, isServer = $$props.isServer);
    };

    var show;
    var loading;

     $$invalidate(4, show = false);

     $$invalidate(5, loading = false);

    return [action, requestToken, clientName, isServer, show, loading, save, click_handler, func];
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
        requestToken: 1,
        clientName: 2,
        isServer: 3
      });
      return _this;
    }

    return ProjectEditorDialog;
  }(SvelteComponent);

  function create_if_block$4(ctx) {
    var button;
    var mounted;
    var dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Cancel";
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
    var t1;
    var form;
    var label0;
    var t2;
    var br0;
    var t3;
    var input0;
    var t4;
    var label1;
    var t5;
    var br1;
    var t6;
    var strong0;
    var t7;
    var t8;
    var label2;
    var t9;
    var br2;
    var t10;
    var strong1;
    var t11;
    var t12;
    var br3;
    var t13;
    var input1;
    var t14;
    var div0;
    var t15;
    var button;
    var mounted;
    var dispose;
    var if_block = !
    /*isServer*/
    ctx[4] && create_if_block$4(ctx);
    return {
      c() {
        div1 = element("div");
        h3 = element("h3");
        h3.textContent = "New task";
        t1 = space();
        form = element("form");
        label0 = element("label");
        t2 = text("Task name\n\t\t\t");
        br0 = element("br");
        t3 = space();
        input0 = element("input");
        t4 = space();
        label1 = element("label");
        t5 = text("For project\n\t\t\t");
        br1 = element("br");
        t6 = space();
        strong0 = element("strong");
        t7 = text(
        /*projectName*/
        ctx[3]);
        t8 = space();
        label2 = element("label");
        t9 = text("For client\n\t\t\t");
        br2 = element("br");
        t10 = space();
        strong1 = element("strong");
        t11 = text(
        /*clientName*/
        ctx[2]);
        t12 = space();
        br3 = element("br");
        t13 = space();
        input1 = element("input");
        t14 = space();
        div0 = element("div");
        if (if_block) if_block.c();
        t15 = space();
        button = element("button");
        button.textContent = "Add task";
        input0.autofocus = true;
        attr(input0, "type", "text");
        set_style(input0, "width", "100%");
        attr(input0, "class", "input-wide");
        attr(input0, "name", "name");
        attr(input0, "placeholder", "Very special task");
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
        attr(div0, "class", "oc-dialog-buttonrow twobuttons");
        attr(form, "action",
        /*action*/
        ctx[0]);
        attr(form, "method", "post");
        attr(div1, "class", "inner tm_new-item");
      },

      m(target, anchor) {
        insert(target, div1, anchor);
        append(div1, h3);
        append(div1, t1);
        append(div1, form);
        append(form, label0);
        append(label0, t2);
        append(label0, br0);
        append(label0, t3);
        append(label0, input0);
        set_input_value(input0,
        /*name*/
        ctx[6]);
        append(form, t4);
        append(form, label1);
        append(label1, t5);
        append(label1, br1);
        append(label1, t6);
        append(label1, strong0);
        append(strong0, t7);
        append(form, t8);
        append(form, label2);
        append(label2, t9);
        append(label2, br2);
        append(label2, t10);
        append(label2, strong1);
        append(strong1, t11);
        append(form, t12);
        append(form, br3);
        append(form, t13);
        append(form, input1);
        append(form, t14);
        append(form, div0);
        if (if_block) if_block.m(div0, null);
        append(div0, t15);
        append(div0, button);
        input0.focus();

        if (!mounted) {
          dispose = [listen(input0, "input",
          /*input0_input_handler*/
          ctx[9]), listen(form, "submit", prevent_default(
          /*submit*/
          ctx[7]))];
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

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
        /*projectName*/
        8) set_data(t7,
        /*projectName*/
        ctx[3]);
        if (dirty &
        /*clientName*/
        4) set_data(t11,
        /*clientName*/
        ctx[2]);

        if (dirty &
        /*requestToken*/
        2) {
          input1.value =
          /*requestToken*/
          ctx[1];
        }

        if (!
        /*isServer*/
        ctx[4]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$4(ctx);
            if_block.c();
            if_block.m(div0, t15);
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
    var name;

    var submit = function submit() {
      onSubmit({
        name
      });
    };

    function input0_input_handler() {
      name = this.value;
      $$invalidate(6, name);
    }

    $$self.$set = function ($$props) {
      if ("action" in $$props) $$invalidate(0, action = $$props.action);
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
      if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
      if ("isServer" in $$props) $$invalidate(4, isServer = $$props.isServer);
      if ("onCancel" in $$props) $$invalidate(5, onCancel = $$props.onCancel);
      if ("onSubmit" in $$props) $$invalidate(8, onSubmit = $$props.onSubmit);
    };

    return [action, requestToken, clientName, projectName, isServer, onCancel, name, submit, onSubmit, input0_input_handler];
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
        onSubmit: 8
      });
      return _this;
    }

    return TaskEditor;
  }(SvelteComponent);

  function create_if_block$5(ctx) {
    var current;
    var overlay = new Overlay({
      props: {
        loading:
        /*loading*/
        ctx[6],
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
        64) overlay_changes.loading =
        /*loading*/
        ctx[6];

        if (dirty &
        /*$$scope, action, requestToken, show, clientName, projectName, isServer*/
        1087) {
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
  } // (46:1) <Overlay {loading}>


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
        ctx[9],
        onSubmit:
        /*save*/
        ctx[7],
        clientName:
        /*clientName*/
        ctx[2],
        projectName:
        /*projectName*/
        ctx[3],
        isServer:
        /*isServer*/
        ctx[4]
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
        32) taskeditor_changes.onCancel =
        /*func*/
        ctx[9];
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
    var t1;
    var if_block_anchor;
    var current;
    var mounted;
    var dispose;
    var if_block =
    /*show*/
    ctx[5] && create_if_block$5(ctx);
    return {
      c() {
        a = element("a");
        a.innerHTML = "<span>Add task</span>";
        t1 = space();
        if (if_block) if_block.c();
        if_block_anchor = empty();
        attr(a, "href", "#/");
        attr(a, "class", "button primary new");
      },

      m(target, anchor) {
        insert(target, a, anchor);
        insert(target, t1, anchor);
        if (if_block) if_block.m(target, anchor);
        insert(target, if_block_anchor, anchor);
        current = true;

        if (!mounted) {
          dispose = listen(a, "click", prevent_default(
          /*click_handler*/
          ctx[8]));
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

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
            if_block = create_if_block$5(ctx);
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
    var requestToken = $$props.requestToken;
    var clientName = $$props.clientName;
    var projectName = $$props.projectName;
    var isServer = $$props.isServer;
    onMount(function () {
      Helpers.hideFallbacks("TaskEditor.svelte");
    });

    var save = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
        var name, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                name = _ref4.name;
                $$invalidate(6, loading = true);
                _context.prev = 2;
                _context.next = 5;
                return fetch(action, {
                  method: "POST",
                  body: JSON.stringify({
                    name
                  }),
                  headers: {
                    requesttoken: requestToken,
                    "content-type": "application/json"
                  }
                });

              case 5:
                response = _context.sent;

                if (response && response.ok) {
                  $$invalidate(5, show = false);
                  document.querySelector(".app-timemanager [data-current-link]").click();
                }

                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 12:
                $$invalidate(6, loading = false);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
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
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
      if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
      if ("isServer" in $$props) $$invalidate(4, isServer = $$props.isServer);
    };

    var show;
    var loading;

     $$invalidate(5, show = false);

     $$invalidate(6, loading = false);

    return [action, requestToken, clientName, projectName, isServer, show, loading, save, click_handler, func];
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
        requestToken: 1,
        clientName: 2,
        projectName: 3,
        isServer: 4
      });
      return _this;
    }

    return TaskEditorDialog;
  }(SvelteComponent);

  function create_if_block$6(ctx) {
    var button;
    var mounted;
    var dispose;
    return {
      c() {
        button = element("button");
        button.textContent = "Cancel";
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
    var t1;
    var form;
    var label0;
    var t2;
    var br0;
    var t3;
    var input0;
    var t4;
    var br1;
    var t5;
    var label1;
    var t6;
    var br2;
    var t7;
    var input1;
    var t8;
    var br3;
    var t9;
    var label2;
    var t10;
    var br4;
    var t11;
    var textarea;
    var t12;
    var br5;
    var t13;
    var label3;
    var t14;
    var br6;
    var t15;
    var strong0;
    var t16;
    var t17;
    var label4;
    var t18;
    var br7;
    var t19;
    var strong1;
    var t20;
    var t21;
    var label5;
    var t22;
    var br8;
    var t23;
    var strong2;
    var t24;
    var t25;
    var br9;
    var t26;
    var input2;
    var t27;
    var div0;
    var button;
    var t29;
    var mounted;
    var dispose;
    var if_block = !
    /*isServer*/
    ctx[5] && create_if_block$6(ctx);
    return {
      c() {
        div1 = element("div");
        h3 = element("h3");
        h3.textContent = "New time entry";
        t1 = space();
        form = element("form");
        label0 = element("label");
        t2 = text("Duration (in hrs.)\n\t\t\t");
        br0 = element("br");
        t3 = space();
        input0 = element("input");
        t4 = space();
        br1 = element("br");
        t5 = space();
        label1 = element("label");
        t6 = text("Date\n\t\t\t");
        br2 = element("br");
        t7 = space();
        input1 = element("input");
        t8 = space();
        br3 = element("br");
        t9 = space();
        label2 = element("label");
        t10 = text("Note\n\t\t\t");
        br4 = element("br");
        t11 = space();
        textarea = element("textarea");
        t12 = space();
        br5 = element("br");
        t13 = space();
        label3 = element("label");
        t14 = text("For task\n\t\t\t");
        br6 = element("br");
        t15 = space();
        strong0 = element("strong");
        t16 = text(
        /*taskName*/
        ctx[4]);
        t17 = space();
        label4 = element("label");
        t18 = text("For project\n\t\t\t");
        br7 = element("br");
        t19 = space();
        strong1 = element("strong");
        t20 = text(
        /*projectName*/
        ctx[3]);
        t21 = space();
        label5 = element("label");
        t22 = text("For client\n\t\t\t");
        br8 = element("br");
        t23 = space();
        strong2 = element("strong");
        t24 = text(
        /*clientName*/
        ctx[2]);
        t25 = space();
        br9 = element("br");
        t26 = space();
        input2 = element("input");
        t27 = space();
        div0 = element("div");
        button = element("button");
        button.textContent = "Add time entry";
        t29 = space();
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
        attr(textarea, "placeholder", "A long text ...");
        textarea.value =
        /*note*/
        ctx[9];
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
        append(div1, t1);
        append(div1, form);
        append(form, label0);
        append(label0, t2);
        append(label0, br0);
        append(label0, t3);
        append(label0, input0);
        set_input_value(input0,
        /*duration*/
        ctx[7]);
        append(form, t4);
        append(form, br1);
        append(form, t5);
        append(form, label1);
        append(label1, t6);
        append(label1, br2);
        append(label1, t7);
        append(label1, input1);
        set_input_value(input1,
        /*date*/
        ctx[8]);
        append(form, t8);
        append(form, br3);
        append(form, t9);
        append(form, label2);
        append(label2, t10);
        append(label2, br4);
        append(label2, t11);
        append(label2, textarea);
        append(form, t12);
        append(form, br5);
        append(form, t13);
        append(form, label3);
        append(label3, t14);
        append(label3, br6);
        append(label3, t15);
        append(label3, strong0);
        append(strong0, t16);
        append(form, t17);
        append(form, label4);
        append(label4, t18);
        append(label4, br7);
        append(label4, t19);
        append(label4, strong1);
        append(strong1, t20);
        append(form, t21);
        append(form, label5);
        append(label5, t22);
        append(label5, br8);
        append(label5, t23);
        append(label5, strong2);
        append(strong2, t24);
        append(form, t25);
        append(form, br9);
        append(form, t26);
        append(form, input2);
        append(form, t27);
        append(form, div0);
        append(div0, button);
        append(div0, t29);
        if (if_block) if_block.m(div0, null);
        input0.focus();

        if (!mounted) {
          dispose = [listen(input0, "input",
          /*input0_input_handler*/
          ctx[13]), listen(input1, "input",
          /*input1_input_handler*/
          ctx[14]), listen(textarea, "input",
          /*input_handler*/
          ctx[15]), listen(form, "submit", prevent_default(
          /*submit*/
          ctx[10]))];
          mounted = true;
        }
      },

      p(ctx, _ref) {
        var _ref2 = _slicedToArray(_ref, 1),
            dirty = _ref2[0];

        if (dirty &
        /*duration*/
        128 && to_number(input0.value) !==
        /*duration*/
        ctx[7]) {
          set_input_value(input0,
          /*duration*/
          ctx[7]);
        }

        if (dirty &
        /*date*/
        256) {
          set_input_value(input1,
          /*date*/
          ctx[8]);
        }

        if (dirty &
        /*note*/
        512) {
          textarea.value =
          /*note*/
          ctx[9];
        }

        if (dirty &
        /*taskName*/
        16) set_data(t16,
        /*taskName*/
        ctx[4]);
        if (dirty &
        /*projectName*/
        8) set_data(t20,
        /*projectName*/
        ctx[3]);
        if (dirty &
        /*clientName*/
        4) set_data(t24,
        /*clientName*/
        ctx[2]);

        if (dirty &
        /*requestToken*/
        2) {
          input2.value =
          /*requestToken*/
          ctx[1];
        }

        if (!
        /*isServer*/
        ctx[5]) {
          if (if_block) {
            if_block.p(ctx, dirty);
          } else {
            if_block = create_if_block$6(ctx);
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
    var duration;
    var date = initialDate;
    var note = "";

    var submit = function submit() {
      onSubmit({
        duration,
        date,
        note
      });
    };

    function input0_input_handler() {
      duration = to_number(this.value);
      $$invalidate(7, duration);
    }

    function input1_input_handler() {
      date = this.value;
      $$invalidate(8, date);
    }

    var input_handler = function input_handler(e) {
      return $$invalidate(9, note = e.target.value);
    };

    $$self.$set = function ($$props) {
      if ("action" in $$props) $$invalidate(0, action = $$props.action);
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
      if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
      if ("taskName" in $$props) $$invalidate(4, taskName = $$props.taskName);
      if ("initialDate" in $$props) $$invalidate(11, initialDate = $$props.initialDate);
      if ("isServer" in $$props) $$invalidate(5, isServer = $$props.isServer);
      if ("onCancel" in $$props) $$invalidate(6, onCancel = $$props.onCancel);
      if ("onSubmit" in $$props) $$invalidate(12, onSubmit = $$props.onSubmit);
    };

    return [action, requestToken, clientName, projectName, taskName, isServer, onCancel, duration, date, note, submit, initialDate, onSubmit, input0_input_handler, input1_input_handler, input_handler];
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
        initialDate: 11,
        isServer: 5,
        onCancel: 6,
        onSubmit: 12
      });
      return _this;
    }

    return TimeEditor;
  }(SvelteComponent);

  function create_if_block$7(ctx) {
    var current;
    var overlay = new Overlay({
      props: {
        loading:
        /*loading*/
        ctx[8],
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
        256) overlay_changes.loading =
        /*loading*/
        ctx[8];

        if (dirty &
        /*$$scope, action, requestToken, show, clientName, projectName, taskName, initialDate, isServer*/
        4351) {
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
  } // (48:1) <Overlay {loading}>


  function create_default_slot$3(ctx) {
    var current;
    var timeeditor = new TimeEditor({
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
        ctx[9],
        clientName:
        /*clientName*/
        ctx[2],
        projectName:
        /*projectName*/
        ctx[3],
        taskName:
        /*taskName*/
        ctx[4],
        initialDate:
        /*initialDate*/
        ctx[5],
        isServer:
        /*isServer*/
        ctx[6]
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
        2) timeeditor_changes.requestToken =
        /*requestToken*/
        ctx[1];
        if (dirty &
        /*show*/
        128) timeeditor_changes.onCancel =
        /*func*/
        ctx[11];
        if (dirty &
        /*clientName*/
        4) timeeditor_changes.clientName =
        /*clientName*/
        ctx[2];
        if (dirty &
        /*projectName*/
        8) timeeditor_changes.projectName =
        /*projectName*/
        ctx[3];
        if (dirty &
        /*taskName*/
        16) timeeditor_changes.taskName =
        /*taskName*/
        ctx[4];
        if (dirty &
        /*initialDate*/
        32) timeeditor_changes.initialDate =
        /*initialDate*/
        ctx[5];
        if (dirty &
        /*isServer*/
        64) timeeditor_changes.isServer =
        /*isServer*/
        ctx[6];
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
    var a;
    var t1;
    var if_block_anchor;
    var current;
    var mounted;
    var dispose;
    var if_block =
    /*show*/
    ctx[7] && create_if_block$7(ctx);
    return {
      c() {
        a = element("a");
        a.innerHTML = "<span>Add time entry</span>";
        t1 = space();
        if (if_block) if_block.c();
        if_block_anchor = empty();
        attr(a, "href", "#/");
        attr(a, "class", "button primary new");
      },

      m(target, anchor) {
        insert(target, a, anchor);
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
            if_block = create_if_block$7(ctx);
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

  function instance$9($$self, $$props, $$invalidate) {
    var action = $$props.action;
    var requestToken = $$props.requestToken;
    var clientName = $$props.clientName;
    var projectName = $$props.projectName;
    var taskName = $$props.taskName;
    var initialDate = $$props.initialDate;
    var isServer = $$props.isServer;
    onMount(function () {
      Helpers.hideFallbacks("TimeEditor.svelte");
    });

    var save = /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref4) {
        var duration, date, note, response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                duration = _ref4.duration, date = _ref4.date, note = _ref4.note;
                $$invalidate(8, loading = true);
                _context.prev = 2;
                _context.next = 5;
                return fetch(action, {
                  method: "POST",
                  body: JSON.stringify({
                    duration,
                    date,
                    note
                  }),
                  headers: {
                    requesttoken: requestToken,
                    "content-type": "application/json"
                  }
                });

              case 5:
                response = _context.sent;

                if (response && response.ok) {
                  $$invalidate(7, show = false);
                  document.querySelector(".app-timemanager [data-current-link]").click();
                }

                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](2);
                console.error(_context.t0);

              case 12:
                $$invalidate(8, loading = false);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 9]]);
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
      if ("requestToken" in $$props) $$invalidate(1, requestToken = $$props.requestToken);
      if ("clientName" in $$props) $$invalidate(2, clientName = $$props.clientName);
      if ("projectName" in $$props) $$invalidate(3, projectName = $$props.projectName);
      if ("taskName" in $$props) $$invalidate(4, taskName = $$props.taskName);
      if ("initialDate" in $$props) $$invalidate(5, initialDate = $$props.initialDate);
      if ("isServer" in $$props) $$invalidate(6, isServer = $$props.isServer);
    };

    var show;
    var loading;

     $$invalidate(7, show = false);

     $$invalidate(8, loading = false);

    return [action, requestToken, clientName, projectName, taskName, initialDate, isServer, show, loading, save, click_handler, func];
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
        requestToken: 1,
        clientName: 2,
        projectName: 3,
        taskName: 4,
        initialDate: 5,
        isServer: 6
      });
      return _this;
    }

    return TimeEditorDialog;
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
      target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='statistics']")),
      props: {}
    }));
    components.push(new ClientEditorDialog({
      target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='ClientEditorDialog.svelte']")),
      props: {
        action: "",
        requestToken: window.OC.requestToken
      }
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
  };

  init$1();
  components.push(new PagePjax(init$1));

}());
