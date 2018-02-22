/**
 * g2 (c) 2013-17 Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 */

 /**
  * Create a 2D graphics command queue object. Call without using 'new'.
  * @typedef {g2}
  * @param {object} [opts] Custom options object. It is simply copied into the 'g2' instance, but not used from the g2 kernel.
  * @returns {g2}
  * @example
  * var ctx = document.getElementById("c").getContext("2d");
  * g2()                  // Create 'g2' instance.
  *  .lin(50,50,100,100)  // Append ...
  *  .lin(100,100,200,50) // ... commands.
  *  .exe(ctx);           // Execute commands addressing canvas context.
  */
function g2(opts) {
    if (this instanceof g2) {
        if (opts) Object.assign(this,opts);
        this.commands = [];
        return this;
    }
    return g2.apply(Object.create(g2.prototype),[opts]);
}

g2.prototype = {
/**
 * Clear viewport region.<br>
 * @method
 * @typedef {param}
 * @prop {number} [b] - viewport width (optional)
 * @prop {number} [h] - viewport height (optional)
 * @param {param} [param] parameter object (optional).
 * @returns {g2} this
 */
    clr: function clr() { return this.addCommand({c:'clr'}); },
    view: function view({scl,x,y,cartesian}) { return this.addCommand({c:'view',a:arguments[0]}); },
    grid: function grid({color,size}={}) { return this.addCommand({c:'grid',a:arguments[0]}); },
    cir: function cir({x,y,r}) { return this.addCommand({c:'cir',a:arguments[0]}); },
    ell: function ell({x,y,rx,ry,w,dw,rot}) { return this.addCommand({c:'ell',a:arguments[0]}); },
    arc: function arc({x,y,r,w,dw}) { return this.addCommand({c:'arc',a:arguments[0]}); },
    rec: function rec({x,y,b,h}) { return this.addCommand({c:'rec',a:arguments[0]}); },
    lin: function lin({x1,y1,x2,y2}) { return this.addCommand({c:'lin',a:arguments[0]}); },
    ply: function ply({pts,closed,x,y,w}) {
        arguments[0]._itr = g2.pntItrOf(pts);
        return this.addCommand({c:'ply',a:arguments[0]});
    },
    txt: function txt({str,x,y,w}) { return this.addCommand({c:'txt',a:arguments[0]}); },
    use: function use({grp,x,y,w,scl}) {
        if (typeof grp === "string")  // must be a member name of the 'g2.symbol' namespace
            arguments[0].grp = grp = g2.symbol[grp];
        if (grp && grp !== this)      // avoid self reference ..
            this.addCommand({c:'use',a:arguments[0]});
        return this;
    },
    img: function img({uri,x,y,w,b,h,xoff,yoff,dx,dy}) { return this.addCommand({c:'img',a:arguments[0]}); },
    beg: function beg({x,y,w,scl,matrix}={}) { return this.addCommand({c:'beg',a:arguments[0]}); },
    end: function end() { // ignore 'end' commands without matching 'beg'
        let myBeg = 1, 
            findMyBeg = (cmd) => { 
                if      (cmd.c === 'beg') myBeg--;
                else if (cmd.c === 'end') myBeg++;
                return myBeg === 0;
            }
        return g2.getCmdIdx(this.commands,findMyBeg) !== false ? this.addCommand({c:'end'}) : this;
    },
    p: function p() { return this.addCommand({c:'p'}); },
    z: function z() { return this.addCommand({c:'z'}); },
    m: function m({x,y}) { return this.addCommand({c:'m',a:arguments[0]}); },
    l: function l({x,y}) { return this.addCommand({c:'l',a:arguments[0]}); },
    q: function q({x1,y1,x,y}) { return this.addCommand({c:'q',a:arguments[0]});},
    c: function c({x1,y1,x2,y2,x,y}) { return this.addCommand({c:'c',a:arguments[0]}); },
    a: function a({dw,x,y}) {
        let prvcmd = this.commands[this.commands.length-1];
        g2.cpyProp(prvcmd.a,'x',arguments[0],'_xp');
        g2.cpyProp(prvcmd.a,'y',arguments[0],'_yp');
        return this.addCommand({c:'a',a:arguments[0]});
    },
    stroke: function stroke({d}={}) { return this.addCommand({c:'stroke',a:arguments[0]}); },
    fill: function fill({d}={}) { return this.addCommand({c:'fill',a:arguments[0]}); },
    drw: function drw({d}={}) { return this.addCommand({c:'drw',a:arguments[0]}); },
/**
 * Delete all commands beginning from `idx` to end of command queue.<br>
 * @method
 * @returns {g2} this
 */
    del: function del(idx) { this.commands.length = idx || 0; return this; },
    ins: function(fn) {
        return typeof fn === 'function' ? (fn(this) || this)
             : typeof fn === 'object'   ? ( this.commands.push({c:'ins',a:fn}), this )
             : this;
    },
    exe: function(ctx) {
        let handler = g2.handler(ctx);
        if (handler && handler.init(this))
           handler.exe(this.commands);
        return this;
    },
    // helpers ...
    addCommand: function({c,a}) {
        if (a) {
            for (let key in a)
                if (!Object.getOwnPropertyDescriptor(a,key).get &&  // if no getter ... and
                    key[0] !== '_' &&                               // no private property ... and
                    typeof a[key] === 'function') {                 // a function
                    Object.defineProperty(a, key, { get:a[key], enumerable:true, configurable:true, writabel:false });
                }
            if (this[c].prototype) a.__proto__ = this[c].prototype;
        }
        this.commands.push(a ? {c,a} : {c});
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
   "x,y":   function(pts) { function pitr(i) { return {x:pts[2*i],y:pts[2*i+1]}; }; pitr.len = pts.length/2; return pitr; },
   "[x,y]": function(pts) { function pitr(i) { return {x:pts[i][0],y:pts[i][1]}; }; pitr.len = pts.length;   return pitr; },
   "{x,y}": function(pts) { function pitr(i) { return pts[i]; };                    pitr.len = pts.length;   return pitr; }
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
 * Copy properties, even as getters
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
    init: function(grp,style) {
        this.stack.length = 1;
        this.matrix.length = 1;
        this.initStyle(style ? Object.assign({},this.cur,style) : this.cur);
        return true;
    },
    exe: function(commands) {
        for (let cmd of commands) {
            if (cmd.c && this[cmd.c])
                this[cmd.c](cmd.a);
            else if (cmd.a && 'g2' in cmd.a)
                this.exe(cmd.a.g2().commands);
        }
    },
    view: function({x=0,y=0,scl=1,cartesian=false}) {
        this.pushTrf(cartesian ? [scl,0,0,-scl,x,this.ctx.canvas.height-1-y]
                               : [scl,0,0,scl,x,y] );
    },
    grid: function({color,size}={}) {
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
    clr: function({b,h}={}) { 
        let ctx = this.ctx;
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,b||ctx.canvas.width,h||ctx.canvas.height);
        ctx.restore();
    },
    cir: function({x,y,r}) {
        this.ctx.beginPath();
        this.ctx.arc(x||0,y||0,Math.abs(r),0,2*Math.PI,true);
        this.drw(arguments[0]);
    },
    arc: function({x,y,r,w,dw}) {
        w = w||0;
        dw = dw||2*Math.PI;
        this.ctx.beginPath();
        this.ctx.arc(x||0,y||0,Math.abs(r),w,w+dw,dw<0);
        this.drw(arguments[0]);
    },
    ell: function({x,y,rx,ry,w,dw,rot}) {
        ry = ry||rx;
        w = w||0;
        dw = dw||2*Math.PI;
        rot = rot||0;
        this.ctx.beginPath();
        this.ctx.ellipse(x||0,y||0,Math.abs(rx),Math.abs(ry),rot,w,w+dw,dw<0);
        this.drw(arguments[0]);
    },
    rec: function({x,y,b,h}) { 
        let tmp = this.setStyle(arguments[0]);
        h = h || b;
        x = x || 0;
        y = y || 0;
        this.ctx.fillRect(x,y,b,h);
        this.ctx.strokeRect(x,y,b,h);
        this.resetStyle(tmp);
    },
    lin: function({x1,y1,x2,y2}) {
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
    txt: function({str,x,y,w,unsizable}) {
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
    img: function({uri,x,y,w,scl,xoff,yoff}) {
        const getImg = (uri) => {
            let img = new Image();
            img.src = uri;
            return img;
        }

        let args = arguments[0], 
            img = args._image || (args._image = getImg(uri,false)),
            sw = w ? Math.sin(w) : 0, 
            cw = w ? Math.cos(w) : 1,
            b =  img && img.width || 20,
            h =  img && img.height || 20;

        x = x || 0; y = y || 0; xoff = xoff || 0; yoff = yoff || 0;
        this.setTrf(this.isCartesian ? [cw,sw,sw,-cw,x-sw*(h-yoff),y+cw*(h-yoff)]
                                     : [cw,sw,-sw,cw,x-xoff,y-yoff]);
        if (img.complete)
           this.ctx.drawImage(img,0,0);
        else // broken image ..
           this.ctx.drawImage(getImg("data:image/gif;base64,R0lGODlhHgAeAKIAAAAAmWZmmZnM/////8zMzGZmZgAAAAAAACwAAAAAHgAeAEADimi63P5ryAmEqHfqPRWfRQF+nEeeqImum0oJQxUThGaQ7hSs95ezvB4Q+BvihBSAclk6fgKiAkE0kE6RNqwkUBtMa1OpVlI0lsbmFjrdWbMH5Tdcu6wbf7J8YM9H4y0YAE0+dHVKIV0Efm5VGiEpY1A0UVMSBYtPGl1eNZhnEBGEck6jZ6WfoKmgCQA7"),0,0);

        this.resetTrf();
    },
    use: function({grp}) {
        this.beg(arguments[0]);
        this.exe(grp.commands);
        this.end();
    },
    beg: function({x,y,w,scl,matrix,unsizable}) {
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
    end: function() {
        this.popTrf();
        this.popStyle();
    },
    p: function() { this.ctx.beginPath(); },
    z: function() { this.ctx.closePath(); },
    m: function({x,y}) { this.ctx.moveTo(x,y); },
    l: function({x,y}) { this.ctx.lineTo(x,y); },
    q: function({x,y,x1,y1}) { this.ctx.quadraticCurveTo(x1,y1,x,y); },
    c: function({x,y,x1,y1,x2,y2}) { this.ctx.bezierCurveTo(x1,y1,x2,y2,x,y); },
    a: function({dw,x,y,_xp,_yp}) {
        if (dw > Number.EPSILON && dw < 2*Math.PI || dw < -Number.EPSILON && dw > -2*Math.PI) {
            let dx = x - _xp, dy = y - _yp, tdw_2 = Math.tan(dw/2),
                rx = (dx - dy/tdw_2)/2, ry = (dy + dx/tdw_2)/2,
                w = Math.atan2(-ry,-rx);
            this.ctx.arc(_xp+rx,_yp+ry,Math.hypot(rx,ry),w,w+dw,dw<0);
        }
        else
            this.ctx.lineTo(x,y);
    },
    stroke: function({d}={}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.stroke(new Path2D(d)) : this.ctx.stroke();  // SVG path syntax 
        this.resetStyle(tmp);
    },
    fill: function({d}={}) {
        let tmp = this.setStyle(arguments[0]);
        d ? this.ctx.fill(new Path2D(d)) : this.ctx.fill();  // SVG path syntax 
        this.resetStyle(tmp);
    },
    drw: function({d}={}) {
        let ctx = this.ctx,
            tmp = this.setStyle(arguments[0]),
            p = d && new Path2D(d);   // SVG path syntax 
        d ? ctx.fill(p) : ctx.fill();
        if (ctx.shadowColor !== 'rgba(0, 0, 0, 0)' && ctx.fillStyle !== 'rgba(0, 0, 0, 0)') {
           let shc = ctx.shadowColor;        // avoid stroke shadow when filled ...
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
            ctx.shadowOffsetX = q[0]||0;
            ctx.shadowOffsetY = q[1]||0;
            ctx.shadowBlur = q[2]||0;
            ctx.shadowColor = q[3]||'black';
        },
        font: (ctx,q) => { ctx.font=q; },
        thal: (ctx,q) => { ctx.textAlign=q; },
        tval: (ctx,q) => { ctx.textBaseline=q; }
    },
    initStyle: function(style) {
        for (key in style)
            if (this.get[key] && this.get[key](this.ctx) !== style[key])
                this.set[key](this.ctx, style[key]);
    },
    setStyle: function(style) {  // short circuit style setting 
        let q, prv = {};
        for (key in style) {
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
    resetStyle: function(style) {   // short circuit style reset
        for (key in style)
            this.set[key](this.ctx, style[key]);
    },
    pushStyle: function(style) {
        let cur = {};  // hold changed properties ...
        for (key in style) 
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
    popStyle: function() {
        let cur = this.stack.pop();
        this.cur = this.stack[this.stack.length-1];
        for (key in this.cur)
            if (this.get[key] && this.cur[key] !== cur[key])
               this.set[key](this.ctx, this.cur[key]);
    },
    concatTrf: function(q,t) {
        return [
            q[0]*t[0]+q[2]*t[1],
            q[1]*t[0]+q[3]*t[1],
            q[0]*t[2]+q[2]*t[3],
            q[1]*t[2]+q[3]*t[3],
            q[0]*t[4]+q[2]*t[5]+q[4],
            q[1]*t[4]+q[3]*t[5]+q[5]
        ];
    },
    initTrf: function() {
        this.ctx.setTransform(...this.matrix[0]);
    },
    setTrf: function(t) {
        this.ctx.setTransform(...this.concatTrf(this.matrix[this.matrix.length-1],t));
    },
    resetTrf: function() {
        this.ctx.setTransform(...this.matrix[this.matrix.length-1]);
    },
    pushTrf: function(t) {
        let q_t = this.concatTrf(this.matrix[this.matrix.length-1],t);
        this.matrix.push(q_t);
        this.ctx.setTransform(...q_t);
    },
    popTrf: function() {
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
    gridSize: function(scl) {
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
