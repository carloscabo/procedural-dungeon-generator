canvaz
======

**canvaz** is a **Simple Scene Starter** for quick prototyping HTML5 / Canvas sketches.

Its my try to speed-up the HTML5 / Canvas sketching of my ideas in and OOP oriented way. Its mainly intended for personal usage and sketching purposes (avoiding to include more heavier solutions like Kinetic.js or Processing.js). Ideas or suggestions are welcome ;-D

Thanks @maguilag for brainstorming the OOP aproach.

 - First beta release 2013/03/23
 - Revision 2015/06/16

usage
=====

1. Create a new `canvas` with an unique `id`

```javascript
<canvas id="cnvz1" width="512" height="512"></canvas>
```

2. Inside the `domready` event create an instace of **canvaz**

```javascript
$(document).ready(function() {
  // La magia aquí
  cz1 = new Canvaz("#cnvz1");
  ...
});
```

3. Define the `draw` method that will be called in each painting loop, if you want to do something just before drawing (clear the stage for instance) define `beforeDraw()` method too...

```javascript
cz1.beforeDraw = function() {
  this.ctx.fillStyle = 'rgba(128,36,36,0.25)';
  this.ctx.fillRect(0, 0, this.w, this.h);
}

cz1.draw = function () {
  for (var i in this.items) {
    this.items[i].update(this.mouse.x, this.mouse.y);
    this.ctx.fillStyle = this.items[i].color;
    this.plot(this.items[i].x, this.items[i].y, this.items[i].r);
  }
}
```

methods
=======

You have several simple helpers:

`cz1.clear();` to completly clear the scene. You can override this method with your customized clear method.

`cz1.beforeStart()` method that is called **once** just before start the paint loop.

`cz1.fullScreen();` to resize the canvas element to the dimmensions of the browser viewport.

`cz1.addMouseTracking();` to track mouse position inside the canvas element. You can access mouse coordinates at `cz1.mouse.x` and `cz1.mouse.y`;

`cz1.setFrameRate(framerate);` to set a painting framerate instead of paint the scene as many times as possible (the default option).

`cz1.addBuffer();` add an adittional buffer to the canvas object (that can be accesses throught `cz1.buffers` and `cz1.bctx`). Buffers are usefull to render "off screen" elements that you can _paste_ into main canvas later. This **_double-buffer_** technique it's usually much faster than painting everithing in the main canvas.

`cz1.saveCanvasToPng(optional_watermak_image_url);` opens a new browser window with am sceen capture of the current state of the canvas. You can define a watermark image. Adds and additional screen resize event to recalculate the dimmensions on browser resize.

drawing helpers
===============

Several helpers / aliases are provived to speed-up de sketches coding

```javascript
cz1.plot(x, y, radius); // Draws a simple point

cz1.circle(x, y, radius); // Draws circle

cz1.rect(x, y, width, height); // Rectangle with center in x, y

cz1.line(x1, y1, x2, y2); // Simple line
```
There are also some aliases for the painting styles on the main canvas.

```javascript
cz1.fS = '#f00'; // Alias for cz1.ctx.fillStyle = '#f00';

cz1.sS = '#f00'; // Alias for cz1.ctx.strokeStyle = '#f00';

cz1.lW = 2; // Alias for cz1.ctx.lineWidth = 2;

```

vars
====

`cz1.timer` object stores the time related vars and values. The most important are `cz1.timer.now` that stores the time passed since the animation was started, and `cz1.timer.lastFrame` (time passed since the previous frame was painted). All the time values are in miliseconds (ms).

`cz1.w, cz1.h` current width, height.

`cz1.center.x, cz1.center.y` vars store the center of the current canvas element (width/2, height/2), it's autocatically updated when you use `.fullScreen();`

demo
====

I recommend you to take a look to the demo, there you'll can see two simple usage examples.
