/* Global vars */
var gV = {
  radius: 512/ 2,

  room_number: 60,
  max_room_w: 16,
  min_room_w: 2,
  max_room_h: 16,
  min_room_h: 2,

  grid: 8, // Pixels

  x: 0,
  y: 0,

  average_area: 0,

  // Areas over the average by this factor
  // Define the main rooms of the dungeos
  average_area_factor: 1.35
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
        p1 = pDG.fn.getRandomPointInEllipse(0, 0, 32, 32, gV.grid),
        room = {
          x: p1[0],
          y: p1[1],
          w: gV.min_room_w + Math.round(Math.random() * (gV.max_room_w - gV.min_room_w)),
          h: gV.min_room_h + Math.round(Math.random() * (gV.max_room_h - gV.min_room_h)),
          id: Math.random().toString(36).substr(2, 8),
          idx: i
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
    gV.average_area /= gV.room_number;
    console.log( rooms );
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeDraw = function() {
    cz1.clear();
  };

  cz1.draw = function() {

    pDG.fn.draw.grid( cz1, gV.grid );

    pDG.fn.spaceRooms( rooms, gV.grid );

    // Draw all rooms
    for (var i = 0, len = rooms.length; i < len; i++) {
      var
        room = rooms[i],
        color = 'rgba(45, 93, 180, 0.75)';
      if ( room.area > gV.average_area * gV.average_area_factor ) {
        color = 'rgba(180, 93, 45, 0.75)'; // Redish
      }
      pDG.fn.draw.room( cz1, room, gV.grid, color );
    }

    pDG.fn.draw.axis( cz1 );

  };

  cz1.start();

});







