# g2

_g2_ is a 2D graphics javascript library based on the [command pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#commandpatternjavascript) 
principle. Its main goal is to provide a simple API for users who want to generate 2D web graphics occasionally. 
So the API is minimal and easy to understand. The library is tiny, fast and renderer agnostic.

## Main features

* Fast and lightweight graphics command queue builder.
* Adressing HTML canvas 2D context as the default renderer.
* Generating SVG output using an addon library.
* Method chaining.
* Optionally use cartesian coordinates.
* Setting viewport by pan and zoom transformation.
* Low level path commands with short names adopted from SVG.
* Higher level element commands.
* Maintaining a state stack for styling and transformations.
* Easy way to build custom symbol libraries.
* Tiny footprint by 5kB compressed (gzip).

## Example

```html
<canvas id="c" width="200", height="100"></canvas>
<script src="g2.js"></script>
<script>
    g2().style({ls:"green",fs:"orange",lw:3})  // create g2 object and add style command.
        .rec(40,30,120,40)                     // add rectangle command.
        .exe(document.getElementById("c").getContext("2d"));  // draw to canvas.
</script>
```
![first](img/g2-first.png)

## Documentation
  * [Getting started](wiki/Home)
  * [Concepts](../../wiki/concepts)
  * [Paths](../../wiki/paths)
  * [Elements](../../wiki/elements)
  * [Styles](../../wiki/styles)
  * [State](../../wiki/state)
  * [Viewport](../../wiki/viewport)
  * [Reuse](../../wiki/reuse)
  * [Renderers](../../wiki/renderers)

## API Reference
See the [API Reference!](api/readme.md) for details.

## Cheat Sheet
Check out the single page [Cheat Sheet!](api/sheet.pdf).
