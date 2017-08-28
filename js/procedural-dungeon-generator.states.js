// Namespace
var pDG = pDG || {};

'use strict';

pDG.statemachine = {

  states: null,

  current_idx: 0,
  current_state: null,

  init: function( states, initial_idx ) {
    this.states = states;
    this.len = this.states.length;
    if( typeof idx !== 'undefined' ) this.current_idx = initial_idx;
    this.current_state = this.states[ this.current_idx ];
  },

  next: function() {
    var
      _t = this;
    // Console.log()
    if ( _t.current_idx > 0 ) {
      _t.current_idx--;
      _t.current_state = _t.states[ _t.current_idx ];
      _t.onChange( _t );
      if ( _t.isLast() ) {
        _t.onLast();
      }
    };
  },

  prev: function() {
    // Console.log()
    if ( this.current_idx > 0 ) this.current_idx--;
  },

  isFirst: function() {
    if ( this.current_idx === 0 ) {
      if ( typeof this.onFirst === 'function' ) this.onFirst();
      return true;
    } else {
      return false;
    }
  },

  isLast: function() {
    if ( this.current_idx === this.len -1 ) {
      return true;
    } else {
      return false;
    }
  },

  // Events
  // You can override from outside

  onFirst: function() {

  },
  onLast: function() {

  },
  onChange: function() {

  }

};

pDG.statemachine.init(
  [
  'generating-rooms',
  'spacing-rooms',
  ],
  0 // Initial state idx number
);




