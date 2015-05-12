# g2 #

## A 2D graphics command queue ##


### Why ###

Who might need *yet another 2D graphics library* ? Well, *(non-software)* engineers and scientists want an easy way to create some prototypal - static or interactive - web based graphics. They want a simple and intuitive API fully documented on a single cheat sheet for comfortably extending the library to their special needs while .


### Introduction ###

**g2** is a tiny 2D graphics library based on the [command pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#commandpatternjavascript) principle. It helps to easily build a [command queue](http://en.wikipedia.org/wiki/Command_queue) of graphics commands for later addressing the concrete rendering context and executing the commands in a compact time frame.

Here is an example for getting a better understanding of **g2**'s basic concepts.

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
There are a few things to note:

* Only two objects `g2` and `ctx` are involved.
* A couple of graphics commands are invoked via the `g2` object.
* Both objects are nearly completely independent from each other. Only the last code line establishes a loose connection between them.



### How the queue works ###
Every invokation of a `g2` command method stores an equivalent graphics context - or custom function - in `g2`'s command queue. Finally with the help of the `g2.exe` method the queue is handed over to a graphics context instance for rendering.

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


### Features ###

**g2** is basically two things: a small javascript 2D graphics library **and** a lightweight javascript object holding the command queue. The function call `g2()` works as a constructor without requiring `new`. (There are [controversial](http://javascript.crockford.com/prototypal.html) [discussions](http://www.2ality.com/2013/07/defending-constructors.html) on the web about that).

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
* viewport initialization methods.
  * `cartesian,pan,zoom,trf`

A more detailed exploration of these features follows.


### Benefits ###

*g2* is more than merely a thin wrapper around the canvas context. It helps in

* collecting graphics commands in a queue for fast and compact rendering at a later time.
* decoupling the graphics commands from the renderer *instance* as well as abstracting away the renderer *api*.
* separating an applications *model* from its *view*.

Let's elaborate these points a little more.

##### Fast Rendering #####
Graphics intense applications like simulations and games often work with *back buffers* for improving the visual experience. A back buffer is a temporarily invisible graphics context used to draw on during a certain time frame. On completion that graphics context simply is made visible. A *g2* object, while at first collecting graphics commands and finally rendering them, acts similar to a back buffer.

##### Decoupling #####
A *g2* object is very loosely coupled with a graphics context. We can decide at the latest at rendering time, where to send the graphics commands stored in the queue to, or even send them to multiple different graphics contexts. Rendering the same graphics to a main window and in parallel to a small zoom-in window would be an example for this.

In parallel implementations (libraries) the same graphics commands can be used to address *SVG* or *webGL*.

*g2* supports the [*HTML5 canvas 2D context*](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) as the only renderer at current.

##### Separating Model from View #####
Assume a graphics application managing geometric shapes. The applications model will primarily consist of a container holding objects representing shapes. Discussing now the problem, how to render the shapes (the *view* in MVC speech) may lead to the demand, to strictly separate the model from the view.
```javascript
class Circle {
   constructor(x,y,r) { ... }
   render(g) {g.cir(this.x,this.y,this.r)}
}
class Rect {
   constructor(x,y,w,h) { ... }
   render(g) {g.rec(this.x,this.y,this.w,this.h)}
}

let model = [new Circle(1,2,3),new Rect(4,5,6,7),...],
    g = g2().grid().style(...),
    ctx1 = getElementById('c1').getContext('2d'), // view 1
    ctx2 = getElementById('c2').getContext('2d'), // view 2

for (let i of model)    // build command queue of ...
   shapes[i].render(g);  // ... model's shapes drawing commands.

g.exe(ctx1);  // render to view 1
g.exe(ctx2);  // render to view 2

```
But then, who knows better how to draw a shape than the shape itself? One or multiple lightweight *g2* objects may act here as neutral mediators between the model's shapes and the graphics context, as in: "Show me how to draw yourself, I will hand this recipe over to a suitable renderer later!"


### Accompanying viewport object ###
* cartesian coordinate system
* zoom and pan
* interactivity

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
#### Copying
*todo*
#### Referencing
Reusing graphics defined by other *g2* objects is easily achived via the `use` command. The graphics being reused can be positioned, rotated and scaled.

Syntax:
```javascript
use(g,x,y,ang,scl)
    {object} g Reference to 'g2' object
    {float}  x Position-x  [default 0]
    {float}  y Position-y  [default 0]
    {float}  ang Rotation angle  [default 0]
    {float}  scl Scaling factor  [default 1]
```
Please note, that the `g2.use` command intentionally only supports *uniform (isotropic) scaling*.

Example:
```javascript
var yinyang = g2().beg()
                    .cir(0,0,5)
                    .beg()
                      .style("fs","@ls")  // use current 'ls' as fillStyle ...
                      .p().m(0,-5).a(Math.PI,0,0).a(-Math.PI,0,5).a(-Math.PI,0,-5).z()
                      .fill()
                      .cir(0,-2.5,0.75)
                    .end()
                    .style("ls","@fs")   // use current 'fs' as lineStyle ...
                    .cir(0,2.5,0.75)
                  .end();
g2()
 .style("ls","#666","fs","#eee","lw",1,"lj","round")
 .use(yinyang,50,100,0,5)   // with scaling lineWidth
 .style("lw",2,"lwnosc",true)
 .use(yinyang,150,100,0,5)  // without scaling lineWidth
 .exe(document.getElementById("c").getContext("2d"));
```
Output: ![img-yinyang]

##### Symbol libraries
*todo*

### Multiple graphics contexts ###
* different viewports
* layers

### Animation ###
* don't forget `del`.
* don't forget `clr`.

### Extending *g2* ###
* using `cpy` command
* plugins



[img01]: ./img/g2-concept.png "g2 command queue"
[img-yinyang]: ./img/g2-yinyang.png "g2.use yinyang example"
