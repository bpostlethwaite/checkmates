;(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({1:[function(require,module,exports){
var CheckMate = require('./')

var result = document.querySelector('#result')
  , checks = document.querySelector('#checks')
  , checkgroup = []

/*
 * Build 5 checkboxes in a group
 */
var checker = CheckMate("groupA")

var i, check
var checked = true
for (i = 0; i < 5; i++) {
  check = checker.checkbox( 'value-' + i )
  checks.appendChild(check)
}

/*
 * Set Master
 */
var master = checker.master( 'value-master' )

checks.insertBefore(master, checks.childNodes[0])


/*
 * Set some eventhandling
 */
checker.on( 'checked', function (checkValue) {
  result.innerText = "checkbox " + checkValue + " checked"
})

checker.on( 'unchecked', function (checkValue) {
  result.innerText = "checkbox " + checkValue + " unchecked"
})

checker.on( 'all-checked', function () {
  result.innerText = "all checkboxes checked"
})

checker.on( 'all-unchecked', function () {
  result.innerText = "all checkboxes unchecked"
})
},{"./":2}],2:[function(require,module,exports){
/*
 * CHECKMATES
 *
 * Ben Postlethwaite
 * 2013
 *
 * License MIT
 */

"use strict";

var EventEmitter = require('events').EventEmitter

module.exports = CheckMates


function CheckMates (groupID) {

  var group = new EventEmitter
    , checked = {}
    , checkmates = []

  function checkbox(value) {
    /*
     * Tie to DOM
     */
    var self = document.createElement('input')
    self.type = "checkbox"
    self.value = value
    self.className = groupID

    self.onclick = function () {
      if (self.checked) {
        checked[self.value] = self
        group.emit('checked', self.value)
      }  else {
        delete checked[self.value]
        group.emit('unchecked', self.value)
      }
      updateState()
    }

    checkmates.push(self)
    return self
  }

  function master(value) {
    var self = checkbox(value)
    self.onclick = function () {
      if (group.master.indeterminate) {
        /*
         * Clicked while indeterminate:
         * Uncheck all boxes
         */
        group.emit('unchecked', self.value)
        uncheckAll()
      } else if (group.master.checked) {
        /*
         * Wasn't indeterminate and is now checked:
         * Check all checkboxes
         */
        group.emit('checked', self.value)
        checkAll()
      } else {
        /*
         * Wasn't indeterminate but is now unchecked:
         * Uncheck all boxes
         */
        group.emit('unchecked', self.value)
        uncheckAll()
      }
    }
    group.master = self

    return self
  }

  function updateState () {
    if (Object.keys(checked).length === checkmates.length) {
      group.master.indeterminate = false
      group.master.checked = true
      group.emit('all-checked', true)
    }
    else if (Object.keys(checked).length === 0) {
      group.master.indeterminate = false
      group.master.checked = false
      group.emit('all-unchecked', true)
    }
    else {
      group.master.checked = true
      group.master.indeterminate = true
    }
  }

  function checkAll () {
    checkmates.forEach( function (checkbox) {
      checkbox.checked = true
      checked[checkbox.value] = checkbox
    })
    updateState()
  }

  function uncheckAll () {
    Object.keys(checked).forEach( function (key) {
      checked[key].checked = false
      delete checked[key]
    })
    updateState()
  }

  function removeAll () {
    uncheckAll()
    checkmates = []
  }

  group.removeAll = removeAll
  group.uncheckAll = uncheckAll
  group.checkAll = checkAll
  group.checkmates = checkmates
  group.checked = checked
  group.checkbox = checkbox
  group.master = master

  return group

}

},{"events":3}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],3:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":4}]},{},[1])
;