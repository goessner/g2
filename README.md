[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/goessner/g2/license.txt)
[![npm](https://img.shields.io/npm/v/g2d.svg)](https://www.npmjs.com/package/g2d)
[![npm](https://img.shields.io/npm/dt/g2d.svg)](https://www.npmjs.com/package/g2d)
[![no dependencies](https://img.shields.io/gemnasium/mathiasbynens/he.svg)](https://github.com/goessner/g2)

# g<sup>2</sup>

g<sup>2</sup> is a 2D graphics javascript library based on the [command pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#commandpatternjavascript) 
principle. Its main goal is to provide a simple API for users who want to generate 2D web graphics occasionally. 
So the API is minimal and easy to understand. The library is tiny, fast and renderer agnostic.

## Main features

* Fast and lightweight graphics command queue builder.
* Adressing HTML canvas 2D context as the default renderer.
* Generating SVG output using an [addon library](https://github.com/goessner/g2-svg).
* Method chaining.
* Support of cartesian coordinates.
* Viewport pan and zoom transformations.
* Low level path commands with short names adopted from SVG.
* Higher level element commands.
* Maintaining a state stack for styling and transformations.
* Easy way to build custom symbol libraries.
* Tiny footprint by 5kB compressed (gzip).
* No dependency.

## Minimal Example

```html
<canvas id="c" width="200", height="100"></canvas>
<script src="g2.js"></script>
<script>
    const ctx = document.getElementById("c").getContext("2d"); // define context
    g2().rec({x:40,y:30,b:120,h:40, // create g2 object, add rectangle
              ls:"green",fs:"orange",lw:3}) // with style properties.
        .exe(ctx);  // draw to canvas.
</script>
```
![first](/docs/img/g2-first.png)

## Documentation
  * [Getting started](../../wiki/getting-started)
  * [Concepts](../../wiki/concepts)
  * [Paths](../../wiki/paths)
  * [Elements](../../wiki/elements)
  * [State and Style](../../wiki/state-and-style)
  * [Reuse](../../wiki/reuse)
  * [View](../../wiki/view)
  * [Insert](../../wiki/insert)
  * [Animation](../../wiki/animation)
  * [Interactivity](../../wiki/interactivity)

## API Reference
See the [API Reference for g2](docs/api/g2.md) for details.

Also see the [API Reference for g2.ext](docs/api/g2.ext.md) and the [API Reference for g2.mec](docs/api/g2.mec.md).


## GitCDN
Use the link [https://www.gitcdn.xyz/repo/goessner/g2/master/src/g2.js](https://gitcdn.xyz/repo/goessner/g2/master/g2.min.js)
for getting the latest commit as a raw file.

In HTML use ...
```html
<script src="https://www.gitcdn.xyz/repo/goessner/g2/master/src/g2.js"></script>
```

## Cheat Sheet
Check out the single page [Cheat Sheet](api/sheet.pdf).


# License
g<sup>2</sup> is licensed under the terms of the MIT License.
