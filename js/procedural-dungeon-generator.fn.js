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
  return Math.round(val / grid_size) * grid_size;
};

/**
 * Returns array of rooms
 */
pDG.fn.createRooms = function ( room_number, grid_size ) {
  var
    // Defaults
    max_room_w = 16,
    min_room_w = 2,
    max_room_h = 16,
    min_room_h = 2,

    // Resulting room array
    rooms = [];

  for (var i = 0; i < room_number; i++) {
    var
      p1 = pDG.fn.getRandomPointInEllipse(0, 0, 32, 32, grid_size),
      room = {
        x: p1[0],
        y: p1[1],
        w: min_room_w + Math.round( Math.random() * ( max_room_w - min_room_w ) ),
        h: min_room_h + Math.round( Math.random() * ( max_room_h - min_room_h ) ),
        id: Math.random().toString(36).substr(2, 8),
        idx: i
      };

    // Compensate to the center
    room.x -= ( room.w * grid_size / 2 );
    room.y -= ( room.h * grid_size / 2 );

    // Snap to grid
    room.x = pDG.fn.snapToGrid( room.x, grid_size );
    room.y = pDG.fn.snapToGrid( room.y, grid_size );

    // Recalculate center
    room.cx = room.x + ( room.w / 2 * grid_size );
    room.cy = room.y + ( room.h / 2 * grid_size );

    // Calculate area
    room.area = room.w * room.h;
    rooms.push( room );
  }
  return rooms;
}


pDG.fn.getAverageArea = function ( rooms ) {
  var
    average_area = 0;
    len = rooms.length;
  for (var i = 0; i < len; i++) {
    average_area += rooms[i].area;
  }
  return average_area / len;
}


/*
  Loops over the rooms spacing them to th grid
*/
pDG.fn.spaceRooms = function ( rooms, grid_size ) {

  for (var i = 0, len = rooms.length; i < len; i++) {
    var
      r1 = rooms[i];
    for (var j = 0; j < len; j++) {
      if (i === j) {
        // Not checking againt itself
        continue;
      }

      var
        r2 = rooms[j];

      // If rooms overlap we mus space them
      if ( pDG.fn.roomsOverlap(r1, r2, grid_size) ) {

        var
          d = pDG.fn.dist(r1.cx, r1.cy, r2.cx, r2.cy),
          dx = r2.cx - r1.cx,
          dy = r2.cy - r1.cy,
          normal = {};
          // midpoint = {};

        // If rooms have their center x, y position we get a NaN
        // Due to a division by 0 ( distance between centers )
        if ( d === 0 ) {
          normal.x = 0;
          normal.y = 0;
        } else {
          normal.x = dx / d;
          normal.y = dy / d;
        }
        // midpoint.x = (r1.x + r2.x) / 2;
        // midpoint.y = (r1.y + r2.y) / 2;

        r2.cx += ( normal.x * grid_size * 1.0 );
        r2.cy += ( normal.y * grid_size * 1.0 );
        r1.cx -= ( normal.x * grid_size * 1.0 );
        r1.cy -= ( normal.y * grid_size * 1.0 );

        r2.x = pDG.fn.snapToGrid( r2.cx - r2.w / 2 * grid_size, grid_size );
        r2.y = pDG.fn.snapToGrid( r2.cy - r2.h / 2 * grid_size, grid_size );
        r1.x = pDG.fn.snapToGrid( r1.cx - r1.w / 2 * grid_size, grid_size );
        r1.y = pDG.fn.snapToGrid( r1.cy - r1.h / 2 * grid_size, grid_size );

        r2.cx = r2.x + ( r2.w * grid_size / 2 );
        r2.cy = r2.y + ( r2.h * grid_size / 2 );
        r1.cx = r1.x + ( r1.w * grid_size / 2 );
        r1.cy = r1.y + ( r1.h * grid_size / 2 );

      }
    }
  }
}


