<a name="g2"></a>

## g2 : <code>object</code>
Mechanical extensions.(Requires cartesian coordinates)

**Kind**: global namespace  

* [g2](#g2) : <code>object</code>
    * _instance_
        * [.dim()](#g2+dim) ⇒ <code>object</code>
        * [.adim()](#g2+adim) ⇒ <code>object</code>
        * [.vec()](#g2+vec) ⇒ <code>object</code>
        * [.slider()](#g2+slider) ⇒ <code>object</code>
        * [.spring()](#g2+spring) ⇒ <code>object</code>
        * [.damper()](#g2+damper) ⇒ <code>object</code>
        * [.link()](#g2+link) ⇒ <code>object</code>
        * [.link2()](#g2+link2) ⇒ <code>object</code>
        * [.beam()](#g2+beam) ⇒ <code>object</code>
        * [.beam2()](#g2+beam2) ⇒ <code>object</code>
        * [.bar()](#g2+bar) ⇒ <code>object</code>
        * [.bar2()](#g2+bar2) ⇒ <code>object</code>
        * [.pulley()](#g2+pulley) ⇒ <code>object</code>
        * [.pulley2()](#g2+pulley2) ⇒ <code>object</code>
        * [.rope()](#g2+rope) ⇒ <code>object</code>
        * [.ground()](#g2+ground) ⇒ <code>object</code>
        * [.load(spacing)](#g2+load) ⇒ <code>object</code>
        * [.pol()](#g2+pol)
    * _static_
        * [.State](#g2.State) : <code>object</code>

<a name="g2+dim"></a>

### g2.dim() ⇒ <code>object</code>
Dimension

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | dimension arguments object. |
| args.x1 | <code>number</code> |  | start x coordinate. |
| args.y1 | <code>number</code> |  | start y coordinate. |
| args.x2 | <code>number</code> |  | end x coordinate. |
| args.y2 | <code>number</code> |  | end y coordinate. |
| [args.inside] | <code>boolean</code> | <code>true</code> | draw dimension arrows between or outside of ticks. |

**Example**  
```js
g2().dim({x1:60,y1:40,x2:190,y2:120})
```
<a name="g2+adim"></a>

### g2.adim() ⇒ <code>object</code>
Angular dimension

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | angular dimension arguments. |
| args.x | <code>number</code> |  | start x coordinate. |
| args.y | <code>number</code> |  | start y coordinate. |
| args.r | <code>number</code> |  | radius |
| [args.w] | <code>number</code> | <code>0</code> | start angle (in radian). |
| [args.dw] | <code>number</code> | <code>Math.PI/2</code> | angular range in radian. In case of positive values it is running counterclockwise with                                       right handed (cartesian) coordinate system. |
| [args.inside] | <code>boolean</code> | <code>true</code> | draw dimension arrows between or outside of ticks. |

**Example**  
```js
g2().adim({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
```
<a name="g2+vec"></a>

### g2.vec() ⇒ <code>object</code>
Draw vector arrow.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | vector arguments object. |
| args.x1 | <code>number</code> | start x coordinate. |
| args.y1 | <code>number</code> | start y coordinate. |
| args.x2 | <code>number</code> | end x coordinate. |
| args.y2 | <code>number</code> | end y coordinate. |

**Example**  
```js
g2().vec({x1:50,y1:20,x2:250,y2:120})
```
<a name="g2+slider"></a>

### g2.slider() ⇒ <code>object</code>
Draw slider.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | slider arguments object. |
| args.x | <code>number</code> |  | start x coordinate. |
| args.y | <code>number</code> |  | start y coordinate. |
| [args.b] | <code>number</code> | <code>32</code> | slider breadth. |
| [args.h] | <code>number</code> | <code>16</code> | slider height. |
| [args.w] | <code>number</code> | <code>0</code> | rotation. |

**Example**  
```js
g2().slider({x:150,y:75,w:Math.PI/4,b:64,h:32})
```
<a name="g2+spring"></a>

### g2.spring() ⇒ <code>object</code>
Draw linear spring

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | linear spring arguments object. |
| args.x1 | <code>number</code> |  | start x coordinate. |
| args.y1 | <code>number</code> |  | start y coordinate. |
| args.x2 | <code>number</code> |  | end x coordinate. |
| args.y2 | <code>number</code> |  | end y coordinate. |
| [args.h] | <code>number</code> | <code>16</code> | Spring height. |

**Example**  
```js
g2().spring({x1:50,y1:100,x2:200,y2:75})
```
<a name="g2+damper"></a>

### g2.damper() ⇒ <code>object</code>
Draw line with centered square damper symbol.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | damper arguments object. |
| args.x1 | <code>number</code> |  | start x coordinate. |
| args.y1 | <code>number</code> |  | start y coordinate. |
| args.x2 | <code>number</code> |  | end x coordinate. |
| args.y2 | <code>number</code> |  | end y coordinate. |
| [args.h] | <code>number</code> | <code>16</code> | damper height.  * g2().damper({x1:60,y1:120,x2:200,y2:75}) |

<a name="g2+link"></a>

### g2.link() ⇒ <code>object</code>
Draw polygonial link.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | link arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> |  | array of points. |
| [args.closed] | <code>bool</code> | <code>false</code> | closed link. |
| args.x | <code>number</code> |  | start x coordinate. |
| args.y | <code>number</code> |  | start y coordinate. |
| [args.w] | <code>number</code> | <code>0</code> | angle. |

**Example**  
```js
let A = {x:50,y:25},B = {x:150,y:25},    C = {x:50,y:75}, D = {x:100,y:75},    E = {x:50,y:125};g2().view({cartesian:true})    .link({pts:[A,B,E,A,D,C]})
```
<a name="g2+link2"></a>

### g2.link2() ⇒ <code>object</code>
Draw alternate glossy polygonial link.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | link2 arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> |  | array of points. |
| [args.closed] | <code>bool</code> | <code>false</code> | closed link. |
| args.x | <code>number</code> |  | start x coordinate. |
| args.y | <code>number</code> |  | start y coordinate. |
| [args.w] | <code>number</code> | <code>0</code> | angle. |

**Example**  
```js
let A = {x:50,y:25},B = {x:150,y:25},    C = {x:50,y:75}, D = {x:100,y:75},    E = {x:50,y:125};g2().view({cartesian:true})    .link({pts:[A,B,E,A,D,C]})
```
<a name="g2+beam"></a>

### g2.beam() ⇒ <code>object</code>
Draw polygonial beam.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | beam arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> |  | array of points. |
| args.x | <code>number</code> |  | start x coordinate. |
| args.y | <code>number</code> |  | start y coordinate. |
| [args.w] | <code>number</code> | <code>0</code> | angle. |

**Example**  
```js
g2().view({cartesian})    .beam({pts:[[200,125][50,125][50,50][200,50]]})
```
<a name="g2+beam2"></a>

### g2.beam2() ⇒ <code>object</code>
Draw alternate glossy polygonial beam.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | beam2 arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> |  | array of points. |
| args.x | <code>number</code> |  | start x coordinate. |
| args.y | <code>number</code> |  | start y coordinate. |
| [args.w] | <code>number</code> | <code>0</code> | angle. |

**Example**  
```js
g2().view({cartesian})    .beam2({pts:[[200,125][50,125][50,50][200,50]]})
```
<a name="g2+bar"></a>

### g2.bar() ⇒ <code>object</code>
Draw bar.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | bar arguments object. |
| args.x1 | <code>number</code> | start x coordinate. |
| args.y1 | <code>number</code> | start y coordinate. |
| args.x2 | <code>number</code> | end x coordinate. |
| args.y2 | <code>number</code> | end y coordinate. |

**Example**  
```js
g2().bar({x1:50,y1:20,x2:250,y2:120})
```
<a name="g2+bar2"></a>

### g2.bar2() ⇒ <code>object</code>
Draw alternate glossy bar.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | bar2 arguments object. |
| args.x1 | <code>number</code> | start x coordinate. |
| args.y1 | <code>number</code> | start y coordinate. |
| args.x2 | <code>number</code> | end x coordinate. |
| args.y2 | <code>number</code> | end y coordinate. |

**Example**  
```js
g2().bar2({x1:50,y1:20,x2:250,y2:120})
```
<a name="g2+pulley"></a>

### g2.pulley() ⇒ <code>object</code>
Draw pulley.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | pulley arguments object. |
| args.x | <code>number</code> | x-value center. |
| args.y | <code>number</code> | y-value center. |
| args.r | <code>number</code> | radius. |
| args.w | <code>number</code> | angle. |

**Example**  
```js
g2().pulley({x:100,y:75,r:50})
```
<a name="g2+pulley2"></a>

### g2.pulley2() ⇒ <code>object</code>
Draw alternate pulley.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | pulley2 arguments object. |
| args.x | <code>number</code> | x-value center. |
| args.y | <code>number</code> | y-value center. |
| args.r | <code>number</code> | radius. |
| args.w | <code>number</code> | angle. |

**Example**  
```js
g2().pulley2({x:50,y:30,r:25})
```
<a name="g2+rope"></a>

### g2.rope() ⇒ <code>object</code>
Draw rope. Amount of pulley radii must be greater than 10 units. They are forced to zero otherwise.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | rope arguments object. |
| args.p1 | <code>object</code> &#124; <code>number</code> | starting point or Coordinate. |
| args.p2 | <code>object</code> &#124; <code>number</code> | end point or Coordinate. |
| args.r | <code>number</code> | radius of parent element. |

**Example**  
```js
let A = {x:50,y:30}, B = {x:200,y:75};g2().view({cartesian:true})    .pulley({...A,r:20})    .pulley2({...B,r:40})    .rope({p1:A,r1:20,p2:B,r2:40})
```
<a name="g2+ground"></a>

### g2.ground() ⇒ <code>object</code>
Polygon ground.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
|  | <code>object</code> |  | ground arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> |  | array of points. |
| [args.closed] | <code>bool</code> | <code>false</code> | closed polygon. |
| [args.h] | <code>number</code> | <code>4</code> | ground shade line width. |
| [args.pos] | <code>string</code> | <code>&quot;right&quot;</code> | ground shade position ['left','right']. |

**Example**  
```js
g2().ground({pts:[25,25,25,75,75,75,75,25,125,25],pos:'left'})
```
<a name="g2+load"></a>

### g2.load(spacing) ⇒ <code>object</code>
Polygonial line load. The first and last point define the base line onto whichthe load is acting orthogonal.

**Kind**: instance method of <code>[g2](#g2)</code>  
**Returns**: <code>object</code> - g2  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | load arguments object. |
| args.pts | <code>Array.&lt;object&gt;</code> &#124; <code>Array.&lt;Array.&lt;number&gt;&gt;</code> &#124; <code>Array.&lt;number&gt;</code> | array of points. |
| spacing | <code>real</code> | spacing of the vectors drawn as a positive real number, interprete as<br>                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>                       * spacing &gt; 1: length of spacing. |

<a name="g2+pol"></a>

### g2.pol()
Symbols.

**Kind**: instance method of <code>[g2](#g2)</code>  

| Param | Type | Description |
| --- | --- | --- |
|  | <code>object</code> | symbol arguments object. |
| args.x | <code>number</code> | x-value center. |
| args.y | <code>number</code> | y-value center. |

**Example**  
```js
g2().view({cartesian:true})    .pol({x:20,y:75})    .gnd({x:60,y:75})    .nod({x:100,y:75})    .dblnod({x:140,y:75})    .nodfix({x:180,y:75})    .nodflt({x:220,y:75})    .origin({x:260,y:75})
```
<a name="g2.State"></a>

### g2.State : <code>object</code>
Mechanical style values.Not really meant to get overwritten. But if you actually want, proceed.<br>Theses styles can be referenced using the comfortable '@' syntax.

**Kind**: static namespace of <code>[g2](#g2)</code>  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| State | <code>object</code> |  | `g2` state namespace. |
| State.nodcolor | <code>string</code> | <code>&quot;#333&quot;</code> | node color. |
| State.nodfill | <code>string</code> | <code>&quot;#dedede&quot;</code> | node fill color. |
| State.nodfill2 | <code>string</code> | <code>&quot;#aeaeae&quot;</code> | alternate node fill color, somewhat darker. |
| State.linkcolor | <code>string</code> | <code>&quot;#666&quot;</code> | link color. |
| State.linkfill | <code>string</code> | <code>&quot;rgba(200,200,200,0.5)&quot;</code> | link fill color, semi-transparent. |
| State.dimcolor | <code>string</code> | <code>&quot;darkslategray&quot;</code> | dimension color. |
| State.solid | <code>array</code> | <code>[]</code> | solid line style. |
| State.dash | <code>array</code> | <code>[15,10]</code> | dashed line style. |
| State.dot | <code>array</code> | <code>[4,4]</code> | dotted line style. |
| State.dashdot | <code>array</code> | <code>[25,6.5,2,6.5]</code> | dashdotted line style. |
| State.labelOffset | <code>number</code> | <code>5</code> | default label offset distance. |
| State.labelSignificantDigits | <code>number</code> | <code>3</code> | default label's significant digits after numbering point. |

