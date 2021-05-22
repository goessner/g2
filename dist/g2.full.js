
"use strict"

/**
 * g2.core (c) 2013-21 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 * @typedef {g2}
 * @param {object} [opts] Custom options object.
 * @description Create a 2D graphics command queue object. Call without using 'new'.
 * @returns {g2}
 * @example
 * const ctx = document.getElementById("c").getContext("2d");
 * g2()                                   // Create 'g2' instance.
 *     .lin({x1:50,y1:50,x2:100,y2:100})  // Append ...
 *     .lin({x1:100,y1:100,x2:200,y2:50}) // ... commands.
 *     .exe(ctx);                         // Execute commands addressing canvas context.
 */

function g2(opts) {
    let o = Object.create(g2.prototype);
    o.commands = [];
    if (opts) Object.assign(o, opts);
    return o;
}

g2.prototype = {
    /**
     * Clear viewport region.<br>
     * @method
     * @returns {object} g2
     */
    clr() { return this.addCommand({ c: 'clr' }); },

    /**
     * Set the view by placing origin coordinates and scaling factor in device units
     * and make viewport cartesian.
     * @method
     * @returns {object} g2
     * @param {object} - view arguments object.
     * @property {number} [scl=1] - absolute scaling factor.
     * @property {number} [x=0] - x-origin in device units.
     * @property {number} [y=0] - y-origin in device units.
     * @property {boolean} [cartesian=false] - set cartesian flag.
     */
    view({ scl, x, y, cartesian }) { return this.addCommand({ c: 'view', a: arguments[0] }); },

    /**
     * Draw grid.
     * @method
     * @returns {object} g2
     * @param {object} - grid arguments object.
     * @property {string} [color=#ccc] - change color.
     * @property {number} [size=20] - change space between lines.
     */
    grid({ color, size } = {}) { return this.addCommand({ c: 'grid', a: arguments[0] }); },

    /**
     * Draw circle by center and radius.
     * @method
     * @returns {object} g2
     * @param {object} - circle arguments object.
     * @property {number} x - x-value center.
     * @property {number} y - y-value center.
     * @property {number} r - radius.
     * @property {number} w - angle.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {array} [sh=[0,0,0,'transparent']]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @example
     * g2().cir({x:100,y:80,r:20})  // Draw circle.
     */
    cir({ x, y, r, w }) { return this.addCommand({ c: 'cir', a: arguments[0] }); },

    /**
     * Draw ellipse by center and radius for x and y.
     * @method
     * @returns {object} g2
     * @param {object} - ellispe argument object.
     * @property {number} x - x-value center.
     * @property {number} y - y-value center.
     * @property {number} rx - radius x-axys.
     * @property {number} ry - radius y-axys.
     * @property {number} w - start angle.
     * @property {number} dw - angular range.
     * @property {number} rot - rotation.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @example
     * g2().ell({x:100,y:80,rx:20,ry:30,w:0,dw:2*Math.PI/4,rot:1})  // Draw circle.
     */
    ell({ x, y, rx, ry, w, dw, rot }) { return this.addCommand({ c: 'ell', a: arguments[0] }); },

    /**
     * Draw arc by center point, radius, start angle and angular range.
     * @method
     * @returns {object} g2
     * @param {object} - arc arguments object.
     * @property {number} x - x-value center.
     * @property {number} y - y-value center.
     * @property {number} r - radius.
     * @property {number} [w=0] - start angle (in radian).
     * @property {number} [dw=2*pi] - angular range in Radians.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {string} [lc=butt] - line cap [`butt`, `round`, `square`].
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @example
     * g2().arc({x:300,y:400,r:390,w:-Math.PI/4,dw:-Math.PI/2})
     *     .exe(ctx);
     */
    arc({ x, y, r, w, dw }) { return this.addCommand({ c: 'arc', a: arguments[0] }); },

    /**
     * Draw rectangle by anchor point and dimensions.
     * @method
     * @returns {object} g2
     * @param {object} - rectangle arguments object.
     * @property {number} x - x-value upper left corner.
     * @property {number} y - y-value upper left corner.
     * @property {number} b - width.
     * @property {number} h - height.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {string} [lj='miter'] - line join [`round`, `bevel`, `miter`].
     * @property {number} [ml=10] - miter limit.
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @example
     * g2().rec({x:100,y:80,b:40,h:30}) // Draw rectangle.
     */
    rec({ x, y, b, h }) { return this.addCommand({ c: 'rec', a: arguments[0] }); },

    /**
     * Draw line by start point and end point.
     * @method
     * @returns {object} g2
     * @param {object} - line arguments object.
     * @property {number} x1 - start x coordinate.
     * @property {number} y1 - start y coordinate.
     * @property {number} x2 - end x coordinate.
     * @property {number} y2 - end y coordinate.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {string} [lc=butt] - line cap [`butt`, `round`, `square`].
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @example
     * g2().lin({x1:10,x2:10,y1:190,y2:10}) // Draw line.
     */
    lin({ x1, y1, x2, y2 }) { return this.addCommand({ c: 'lin', a: arguments[0] }); },

    /**
     * Draw polygon by points.
     * Using iterator function for getting points from array by index.
     * It must return current point object {x,y} or object {done:true}.
     * Default iterator expects sequence of x/y-coordinates as a flat array [x,y,...],
     * array of [[x,y],...] arrays or array of [{x,y},...] objects.
     * @method
     * @returns {object} g2
     * @param {object} - polygon arguments object.
     * @property {array} pts - array of points.
     * @property {string} [format] - format string of points array structure. Useful for handing over initial empty points array. One of `['x,y','[x,y]','{x,y}']`. Has precedence over `pts` content.
     * @property {boolean} [closed = false]
     * @property {number} x - start x coordinate.
     * @property {number} y - start y coordinate.
     * @property {number} w - angle.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {string} [lc=butt] - line cap [`butt`, `round`, `square`].
     * @property {string} [lj='miter'] - line join [`round`, `bevel`, `miter`].
     * @property {number} [ml=10] - miter limit.
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @example
     * g2().ply({pts:[100,50,120,60,80,70]}),
     *     .ply({pts:[150,60],[170,70],[130,80]],closed:true}),
     *     .ply({pts:[{x:160,y:70},{x:180,y:80},{x:140,y:90}]}),
     *     .exe(ctx);
     */
    ply({ pts, format, closed, x, y, w }) {
        arguments[0]._itr = format && g2.pntIterator[format](pts) || g2.pntItrOf(pts);
        return this.addCommand({ c: 'ply', a: arguments[0] });
    },

    /**
     * Draw text string at anchor point.
     * @method
     * @returns {object} g2
     * @param {object} - text arguments object.
     * @property {string} str - text string.
     * @property {number} [x=0] - x coordinate of text anchor position.
     * @property {number} [y=0] - y coordinate of text anchor position.
     * @property {number} [w=0] - w Rotation angle about anchor point with respect to positive x-axis.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @property {string} [thal='start']
     * - Text horizontal alignment [`'start'`,`'end'`,`'left'`,`'right'`,`'center'`]
     * @property {string} [tval='alphabetic']
     * - Text vertival alignment [`'top'`,`'hanging'`,`'middle'`,`'alphabetic'`,`'ideographic'`,`'bottom'`]
     * @property {string} [font='normal 14px serif'] -
     * [Font]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font}
     * [styling]{@link https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-font}
     */
    txt({ str, x, y, w }) { return this.addCommand({ c: 'txt', a: arguments[0] }); },

    /**
     * Reference g2 graphics commands from another g2 object or a predefined g2.symbol.
     * With this command you can reuse instances of grouped graphics commands
     * while applying a similarity transformation and style properties on them.
     * In fact you might want to build custom graphics libraries on top of that feature.
     * @method
     * @returns {object} g2
     * @param {object} - use arguments object.
     * @see {@link https://github.com/goessner/g2/blob/master/docs/api/g2.ext.md#g2symbol--object predefined symbols in g2.ext}
     * @property {object | string} grp - g2 source object or symbol name found in 'g2.symbol' namespace.
     * @property {number} [x=0] - translation value x.
     * @property {number} [y=0] - translation value y.
     * @property {number} [w=0] - rotation angle (in radians).
     * @property {number} [scl=1] - scale factor.
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {string} [lc=butt] - line cap [`butt`, `round`, `square`].
     * @property {string} [lj='miter'] - line join [`round`, `bevel`, `miter`].
     * @property {number} [ml=10] - miter limit.
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @property {string} [thal='start']
     * - Text horizontal alignment [`'start'`,`'end'`,`'left'`,`'right'`,`'center'`]
     * @property {string} [tval='alphabetic']
     * - Text vertival alignment [`'top'`,`'hanging'`,`'middle'`,`'alphabetic'`,`'ideographic'`,`'bottom'`]
     * @property {string} [font='normal 14px serif'] -
     * [Font]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font}
     * [styling]{@link https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-font}
     * @example
     * g2.symbol.cross = g2().lin({x1:5,y1:5,x2:-5,y2:-5}).lin({x1:5,y1:-5,x2:-5,y2:5});  // Define symbol.
     * g2().use({grp:"cross",x:100,y:100})  // Draw cross at position 100,100.
     */
    use({ grp, x, y, w, scl }) {
        if (grp && grp !== this) {     // avoid self reference ..
            if (typeof grp === "string") // must be a member name of the 'g2.symbol' namespace
                arguments[0].grp = g2.symbol[(grp in g2.symbol) ? grp : 'unknown'];
            this.addCommand({ c: 'use', a: arguments[0] });
        }
        return this;
    },

    /**
     * Draw image.
     * This also applies to images of reused g2 objects. If an image can not be loaded, it will be replaced by a broken-image symbol.
     * @method
     * @returns {object} g2
     * @param {object} - image arguments object.
     * @property {string} uri - image uri or data:url.
     * @property {number} [x = 0] - x-coordinate of image (upper left).
     * @property {number} [y = 0] - y-coordinate of image (upper left).
     * @property {number} [b = image.width] - width.
     * @property {number} [h = image.height] - height.
     * @property {number} [sx = 0] - source x-offset.
     * @property {number} [sy = 0] - source y-offset.
     * @property {number} [sb = image.width] - source width.
     * @property {number} [sh = image.height] - source height.
     * @property {number} [xoff = 0] - x-offset.
     * @property {number} [yoff = 0] - y-offset.
     * @property {number} [w = 0] - rotation angle (about upper left, in radians).
     * @property {number} [scl = 1] - image scaling.
     */
    img({ uri, x, y, b, h, sx, sy, sb, sh, xoff, yoff, w, scl }) { return this.addCommand({ c: 'img', a: arguments[0] }); },

    /**
     * Begin subcommands. Current state is saved.
     * Optionally apply transformation or style properties.
     * @method
     * @returns {object} g2
     * @param {object} - beg arguments object.
     * @property {number} [x = 0] - translation value x.
     * @property {number} [y = 0] - translation value y.
     * @property {number} [w = 0] - rotation angle (in radians).
     * @property {number} [scl = 1] - scale factor.
     * @property {array} [matrix] - matrix instead of single transform arguments (SVG-structure [a,b,c,d,x,y]).
     * @property {string} [fs=transparent] - fill color.
     * @property {string} [ls=black] - stroke color.
     * @property {string} [lw=1] - line width.
     * @property {string} [lc=butt] - line cap [`butt`, `round`, `square`].
     * @property {string} [lj='miter'] - line join [`round`, `bevel`, `miter`].
     * @property {number} [ml=10] - miter limit.
     * @property {array} [ld=[]] - line dash array.
     * @property {array} [sh=[0,0,0,"transparent"]]
     * shadow values [`x-offset`,`y-offset`,`blur`,`color`],
     * @property {string} [thal='start']
     * - text horizontal alignment [`'start'`,`'end'`,`'left'`,`'right'`,`'center'`]
     * @property {string} [tval='alphabetic']
     * - text vertival alignment [`'top'`,`'hanging'`,`'middle'`,`'alphabetic'`,`'ideographic'`,`'bottom'`]
     * @property {string} [font='normal 14px serif'] -
     * [Font]{@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/font}
     * [styling]{@link https://html.spec.whatwg.org/multipage/canvas.html#dom-context-2d-font}
     */
    beg({ x, y, w, scl, matrix } = {}) { return this.addCommand({ c: 'beg', a: arguments[0] }); },

    /**
     * End subcommands. Previous state is restored.
     * @method
     * @returns {object} g2
     * @param {object} - end arguments object.
     */
    end() { // ignore 'end' commands without matching 'beg'
        let myBeg = 1,
            findMyBeg = (cmd) => {   // care about nested beg...end blocks ...
                if (cmd.c === 'beg') myBeg--;
                else if (cmd.c === 'end') myBeg++;
                return myBeg === 0;
            }
        return g2.cmdIdxBy(this.commands, findMyBeg) !== false ? this.addCommand({ c: 'end' }) : this;
    },

    /**
     * Begin new path.
     * @method
     * @returns {object} g2
     */
    p() { return this.addCommand({ c: 'p' }); },

    /**
     * Close current path by straight line.
     * @method
     * @returns {object} g2
     */
    z() { return this.addCommand({ c: 'z' }); },

    /**
     * Move to point.
     * @method
     * @returns {object} g2
     * @param {object} - move arguments object.
     * @property {number} x - move to x coordinate
     * @property {number} y - move to y coordinate
     */
    m({ x, y }) { return this.addCommand({ c: 'm', a: arguments[0] }); },

    /**
     * Create line segment to point.
     * @method
     * @returns {object} g2
     * @param {object} - line segment argument object.
     * @property {number} x - x coordinate of target point.
     * @property {number} y - y coordinate of target point.
     * @example
     * g2().p()             // Begin path.
     *     .m({x:0,y:50})   // Move to point.
     *     .l({x:300,y:0})  // Line segment to point.
     *     .l({x:400,y:100}) // ...
     *     .stroke()        // Stroke path.
     */
    l({ x, y }) { return this.addCommand({ c: 'l', a: arguments[0] }); },

    /**
     * Create quadratic bezier curve segment to point.
     * @method
     * @returns {object} g2
     * @param {object} - quadratic curve arguments object.
     * @property {number} x1 - x coordinate of control point.
     * @property {number} y1 - y coordinate of control point.
     * @property {number} x - x coordinate of target point.
     * @property {number} y - y coordinate of target point.
     * @example
     * g2().p()                           // Begin path.
     *     .m({x:0,y:0})                  // Move to point.
     *     .q({x1:200,y1:200,x:400,y:0})  // Quadratic bezier curve segment.
     *     .stroke()                      // Stroke path.
     */
    q({ x1, y1, x, y }) { return this.addCommand({ c: 'q', a: arguments[0] }); },

    /**
     * Create cubic bezier curve to point.
     * @method
     * @returns {object} g2
     * @param {object} - cubic curve arguments object.
     * @property {number} x1 - x coordinate of first control point.
     * @property {number} y1 - y coordinate of first control point.
     * @property {number} x2 - x coordinate of second control point.
     * @property {number} y2 - y coordinate of second control point.
     * @property {number} x - x coordinate of target point.
     * @property {number} y - y coordinate of target point.
     * @example
     * g2().p()                        // Begin path.
     *     .m({x:0,y:100})             // Move to point.
     *     .c({x1:100,y1:200,x2:200,y2:0,x:400,y:100}) // Create cubic bezier curve.
     *     .stroke()                   // Stroke path.
     *     .exe(ctx);                  // Render to canvas context.
     */
    c({ x1, y1, x2, y2, x, y }) { return this.addCommand({ c: 'c', a: arguments[0] }); },

    /**
     * Draw arc with angular range to target point.
     * @method
     * @returns {object} g2
     * @param {object} - arc arguments object.
     * @property {number} dw - angular range in radians.
     * @property {number} x - x coordinate of target point.
     * @property {number} y - y coordinate of target point.
     * @example
     * g2().p()            // Begin path.
     *     .m({x:50,y:50})       // Move to point.
     *     .a({dw:2,x:300,y:100})   // Create arc segment.
     *     .stroke()       // Stroke path.
     *     .exe(ctx);      // Render to canvas context.
     */
    a({ dw, x, y }) {
        let prvcmd = this.commands[this.commands.length - 1];
        g2.cpyProp(prvcmd.a, 'x', arguments[0], '_xp');
        g2.cpyProp(prvcmd.a, 'y', arguments[0], '_yp');
        return this.addCommand({ c: 'a', a: arguments[0] });
    },

    /**
     * Stroke the current path or path object.
     * @method
     * @returns {object} g2
     * @param {object} - stroke arguments object.
     * @property {string} [d = undefined] - SVG path definition string. Current path is ignored then.
     */
    stroke({ d } = {}) { return this.addCommand({ c: 'stroke', a: arguments[0] }); },

    /**
     * Fill the current path or path object.
     * @method
     * @returns {object} g2
     * @param {object} - fill arguments object.
     * @property {string} [d = undefined] - SVG path definition string. Current path is ignored then.
     */
    fill({ d } = {}) { return this.addCommand({ c: 'fill', a: arguments[0] }); },

    /**
     * Shortcut for stroke and fill the current path or path object.
     * In case of shadow style, only the path interior creates shadow, not also the path contour.
     * @method
     * @returns {object} g2
     * @param {object} - drw arguments object.
     * @property {string} [d = undefined] - SVG path definition string.  Current path is ignored then.
     */
    drw({ d, lsh } = {}) { return this.addCommand({ c: 'drw', a: arguments[0] }); },

    /**
     * Delete all commands beginning from `idx` to end of command queue.
     * @method
     * @returns {object} g2
     */
    del(idx) { this.commands.length = idx || 0; return this; },

    /**
     * Call function between commands of the command queue.
     * @method
     * @returns {object} g2
     * @param {function} - ins argument function.
     * @example
     * const node = {
     *      fill:'lime',
     *      g2() { return g2().cir({x:160,y:50,r:15,fs:this.fill,lw:4,sh:[8,8,8,"gray"]}) }
     * };
     * let color = 'red';
     * g2().cir({x:40,y:50,r:15,fs:color,lw:4,sh:[8,8,8,"gray"]})   // draw red circle.
     *     .ins(()=>{color='green'})                                // color is now green.
     *     .cir({x:80,y:50,r:15,fs:color,lw:4,sh:[8,8,8,"gray"]})   // draw green circle.
     *     .ins((g) =>                                              // draw orange circle
     *          g.cir({x:120, y:50, r:15, fs:'orange', lw:4,sh:[8,8,8,"gray"]}))
     *     .ins(node)                                               // draw node.
     *     .exe(ctx)                                                // render to canvas context.
     */
    ins(arg) {
        return typeof arg === 'function' ? (arg(this) || this)                   // no further processing by handler ...
            : typeof arg === 'object' ? (this.commands.push({ a: arg }), this) // no explicit command name .. !
                : this;
    },
    /**
     * Execute g2 commands. It does so automatically and recursively with 'use'ed commands.
     * @method
     * @returns {object} g2
     * @param {object} ctx Context.
     */
    exe(ctx) {
        let handler = g2.handler(ctx);
        if (handler && handler.init(this))
            handler.exe(this.commands);
        return this;
    },
    // helpers ...
    addCommand({ c, a }) {
        if (a && Object.getPrototypeOf(a) === Object.prototype) {  // modify only pure argument objects 'a' .. !
            for (const key in a) {
                if (!Object.getOwnPropertyDescriptor(a, key).get    // if 'key' is no getter ...
                    && key[0] !== '_'                              // and no private property ... 
                    && typeof a[key] === 'function') {             // and a function ... make it a getter
                    Object.defineProperty(a, key, { get: a[key], enumerable: true, configurable: true, writabel: false });
                }
                if (typeof a[key] === 'string' && a[key][0] === '@') {  // referring values by neighbor id's
                    const refidIdx = a[key].indexOf('.');
                    const refid = refidIdx > 0 ? a[key].substr(1, refidIdx - 1) : '';
                    const refkey = refid ? a[key].substr(refidIdx + 1) : '';
                    const refcmd = refid ? () => this.commands.find((cmd) => cmd.a && cmd.a.id === refid) : undefined;

                    if (refcmd)
                        Object.defineProperty(a, key, {
                            get: function () {
                                const rc = refcmd();
                                return rc && (refkey in rc.a) ? rc.a[refkey] : 0;
                            },
                            enumerable: true,
                            configurable: true,
                            writabel: false
                        });
                }
            }
            if (g2.prototype[c].prototype) Object.setPrototypeOf(a, g2.prototype[c].prototype);
        }
        this.commands.push(arguments[0]);
        return this;
    }
};

