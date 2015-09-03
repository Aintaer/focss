define([
  'nbd/Class',
  '../util/pseudoevents'
], function(Class, pseudoevents) {
  'use strict';

  /**
   * @requires Set
   */
  var EventTable = Class.extend({
    init: function(el) {
      this._el = el;
      this._rules = {};
      this._callbacks = new Set();
      this._dispatch = this._dispatch.bind(this);
    },

    get: function(event) {
      var rules = this._rules[event];
      if (!rules) {
        rules = this._rules[event] = new Set();
        this._el.addEventListener(event, this._dispatch, false);
      }

      return rules;
    },

    has: function(event) {
      return event in this._rules;
    },

    _dispatch: function(event) {
      if (!this._callbacks.size) { return; }

      this._callbacks.forEach(function(callback) {
        callback(event);
      });
    },

    bind: function(callback) {
      this._callbacks.add(callback);
    },

    destroy: function() {
      for (var r in this._rules) {
        this._rules[r].clear();
        this._el.removeEventListener(r, this._dispatch, false);
      }
      this._el = this._rules = null;
    }
  });

  return EventTable;
});
