<a name="g2"></a>

## g2 : <code>object</code>
Extensions.

**Kind**: global namespace  

* [g2](#g2) : <code>object</code>
    * [.spline(args)](#g2+spline) ⇒ <code>object</code>
    * [.label(args)](#g2+label) ⇒ <code>object</code>
    * [.mark(args)](#g2+mark) ⇒ <code>object</code>

<a name="g2+spline"></a>

### g2.spline(args) ⇒ <code>object</code>
Draw spline by points.Implementing a centripetal Catmull-Rom spline (thus avoiding cusps and self-intersections).Using iterator function for getting points from array by index.It must return current point object {x,y} or object {done:true}.Default iterator expects sequence of x/y-coordinates as a flat array [x,y,...],array of [[x,y],...] arrays or array of [{x,y},...] objects.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  
**See**

- https://pomax.github.io/bezierinfo
- https://de.wikipedia.org/wiki/Kubisch_Hermitescher_Spline


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| args | <code>object</code> |  | spline arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> |  | array of points. |
| [args.closed] | <code>bool</code> | <code>false</code> | closed spline. |

**Example**  
```js
g2().spline({pts:[100,50,50,150,150,150,100,50]})
```
<a name="g2+label"></a>

### g2.label(args) ⇒ <code>object</code>
Add label to certain elements.Please note that cartesian flag is necessary.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
| args | <code>object</code> | label arguments object. |
| args.str | <code>string</code> | label text |
| args.loc | <code>number</code> &#124; <code>string</code> | label location depending on referenced element.                     'c': centered, wrt. rec, cir, arc                     'beg','mid', 'end', wrt. lin                     'n', 'ne', 'e', 'se', 's', 'sw', 'w', or 'nw': cardinal directions |
| args.off | <code>number</code> | offset distance [optional]. |

**Example**  
```js
g2().view({cartesian:true}).cir({x:10,y:10,r:5}).label({str:'hello',loc:'s',off:10})
```
<a name="g2+mark"></a>

### g2.mark(args) ⇒ <code>object</code>
Draw marker on line element.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| args | <code>object</code> |  | Marker arguments object. |
| args.mrk | <code>object</code> &#124; <code>string</code> |  | `g2` object or `name` of mark in `symbol` namespace. |
| args.loc | <code>number</code> &#124; <code>string</code> |  | line parameter [0..1]<br>                                      line location ['beg','end','mid',..]. |
| [args.dir] | <code>int</code> | <code>0</code> | Direction:<br>                   -1 : negative tangent direction<br>                    0 : no orientation (rotation)<br>                    1 : positive tangent direction |

**Example**  
```js
g2().lin({x1:10,y1:10,x2:100,y2:10}).mark({mrk:"tick",loc:0.75,dir:1})
```
