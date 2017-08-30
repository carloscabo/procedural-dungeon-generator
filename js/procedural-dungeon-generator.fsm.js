// Namespace
var pDG = pDG || {};

'use strict';

pDG.fSM = new StateMachine({

  init: 'uninitilaized',

  transitions: [
    {
      name: 'createRooms',   // Action
      from: 'uninitilaized',
      to:   'rooms-created'
    },
    {
      name: 'calculateAverage',
      from: 'rooms-created',
      to:   'average-area-calculated'
    },
    {
      name: 'pickMainRooms',
      from: 'average-area-calculated',
      to:   'main-rooms-picked'
    },
    {
      name: 'spacingRooms',
      from: '*',
      to:   'spacing-rooms'
    }
  ],

  /*
  methods: {
    onCreateRooms: function() {

    },
    onCalculateAverage: function() {

    },
  }*/
});