// statics
g2.defaultStyle = { fs: 'transparent', ls: '#000', lw: 1, lc: "butt", lj: "miter", ld: [], ml: 10, sh: [0, 0], lsh: false, font: '14px serif', thal: 'start', tval: 'alphabetic' };
g2.styleRex = /^(fs|ls|lw|lc|lj|ld|ldoff|ml|sh|lsh|font|thal|tval)([-0-9].*)?$/,

g2.symbol = {
    unknown: g2().cir({ r: 12, fs: 'orange' }).txt({ str: '?', thal: 'center', tval: 'middle', font: 'bold 20pt serif' })
};
g2.handler = function (ctx) {
    let hdl;
    for (let h of g2.handler.factory)
        if ((hdl = h(ctx)) !== false)
            return hdl;
    return false;
}
g2.handler.factory = [];

// predefined polyline/spline point iterators
g2.pntIterator = {
    "x,y": function (pts) {
        function pitr(i) { return { x: pts[2 * i], y: pts[2 * i + 1] }; };
        Object.defineProperty(pitr, 'len', { get: () => pts.length / 2, enumerable: true, configurable: true, writabel: false });
        return pitr;
    },
    "[x,y]": function (pts) {
        function pitr(i) { return pts[i] ? { x: pts[i][0], y: pts[i][1] } : undefined; };
        Object.defineProperty(pitr, 'len', { get: () => pts.length, enumerable: true, configurable: true, writabel: false });
        return pitr;
    },
    "{x,y}": function (pts) {
        function pitr(i) { return pts[i]; };
        Object.defineProperty(pitr, 'len', { get: () => pts.length, enumerable: true, configurable: true, writabel: false });
        return pitr;
    }
};
g2.pntItrOf = function (pts) {
    return !(pts && pts.length) ? undefined
        : typeof pts[0] === "number" ? g2.pntIterator["x,y"](pts)
            : Array.isArray(pts[0]) && pts[0].length >= 2 ? g2.pntIterator["[x,y]"](pts)
                : typeof pts[0] === "object" && "x" in pts[0] && "y" in pts[0] ? g2.pntIterator["{x,y}"](pts)
                    : undefined;
};
/**
 * Get index of command resolving 'callbk' to 'true' starting from end of the queue walking back.<br>
 * Similar to 'Array.prototype.findIndex', only working reverse.
 * @private
 */
g2.cmdIdxBy = function (cmds, callbk) {
    for (let i = cmds.length - 1; i >= 0; i--)
        if (callbk(cmds[i], i, cmds))
            return i;
    return false;  // command with index '0' signals 'failing' ...
};

/**
 * Replacement for Object.assign, as it does not assign getters and setter properly ...
 * See https://github.com/tc39/proposal-object-getownpropertydescriptors
 * See https://medium.com/@benastontweet/mixins-in-javascript-700ec81f5e5c
 * Shallow copy of prototypes (think interfaces)
 * @private
 */
g2.mix = function mix(...protos) {
    let mixture = {};
    for (const p of protos)
        mixture = Object.defineProperties(mixture, Object.getOwnPropertyDescriptors(p));
    return mixture;
}

/**
 * Copy properties, even as getters .. a useful part of the above ..
 * @private
 */
g2.cpyProp = function (from, fromKey, to, toKey) { Object.defineProperty(to, toKey, Object.getOwnPropertyDescriptor(from, fromKey)); }

// Html canvas handler
g2.canvasHdl = function (ctx) {
    if (this instanceof g2.canvasHdl) {
        if (ctx instanceof CanvasRenderingContext2D) {
            this.ctx = ctx;
            this.cur = g2.defaultStyle;
            this.stack = [this.cur];
            this.matrix = [[1, 0, 0, 1, 0.5, 0.5]];
            this.gridBase = 2;
            this.gridExp = 1;
            return this;
        }
        else
            return null;
    }
    return g2.canvasHdl.apply(Object.create(g2.canvasHdl.prototype), arguments);
};
g2.handler.factory.push((ctx) => ctx instanceof g2.canvasHdl ? ctx
    : ctx instanceof CanvasRenderingContext2D ? g2.canvasHdl(ctx) : false);

