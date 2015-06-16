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
  Simple HTML5 Canvas Scene Manager
  by Carlos Cabo 2013
  http://carloscabo.com
*/

/**
 * [Canvaz description]
 * @param {[type]} canvas_id [description]
 */
function Canvaz (canvas_id) {

  this.animID = undefined;

  // Current canvas properties
  this.canvas_id = canvas_id;
  this.$can = $(this.canvas_id);
  this.w    = this.$can[0].width;
  this.h    = this.$can[0].height;
  this.centerX = this.w/2;
  this.centerY = this.h/2;
  this.off  = this.$can.offset();
  this.ctx  = this.$can[0].getContext('2d');
  this.frameRate = null;

  // Time vars
  this.timer = {}; // ms
  this.timer.initial   = 0;
  this.timer.now       = 0;
  this.timer.lastFrame = 0;

  // Items
  // Optionally you can store items in the canvas obj
  this.items = [];

  // Buffers
  this.buffers = [];
  this.bctxs = [];

} // CanvasSM

/**
 * Starts the canvas painting loop
 * @return {[type]} [description]
 */
Canvaz.prototype.start = function() {

  // Actions to be done just before starting the loop
  if (typeof this.beforeStart === 'function') {
    this.beforeStart();
  }

  // Starts internal timer
  this.timer.initial = new Date().getTime();
  if (this.frameRate > 0) {
    // Use setInterval
    this.animateSI();
  } else {
    // Use requestFrameAnim
    this.animate();
  }
}

/**
 * Erases all and restarts
 * @return {[type]} [description]
 */
Canvaz.prototype.restart = function () {
  this.ctx.clearRect(0, 0, this.w, this.h);
  window.cancelAnimationFrame(this.animID);
  this.start();
}

/**
 * Add mouse trckacing to the canvas object
 */
Canvaz.prototype.addMouseTracking = function () {

  var that = this;

  this.mouse = { x: 0, y: 0 };
  this.mouse.click = { x: 0, y: 0 };

  this.$can.on('mousemove', function(e){
    that.mouse.x = e.pageX - that.off.left;
    that.mouse.y = e.pageY - that.off.top;
  });
} // addMouseTracking

/**
 * Main loop. Where the draw() mehod is called
 * @return {[type]} [description]
 */
Canvaz.prototype.update = function () {
  if (typeof this.beforeDraw === 'function') {
    this.beforeDraw();
  }
  this.draw();
} // Update

Canvaz.prototype.animate = function() {
  // Increase internal timer
  var t = new Date().getTime();
  this.timer.lastFrame = t - this.timer.initial - this.timer.now;
  this.timer.now = t - this.timer.initial;

  // Update scene
  if (typeof this.draw === 'function') {
    this.update();
    this.animID = requestAnimationFrame(this.animate.bind(this));
  }
}

/* Animate with setInterval */
Canvaz.prototype.animateSI = function() {
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
  // Spanish version
  // var confirm_text = 'Se abrirá otra ventana del navegador con el gráfico listo para descargar. Pulsa sobre él con el botón derecho y seleccione "Guardar imagen como..."\n¿Deseas continuar?';
  var confirm_text = 'Another window/tab will open with the image ready to download. Just right click over it and select "Save image as..."\nContinue?';
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

/**
 * Resizes the canvas to be as big as the current viewport
 * @return {[type]} [description]
 */
Canvaz.prototype.fullScreen = function () {
  this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  this.$can[0].width = this.w;
  this.$can[0].height = this.h;

  this.centerX = this.w/2;
  this.centerY = this.h/2;

  var that = this;
  $(window).resize(function() {
    that.fullScreen();
    that.restart();
  })
}

/**
 * Clear completly the canvas surface
 * @return {[type]} [description]
 */
Canvaz.prototype.clear = function () {
  this.ctx.clearRect(0, 0, this.w, this.h);
} // Clear

// --------------------------------------------------------
// Methods usually overriden from outside
// --------------------------------------------------------

Canvaz.prototype.beforeStart = function() {

} // beforeStart

Canvaz.prototype.beforeDraw = function () {
  // Usually used for clearing the stage...
  // Save the canvas status... etc.
  // Runs just before draw();
}

Canvaz.prototype.draw = function () {
  // Draws scene
}

// --------------------------------------------------------
// Drawing helpers
// --------------------------------------------------------

Canvaz.prototype.plot = function(x, y, r) {
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
  this.ctx.closePath();
  this.ctx.fill();
} // plot

Canvaz.prototype.circle = function(x, y, r) {
  this.ctx.beginPath();
  this.ctx.arc(x, y, r, 0, Math.PI * 2, true);
  this.ctx.closePath();
  this.ctx.stroke();
} // Circle

Canvaz.prototype.rect = function (x, y, w, h) {
  this.ctx.beginPath();
  this.ctx.rect(x-(w/2), y-(h/2), w, h);
  this.ctx.closePath();
  this.ctx.stroke();
} // rectangle

Canvaz.prototype.line = function (x1, y1, x2, y2) {
  this.ctx.beginPath();
  this.ctx.moveTo(x1,y1);
  this.ctx.lineTo(x2,y2);
  this.ctx.closePath();
  this.ctx.stroke();
} // Line

