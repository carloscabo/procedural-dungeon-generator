/*
  GLOBALS
  Handle with care!
*/



/*
  INITIALIZING OBJECTS AND STUFF
*/



/*
  DOMREADY START
*/

var c1;
var c2;

$(document).ready(function() {

  // Create canvas
  c1 = new CSSS("#micanvas");
  c1.addMouseTracking();
  console.log(c1);

  // Creating object and adding them to canvas
  var ifm1 = new ItemFollowMouseType(256, 256, 12, '#FFF000');
  c1.items.push (ifm1);

  // Bouncing balls
  var b1 = new itemType(123, 356, 25, c1.w, c1.h, '#00FF00');
  var b2 = new itemType(256, 128, 25, c1.w, c1.h, '#0000FF');
  c1.items.push (b1);
  c1.items.push (b2);

  // Cretae canvas
  c2 = new CSSSAlt("#micanvas2");
  c2.addMouseTracking();
  var ifm2 = new ItemFollowMouseType(256, 256, 12, '#FFFFFF');
  c2.items.push (ifm2);

  // Initialize canvas draw
  c1.init();
  c2.init();

  // Save canvas buttons
  $('#btn-save1').click(function (e) {
    e.preventDefault();
    c1.saveCanvasToPng();
  });

  $('#btn-save2').click(function (e) {
    e.preventDefault();
    c2.saveCanvasToPng();
  });

}); //Ready