g2.canvasHdl.prototype = {
    init(grp, style) {
        this.stack.length = 1;
        this.matrix.length = 1;
        this.initStyle(style ? Object.assign({}, this.cur, style) : this.cur);
        return true;
    },
    async exe(commands) {
        for (let cmd of commands) {
            // cmd.a is an object offering a `g2` method, so call it and execute its returned commands array.
            if (cmd.a && cmd.a.g2) {
                const cmds = cmd.a.g2().commands;
                // If false, ext was not applied to this cmd. But the command still renders
                if (cmds) {
                    this.exe(cmds);
                    continue;
                }
            }
            // cmd.a is a `g2` object, so directly execute its commands array.
            else if (cmd.a && cmd.a.commands) {
                this.exe(cmd.a.commands);
                continue;
            }
            if (cmd.c && this[cmd.c]) {         // explicit command name .. !
                const rx = this[cmd.c](cmd.a);
                if (rx && rx instanceof Promise) {
                    await rx;
                }
            }
        }
    },
    view({ x = 0, y = 0, scl = 1, cartesian = false }) {
        this.pushTrf(cartesian ? [scl, 0, 0, -scl, x, this.ctx.canvas.height - 1 - y]
            : [scl, 0, 0, scl, x, y]);
    },
    grid({ color = '#ccc', size } = {}) {
        let ctx = this.ctx, b = ctx.canvas.width, h = ctx.canvas.height,
            { x, y, scl } = this.uniTrf,
            sz = size || this.gridSize(scl),
            xoff = x % sz, yoff = y % sz;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = xoff, nx = b + 1; x < nx; x += sz) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
        for (let y = yoff, ny = h + 1; y < ny; y += sz) { ctx.moveTo(0, y); ctx.lineTo(b, y); }
        ctx.stroke();
        ctx.restore();
    },
    clr({ b, h } = {}) {
        let ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, b || ctx.canvas.width, h || ctx.canvas.height);
        ctx.restore();
    },
    cir({ r }) {
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        this.ctx.beginPath();
        this.ctx.arc(x || 0, y || 0, Math.abs(r), 0, 2 * Math.PI, true);
        this.drw(arguments[0]);
    },
    arc({ r, w = 0, dw = 2 * Math.PI }) {
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        if (Math.abs(dw) > Number.EPSILON && Math.abs(r) > Number.EPSILON) {
            this.ctx.beginPath();
            this.ctx.arc(x, y, Math.abs(r), w, w + dw, dw < 0);
            this.drw(arguments[0]);
        }
        else if (Math.abs(dw) < Number.EPSILON && Math.abs(r) > Number.EPSILON) {
            const cw = Math.cos(w), sw = Math.sin(w);
            this.ctx.beginPath();
            this.ctx.moveTo(x - r * cw, y - r * sw);
            this.ctx.lineTo(x + r * cw, y + r * sw);
        }
        //  else  // nothing to draw with r === 0
    },
    ell({ rx, ry, w = 0, dw = 2 * Math.PI, rot = 0 }) {
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, w, w + dw, dw < 0);
        this.drw(arguments[0]);
    },
    rec({ b, h }) {
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        const tmp = this.setStyle(arguments[0]);
        this.ctx.fillRect(x, y, b, h);
        this.ctx.strokeRect(x, y, b, h);
        this.resetStyle(tmp);
    },
    lin(args) {
        this.ctx.beginPath();
        this.ctx.moveTo(args.p1 && args.p1.x || args.x1 || 0, args.p1 && args.p1.y || args.y1 || 0);
        this.ctx.lineTo(args.p2 && args.p2.x || args.x2 || 0, args.p2 && args.p2.y || args.y2 || 0);
        this.stroke(args);
    },
    ply({ pts, closed, w = 0, _itr }) {
        if (_itr && _itr.len) {
            const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
            let p, i, len = _itr.len, istrf = !!(x || y || w), cw, sw;
            if (istrf) this.setTrf([cw = (w ? Math.cos(w) : 1), sw = (w ? Math.sin(w) : 0), -sw, cw, x, y]);
            this.ctx.beginPath();
            this.ctx.moveTo((p = _itr(0)).x, p.y);
            for (i = 1; i < len; i++)
                this.ctx.lineTo((p = _itr(i)).x, p.y);
            if (closed)  // closed then ..
                this.ctx.closePath();
            this.drw(arguments[0]);
            if (istrf) this.resetTrf();
            return i - 1;  // number of points ..
        }
        return 0;
    },
    txt({ str, w = 0/*,unsizable*/ }) {
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        const tmp = this.setStyle(arguments[0]),
            sw = w ? Math.sin(w) : 0,
            cw = w ? Math.cos(w) : 1,
            trf = this.isCartesian ? [cw, sw, sw, -cw, x, y]
                : [cw, sw, -sw, cw, x, y];
        this.setTrf(trf);  // this.setTrf(unsizable ? this.concatTrf(this.unscaleTrf({x,y}),trf) : trf);
        if (this.ctx.fillStyle === 'rgba(0, 0, 0, 0)') {
            this.ctx.fillStyle = this.ctx.strokeStyle;
            tmp.fs = 'transparent';
        }
        this.ctx.fillText(str, 0, 0);
        this.resetTrf();
        this.resetStyle(tmp);
    },
    errorImageStr: "data:image/gif;base64,R0lGODlhHgAeAKIAAAAAmWZmmZnM/////8zMzGZmZgAAAAAAACwAAAAAHgAeAEADimi63P5ryAmEqHfqPRWfRQF+nEeeqImum0oJQxUThGaQ7hSs95ezvB4Q+BvihBSAclk6fgKiAkE0kE6RNqwkUBtMa1OpVlI0lsbmFjrdWbMH5Tdcu6wbf7J8YM9H4y0YAE0+dHVKIV0Efm5VGiEpY1A0UVMSBYtPGl1eNZhnEBGEck6jZ6WfoKmgCQA7",
    images: Object.create(null),
    async loadImage(uri) {
        const download = async (xuri) => {
            const pimg = new Promise((resolve, reject) => {
                let img = new Image();
                img.src = xuri;
                function error(err) {
                    img.removeEventListener('load', load);
                    img = undefined;
                    reject(err);
                };
                function load() {
                    img.removeEventListener('error', error);
                    resolve(img);
                    img = undefined;
                };
                img.addEventListener('error', error, { once: true });
                img.addEventListener('load', load, { once: true });
            });

            try {
                return await pimg;
            } catch (err) {
                // console.warn(`failed to (pre-)load image; '${xuri}'`, err);
                if (xuri === this.errorImageStr) {
                    throw err;
                } else {
                    return await download(this.errorImageStr);
                }
            }
        }

        let img = this.images[uri];
        if (img !== undefined) {
            return img instanceof Promise ? await img : img;
        }
        img = download(uri);
        this.images[uri] = img;
        try {
            img = await img;
        } finally {
            this.images[uri] = img;
        }
        return img;
    },
    async img({ uri, x = 0, y = 0, b, h, sx = 0, sy = 0, sb, sh, xoff = 0, yoff = 0, w = 0, scl = 1 }) {
        const img_ = await this.loadImage(uri);
        this.ctx.save();
        const cart = this.isCartesian ? -1 : 1;
        sb = sb || img_.width;
        b = b || img_.width;
        sh = (sh || img_.height);
        h = (h || img_.height) * cart;
        yoff *= cart;
        w *= cart;
        y = this.isCartesian ? -(y / scl) + sy : y / scl;
        const [cw, sw] = [Math.cos(w), Math.sin(w)];
        this.ctx.scale(scl, scl * cart);
        this.ctx.transform(cw, sw, -sw, cw, x / scl, y);
        this.ctx.drawImage(img_, sx, sy, sb, sh, xoff, yoff, b, h);
        this.ctx.restore();
    },
    use({ grp }) {
        this.beg(arguments[0]);
        this.exe(grp.commands);
        this.end();
    },
    beg({ w = 0, scl = 1, matrix/*,unsizable*/ } = {}) {
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        let trf = matrix;
        if (!trf) {
            let ssw, scw;
            ssw = w ? Math.sin(w) * scl : 0;
            scw = w ? Math.cos(w) * scl : scl;
            trf = [scw, ssw, -ssw, scw, x, y];
        }
        this.pushStyle(arguments[0]);
        this.pushTrf(trf);  // this.pushTrf(unsizable ? this.concatTrf(this.unscaleTrf({x,y}),trf) : trf);
    },
    end() {
        this.popTrf();
        this.popStyle();
    },
    p() { this.ctx.beginPath(); },
    z() { this.ctx.closePath(); },
    m({ x, y }) { this.ctx.moveTo(x, y); },
    l({ x, y }) { this.ctx.lineTo(x, y); },
    q({ x, y, x1, y1 }) { this.ctx.quadraticCurveTo(x1, y1, x, y); },
    c({ x, y, x1, y1, x2, y2 }) { this.ctx.bezierCurveTo(x1, y1, x2, y2, x, y); },
    a({ dw, k, phi, _xp, _yp }) {  // todo: fix elliptical arc bug ...
        const { x = 0, y = 0 } = arguments[0].p !== undefined ? arguments[0].p : arguments[0];
        if (k === undefined) k = 1;  // ratio r1/r2
        if (Math.abs(dw) > Number.EPSILON) {
            if (k === 1) { // circular arc ...
                let x12 = x - _xp, y12 = y - _yp;
                let tdw_2 = Math.tan(dw / 2),
                    rx = (x12 - y12 / tdw_2) / 2, ry = (y12 + x12 / tdw_2) / 2,
                    R = Math.hypot(rx, ry),
                    w = Math.atan2(-ry, -rx);
                this.ctx.ellipse(_xp + rx, _yp + ry, R, R, 0, w, w + dw, this.cartesian ? dw > 0 : dw < 0);
            }
            else { // elliptical arc .. still buggy .. !
                if (phi === undefined) phi = 0;
                let x1 = dw > 0 ? _xp : x,
                    y1 = dw > 0 ? _yp : y,
                    x2 = dw > 0 ? x : _xp,
                    y2 = dw > 0 ? y : _yp;
                let x12 = x2 - x1, y12 = y2 - y1,
                    _dw = (dw < 0) ? dw : -dw;
                //  if (dw < 0) dw = -dw;   // test for bugs .. !
                let cp = phi ? Math.cos(phi) : 1, sp = phi ? Math.sin(phi) : 0,
                    dx = -x12 * cp - y12 * sp, dy = -x12 * sp - y12 * cp,
                    sdw_2 = Math.sin(_dw / 2),
                    R = Math.sqrt((dx * dx + dy * dy / (k * k)) / (4 * sdw_2 * sdw_2)),
                    w = Math.atan2(k * dx, dy) - _dw / 2,
                    x0 = x1 - R * Math.cos(w),
                    y0 = y1 - R * k * Math.sin(w);
                this.ctx.ellipse(x0, y0, R, R * k, phi, w, w + dw, this.cartesian ? dw > 0 : dw < 0);
            }
        }
        else
            this.ctx.lineTo(x, y);
    },

    stroke({ d } = {}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.stroke(new Path2D(d)) : this.ctx.stroke();  // SVG path syntax
        this.resetStyle(tmp);
    },
    fill({ d } = {}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.fill(new Path2D(d)) : this.ctx.fill();  // SVG path syntax
        this.resetStyle(tmp);
    },
    drw({ d, lsh } = {}) {
        let ctx = this.ctx,
            tmp = this.setStyle(arguments[0]),
            p = d && new Path2D(d);   // SVG path syntax
        d ? ctx.fill(p) : ctx.fill();
        if (ctx.shadowColor !== 'rgba(0, 0, 0, 0)' && ctx.fillStyle !== 'rgba(0, 0, 0, 0)' && !lsh) {
            let shc = ctx.shadowColor;        // usually avoid stroke shadow when filling ...
            ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            d ? ctx.stroke(p) : ctx.stroke();
            ctx.shadowColor = shc;
        }
        else
            d ? ctx.stroke(p) : ctx.stroke();
        this.resetStyle(tmp);
    },

    // State management (transform & style)
    // getters & setters
    get: {
        fs: (ctx) => ctx.fillStyle,
        ls: (ctx) => ctx.strokeStyle,
        lw: (ctx) => ctx.lineWidth,
        lc: (ctx) => ctx.lineCap,
        lj: (ctx) => ctx.lineJoin,
        ld: (ctx) => ctx.getLineDash(),
        ldoff: (ctx) => ctx.lineDashOffset,
        ml: (ctx) => ctx.miterLimit,
        sh: (ctx) => [ctx.shadowOffsetX || 0, ctx.shadowOffsetY || 0,
        ctx.shadowBlur || 0, ctx.shadowColor || 'black'],
        font: (ctx) => ctx.font,
        thal: (ctx) => ctx.textAlign,
        tval: (ctx) => ctx.textBaseline,
    },
    set: {
        fs: (ctx, q) => { ctx.fillStyle = q; },
        ls: (ctx, q) => { ctx.strokeStyle = q; },
        lw: (ctx, q) => { ctx.lineWidth = q; },
        lc: (ctx, q) => { ctx.lineCap = q; },
        lj: (ctx, q) => { ctx.lineJoin = q; },
        ld: (ctx, q) => { ctx.setLineDash(q); },
        ldoff: (ctx, q) => { ctx.lineDashOffset = q; },
        ml: (ctx, q) => { ctx.miterLimit = q; },
        sh: (ctx, q) => {
            if (q) {
                ctx.shadowOffsetX = q[0] || 0;
                ctx.shadowOffsetY = q[1] || 0;
                ctx.shadowBlur = q[2] || 0;
                ctx.shadowColor = q[3] || 'black';
            }
        },
        font: (ctx, q) => { ctx.font = q; },
        thal: (ctx, q) => { ctx.textAlign = q; },
        tval: (ctx, q) => { ctx.textBaseline = q; }
    },
    initStyle(style) {
        for (const key in style)
            if (this.get[key] && this.get[key](this.ctx) !== style[key])
                this.set[key](this.ctx, style[key]);
    },
    setStyle(style) {  // short circuit style setting
        let q, prv = {};
        for (const key in style) {
            if (this.get[key]) {  // style keys only ...
                let keyval = style[key];
                if (typeof style[key] === 'string' && style[key][0] === '@') {
                    // also check inherited styles ...
                    const ref = style[key].substr(1);
                    keyval = g2.symbol[ref] || ref in this.get && this.get[ref](this.ctx)
                                            || ref in this.cur && this.cur[ref];
                }
                if ((q = this.get[key](this.ctx)) !== keyval) {
                    prv[key] = q;
                    this.set[key](this.ctx, keyval);
                }
            }
        }
        return prv;
    },
    resetStyle(style) {   // short circuit style reset
        for (const key in style)
            this.set[key](this.ctx, style[key]);
    },
    pushStyle(style) {
        let cur = {};  // hold changed properties ...
        for (const key in style)  // allow extended style syntax ('fs-2', ...)
            if (g2.styleRex.test(key)) {  // (extended) style keys only ...
                if (typeof style[key] === 'string' && style[key][0] === '@') {
                    let ref = style[key].substr(1);
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](this.ctx);
                }
                if (this.cur[key] !== style[key]) {
                    if (key in this.set)
                        this.set[key](this.ctx, style[key]);
                    cur[key] = style[key];
                }
            }
        this.stack.push(this.cur = Object.assign({}, this.cur, cur));
    },
    popStyle() {
        let cur = this.stack.pop();
        this.cur = this.stack[this.stack.length - 1];
        for (const key in this.cur)
            if (this.get[key] && this.cur[key] !== cur[key])
                this.set[key](this.ctx, this.cur[key]);
    },
    concatTrf(q, t) {
        return [
            q[0] * t[0] + q[2] * t[1],
            q[1] * t[0] + q[3] * t[1],
            q[0] * t[2] + q[2] * t[3],
            q[1] * t[2] + q[3] * t[3],
            q[0] * t[4] + q[2] * t[5] + q[4],
            q[1] * t[4] + q[3] * t[5] + q[5]
        ];
    },
    initTrf() {
        this.ctx.setTransform(...this.matrix[0]);
    },
    setTrf(t) {
        this.ctx.setTransform(...this.concatTrf(this.matrix[this.matrix.length - 1], t));
    },
    resetTrf() {
        this.ctx.setTransform(...this.matrix[this.matrix.length - 1]);
    },
    pushTrf(t) {
        let q_t = this.concatTrf(this.matrix[this.matrix.length - 1], t);
        this.matrix.push(q_t);
        this.ctx.setTransform(...q_t);
    },
    popTrf() {
        this.matrix.pop();
        this.ctx.setTransform(...this.matrix[this.matrix.length - 1]);
    },
    get isCartesian() {  // det of mat2x2 < 0 !
        let m = this.matrix[this.matrix.length - 1];
        return m[0] * m[3] - m[1] * m[2] < 0;
    },
    get uniTrf() {
        let m = this.matrix[this.matrix.length - 1];
        return { x: m[4], y: m[5], scl: Math.hypot(m[0], m[1]), cartesian: m[0] * m[3] - m[1] * m[2] < 0 };
    },
    unscaleTrf({ x, y }) {  // remove scaling effect (make unzoomable with respect to (x,y))
        let m = this.matrix[this.matrix.length - 1],
            invscl = 1 / Math.hypot(m[0], m[1]);
        return [invscl, 0, 0, invscl, (1 - invscl) * x, (1 - invscl) * y];
    },
    gridSize(scl) {
        let base = this.gridBase, exp = this.gridExp, sz;
        while ((sz = scl * base * Math.pow(10, exp)) < 14 || sz > 35) {
            if (sz < 14) {
                if (base == 1) base = 2;
                else if (base == 2) base = 5;
                else if (base == 5) { base = 1; exp++; }
            }
            else {
                if (base == 1) { base = 5; exp--; }
                else if (base == 2) base = 1;
                else if (base == 5) base = 2;
            }
        }
        this.gridBase = base;
        this.gridExp = exp;
        return sz;
    }
}

/**
 * g2.lib (c) 2013-17 Stefan Goessner
 * geometric constants and higher functions
 * @license MIT License
 * @link https://github.com/goessner/g2
 */
"use strict"

var g2 = g2 || {};  // for standalone usage ...

g2 = Object.assign(g2, {
    EPS: Number.EPSILON,
    PI: Math.PI,
    PI2: 2*Math.PI,
    SQRT2: Math.SQRT2,
    SQRT2_2: Math.SQRT2/2,
    /**
     * Map angle to the range [0 .. 2*pi].
     * @param {number} w Angle in radians.
     * @returns {number} Angle in radians in interval [0 .. 2*pi].
     */
    toPi2(w) { return (w % g2.PI2 + g2.PI2) % g2.PI2; },
    /**
     * Map angle to the range [-pi .. pi].
     * @param {number} w Angle in radians.
     * @returns {number} Angle in radians in interval [-pi .. pi].
     */
    toPi(w) { return (w = (w % g2.PI2 + g2.PI2) % g2.PI2) > g2.PI ? w - g2.PI2 : w; },
    /**
     * Map angle to arc sector [w0 .. w0+dw].
     * @param {number} w Angle in range [0 .. 2*pi].
     * @param {number} w0 Start angle in range [0 .. 2*pi].
     * @param {number} dw angular range in radians. Can be positive or negative.
     * @returns {number} Normalised angular parameter lambda.
     * '0' corresponds to w0 and '1' to w0+dw. To reconstruct an angle from
     *   the return parameter lambda use: w = w0 + lambda*dw.
     */
    toArc: function(w,w0,dw) {
        if (dw > g2.EPS || dw < -g2.EPS) {
            if      (w0 > w && w0+dw > g2.PI2) w0 -= g2.PI2;
            else if (w0 < w && w0+dw < 0)      w0 += g2.PI2;
            return (w-w0)/dw;

        }
        return 0;
    },
    /**
     * Test, if point is located on line.
     * @param {x,y} point to test.
     * @param {x1,y1} start point of line.
     * @param {x2,y2} end point of line.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnLin({x,y},p1,p2,eps=Number.EPSILON) {
        let dx = p2.x - p1.x, dy = p2.y - p1.y, dx2 = x - p1.x, dy2 = y - p1.y,
            dot = dx*dx2 + dy*dy2, perp = dx*dy2 - dy*dx2, len = Math.hypot(dx,dy), epslen = eps*len;
        return -epslen < perp && perp < epslen && -epslen < dot && dot < len*(len+eps);
    },
    /**
     * Test, if point is located on circle circumference.
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnCir({x:xp,y:yp},{x,y,r},eps=Number.EPSILON) {
        let dx = xp - x, dy = yp - y,
            ddis = dx*dx + dy*dy - r*r, reps = eps*r;
        return -reps < ddis && ddis < reps;
    },
    /**
     * Test, if point is located on a circular arc.
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnArc({x:xp,y:yp},{x,y,r,w,dw},eps=Number.EPSILON) {
        var dx = xp - x, dy = yp - y, dist = Math.hypot(dx,dy),
            mu = g2.toArc(g2.toPi2(Math.atan2(dy,dx)),g2.toPi2(w),dw);
        return r*Math.abs(dw) > eps && Math.abs(dist-r) < eps && mu >= 0 && mu <= 1;
    },
    /**
     * Test, if point is located on a polygon line.
     * @param {x,y} point to test.
     * @param {pts,closed} polygon.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnPly({x,y},{pts,closed},eps=Number.EPSILON) {
    //  console.log(pts)
        for (var i=0,n=pts.length; i<(closed ? n : n-1); i++)
            if (g2.isPntOnLin({x,y},pts[i],pts[(i+1)%n],eps))
                return true;
        return false;
    },
    /**
     * Test, if point is located on a box. A box in contrast to a rectangle
     * is always aligned parallel to coordinate system axes, with its
     * local origin `{x,y}` located in the center. The dimensions `{b,h}` are
     * half size dimensions (so upper right corner is {x+b,y+h}).
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnBox({x:xp,y:yp},{x,y,b,h},eps=Number.EPSILON) {
        var dx = x.p - x, dy = yp - y;
        return dx >=  b-eps && dx <=  b+eps && dy <=  h+eps && dy >= -h-eps
            || dx >= -b-eps && dx <=  b+eps && dy <=  h+eps && dy >=  h-eps
            || dx >= -b-eps && dx <= -b+eps && dy <=  h+eps && dy >= -h-eps
            || dx >= -b-eps && dx <=  b+eps && dy <= -h+eps && dy >= -h-eps;
    },
    /**
     * Test, if point is located inside of a circle.
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @return {boolean} the test result.
     */
    isPntInCir({x:xp,y:yp},{x,y,r}) {
        return (x - xp)**2 + (y - yp)**2 < r*r;
    },
    /**
     * Test, if point is located inside of a closed polygon.
     * (see http://paulbourke.net/geometry/polygonmesh/)
     * @param {x,y} point to test.
     * @param {pnts,closed} polygon.
     * @returns {boolean} point is on polygon lines.
     */
    isPntInPly({x,y},{pts,closed},eps=Number.EPSILON) {
        let match = 0;
        for (let n=pts.length,i=0,pi=pts[i],pj=pts[n-1]; i<n; pj=pi,pi=pts[++i])
            if(    (y >  pi.y || y >  pj.y)
                && (y <= pi.y || y <= pj.y)
                && (x <= pi.x || x <= pj.x)
                &&  pi.y !== pj.y
                && (pi.x === pj.x || x <= pj.x + (y-pj.y)*(pi.x-pj.x)/(pi.y-pj.y)))
                match++;
        return match%2 != 0;  // even matches required for being outside ..
    },
    /**
     * Test, if point is located inside of a box. A box in contrast to a rectangle
     * is always aligned parallel to coordinate system axes, with its
     * local origin `{x,y}` located in the center. The dimensions `{b,h}` are
     * half size dimensions (so upper right corner is {x+b,y+h}).
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @return {boolean} the test result.
     */
    isPntInBox({x:xp,y:yp},{x,y,b,h}) {
        var dx = xp - x, dy = yp - y;
        return dx >= -b && dx <= b && dy >= -h && dy <= h;
    },

    arc3pts(x1,y1,x2,y2,x3,y3) {
        const dx1 = x2 - x1, dy1 = y2 - y1;
        const dx2 = x3 - x2, dy2 = y3 - y2;
        const den = dx1*dy2 - dy1*dx2;
        const lam = Math.abs(den) > Number.EPSILON
                  ? 0.5*((dx1 + dx2)*dx2 + (dy1 + dy2)*dy2)/den
                  : 0;
        const x0 = lam ? x1 + 0.5*dx1 - lam*dy1 : x1 + 0.5*(dx1 + dx2);
        const y0 = lam ? y1 + 0.5*dy1 + lam*dx1 : y1 + 0.5*(dy1 + dy2);
        const dx01 = x1 - x0, dy01 = y1 - y0;
        const dx03 = x3 - x0, dy03 = y3 - y0;
        const dw = lam ? Math.atan2(dx01*dy03-dy01*dx03,dx01*dx03+dy01*dy03) : 0;
        const r  = dw ? Math.hypot(dy01,dx01) : 0.5*Math.hypot(dy1+dy2,dx1+dx2);

        return {x:x0,y:y0,r:r,w:Math.atan2(dy01,dx01),dw};
    }
})

