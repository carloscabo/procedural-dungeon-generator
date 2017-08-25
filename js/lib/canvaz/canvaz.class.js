/**
 * Simple HTML5 Canvas Scene Manager
 * by Carlos Cabo http://carloscabo.com
 * https://github.com/carloscabo/canvaz
 * V0.9 SanFermin
 * 2015/07/07
 */

/**
 * Milisecond precision, and using Data.now (faster)
 * by Johan Nordberg
 * http://www.makeitgo.ws/articles/animationframe/
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

/**
 * Creates a Canvaz object attached a canvas DOM element
 * @param {[type]} canvas_id DOM id
 */
function Canvaz (canvas_id) {

  this.animID = undefined;

  // Current canvas properties
  this.canvas_id = canvas_id;
  this.$can = $(this.canvas_id);
  this.w    = this.$can[0].width;
  this.h    = this.$can[0].height;
  this.off  = this.$can.offset();
  this.ctx  = this.$can[0].getContext('2d');
  this.frameRate = null,
  this.center = {
    'x': this.w/2,
    'y': this.h/2
  };

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

  // If 'beforeStart' its defined...
  if (typeof this.beforeStart === 'function') {
    this.beforeStart();
  }

  // Starts internal timer
  this.timer.initial = Date.now();
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
  // If 'beforeDraw' is defined
  if (typeof this.beforeDraw === 'function') {
    this.beforeDraw();
  }
  this.draw();
} // Update

/* Animate with requestAnimationFrame */
Canvaz.prototype.animate = function() {
  // Increase internal timer
  var t = Date.now();
  this.timer.lastFrame = t - this.timer.initial - this.timer.now;
  this.timer.now = t - this.timer.initial;

  // If 'draw' method defined thenm update scene
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

/**
 * Opens canvas content into a new window.
 * Optionally adds a watermark
 */
Canvaz.prototype.saveCanvasToPng = function(watermarkImageUrl) {

  // buffer creation
  var buffer = document.createElement('canvas');
  buffer.width = this.w;
  buffer.height = this.h;
  var bufferCtx = buffer.getContext('2d');

  // Copy actual canvas content into buffer
  bufferCtx.drawImage(this.$can[0], 0, 0);

  // No watermark
  if(typeof watermarkImageUrl === 'undefined') {
    // buffer data dump
    var dataUrl = buffer.toDataURL("image/png");
    this.saveCanvasOpenWindow(dataUrl);
  } else {
    // Load watermark and paste it
    var
      wmImg = new Image(),
      that = this;
    wmImg.onload = function() {
      // Draw bottom left
      bufferCtx.drawImage(this, 0, buffer.height - this.height);
      var dataUrl = buffer.toDataURL("image/png");
      that.saveCanvasOpenWindow(dataUrl);
    }
    wmImg.src = watermarkImageUrl;
  }
}

// Open confirm dialog and window with image
Canvaz.prototype.saveCanvasOpenWindow = function(dataUrl) {
  // Spanish version
  // var confirmText = 'Se abrirá otra ventana del navegador con el gráfico listo para descargar. Pulsa sobre él con el botón derecho y seleccione "Guardar imagen como..."\n¿Deseas continuar?';
  var confirmText = 'Another window/tab will open with the image ready to download. Just right click over it and select "Save image as..."\nContinue?';
  if(confirm(confirmText)) {
    window.open(dataUrl);
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
  this.recalculateFullScreenDimensions();
  // Restart on resize
  var that = this;
  this.resizeTimer = null;
  $(window).resize(function() {
    clearTimeout(that.resizeTimer);
    that.resizeTimer = setTimeout(function() {
      that.recalculateFullScreenDimensions();
      that.restart();
    }, 500);
  })
}
Canvaz.prototype.recalculateFullScreenDimensions = function() {
  this.w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  this.h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  this.$can[0].width = this.w;
  this.$can[0].height = this.h;
  this.center.x = this.w/2;
  this.center.y = this.h/2;

  if(this.buffers.length > 0) {
    for (var i = this.buffers.length - 1; i >= 0; i--) {
      this.buffers[i].width = this.w;
      this.buffers[i].height = this.h;
    };
  }
}

/**
 * Clear completly the canvas surface
 * @return {[type]} [description]
 */
Canvaz.prototype.clear = function (x, y, w, h) {
  if (!x) x = 0;
  if (!y) y = 0;
  if (!w) w = this.w;
  if (!h) h = this.h;
  this.ctx.clearRect(x, y, w, h);

  // Solid fill
  /*this.ctx.beginPath();
  this.ctx.rect(0, 0, this.w, this.h);
  this.ctx.fill();*/
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

Canvaz.prototype.drawOnce = function () {
  // Draws scene once
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

// From itx center, instead of from top-left corner
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

// Style helpers

// fillStyle
Object.defineProperty(Canvaz.prototype, 'fS', {
  get: function() {
    return this.ctx.fillStyle;
  },
  set: function(color) {
    this.ctx.fillStyle = color;
  }
});

// strokeStyle
Object.defineProperty(Canvaz.prototype, 'sS', {
  get: function() {
    return this.ctx.strokeStyle;
  },
  set: function(color) {
    this.ctx.strokeStyle = color;
  }
});

// lineWidth
Object.defineProperty(Canvaz.prototype, 'lW', {
  get: function() {
    return this.ctx.lineWidth;
  },
  set: function(w) {
    this.ctx.lineWidth = w;
  }
});
