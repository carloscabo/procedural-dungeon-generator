/*
  ===============================================
  Canvas functions and objects go here
*/

function ItemFollowMouseType(x, y, r, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.color = color;
  this.delay = 16;
}; //item

ItemFollowMouseType.prototype.update = function(mousex, mousey) {
  //SIN DELAY
  //this.x = mouse.x;
  //this.y = mouse.y;
  //CON DELAY
  this.x += (mousex - this.x)/this.delay;
  this.y += (mousey - this.y)/this.delay;
};

function itemType(x, y, r, ww, wh, color) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.ww = ww;
  this.wh = wh;
  this.dir_x = 2;
  this.dir_y = 5;
  this.color = color;
}; //item

itemType.prototype.update = function () {
  this.x = this.x + this.dir_x;
  this.y = this.y + this.dir_y;
  if (this.x <= 0 || this.x > this.ww) {
    this.dir_x = this.dir_x * -1;
  }

  if (this.y <= 0 || this.y > this.wh) {
    this.dir_y = this.dir_y * -1;
  }
}