"use strict"

/**
 * g2.ext (c) 2015-21 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @typedef {g2}
 * @description Additional methods for g2.
 * @returns {g2}
 */

var g2 = g2 || { prototype: {} };  // for jsdoc only ...

// constants for element selection / editing
g2.NONE = 0x0; g2.OVER = 0x1; g2.DRAG = 0x2; g2.EDIT = 0x4;

/**
 * Extended style values.
 * Not really meant to get overwritten. But if you actually want, proceed.<br>
 * These styles can be referenced using the comfortable '@' syntax.
 * @namespace
 * @property {object} symbol  `g2` symbol namespace.
 * @property {object} [symbol.tick] Predefined symbol: a little tick
 * @property {object} [symbol.dot] Predefined symbol: a little dot
 * @property {object} [symbol.sqr] Predefined symbol: a little square
 * @property {string} [symbol.nodcolor=#333]    node color.
 * @property {string} [symbol.nodfill=#dedede]   node fill color.
 * @property {string} [symbol.nodfill2=#aeaeae]  alternate node fill color, somewhat darker.
 * @property {string} [symbol.linkcolor=#666]   link color.
 * @property {string} [symbol.linkfill=rgba(225,225,225,0.75)]   link fill color, semi-transparent.
 * @property {string} [symbol.dimcolor=darkslategray]   dimension color.
 * @property {array} [symbol.solid=[]]   solid line style.
 * @property {array} [symbol.dash=[15,10]]   dashed line style.
 * @property {array} [symbol.dot=[4,4]]   dotted line style.
 * @property {array} [symbol.dashdot=[25,6.5,2,6.5]]   dashdotted line style.
 * @property {number} [symbol.labelOffset=5]    default label offset distance.
 * @property {number} [symbol.labelSignificantDigits=3]   default label's significant digits after numbering point.
 */
g2.symbol = g2.symbol || {};
g2.symbol.tick = g2().p().m({ x: 0, y: -2 }).l({ x: 0, y: 2 }).stroke({ lc: "round", lwnosc: true });
g2.symbol.dot = g2().cir({ x: 0, y: 0, r: 2, ls: "transparent" });
g2.symbol.sqr = g2().rec({ x: -1.5, y: -1.5, b: 3, h: 3, ls: "transparent" });

g2.symbol.nodcolor = "#333";
g2.symbol.nodfill = "#dedede";
g2.symbol.nodfill2 = "#aeaeae";
g2.symbol.linkcolor = "#666";
g2.symbol.linkfill = "rgba(225,225,225,0.75)";
g2.symbol.dimcolor = "darkslategray";
g2.symbol.solid = [];
g2.symbol.dash = [15, 10];
g2.symbol.dot = [4, 4];
g2.symbol.dashdot = [25, 6.5, 2, 6.5];
g2.symbol.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234

/**
* Flatten object properties (evaluate getters)
*/
g2.flatten = function (obj) {
    const args = Object.create(null); // important !
    for (let p in obj)
        if (typeof obj[p] !== 'function')
            args[p] = obj[p];
    return args;
}
/*
g2.strip = function(obj,prop) {
    const clone = Object.create(Object.getPrototypeOf(obj),Object.getOwnPropertyDescriptors(obj));
    Object.defineProperty(clone, prop, { get:undefined, enumerable:true, configurable:true, writabel:false });
    return clone;
}
*/
g2.pointIfc = {
    // p vector notation !  ... helps to avoid object destruction
    get p() { return { x: this.x, y: this.y }; },  // visible if 'p' is *not* explicite given. 
    get x() { return Object.getOwnPropertyDescriptor(this, 'p') ? this.p.x : 0; },
    get y() { return Object.getOwnPropertyDescriptor(this, 'p') ? this.p.y : 0; },
    set x(q) { if (Object.getOwnPropertyDescriptor(this, 'p')) this.p.x = q; },
    set y(q) { if (Object.getOwnPropertyDescriptor(this, 'p')) this.p.y = q; },
}

g2.labelIfc = {
    getLabelOffset() { const off = this.label.off !== undefined ? +this.label.off : 1; return off + Math.sign(off) * (this.lw || 2) / 2; },
    getLabelString() {
        let s = typeof this.label === 'object' ? this.label.str : typeof this.label === 'string' ? this.label : '?';
        if (s && s[0] === "@" && this[s.substr(1)]) {
            s = s.substr(1);
            let val = this[s];
            val = Number.isInteger(val) ? val
                : Number(val).toFixed(Math.max(g2.symbol.labelSignificantDigits - Math.log10(val), 0));

            s = `${val}${s === 'angle' ? "°" : ""}`;
        }
        return s;
    },
    drawLabel(g) {
        const lbl = this.label;
        const font = lbl.font || g2.defaultStyle.font;
        const h = parseInt(font);   // font height (px assumed !)
        const str = this.getLabelString();
        const rx = (str.length || 1) * 0.65 * h / 2, 
              ry = 1.25 * h / 2;   // ellipse semi-axes length 
        const pos = this.pointAt(lbl.loc || this.lbloc || 'se');
        const off = this.getLabelOffset();
        const p = {
            x: pos.x + pos.nx * (off + Math.sign(off) * rx),
            y: pos.y + pos.ny * (off + Math.sign(off) * ry)
        };

        if (lbl.border) g.ell({ x: p.x, y: p.y, rx, ry, ls: lbl.fs || 'black', fs: lbl.fs2 || '#ffc' });
        g.txt({
            str, x: p.x, y: p.y,
            thal: "center", tval: "middle",
            fs: lbl.fs || 'black', font: lbl.font
        });
        return g;
    }
}

g2.markIfc = {
    markAt(loc) {
        const p = this.pointAt(loc);
        const w = Math.atan2(p.ny, p.nx) + Math.PI / 2;
        return {
            grp: this.getMarkSymbol(), x: p.x, y: p.y, w: w, scl: this.lw || 1,
            ls: this.ls || '#000', fs: this.fs || this.ls || '#000'
        }
    },
    getMarkSymbol() {
        // Use tick as default
        const mrk = this.mark
        if (typeof mrk === 'number' || !mrk) return g2.symbol.tick;
        if (typeof mrk.symbol === 'object') return mrk.symbol;
        if (typeof mrk.symbol === 'string') return g2.symbol[mrk.symbol]
    },
    // loop is for elements that close, e.g. rec or cir => loc at 0 === loc at 1
    drawMark(g, closed = false) {
        let loc;
        if (Array.isArray(this.mark)) {
            loc = this.mark;
        }
        else {
            const count = typeof this.mark === 'object' ? this.mark.count : this.mark;
            loc = count ?
                Array.from(Array(count)).map((_, i) => i / (count - !closed)) :
                this.mark.loc;
        }
        for (let l of loc) {
            g.use(this.markAt(l));
        }
        return g;
    }
}

g2.prototype.cir.prototype = g2.mix(g2.pointIfc, g2.labelIfc, g2.markIfc, {
    w: 0,   // default start angle (used for dash-dot orgin and editing)
    lbloc: 'c',
    get isSolid() { return this.fs && this.fs !== 'transparent' },
    get len() { return 2 * Math.PI * this.r; },
    get lsh() { return this.state & g2.OVER; },
    get sh() { return this.state & g2.OVER ? [0, 0, 5, "black"] : false },
    get g2() {      // dynamically switch existence of method via getter ... cool !
        const e = g2(); // hand object stripped from `g2`
        this.label && e.ins((g) => this.drawLabel(g));
        this.mark && e.ins((g) => this.drawMark(g, true));
        return () => g2().cir(g2.flatten(this)).ins(e); // avoiding infinite recursion !
    },
    pointAt(loc) {
        const Q = Math.SQRT2 / 2;
        const LOC = { c: [0, 0], e: [1, 0], ne: [Q, Q], n: [0, 1], nw: [-Q, Q], w: [-1, 0], sw: [-Q, -Q], s: [0, -1], se: [Q, -Q] };
        const q = (loc + 0 === loc) ? [Math.cos(loc * 2 * Math.PI), Math.sin(loc * 2 * Math.PI)]
            : (LOC[loc || "c"] || [0, 0]);
        return {
            x: this.x + q[0] * this.r,
            y: this.y + q[1] * this.r,
            nx: q[0],
            ny: q[1]
        };
    },
    hit({ x, y, eps }) {
        return this.isSolid ? g2.isPntInCir({ x, y }, this, eps)
            : g2.isPntOnCir({ x, y }, this, eps);
    },
    drag({ dx, dy }) { this.x += dx; this.y += dy },
});

g2.prototype.lin.prototype = g2.mix(g2.labelIfc, g2.markIfc, {
    // p1 vector notation !
    get p1() { return { x1: this.x1, y1: this.y1 }; },  // relevant if 'p1' is *not* explicite given. 
    get x1() { return Object.getOwnPropertyDescriptor(this, 'p1') ? this.p1.x : 0; },
    get y1() { return Object.getOwnPropertyDescriptor(this, 'p1') ? this.p1.y : 0; },
    set x1(q) { if (Object.getOwnPropertyDescriptor(this, 'p1')) this.p1.x = q; },
    set y1(q) { if (Object.getOwnPropertyDescriptor(this, 'p1')) this.p1.y = q; },
    // p2 vector notation !
    get p2() { return { x2: this.x2, y2: this.y2 }; },  // relevant if 'p2' is *not* explicite given. 
    get x2() { return Object.getOwnPropertyDescriptor(this, 'p2') ? this.p2.x : 0; },
    get y2() { return Object.getOwnPropertyDescriptor(this, 'p2') ? this.p2.y : 0; },
    set x2(q) { if (Object.getOwnPropertyDescriptor(this, 'p2')) this.p2.x = q; },
    set y2(q) { if (Object.getOwnPropertyDescriptor(this, 'p2')) this.p2.y = q; },

    isSolid: false,
    get len() { return Math.hypot(this.x2 - this.x1, this.y2 - this.y1); },
    get sh() { return this.state & g2.OVER ? [0, 0, 5, "black"] : false },
    get g2() {      // dynamically switch existence of method via getter ... !
        const e = g2();
        this.label && e.ins(e => this.drawLabel(e));
        this.mark && e.ins(e => this.drawMark(e));
        return () => g2().lin(g2.flatten(this)).ins(e);
    },

    pointAt(loc) {
        let t = loc === "beg" ? 0
            : loc === "end" ? 1
                : (loc + 0 === loc) ? loc // numerical arg ..
                    : 0.5,   // 'mid' ..
            dx = this.x2 - this.x1,
            dy = this.y2 - this.y1,
            len = Math.hypot(dx, dy);
        return {
            x: this.x1 + dx * t,
            y: this.y1 + dy * t,
            nx: len ? dy / len : 0,
            ny: len ? -dx / len : -1
        };
    },
    hit({ x, y, eps }) {
        return g2.isPntOnLin({ x, y }, { x: this.x1, y: this.y1 }, { x: this.x2, y: this.y2 }, eps);
    },
    drag({ dx, dy }) {
        this.x1 += dx; this.x2 += dx;
        this.y1 += dy; this.y2 += dy;
    }
});

g2.prototype.rec.prototype = g2.mix(g2.pointIfc, g2.labelIfc, g2.markIfc, {
    get len() { return 2 * (this.b + this.h); },
    get isSolid() { return this.fs && this.fs !== 'transparent' },
    get lsh() { return this.state & g2.OVER; },
    get sh() { return this.state & g2.OVER ? [0, 0, 5, "black"] : false; },
    get g2() {      // dynamically switch existence of method via getter ... !
        const e = g2();
        this.label && e.ins(e => this.drawLabel(e));
        this.mark && e.ins(e => this.drawMark(e, true));
        return () => g2().rec(g2.flatten(this)).ins(e);
    },
    lbloc: 'c',
    pointAt(loc) {
        const locAt = (loc) => {
            const o = { c: [0, 0], e: [1, 0], ne: [0.95, 0.95], n: [0, 1], nw: [-0.95, 0.95], w: [-1, 0], sw: [-0.95, -0.95], s: [0, -1], se: [0.95, -0.95] };

            if (o[loc]) return o[loc];

            const w = 2 * Math.PI * loc + pi / 4;
            if (loc <= 0.25) return [1 / Math.tan(w), 1];
            if (loc <= 0.50) return [-1, -Math.tan(w)];
            if (loc <= 0.75) return [- 1 / Math.tan(w), -1];
            if (loc <= 1.00) return [1, Math.tan(w)];
        }
        const q = locAt(loc);
        return {
            x: this.x + (1 + q[0]) * this.b / 2,
            y: this.y + (1 + q[1]) * this.h / 2,
            nx: 1 - Math.abs(q[0]) < 0.01 ? q[0] : 0,
            ny: 1 - Math.abs(q[1]) < 0.01 ? q[1] : 0
        };
    },
    hit({ x, y, eps }) {
        return this.isSolid ? g2.isPntInBox({ x, y }, { x: this.x + this.b / 2, y: this.y + this.h / 2, b: this.b / 2, h: this.h / 2 }, eps)
            : g2.isPntOnBox({ x, y }, { x: this.x + this.b / 2, y: this.y + this.h / 2, b: this.b / 2, h: this.h / 2 }, eps);
    },
    drag({ dx, dy }) { this.x += dx; this.y += dy }
});

g2.prototype.arc.prototype = g2.mix(g2.pointIfc, g2.labelIfc, g2.markIfc, {
    get len() { return Math.abs(this.r * this.dw); },
    isSolid: false,
    get angle() { return this.dw / Math.PI * 180; },
    get sh() { return this.state & g2.OVER ? [0, 0, 5, "black"] : false },
    get g2() {      // dynamically switch existence of method via getter ... !
        const e = g2();
        this.label && e.ins(e => this.drawLabel(e));
        this.mark && e.ins(e => this.drawMark(e));
        return () => g2().arc(g2.flatten(this)).ins(e);
    },
    lbloc: 'mid',
    pointAt(loc) {
        let t = loc === "beg" ? 0
            : loc === "end" ? 1
                : loc === "mid" ? 0.5
                    : loc + 0 === loc ? loc
                        : 0.5,
            ang = (this.w || 0) + t * (this.dw || Math.PI * 2), cang = Math.cos(ang), sang = Math.sin(ang), r = loc === "c" ? 0 : this.r;
        return {
            x: this.x + r * cang,
            y: this.y + r * sang,
            nx: cang,
            ny: sang
        };
    },
    hit({ x, y, eps }) { return g2.isPntOnArc({ x, y }, this, eps) },
    drag({ dx, dy }) { this.x += dx; this.y += dy; },
});

/**
* Draw interactive handle.
* @method
* @returns {object} g2
* @param {object} - handle object.
* @property {number} x - x-value center.
* @property {number} y - y-value center.
* @example
* g2().hdl({x:100,y:80})  // Draw handle.
*/
g2.prototype.hdl = function (args) { return this.addCommand({ c: 'hdl', a: args }); }
g2.prototype.hdl.prototype = g2.mix(g2.prototype.cir.prototype, {
    r: 5,
    isSolid: true,
    draggable: true,
    lbloc: 'se',
    get lsh() { return this.state & g2.OVER; },
    get sh() { return this.state & g2.OVER ? [0, 0, 5, "black"] : false },
    g2() {
        const { x, y, r, b = 4, ls = 'black', fs = 'palegreen', sh } = this;
        
        return g2().cir({ x, y, r, ls, fs, sh }).ins((g) => this.label && this.drawLabel(g));
    }
});

/**
* Node symbol.
* @constructor
* @param {object} - symbol arguments object.
* @property {number} x - x-value center.
* @property {number} y - y-value center.
* @example
* g2().nod({x:10,y:10})
*/

g2.prototype.nod = function (args = {}) { return this.addCommand({ c: 'nod', a: args }); }
g2.prototype.nod.prototype = g2.mix(g2.prototype.cir.prototype, {
    r: 5,
    ls: '@nodcolor',
    fs: g2.symbol.nodfill,
    isSolid: true,
    lbloc: 'se',
    g2() {      // in contrast to `g2.prototype.cir.prototype`, `g2()` is called always !
        return g2()
            .cir({ ...g2.flatten(this), r: this.r * (this.scl !== undefined ? this.scl  : 1) })
            .ins((g) => this.label && this.drawLabel(g))
    }
});

