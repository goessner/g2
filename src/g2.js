/**
 * g2 (c) 2013-18 Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2-new
 */
"use strict"

 /**
  * Create a 2D graphics command queue object. Call without using 'new'.
  * @typedef {g2}
  * @param {object} [opts] Custom options object. It is simply copied into the 'g2' instance, but not used from the g2 kernel.
  * @returns {g2}
  * @example
  * const ctx = document.getElementById("c").getContext("2d");
  * g2()                                   // Create 'g2' instance.
  *     .lin({x1:50,y1:50,x2:100,y2:100})  // Append ...
  *     .lin({x1:100,y1:100,x2:200,y2:50}) // ... commands.
  *     .exe(ctx);                         // Execute commands addressing canvas context.
  */
/*
function g2(opts) {
    if (this instanceof g2) {
        if (opts) Object.assign(this,opts);
        this.commands = [];
        return this;
    }
    return g2.apply(Object.create(g2.prototype),[opts]);
}
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
     * @property {booean} [cartesian=false] - set cartesian flag.
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
     * @property {boolean} [closed = false]
     * @property {number} x - start x coordinate.
     * @property {number} y - start y coordinate.
     * @property {number} w - angle.
     * @example
     * g2().ply({pts:[100,50,120,60,80,70]}),
     *     .ply({pts:[150,60],[170,70],[130,80]],closed:true}),
     *     .ply({pts:[{x:160,y:70},{x:180,y:80},{x:140,y:90}]}),
     *     .exe(ctx);
     */
        ply({pts,closed,x,y,w}) {
            arguments[0]._itr = g2.pntItrOf(pts);
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
     */
        txt({str,x,y,w}) { return this.addCommand({c:'txt',a:arguments[0]}); },

    /**
     * Reference g2 graphics commands from another g2 object.
     * With this command you can reuse instances of grouped graphics commands
     * while applying a similarity transformation and style properties on them.
     * In fact you might want to build custom graphics libraries on top of that feature.
     * @method
     * @returns {object} g2
     * @param {object} - use arguments object.
     * @property {object | string} grp - g2 source object or symbol name found in 'g2.symbol' namespace.
     * @property {number} [x=0] - translation value x.
     * @property {number} [y=0] - translation value y.
     * @property {number} [w=0] - rotation angle (in radians).
     * @property {number} [scl=1] - scale factor.
     * @example
     * g2.symbol.cross = g2().lin({x1:5,y1:5,x2:-5,y2:-5}).lin({x1:5,y1:-5,x2:-5,y2:5});  // Define symbol.
     * g2().use({grp:"cross",x:100,y:100})  // Draw cross at position 100,100.
     */
        use({grp,x,y,w,scl}) {
            if (typeof grp === "string")  // must be a member name of the 'g2.symbol' namespace
                arguments[0].grp = grp = g2.symbol[grp];
            if (grp && grp !== this)      // avoid self reference ..
                this.addCommand({c:'use',a:arguments[0]});
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
     * @property {number} [b = undefined] - width.
     * @property {number} [h = undefined] - height.
     * @property {number} [xoff = undefined] - x-offset.
     * @property {number} [yoff = undefined] - y-offset.
     * @property {number} [dx = undefined] - region x.
     * @property {number} [dy = undefined] - region y.
     */
        img({uri,x,y,w,b,h,xoff,yoff,dx,dy}) { return this.addCommand({c:'img',a:arguments[0]}); },

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
                findMyBeg = (cmd) => {
                    if      (cmd.c === 'beg') myBeg--;
                    else if (cmd.c === 'end') myBeg++;
                    return myBeg === 0;
                }
            return g2.getCmdIdx(this.commands,findMyBeg) !== false ? this.addCommand({c:'end'}) : this;
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
        ins(fn) {
            return typeof fn === 'function' ? (fn(this) || this)
                 : typeof fn === 'object'   ? ( this.commands.push({c:'ins',a:fn}), this ) // no 'addCommand' .. !
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
            this.commands.push(a ? g2.refineCmdArgs(arguments[0]) : {c});
            return this;
        }
    };

// statics
g2.defaultStyle = {fs:'transparent',ls:'#000',lw:1,lc:"butt",lj:"miter",ld:[],ml:10,sh:[0,0],font:'14px serif',thal:'start',tval:'alphabetic'};
g2.symbol = {};
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
   "x,y":   function(pts) { function pitr(i) { return {x:pts[2*i],y:pts[2*i+1]}; };                      pitr.len = pts.length/2; return pitr; },
   "[x,y]": function(pts) { function pitr(i) { return pts[i] ? {x:pts[i][0],y:pts[i][1]} : undefined; }; pitr.len = pts.length;   return pitr; },
   "{x,y}": function(pts) { function pitr(i) { return pts[i]; };                                         pitr.len = pts.length;   return pitr; }
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
g2.getCmdIdx = function(cmds,callbk) {
    for (let i = cmds.length-1; i >= 0; i--)
        if (callbk(cmds[i],i,cmds))
            return i;
    return false;  // command with index '0' signals 'failing' ...
};
/**
 * refine command arguments object.
 * @private
 */
g2.refineCmdArgs = function({c,a}) {
    for (const key in a)
        if (!Object.getOwnPropertyDescriptor(a,key).get &&  // if no getter ... and
            key[0] !== '_' &&                               // no private property ... and
            typeof a[key] === 'function') {                 // a function
            Object.defineProperty(a, key, { get:a[key], enumerable:true, configurable:true, writabel:false });
        }
    if (g2.prototype[c].prototype) Object.setPrototypeOf(a, g2.prototype[c].prototype);
//    if (g2.prototype[c].prototype) a.__proto__ = g2.prototype[c].prototype;
    return arguments[0];
}

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
    exe(commands) {
        for (let cmd of commands) {
            if (cmd.c && this[cmd.c])
                this[cmd.c](cmd.a);
            else if (cmd.a && 'g2' in cmd.a)
                this.exe(cmd.a.g2().commands);
        }
    },
    view({x=0,y=0,scl=1,cartesian=false}) {
        this.pushTrf(cartesian ? [scl,0,0,-scl,x,this.ctx.canvas.height-1-y]
                               : [scl,0,0,scl,x,y] );
    },
    grid({color,size}={}) {
        let ctx = this.ctx, b = ctx.canvas.width, h = ctx.canvas.height,
            {x,y,scl} = this.uniTrf,
            sz = size || this.gridSize(scl),
            xoff = x%sz, yoff = y%sz;
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.strokeStyle = color || "#ccc";
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
    cir({x,y,r}) {
        this.ctx.beginPath();
        this.ctx.arc(x||0,y||0,Math.abs(r),0,2*Math.PI,true);
        this.drw(arguments[0]);
    },
    arc({x,y,r,w,dw}) {
        w = w||0;
        dw = dw||2*Math.PI;
        this.ctx.beginPath();
        this.ctx.arc(x||0,y||0,Math.abs(r),w,w+dw,dw<0);
        this.drw(arguments[0]);
    },
    ell({x,y,rx,ry,w,dw,rot}) {
        ry = ry||rx;
        w = w||0;
        dw = dw||2*Math.PI;
        rot = rot||0;
        this.ctx.beginPath();
        this.ctx.ellipse(x||0,y||0,Math.abs(rx),Math.abs(ry),rot,w,w+dw,dw<0);
        this.drw(arguments[0]);
    },
    rec({x,y,b,h}) {
        let tmp = this.setStyle(arguments[0]);
        h = h || b;
        x = x || 0;
        y = y || 0;
        this.ctx.fillRect(x,y,b,h);
        this.ctx.strokeRect(x,y,b,h);
        this.resetStyle(tmp);
    },
    lin({x1,y1,x2,y2}) {
        let ctx = this.ctx;
        ctx.beginPath()
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        this.stroke(arguments[0]);
    },
    ply: function({pts,closed,x,y,w,_itr}) {
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
    },
    txt({str,x,y,w,unsizable}) {
        x = x || 0; y = y || 0;
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
    img({uri,x,y,w,scl,xoff,yoff}) {
        const getImg = (uri) => {
            let img = new Image();
            img.src = uri;
            img.addEventListener('error',() => this.ctx.drawImage(getImg("data:image/gif;base64,R0lGODlhHgAeAKIAAAAAmWZmmZnM/////8zMzGZmZgAAAAAAACwAAAAAHgAeAEADimi63P5ryAmEqHfqPRWfRQF+nEeeqImum0oJQxUThGaQ7hSs95ezvB4Q+BvihBSAclk6fgKiAkE0kE6RNqwkUBtMa1OpVlI0lsbmFjrdWbMH5Tdcu6wbf7J8YM9H4y0YAE0+dHVKIV0Efm5VGiEpY1A0UVMSBYtPGl1eNZhnEBGEck6jZ6WfoKmgCQA7"),0,0),{once:true});
            img.addEventListener('load',() => this.ctx.drawImage(img,0,0),{once:true});
            return img;
        }

        scl = scl || 1;
        const args = arguments[0],
              img = args._image || (args._image = getImg(uri,false)),
              sw = w ? scl*Math.sin(w) : 0,
              cw = w ? scl*Math.cos(w) : scl,
              b = img && img.width || 20,
              h = img && img.height || 20;

        x = x || 0; y = y || 0; xoff = xoff || 0; yoff = yoff || 0;
        this.setTrf(this.isCartesian ? [cw,sw,sw,-cw,x-cw*xoff-sw*(h-yoff),y-sw*xoff+cw*(h-yoff)]
                                     : [cw,sw,-sw,cw,x-xoff,y-yoff]);

        this.resetTrf();
    },
    use({grp}) {
        this.beg(arguments[0]);
        this.exe(grp.commands);
        this.end();
    },
    beg({x,y,w,scl,matrix,unsizable}={}) {
        let trf = matrix;
        x = x || 0;
        y = y || 0;
        if (!trf) {
            let ssw, scw;
            w = w || 0;
            scl = scl || 1;
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
//                if (dw < 0) dw = -dw;   // test for bugs .. !
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
