/*
  ============================================
  Canvas type1
  Inhereit from CanvaSSS
*/

extendClass(CanvaSSSBase, CSSS);

function CSSS (canvas_id) {
  CanvaSSSBase.call(this, canvas_id) ;
  // Other propierties here
}

CSSS.prototype.draw = function () {
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
  Inhereit from CanvaSSS
*/

extendClass(CanvaSSSBase, CSSSAlt);

function CSSSAlt (canvas_id) {
  CanvaSSSBase.call(this, canvas_id) ;
  // Other propierties here
}

/* Uses same draw loop as CSSS */
CSSSAlt.prototype.draw = CSSS.prototype.draw;

CSSSAlt.prototype.clear = function () {
  this.ctx.fillStyle = 'rgba(128,36,36,1)';
  this.ctx.fillRect(0, 0, this.w, this.h);
}
