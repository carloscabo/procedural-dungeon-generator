/* Global vars */
var gV = {
  radius: 512/ 2,

  room_number: 50,
  max_room_w: 16,
  min_room_w: 2,
  max_room_h: 16,
  min_room_h: 2,

  grid: 10, // Pixels

  x: 0,
  y: 0,

  average_area: 0,

  // Areas over the average by this factor
  // Define the main rooms of the dungeos
  average_area_limit: 1.45,

  overlapping: true
},
rooms = [],
cz1;

$(document).ready(function() {

  cz1 = new Canvaz('#cnvz');
  cz1.fullScreen();

  // Clear canvas
  cz1.clear = function() {
    this.fS = '#242424';
    this.ctx.beginPath();
    this.ctx.rect(- cz1.w / 2, - cz1.h / 2, cz1.w, cz1.h);
    this.ctx.fill();
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeStart = function() {

    cz1.fS = '#f00';
    cz1.ctx.translate(cz1.w / 2, cz1.h / 2);

    // Create rooms
    for (var i = 0; i < gV.room_number; i++) {
      var
        // p1 = getRandomPointInEllipse (0, 0, gV.radius / 2, gV.radius / 2);
        p1 = pDG.fn.getRandomPointInEllipse(0, 0, 64, 64, gV.grid),
        room = {
          'x': p1[0],
          'y': p1[1],
          'w': gV.min_room_w + Math.round(Math.random() * (gV.max_room_w - gV.min_room_w)),
          'h': gV.min_room_h + Math.round(Math.random() * (gV.max_room_h - gV.min_room_h)),
          'id': Math.random().toString(36).substr(2, 8),
          'idx': i
        };

      room.x -= ( room.w );
      room.y -= ( room.h );

      room.cx = room.x + ( room.w / 2 * gV.grid );
      room.cy = room.y + ( room.h / 2 * gV.grid );

      room.area = room.w * room.h;
      gV.average_area += room.area;
      rooms.push( room );
    }

    // Not iot realli the average
    gV.average_area = gV.average_area / gV.room_number;
    console.log( rooms );
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeDraw = function() {
    // cz1.clear();
  };

  cz1.draw = function() {

    cz1.clear();

    drawGrid();

    spaceRooms( rooms );

    // Draw all rooms
    for (var i = 0, len = rooms.length; i < len; i++) {
      var
        room = rooms[i];
      drawRoom( room );
    }

    drawCoord();

  };

  cz1.start();

});


function drawRoom( room ) {
  cz1.lW = '1';
  cz1.fS = 'rgba(45, 93, 180, 0.75)';
  cz1.sS = '#fff';

  if  ( room.area > gV.average_area * gV.average_area_limit ) {
    cz1.fS = 'rgba(180, 93, 45, 0.75)';
  }
  // cz1.rect(room.x, room.y, room.w * gV.grid, room.h * gV.grid );
  cz1.ctx.beginPath();
  cz1.ctx.rect( room.x, room.y, room.w * gV.grid, room.h * gV.grid );
  cz1.ctx.closePath();
  cz1.ctx.fill();
  cz1.ctx.stroke();

  cz1.fS = '#ffffff';
  cz1.plot( room.cx, room.cy, 1.0 );
  cz1.ctx.fill();

  cz1.ctx.font = "400 12px Hack";
  cz1.ctx.textAlign = "left";
  cz1.ctx.fillText( room.idx, room.x + 4, room.y + 18);

}

// function snapToGrid ( val, gridSize ) {
//   return Math.round(val / gridSize) * gridSize;
// };

function drawGrid() {
  var
    r = 100;
  cz1.fS = '#aaa';
  for (var i = -r; i < r; i++) {
    for (var j = -r; j < r; j++) {
      cz1.ctx.beginPath();
      cz1.ctx.rect(i * gV.grid, j * gV.grid, 1, 1);
      cz1.ctx.closePath();
      cz1.ctx.fill();
    }
  }
};

function drawCoord() {
  cz1.fS = '#f00';
  cz1.ctx.beginPath();

  cz1.ctx.rect( 0, - cz1.h, 1, cz1.h * 2);
  cz1.ctx.rect( - cz1.w, 0, cz1.w * 2, 1);
  cz1.ctx.closePath();
  cz1.ctx.fill();
  // debugger;
};

function spaceRooms ( rooms ) {
  // Move to avoid overlap
  var
    rooms_overlapping = false;

  for (var i = 0, len = rooms.length; i < len; i++) {
    var
      r1 = rooms[i];
    r1.x = Math.round(r1.x);
    r1.y = Math.round(r1.y);
    for (var j = 0; j < len; j++) {
      if (i !== j) {
        var
          r2 = rooms[j];

        // If rooms overlap
        if ( pDG.fn.roomsOverlap(r1, r2, gV.grid) ) {

          rooms_overlapping = true;
          // console.log( 'overlaps' );
          var
            d = pDG.fn.dist(r1.cx, r1.cy, r2.cx, r2.cy),
            dx = r2.cx - r1.cx,
            dy = r2.cy - r1.cy,
            normal = {},
            midpoint = {};

          if ( d === 0 ) {
            normal.x = 0;
            normal.y = 0;
          } else {
            normal.x = dx / d;
            normal.y = dy / d;
          }
          midpoint.x = (r1.x + r2.x) / 2;
          midpoint.y = (r1.y + r2.y) / 2;

          r2.cx += ( normal.x * gV.grid * 1.0 );
          r2.cy += ( normal.y * gV.grid * 1.0 );
          r1.cx -= ( normal.x * gV.grid * 1.0 );
          r1.cy -= ( normal.y * gV.grid * 1.0 );

          r2.x = pDG.fn.snapToGrid( r2.cx - r2.w / 2 * gV.grid, gV.grid );
          r2.y = pDG.fn.snapToGrid( r2.cy - r2.h / 2 * gV.grid, gV.grid );
          r1.x = pDG.fn.snapToGrid( r1.cx - r1.w / 2 * gV.grid, gV.grid );
          r1.y = pDG.fn.snapToGrid( r1.cy - r1.h / 2 * gV.grid, gV.grid );

          r2.cx = r2.x + ( r2.w * gV.grid / 2 );
          r2.cy = r2.y + ( r2.h * gV.grid / 2 );
          r1.cx = r1.x + ( r1.w * gV.grid / 2 );
          r1.cy = r1.y + ( r1.h * gV.grid / 2 );

        }
      }
    }
  }
}


