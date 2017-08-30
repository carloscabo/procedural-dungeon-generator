// Namespace
var pDG = pDG || {};

'use strict';

// Child FSM
pDG.fSM = new StateMachine({

  init: 'uninitilaized',

  transitions: [
    {
      name: 'createRooms',   // Action
      from: 'uninitilaized',
      to:   'room-creation'
    },
    {
      name: 'calculateAverage',
      from: 'room-creation',
      to:   'average-area-calculation'
    },
    {
      name: 'pickMainRooms',
      from: 'average-area-calculation',
      to:   'picking-main-rooms'
    },
    {
      name: 'spaceRooms',
      from: '*',
      to:   'spacing-rooms'
    }
  ],
  methods: {
    onCreateRooms: function() {
      var _w = window;
      _w.rooms = _w.pDG.fn.createRooms( _w.gV.room_number, _w.gV.grid );
    },
    onCalculateAverage: function() {
      console.log('I froze')
    },
    onVaporize: function() { console.log('I vaporized') },
    onCondense: function() { console.log('I condensed') }
  }
});