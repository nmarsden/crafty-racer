/**
 * Qlass.js
 *
 * by: Jared Williams
 * http://anti-code.com
 *
 * A library for performing common classy functions on elements and collections. It
 * incorporates some techniques and practices used in jQuery that I could not find
 * a better way of doing what already is the best way possible it could be done.
 *
 * Simply select an element or elements and add/remove classes if it hasClass.
 * using the wrapper q(...).
 * ie: q(document.getElementsByTagName('div')).addClass('myClass').hasClass('myClass');
 */

(function() {
  var rClass = /[\n\t]/g,
    rSpace = /\s+/,
    rTrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,
    rNodeList = /^\[object (HTMLCollection|NodeList|Object)\]$/;

  function isNodeList(nodes) {
    var result = Object.prototype.toString.call(nodes);
    // Check if 'nodes' is a NodeList
    if (typeof nodes === 'object' && rNodeList.test(result) && nodes.hasOwnProperty('length') &&
      (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0))
      ) {
      return true;
    }
    return false;
  }

  // Constructor
  function Qlass(selector) {
    // Convert n to real array
    this.selector = selector;

    // if this isn't a null or empty object
    if (this.selector[0] && this.selector[0].length > 0) {

      // Make Array from NodeList or Element
      if (isNodeList(this.selector[0])) {
        this.selector = Array.prototype.slice.call(this.selector[0]);
      } else if (this.selector[0].nodeType === 1) {
        this.selector = Array.prototype.slice.call(this.selector);
      }
    }

    return this;
  }

  // Wrapper
  function q() {
    return new Qlass(arguments);
  }

  // Methods
  Qlass.prototype = {
    log: function() {
      console.log(this.selector);

      return this;
    },
    addClass: function(value) {
      if (value && typeof value === 'string') {
        var classNames = (value || '').split(rSpace);

        for (var i = 0, l = this.selector.length; i < l; i++) {
          var elem = this.selector[i];

          // if this is an element
          if (elem && elem.nodeType === 1) {
            // if no className exists set it and continue on
            if (!elem.className) {
              elem.className = value;
            } else {
              // otherwise check value against each class for a match
              var className = ' '+ elem.className +' ',
                setClass = elem.className;

              for (var c = 0, cl = classNames.length; c < cl; c++) {
                if (className.indexOf(' '+ classNames[c] +' ') < 0) {
                  setClass += ' '+ classNames[c];
                }
              }
              elem.className = (setClass || '').replace(rTrim, '');
            }
          }
        }
      }
      return this;
    },
    hasClass: function(value) {
      for (var i = 0; i < this.selector.length; i++) {
        var elem = this.selector[i];

        if (elem && elem.nodeType === 1) {
          // check the elements className to see if the class exists to return true
          if (elem.className.indexOf(value) >= 0) {
            return true;
          }
        }
      }
      return false;
    },
    removeClass: function(value) {
      if (( value && typeof value === 'string') || value === undefined) {
        var classNames = (value || '').split(rSpace);

        for (var i = 0, l = this.selector.length; i < l; i++) {
          var elem = this.selector[i];

          if (elem && elem.nodeType === 1 && elem.className) {
            if (value) {
              var className = (' '+ elem.className +' ').replace(rClass, ' ');

              for (var c = 0, cl = classNames.length; c < cl; c++) {
                className = className.replace(' '+ classNames[c] +' ', ' ');
              }
              elem.className = (className || '').replace(rTrim, '');
            } else {
              elem.className = '';
            }
          }
        }
      }
      return this;
    }
  };

  // Reveal it to global object -> window
  window.qlass = window.q = q;
})();