/**
 * Double nod symbol
 * @constructor
 * @returns {object} g2
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().dblnod({x:10,y:10})
*/
g2.prototype.dblnod = function ({ x = 0, y = 0 }) { return this.addCommand({ c: 'dblnod', a: arguments[0] }); }
g2.prototype.dblnod.prototype = g2.mix(g2.prototype.cir.prototype, {
    r: 6,
    isSolid: true,
    g2() {
        return g2()
            .beg({ x: this.x, y: this.y })
            .cir({ r: 6, ls: '@nodcolor', fs: '@nodfill', sh: this.sh })
            .cir({ r: 3, ls: '@nodcolor', fs: '@nodfill2' })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
})

/**
* Pole symbol.
* @constructor
* @returns {object} g2
* @param {object} - symbol arguments object.
* @property {number} x - x-value center.
* @property {number} y - y-value center.
* @example
* g2().pol({x:10,y:10})
*/
g2.prototype.pol = function (args = {}) { return this.addCommand({ c: 'pol', a: args }); }
g2.prototype.pol.prototype = g2.mix(g2.prototype.nod.prototype, {
    g2() {
        return g2()
            .beg(g2.flatten(this))
            .cir({ r: 6, fs: '@fs2' })
            .cir({ r: 2.5, fs: '@ls', ls: 'transparent' })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
})

/**
* Ground symbol.
* @constructor
* @param {object} - arguments object.
* @property {number} x - x-value center.
* @property {number} y - y-value center.
* @example
* g2().gnd({x:10,y:10})
*/
g2.prototype.gnd = function (args = {}) { return this.addCommand({ c: 'gnd', a: args }); }
g2.prototype.gnd.prototype = g2.mix(g2.prototype.nod.prototype, {
    g2() {
        return g2()
            .beg(g2.flatten(this))
            .cir({ x: 0, y: 0, r: 6 })
            .p()
            .m({ x: 0, y: 6 })
            .a({ dw: Math.PI / 2, x: -6, y: 0 })
            .l({ x: 6, y: 0 })
            .a({ dw: -Math.PI / 2, x: 0, y: -6 })
            .z()
            .fill({ fs: g2.symbol.nodcolor })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
})

g2.prototype.nodfix = function (args = {}) { return this.addCommand({ c: 'nodfix', a: args }); }
g2.prototype.nodfix.prototype = g2.mix(g2.prototype.nod.prototype, {
    g2() {
        return g2()
            .beg(g2.flatten(this))
            .p()
            .m({ x: -8, y: -12 })
            .l({ x: 0, y: 0 })
            .l({ x: 8, y: -12 })
            .drw({ fs: g2.symbol.nodfill2 })
            .cir({ x: 0, y: 0, r: this.r })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
})
/**
* @method
* @returns {object} g2
* @param {object} - symbol arguments object.
* @property {number} x - x-value center.
* @property {number} y - y-value center.
* @example
* g2().view({cartesian:true})
 *     .nodflt({x:10,y:10})
*/
g2.prototype.nodflt = function (args = {}) { return this.addCommand({ c: 'nodflt', a: args }); }
g2.prototype.nodflt.prototype = g2.mix(g2.prototype.nod.prototype, {
    g2() {
        return g2()
            .beg(g2.flatten(this))
            .p()
            .m({ x: -8, y: -12 })
            .l({ x: 0, y: 0 })
            .l({ x: 8, y: -12 })
            .drw({ ls: g2.symbol.nodcolor, fs: g2.symbol.nodfill2 })
            .cir({ x: 0, y: 0, r: this.r, ls: g2.symbol.nodcolor, fs: g2.symbol.nodfill })
            .lin({ x1: -9, y1: -19, x2: 9, y2: -19, ls: g2.symbol.nodfill2, lw: 5 })
            .lin({ x1: -9, y1: -15.5, x2: 9, y2: -15.5, ls: g2.symbol.nodcolor, lw: 2 })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
})

/**
* Draw vector arrow.
* @method
* @returns {object} g2
* @param {object} - vector arguments object.
* @property {number} x1 - start x coordinate.
* @property {number} y1 - start y coordinate.
* @property {number} x2 - end x coordinate.
* @property {number} y2 - end y coordinate.
* @example
* g2().vec({x1:50,y1:20,x2:250,y2:120})
*/
g2.prototype.vec = function vec(args) { return this.addCommand({ c: 'vec', a: args }); }
g2.prototype.vec.prototype = g2.mix(g2.prototype.lin.prototype, {
    g2() {
        const { x1, y1, x2, y2, lw = 1, ls = '#000', ld = [], fs = ls || '#000', lc = 'round', lj = 'round', } = this;
        const dx = x2 - x1, dy = y2 - y1, r = Math.hypot(dx, dy);
        const b = 3 * (1 + lw) > r ? r / 3 : (1 + lw);
        const arrowHead = () => g2().p().m({ x: 0, y: 0 }).l({ x: -5 * b, y: b }).a({ dw: -Math.PI / 3, x: -5 * b, y: -b }).z().drw({ ls, fs, lc, lj });
        return g2()
            .beg({ x: x1, y: y1, w: Math.atan2(dy, dx), lc, lj })
            .p().m({ x: 0, y: 0 })
            .l({ x: r - 3 * b, y: 0 })
            .stroke({ ls, lw, ld })
            .use({ grp: arrowHead, x: r, y: 0 })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
});

/**
* Arc as Vector
* @method
* @returns {object} g2
* @param {object} - angular dimension arguments.
* @property {number} x - start x coordinate.
* @property {number} y - start y coordinate.
* @property {number} r - radius
* @property {number} [w=0] - start angle (in radian).
* @property {number} [dw=Math.PI/2] - angular range in radian. In case of positive values it is running counterclockwise with
 *                                       right handed (cartesian) coordinate system.
* @example
* g2().avec({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
*/
g2.prototype.avec = function avec(args) { return this.addCommand({ c: 'avec', a: args }); }
g2.prototype.avec.prototype = g2.mix(g2.prototype.arc.prototype, {
    g2() {
        const { x, y, r, w, dw = 0, lw = 1, lc = 'round', lj = 'round', ls, fs = ls || "#000", label } = this;
        const b = 3 * (1 + lw) > r ? r / 3 : (1 + lw), bw = 5 * b / r;
        const arrowHead = () => g2().p().m({ x: 0, y: 2 * b }).l({ x: 0, y: -2 * b }).m({ x: 0, y: 0 }).l({ x: -5 * b, y: b })
            .a({ dw: -Math.PI / 3, x: -5 * b, y: -b }).z().drw({ ls, fs });

        return g2()
            .beg({ x, y, w, ls, lw, lc, lj })
            .arc({ r, w: 0, dw })
            .use({
                grp: arrowHead, x: r * Math.cos(dw), y: r * Math.sin(dw),
                w: (dw >= 0 ? dw + Math.PI / 2 - bw / 2 : dw - Math.PI / 2 + bw / 2)
            })
            .end()
            .ins((g) => label && this.drawLabel(g));
    }
});

/**
* Linear Dimension
* @method
* @returns {object} g2
* @param {object} - dimension arguments object.
* @property {number} x1 - start x coordinate.
* @property {number} y1 - start y coordinate.
* @property {number} x2 - end x coordinate.
* @property {number} y2 - end y coordinate.
* @property {number} off - offset.
* @property {boolean} [inside=true] - draw dimension arrows between or outside of ticks.
* @example
*  g2().dim({x1:60,y1:40,x2:190,y2:120})
*/
g2.prototype.dim = function dim(args) { return this.addCommand({ c: 'dim', a: args }); }
g2.prototype.dim.prototype = g2.mix(g2.prototype.lin.prototype, {
    pointAt(loc) {
        const pnt = g2.prototype.lin.prototype.pointAt.call(this, loc);
        if (this.off) {
            pnt.x += this.off * pnt.nx;
            pnt.y += this.off * pnt.ny;
        }
        return pnt;
    },
    g2() {
        const { x1, y1, x2, y2, lw = 1, lc = 'round', lj = 'round', off = 0, inside = true, ls, fs = ls || "#000", label } = this;
        const dx = x2 - x1, dy = y2 - y1, r = Math.hypot(dx, dy);
        const b = 3 * (1 + lw) > r ? r / 3 : (1 + lw);
        const arrowHead = () => g2().p().m({ x: 0, y: 2 * b }).l({ x: 0, y: -2 * b }).m({ x: 0, y: 0 }).l({ x: -5 * b, y: b })
            .a({ dw: -Math.PI / 3, x: -5 * b, y: -b }).z().drw({ ls, fs });
        return g2()
            .beg({ x: x1 + off / r * dy, y: y1 - off / r * dx, w: Math.atan2(dy, dx), ls, fs, lw, lc, lj })
            .lin({ x1: (inside ? 4 * b : 0), y1: 0, x2: (inside ? r - 4 * b : r), y2: 0 })
            .use({ grp: arrowHead, x: r, y: 0, w: (inside ? 0 : Math.PI) })
            .use({ grp: arrowHead, x: 0, y: 0, w: (inside ? Math.PI : 0) })
            .lin({ x1: 0, y1: off, x2: 0, y2: 0 })
            .lin({ x1: r, y1: off, x2: r, y2: 0 })
            .end()
            .ins((g) => label && this.drawLabel(g));
    }
});

/**
* Angular dimension
* @method
* @returns {object} g2
* @param {object} - angular dimension arguments.
* @property {number} x - start x coordinate.
* @property {number} y - start y coordinate.
* @property {number} r - radius
* @property {number} [w=0] - start angle (in radian).
* @property {number} [dw=Math.PI/2] - angular range in radian. In case of positive values it is running counterclockwise with
 *                                       right handed (cartesian) coordinate system.
* @property {boolean} [outside=false] - draw dimension arrows outside of ticks.
* @depricated {boolean} [inside] - draw dimension arrows between ticks.
* @example
* g2().adim({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
*/
g2.prototype.adim = function adim(args) { return this.addCommand({ c: 'adim', a: args }); }
g2.prototype.adim.prototype = g2.mix(g2.prototype.arc.prototype, {
    g2() {
        const { x, y, r, w, dw, lw = 1, lc = 'round', lj = 'round', ls, fs = ls || "#000", label } = this;
        const b = 3 * (1 + lw) > r ? r / 3 : (1 + lw), bw = 5 * b / r;
        const arrowHead = () => g2().p().m({ x: 0, y: 2 * b }).l({ x: 0, y: -2 * b }).m({ x: 0, y: 0 }).l({ x: -5 * b, y: b })
            .a({ dw: -Math.PI / 3, x: -5 * b, y: -b }).z().drw({ ls, fs });

        const outside = (this.inside !== undefined && this.outside === undefined) ? !this.inside : !!this.outside;  // still support depricated property !

        return g2()
            .beg({ x, y, w, ls, lw, lc, lj })
            .arc({ r, w: 0, dw })
            .use({ grp: arrowHead, x: r, y: 0, w: (!outside && dw > 0 || outside && dw < 0 ? -Math.PI / 2 + bw / 2 : Math.PI / 2 - bw / 2) })
            .use({ grp: arrowHead, x: r * Math.cos(dw), y: r * Math.sin(dw), w: (!outside && dw > 0 || outside && dw < 0 ? dw + Math.PI / 2 - bw / 2 : dw - Math.PI / 2 + bw / 2) })
            .end()
            .ins((g) => label && this.drawLabel(g));
    }
});

/**
* Origin symbol
* @constructor
* @returns {object} g2
* @param {object} - symbol arguments object.
* @property {number} x - x-value center.
* @property {number} y - y-value center.
* @property {number} w - angle in radians.
* @example
* g2().view({cartesian:true})
 *     .origin({x:10,y:10})
*/
g2.prototype.origin = function (args = {}) { return this.addCommand({ c: 'origin', a: args }); }
g2.prototype.origin.prototype = g2.mix(g2.prototype.nod.prototype, {
    lbloc: 'sw',
    g2() {
        const { x, y, w, ls = '#000', lw = 1 } = this;
        return g2()
            .beg({ x, y, w, ls })
            .vec({ x1: 0, y1: 0, x2: 40, y2: 0, lw, fs: '#ccc' })
            .vec({ x1: 0, y1: 0, x2: 0, y2: 40, lw, fs: '#ccc' })
            .cir({ x: 0, y: 0, r: lw + 1, fs: '#ccc' })
            .end()
            .ins((g) => this.label && this.drawLabel(g));
    }
});

g2.prototype.ply.prototype = g2.mix(g2.labelIfc, g2.markIfc, {
    get isSolid() { return this.closed && this.fs && this.fs !== 'transparent'; },
    get sh() { return this.state & g2.OVER ? [0, 0, 5, "black"] : false; },
    // get len() {
    //     let len_itr = 0;
    //     let last_pt = {x:0,y:0};
    //     g2.pntItrOf(this.pts).map(pt => {
    //         len_itr += Math.hypot(pt.x-last_pt.x, pt.y-last_pt.y);
    //         last_pt = pt;
    //     });
    //     return len_itr;
    // },
    pointAt(loc) {
        const t = loc === "beg" ? 0
            : loc === "end" ? 1
                : (loc + 0 === loc) ? loc // numerical arg ..
                    : 0.5,   // 'mid' ..
            pitr = g2.pntItrOf(this.pts),
            pts = [],
            len = [];

        for (let itr = 0; itr < pitr.len; itr++) {
            const next = pitr((itr + 1) % pitr.len);
            pts.push(pitr(itr));
            len.push(Math.hypot(
                next.x - pitr(itr).x,
                next.y - pitr(itr).y));
        }
        this.closed || len.pop();
        const { t2, x, y, dx, dy } = (() => {
            const target = t * len.reduce((a, b) => a + b);
            for (let itr = 0, tmp = 0; itr < pts.length; itr++) {
                tmp += len[itr];
                const next = pitr(itr + 1).x ? pitr(itr + 1) : pitr(0);
                if (tmp >= target) {
                    return {
                        t2: 1 - (tmp - target) / len[itr],
                        x: pts[itr].x,
                        y: pts[itr].y,
                        dx: next.x - pts[itr].x,
                        dy: next.y - pts[itr].y
                    }
                }
            }
        })();
        const len2 = Math.hypot(dx, dy);
        return {
            x: (this.x || 0) + x + dx * t2,
            y: (this.y || 0) + y + dy * t2,
            nx: len2 ? dy / len2 : 1,
            ny: len2 ? dx / len2 : 0,
        };
    },
    hit({ x, y, eps }) {
        return this.isSolid ? g2.isPntInPly({ x: x - this.x, y: y - this.y }, this, eps)   // translational transformation only .. at current .. !
            : g2.isPntOnPly({ x: x - this.x, y: y - this.y }, this, eps);
    },
    drag({ dx, dy }) { this.x += dx; this.y += dy; },
    get g2() {
        const e = g2();
        this.label && e.ins(e => this.drawLabel(e));
        this.mark && e.ins(e => this.drawMark(e, this.closed));
        return () => g2().ply(g2.flatten(this)).ins(e);
    }
});

g2.prototype.use.prototype = {
    // p vector notation !
    get p() { return { x: this.x, y: this.y }; },  // relevant if 'p' is *not* explicite given. 
    get x() { return Object.getOwnPropertyDescriptor(this, 'p') ? this.p.x : 0; },
    get y() { return Object.getOwnPropertyDescriptor(this, 'p') ? this.p.y : 0; },
    set x(q) { if (Object.getOwnPropertyDescriptor(this, 'p')) this.p.x = q; },
    set y(q) { if (Object.getOwnPropertyDescriptor(this, 'p')) this.p.y = q; },

    isSolid: false,
    /*
        hit(at) {
            for (const cmd of this.grp.commands) {
                if (cmd.a.hit && cmd.a.hit(at))
                    return true;
            }
            return false;
    },
    
        pointAt: g2.prototype.cir.prototype.pointAt,
    */
};
// complex macros / add prototypes to argument objects

/**
* Draw spline by points.
* Implementing a centripetal Catmull-Rom spline (thus avoiding cusps and self-intersections).
* Using iterator function for getting points from array by index.
* It must return current point object {x,y} or object {done:true}.
* Default iterator expects sequence of x/y-coordinates as a flat array [x,y,...],
* array of [[x,y],...] arrays or array of [{x,y},...] objects.
* @see https://pomax.github.io/bezierinfo
* @see https://de.wikipedia.org/wiki/Kubisch_Hermitescher_Spline
* @method
* @returns {object} g2
* @param {object} - spline arguments object.
* @property {object[] | number[][] | number[]} pts - array of points.
* @property {bool} [closed=false] - closed spline.
* @example
* g2().spline({pts:[100,50,50,150,150,150,100,50]})
*/
g2.prototype.spline = function spline({ pts, closed, x, y, w }) {
    arguments[0]._itr = g2.pntItrOf(pts);
    return this.addCommand({ c: 'spline', a: arguments[0] });
}
g2.prototype.spline.prototype = g2.mix(g2.prototype.ply.prototype, {
    g2: function () {
        let { pts, closed, x, y, w, ls, lw, fs, sh } = this, itr = this._itr, gbez;
        if (itr) {
            let b = [], i, n = itr.len,
                p1, p2, p3, p4, d1, d2, d3,
                d1d2, d2d3, scl2, scl3,
                den2, den3, istrf = x || y || w;

            gbez = g2();
            if (istrf) gbez.beg({ x, y, w });
            gbez.p().m(itr(0));
            for (let i = 0; i < (closed ? n : n - 1); i++) {
                if (i === 0) {
                    p1 = closed ? itr(n - 1) : { x: 2 * itr(0).x - itr(1).x, y: 2 * itr(0).y - itr(1).y };
                    p2 = itr(0);
                    p3 = itr(1);
                    p4 = n === 2 ? (closed ? itr(0) : { x: 2 * itr(1).x - itr(0).x, y: 2 * itr(1).y - itr(0).y }) : itr(2);
                    d1 = Math.max(Math.hypot(p2.x - p1.x, p2.y - p1.y), Number.EPSILON);  // don't allow ..
                    d2 = Math.max(Math.hypot(p3.x - p2.x, p3.y - p2.y), Number.EPSILON);  // zero point distances ..
                } else {
                    p1 = p2;
                    p2 = p3;
                    p3 = p4;
                    p4 = (i === n - 2) ? (closed ? itr(0) : { x: 2 * itr(n - 1).x - itr(n - 2).x, y: 2 * itr(n - 1).y - itr(n - 2).y })
                        : (i === n - 1) ? itr(1)
                            : itr(i + 2);
                    d1 = d2;
                    d2 = d3;
                }
                d3 = Math.max(Math.hypot(p4.x - p3.x, p4.y - p3.y), Number.EPSILON);
                d1d2 = Math.sqrt(d1 * d2), d2d3 = Math.sqrt(d2 * d3),
                    scl2 = 2 * d1 + 3 * d1d2 + d2,
                    scl3 = 2 * d3 + 3 * d2d3 + d2,
                    den2 = 3 * (d1 + d1d2),
                    den3 = 3 * (d3 + d2d3);
                gbez.c({
                    x: p3.x, y: p3.y,
                    x1: (-d2 * p1.x + scl2 * p2.x + d1 * p3.x) / den2,
                    y1: (-d2 * p1.y + scl2 * p2.y + d1 * p3.y) / den2,
                    x2: (-d2 * p4.x + scl3 * p3.x + d3 * p2.x) / den3,
                    y2: (-d2 * p4.y + scl3 * p3.y + d3 * p2.y) / den3
                });
            }
            gbez.c(closed ? { x: itr(0).x, y: itr(0).y } : { x: itr(n - 1).x, y: itr(n - 1).y })
            if (closed) gbez.z();
            gbez.drw({ ls, lw, fs, sh });
            if (istrf) gbez.end();
        }
        return gbez;
    }
});

"use strict"

/**
 * g2.mec (c) 2013-18 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @requires g2.ext.js
 * @typedef {g2}
 * @description Mechanical extensions. (Requires cartesian coordinates)
 * @returns {g2}
 */

var g2 = g2 || { prototype:{} };  // for jsdoc only ...

/**
 * Draw slider.
 * @method
 * @returns {object} g2
 * @param {object} - slider arguments object.
 * @property {number} x - start x coordinate.
 * @property {number} y - start y coordinate.
 * @property {number} [b=32] - slider breadth.
 * @property {number} [h=16] - slider height.
 * @property {number} [w=0] - rotation.
 * @example
 * g2().slider({x:150,y:75,w:Math.PI/4,b:64,h:32})
 */
g2.prototype.slider = function () { return this.addCommand({c:'slider',a:arguments[0]}); }
g2.prototype.slider.prototype = g2.mix(g2.prototype.rec.prototype,{
    g2() {
        const args = Object.assign({b:32,h:16,fs:'@linkfill'}, this);
        return g2()
            .beg({x:args.x,y:args.y,w:args.w,fs:args.fs})
            .rec({x:-args.b/2,y:-args.h/2,b:args.b,h:args.h})
            .end();
    }
})

/**
 * Draw linear spring
 * @method
 * @returns {object} g2
 * @param {object} - linear spring arguments object.
 * @property {number} x1 - start x coordinate.
 * @property {number} y1 - start y coordinate.
 * @property {number} x2 - end x coordinate.
 * @property {number} y2 - end y coordinate.
 * @property {number} [h=16] Spring height.
 * @example
 * g2().spring({x1:50,y1:100,x2:200,y2:75})
 */
g2.prototype.spring = function () { return this.addCommand({c:'spring',a:arguments[0]}); }
g2.prototype.spring.prototype = g2.mix(g2.prototype.lin.prototype,{
    g2() {
        const args = Object.assign({h:16}, this);
        const len = Math.hypot(args.x2-args.x1, args.y2-args.y1);
        const xm = (args.x2+args.x1)/2;
        const ym = (args.y2+args.y1)/2;
        const h = args.h;
        const ux = (args.x2-args.x1)/len;
        const uy = (args.y2-args.y1)/len;
        return g2()
            .p()
            .m({x:args.x1,y:args.y1})
            .l({x:xm-ux*h/2,y:ym-uy*h/2})
            .l({x:xm+(-ux/6+uy/2)*h,y:ym+(-uy/6-ux/2)*h})
            .l({x:xm+( ux/6-uy/2)*h,y:ym+( uy/6+ux/2)*h})
            .l({x:xm+ux*h/2,y:ym+uy*h/2})
            .l({x:args.x2,y:args.y2})
            .stroke(Object.assign({}, {ls:'@nodcolor'},this,{fs:'transparent',lc:'round',lj:'round'}));
    }
})

/**
 * Draw line with centered square damper symbol.
 * @method
 * @returns {object} g2
 * @param {object} - damper arguments object.
 * @property {number} x1 - start x coordinate.
 * @property {number} y1 - start y coordinate.
 * @property {number} x2 - end x coordinate.
 * @property {number} y2 - end y coordinate.
 * @property {number} [h=16] - damper height.
 *  * g2().damper({x1:60,y1:120,x2:200,y2:75})
 */
g2.prototype.damper = function () { return this.addCommand({c:'damper',a:arguments[0]}); }
g2.prototype.damper.prototype = g2.mix(g2.prototype.lin.prototype,{
    g2() {
        const args = Object.assign({h:16}, this);
        const len = Math.hypot(args.x2-args.x1, args.y2-args.y1);
        const xm = (args.x2+args.x1)/2;
        const ym = (args.y2+args.y1)/2;
        const h = args.h;
        const ux = (args.x2-args.x1)/len;
        const uy = (args.y2-args.y1)/len;
        return g2()
            .p()
            .m({x:args.x1,y:args.y1})
            .l({x:xm-ux*h/2,y:ym-uy*h/2})
            .m({x:xm+( ux-uy)*h/2,y:ym+( uy+ux)*h/2})
            .l({x:xm+(-ux-uy)*h/2,y:ym+(-uy+ux)*h/2})
            .l({x:xm+(-ux+uy)*h/2,y:ym+(-uy-ux)*h/2})
            .l({x:xm+( ux+uy)*h/2,y:ym+( uy-ux)*h/2})
            .m({x:xm,y:ym})
            .l({x:args.x2,y:args.y2})
            .stroke(Object.assign({}, {ls:'@nodcolor'},this,{fs:'transparent',lc:'round',lj:'round'}));
    }
})

/**
 * Draw polygonial link.
 * @method
 * @returns {object} g2
 * @param {object} - link arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {bool} [closed = false] - closed link.
 * @property {number} x - start x coordinate.
 * @property {number} y - start y coordinate.
 * @property {number} [w=0] - angle.
 * @example
 * let A = {x:50,y:25},B = {x:150,y:25},
 *     C = {x:50,y:75}, D = {x:100,y:75},
 *     E = {x:50,y:125};
 * g2().view({cartesian:true})
 *     .link({pts:[A,B,E,A,D,C]})
 */
g2.prototype.link = function () { return this.addCommand({c:'link',a:arguments[0]}); }
g2.prototype.link.prototype = g2.mix(g2.prototype.ply.prototype,{
    g2() {
        const args = Object.assign({ls:'@linkcolor',fs:'transparent'}, this);
        return g2().ply(Object.assign({}, this, {closed:true,ls:args.ls,fs:args.fs,lw:7,lc:'round',lj:'round'}));
    }
})

/**
 * Draw alternate glossy polygonial link.
 * @method
 * @returns {object} g2
 * @param {object} - link2 arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {bool} [closed = false] - closed link.
 * @property {number} x - start x coordinate.
 * @property {number} y - start y coordinate.
 * @property {number} [w=0] - angle.
 * @example
 * let A = {x:50,y:25},B = {x:150,y:25},
 *     C = {x:50,y:75}, D = {x:100,y:75},
 *     E = {x:50,y:125};
 * g2().view({cartesian:true})
 *     .link({pts:[A,B,E,A,D,C]})
 */
g2.prototype.link2 = function () { return this.addCommand({c:'link2',a:arguments[0]}); }
g2.prototype.link2.prototype = g2.mix(g2.prototype.ply.prototype,{
    g2() {
        return g2()
            .ply(Object.assign({closed:true,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'},this))
            .ply(Object.assign({closed:true,ls:'@nodfill2',fs:'transparent',lw:4.5,lc:'round',lj:'round'},this))
            .ply(Object.assign({closed:true,ls:'@nodfill',fs:'transparent',lw:2,lc:'round',lj:'round'},this));
    }
})

/**
 * Draw polygonial beam.
 * @method
 * @returns {object} g2
 * @param {object} - beam arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {number} x - start x coordinate.
 * @property {number} y - start y coordinate.
 * @property {number} [w=0] - angle.
 * @example
 * g2().view({cartesian})
 *     .beam({pts:[[200,125][50,125][50,50][200,50]]})
 */
g2.prototype.beam = function () { return this.addCommand({c:'beam',a:arguments[0]}); }
g2.prototype.beam.prototype = g2.mix(g2.prototype.ply.prototype,{
    g2() {
        return g2().ply(Object.assign({closed:false,ls:'@linkcolor',fs:'transparent',lw:7,lc:'round',lj:'round'},this));
    }
})

/**
 * Draw alternate glossy polygonial beam.
 * @method
 * @returns {object} g2
 * @param {object} - beam2 arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {number} x - start x coordinate.
 * @property {number} y - start y coordinate.
 * @property {number} [w=0] - angle.
 * @example
 * g2().view({cartesian})
 *     .beam2({pts:[[200,125][50,125][50,50][200,50]]})
 */
g2.prototype.beam2 = function () { return this.addCommand({c:'beam2',a:arguments[0]}); }
g2.prototype.beam2.prototype = g2.mix(g2.prototype.ply.prototype,{
    g2() {
        return g2()
            .ply(Object.assign({closed:false,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'},this))
            .ply(Object.assign({closed:false,ls:'@nodfill2',fs:'transparent',lw:4.5,lc:'round',lj:'round'},this))
            .ply(Object.assign({closed:false,ls:'@nodfill',fs:'transparent',lw:2,lc:'round',lj:'round'},this));
    }
})

/**
 * Draw bar.
 * @method
 * @returns {object} g2
 * @param {object} - bar arguments object.
 * @property {number} x1 - start x coordinate.
 * @property {number} y1 - start y coordinate.
 * @property {number} x2 - end x coordinate.
 * @property {number} y2 - end y coordinate.
 * @example
 * g2().bar({x1:50,y1:20,x2:250,y2:120})
 */
g2.prototype.bar = function () { return this.addCommand({c:'bar',a:arguments[0]}); }
g2.prototype.bar.prototype = g2.mix(g2.prototype.lin.prototype,{
    g2() {
        return g2().lin(Object.assign({ls:'@linkcolor',lw:6,lc:'round'},this));
    }
})

/**
 * Draw alternate glossy bar.
 * @method
 * @returns {object} g2
 * @param {object} - bar2 arguments object.
 * @property {number} x1 - start x coordinate.
 * @property {number} y1 - start y coordinate.
 * @property {number} x2 - end x coordinate.
 * @property {number} y2 - end y coordinate.
 * @example
 * g2().bar2({x1:50,y1:20,x2:250,y2:120})
 */
g2.prototype.bar2 = function () { return this.addCommand({c:'bar2',a:arguments[0]}); }
g2.prototype.bar2.prototype = g2.mix(g2.prototype.lin.prototype,{
    g2() {
        const args = Object.assign({}, this);
        return g2()
            .lin({x1:args.x1,y1:args.y1,x2:args.x2,y2:args.y2,ls:'@nodcolor',lw:7,lc:'round'})
            .lin({x1:args.x1,y1:args.y1,x2:args.x2,y2:args.y2,ls:'@nodfill2',lw:4.5,lc:'round'})
            .lin({x1:args.x1,y1:args.y1,x2:args.x2,y2:args.y2,ls:'@nodfill',lw:2,lc:'round'});
    }
})

/**
 * Draw pulley.
 * @method
 * @returns {object} g2
 * @param {object} - pulley arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @property {number} r - radius.
 * @property {number} w - angle.
 * @example
 * g2().pulley({x:100,y:75,r:50})
 */
g2.prototype.pulley = function () { return this.addCommand({c:'pulley',a:arguments[0]}); }
g2.prototype.pulley.prototype = g2.mix(g2.prototype.cir.prototype,{
    g2() {
        const args = Object.assign({}, this);
        return g2()
            .beg({x:args.x,y:args.y,w:args.w})
            .cir({x:0,y:0,r:args.r,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
            .cir({x:0,y:0,r:args.r-5,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
            .cir({x:0,y:0,r:args.r-6,ls:'#8e8e8e',fs:'transparent',lw:2})
            .cir({x:0,y:0,r:args.r-8,ls:'#aeaeae',fs:'transparent',lw:2})
            .cir({x:0,y:0,r:args.r-10,ls:'#cecece',fs:'transparent',lw:2})
            .end();
    }
})

/**
 * Draw alternate pulley.
 * @method
 * @returns {object} g2
 * @param {object} - pulley2 arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @property {number} r - radius.
 * @property {number} w - angle.
 * @example
 * g2().pulley2({x:50,y:30,r:25})
 */
g2.prototype.pulley2 = function () { return this.addCommand({c:'pulley2',a:arguments[0]}); }
g2.prototype.pulley2.prototype = g2.mix(g2.prototype.cir.prototype,{
    g2() {
        const args = Object.assign({}, this);
        return g2()
            .beg({x:args.x,y:args.y,w:args.w})
            .bar2({x1:0,y1:-args.r+4,x2:0,y2:args.r-4})
            .bar2({x1:-args.r+4,y1:0,x2:args.r-4,y2:0})
            .cir({x:0,y:0,r:args.r-2.5,ls:'#e6e6e6',fs:'transparent',lw:5})
            .cir({x:0,y:0,r:args.r,ls:'@nodcolor',fs:'transparent',lw:1})
            .cir({x:0,y:0,r:args.r-5,ls:'@nodcolor',fs:'transparent',lw:1})
            .end();
    }
})

/**
 * Draw rope. Amount of pulley radii must be greater than 10 units. They are forced to zero otherwise.
 * @method
 * @returns {object} g2
 * @param {object} - rope arguments object.
 * @property {object | number} p1 - starting point or Coordinate.
 * @property {object | number} p2 - end point or Coordinate.
 * @property {number} r - radius of parent element.
 * @example
 * let A = {x:50,y:30}, B = {x:200,y:75};
 * g2().view({cartesian:true})
 *     .pulley({...A,r:20})
 *     .pulley2({...B,r:40})
 *     .rope({p1:A,r1:20,p2:B,r2:40})
 */
g2.prototype.rope = function () { return this.addCommand({c:'rope',a:arguments[0]}); }
g2.prototype.rope.prototype = g2.mix(g2.prototype.lin.prototype,{
    g2() {
        const args = Object.assign({w:0}, this);
        let x1 = 'p1' in args ? args.p1.x
               : 'x1' in args ? args.x1
               : 'x'  in args ? args.x
               : 0;
        let y1 = 'p1' in args ? args.p1.y
               : 'y1' in args ? args.y1
               : 'y'  in args ? args.y
               : 0;
        let x2 = 'p2' in args ? args.p2.x
               : 'x2' in args ? args.x2
               : 'dx' in args ? (x1 + args.dx)
               : 'r'  in args ? x1 + args.r*Math.cos(args.w)
               : x1+10;
        let y2 = 'p2' in args ? args.p2.y
               : 'y2' in args ? args.y2
               : 'dy' in args ? (y1 + args.dy)
               : 'r'  in args ? y1 + args.r*Math.sin(args.w)
               : y1;
        let Rmin = 10;
        let R1 = args.r1 > Rmin ? args.r1 - 2.5
               : args.r1 <-Rmin ? args.r1 + 2.5
               : 0;
        let R2 = args.r2 > Rmin ? args.r2 - 2.5
               : args.r2 < Rmin ? args.r2 + 2.5
               : 0;
        let dx = x2-x1, dy = y2-y1, dd = dx**2 + dy**2;
        let R12 = R1 + R2, l = Math.sqrt(dd - R12**2);
        let cpsi = (R12*dx + l*dy)/dd;
        let spsi = (R12*dy - l*dx)/dd;
        x1 = x1 + cpsi*R1,
        y1 = y1 + spsi*R1,
        x2 = x2 - cpsi*R2,
        y2 = y2 - spsi*R2;
        return g2().lin({x1:x1,x2:x2,y1:y1,y2:y2,ls:'#888',lw:4});
    }
})


/**
 * Polygon ground.
 * @method
 * @returns {object} g2
 * @param {object} - ground arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {bool} [closed=false] - closed polygon.
 * @property {number} [h=4] - ground shade line width.
 * @property {string} [pos=right] - ground shade position ['left','right'].
 * @example
 * g2().ground({pts:[25,25,25,75,75,75,75,25,125,25],pos:'left'})
 */
g2.prototype.ground = function () { return this.addCommand({c:'ground',a:arguments[0]}); }
g2.prototype.ground.prototype = g2.mix(g2.prototype.ply.prototype,{
    g2() {
        const args = Object.assign({h:4}, this); // , {closed: this.closed || false});
        const itr = g2.pntItrOf(args.pts);
        let pn, en, lam, i;
        let pp = itr(i=0);
        let p0 = pp;
        let h = args.h;
        let p = itr(++i);
        let dx = p.x - pp.x;
        let dy = p.y - pp.y;
        let len = Math.hypot(dx,dy) || 1;
        let ep = {x:dx/len,y:dy/len};
        let e0 = ep;
        let eq = [p0];
        let sign = args.pos === 'left' ? 1 : -1;
        for (pn = itr(++i); i < itr.len; pn = itr(++i)) {
            dx = pn.x - p.x; dy = pn.y - p.y; len = Math.hypot(dx,dy) || 1;
            len = Math.hypot(dx,dy) || 1;
            en = {x:dx/len,y:dy/len};
            lam = (1 - en.x*ep.x - en.y*ep.y) / (ep.y*en.x - ep.x*en.y);
            eq.push({x:p.x+sign*(h+1)*(lam*ep.x - ep.y), y:p.y+sign*(h+1)*(lam*ep.y + ep.x)});
            ep = en;
            pp = p;
            p = pn;
        }
        if (args.closed) {
            dx = p0.x-p.x; dy = p0.y-p.y; len = Math.hypot(dx,dy) || 1;
            en = {x:dx/len,y:dy/len};
            lam = (1 - en.x*ep.x - en.y*ep.y) / (ep.y*en.x - ep.x*en.y);
            eq.push({x:p.x+sign*(h+1)*(lam*ep.x - ep.y), y:p.y+sign*(h+1)*(lam*ep.y + ep.x)});
            lam = (1 - e0.x*en.x - e0.y*en.y) / (en.y*e0.x - en.x*e0.y);
            eq[0] = {x:p0.x+sign*(h+1)*(-lam*e0.x - e0.y), y:p0.y+sign*(h+1)*(-lam*e0.y + e0.x)};
        } else {
            eq[0] = {x:p0.x-sign*(h+1)*e0.y, y:p0.y+sign*(h+1)*e0.x};
            eq.push({x:p.x -sign*(h+1)*ep.y, y:p.y +sign*(h+1)*ep.x});
        }
        return g2()
            .beg({x:-0.5,y:-0.5,ls:'@linkcolor',lw:2,fs:'transparent',lc:'butt',lj:'miter'})
            .ply(Object.assign({}, args,{pts:eq,ls:'@nodfill2',lw:2*h}))
            .ply(Object.assign({}, args))
            .end();
    }
});

/**
 * Polygonial line load. The first and last point define the base line onto which
 * the load is acting orthogonal.
 * @method
 * @returns {object} g2
 * @param {object} - load arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {number} w - angle of vectors.
 * @property {number} spacing - spacing of the vectors drawn as a positive real number, interprete as<br>
 *                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>
 *                       * spacing &gt; 1: length of spacing.
 */
g2.prototype.load = function () { return this.addCommand({c:'load',a:arguments[0]}); }
g2.prototype.load.prototype = g2.mix(g2.prototype.ply.prototype,{
    g2() {
        const args = Object.assign({ pointAt: this.pointAt, spacing: 20, w: -Math.PI/2 }, this);
        const pitr = g2.pntItrOf(args.pts), startLoc = [], arr = [];
        let arrLen = 0;
        for (let itr = 0; itr < pitr.len ; itr++) {
            arr.push(pitr(itr));
        }
        if (arr[arr.length-1] !== arr[0]) {
            arr.push(arr[0]);
        }
        for (let itr = 1; itr < arr.length; itr++) {
            arrLen += Math.hypot(arr[itr].y-arr[itr-1].y,arr[itr].x-arr[itr-1].x);
        }
        for(let itr=0;itr*args.spacing < arrLen; itr++) {
            startLoc.push((itr*args.spacing)/arrLen);
        }
        args.pts = arr; // for args.pointsAt(...)...
        /*-----------------------------------stolen from g2.lib-----------------------------------*/
        function isPntInPly({x,y}) {
            let match = 0;
            for (let n=arr.length,i=0,pi=arr[i],pj=arr[n-1]; i<n; pj=pi,pi=arr[++i]) {
                if(    (y >= pi.y || y >= pj.y)
                    && (y <= pi.y || y <= pj.y)
                    && (x <= pi.x || x <= pj.x)
                    &&  pi.y !== pj.y
                    && (pi.x === pj.x || x <= pj.x + (y-pj.y)*(pi.x-pj.x)/(pi.y-pj.y))) {
                    match++;
                }
            }
            return match%2 != 0;
        };
        /*----------------------------------------------------------------------------------------*/
        return g2()
            .ply({pts:args.pts,closed:true,ls:'transparent',fs:'@linkfill'})
            .ins(g => {
                for (const pts of startLoc) {
                    let dist = (10*args.lw||10); // minimum distance a vector has to be
                    const {x,y} = args.pointAt(pts);
                    const t = {
                        x:x+Math.cos(args.w)*dist,
                        y:y+Math.sin(args.w)*dist
                    };
                    if (isPntInPly(t,{pts:arr})) {
                        while(isPntInPly(t,{pts:arr})) {
                            dist++;
                            t.x = x+Math.cos(args.w)*dist,
                            t.y = y+Math.sin(args.w)*dist
                        };
                        g.vec({
                            x1:x,   y1:y,
                            x2:t.x, y2:t.y,
                            ls: args.ls || "darkred",
                            lw: args.lw || 1
                        });
                    }
                }
            });
    }
});

"use strict"

/**
 * g2.chart (c) 2015-18 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @requires g2.ext.js
 * @typedef g2
 * @returns {object} chart
 * @param {object} args - Chart arguments object or
 * @property {float} x - x-position of lower left corner of chart rectangle.
 * @property {float} y - y-position of lower left corner of chart rectangle.
 * @property {float} [b=150] - width of chart rectangle.
 * @property {float} [h=100] - height of chart rectangle.
 * @property {string} [ls] - border color.
 * @property {string} [fs] - fill color.
 * @property {(string|object)} [title] - chart title.
 * @property {string} [title.text] - chart title text string.
 * @property {float} [title.offset=0] - chart title vertical offset.
 * @property {object} [title.style] - chart title style.
 * @property {string} [title.style.font=14px serif] - chart title font.
 * @property {string} [title.style.thal=center] - chart title horizontal align.
 * @property {string} [title.style.tval=bottom] - chart title vertical align.
 * @property {array} [funcs=[]] - array of dataset `data` and/or function `fn` objects.
 * @property {object} [funcs[item]] - dataset or function object.
 * @property {array} [funcs[item].data] - data points as flat array `[x,y,..]`, array of point arrays `[[x,y],..]` or array of point objects `[{x,y},..]`.
 * @property {function} [funcs[item].fn] - function `y = f(x)` recieving x-value returning y-value.
 * @property {float} [funcs[item].dx] - x increment to apply to function `fn`. Ignored with data points.
 * @property {boolean} [funcs[item].fill] - fill region between function graph and x-origin line.
 * @property {boolean} [funcs[item].dots] - place circular dots at data points (Avoid with `fn`s).
 * @property {boolean|object} [xaxis=false] - x-axis.
 * @property {boolean|object} [xaxis.grid=false] - x-axis grid lines.
 * @property {string} [xaxis.grid.ls] - x-axis grid line style (color).
 * @property {string} [xaxis.grid.lw] - x-axis grid line width.
 * @property {string} [xaxis.grid.ld] - x-axis grid line dash style.
 * @property {boolean} [xaxis.line=true] - display x-axis base line.
 * @property {boolean} [xaxis.origin=false] - display x-axis origin line.
 * @property {boolean|object} [yaxis=false] - y-axis.
 * @property {boolean|object} [yaxis.grid=false] - y-axis grid lines.
 * @property {string} [yaxis.grid.ls] - y-axis grid line style color.
 * @property {string} [yaxis.grid.lw] - y-axis grid line width.
 * @property {string} [yaxis.grid.ld] - y-axis grid line dash style.
 * @property {boolean} [yaxis.line=true] - display y-axis base line.
 * @property {boolean} [yaxis.origin=false] - display y-axis origin line.
 * @property {float} [xmin] - minimal x-axis value. If not given it is calculated from chart data values.
 * @property {float} [xmax] - maximal x-axis value. If not given it is calculated from chart data values.
 * @property {float} [ymin] - minimal y-axis value. If not given it is calculated from chart data values.
 * @property {float} [ymax] - maximal y-axis value. If not given it is calculated from chart data values.
 */
g2.prototype.chart = function chart({ x, y, b, h, style, title, funcs, xaxis, xmin, xmax, yaxis, ymin, ymax }) {
    return this.addCommand({ c: 'chart', a: arguments[0] });
}
g2.prototype.chart.prototype = {
    g2() {
        const g = g2(),
            funcs = this.get('funcs'),
            title = this.title && this.get('title');

        if (!this.b) this.b = this.defaults.b;
        if (!this.h) this.h = this.defaults.h;
        // initialize function graphs (only once ...)
        if (funcs && funcs.length) {  // init all funcs ...
            const tmp = [
                this.xmin === undefined,
                this.xmax === undefined,
                this.ymin === undefined,
                this.ymax === undefined
            ];
            funcs.forEach(f => this.initFunc(f, ...tmp));
        }
        if (this.xaxis)
            this.xAxis = this.autoAxis(this.get('xmin'), this.get('xmax'), 0, this.b);
        if (this.yaxis)
            this.yAxis = this.autoAxis(this.get('ymin'), this.get('ymax'), 0, this.h);

        // draw background & border ...
        g.rec({
            x: this.x, y: this.y, b: this.b, h: this.h,
            fs: this.get("fs"), ls: this.get("ls")
        });

        // draw title & axes ...
        g.beg(Object.assign({ x: this.x, y: this.y, lw: 1 }, this.defaults.style, this.style));

        if (title)
            g.txt(Object.assign({
                str: this.title && this.title.text || this.title,
                x: this.get('b') / 2,
                y: this.get('h') + this.get("title", "offset"),
                w: 0
            }, this.defaults.title.style,
                (this.title && this.title.style || {})
            ));
        if (this.xaxis) this.drawXAxis(g);
        if (this.yaxis) this.drawYAxis(g);

        g.end();

        // draw funcs ...
        if (funcs) {
            funcs.forEach((fnc, i) => {
                this.drawFunc(g, fnc, this.defaults.colors[i % this.defaults.colors.length])
            });
        }

        return g;
    },
    /**
     * Initialize chart function.
     * @private
     */
    initFunc(fn, setXmin, setXmax, setYmin, setYmax) {
        // Install func iterator.
        let itr;
        if (fn.data && fn.data.length) { // data must have a polyline conform array structure
            itr = fn.itr = g2.pntItrOf(fn.data);  // get iterator ...
        }
        else if (fn.fn && fn.dx) {
            const xmin = +this.xmin || this.defaults.xmin;
            const xmax = +this.xmax || this.defaults.xmax;
            itr = fn.itr = (i) => { let x = xmin + i * fn.dx; return { x: x, y: fn.fn(x) }; }
            itr.len = (xmax - xmin) / fn.dx + 1;
        }
        // Get func's bounding box
        if (itr && (setXmin || setXmax || setYmin || setYmax)) {
            const xarr = [];
            const yarr = [];
            for (let i = 0; i < itr.len; ++i) {
                xarr.push(itr(i).x);
                yarr.push(itr(i).y);
            }
            if (setXmin) {
                const xmin = Math.min(...xarr);
                if (!this.xmin || xmin < this.xmin) this.xmin = xmin;
            }
            if (setXmax) {
                const xmax = Math.max(...xarr);
                if (!this.xmax || xmax > this.xmax) this.xmax = xmax;
            }
            if (setYmin) {
                const ymin = Math.min(...yarr);
                if (!this.ymin || ymin < this.ymin) this.ymin = ymin;
            }
            if (setYmax) {
                const ymax = Math.max(...yarr);
                if (!this.ymax || ymax > this.ymax) this.ymax = ymax;
            }

            if (fn.color && typeof fn.color === "number") // color index [0..n]
                fn.color = this.defaults.colors[fn.color % this.defaults.colors.length];
        }
    },
    autoAxis(zmin, zmax, tmin, tmax) {
        let base = 1, exp = 1, eps = Math.sqrt(Number.EPSILON),
            Dz = zmax - zmin || 1,      // value range
            Dt = tmax - tmin || 1,      // area range
            scl = Dz > eps ? Dt / Dz : 1, // scale [usr]->[pix]
            dz = base * Math.pow(10, exp), // tick size [usr]
            dt = Math.floor(scl * dz),    // tick size [pix]
            N,                          // # segments
            i0, j0, jth, t0;

        while (dt < 14 || dt > 35) {
            if (dt < 14) {
                if (base == 1) base = 2;
                else if (base == 2) base = 5;
                else if (base == 5) { base = 1; exp++; }
            }
            else { // dtick > 35
                if (base == 1) { base = 5; exp--; }
                else if (base == 2) base = 1;
                else if (base == 5) base = 2;
            }
            dz = base * Math.pow(10, exp);
            dt = scl * dz;
        }
        i0 = (scl * Math.abs(zmin) + eps / 2) % dt < eps
            ? Math.floor(zmin / dz)
            : Math.floor(zmin / dz) + 1;
        let z0 = i0 * dz;
        t0 = Math.round(scl * (z0 - zmin));
        N = Math.floor((Dt - t0) / dt) + 1;
        j0 = base % 2 && i0 % 2 ? i0 + 1 : i0;
        jth = exp === 0 && N < 11 ? 1 : base === 2 && N > 9 ? 5 : 2;

        return {
            zmin,               // min usr value
            zmax,               // max usr value
            base,               // one of [1,2,5]
            exp,                // 10^exp
            scl,                // scale [usr]->[pix]
            dt,                 // tick range [pix]
            dz,                 // tick range [usr]
            N,                  // # of ticks
            t0,                 // start tick position [pix]
            z0,                 // start tick position [usr]
            i0,                 // first tick index relative to tick origin (can be negative)
            j0,                 // first labeled tick
            jth,                // # of ticks between two major ticks
            itr(i) {            // tick iterator
                return {
                    t: this.t0 + i * this.dt,
                    z: parseFloat((this.z0 + i * this.dz).toFixed(Math.abs(this.exp))),
                    maj: (this.j0 - this.i0 + i) % this.jth === 0
                };
            }
        }
    },
    /**
     * Draw x-axis.
     * @private
     */
    drawXAxis(g) {
        let tick,
            showgrid = this.xaxis && this.xaxis.grid,
            gridstyle = showgrid && Object.assign({}, this.defaults.xaxis.grid, this.xaxis.grid),
            showaxis = this.xaxis || this.xAxis,
            axisstyle = showaxis && Object.assign({}, this.defaults.xaxis.style, this.defaults.xaxis.labels.style, (this.xaxis && this.xaxis.style || {})),
            showline = showaxis && this.get("xaxis", "line"),
            showlabels = this.xAxis && showaxis && this.get("xaxis", "labels"),
            showticks = this.xAxis && showaxis && this.get("xaxis", "ticks"),
            ticklen = showticks ? this.get("xaxis", "ticks", "len") : 0,
            showorigin = showaxis && this.get("xaxis", "origin"),
            title = this.xaxis && (this.get("xaxis", "title", "text") || this.xaxis.title) || '';
        g.beg(axisstyle);
        for (let i = 0; i < this.xAxis.N; i++) {
            tick = this.xAxis.itr(i);
            if (showgrid) g.lin(Object.assign({ x1: tick.t, y1: 0, x2: tick.t, y2: this.h }, gridstyle));
            if (showticks) g.lin({ x1: tick.t, y1: tick.maj ? ticklen : 2 / 3 * ticklen, x2: tick.t, y2: tick.maj ? -ticklen : -2 / 3 * ticklen });
            if (showlabels && tick.maj)  // add label
                g.txt(Object.assign({
                    str: parseFloat(tick.z),
                    x: tick.t,
                    y: -(this.get("xaxis", "ticks", "len") + this.get("xaxis", "labels", "offset")),
                    w: 0
                }, (this.get("xaxis", "labels", "style") || {})));
        }
        if (showline)
            g.lin({ y1: 0, y2: 0, x1: 0, x2: this.b });
        if (showorigin && this.xmin <= 0 && this.xmax >= 0)
            g.lin({ x1: -this.xAxis.zmin * this.xAxis.scl, y1: 0, x2: -this.xAxis.zmin * this.xAxis.scl, y2: this.h });  // origin line emphasized ...
        if (title)
            g.txt(Object.assign({
                str: title.text || title,
                x: this.b / 2,
                y: -(this.get("xaxis", "title", "offset")
                    + (showticks && this.get("xaxis", "ticks", "len") || 0)
                    + (showlabels && this.get("xaxis", "labels", "offset") || 0)
                    + (showlabels && parseFloat(this.get("xaxis", "labels", "style", "font")) || 0)),
                w: 0
            }, (this.get('xaxis', 'title', 'style'))));
        g.end();
    },
    /**
     * Draw y-axis.
     * @private
     */
    drawYAxis(g) {
        let tick,
            showgrid = this.yaxis && this.yaxis.grid,
            gridstyle = showgrid && Object.assign({}, this.defaults.yaxis.grid, this.yaxis.grid),
            showaxis = this.yaxis || this.yAxis,
            axisstyle = showaxis && Object.assign({}, this.defaults.yaxis.style, this.defaults.yaxis.labels.style, (this.yaxis && this.yaxis.style || {})),
            showline = showaxis && this.get("yaxis", "line"),
            showlabels = this.yAxis && showaxis && this.get("yaxis", "labels"),
            showticks = this.yAxis && showaxis && this.get("yaxis", "ticks"),
            ticklen = showticks ? this.get("yaxis", "ticks", "len") : 0,
            showorigin = showaxis && this.get("yaxis", "origin"),
            title = this.yaxis && (this.get("yaxis", "title", "text") || this.yaxis.title) || '';

        // draw tick/grid lines
        g.beg(axisstyle);
        for (let i = 0; i < this.yAxis.N; i++) {
            tick = this.yAxis.itr(i);
            if (i && showgrid) g.lin(Object.assign({ y1: tick.t, x2: this.b, x1: 0, y2: tick.t }, gridstyle));
            if (showticks) g.lin({ y1: tick.t, x2: tick.maj ? -ticklen : -2 / 3 * ticklen, y2: tick.t, y2: tick.t, x1: tick.maj ? ticklen : 2 / 3 * ticklen });
            if (showlabels && tick.maj)  // add label
                g.txt(Object.assign({
                    str: parseFloat(tick.z),
                    x: -(this.get("yaxis", "ticks", "len") + this.get("yaxis", "labels", "offset")),
                    y: tick.t,
                    w: Math.PI / 2
                }, this.get("yaxis", "labels", "style")));
        }
        if (showline)
            g.lin({ y1: 0, x1: 0, x2: 0, y2: this.h });
        if (showorigin && this.ymin <= 0 && this.ymax >= 0)
            g.lin({ x1: 0, y1: -this.yAxis.zmin * this.yAxis.scl, x2: this.b, y2: -this.yAxis.zmin * this.yAxis.scl });  // origin line emphasized ...
        if (title)
            g.txt(Object.assign({
                str: title.text || title,
                x: -(this.get("yaxis", "title", "offset")
                    + (showticks && this.get("yaxis", "ticks", "len") || 0)
                    + (showlabels && this.get("yaxis", "labels", "offset") || 0)
                    + (showlabels && parseFloat(this.get("yaxis", "labels", "style", "font")) || 0)),
                y: this.h / 2,
                w: Math.PI / 2
            }, (this.get('yaxis', 'title', 'style'))));
        g.end();
    },
    /**
     * Draw chart function.
     * @private
     */
    drawFunc(g, fn, defaultcolor) {
        let itr = fn.itr;

        if (itr) {
            let fill = fn.fill || fn.style && fn.style.fs && fn.style.fs !== "transparent",
                color = fn.color = fn.color || fn.style && fn.style.ls || defaultcolor,
                plydata = [],
                args = Object.assign({
                    pts: plydata,
                    closed: false,
                    ls: color,
                    fs: (fill ? g2.color.rgbaStr(color, 0.125) : 'transparent'),
                    lw: 1
                }, fn.style);

            if (fill) { // start from base line (y=0)
                plydata.push(this.pntOf({ x: itr(0).x, y: 0 }));
            }

            const fence = ({ x, y }) => ({
                x: Math.max(Math.min(this.xmax, x), this.xmin),
                y: Math.max(Math.min(this.ymax, y), this.ymin)
            });

            plydata.push(this.pntOf(fence(itr(0))));
            
            for (let i = 1, n = itr.len; i < n; i++) {
                const cur = itr(i);
                let bfr = itr(i - 1);
                const m = (cur.y - bfr.y) / (cur.x - bfr.x);
                // If the point before is out of bounds, draw a point to the next
                // point "in bounds" and use this as point before.
                // Please note, that the gradient "m" stays the same.
                if (bfr.y > this.ymax || bfr.y < this.ymin) {
                    const {y} = fence(bfr);
                    const x = bfr.x + (y - bfr.y) / m;
                    bfr = {x, y};
                    plydata.push(this.pntOf(bfr));
                }
                // Put the next point in bounds.
                // The next point will not use this as "before" point,
                // but will adjust this with the condition above anyway.
                const {y} = fence(cur);
                const x = cur.x + (m ? (y - cur.y) / m : 0);
                plydata.push(this.pntOf({x, y}));
            }
            if (fill) {  // back to base line (y=0)
                plydata.push(this.pntOf({ x: itr(itr.len - 1).x, y: 0 }));
            }
            if (fn.spline && g.spline) {
                g.spline(args);
            }
            else {
                g.ply(args);
            }
            if (fn.dots) {
                g.beg({ fs: "snow" });
                for (var i = 0; i < plydata.length; i++)
                    g.cir(Object.assign({}, plydata[i], { r: 2, lw: 1 }));
                g.end();
            }
        }
    },
    /**
     * Point in canvas coordinates of xy values in chart area.
     * Result is trimmed to chart area region limits.
     * TODO: implement true polygon clipping against window ... !
     * @returns {object} point.
     * @param {object} xy xy values in chart area.
     */
    pntOf: function (xy) {
        return {
            x: this.x + Math.max(Math.min((xy.x - this.xAxis.zmin) * this.xAxis.scl, this.b), 0),
            y: this.y + Math.max(Math.min((xy.y - this.yAxis.zmin) * this.yAxis.scl, this.h), 0)
        };
    },
    /**
      * Get nested chart property either as custom property or as default property.
      * @private
      */
    get(n1, n2, n3, n4) {
        const loc = n4 ? this[n1] && this[n1][n2] && this[n1][n2][n3] && this[n1][n2][n3][n4]
            : n3 ? this[n1] && this[n1][n2] && this[n1][n2][n3]
                : n2 ? this[n1] && this[n1][n2]
                    : n1 ? this[n1]
                        : undefined,
            dflts = this.defaults;
        return loc !== undefined
            ? loc
            : n4 ? dflts[n1] && dflts[n1][n2] && dflts[n1][n2][n3] && dflts[n1][n2][n3][n4]
                : n3 ? dflts[n1] && dflts[n1][n2] && dflts[n1][n2][n3]
                    : n2 ? dflts[n1] && dflts[n1][n2]
                        : n1 ? dflts[n1]
                            : undefined;
    },
    // default properties
    defaults: {
        x: 0,
        y: 0,
        xmin: 0, xmax: 1,
        ymin: 0, ymax: 1,
        b: 150,
        h: 100,
        ls: "transparent",
        fs: "#efefef",
        color: false,
        colors: [
            "#426F42", /*medium seagreen*/
            "#8B2500", /*orange red 4*/
            "#23238E", /*navy*/
            "#5D478B"  /*medium purple 4*/
        ],
        title: {
            text: '',
            offset: 3,
            style: { font: "16px serif", fs: "black", thal: "center", tval: "bottom" }
        },
        funcs: [],
        /*
        func: {
            style: { lw:1, fs:"transparent" },
            // s. https://web.njit.edu/~kevin/rgb.txt.html
        },
        */
        xaxis: {
            fill: false,
            line: true,
            style: { ls: "#888", thal: "center", tval: "top", fs: "black" },
            origin: false,
            title: {
                text: null,
                offset: 1,
                style: { font: "12px serif", fs: "black" },
            },
            ticks: { len: 6 },
            grid: { ls: "#ddd", ld: [] },
            labels: {
                loc: "auto",    // "auto" | [2,4,6] | [{v:3.14,s:"pi"},{v:6.28,s:"2*pi"}]
                offset: 1,
                style: { font: "11px serif", fs: "black" },
            }
        },
        yaxis: {
            line: true,
            style: { ls: "#888", thal: "center", tval: "bottom", fs: "black" },
            origin: false,
            title: {
                text: null,
                offset: 2,
                style: { font: "12px serif", fs: "black" },
            },
            ticks: { len: 6 },
            grid: { ls: "#ddd", ld: [] },
            labels: {
                loc: "auto",    // "auto" | [2,4,6] | [{v:3.14,s:"pi"},{v:6.28,s:"2*pi"}]
                offset: 1,
                style: { font: "11px serif", fs: "black" },
            }
        }
    }
}

g2.color = {
    // convert to object {r,g,b,a}
    rgba(color, alpha) {
        let res;
        alpha = alpha !== undefined ? alpha : 1;
        // color name ?
        if (color === "transparent")
            return { r: 0, g: 0, b: 0, a: 0 };
        if (color in g2.color.names)
            color = "#" + g2.color.names[color];
        // #rrggbb
        if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return { r: parseInt(res[1], 16), g: parseInt(res[2], 16), b: parseInt(res[3], 16), a: alpha };
        // Look for #rgb
        if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return { r: parseInt(res[1] + res[1], 16), g: parseInt(res[2] + res[2], 16), b: parseInt(res[3] + res[3], 16), a: alpha };
        // rgb(rrr,ggg,bbb)
        if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return { r: parseInt(res[1]), g: parseInt(res[2]), b: parseInt(res[3]), a: alpha };
        // rgba(rrr,ggg,bbb,a)
        if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(color))
            return { r: parseInt(res[1]), g: parseInt(res[2]), b: parseInt(res[3]), a: (alpha !== undefined ? alpha : parseFloat(res[4])) };
        // rgb(rrr%,ggg%,bbb%)
        if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return { r: parseFloat(res[1]) * 2.55, g: parseFloat(res[2]) * 2.55, b: parseFloat(result[3]) * 2.55, a: alpha };
    },
    rgbaStr(color, alpha) {
        const c = g2.color.rgba(color, alpha);
        return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
    },
    names: {
        aliceblue: 'f0f8ff', antiquewhite: 'faebd7', aqua: '00ffff', aquamarine: '7fffd4', azure: 'f0ffff', beige: 'f5f5dc', bisque: 'ffe4c4', black: '000000',
        blanchedalmond: 'ffebcd', blue: '0000ff', blueviolet: '8a2be2', brown: 'a52a2a', burlywood: 'deb887', cadetblue: '5f9ea0', chartreuse: '7fff00',
        chocolate: 'd2691e', coral: 'ff7f50', cornflowerblue: '6495ed', cornsilk: 'fff8dc', crimson: 'dc143c', cyan: '00ffff', darkblue: '00008b', darkcyan: '008b8b',
        darkgoldenrod: 'b8860b', darkgray: 'a9a9a9', darkgreen: '006400', darkkhaki: 'bdb76b', darkmagenta: '8b008b', darkolivegreen: '556b2f', darkorange: 'ff8c00',
        darkorchid: '9932cc', darkred: '8b0000', darksalmon: 'e9967a', darkseagreen: '8fbc8f', darkslateblue: '483d8b', darkslategray: '2f4f4f', darkturquoise: '00ced1',
        darkviolet: '9400d3', deeppink: 'ff1493', deepskyblue: '00bfff', dimgray: '696969', dodgerblue: '1e90ff', feldspar: 'd19275', firebrick: 'b22222',
        floralwhite: 'fffaf0', forestgreen: '228b22', fuchsia: 'ff00ff', gainsboro: 'dcdcdc', ghostwhite: 'f8f8ff', gold: 'ffd700', goldenrod: 'daa520', gray: '808080',
        green: '008000', greenyellow: 'adff2f', honeydew: 'f0fff0', hotpink: 'ff69b4', indianred: 'cd5c5c', indigo: '4b0082', ivory: 'fffff0', khaki: 'f0e68c',
        lavender: 'e6e6fa', lavenderblush: 'fff0f5', lawngreen: '7cfc00', lemonchiffon: 'fffacd', lightblue: 'add8e6', lightcoral: 'f08080', lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2', lightgrey: 'd3d3d3', lightgreen: '90ee90', lightpink: 'ffb6c1', lightsalmon: 'ffa07a', lightseagreen: '20b2aa',
        lightskyblue: '87cefa', lightslateblue: '8470ff', lightslategray: '778899', lightsteelblue: 'b0c4de', lightyellow: 'ffffe0', lime: '00ff00', limegreen: '32cd32',
        linen: 'faf0e6', magenta: 'ff00ff', maroon: '800000', mediumaquamarine: '66cdaa', mediumblue: '0000cd', mediumorchid: 'ba55d3', mediumpurple: '9370d8',
        mediumseagreen: '3cb371', mediumslateblue: '7b68ee', mediumspringgreen: '00fa9a', mediumturquoise: '48d1cc', mediumvioletred: 'c71585', midnightblue: '191970',
        mintcream: 'f5fffa', mistyrose: 'ffe4e1', moccasin: 'ffe4b5', navajowhite: 'ffdead', navy: '000080', oldlace: 'fdf5e6', olive: '808000', olivedrab: '6b8e23',
        orange: 'ffa500', orangered: 'ff4500', orchid: 'da70d6', palegoldenrod: 'eee8aa', palegreen: '98fb98', paleturquoise: 'afeeee', palevioletred: 'd87093',
        papayawhip: 'ffefd5', peachpuff: 'ffdab9', peru: 'cd853f', pink: 'ffc0cb', plum: 'dda0dd', powderblue: 'b0e0e6', purple: '800080', rebeccapurple: '663399',
        red: 'ff0000', rosybrown: 'bc8f8f', royalblue: '4169e1', saddlebrown: '8b4513', salmon: 'fa8072', sandybrown: 'f4a460', seagreen: '2e8b57', seashell: 'fff5ee',
        sienna: 'a0522d', silver: 'c0c0c0', skyblue: '87ceeb', slateblue: '6a5acd', slategray: '708090', snow: 'fffafa', springgreen: '00ff7f', steelblue: '4682b4',
        tan: 'd2b48c', teal: '008080', thistle: 'd8bfd8', tomato: 'ff6347', turquoise: '40e0d0', violet: 'ee82ee', violetred: 'd02090', wheat: 'f5deb3', white: 'ffffff',
        whitesmoke: 'f5f5f5', yellow: 'ffff00', yellowgreen: '9acd32'
    }
}

