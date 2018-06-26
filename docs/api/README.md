<a name="g2"></a>

## g2 ⇒ <code>[g2](#g2)</code>
Create a 2D graphics command queue object. Call without using 'new'.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| [opts] | <code>object</code> | Custom options object. It is simply copied into the 'g2' instance, but not used from the g2 kernel. |

**Example**  
```js
var ctx = document.getElementById("c").getContext("2d");g2()                  // Create 'g2' instance. .lin(50,50,100,100)  // Append ... .lin(100,100,200,50) // ... commands. .exe(ctx);           // Execute commands addressing canvas context.
```

* [g2](#g2) ⇒ <code>[g2](#g2)</code>
    * _instance_
        * [.view()](#g2+view) ⇒ <code>object</code>
        * [.grid()](#g2+grid) ⇒ <code>object</code>
        * [.cir(x, y, r, w)](#g2+cir) ⇒ <code>object</code>
        * [.ell()](#g2+ell) ⇒ <code>object</code>
        * [.arc()](#g2+arc) ⇒ <code>object</code>
        * [.rec()](#g2+rec) ⇒ <code>object</code>
        * [.lin()](#g2+lin) ⇒ <code>object</code>
        * [.ply(x, y, w)](#g2+ply) ⇒ <code>object</code>
        * [.txt()](#g2+txt) ⇒ <code>object</code>
        * [.use()](#g2+use) ⇒ <code>object</code>
        * [.img()](#g2+img) ⇒ <code>object</code>
        * [.beg()](#g2+beg) ⇒ <code>object</code>
        * [.end()](#g2+end) ⇒ <code>object</code>
        * [.p()](#g2+p) ⇒ <code>object</code>
        * [.z()](#g2+z) ⇒ <code>object</code>
        * [.m()](#g2+m) ⇒ <code>object</code>
        * [.l()](#g2+l) ⇒ <code>object</code>
        * [.q()](#g2+q) ⇒ <code>object</code>
        * [.c()](#g2+c) ⇒ <code>object</code>
        * [.a()](#g2+a) ⇒ <code>object</code>
        * [.stroke()](#g2+stroke) ⇒ <code>object</code>
        * [.fill()](#g2+fill) ⇒ <code>object</code>
        * [.drw()](#g2+drw) ⇒ <code>object</code>
        * [.del()](#g2+del) ⇒ <code>object</code>
        * [.ins()](#g2+ins) ⇒ <code>object</code>
        * [.exe(ctx)](#g2+exe) ⇒ <code>object</code>
        * [.clr](#g2+clr) ⇒ <code>[g2](#g2)</code>
    * _static_
        * [.mixin()](#g2.mixin)

<a name="g2+view"></a>

### g2.view() ⇒ <code>object</code>
Set the view by placing origin coordinates and scaling factor in device unitsand make viewport cartesian.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | view arguments object. |
| [args.scl] | <code>number</code> | <code>1</code> | absolute scaling factor. |
| [args.x] | <code>number</code> | <code>0</code> | x-origin in device units. |
| [args.y] | <code>number</code> | <code>0</code> | y-origin in device units. |
| [args.cartesian] | <code>booean</code> | <code>false</code> | set cartesian flag. |

<a name="g2+grid"></a>

### g2.grid() ⇒ <code>object</code>
Draw grid.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | grid arguments object. |
| [args.color] | <code>string</code> | <code>&quot;&#x27;#ccc&#x27;&quot;</code> | change color. |
| [args.size] | <code>number</code> | <code>20</code> | change space between lines. |

<a name="g2+cir"></a>

### g2.cir(x, y, r, w) ⇒ <code>object</code>
Draw circle by center and radius.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | circle arguments object. |
| x | <code>number</code> | x-value center. |
| y | <code>number</code> | y-value center. |
| r | <code>number</code> | radius. |
| w | <code>number</code> | angle. |

**Example**  
```js
g2().cir({x:100,y:80,r:20})  // Draw circle.    .exe(ctx);               // Render to context.
```
<a name="g2+ell"></a>

### g2.ell() ⇒ <code>object</code>
Draw ellipse by center and radius for x and y.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | ellispe argument object. |
| args.x | <code>number</code> | x-value center. |
| args.y | <code>number</code> | y-value center. |
| args.rx | <code>number</code> | radius x-axys. |
| args.ry | <code>number</code> | radius y-axys. |
| args.w | <code>number</code> | start angle. |
| args.dw | <code>number</code> | angular range. |
| args.rot | <code>number</code> | rotation. |

**Example**  
```js
g2().ell({x:100,y:80,rx:20,ry:30,w:0,dw:2*Math.PI/4,rot:1})  // Draw circle.    .exe(ctx);               // Render to context.
```
<a name="g2+arc"></a>

### g2.arc() ⇒ <code>object</code>
Draw arc by center point, radius, start angle and angular range.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | arc arguments object. |
| args.x | <code>number</code> |  | x-value center. |
| args.y | <code>number</code> |  | y-value center. |
| args.r | <code>number</code> |  | radius. |
| [args.w] | <code>number</code> | <code>0</code> | start angle (in radian). |
| [args.dw] | <code>number</code> | <code>2*pi</code> | angular range in Radians. |

**Example**  
```js
g2().arc({x:300,y:400,r:390,w:-Math.PI/4,dw:-Math.PI/2})    .exe(ctx);
```
<a name="g2+rec"></a>

### g2.rec() ⇒ <code>object</code>
Draw rectangle by anchor point and dimensions.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | rectangle arguments object. |
| args.x | <code>number</code> | x-value upper left corner. |
| args.y | <code>number</code> | y-value upper left corner. |
| args.b | <code>number</code> | width. |
| args.h | <code>number</code> | height. |

**Example**  
```js
g2().rec({x:100,y:80,b:40,h:30}) // Draw rectangle.    .exe(ctx);                   // Render to context.
```
<a name="g2+lin"></a>

### g2.lin() ⇒ <code>object</code>
Draw line by start point and end point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | line arguments object. |
| args.x1 | <code>number</code> | start x coordinate. |
| args.y1 | <code>number</code> | start y coordinate. |
| args.x2 | <code>number</code> | end x coordinate. |
| args.y2 | <code>number</code> | end y coordinate. |

**Example**  
```js
g2().lin({x1:10,x2:10,y1:190,y2:10}) // Draw line.    .exe(ctx);                       // Render to context.
```
<a name="g2+ply"></a>

### g2.ply(x, y, w) ⇒ <code>object</code>
Draw polygon by points.Using iterator function for getting points from array by index.It must return current point object {x,y} or object {done:true}.Default iterator expects sequence of x/y-coordinates as a flat array [x,y,...],array of [[x,y],...] arrays or array of [{x,y},...] objects.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | polygon arguments object. |
| args.pts | <code>array</code> |  | array of points. |
| [args.closed] | <code>boolean</code> | <code>false</code> |  |
| x | <code>number</code> |  | start x coordinate. |
| y | <code>number</code> |  | start y coordinate. |
| w | <code>number</code> |  | angle. |

**Example**  
```js
g2().ply({pts:[100,50,120,60,80,70]}),    .ply({pts:[150,60],[170,70],[130,80]],closed:true}),    .ply({pts:[{x:160,y:70},{x:180,y:80},{x:140,y:90}]}),    .exe(ctx);
```
<a name="g2+txt"></a>

### g2.txt() ⇒ <code>object</code>
Draw text string at anchor point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | text arguments object. |
| args.s | <code>string</code> |  | text string. |
| [args.x] | <code>number</code> | <code>0</code> | x coordinate of text anchor position. |
| [args.y] | <code>number</code> | <code>0</code> | y coordinate of text anchor position. |
| [args.w] | <code>number</code> | <code>0</code> | w Rotation angle about anchor point with respect to positive x-axis. |

<a name="g2+use"></a>

### g2.use() ⇒ <code>object</code>
Reference g2 graphics commands from another g2 object.With this command you can reuse instances of grouped graphics commandswhile applying a similarity transformation and style properties on them.In fact you might want to build custom graphics libraries on top of that feature.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | use arguments object. |
| args.grp | <code>object</code> &#124; <code>string</code> |  | g2 source object or symbol name found in 'g2.symbol' namespace. |
| [args.x] | <code>number</code> | <code>0</code> | translation value x. |
| [args.y] | <code>number</code> | <code>0</code> | translation value y. |
| [args.w] | <code>number</code> | <code>0</code> | rotation angle (in radians). |
| [args.scl] | <code>number</code> | <code>1</code> | scale factor. |

**Example**  
```js
g2.symbol.cross = g2().lin({x1:5,y1:5,x2:-5,y2:-5}).lin({x1:5,y1:-5,x2:-5,y2:5});  // Define symbol.g2().use({grp:"cross",x:100,y:100})  // Draw cross at position 100,100.    .exe(ctx);                   // Render to context.
```
<a name="g2+img"></a>

### g2.img() ⇒ <code>object</code>
Draw image.This also applies to images of reused g2 objects. If an image can not be loaded, it will be replaced by a broken-image symbol.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | image arguments object. |
| args.uri | <code>string</code> |  | image uri or data:url. |
| [args.x] | <code>number</code> | <code>0</code> | x-coordinate of image (upper left). |
| [args.y] | <code>number</code> | <code>0</code> | y-coordinate of image (upper left). |
| [args.b] | <code>number</code> |  | width. |
| [args.h] | <code>number</code> |  | height. |
| [args.xoff] | <code>number</code> |  | x-offset. |
| [args.yoff] | <code>number</code> |  | y-offset. |
| [args.dx] | <code>number</code> |  | region x. |
| [args.dy] | <code>number</code> |  | region y. |

<a name="g2+beg"></a>

### g2.beg() ⇒ <code>object</code>
Begin subcommands. Current state is saved.Optionally apply transformation or style properties.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | beg arguments object. |
| [args.x] | <code>number</code> | <code>0</code> | translation value x. |
| [args.y] | <code>number</code> | <code>0</code> | translation value y. |
| [args.w] | <code>number</code> | <code>0</code> | rotation angle (in radians). |
| [args.scl] | <code>number</code> | <code>1</code> | scale factor. |
| [args.matrix] | <code>array</code> |  | matrix instead of single transform arguments (SVG-structure [a,b,c,d,x,y]). |

<a name="g2+end"></a>

### g2.end() ⇒ <code>object</code>
End subcommands. Previous state is restored.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Type | Description |
| --- | --- |
| <code>object</code> | end arguments object. |

<a name="g2+p"></a>

### g2.p() ⇒ <code>object</code>
Begin new path.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  
<a name="g2+z"></a>

### g2.z() ⇒ <code>object</code>
Close current path by straight line.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  
<a name="g2+m"></a>

### g2.m() ⇒ <code>object</code>
Move to point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | move arguments object. |
| args.x | <code>number</code> | move to x coordinate |
| args.y | <code>number</code> | move to y coordinate |

<a name="g2+l"></a>

### g2.l() ⇒ <code>object</code>
Create line segment to point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | line segment argument object. |
| args.x | <code>number</code> | x coordinate of target point. |
| args.y | <code>number</code> | y coordinate of target point. |

**Example**  
```js
g2().p()             // Begin path.    .m({x:0,y:50})   // Move to point.    .l({x:300,y:0})  // Line segment to point.    .l(x:400,y:100}) // ...    .stroke()        // Stroke path.    .exe(ctx);       // Render to context.
```
<a name="g2+q"></a>

### g2.q() ⇒ <code>object</code>
Create quadratic bezier curve segment to point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | quadratic curve arguments object. |
| args.x1 | <code>number</code> | x coordinate of control point. |
| args.y1 | <code>number</code> | y coordinate of control point. |
| args.x | <code>number</code> | x coordinate of target point. |
| args.y | <code>number</code> | y coordinate of target point. |

**Example**  
```js
g2().p()               // Begin path.    .m({x:0,y:0})            // Move to point.    .q({x1:200,y1:200,x:400,y:0})  // Quadratic bezier curve segment.    .stroke()          // Stroke path.    .exe(ctx);         // Render to context.
```
<a name="g2+c"></a>

### g2.c() ⇒ <code>object</code>
Create cubic bezier curve to point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | cubic curve arguments object. |
| args.x1 | <code>number</code> | x coordinate of first control point. |
| args.y1 | <code>number</code> | y coordinate of first control point. |
| args.x2 | <code>number</code> | x coordinate of second control point. |
| args.y2 | <code>number</code> | y coordinate of second control point. |
| args.x | <code>number</code> | x coordinate of target point. |
| args.y | <code>number</code> | y coordinate of target point. |

**Example**  
```js
g2().p()                        // Begin path.    .m({x:0,y:100})             // Move to point.    .c({x1:100,y1:200,x2:200,y2:0,x:400,y:100}) // Create cubic bezier curve.    .stroke()                   // Stroke path.    .exe(ctx);                  // Render to canvas context.
```
<a name="g2+a"></a>

### g2.a() ⇒ <code>object</code>
Draw arc with angular range to target point.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | arc arguments object. |
| args.dw | <code>number</code> | angular range in radians. |
| args.x | <code>number</code> | x coordinate of target point. |
| args.y | <code>number</code> | y coordinate of target point. |

**Example**  
```js
g2().p()            // Begin path.    .m({x:50,y:50})       // Move to point.    .a({dw:2,x:300,y:100})   // Create cubic bezier curve.    .stroke()       // Stroke path.    .exe(ctx);      // Render to canvas context.
```
<a name="g2+stroke"></a>

### g2.stroke() ⇒ <code>object</code>
Stroke the current path or path object.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | stroke arguments object. |
| [args.d] | <code>string</code> | SVG path definition string. Current path is ignored then. |

<a name="g2+fill"></a>

### g2.fill() ⇒ <code>object</code>
Fill the current path or path object.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | fill arguments object. |
| [args.d] | <code>string</code> | SVG path definition string. Current path is ignored then. |

<a name="g2+drw"></a>

### g2.drw() ⇒ <code>object</code>
Shortcut for stroke and fill the current path or path object.In case of shadow style, only the path interior creates shadow, not also the path contour.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | drw arguments object. |
| [args.d] | <code>string</code> | SVG path definition string.  Current path is ignored then. |

<a name="g2+del"></a>

### g2.del() ⇒ <code>object</code>
Delete all commands beginning from `idx` to end of command queue.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  
<a name="g2+ins"></a>

### g2.ins() ⇒ <code>object</code>
Call function between commands of the command queue.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | ins argument object. |
| [args.fn] | <code>function</code> | Function. |

**Example**  
```js
const node = { fill:'lime', g2() { return g2().cir({x:160,y:50,r:15,fs:this.fill,lw:4,sh:[8,8,8,"gray"]})} };let   color = 'red';g2().cir({x:40,y:50,r:15,fs:color,lw:4,sh:[8,8,8,"gray"]})   // draw red circle..ins(()=>{color='green'})                                    // color is now green..cir({x:80,y:50,r:15,fs:color,lw:4,sh:[8,8,8,"gray"]})       // draw green circle..ins((g)=>g.cir({x:120,y:50,r:15,fs:'orange',lw:4,sh:[8,8,8,"gray"]})) // draw orange circle.ins(node)       // draw node..exe(ctx)        // Render to canvas context.
```
<a name="g2+exe"></a>

### g2.exe(ctx) ⇒ <code>object</code>
Execute g2 commands. It does so automatically and recursively with 'use'ed commands.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>object</code> | Context. |

<a name="g2+clr"></a>

### g2.clr ⇒ <code>[g2](#g2)</code>
Clear viewport region.<br>

**Kind**: instance typedef of <code>[g2](#g2)</code>  
**Returns**: <code>[g2](#g2)</code> - this  
<a name="g2.mixin"></a>

### g2.mixin()
Replacement for Object.assign, as it does not assign getters and setter properly ...See https://medium.com/@benastontweet/mixins-in-javascript-700ec81f5e5c

**Kind**: static method of <code>[g2](#g2)</code>  
