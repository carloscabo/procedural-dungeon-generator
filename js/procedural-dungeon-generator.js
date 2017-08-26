/* Global vars */
var gV = {
  radius: 512/ 2,

  room_number: 60,

  grid: 8, // Pixels

  x: 0,
  y: 0,

  average_area: 0,

  // Areas over the average by this factor
  // Define the main rooms of the dungeos
  average_area_factor: 1.35
},
rooms = [],
selected_rooms = [], // Area over average, main nodes of the dungeon
selected_rooms_centers = [],
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

    rooms = pDG.fn.createRooms( gV.room_number, gV.grid );
    console.log( rooms );

    gV.average_area = pDG.fn.getAverageArea( rooms );

    for (var i = 0, len = rooms.length; i < len; i++) {
      var room = rooms[i];
      if ( room.area > gV.average_area * gV.average_area_factor ) {
        selected_rooms.push( room );
      }
    }
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeDraw = function() {
    cz1.clear();
  };


  var overlapping = true;
  cz1.draw = function() {

    pDG.fn.draw.grid( cz1, gV.grid );

    pDG.fn.draw.allRooms(
      cz1,
      rooms,
      gV.grid,
      gV.average_area,
      gV.average_area_factor
    );

    if ( overlapping ) {
      overlapping = pDG.fn.spaceRooms( rooms, gV.grid );
      console.log( 'overlapping!' );
    } else {
      var triangles = Delaunay.triangulate( pDG.fn.getCenters( selected_rooms ) );
      // console.log( triangles );
      pDG.fn.draw.triangles( cz1, triangles, selected_rooms );
      // debugger;
    }

    pDG.fn.draw.axis( cz1 );

  };

  cz1.start();

});







