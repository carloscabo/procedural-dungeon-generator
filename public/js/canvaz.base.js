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
    if (requestAnimationFrame == null) {
      requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
    }
  }
  if (requestAnimationFrame == null) {
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
    var offset, _ref1;
    if (time < 1e12) {
      if (((_ref1 = window.performance) != null ? _ref1.now : void 0) != null) {
        requestAnimationFrame.now = function() {
          return window.performance.now();
        };
        requestAnimationFrame.method = 'native-highres';
      } else {
        offset = now() - time;
        requestAnimationFrame.now = function() {
          return now() - offset;
        };
        requestAnimationFrame.method = 'native-highres-noperf';
      }
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

function Canvaz (canvas_id) {

  this.animID = undefined;
  this.items = [];

  // Current canvas properties
  this.canvas_id = canvas_id;
  this.$can = $(this.canvas_id);
  this.w    = this.$can.width();
  this.h    = this.$can.height();
  this.off  = this.$can.offset();
  this.ctx  = this.$can[0].getContext('2d');
  this.frameRate = null;

  // Buffers
  this.buffers = [];
  this.bctxs = [];

} // CanvasSM

Canvaz.prototype.init = function () {

  // Initial Canvas clearing
  this.ctx.fillStyle = 'rgba(36,36,36,1)';
  this.ctx.fillRect (0, 0, this.w, this.h);

  if (this.frameRate > 0) {
    // Use setInterval
    this.animateSI();
  } else {
    // Use requestFrameAnim
    this.animate();
  }

} // Init

Canvaz.prototype.addMouseTracking = function () {
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

Canvaz.prototype.clear = function () {
  this.ctx.fillStyle = 'rgba(36,36,36,0.2)';
  this.ctx.fillRect(0, 0, this.w, this.h);
} // Clear

Canvaz.prototype.draw = function () {
  // Overide from outside
  // Usually inside the ready.js
} // Draw container

Canvaz.prototype.update = function () {
  this.clear();
  this.draw();
} // Update

Canvaz.prototype.animate = function() {
  this.update();
  this.animID = requestAnimationFrame(this.animate.bind(this));
} // animate

/* Animate with setInterval */
Canvaz.prototype.animateSI = function() {
  /* Redefine stopAnim function */
  this.stopAnim = function() {
    clearInterval(this.animID);
  };

  var self = this;
  this.animID = setInterval(function(){ self.update(); }, self.frameRate);
} // animate


Canvaz.prototype.stopAnim = function() {
  window.cancelAnimationFrame(this.animID);
} // stopAnim

Canvaz.prototype.setFrameRate = function(fr) {
  this.frameRate = 1000/fr;
} // setFrameRate

Canvaz.prototype.saveCanvasToPng = function() {

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

Canvaz.prototype.addBuffer = function () {

  var tempBuffer = tempBuffer = document.createElement('canvas');
  tempBuffer.width = this.w;
  tempBuffer.height = this.h;
  var tempBufferCtx = tempBuffer.getContext('2d')

  // Push to global object
  this.buffers.push(tempBuffer);
  this.bctxs.push(tempBufferCtx);
}
/*
  ===============================================
  Drawing helpers
*/

Canvaz.prototype.plot = function(x, y, r) {
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
  this.ctx.fill();
} // plot

Canvaz.prototype.rect = function (x, y, w, h) {
  this.ctx.beginPath();
  this.ctx.rect(x-(w/2), y-(h/2), w, h);
  this.ctx.stroke();
} // rectangle

Canvaz.prototype.line = function (x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1,y1);
  this.ctx.lineTo(x2,y2);
  this.ctx.closePath();
  this.ctx.stroke();
} // Line

