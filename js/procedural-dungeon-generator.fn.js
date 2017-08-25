// Namespace
var pDG = pDG || {};
pDG.fn = { };

'use strict';

/*
  Calculate distance between 2D / 3D points
  Usage:
  pDG.fn.dist( p1_x, p1_y, p2_x, p2_y );
*/
pDG.fn.dist = function () {
  var dx, dy, dz;
  if (arguments.length === 4) {
    dx = arguments[0] - arguments[2];
    dy = arguments[1] - arguments[3];
    return Math.sqrt(dx * dx + dy * dy);
  }
  if (arguments.length === 6) {
    dx = arguments[0] - arguments[3];
    dy = arguments[1] - arguments[4];
    dz = arguments[2] - arguments[5];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
};

/*
  Rounds a value to a grid multiplus
*/
pDG.fn.snapToGrid = function ( val, grid_size ) {
  return Math.round(val / gridSize) * grid_size;
};

/*
  Returns _true_ if two room objects overlap / intersetc
  var room = {
    x: ..., y: ..., w: ..., h: ..., id: ..., idx: ...
  };
*/
pDG.fn.roomsOverlap = function ( r1, r2, grid_size ) {

  /* var
    r2_l = r2.x,
    r2_r = r2.x + r2.w * grid_size,
    r2_t = r2.y,
    r2_b = r2.y + r2.h * grid_size,
    r1_l = r1.x,
    r1_r = r1.x + r1.w * grid_size,
    r1_t = r1.y,
    r1_b = r1.y + r1.h * grid_size,

    x1 = Math.max( r1_l, r2_l ),
    x2 = Math.min( r1_r, r2_r ),
    y1 = Math.max( r1_t, r2_t ),
    y2 = Math.min( r1_b, r2_b ); */

  var
    x1 = Math.max( r1_x, r2_x ),
    x2 = Math.min( r1.x + r1.w * grid_size, r2.x + r2.w * grid_size ),
    y1 = Math.max( r1_y, r2_y ),
    y2 = Math.min( r1.y + r1.h * grid_size, r2.x + r2.w * grid_size );

  return x1 < x2 && y1 < y2;
}

/*
  Get a random point inside an ellipse with center cx, cy, and w  / h
  If you pass same width / height ellipse will be a circle :D

  Last parameter _rounds_ values to a `grid_size`
*/
pDG.fn.getRandomPointInEllipse = function( cx, cy, ellipse_w, ellipse_h, grid_size ) {
  var
    t = 2 * Math.PI * Math.random(),
    u = Math.random() + Math.random(),
    r = null;
  if ( u > 1) {
    r = 2 - u;
  } else {
    r = u;
  }
  var
    _x = x + ( ellipse_w * r * Math.cos(t) ),
    _y = y + ( ellipse_h * r * Math.sin(t) );
  if ( typeof grid_size !== 'undefined' ) {
    _x = pDG.fn.snapToGrid( _x, grid_size );
    _y = pDG.fn.snapToGrid( _y, grid_size );
  }
  return [ _x, _y ];
}

/*
  // ----------------------------------
  Draw helpers... functions... whatever
  // ----------------------------------
*/