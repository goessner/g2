
"use strict"

/**
 * g2.core (c) 2013-19 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 * @typedef {g2}
 * @param {object} [opts] Custom options object. It is simply copied into the 'g2' instance, but not used from the g2 kernel.
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
    if (opts) Object.assign(o,opts);
    return o;
}

g2.prototype = {
    /**
     * Clear viewport region.<br>
     * @method
     * @returns {object} g2
     */
    clr() { return this.addCommand({c:'clr'}); },

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
    view({scl,x,y,cartesian}) { return this.addCommand({c:'view',a:arguments[0]}); },

    /**
     * Draw grid.
     * @method
     * @returns {object} g2
     * @param {object} - grid arguments object.
     * @property {string} [color=#ccc] - change color.
     * @property {number} [size=20] - change space between lines.
     */
    grid({color,size}={}) { return this.addCommand({c:'grid',a:arguments[0]}); },

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
    cir({x,y,r,w}) { return this.addCommand({c:'cir',a:arguments[0]}); },

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
    ell({x,y,rx,ry,w,dw,rot}) { return this.addCommand({c:'ell',a:arguments[0]}); },

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
    arc({x,y,r,w,dw}) { return this.addCommand({c:'arc',a:arguments[0]}); },

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
    rec({x,y,b,h}) { return this.addCommand({c:'rec',a:arguments[0]}); },

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
    lin({x1,y1,x2,y2}) { return this.addCommand({c:'lin',a:arguments[0]}); },

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
    ply({pts,format,closed,x,y,w}) {
        arguments[0]._itr = format && g2.pntIterator[format](pts) || g2.pntItrOf(pts);
        return this.addCommand({c:'ply',a:arguments[0]});
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
    txt({str,x,y,w}) { return this.addCommand({c:'txt',a:arguments[0]}); },

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
    use({grp,x,y,w,scl}) {
        if (grp && grp !== this) {     // avoid self reference ..
            if (typeof grp === "string") // must be a member name of the 'g2.symbol' namespace
                arguments[0].grp = g2.symbol[(grp in g2.symbol) ? grp : 'unknown'];
            this.addCommand({c:'use',a:arguments[0]});
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
    img({uri,x,y,b,h,sx,sy,sb,sh,xoff,yoff,w,scl}) { return this.addCommand({c:'img',a:arguments[0]}); },

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
    beg({x,y,w,scl,matrix}={}) { return this.addCommand({c:'beg',a:arguments[0]}); },

    /**
     * End subcommands. Previous state is restored.
     * @method
     * @returns {object} g2
     * @param {object} - end arguments object.
     */
    end() { // ignore 'end' commands without matching 'beg'
        let myBeg = 1,
            findMyBeg = (cmd) => {   // care about nested beg...end blocks ...
                if      (cmd.c === 'beg') myBeg--;
                else if (cmd.c === 'end') myBeg++;
                return myBeg === 0;
            }
        return g2.cmdIdxBy(this.commands,findMyBeg) !== false ? this.addCommand({c:'end'}) : this;
    },

    /**
     * Begin new path.
     * @method
     * @returns {object} g2
     */
    p() { return this.addCommand({c:'p'}); },

    /**
     * Close current path by straight line.
     * @method
     * @returns {object} g2
     */
    z() { return this.addCommand({c:'z'}); },

    /**
     * Move to point.
     * @method
     * @returns {object} g2
     * @param {object} - move arguments object.
     * @property {number} x - move to x coordinate
     * @property {number} y - move to y coordinate
     */
    m({x,y}) { return this.addCommand({c:'m',a:arguments[0]}); },

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
     *     .l(x:400,y:100}) // ...
     *     .stroke()        // Stroke path.
     */
    l({x,y}) { return this.addCommand({c:'l',a:arguments[0]}); },

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
    q({x1,y1,x,y}) { return this.addCommand({c:'q',a:arguments[0]});},

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
    c({x1,y1,x2,y2,x,y}) { return this.addCommand({c:'c',a:arguments[0]}); },

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
     *     .a({dw:2,x:300,y:100})   // Create cubic bezier curve.
     *     .stroke()       // Stroke path.
     *     .exe(ctx);      // Render to canvas context.
     */
    a({dw,x,y}) {
        let prvcmd = this.commands[this.commands.length-1];
        g2.cpyProp(prvcmd.a,'x',arguments[0],'_xp');
        g2.cpyProp(prvcmd.a,'y',arguments[0],'_yp');
        return this.addCommand({c:'a',a:arguments[0]});
    },

    /**
     * Stroke the current path or path object.
     * @method
     * @returns {object} g2
     * @param {object} - stroke arguments object.
     * @property {string} [d = undefined] - SVG path definition string. Current path is ignored then.
     */
    stroke({d}={}) { return this.addCommand({c:'stroke',a:arguments[0]}); },

    /**
     * Fill the current path or path object.
     * @method
     * @returns {object} g2
     * @param {object} - fill arguments object.
     * @property {string} [d = undefined] - SVG path definition string. Current path is ignored then.
     */
    fill({d}={}) { return this.addCommand({c:'fill',a:arguments[0]}); },

    /**
     * Shortcut for stroke and fill the current path or path object.
     * In case of shadow style, only the path interior creates shadow, not also the path contour.
     * @method
     * @returns {object} g2
     * @param {object} - drw arguments object.
     * @property {string} [d = undefined] - SVG path definition string.  Current path is ignored then.
     */
    drw({d,lsh}={}) { return this.addCommand({c:'drw',a:arguments[0]}); },

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
             : typeof arg === 'object'   ? ( this.commands.push({a:arg}), this ) // no explicit command name .. !
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
    addCommand({c,a}) {
        if (a && Object.getPrototypeOf(a) === Object.prototype) {  // modify only pure argument objects 'a' .. !
            for (const key in a) {
                if (!Object.getOwnPropertyDescriptor(a,key).get    // if 'key' is no getter ...
                    && key[0] !== '_'                                 // and no private property ... 
                    && typeof a[key] === 'function') {                // and a function ... make it a getter
                    Object.defineProperty(a, key, { get:a[key], enumerable:true, configurable:true, writabel:false });
                }
                if (typeof a[key] === 'string' && a[key][0] === '@') {  // referring values by neighbor id's
                    const refidIdx = a[key].indexOf('.');
                    const refid = refidIdx > 0 ? a[key].substr(1,refidIdx-1) : '';
                    const refkey = refid ? a[key].substr(refidIdx+1) : '';
                    const refcmd = refid ? () => this.commands.find((cmd) => cmd.a && cmd.a.id === refid) : undefined;

                    if (refcmd)
                        Object.defineProperty(a, key, { 
                            get: function() {
                                const rc = refcmd();
                                return  rc && (refkey in rc.a) ? rc.a[refkey] : 0;
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
g2.defaultStyle = {fs:'transparent',ls:'#000',lw:1,lc:"butt",lj:"miter",ld:[],ml:10,sh:[0,0],lsh:false,font:'14px serif',thal:'start',tval:'alphabetic'};
g2.symbol = {
    unknown: g2().cir({r:12}).txt({str:'?',thal:'center',tval:'middle',font:'bold 20pt serif'})
};
g2.handler = function(ctx) {
    let hdl;
    for (let h of g2.handler.factory)
       if ((hdl = h(ctx)) !== false)
          return hdl;
    return false;
}
g2.handler.factory = [];

// predefined polyline/spline point iterators
g2.pntIterator = {
   "x,y":   function(pts) { 
                function pitr(i) { return {x:pts[2*i],y:pts[2*i+1]}; };
                Object.defineProperty(pitr, 'len', { get:() => pts.length/2, enumerable:true, configurable:true, writabel:false });
                return pitr; 
            },
   "[x,y]": function(pts) { 
                function pitr(i) { return pts[i] ? {x:pts[i][0],y:pts[i][1]} : undefined; }; 
                Object.defineProperty(pitr, 'len', { get:() => pts.length, enumerable:true, configurable:true, writabel:false });
                return pitr;
            },
   "{x,y}": function(pts) { 
                function pitr(i) { return pts[i]; };
                Object.defineProperty(pitr, 'len', { get:() => pts.length, enumerable:true, configurable:true, writabel:false });
                return pitr; 
            }
};
g2.pntItrOf = function(pts) {
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
g2.cmdIdxBy = function(cmds,callbk) {
    for (let i = cmds.length-1; i >= 0; i--)
        if (callbk(cmds[i],i,cmds))
            return i;
    return false;  // command with index '0' signals 'failing' ...
};

/**
 * Replacement for Object.assign, as it does not assign getters and setter properly ...
 * See https://medium.com/@benastontweet/mixins-in-javascript-700ec81f5e5c
 */
g2.mixin = function mixin(obj, ...protos) {
    protos.forEach(p => {
        Object.keys(p).forEach(k => {
            Object.defineProperty(obj, k, Object.getOwnPropertyDescriptor(p, k));
        })
    })
    return obj;
}

/**
 * Copy properties, even as getters .. a useful fraction of the above ..
 * @private
 */
g2.cpyProp = function(from,fromKey,to,toKey) { Object.defineProperty(to, toKey, Object.getOwnPropertyDescriptor(from, fromKey)); }

// Html canvas handler
g2.canvasHdl = function(ctx) {
    if (this instanceof g2.canvasHdl) {
        if (ctx instanceof CanvasRenderingContext2D) {
            this.ctx = ctx;
            this.cur = g2.defaultStyle;
            this.stack = [this.cur];
            this.matrix = [[1,0,0,1,0.5,0.5]];
            this.gridBase = 2;
            this.gridExp = 1;
            return this;
        }
        else
            return null;
    }
    return g2.canvasHdl.apply(Object.create(g2.canvasHdl.prototype),arguments);
};
g2.handler.factory.push((ctx) => ctx instanceof g2.canvasHdl ? ctx
                               : ctx instanceof CanvasRenderingContext2D ? g2.canvasHdl(ctx) : false);

g2.canvasHdl.prototype = {
    init(grp,style) {
        this.stack.length = 1;
        this.matrix.length = 1;
        this.initStyle(style ? Object.assign({},this.cur,style) : this.cur);
        return true;
    },
    async exe(commands) {
        for (let cmd of commands) {
            if (cmd.c && this[cmd.c]) {         // explicit command name .. !
                const rx = this[cmd.c](cmd.a);
                if (rx && rx instanceof Promise) {
                    await rx;
                }
            } else if (cmd.a) {                 // should be from 'ins' command
                if (cmd.a.commands)                // cmd.a is a `g2` object, so directly execute its commands array.
                    this.exe(cmd.a.commands);
                if (cmd.a.g2)                      // cmd.a is an object offering a `g2` method, so call it and execute its returned commands array.
                    this.exe(cmd.a.g2().commands);
            }
        }
    },
    view({x=0,y=0,scl=1,cartesian=false}) {
        this.pushTrf(cartesian ? [scl,0,0,-scl,x,this.ctx.canvas.height-1-y]
                               : [scl,0,0,scl,x,y] );
    },
    grid({color='#ccc',size}={}) {
        let ctx = this.ctx, b = ctx.canvas.width, h = ctx.canvas.height,
            {x,y,scl} = this.uniTrf,
            sz = size || this.gridSize(scl),
            xoff = x%sz, yoff = y%sz;
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x=xoff,nx=b+1; x<nx; x+=sz) { ctx.moveTo(x,0); ctx.lineTo(x,h); }
        for (let y=yoff,ny=h+1; y<ny; y+=sz) { ctx.moveTo(0,y); ctx.lineTo(b,y); }
        ctx.stroke();
        ctx.restore();
    },
    clr({b,h}={}) {
        let ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,b||ctx.canvas.width,h||ctx.canvas.height);
        ctx.restore();
    },
    cir({x=0,y=0,r}) {
        this.ctx.beginPath();
        this.ctx.arc(x||0,y||0,Math.abs(r),0,2*Math.PI,true);
        this.drw(arguments[0]);
    },
    arc({x=0,y=0,r,w=0,dw=2*Math.PI}) {
        if (Math.abs(dw) > Number.EPSILON && Math.abs(r) > Number.EPSILON) {
            this.ctx.beginPath();
            this.ctx.arc(x,y,Math.abs(r),w,w+dw,dw<0);
            this.drw(arguments[0]);
        }
        else if (Math.abs(dw) < Number.EPSILON && Math.abs(r) > Number.EPSILON) {
            const cw = Math.cos(w), sw = Math.sin(w);
            this.ctx.beginPath();
            this.ctx.moveTo(x-r*cw,y-r*sw);
            this.ctx.lineTo(x+r*cw,y+r*sw);
        }
    //  else  // nothing to draw with r === 0
    },
    ell({x=0,y=0,rx,ry,w=0,dw=2*Math.PI,rot=0}) {
        this.ctx.beginPath();
        this.ctx.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,w,w+dw,dw<0);
        this.drw(arguments[0]);
    },
    rec({x=0,y=0,b,h}) {
        let tmp = this.setStyle(arguments[0]);
        this.ctx.fillRect(x,y,b,h);
        this.ctx.strokeRect(x,y,b,h);
        this.resetStyle(tmp);
    },
    lin({x1=0,y1=0,x2,y2}) {
        let ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        this.stroke(arguments[0]);
    },
    ply: function({pts,closed,x=0,y=0,w=0,_itr}) {
        if (_itr && _itr.len) {
            let p, i, len = _itr.len, istrf = !!(x || y || w), cw, sw;
            if (istrf) this.setTrf([cw=(w?Math.cos(w):1),sw=(w?Math.sin(w):0),-sw,cw,x||0,y||0]);
            this.ctx.beginPath();
            this.ctx.moveTo((p=_itr(0)).x,p.y);
            for (i=1; i < len; i++)
                this.ctx.lineTo((p=_itr(i)).x,p.y);
            if (closed)  // closed then ..
                this.ctx.closePath();
            this.drw(arguments[0]);
            if (istrf) this.resetTrf();
            return i-1;  // number of points ..
        }
        return 0;
    },
    txt({str,x=0,y=0,w=0,unsizable}) {
        let tmp = this.setStyle(arguments[0]),
            sw = w ? Math.sin(w) : 0,
            cw = w ? Math.cos(w) : 1,
            trf = this.isCartesian ? [cw,sw,sw,-cw,x,y]
                                   : [cw,sw,-sw,cw,x,y];
        this.setTrf(unsizable ? this.concatTrf(this.unscaleTrf({x,y}),trf) : trf);
        if (this.ctx.fillStyle === 'rgba(0, 0, 0, 0)') {
            this.ctx.fillStyle = this.ctx.strokeStyle;
            tmp.fs = 'transparent';
        }
        this.ctx.fillText(str,0,0);
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
                img.addEventListener('error', error, {once:true});
                img.addEventListener('load', load, {once:true});
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
    async img({uri,x=0,y=0,b,h,sx=0,sy=0,sb,sh,xoff=0,yoff=0,w=0,scl=1}) {
        const img_ = await this.loadImage(uri);
        this.ctx.save();
        const cart = this.isCartesian ? -1 : 1;
        sb = sb || img_.width;
        b = b || img_.width;
        sh = (sh || img_.height);
        h = (h || img_.height)*cart;
        yoff*=cart;
        w*=cart;
        y = this.isCartesian ? -(y/scl)+sy : y/scl;
        const [cw,sw] = [Math.cos(w), Math.sin(w)];
        this.ctx.scale(scl, scl*cart);
        this.ctx.transform(cw, sw, -sw, cw,x/scl,y);
        this.ctx.drawImage(img_,sx,sy,sb,sh,xoff,yoff,b,h);
        this.ctx.restore();
    },
    use({grp}) {
        this.beg(arguments[0]);
        this.exe(grp.commands);
        this.end();
    },
    beg({x=0,y=0,w=0,scl=1,matrix,unsizable}={}) {
        let trf = matrix;
        if (!trf) {
            let ssw, scw;
            ssw = w ? Math.sin(w)*scl : 0;
            scw = w ? Math.cos(w)*scl : scl;
            trf = [scw,ssw,-ssw,scw,x,y];
        }
        this.pushStyle(arguments[0]);
        this.pushTrf(unsizable ? this.concatTrf(this.unscaleTrf({x,y}),trf) : trf);
    },
    end() {
        this.popTrf();
        this.popStyle();
    },
    p() { this.ctx.beginPath(); },
    z() { this.ctx.closePath(); },
    m({x,y}) { this.ctx.moveTo(x,y); },
    l({x,y}) { this.ctx.lineTo(x,y); },
    q({x,y,x1,y1}) { this.ctx.quadraticCurveTo(x1,y1,x,y); },
    c({x,y,x1,y1,x2,y2}) { this.ctx.bezierCurveTo(x1,y1,x2,y2,x,y); },
    a({x,y,dw,k,phi,_xp,_yp}) {  // todo: fix elliptical arc bug ...
        if (k === undefined) k = 1;  // ratio r1/r2
        if (Math.abs(dw) > Number.EPSILON) {
            if (k === 1) { // circular arc ...
                let x12 = x-_xp, y12 = y-_yp;
                let tdw_2 = Math.tan(dw/2),
                    rx = (x12 - y12/tdw_2)/2, ry = (y12 + x12/tdw_2)/2,
                    R = Math.hypot(rx,ry),
                    w = Math.atan2(-ry,-rx);
                this.ctx.ellipse(_xp+rx,_yp+ry,R,R,0,w,w+dw,this.cartesian?dw>0:dw<0);
            }
            else { // elliptical arc .. still buggy .. !
                if (phi === undefined) phi = 0;
                let x1 = dw > 0 ? _xp : x,
                    y1 = dw > 0 ? _yp : y,
                    x2 = dw > 0 ? x : _xp,
                    y2 = dw > 0 ? y : _yp;
                let x12 = x2-x1, y12 = y2-y1,
                    _dw = (dw < 0) ? dw : -dw;
                //  if (dw < 0) dw = -dw;   // test for bugs .. !
                let cp = phi ? Math.cos(phi) : 1, sp = phi ? Math.sin(phi) : 0,
                    dx = -x12*cp - y12*sp, dy = -x12*sp - y12*cp,
                    sdw_2 = Math.sin(_dw/2),
                    R = Math.sqrt((dx*dx + dy*dy/(k*k))/(4*sdw_2*sdw_2)),
                    w = Math.atan2(k*dx,dy) - _dw/2,
                    x0 = x1 - R*Math.cos(w),
                    y0 = y1 - R*k*Math.sin(w);
                this.ctx.ellipse(x0,y0,R, R*k,phi,w,w+dw,this.cartesian?dw>0:dw<0);
            }
        }
        else
            this.ctx.lineTo(x,y);
    },

    stroke({d}={}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.stroke(new Path2D(d)) : this.ctx.stroke();  // SVG path syntax
        this.resetStyle(tmp);
    },
    fill({d}={}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.fill(new Path2D(d)) : this.ctx.fill();  // SVG path syntax
        this.resetStyle(tmp);
    },
    drw({d,lsh}={}) {
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
        sh: (ctx) => [ctx.shadowOffsetX||0,ctx.shadowOffsetY||0,
                      ctx.shadowBlur||0,ctx.shadowColor||'black'],
        font: (ctx) => ctx.font,
        thal: (ctx) => ctx.textAlign,
        tval: (ctx) => ctx.textBaseline,
    },
    set: {
        fs: (ctx,q) => { ctx.fillStyle=q; },
        ls: (ctx,q) => { ctx.strokeStyle=q; },
        lw: (ctx,q) => { ctx.lineWidth=q; },
        lc: (ctx,q) => { ctx.lineCap=q; },
        lj: (ctx,q) => { ctx.lineJoin=q; },
        ld: (ctx,q) => { ctx.setLineDash(q); },
        ldoff: (ctx,q) => { ctx.lineDashOffset=q; },
        ml: (ctx,q) => { ctx.miterLimit=q; },
        sh: (ctx,q) => {
            if (q) {
                ctx.shadowOffsetX = q[0]||0;
                ctx.shadowOffsetY = q[1]||0;
                ctx.shadowBlur = q[2]||0;
                ctx.shadowColor = q[3]||'black';
            }
        },
        font: (ctx,q) => { ctx.font=q; },
        thal: (ctx,q) => { ctx.textAlign=q; },
        tval: (ctx,q) => { ctx.textBaseline=q; }
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
                if (typeof style[key] === 'string' && style[key][0] === '@') {
                    let ref = style[key].substr(1);
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](this.ctx);
                }
                if ((q=this.get[key](this.ctx)) !== style[key]) {
                    prv[key] = q;
                    this.set[key](this.ctx, style[key]);
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
        for (const key in style)
            if (this.get[key]) {  // style keys only ...
                if (typeof style[key] === 'string' && style[key][0] === '@') {
                    let ref = style[key].substr(1);
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](this.ctx);
                }
                if (this.cur[key] !== style[key])
                    this.set[key](this.ctx, (cur[key]=style[key]));
            }
        this.stack.push(this.cur = Object.assign({},this.cur,cur));
    },
    popStyle() {
        let cur = this.stack.pop();
        this.cur = this.stack[this.stack.length-1];
        for (const key in this.cur)
            if (this.get[key] && this.cur[key] !== cur[key])
               this.set[key](this.ctx, this.cur[key]);
    },
    concatTrf(q,t) {
        return [
            q[0]*t[0]+q[2]*t[1],
            q[1]*t[0]+q[3]*t[1],
            q[0]*t[2]+q[2]*t[3],
            q[1]*t[2]+q[3]*t[3],
            q[0]*t[4]+q[2]*t[5]+q[4],
            q[1]*t[4]+q[3]*t[5]+q[5]
        ];
    },
    initTrf() {
        this.ctx.setTransform(...this.matrix[0]);
    },
    setTrf(t) {
        this.ctx.setTransform(...this.concatTrf(this.matrix[this.matrix.length-1],t));
    },
    resetTrf() {
        this.ctx.setTransform(...this.matrix[this.matrix.length-1]);
    },
    pushTrf(t) {
        let q_t = this.concatTrf(this.matrix[this.matrix.length-1],t);
        this.matrix.push(q_t);
        this.ctx.setTransform(...q_t);
    },
    popTrf() {
        this.matrix.pop();
        this.ctx.setTransform(...this.matrix[this.matrix.length-1]);
    },
    get isCartesian() {  // det of mat2x2 < 0 !
        let m = this.matrix[this.matrix.length-1];
        return m[0]*m[3] - m[1]*m[2] < 0;
    },
    get uniTrf() {
        let m = this.matrix[this.matrix.length-1];
        return {x:m[4],y:m[5],scl:Math.hypot(m[0],m[1]),cartesian:m[0]*m[3] - m[1]*m[2] < 0};
    },
    unscaleTrf({x,y}) {  // remove scaling effect (make unzoomable with respect to (x,y))
        let m = this.matrix[this.matrix.length-1],
            invscl = 1/Math.hypot(m[0],m[1]);
        return [invscl,0,0,invscl,(1-invscl)*x,(1-invscl)*y];
    },
    gridSize(scl) {
        let base = this.gridBase, exp = this.gridExp, sz;
        while ((sz = scl*base*Math.pow(10,exp)) < 14 || sz > 35) {
            if (sz < 14) {
                if      (base == 1) base = 2;
                else if (base == 2) base = 5;
                else if (base == 5) { base = 1; exp++; }
            }
            else {
                if      (base == 1) { base = 5; exp--; }
                else if (base == 2) base = 1;
                else if (base == 5) base = 2;
            }
        }
        this.gridBase = base;
        this.gridExp = exp;
        return sz;
    }
}

// utils

g2.zoomView = function({scl,x,y}) { return { scl, x:(1-scl)*x, y:(1-scl)*y } }
// fn argument must be a function with (optional) timestamp 't' as single argument
// returning true to continue or false to stop RAF.
g2.render = function render(fn) {
    function animate(t) {
        if (fn(t))
            requestAnimationFrame(animate);
    }
    animate(performance.now());
}

// use it with node.js ... ?
if (typeof module !== 'undefined') module.exports = g2;
/**
 * g2.io (c) 2017-18 Stefan Goessner
 * @license MIT License
 */
"use strict";

g2.io = function() {
   if (this instanceof g2.io) {
      this.model = null;
      this.grpidx = 0;
      return this;
   }
   return g2.io.apply(Object.create(g2.io.prototype));
};
g2.handler.factory.push((ctx) => ctx instanceof g2.io ? ctx : false);

g2.io.parseGrp = function(model, id, onErr) {
    let g;
    onErr = onErr || console.error;
    if (id in model) {
        g = g2({id});
        for (let cmd of model[id]) {
            if (cmd.c === 'use') {
                cmd.a.grp = g2.io.parseGrp(model, cmd.a.grp);
                g[cmd.c](cmd.a);
            }
            else if (g[cmd.c])
                cmd.a ? g[cmd.c](cmd.a) : g[cmd.c]();
            else  // invalid g2 command !
               onErr(`g2.io: Unable to handle command '${cmd.c}'`)
        }
        return g;
    }
    else if (id in g2.symbol)
        return g2.symbol[id];
    else
        onErr(`g2.io: Unable to find group with id '${id}'!`);
    return false;
}

g2.io.prototype = {
    init: function(grp,style) {
        this.model = {'main':[]};
        this.curgrp = this.model.main;
        this.grpidx = 0;
        return true; 
    },
    exe: function(commands) {
        for (let cmd of commands) {
            if (this[cmd.c])
                cmd.a ? this[cmd.c](cmd.a) : this[cmd.c]();
            else
                this.out(cmd.c,cmd.a);
        }
    },
    out: function(c,a) {
        if (a) {
            let args = {};
            Object.keys(a).forEach(k => {
                if (k[0] !== '_')  // no private key ...
                    args[k] = a[k];
            });
            this.curgrp.push({c:c,a:args});
        }
        else
            this.curgrp.push({c:c});
    },
    stringify: function(space) { return space ? JSON.stringify(this.model,null,space) : JSON.stringify(this.model); },
    toString: function() { return JSON.stringify(this.model); },

    // customized commands ...
    use: function(args) {
        let grp = args.grp instanceof g2 ? args.grp
                : typeof args.grp === 'string' && g2.symbol.includes(args.grp) ? g2.symbol[args.grp]
                : null;
        if (grp) {
            if (!grp.id) grp.id = `$grp${++this.grpidx}`;
            if (!(grp.id in this.model)) { // meet first time ..
                let curgrp = this.curgrp;
                this.curgrp = this.model[grp.id] = [];
                for (let command of grp.commands)
                    this.out(command.c,command.a);
                this.curgrp = curgrp;
            }
            args.grp = grp.id;

            this.out("use", args);
        }
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
 * g2.ext (c) 2015-18 Stefan Goessner
 * @author Stefan Goessner
 * @license MIT License
 * @requires g2.core.js
 * @typedef {g2}
 * @description Additional methods for g2.
 * @returns {g2}
 */
var g2 = g2 || { prototype:{} };  // for jsdoc only ...

// constants for element selection / editing
g2.NONE = 0x0; g2.OVER = 0x1; g2.DRAG = 0x2; g2.EDIT = 0x4;

// prototypes for extending argument objects
g2.prototype.lin.prototype = {
    isSolid: false,
    get len() { return Math.hypot(this.x2 - this.x1, this.y2 - this.y1); },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
    pointAt(loc) {
        let t = loc==="beg" ? 0
             : loc==="end" ? 1
             : (loc+0 === loc) ? loc // numerical arg ..
             : 0.5,   // 'mid' ..
            dx = this.x2 - this.x1,
            dy = this.y2 - this.y1,
            len = Math.hypot(dx,dy);
        return {
            x: this.x1 + dx*t,
            y: this.y1 + dy*t,
            dx: len ? dx/len : 1,
            dy: len ? dy/len : 0
       };
    },
    hit({x,y,eps}) { return g2.isPntOnLin({x,y},{x:this.x1,y:this.y1},{x:this.x2,y:this.y2},eps) },
    drag({dx,dy}) {
        this.x1 += dx; this.x2 += dx;
        this.y1 += dy; this.y2 += dy;
    },
    handles(grp) {
        grp.handle({x:this.x1,y:this.y1,_update:({dx,dy})=>{this.x1+=dx;this.y1+=dy}})
           .handle({x:this.x2,y:this.y2,_update:({dx,dy})=>{this.x2+=dx;this.y2+=dy}});
    }
};

g2.prototype.rec.prototype = {
    _dir: { c:[0,0],e:[1,0],ne:[1,1],n:[0,1],nw:[-1,1],
            w:[-1,0],sw:[-1,-1],s:[0,-1],se:[1,-1] },
    get len() { return 2*(this.b+this.h); },
    get isSolid() { return this.fs && this.fs !== 'transparent' },
    get len() { return 2*Math.PI*this.r; },
    get lsh() { return this.state & g2.OVER; },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false; },
    pointAt(loc) {
        const q = this._dir[loc || "c"] || this._dir['c'], nx = q[0], ny = q[1];
        return {
            x: this.x + (1 + nx)*this.b/2,
            y: this.y + (1 + ny)*this.h/2,
            dx: -ny,
            dy:  nx
        };
    },
    hit({x,y,eps}) {
        return this.isSolid ? g2.isPntInBox({x,y},{x:this.x+this.b/2,y:this.y+this.h/2,b:this.b/2,h:this.h/2},eps)
                            : g2.isPntOnBox({x,y},{x:this.x+this.b/2,y:this.y+this.h/2,b:this.b/2,h:this.h/2},eps);
    },
    drag({dx,dy}) { this.x += dx; this.y += dy }
};

g2.prototype.cir.prototype = {
    w: 0,   // default start angle (used for dash-dot orgin and editing)
    _dir: { c:[0,0],e:[1,0],ne:[Math.SQRT2/2,Math.SQRT2/2],n:[0,1],nw:[-Math.SQRT2/2,Math.SQRT2/2],
            w:[-1,0],sw:[-Math.SQRT2/2,-Math.SQRT2/2],s:[0,-1],se:[Math.SQRT2/2,-Math.SQRT2/2] },
    get isSolid() { return this.fs && this.fs !== 'transparent' },
    get len() { return 2*Math.PI*this.r; },
    get lsh() { return this.state & g2.OVER; },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
    pointAt(loc) {
        let q = (loc+0 === loc) ? [Math.cos(loc*2*Math.PI),Math.sin(loc*2*Math.PI)]
                                : (this._dir[loc || "c"] || [0,0]),
            nx = q[0], ny = q[1];
        return {
            x: this.x + nx*this.r,
            y: this.y + ny*this.r,
            dx: -ny,
            dy:  nx };
    },
    hit({x,y,eps}) {
        return this.isSolid ? g2.isPntInCir({x,y},this,eps)
                            : g2.isPntOnCir({x,y},this,eps);
    },
    drag({dx,dy}) { this.x += dx; this.y += dy },
    handles(grp) {
        const p0 = {
            x:this.x, y:this.y,
            _update:({dx,dy})=>{this.x+=dx;this.y+=dy;p1.x+=dx;p1.y+=dy;}
        };
        const p1 = {
            x:this.x+this.r*Math.cos(this.w||0),
            y:this.y+this.r*Math.sin(this.w||0),
            _info:()=>`r:${this.r.toFixed(1)}<br>w:${(this.w/Math.PI*180).toFixed(1)}°`,
            _update:({x,y}) => {
                this.r = Math.hypot(y-this.y,x-this.x);
                this.w = Math.atan2(y-this.y,x-this.x);
            }
        };
        grp.lin({x1:()=>this.x,y1:()=>this.y,x2:()=>p1.x,y2:()=>p1.y,ld:[4,3],ls:'#666'})
           .handle(p0)
           .handle(p1);
    }
};

g2.prototype.arc.prototype = {
    get len() { return Math.abs(this.r*this.dw); },
    get angle() { return this.dw/Math.PI*180; },
    pointAt(loc) {
        let t = loc==="beg" ? 0
              : loc==="end" ? 1
              : loc==="mid" ? 0.5
              : loc+0 === loc ? loc
              : 0.5,
            ang = this.w+t*this.dw, cang = Math.cos(ang), sang = Math.sin(ang), r = loc === "c" ? 0 : this.r;
        return {
            x: this.x + r*cang,
            y: this.y + r*sang,
            dx: -sang,
            dy:  cang
       };
    },
    isSolid: false,
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
    hit({x,y,eps}) { return g2.isPntOnArc({x,y},this,eps) },
    drag({dx,dy}) { this.x += dx; this.y += dy; },
    handles(grp) {
        const p0 = {
                x:this.x, y:this.y,
                _update:({dx,dy})=>{this.x+=dx;this.y+=dy;p1.x+=dx;p1.y+=dy;p2.x+=dx;p2.y+=dy;}
            },
            p1 = {
                x:this.x+this.r*Math.cos(this.w),
                y:this.y+this.r*Math.sin(this.w),
                _info:()=>`r:${this.r.toFixed(1)}<br>w:${(this.w/Math.PI*180).toFixed(1)}°`,
                _update:({x,y})=>{
                            this.r = Math.hypot(y-this.y,x-this.x);
                            this.w = Math.atan2(y-this.y,x-this.x);
                            p2.x = this.x+this.r*Math.cos(this.w+this.dw);
                            p2.y = this.y+this.r*Math.sin(this.w+this.dw); }
            },
            dw = this.dw,
            p2 = {
                x:this.x+this.r*Math.cos(this.w+this.dw),
                y:this.y+this.r*Math.sin(this.w+this.dw),
                _info:()=>`dw:${(this.dw/Math.PI*180).toFixed(1)}°`,
                _update:({x,y})=>{  // bug with negative 'this.w' ...
                    let lam = g2.toArc(g2.toPi2(Math.atan2(y-this.y,x-this.x)),g2.toPi2(this.w),dw);
                    this.dw = lam*dw;
                }
            };
        if (this.w === undefined) this.w = 0;
        grp.lin({x1:()=>this.x,y1:()=>this.y,x2:()=>p1.x,y2:()=>p1.y,ld:[4,3],ls:'#666'})
           .lin({x1:()=>this.x,y1:()=>this.y,x2:()=>p2.x,y2:()=>p2.y,ld:[4,3],ls:'#666'})
           .handle(p0)
           .handle(p1)
           .handle(p2);
    }
};

g2.prototype.ply.prototype = {
    get isSolid() { return this.closed && this.fs && this.fs !== 'transparent'; },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false; },
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
        const t = loc==="beg" ? 0
                : loc==="end" ? 1
                : (loc+0 === loc) ? loc // numerical arg ..
                : 0.5,   // 'mid' ..
            pitr = g2.pntItrOf(this.pts),
            pts = [],
            len = [];
        for (let itr = 0; itr < pitr.len; itr++) {
            const next = pitr(itr+1) ? pitr(itr+1) : pitr(0);
            if ((itr === pitr.len-1 && this.closed) || itr < pitr.len-1) {
                pts.push(pitr(itr));
                len.push(Math.hypot(
                    next.x-pitr(itr).x,
                    next.y-pitr(itr).y)
                );
            }
        }
        const {t2, x, y, dx, dy} = (() => {
            const target = t * len.reduce((a,b) => a+b);
            let tmp = 0;
            for(let itr = 0; itr < pts.length; itr++) {
                tmp += len[itr];
                const next = pitr(itr+1).x ? pitr(itr+1) : pitr(0);
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
        const len2 = Math.hypot(dx,dy);
        return {
            x: x + dx*t2,
            y: y + dy*t2,
            dx: len2 ? dx/len2 : 1,
            dy: len2 ? dy/len2 : 0
        };
    },
//    x: 0, y: 0,
    hit({x,y,eps}) {
        return this.isSolid ? g2.isPntInPly({x:x-this.x,y:y-this.y},this,eps)   // translational transformation only .. at current .. !
                            : g2.isPntOnPly({x:x-this.x,y:y-this.y},this,eps);
    },
    drag({dx,dy}) { this.x += dx; this.y += dy; },
    handles(grp) {
        let p, slf=this;
        for (let n = this._itr.len, i=0; i<n; i++)
            grp.handle({
                x:(p=this._itr(i)).x+this.x,y:p.y+this.y,i:i,
                _update({dx,dy}){let p=slf._itr(this.i);p.x+=dx;p.y+=dy}
            });
    }
}

// use is currently not transformed
g2.prototype.use.prototype = {
    get isSolid() { return false },
    hit(at) {
        for (const cmd of this.grp.commands) {
            if (cmd.a.hit && cmd.a.hit(at))
                return true;
        }
        return false;
    }
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
g2.prototype.spline = function spline({pts,closed,x,y,w}) {
    arguments[0]._itr = g2.pntItrOf(pts);
    return this.addCommand({c:'spline',a:arguments[0]});
}
g2.prototype.spline.prototype = g2.mixin({},g2.prototype.ply.prototype,{
    g2: function() {
        let {pts,closed,x,y,w,ls,lw,fs,sh} = this, itr = this._itr, gbez;
        if (itr) {
            let b = [], i, n = itr.len,
                p1, p2, p3, p4, d1, d2, d3,
                d1d2, d2d3, scl2, scl3,
                den2, den3, istrf = x || y || w;

            gbez = g2();
            if (istrf) gbez.beg({x,y,w});
            gbez.p().m(itr(0));
            for (let i=0; i < (closed ? n : n-1); i++) {
                if (i === 0) {
                    p1 = closed ? itr(n-1) : {x:2*itr(0).x-itr(1).x, y:2*itr(0).y-itr(1).y};
                    p2 = itr(0);
                    p3 = itr(1);
                    p4 = n === 2 ? (closed ? itr(0) : {x:2*itr(1).x-itr(0).x, y:2*itr(1).y-itr(0).y}) : itr(2);
                    d1 = Math.max(Math.hypot(p2.x-p1.x,p2.y-p1.y),Number.EPSILON);  // don't allow ..
                    d2 = Math.max(Math.hypot(p3.x-p2.x,p3.y-p2.y),Number.EPSILON);  // zero point distances ..
                } else {
                    p1 = p2;
                    p2 = p3;
                    p3 = p4;
                    p4 = (i === n-2) ? (closed ? itr(0) : {x:2*itr(n-1).x-itr(n-2).x, y:2*itr(n-1).y-itr(n-2).y})
                    : (i === n-1) ? itr(1)
                    : itr(i+2);
                    d1 = d2;
                    d2 = d3;
                }
                d3 = Math.max(Math.hypot(p4.x-p3.x,p4.y-p3.y),Number.EPSILON);
                d1d2 = Math.sqrt(d1*d2), d2d3 = Math.sqrt(d2*d3),
                scl2 = 2*d1 + 3*d1d2 + d2,
                scl3 = 2*d3 + 3*d2d3 + d2,
                den2 = 3*(d1 + d1d2),
                den3 = 3*(d3 + d2d3);
                gbez.c({
                    x: p3.x, y: p3.y,
                    x1: (-d2*p1.x + scl2*p2.x + d1*p3.x)/den2,
                    y1: (-d2*p1.y + scl2*p2.y + d1*p3.y)/den2,
                    x2: (-d2*p4.x + scl3*p3.x + d3*p2.x)/den3,
                    y2: (-d2*p4.y + scl3*p3.y + d3*p2.y)/den3
                });
            }
            gbez.c(closed ? {x:itr(0).x,y:itr(0).y} : {x:itr(n-1).x,y:itr(n-1).y})
            if (closed) gbez.z();
            gbez.drw({ls,lw,fs,sh});
            if (istrf) gbez.end();
        }
        return gbez;
    }
})

/**
 * Add label to certain elements.
 * Please note that cartesian flag is necessary.
 * @method
 * @returns {object} g2
 * @param {object} - label arguments object.
 * @property {string} str - label text
 * @property {number | string} loc - label location depending on referenced element. <br>
 *                     'c': centered, wrt. rec, cir, arc <br>
 *                     'beg','mid', 'end', wrt. lin <br>
 *                     'n', 'ne', 'e', 'se', 's', 'sw', 'w', or 'nw': cardinal directions
 * @property {number} off - offset distance [optional].
 * @example
 * g2().view({cartesian:true})
 *     .cir({x:10,y:10,r:5})
 *     .label({str:'hello',loc:'s',off:10})
 */
g2.prototype.label = function label({str,loc,off,fs,font,fs2}) {
    let idx = g2.cmdIdxBy(this.commands, (cmd) => { return cmd.a && 'pointAt' in cmd.a}); // find reference index of previous element adding label to ...
    if (idx !== undefined) {
        arguments[0]['_refelem'] = this.commands[idx];
        this.addCommand({c:'label', a: arguments[0]});
    }
    return this;
}
g2.prototype.label.prototype = {
    g2() {
        let label = g2();
        if (this._refelem) {
            let {str,loc,off,fs,font,border,fs2} = this,
                p = this._refelem.a.pointAt(loc),          // 'loc'ation in coordinates ..
                tanlen = p.dx*p.dx || p.dy*p.dy;            // tangent length .. (0 || 1) .. !
            let h = parseInt(font||g2.defaultStyle.font),  // char height
                diag, phi, n;                              // n .. str length

            if (str[0] === "@" && (s=this._refelem.a[str.substr(1)]) !== undefined)   // expect 's' as string convertable to a number ...
                str = "" + (Number.isInteger(+s) ? +s : Number(s).toFixed(Math.max(g2.symbol.labelSignificantDigits-Math.log10(s),0)))  // use at least 3 significant digits after decimal point.
                         + (str.substr(1) === "angle" ? "°" : "");
            n = str.length;
            if (tanlen > Number.EPSILON) {
                diag = Math.hypot(p.dx,n*p.dy);
                off = off === undefined ? 1 : off;
                p.x += tanlen*p.dy*( off + n*n*0.8*h/2/diag*Math.sign(off));
                p.y += tanlen*p.dx*(-off -         h/2/diag*Math.sign(off));
            }
            fs = fs||'black';
            if (border)
                label.ell({x:p.x,y:p.y,rx:n*0.8*h/2+2,ry:h/2+2,ls:fs||'black',fs:fs2||'#ffc'});
            //         .rec({x:p.x-n*0.8*h/2/Math.SQRT2,y:p.y-h/2/Math.SQRT2,b:n*0.8*h/Math.SQRT2,h:h/Math.SQRT2})
            label.txt({
                str, x:p.x,y:p.y,
                thal: "center",tval: "middle",
                fs: fs||'black',font
            });
        }
        return label;
    }
}

/**
 * Draw marker on line element.
 * @method
 * @returns {object} g2
 * @param {object} - Marker arguments object.
 * @property {object | string} mrk - `g2` object or `name` of mark in `symbol` namespace.
 * @property {number | string | number[] | string[]} loc - line location ['beg','end',0.1,0.9,'mid',...].<br>
 *
 * @property {int} [dir=0] - Direction:<br>
 *                   -1 : negative tangent direction<br>
 *                    0 : no orientation (rotation)<br>
 *                    1 : positive tangent direction
 * @example
 * g2().lin({x1:10,y1:10,x2:100,y2:10})
 *     .mark({mrk:"tick",loc:0.75,dir:1})
 *
 */
g2.prototype.mark = function mark({mrk,loc,dir,fs,ls}) {
    let idx = g2.cmdIdxBy(this.commands, (cmd) => { return cmd.a && 'pointAt' in cmd.a}); // find reference index of previous element adding mark to ...
    if (idx !== undefined) {
        arguments[0]['_refelem'] = this.commands[idx];
        this.addCommand({c:'mark', a: arguments[0]});
    }
    return this;
}
g2.prototype.mark.prototype = {
    markAt(elem,loc,mrk,dir,ls,fs) {
        const p = elem.pointAt(loc),
              w = dir < 0 ? Math.atan2(-p.dy,-p.dx)
                :(dir > 0 || dir === undefined) ? Math.atan2( p.dy, p.dx)
                : 0;
        return {
            grp:mrk,x:p.x,y:p.y,w:w,scl:elem.lw || 1,
            ls:ls || elem.ls || 'black',
            fs:fs || ls || elem.ls || 'black'
        }
    },
    g2() {
        let {mrk,loc,dir,fs,ls} = this,
            elem = this._refelem.a,
            marks = g2();
        if (Array.isArray(loc))
            for (let l of loc)
                marks.use(this.markAt(elem,l,mrk,dir,ls,fs));
        else
            marks.use(this.markAt(elem,loc,mrk,dir,ls,fs));
        return marks;
    }
}

/**
 * Extended style values.
 * Not really meant to get overwritten. But if you actually want, proceed.<br>
 * Theses styles can be referenced using the comfortable '@' syntax.
 * @namespace
 * @property {object} symbol  `g2` symbol namespace.
 * @property {object} [symbol.tick] Predefined symbol: a little tick
 * @property {object} [symbol.dot] Predefined symbol: a little dot
 * @property {object} [symbol.sqr] Predefined symbol: a little square
 * @property {string} [symbol.nodcolor=#333]    node color.
 * @property {string} [symbol.nodfill=#dedede]   node fill color.
 * @property {string} [symbol.nodfill2=#aeaeae]    alternate node fill color, somewhat darker.
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
g2.symbol.tick = g2().p().m({x:0,y:-2}).l({x:0,y:2}).stroke({lc:"round",lwnosc:true});
g2.symbol.dot = g2().cir({x:0,y:0,r:2,ls:"transparent"});
g2.symbol.sqr = g2().rec({x:-1.5,y:-1.5,b:3,h:3,ls:"transparent"});

g2.symbol.nodcolor = "#333";
g2.symbol.nodfill  = "#dedede";
g2.symbol.nodfill2 = "#aeaeae";
g2.symbol.linkcolor = "#666";
g2.symbol.linkfill = "rgba(225,225,225,0.75)";
g2.symbol.dimcolor = "darkslategray";
g2.symbol.solid = [];
g2.symbol.dash = [15,10];
g2.symbol.dot = [4,4];
g2.symbol.dashdot = [25,6.5,2,6.5];
g2.symbol.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234

g2.symbol.image = { graphite: new Image() };
g2.symbol.image.graphite.src = g2GraphiteData();
g2.symbol.graphite = g2Graphite();

function g2Graphite() {
    const ctx = document.createElement("canvas").getContext("2d");
    return ctx.createPattern(g2.symbol.image.graphite, 'repeat');
}

function g2GraphiteData() { return "data:image/png;base64,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"; }



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
 * Add skip tag to previous command as a filter for findCmdIdx.
 * See 'mark' and 'label' commands for usage.
 * @private
 */
g2.prototype.skip = function skip(tag) {
   if (this.cmds.length)
      this.cmds[this.cmds.length-1].skip = tag;
   return this;
}

/**
 * Dimension
 * @method
 * @returns {object} g2
 * @param {object} - dimension arguments object.
 * @property {number} x1 - start x coordinate.
 * @property {number} y1 - start y coordinate.
 * @property {number} x2 - end x coordinate.
 * @property {number} y2 - end y coordinate.
 * @property {number} off - offset.
 * @property {number} over - overshoot of offset lines.
 * @property {boolean} [inside=true] - draw dimension arrows between or outside of ticks.
 * @example
 *  g2().dim({x1:60,y1:40,x2:190,y2:120})
 */
g2.prototype.dim = function dim({}) { return this.addCommand({c:'dim', a:arguments[0]}); }
g2.prototype.dim.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = Object.assign({lw:1,w:0,lc:'round',lj:'round',off:0,over:0,inside:true,fs:"#000"}, this);
        const dx = args.x2-args.x1, dy = args.y2-args.y1, len = Math.hypot(dx,dy);
        args.fixed = args.fixed || len/2;
        const over = args.off > 0 ? Math.abs(args.over) : -Math.abs(args.over);
        const w = Math.atan2(dy,dx);
        return g2()
            .beg({x:args.x1 - args.off*Math.sin(w),y:args.y1 + args.off*Math.cos(w),w:w})
            .vec({
                x1:args.inside ? 1 : -25,
                y1:0,x2:0,y2:0,
                fixed:args.fixed,
                fs:args.fs,ls:args.ls,lw:args.lw
            })
            .vec({
                x1:args.inside ? 0 : len + 25,y1:0,
                x2:args.inside ? len : len,y2:0,
                fixed:args.fixed,
                fs:args.fs,ls:args.ls,lw:args.lw
            })
            .ins(g => {if(!args.inside)
                {g.lin({x1:0,y1:0,x2:len,y2:0,fs:args.fs,ls:args.ls,lw:args.lw})}
            })
            .end()
            .ins(g => {if(!!args.off)
                g.lin({
                    x1:args.x1,y1:args.y1,
                    x2:args.x1 - (over + args.off)*Math.sin(w),
                    y2:args.y1 + (over + args.off)*Math.cos(w),
                    lw:args.lw/2,lw:args.lw/2,ls:args.ls,fs:args.fs})
                 .lin({
                    x1:args.x1+Math.cos(w)*len,y1:args.y1+Math.sin(w)*len,
                    x2:args.x1+Math.cos(w)*len-(over + args.off)*Math.sin(w),
                    y2:args.y1+Math.sin(w)*len+(over + args.off)*Math.cos(w),
                    lw:args.lw/2,ls:args.ls,fs:args.fs
                })
            });
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
 * @property {boolean} [inside=true] - draw dimension arrows between or outside of ticks.
 * @example
 * g2().adim({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
 */
g2.prototype.adim = function adim({}) { return this.addCommand({c:'adim',a:arguments[0]}); }
g2.prototype.adim.prototype = g2.mixin({}, g2.prototype.arc.prototype, {
        g2() {
        const args = Object.assign({lw:1,w:0,lc:'round',lj:'round',inside:true,fs:"#000"}, this);
        return g2()
            .beg({x:args.x,y:args.y,w:args.w})
            .arc({x:0,y:0,r:args.r,w:0,dw:args.dw,ls:args.ls,lw:args.lw})
            .vec({
                x1:args.inside ? args.r-.15:args.r-3.708,
                y1:args.inside?1:24.723,x2:args.r,y2:0,fs:args.fs,ls:args.ls,lw:args.lw,fixed:30})
            .lin({x1:args.r-3.5,y1:0,x2:args.r+3.5,y2:0,fs:args.fs,ls:args.ls,lw:args.lw})
            .end()
            .beg({x:args.x,y:args.y,w:args.w+args.dw})
            .vec({
                x1:args.inside ? args.r-.15:args.r-3.708,
                y1:args.inside?-1:-24.723,x2:args.r,y2:0,fs:args.fs,ls:args.ls,lw:args.lw,fixed:30})
            .lin({x1:args.r-3.5,y1:0,x2:args.r+3.5,y2:0,fs:args.fs,ls:args.ls,lw:args.lw})
            .end();
    }
});

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
g2.prototype.vec = function vec({}) { return this.addCommand({c:'vec',a:arguments[0]}); }
g2.prototype.vec.prototype = g2.mixin({},g2.prototype.lin.prototype,{
    g2() {
        const args = Object.assign({ls:"#000",fs:"@ls",lc:'round',lj:'round',lw:1,fixed:undefined}, this);
        const dx = args.x2-args.x1, dy = args.y2-args.y1, r = Math.hypot(dx,dy);
        let z = args.head || 2+(args.lw);
        const z2 = (args.fixed || r) / 10;
        z = z > z2 ? z2 : z;
        return g2()
            .beg(Object.assign({}, args, {x:args.x1,y:args.y1,w:Math.atan2(dy,dx)}))
            .p().m({x:0,y:0})
            .l({x:r,y:0})
            .stroke({ls:args.ls})
            .p().m({x:r,y:0})
            .l({x:r-5*z,y:z})
            .a({dw:-Math.PI/3,x:r-5*z,y:-z})
            .z()
            .drw({ls:args.ls,fs:args.fs})
            .end();
    }
})

/**
 * Draw vector with an angle
 * @method
 * @returns {object} g2
 * @param {object}  - angle vector arguments object
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @property {number} r - radius.
 * @property {number} [w=0] - start angle (in radian).
 * @property {number} [dw=2*pi] - angular range in Radians.
 * @example
 * g2().avec({x:300,y:400,r:390,w:-Math.PI/4,dw:-Math.PI/2})
 *     .exe(ctx);
 */
g2.prototype.avec = function vec({}) { return this.addCommand({c: 'avec',a:arguments[0]}); }
g2.prototype.avec.prototype = g2.mixin({}, g2.prototype.arc.prototype, {
    g2() {
        const args = Object.assign({ls:"#000", fs:"@ls", lc:'round', lj:'round', fixed: 30, lw:1, dw: 2*Math.PI}, this);
        const z = args.fixed / 2;
        return g2()
            .beg({x:args.x, y:args.y,w:args.w+args.dw})
            .arc({x:0, y:0, r:args.r, w:-args.dw, dw:args.dw, ls:args.ls, lw:args.lw})
            .vec({x1:args.r*Math.sqrt(1-(z/args.r)**2), x2: args.r,
                y1:-1*Math.sign(args.dw)*z, y2:0,
                fixed: args.fixed})
            .end()
    }
})

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
g2.prototype.slider.prototype = g2.mixin({},g2.prototype.rec.prototype,{
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
g2.prototype.spring.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
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
g2.prototype.damper.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
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
g2.prototype.link.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
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
g2.prototype.link2.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
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
g2.prototype.beam.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
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
g2.prototype.beam2.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
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
g2.prototype.bar.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
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
g2.prototype.bar2.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
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
g2.prototype.pulley.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
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
g2.prototype.pulley2.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
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
g2.prototype.rope.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
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
g2.prototype.ground.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
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
g2.prototype.load.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
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
                    const {x,y} = args.pointAt(pts),
                    t = {
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

/**
 * Creates a symbol at given coordinates.
 * @method
 * @returns {object} g2
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().pol({x:10,y:10})
 */
g2.prototype.pol = function () { return this.addCommand({c:'pol',a:arguments[0]||{}}); }
g2.prototype.pol.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);
        return g2()
            .beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
            .cir({r:6,fs:'@nodfill'})
            .cir({r:2.5,fs:'@ls',ls:'transparent'})
            .end();
    }
})

/**
 * @method
 * @returns {object} g2
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().gnd({x:10,y:10})
*/
 g2.prototype.gnd = function () { return this.addCommand({c:'gnd',a:arguments[0]||{}}); }
 g2.prototype.gnd.prototype = g2.mixin({}, g2.prototype.use.prototype, {
     g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);
        return g2()
            .beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
            .cir({x:0,y:0,r:6,ls:'@nodcolor',fs:'@nodfill',lwnosc:true})
            .p()
            .m({x:0,y:6})
            .a({dw:Math.PI/2,x:-6,y:0})
            .l({x:6,y:0})
            .a({dw:-Math.PI/2,x:0,y:-6})
            .z()
            .fill({fs:'@nodcolor'})
            .end();
    }
})

/**
 * @method
 * @returns {object} g2
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().nod({x:10,y:10})
*/
g2.prototype.nod = function({x=0,y=0}) { return this.addCommand({c:'nod',a:arguments[0]}); }
g2.prototype.nod.prototype = g2.mixin({}, g2.prototype.cir.prototype, {
    get r() { return 5; },
    get isSolid() { return true; },
    g2() {
        return g2().cir({x:this.x,y:this.y,r:this.r,ls:'@nodcolor',fs:'@nodfill',sh:this.sh})
    }
})

/**
 * @method
 * @returns {object} g2
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().dblnod({x:10,y:10})
*/
g2.prototype.dblnod = function({x=0,y=0}) { return this.addCommand({c:'dblnod',a:arguments[0]}); }
g2.prototype.dblnod.prototype = g2.mixin({}, g2.prototype.cir.prototype, {
    get r() { return 6; },
    get isSolid() { return true; },
    g2() {
        return g2()
            .beg({x:this.x,y:this.y})
                .cir({r:6,ls:'@nodcolor',fs:'@nodfill',sh:this.sh})
                .cir({r:3,ls:'@nodcolor',fs:'@nodfill2'})
            .end();
    }
})

/**
 * Since some symbols are not symmetrical, cartesian mode is recommended.
 * @method
 * @returns {object} g2
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().view({cartesian:true})
 *     .nodfix({x:10,y:10})
*/
g2.prototype.nodfix = function ({x=0,y=0}) { return this.addCommand({c:'nodfix',a:arguments[0]||{x:0,y:0}}); }
g2.prototype.nodfix.prototype = g2.mixin({}, g2.prototype.cir.prototype, {
    get r() { return 5; },
    get isSolid() { return true; },
    g2() {
        return g2()
            .beg({x:this.x,y:this.y,scl:this.scl,w:this.w,sh:this.sh})
            .p()
            .m({x:-8,y:-12})
            .l({x:0,y:0})
            .l({x:8,y:-12})
            .drw({ls:'@nodcolor',fs:'@nodfill2'})
                .cir({x:0,y:0,r:this.r,ls:'@nodcolor',fs:'@nodfill'})
            .end();
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
g2.prototype.nodflt = function ({x=0,y=0}) { return this.addCommand({c:'nodflt',a:arguments[0]||{x,y}}); }
g2.prototype.nodflt.prototype = g2.mixin({}, g2.prototype.cir.prototype, {
    get r() { return 5; },
    get isSolid() { return true; },
    g2() {
        return g2()
            .beg({x:this.x,y:this.y,w:this.w,sh:this.sh})
            .p()
            .m({x:-8,y:-12})
            .l({x:0,y:0})
            .l({x:8,y:-12})
            .drw({ls:'@nodcolor',fs:'@nodfill2'})
                .cir({x:0,y:0,r:this.r,ls:'@nodcolor',fs:'@nodfill'})
            .lin({x1:-9,y1:-19,x2:9,y2:-19,ls:'@nodfill2',lw:5,lwnosc:false})
            .lin({x1:-9,y1:-15.5,x2:9,y2:-15.5,ls:'@nodcolor',lw:2,lwnosc:false})
            .end();
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
 *     .origin({x:10,y:10})
*/
g2.prototype.origin = function () { return this.addCommand({c:'origin',a:arguments[0]||{}}); }
g2.prototype.origin.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0,z:3.5},this);
        return g2()
            .beg({x:args.x,y:args.y,scl:args.scl,w:args.w,lc:'round',lj:'round',fs:'#ccc'})
            .vec({x1:0,y1:0,x2:10*args.z,y2:0,lw:0.8,fs:'#ccc'})
            .vec({x1:0,y1:0,x2:0,y2:10*args.z,lw:0.8,fs:'#ccc'})
            .cir({x:0,y:0,r:2.5,fs:'#ccc'})
            .end();
    }
})

/**
 * g2.selector.js (c) 2018 Stefan Goessner
 * @file selector for `g2` elements.
 * @author Stefan Goessner
 * @license MIT License
 */
/* jshint -W014 */

/**
 * Extensions.
 * (Requires cartesian coordinate system)
 * @namespace
 */
var g2 = g2 || { prototype:{} };  // for jsdoc only ...

// extend prototypes for argument objects
g2.selector = function(evt) {             
    if (this instanceof g2.selector) {
        this.selection = false;
        this.evt = evt;                 // sharing evt object with canvasInteractor as owner ... important !
        return this;
    }
    return g2.selector.apply(Object.create(g2.selector.prototype), arguments);
};
g2.handler.factory.push((ctx) => ctx instanceof g2.selector ? ctx : false);

// g2.selector.state = ['NONE','OVER','DRAG','OVER+DRAG','EDIT','OVER+EDIT'];

g2.selector.prototype = {
    init(grp) { return true; },
    exe(commands) {
        for (let elm=false, i=commands.length; i && !elm; i--)  // stop after first hit .. starting from list end !
            elm = this.hit(commands[i-1].a)
    },
    selectable(elm) {
        return elm && elm.hit;
    },
    hit(elm) {
        if (!this.evt.inside                                   // pointer not inside of canvas ..
         || !this.selectable(elm) )                            // no selectable elm ..
            return false;

        if (!elm.state && this.elementHit(elm)) {                // no mode
            if (!this.selection || this.selection && !(this.selection.state & g2.DRAG)) {
                if (this.selection) this.selection.state ^= g2.OVER;
                this.selection = elm;
                elm.state = g2.OVER;                              // enter OVER mode ..
                this.evt.hit = true;
            }
        }
        else if (elm.state & g2.DRAG) {                               // in DRAG mode
            if (!this.evt.btn)                                        // leave DRAG mode ..
                this.elementDragEnd(elm);
        }
        else if (elm.state & g2.OVER) {                               // in OVER mode
            if (!this.elementHit(elm)) {                              // leave OVER mode ..
                elm.state ^= g2.OVER;
                this.evt.hit = false;
                this.selection = false;
            }
            else if (this.evt.btn)                                    // enter DRAG mode
                this.elementDragBeg(elm);
        }
        return elm.state && elm;                                      // we definitely have a valid elm here ... 
    },                                                                // ... but only return it depending on its state. 
    elementDragBeg(elm) {
        elm.state |= g2.DRAG;
        if (elm.dragBeg) elm.dragBeg(e);
    },
    elementDragEnd(elm) {
        elm.state ^= (g2.OVER | g2.DRAG);
        this.selection = false;
        if (elm.dragEnd) elm.dragEnd(e);
    },
    elementHit(elm) {
        return elm.hit && elm.hit({x:this.evt.xusr,y:this.evt.yusr,eps:this.evt.eps});
    }
};
/**
 * canvasInteractor.js (c) 2018 Stefan Goessner
 * @file interaction manager for html `canvas`.
 * @author Stefan Goessner
 * @license MIT License
 */
/* jshint -W014 */
// Managing multiple canvases per static interactor as singleton ... 
// .. using a single requestAnimationFrame loop !
const canvasInteractor = {
    create() {
        const o = Object.create(this.prototype);
        o.constructor.apply(o,arguments); 
        return o; 
    },
    // global static tickTimer properties
    fps: '?',
    fpsOrigin: 0,
    frames: 0,
    rafid: 0,
    instances: [],
    // global static timer methods
    tick(time) {
        canvasInteractor.fpsCount(time);
        for (const instance of canvasInteractor.instances) {
            instance.notify('tick',{t:time,dt:(time-instance.t)/1000,dirty:instance.dirty});  // notify listeners .. 
            instance.t = time;
            instance.dirty = false;
        }
        canvasInteractor.rafid = requestAnimationFrame(canvasInteractor.tick);   // request next animation frame ...
    },
    add(instance) {
        canvasInteractor.instances.push(instance);
        if (canvasInteractor.instances.length === 1)  // first instance added ...
            canvasInteractor.tick(canvasInteractor.fpsOrigin = performance.now());
    },
    remove(instance) {
        canvasInteractor.instances.splice(canvasInteractor.instances.indexOf(instance),1);
        if (canvasInteractor.instances.length === 0)   // last instance removed ...
            cancelAnimationFrame(canvasInteractor.rafid);
    },
    fpsCount(time) {
        if (time - canvasInteractor.fpsOrigin > 1000) {  // one second interval reached ...
            const fps = ~~(canvasInteractor.frames*1000/(time - canvasInteractor.fpsOrigin) + 0.5); // ~~ as Math.floor()
            if (fps !== canvasInteractor.fps)
                for (const instance of canvasInteractor.instances)
                    instance.notify('fps',canvasInteractor.fps=fps);
            canvasInteractor.fpsOrigin = time;
            canvasInteractor.frames = 0;
        }
        canvasInteractor.frames++;
    },

    prototype: {
        constructor(ctx, {x,y,scl,cartesian}) {
            // canvas interaction properties
            this.ctx = ctx;
            this.view = {x:x||0,y:y||0,scl:scl||1,cartesian:cartesian||false};
            this.evt = {
                type: false,
                basetype: false,
                x: -2, y:-2,
                xi: 0, yi:0,
                dx: 0, dy: 0,
                btn: 0,
                xbtn: 0, ybtn: 0,
                xusr: -2, yusr: -2,
                dxusr: 0, dyusr: 0,
                delta: 0,
                inside: false,
                hit: false,  // something hit by pointer ...
                dscl: 1,     // for zooming ...
                eps: 5       // some pixel tolerance ...
            };
            this.dirty = true;
            // event handler registration
            const canvas = ctx.canvas;
            canvas.addEventListener("pointermove", this, false);
            canvas.addEventListener("pointerdown", this, false);
            canvas.addEventListener("pointerup", this, false);
            canvas.addEventListener("pointerenter", this, false);
            canvas.addEventListener("pointerleave", this, false);
            canvas.addEventListener("wheel", this, false);
            canvas.addEventListener("pointercancel", this, false);
        },
        deinit() {
            const canvas = this.ctx.canvas;

            canvas.removeEventListener("pointermove", this, false);
            canvas.removeEventListener("pointerdown", this, false);
            canvas.removeEventListener("pointerup", this, false);
            canvas.removeEventListener("pointerenter", this, false);
            canvas.removeEventListener("pointerleave", this, false);
            canvas.removeEventListener("wheel", this, false);
            canvas.removeEventListener("pointercancel", this, false);

            this.endTimer();

            delete this.signals;
            delete this.evt;
            delete this.ctx;

            return this;
        },
        // canvas interaction interface
        handleEvent(e) {
            if (e.type in this && (e.isPrimary || e.type === 'wheel')) {  // can I handle events of type e.type .. ?
                const bbox = e.target.getBoundingClientRect && e.target.getBoundingClientRect() || {left:0, top:0},
                      x = e.clientX - Math.floor(bbox.left),
                      y = e.clientY - Math.floor(bbox.top),
                      btn = e.buttons !== undefined ? e.buttons : e.button || e.which;

                this.evt.type = e.type;
                this.evt.basetype = e.type;  // obsolete now ... ?
                this.evt.xi = this.evt.x;    // interim coordinates ...
                this.evt.yi = this.evt.y;    // ... of previous event.
                this.evt.dx = this.evt.dy = 0;
                this.evt.x = x;
                this.evt.y = this.view.cartesian ? this.ctx.canvas.height - y : y;
                this.evt.xusr = (this.evt.x - this.view.x)/this.view.scl;
                this.evt.yusr = (this.evt.y - this.view.y)/this.view.scl;
                this.evt.dxusr = this.evt.dyusr = 0;
                this.evt.dbtn = btn - this.evt.btn;
                this.evt.btn = btn;
                this.evt.delta = Math.max(-1,Math.min(1,e.deltaY||e.wheelDelta)) || 0;

                if (this.isDefaultPreventer(e.type))
                    e.preventDefault();
                this[e.type]();  // handle specific event .. !
                this.notify(this.evt.type,this.evt);  // .. tell the world .. !
            }
            else
                console.log(e)
        },
        pointermove() {
            this.evt.dx = this.evt.x - this.evt.xi;
            this.evt.dy = this.evt.y - this.evt.yi;
            if (this.evt.btn === 1) {    // pointerdown state ...
                this.evt.dxusr = this.evt.dx/this.view.scl;  // correct usr coordinates ...
                this.evt.dyusr = this.evt.dy/this.view.scl;
                this.evt.xusr -= this.evt.dxusr;  // correct usr coordinates ...
                this.evt.yusr -= this.evt.dyusr;
                if (!this.evt.hit) {      // let outer app perform panning ...
                    this.evt.type = 'pan';
                }
                else
                    this.evt.type = 'drag';
            }
            // view, geometry or graphics might be modified ...
            this.dirty = true;
        },
        pointerdown() { 
            this.evt.xbtn = this.evt.x;
            this.evt.ybtn = this.evt.y;
        },
        pointerup() { 
            this.evt.type = this.evt.x===this.evt.xbtn && this.evt.y===this.evt.ybtn ? 'click' : 'pointerup';
            this.evt.xbtn = this.evt.x;
            this.evt.ybtn = this.evt.y;
        },
        pointerleave() { 
            this.evt.inside = false;
        },
        pointerenter() { 
            this.evt.inside = true;
        },
        wheel() {
            this.evt.dscl = this.evt.delta>0?8/10:10/8;
            this.evt.eps /= this.evt.dscl;
            this.dirty = true;
        },
        isDefaultPreventer(type) {
            return ['pointermove','pointerdown','pointerup','wheel'].includes(type);
        },
        pntToUsr: function(p) { 
            let vw = this.view; 
            p.x = (p.x - vw.x)/vw.scl; 
            p.y = (p.y - vw.y)/vw.scl; 
            return p; 
        },
        // tickTimer interface
        startTimer() {  // shouldn't there be a global startTimer method ?
            canvasInteractor.add(this);
            this.notify('timerStart',this);                    // notify potential listeners .. 
            return this;
        },
        endTimer() {
            this.notify('timerEnd',this.t/1000);              // notify potential listeners .. 
            canvasInteractor.remove(this);      
            return this;
        },
        // observable interface
        notify(key,val) {
            if (this.signals && this.signals[key]) 
                for (let hdl of this.signals[key]) 
                    hdl(val);
            return this;
        },
        on(key,handler) {   // support array of keys as first argument.
            if (Array.isArray(key))
                for (let k of key) 
                    this.on(k,handler);
            else
                ((this.signals || (this.signals = {})) && this.signals[key] || (this.signals[key]=[])).push(handler);
            
            return this;
        },
        remove(key,handler) {
            const idx = (this.signals && this.signals[key]) ? this.signals[key].indexOf(handler) : -1;
            if (idx >= 0)
                this.signals[key].splice(idx,1);
        }
    }
};
/**
 * g2.element.js (c) 2019-20 Stefan Goessner
 * @license MIT License
 */
"use strict";

class G2Element extends HTMLElement {
    static get observedAttributes() {
        return ['width', 'height','cartesian','grid', 'x0', 'y0', 'darkmode', 'interactive','background'];
    }

    constructor() {
        super();
        this._root = this.attachShadow({ mode:'open' });
    }

    get width() { return +this.getAttribute('width') || 301; }
    set width(q) { if (q) this.setAttribute('width',q); }
    get height() { return +this.getAttribute('height') || 201; }
    set height(q) { if (q) this.setAttribute('height',q); }
    get x0() { return (+this.getAttribute('x0')) || 0; }
    set x0(q) { if (q) this.setAttribute('x0',q); }
    get y0() { return (+this.getAttribute('y0')) || 0; }
    set y0(q) { if (q) this.setAttribute('y0',q); }
    get cartesian() { return this.hasAttribute('cartesian'); }
    set cartesian(q) { q ? this.setAttribute('cartesian','') : this.removeAttribute('cartesian'); }
    get grid() { return this.hasAttribute('grid') || false; }
    set grid(q) { q ? this.setAttribute('grid','') : this.removeAttribute('grid'); }
    get darkmode() { return this.hasAttribute('darkmode') || false; }
    get interactive() { return this.hasAttribute('interactive') || false; }
    get background() { return this.getAttribute('background') || false; }
    get g() { return this._g; }
    get canvas() { return  this._ctx && this._ctx.canvas || false }
    get readyState() { return !!this._g; }

    update() { 
        if (!this.interactive && this._g && this._ctx) 
            this._g.exe(this._ctx); 
    }

    init() {
        const state = {x:this.x0,y:this.y0,cartesian:this.cartesian};
        // add shadow dom
        this._root.innerHTML = G2Element.template({width:this.width,height:this.height,darkmode:this.darkmode});
        // cache elements of shadow dom
        this._logview = this._root.getElementById('logview');
        // set up canvas context 
        this._ctx = this._root.getElementById('cnv').getContext('2d');
        // set up canvas background 
        if (this.background && G2Element[this.background])
            this._ctx.canvas.style.backgroundImage = 'url('+G2Element[this.background]+')';
        // set up canvas interactor 
        if (this.interactive) {
            this._interactor = canvasInteractor.create(this._ctx, state);
            this._selector = g2.selector(this._interactor.evt);
            this._interactor.on('tick', e => this.ontick(e))
                            .on('pan', e => this.onpan(e))
                            .on('drag', e => this.ondrag(e))
                            .on('wheel', e => this.onwheel(e));
        }
        this._g = g2().clr().view(this.interactive && this._interactor.view || state);
        if (this.grid) this._g.grid({color:this.darkmode?'#999':'#ccc'});
        this.initContent(this.innerHTML.trim(), e => this.log(e));
        if (this.interactive)
            this._interactor.startTimer();
        else    // no tick timer .. !
            this._g.exe(this._ctx);
        this.dispatchEvent(new CustomEvent('init'));
    }
    initContent(content, onErr) {
        if (!content) return;
        try { 
            content = JSON.parse(content);                      // is valid JSON string ?
            content = g2.io.parseGrp(content, 'main', onErr);   // is valid g2 json string
            if (content && content.commands) {                  // content is a valid g2 object.
                this._g.commands.push(...content.commands);     // inject commands of `main` group ...
            }                                                   // ... into `_g` with a little brute force.
        }
        catch(e) {
            const w = this.width, h = this.height, x0 = this.x0, y0 = this.y0, dx = w/20, dy = h/20,
                  x = q => q*w-x0, y = q => q*h-y0;

            content = g2({id:'main'}).stroke({"d":`M${x(0.05)},${y(0.05)} ${x(0.45)},${y(0.45)}M${x(0.55)},${y(0.55)} ${x(0.95)},${y(0.95)}M${x(0.05)},${y(0.95)} ${x(0.45)},${y(0.55)}M${x(0.55)},${y(0.45)} ${x(0.95)},${y(0.05)}`,lw:10,ls:"red",lc:"round"});
            this._g.ins(content);
            onErr(e.message);
        }
        return !!content;
    }
    deinit() {
        delete this._selector;
        if (this.interactive) {
            delete this._interactor.deinit();
            delete this._interactor;
            delete this._selector;
        }
        delete this._g;
        // delete cached data
        delete this._ctx;
    }
    log(str) { 
        this._logview.innerHTML += str; 
    }

    ontick(e) {
        this.dispatchEvent(new CustomEvent('tick'));
        if (this.interactive)
            this._g.exe(this._selector);
        this._g.exe(this._ctx);
    }
    onpan(e) { 
        this._interactor.view.x = this.x0 += e.dx;
        this._interactor.view.y = this.y0 += e.dy;
    }
    ondrag(e) {    // only modify selected geometry here .. do not redraw .. !
        if (this._selector.selection && this._selector.selection.drag) {
            this._selector.selection.drag({x:e.xusr,y:e.yusr,dx:e.dxusr,dy:e.dyusr,mode:'drag'});
            this.dispatchEvent(new CustomEvent('drag'));
        }
    }
    onwheel(e) {
        this._interactor.view.x = e.x + e.dscl*(this._interactor.view.x - e.x);
        this._interactor.view.y = e.y + e.dscl*(this._interactor.view.y - e.y);
        this._interactor.view.scl *= e.dscl;
    }

    on(hdl,fn) { }

    // standard lifecycle callbacks
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
    connectedCallback() {
        this.init();
    }
    disconnectedCallback() {
        this.deinit();
    }
    attributeChangedCallback(name, oldval, val) {
        if (this._root && this._root.getElementById('cnv')) {
            if (name === 'width') {  // todo: preserve minimum width
                this._root.getElementById('cnv').setAttribute('width',val);
                this._root.querySelector('.status').style.width = val+'px';
            }
            if (name === 'height')   // todo: preserve minimum height
                this._root.getElementById('cnv').setAttribute('height',val);
        }
    }

    static template({width,height,darkmode}) {
return `
<style>
    #cnv {
        background-color:${darkmode?'#777':'#eee'};
        touch-action: none;
    }
</style>
<div style="width:${width};">
<canvas id="cnv" width="${width}" height="${height}" touch-action="none"></canvas><br>
<pre id="logview"></pre>
</div>
`
    }

    static get paper() { return " data:image/png;base64,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"; }
}
customElements.define('g-2', G2Element);
