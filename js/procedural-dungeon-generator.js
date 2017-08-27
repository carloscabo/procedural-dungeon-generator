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
    console.log( 'ALL ROOMS:' )
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
      // console.log( 'overlapping!' ); // DEBUG
    } else {
      var
        centers = pDG.fn.getCenters( selected_rooms ),
        triangles = Delaunay.triangulate( centers ),
        edges = pDG.fn.getEdgesFromTriangles( triangles );

      // console.log( triangles );
      // console.log( centers );
      // console.log( triangles );
      // console.log( edges );

      var min_span_tree = Kruskal.kruskal( centers, edges, pDG.fn.dist );
      console.log( min_span_tree );

      pDG.fn.draw.triangles( cz1, triangles, selected_rooms );
      // pDG.fn.draw.triangles( cz1, triangles, selected_rooms );
      pDG.fn.draw.edges( cz1, min_span_tree, centers );

      debugger;
    }

    pDG.fn.draw.axis( cz1 );


  };

  cz1.start();

});

/*
function metric_dist( a, b )
{
  var dx = a[0] - b[0];
  var dy = a[1] - b[1];
  return dx*dx + dy*dy;
}

/*
var verts = [
  [0.38503426988609135,0.5090362404007465],
  [0.19520984776318073,0.786977760726586],
  [0.8779090968891978,0.27540406002663076],
  [0.37118537398055196,0.4261160106398165],
  [0.009620045777410269,0.01109302043914795],
  [0.28937867493368685,0.508045629831031],
  [0.8814799303654581,0.8606693388428539],
  [0.23076830571517348,0.6143061458133161],
  [0.8276667392347008,0.7573643098585308],
  [0.8571458104997873,0.9970081604551524],
  [0.6545385881327093,0.23009355925023556],
  [0.07946839486248791,0.27259768452495337],
  [0.8905663844197989,0.5316622816026211],
  [0.9713838896714151,0.4185456729028374],
  [0.11351755051873624,0.2873297731857747],
  [0.10451038158498704,0.5355643543880433],
  [0.8281457310076803,0.5880734538659453],
  [0.7657096697948873,0.004041936714202166],
  [0.056259031407535076,0.46703187585808337],
  [0.44853177992627025,0.34971798374317586],
  [0.029860927490517497,0.7799062975682318],
  [0.43341223197057843,0.4951996656600386],
  [0.8442796103190631,0.36333013977855444],
  [0.22370642004534602,0.3104499091859907],
  [0.48368687997572124,0.4374260699842125],
  [0.1614677112083882,0.49656812637113035],
  [0.2111605191603303,0.875581334810704],
  [0.5003555293660611,0.3783148208167404],
  [0.5843308703042567,0.11935447272844613],
  [0.14720879960805178,0.8469883250072598]
];

var edges = [
 [8,6], [8,12], [6,12],     [16,8], [16,12], [8,12],    [17,2], [17,13], [2,13],
 [22,12], [22,13], [12,13], [2,22], [2,13], [22,13],    [12,6], [12,13], [6,13],
 [4,28], [4,17], [28,17],   [17,10], [17,2], [10,2],    [22,16], [22,12], [16,12],
 [8,9], [8,6], [9,6],       [10,22], [10,2], [22,2],    [24,16], [24,22], [16,22],
 [27,24], [27,22], [24,22], [8,26], [8,9], [26,9],      [10,27], [10,22], [27,22],
 [28,10], [28,17], [10,17], [21,26], [21,8], [26,8],    [21,8], [21,16], [8,16],
 [24,21], [24,16], [21,16], [1,26], [1,0], [26,0],      [0,26], [0,21], [26,21],
 [7,1], [7,0], [1,0],       [28,19], [28,10], [19,10],  [19,27], [19,10], [27,10],
 [23,19], [23,28], [19,28], [4,23], [4,28], [23,28],    [19,24], [19,27], [24,27],
 [19,3], [19,24], [3,24],   [3,21], [3,24], [21,24],    [23,3], [23,19], [3,19],
 [5,7], [5,0], [7,0],       [3,0], [3,21], [0,21],      [4,14], [4,23], [14,23],
 [3,5], [3,0], [5,0],       [23,5], [23,3], [5,3],      [4,11], [4,14], [11,14],
 [25,7], [25,5], [7,5],     [23,25], [23,5], [25,5],    [14,18], [14,25], [18,25],
 [1,29], [1,26], [29,26],   [14,25], [14,23], [25,23],  [20,1], [20,7], [1,7],
 [15,20], [15,7], [20,7],   [25,15], [25,7], [15,7],    [20,29], [20,1], [29,1],
 [18,15], [18,25], [15,25], [11,18], [11,14], [18,14],  [18,20], [18,15], [20,15],
 [4,18], [4,11], [18,11],   [4,20], [4,18], [20,18]
];

var edgeMST = Kruskal.kruskal( verts, edges, metric_dist );
console.log(edgeMST);*/


