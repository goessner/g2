 ---
 "layout": "page",
 "title": "g2-Main page",
 "header": "Main Page",
 "date": "2020-06-01",
 "description": "microjam for g2",
 "uses": [ { "uri": "navigation.md" } ],
 "permalink": "#",
 "tags": []
 ---

[![License](http://img.shields.io/:license-mit-blue.svg)](https://github.com/goessner/g2/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/g2d.svg)](https://npmjs.com/package/g2d)
[![npm](https://img.shields.io/npm/dt/g2d.svg)](https://npmjs.com/package/g2d)
[![no dependencies](https://img.shields.io/gemnasium/mathiasbynens/he.svg)](https://github.com/goessner/g2)

g<sup>2</sup> is a 2D graphics javascript library based on the [command pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#commandpatternjavascript) 
principle. Its main goal is to provide a simple API for users who want to generate 2D web graphics occasionally. 
So the API is minimal and easy to understand. The library is tiny, fast and renderer agnostic.

## Main features

* Fast and lightweight graphics command queue builder.
* Addressing HTML canvas 2D context as the default renderer.
* Generating SVG output using an [addon library](https://github.com/goessner/g2-svg).
* Method chaining.
* Support of cartesian coordinates.
* Viewport pan and zoom transformations.
* Low-level path commands with short names adopted from SVG.
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
![first](/img/g2-first.png

## API Reference
See the [API Reference for g2](api/g2.core.md) for details.

Also see the [API Reference for g2.ext](api/g2.ext.md) and the [API Reference for g2.mec](api/g2.mec.md).

Also available under
 - [https://goessner.github.io/g2/api/g2.core](https://goessner.github.io/g2/api/g2.core)
 - [https://goessner.github.io/g2/api/g2.ext](https://goessner.github.io/g2/api/g2.ext)
 - [https://goessner.github.io/g2/api/g2.mec](https://goessner.github.io/g2/api/g2.mec)


## Cheat Sheet
Check out the single page [Cheat Sheet](docs/api/sheet.pdf).

Also available under [https://goessner.github.io/g2/api/sheet.pdf](https://goessner.github.io/g2/api/sheet.pdf)

## GitCDN
Use the link [https://cdn.jsdelivr.net/gh/goessner/g2/dist/g2.js](https://cdn.jsdelivr.net/gh/goessner/g2/dist/g2.js) for getting the latest commit as a raw file.

In HTML use ...
```html
<script src="https://cdn.jsdelivr.net/gh/goessner/g2/dist/g2.js"></script>
```

### Tests
Tests are found on the [Github Page](https://goessner.github.io/g2/)

# License
g<sup>2</sup> is licensed under the terms of the MIT License.