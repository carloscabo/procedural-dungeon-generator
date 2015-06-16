/*
  ============================================
  Canvas type1
  Inhereit from CanvaSSS
*/

extendClass(Canvaz, Cvz1);

function Cvz1 (canvas_id) {
  Canvaz.call(this, canvas_id) ;
  // Other propierties here
}

Cvz1.prototype.draw = function () {
  for (var i in this.items) {
    this.items[i].update(this.mouse.x, this.mouse.y);
    //this.ctx.fillStyle = 'rgba(255,0,0,1)';
    this.ctx.fillStyle = this.items[i].color;

    this.plot(this.items[i].x, this.items[i].y, this.items[i].r);
  }
}

/*
  ============================================
  Canvas type2
  Inhereit from CanvazBase
*/

extendClass(Canvaz, Cvz2);

function Cvz2 (canvas_id) {
  Canvaz.call(this, canvas_id) ;
  // Other propierties here
}

/* Uses same draw loop as Canvaz */
Cvz2.prototype.draw = Cvz1.prototype.draw;

Cvz2.prototype.clear = function () {
  this.ctx.fillStyle = 'rgba(128,36,36,1)';
  this.ctx.fillRect(0, 0, this.w, this.h);
}
