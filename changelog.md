# CHANGELOG
## [2.6.0]() on May 2020

### `g2.core.js`
* additional support of `{p}` property as alternative to `{x,y}` properties for referencing shared points/vectors.
* unknown symbol name with `use` results in drawing unknown symbol instead of runtime error.
* `{ldoff}` as linedash offset style property for line dash animation added. `
* Implicite element selecting and dragging capability removed.
* Boolean `{draggable}` property added, for explicitly indicating draggable elements.
### `g2.ext.js`
* code cleanup.
* `label` element deprecated.
* `mark` element deprecated.
* `label` property for most element types introduced.
* Handle element `hdl` with default `{draggable:true}` property added.
* `nod, nodfix, nodflt, pol, gnd, vec, dim, adim, origin` elements moved/ported from `g2.mec.js`.
### `g2.io.js`
* works again.
### `g2.selector.js` / `canvasinteractor.js` 
* `interactor.on('pan')`, `interactor.on('drag')` and  `interactor.on('wheel')` handling is moved out of the library and is now in the responsibility of the application (s. `g2.drag.html`).
* `hdl` elements can be used elegantly to interactively modify geometry. 

## [3.0.0]() on December 2020

### `g2.core.js`
* `g2.mixin` is replaced with `g2.mix`.

### `g2.ext.js`
* Symbols like `nod`, `origin` etc. are moved from `g2.mec` to `g2.ext`.
* Commands `vec`, `avec`, `dim`, `adim` are also moved.
* `label` is no command anymore, but a property on respective `g2` commands.
* `mark` is no command anymore, but a property on respective `g2` commands.

### `g2.chart.html.js`
* A new custom HTML element used for easy rendering of `g2.chart` commands.
