/*
  =================================================
  Milisecond precision, and using Data.now (faster)
  by Johan Nordberg
  http://www.makeitgo.ws/articles/animationframe/
*/

(function() {
  var lastFrame, method, now, queue, requestAnimationFrame, timer, vendor, _i, _len, _ref, _ref1;
  method = 'native';
  now = Date.now || function() {
    return new Date().getTime();
  };
  requestAnimationFrame = window.requestAnimationFrame;
  _ref = ['webkit', 'moz', 'o', 'ms'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (!(requestAnimationFrame != null)) {
      requestAnimationFrame = window[vendor + "RequestAnimationFrame"];
    }
  }
  if (!(requestAnimationFrame != null)) {
    method = 'timer';
    lastFrame = 0;
    queue = timer = null;
    requestAnimationFrame = function(callback) {
      var fire, nextFrame, time;
      if (queue != null) {
        queue.push(callback);
        return;
      }
      time = now();
      nextFrame = Math.max(0, 16.66 - (time - lastFrame));
      queue = [callback];
      lastFrame = time + nextFrame;
      fire = function() {
        var cb, q, _j, _len1;
        q = queue;
        queue = null;
        for (_j = 0, _len1 = q.length; _j < _len1; _j++) {
          cb = q[_j];
          cb(lastFrame);
        }
      };
      timer = setTimeout(fire, nextFrame);
    };
  }
  requestAnimationFrame(function(time) {
    var _ref1;
    if ((((_ref1 = window.performance) != null ? _ref1.now : void 0) != null) && time < 1e12) {
      requestAnimationFrame.now = function() {
        return window.performance.now();
      };
      requestAnimationFrame.method = 'native-highres';
    } else {
      requestAnimationFrame.now = now;
    }
  });
  requestAnimationFrame.now = ((_ref1 = window.performance) != null ? _ref1.now : void 0) != null ? (function() {
    return window.performance.now();
  }) : now;
  requestAnimationFrame.method = method;
  window.requestAnimationFrame = requestAnimationFrame;
})();

/*
  ===============================================
  Extend Class
  by Juan Mendes
  http://js-bits.blogspot.com.es/2010/08/javascript-inheritance-done-right.html
*/

// Setup the prototype chain the right way
function surrogateCtor() {}

function extendClass(base, sub) {
  surrogateCtor.prototype = base.prototype;
  sub.prototype = new surrogateCtor();
  sub.prototype.constructor = sub;
}

/*
  ===============================================
  Simple HTML5 CanvaS Scene Starter
  by Carlos Cabo 2013
  http://carloscabo.com
*/

function CanvaSSSBase (canvas_id) {

  this.animID = undefined;
  this.items = [];

  this.canvas_id = canvas_id;
  this.$can = $(this.canvas_id);
  this.w    = this.$can.width();
  this.h    = this.$can.height();
  this.off  = this.$can.offset();
  this.ctx  = this.$can[0].getContext('2d');

} // CanvasSM

CanvaSSSBase.prototype.init = function () {

  // Initial Canvas clearing
  this.ctx.fillStyle = 'rgba(36,36,36,1)';
  this.ctx.fillRect (0, 0, this.w, this.h);

  // Party start!
  this.animate();
} // Init

CanvaSSSBase.prototype.addMouseTracking = function () {
  var that = this;

  this.mouse = { x: 0, y: 0 };
  this.mouse.click = { x: 0, y: 0 };

  this.$can.mousemove(function(e){
    that.mouse.x = e.pageX - that.off.left;
    that.mouse.y = e.pageY - that.off.top;
  });

  this.$can.click(function (e) {
    e.preventDefault();
    that.mouse.click.x = e.pageX - that.off.left;
    that.mouse.click.y = e.pageY - that.off.top;
  });
} // addMouseTracking

CanvaSSSBase.prototype.clear = function () {
  this.ctx.fillStyle = 'rgba(36,36,36,0.2)';
  this.ctx.fillRect(0, 0, this.w, this.h);
} // Clear

CanvaSSSBase.prototype.draw = function () {
  // Overide from outside
  // Usually inside the ready.js
} // Draw container

CanvaSSSBase.prototype.update = function () {
  this.clear();
  this.draw();
} // Update

CanvaSSSBase.prototype.animate = function() {
  this.animID = requestAnimationFrame(this.animate.bind(this));
  this.update();
} // animate

CanvaSSSBase.prototype.stopAnim = function() {
  window.cancelAnimationFrame(this.animID);
} // stopAnim

CanvaSSSBase.prototype.saveCanvasToPng = function() {

  // buffer creation
  var buffer = document.createElement('canvas');
  buffer.width = this.w;
  buffer.height = this.h;
  var bufferctx = buffer.getContext('2d');

  // coping canvas to buffer
  bufferctx.drawImage(this.$can[0], 0, 0); //micanvas

  // buffer data dump
  var data = buffer.toDataURL("image/png");

  // Open confirm dialog
  var confirm_text = 'Se abrirá otra ventana del navegador con el gráfico listo para descargar. Pulsa sobre él con el botón derecho y seleccione "Guardar imagen como..."\n¿Deseas continuar?';
  if(confirm(confirm_text)) {
    window.open(data);
  }
}

/*
  ===============================================
  Drawing helpers
*/

CanvaSSSBase.prototype.plot = function(x, y, r) {
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
  this.ctx.fill();
} // plot

CanvaSSSBase.prototype.rect = function (x, y, w, h) {
  this.ctx.beginPath();
  this.ctx.rect(x-(w/2), y-(h/2), w, h);
  this.ctx.stroke();
} // rectangle

CanvaSSSBase.prototype.line = function (x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1,y1);
  this.ctx.lineTo(x2,y2);
  this.ctx.closePath();
  this.ctx.stroke();
} // Line

