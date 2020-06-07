(function () {
  'use strict';

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

  function noop() { }
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
  function insert(target, node, anchor) {
      target.insertBefore(node, anchor || null);
  }
  function detach(node) {
      node.parentNode.removeChild(node);
  }
  function element(name) {
      return document.createElement(name);
  }
  function attr(node, attribute, value) {
      if (value == null)
          node.removeAttribute(attribute);
      else if (node.getAttribute(attribute) !== value)
          node.setAttribute(attribute, value);
  }
  function children(element) {
      return Array.from(element.childNodes);
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
  function transition_in(block, local) {
      if (block && block.i) {
          outroing.delete(block);
          block.i(local);
      }
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
    }]);

    return Helpers;
  }();

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

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
  components.push(new Statistics({
    target: Helpers.replaceNode(document.querySelector("#content.app-timemanager [data-svelte='statistics']")),
    props: {}
  }));
  components.push(new PagePjax(function () {}));

}());
