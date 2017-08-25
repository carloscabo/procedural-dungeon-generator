/*
  GLOBALS
  Handle with care!
*/



/*
  OBJECT CONSTURCTORS
*/

function ItemFollowMouseClass(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.delay = 16;
}; //item

ItemFollowMouseClass.prototype.update = function(mousex, mousey) {
  // No delay
  //this.x = mouse.x;
  //this.y = mouse.y;
  // With delay
  this.x += (mousex - this.x)/this.delay;
  this.y += (mousey - this.y)/this.delay;
};

function itemClass(x, y, r, ww, wh, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.ww = ww;
  this.wh = wh;
  this.dir_x = 2;
  this.dir_y = 5;
  this.color = color;
}; //item

itemClass.prototype.update = function () {
  this.x = this.x + this.dir_x;
  this.y = this.y + this.dir_y;
  if (this.x <= 0 || this.x > this.ww) {
    this.dir_x = this.dir_x * -1;
  }

  if (this.y <= 0 || this.y > this.wh) {
    this.dir_y = this.dir_y * -1;
  }
}


/*
  SCENE VARS
*/

var c1;
var c2;
var items = [];

/*
  DOMREADY
*/

$(document).ready(function() {

  // First sample

  c1 = new Canvaz("#cnvz1");
  c1.addMouseTracking();
  c1.addBuffer();
  c1.addBuffer();
  console.log(c1);

  // Creating object and adding them to canvas
  var ifm1 = new ItemFollowMouseClass(256, 256, 12, '#FFF000');
  c1.items.push (ifm1);

  c1.beforeDraw = function() {
    this.ctx.fillStyle = 'rgba(128,36,36,0.25)';
    this.ctx.fillRect(0, 0, this.w, this.h);
  }

  c1.draw = function () {
    for (var i in this.items) {
      this.items[i].update(this.mouse.x, this.mouse.y);
      //this.ctx.fillStyle = 'rgba(255,0,0,1)';
      this.ctx.fillStyle = this.items[i].color;
      this.plot(this.items[i].x, this.items[i].y, this.items[i].r);
    }
  }

  var b1 = new itemClass(123, 356, 25, c1.w, c1.h, '#00FF00');
  var b2 = new itemClass(256, 128, 25, c1.w, c1.h, '#0000FF');
  c1.items.push (b1);
  c1.items.push (b2);

  c1.start();

  // Second sample
  // Bouncing balls
  //

  // Create canvas
  c2 = new Canvaz("#cnvz2");
  c2.addMouseTracking();
  c2.setFrameRate(10); // Uses framerate instead RequestFrame

  var ifm2 = new ItemFollowMouseClass(256, 256, 12, '#FFFFFF');
  c2.items.push (ifm2);

  c2.beforeDraw = c1.beforeDraw;
  c2.draw = c1.draw;

  // Initialize canvas draw
  c2.start();

  // Save canvas buttons ------------------------------------
  $('#btn-save1').on('click', function (e) {
    e.preventDefault();
    c1.saveCanvasToPng();
  });

  $('#btn-save2').on('click', function (e) {
    e.preventDefault();
    c2.saveCanvasToPng();
  });

}); //Ready
