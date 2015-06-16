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

    <canvas id="cnvz1" width="512" height="512"></canvas>

2. Inside the `domready` create an isntace of **canvaz**

    $(document).ready(function() {
      c1 = new Canvaz("#cnvz1");
      ...
    });

3. Define the `draw` method that will be called in each painting loop, if you want to do something just before drawing (clear the stage for instance) define `beforeDraw()` method too...

    c1.beforeDraw = function() {
      this.ctx.fillStyle = 'rgba(128,36,36,0.25)';
      this.ctx.fillRect(0, 0, this.w, this.h);
    }

    c1.draw = function () {
      for (var i in this.items) {
        this.items[i].update(this.mouse.x, this.mouse.y);
        this.ctx.fillStyle = this.items[i].color;
        this.plot(this.items[i].x, this.items[i].y, this.items[i].r);
      }
    }

helpers
=======

You have several simple helpers:

`c1.clear();` to completly clear the scene.

`c1.beforeStart()` method taht is called **once** just before start the paint loop.

`c1.fullScreen();` to resize the canvas element to the dimmensions of the browser viewport.

`c1.addMouseTracking();` to track mouse position inside the canvas element. You can access mouse coordinates at `c1.mouse.x` and `c1.mouse.y`;

`c1.setFrameRate(framerate);` to set a painting framerate instead of paint the scene as many times as possible (the default option).

`c1.addBuffer();` add an adittional buffer to the canvas object (that can be accesses throught `c1.buffers` and `c1.bctx`). Buffers are usefull to render "off screen" elements that you can "paste" into main canvas before. This **_double-buffer_** technique it's usually much faster than painting everithing in the main canvas.

vars
====

`c1.timer` object stores the time related vars and values. The most important are `c1.timer.now` that stores the time passed since the animatin started, and `c1.timer.lastFrame` (time passed since the previous frame was painted). All the time values are usually in miliseconds (ms).

demo
====

I recomend you to take a look to the demo, there you'll can see two simple usage examples.





