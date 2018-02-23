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
![first](img/g2-first.png)

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
See the [API Reference](api/README.md) for details.


## GitCDN
Use the link [https://gitcdn.xyz/repo/goessner/g2/master/g2.min.js](https://gitcdn.xyz/repo/goessner/g2/master/g2.min.js)
for getting the latest commit as a raw file.

In HTML use ...
```html
<script src="https://gitcdn.xyz/repo/goessner/g2/master/g2.min.js"></script>
```

## Cheat Sheet
Check out the single page [Cheat Sheet](api/sheet.pdf).


# License
g<sup>2</sup> is licensed under the terms of the MIT License.


# Change Log

## 2.2.5 - 2016-08-04
### Added

* `earc` elliptical arc command added.

## 2.2.4 - 2016-07-01
### Modified

* `use` command execution simplified.
* styling bug with `g2.prototype.use` removed. 
* internal `g2.prototype.addCmd` simplified.

## 2.2.0 - 2016-06-20
### Added

* `g2.spline` performing 'centripetal Catmull-Rom' interpolation.

### Modified

* experimental `g2.State.hatch` fill style removed.
* `g2.prototype.ply.iterator`default iterators modified for improved efficiency and working also with splines.

## 2.1.1 - 2016-05-15

### Modified

* `g2.cor.js` + `g2.c2d.js` => `g2.js`  (reunited).
* `g2.context` namespace introduced.

## 2.1.0 - 2016-01-17

### Added

* `style` argument for elements `lin`,`rec`,`cir`,`arc`,`ply`.
* `style` as first argument for `stroke`,`fill` and `drw`, optionally followed by a svg path definition string.

### Changed

* State stack reimplemented.


## 1.1.0 - 2016-01-08

### Added

  CHANGELOG.md @goessner.


