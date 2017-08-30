/* Global vars */
var gV = {
  radius: 512/ 2,

  room_number: 100,

  grid: 10, // Pixels

  x: 0,
  y: 0,

  average_area: 0,

  // Areas over the average by this factor
  // Define the main rooms of the dungeos
  average_area_factor: 1.35
};

pDG.rooms = [];
pDG.selected_rooms = []; // Area over average, main nodes of the dungeon
pDG.selected_rooms_centers = [];

var cz1; // Canvas

$(document).ready(function() {

  cz1 = new Canvaz('#cnvz');
  cz1.fullScreen();

  // Clear canvas
  cz1.clear = function() {
    this.fS = '#0c3e54';
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

    pDG.rooms = pDG.fn.createRooms( gV.room_number, gV.grid );

    // Caculate the average area of all rooms
    gV.average_area = pDG.fn.getAverageArea( pDG.rooms );

    // Get rooms over an area
    pDG.selected_rooms = pDG.rooms.filter( function( room ) {
      if ( room.area > gV.average_area * gV.average_area_factor ) {
        return room;
      }
    });

    // spaceRooms return true while rooms overlap
    while ( pDG.fn.spaceRooms( pDG.rooms, gV.grid ) ) {
      console.log( 'Spacing rooms' );
    }

    pDG.centers = pDG.fn.getCenters( pDG.selected_rooms ),
    pDG.triangles = Delaunay.triangulate( pDG.centers ),
    pDG.edges = pDG.fn.getEdgesFromTriangles( pDG.triangles ),
    pDG.min_span_tree = Kruskal.kruskal( pDG.centers, pDG.edges, pDG.fn.dist );

    var
      k = 0,
      edge_count = 3;
    pDG.extra_edges = [];
    while ( k < edge_count ) {
      var
        edge = pDG.edges[ Math.floor( Math.random() * pDG.edges.length ) ];
      if ( !pDG.fn.compareArray( edge, pDG.min_span_tree ) ) {
        pDG.extra_edges.push( edge );
        k++;
      }
    }


  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.beforeDraw = function() {
    cz1.clear();
  };

  // ----------------------------------
  // ----------------------------------
  // ----------------------------------
  cz1.draw = function() {

    pDG.fn.draw.grid( cz1, gV.grid );

    pDG.fn.draw.allRooms(
      cz1,
      pDG.rooms,
      gV.grid,
      gV.average_area,
      gV.average_area_factor
    );

    pDG.fn.draw.triangles( cz1, pDG.triangles, pDG.selected_rooms );
    // pDG.fn.draw.edges( cz1, edges, selected_rooms );
    pDG.fn.draw.edges( cz1, pDG.min_span_tree, pDG.selected_rooms );

    pDG.fn.draw.edges( cz1, pDG.extra_edges, pDG.selected_rooms, '#53dfcb' );

    pDG.fn.draw.axis( cz1 );

  };

  cz1.start();

});