/*
  Returns _true_ if two room objects overlap / intersetc
  var room = {
    x: ..., y: ..., w: ..., h: ..., id: ..., idx: ...
  };
*/
pDG.fn.roomsOverlap = function ( r1, r2, grid_size ) {
  var
  r2_l = r2.x,
  r2_r = r2.x + r2.w * grid_size,
  r2_t = r2.y,
  r2_b = r2.y + r2.h * grid_size,
  r1_l = r1.x,
  r1_r = r1.x + r1.w * grid_size,
  r1_t = r1.y,
  r1_b = r1.y + r1.h * grid_size;


  var x1 = Math.max( r1_l, r2_l );
  var x2 = Math.min( r1_r, r2_r );
  var y1 = Math.max( r1_t, r2_t );
  var y2 = Math.min( r1_b, r2_b );
  return x1 < x2 && y1 < y2;

/* return !(r2_l > r1_r ||
  r2_r < r1_l ||
  r2_t > r1_b ||
  r2_b <= r1_t); */
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
    _x = cx + ( ellipse_w * r * Math.cos(t) ),
    _y = cy + ( ellipse_h * r * Math.sin(t) );
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

pDG.fn.draw = {};


pDG.fn.draw.grid = function ( canvaz_obj, grid_size ) {
  var
    r = 100;
  canvaz_obj.fS = '#aaa';
  canvaz_obj.ctx.beginPath();
  for (var i = -r; i < r; i++) {
    for (var j = -r; j < r; j++) {
      canvaz_obj.ctx.rect( i * grid_size, j * grid_size, 1, 1 );
      canvaz_obj.ctx.closePath();
    }
  }
  canvaz_obj.ctx.fill();
};


pDG.fn.draw.axis = function( canvaz_obj ) {
  canvaz_obj.fS = '#f00';
  canvaz_obj.ctx.beginPath();

  canvaz_obj.ctx.rect( 0, - canvaz_obj.h, 1, canvaz_obj.h * 2 );
  canvaz_obj.ctx.rect( - canvaz_obj.w, 0, canvaz_obj.w * 2, 1 );
  canvaz_obj.ctx.closePath();
  canvaz_obj.ctx.fill();
  // debugger;
};

/*
  Draws the room
*/
pDG.fn.draw.room = function ( canvaz_obj, room, grid_size, color ) {
  if ( typeof color === 'undefined' ) {
    var color = 'rgba(45, 93, 180, 0.75)'; // Bluish
  }

  canvaz_obj.lW = '1';
  canvaz_obj.fS = color;
  canvaz_obj.sS = '#fff';

  // canvaz_obj.rect(room.x, room.y, room.w * gV.grid, room.h * gV.grid );
  canvaz_obj.ctx.beginPath();
  canvaz_obj.ctx.rect( room.x, room.y, room.w * grid_size, room.h * grid_size );
  canvaz_obj.ctx.closePath();
  canvaz_obj.ctx.fill();
  canvaz_obj.ctx.stroke();

  canvaz_obj.fS = '#ffffff';
  canvaz_obj.plot( room.cx, room.cy, 1.0 );
  canvaz_obj.ctx.fill();

  canvaz_obj.ctx.font = "400 10px Hack";
  canvaz_obj.ctx.textAlign = "left";
  canvaz_obj.ctx.fillText( room.idx, room.x + 4, room.y + 15 );
}


pDG.fn.draw.allRooms = function ( canvaz_obj, rooms, grid_size, average_area, average_area_factor ) {
  for (var i = 0, len = rooms.length; i < len; i++) {
    var
      room = rooms[i],
      color = 'rgba(45, 93, 180, 0.75)';
    if ( room.area > average_area * average_area_factor ) {
      color = 'rgba(180, 93, 45, 0.75)'; // Redish
    }
    pDG.fn.draw.room( canvaz_obj, room, grid_size, color );
  }
}