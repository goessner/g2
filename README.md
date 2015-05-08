# g2 #

## A 2D graphics command queue ##

### Introduction ###

**g2** is a tiny 2D graphics library based on the [command pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#commandpatternjavascript). It helps to build a [command queue](http://en.wikipedia.org/wiki/Command_queue) of graphics commands easily for later addressing the concrete rendering context and executing the commands in a compact time frame.

For getting a better understanding of the basic concepts an example always helps.

```javascript
<canvas id="c" width="300", height="200"></canvas>
<script src="g2.js"></script>
<script>
    var ctx = document.getElementById("c").getContext("2d"),
        g = g2();   // create g2 command queue object.

    g.p()        // begin path
     .m(100, 50) // moveTo
     .l(200, 50) // lineTo
     .l(200,150)
     .l(100,150)
	 .z()        // close path
     .drw();     // stroke and fill

    // do further calculations and ...
    // ... possibly add more graphics commands.

    g.exe(ctx);  // finally render graphics addressing 'ctx'.
</script>
```

*g2* supports the [*HTML5 canvas 2D context*](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) as the only renderer at current. And it is more than merely a thin wrapper around the canvas context.

*g2* helps in

* collecting graphics commands in a queue for fast and compact rendering at a later time.
* abstracting away the renderer *instance* as well as the renderer *api*.
* separating an applications *model* from its *view*.

Let's elaborate these points a little more.

Graphics intense applications as simulations and games often work with *back buffers* for improving the visual experience. A back buffer is a temporary invisible graphics context used to draw on during a certain time frame. On completion that graphics context simply is made visible. So a *g2* object, while at first collecting graphics commands and finally rendering them, acts similar to a back buffer.

A *g2* object is very loosely coupled with a graphics context. We can decide at the latest at rendering time, where to send the graphics commands stored in the queue to, or even send them to multiple different graphics contexts. Rendering the same graphics to a main window and in parallel to a small zoom-in window would be an example for this.

Assume a graphics application managing geometric shapes. The applications model will primarily consist of a container holding objects representing shapes. Discussing now the problem, how to render the shapes (the *view* in MVC speech) may lead to the demand, to strictly separate the model from the view. But then, who knows better how to draw a shape than the shape itself? One or multiple lightweight *g2* objects may act here as neutral mediators between the model's shapes and the graphics context, as in: "Show me how to draw yourself, I will hand this recipe over to a suitable renderer later!"


### Features ###

**g2** is basically two things: a small javascript library **and** a lightweight javascript object holding the command queue. The function call `g2()` works as a constructor without requiring `new`. (There are [controversial](http://javascript.crockford.com/prototypal.html) [discussions](http://www.2ality.com/2013/07/defending-constructors.html) on the web regarding this).

*g2* further supports

* method chaining.
* low level path commands with short names adopted from SVG.
  * `p,m,l,q,c,a,z`
* higher level element commands.
  * `rec,cir,lin,arc,ply,img,txt`
* styling parallel and in extension to the canvas context state.
  * `style`
* rendering commands.
  * `stroke,fill,drw,clr,grid`
* state stack for style properties and transformations.
  * `beg,end`
* managing the command queue.
  * `cpy,del,dump`
* reuse other *g2* objects.
  * `use`
* render the command queue to a graphics context.
  * `exe`
* an optional accompanying viewport object.

A more detailed exploration of these features follows.


### How the queue works ###
Every invokation of a `g2` command method stores an equivalent graphics context' function in `g2`'s command queue. Finally with the help of the `g2.exe` method the queue is handed over to a graphics context instance for rendering.

![img01]

The command queue is implemented as an array holding objects containing a function pointer and an optional arguments array. So the command queue of the example above looks like this:

```javascript
    [ {c:CanvasRenderingContext2D.prototype.beginPath},
      {c:CanvasRenderingContext2D.prototype.moveTo, a:[100,50]},
      {c:CanvasRenderingContext2D.prototype.lineTo, a:[200,50]},
      {c:CanvasRenderingContext2D.prototype.lineTo, a:[200,150]},
      {c:CanvasRenderingContext2D.prototype.lineTo, a:[100,150]},
	  {c:CanvasRenderingContext2D.prototype.closePath},
      {c:g2.prototype.drw.cmd} ]
```
Applying this array of Function objects to a specific canvas context results in only very little additional runtime cost (performing the loop and possibly invoking wrapper functions) and moderate additional memory cost (the queue) compared to directly addressing the canvas context:

```javascript
    ctx.beginPath();
    ctx.moveTo(100,50);
    ctx.lineTo(200,50);
    ctx.lineTo(200,150);
    ctx.lineTo(100,150);
    ctx.closePath();
    ctx.fill(); ctx.stroke();   // g2.prototype.drw.cmd
```

Once you have successfully built a command queue, you can apply it repeatedly to one or multiple graphics contexts via its `exe`-method.

### Path commands ###
*todo*

### Element commands ###
*todo*

### Styling ###
*todo*

### Rendering commands ###
*todo*

### Saving and restoring state ###
*todo*

### Managing the command queue ###
*todo*

### Multiple *g2* objects ###
* Copying
* Referencing
* Symbol libraries

### Multiple graphics contexts ###
* different viewports
* layers

### Animation ###
* don't forget `del`.
* don't forget `clr`.

### Accompanying viewport object ###
* cartesian coordinate system
* zoom and pan
* interactivity

### Extending *g2* ###
* using `cpy` command
* plugins



[img01]: ./img/g2-concept.png "g2 command queue"
