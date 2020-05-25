# CHANGELOG
## [2.6.0]() on May 2020

### `g2.core.js`
* additional support of `{p}` property as alternative to `{x,y}` properties for referencing shared points/vectors.
* unknown symbol name with `use` results in drawing unknown symbol instead of runtime error.
* `{ldoff}` as linedash offset style property for line dash animation added. `
* Implicite element selecting and dragging capability removed.
* Boolean `{dragable}` property added, for explicitly indicating dragable elements.
### `g2.ext.js`
* code cleanup.
* `label` element deprecated.
* `mark` element deprecated.
* `label` property for most element types introduced.
* Handle element `hdl` with default `{dragable:true}` property added.
* `nod, nodfix, nodflt, pol, gnd, vec, dim, adim, origin` elements moved/ported from `g2.mec.js`.
### `g2.io.js`
* works again.
### `g2.selector.js` / `canvasinteractor.js` 
* `interactor.on('pan')`, `interactor.on('drag')` and  `interactor.on('wheel')` handling is moved out of the library and is now in the responsibility of the application (s. `g2.drag.html`).
* `hdl` elements can be used elegantly to interactively modify geometry. 
