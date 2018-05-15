/**
 * g2 (c) 2013-17 Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 * 
 */

 /**
 * Create a 2D graphics command queue object.
 * @typedef {g2}
 * @param {object} [opts] Custom options object. It is simply copied into the 'g2' object.
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
   return g2.apply(Object.create(g2.prototype),opts);
}

g2.prototype = {
/**
 * Delete all commands.<br>
 * @method
 * @returns {g2} this
 */
    del: function del() { this.commands.length = 0; return this; },
/**
 * Clear viewport region.<br>
 * @method
 * @typedef {param}
 * @prop {number} [b] - viewport width (optional)
 * @prop {number} [h] - viewport height (optional)
 * @param {param} [param] parameter object (optional).
 * @returns {g2} this
 */
    clr: function clr({b,h}={}) { return this.addCommand({c:'clr',a:arguments[0]}); },
    cartesian: function cartesian() { return this.addCommand({c:'cartesian'}); },
    // depricated .. !
    pan: function pan({dx,dy}) { return this.addCommand({c:'pan',a:arguments[0]}); },
    zoom: function zoom({scl,x,y}) { return this.addCommand({c:'zoom',a:arguments[0]}); },
    view: function view({scl,x,y}) { return this.addCommand({c:'view',a:arguments[0]}); },
    // depricated .. !
    grid: function grid({color,size}={}) { return this.addCommand({c:'grid',a:arguments[0]}); },
    cir: function cir({x,y,r}) { return this.addCommand({c:'cir',a:arguments[0]}); },
    ell: function ell({x,y,rx,ry,w}) {return this.addCommand({c:'ell',a:arguments[0]}); },
    arc: function arc({x,y,rw,dw}) { return this.addCommand({c:'arc',a:arguments[0]}); },
    rec: function rec({x,y,b,h}) { return this.addCommand({c:'rec',a:arguments[0]}); },
    lin: function lin({x1,y1,x2,y2}) { return this.addCommand({c:'lin',a:arguments[0]}); },
    ply: function ply({pts,closed,x,y,w,split}) {
        arguments[0].itr = ()=>g2.pntItrOf(pts);  // wrap in function to trick autogetter process ...
        return this.addCommand({c:'ply',a:arguments[0]});
    },
    spline: function spline({pts,closed,x,y,w}) {
        let itr = g2.pntItrOf(pts);
        if (itr) {
            let b = [], i, n = itr.len, 
                p1, p2, p3, p4, d1, d2, d3, d1d2, d2d3, scl2, scl3, den2, den3;

            for (let i=0; i < (closed ? n : n-1); i++) {
                if (i === 0) {
                    p1 = closed ? itr(n-1) : {x:2*itr(0).x-itr(1).x, y:2*itr(0).y-itr(1).y};
                    p2 = itr(0);
                    p3 = itr(1);
                    p4 = n === 2 ? (closed ? itr(0) : {x:2*itr(1).x-itr(0).x, y:2*itr(1).y-itr(0).y}) : itr(2);
                    d1 = Math.max(Math.hypot(p2.x-p1.x,p2.y-p1.y),Number.EPSILON);  // don't allow ..
                    d2 = Math.max(Math.hypot(p3.x-p2.x,p3.y-p2.y),Number.EPSILON);  // zero point distances ..
                }
                else {
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
                b.push({ x: p2.x, y: p2.y,
                        x1: (-d2*p1.x + scl2*p2.x + d1*p3.x)/den2,
                        y1: (-d2*p1.y + scl2*p2.y + d1*p3.y)/den2,
                        x2: (-d2*p4.x + scl3*p3.x + d3*p2.x)/den3,
                        y2: (-d2*p4.y + scl3*p3.y + d3*p2.y)/den3 });
            }
            b.push(closed ? {x:itr(0).x,y:itr(0).y} : {x:itr(n-1).x,y:itr(n-1).y});
            arguments[0].b = b;
            this.addCommand({c:'spline',a:arguments[0]});
        }
        return this;
    },
    txt: function txt({str,x,y,w}) { return this.addCommand({c:'txt',a:arguments[0]}); },
    use: function use({grp,x,y,w,scl}) {
        if (typeof grp === "string")  // must be a member name of the 'g2.symbol' namespace
            arguments[0].grp = grp = g2.symbol[grp];
        if (grp && grp !== this)      // avoid self reference ..
            this.addCommand({c:'use',a:arguments[0]});
        return this;
    },
    beg: function beg({x,y,w,scl,matrix}={}) { return this.addCommand({c:'beg',a:arguments[0]}); },
    end: function end() { return this.addCommand({c:'end',a:{}}); },
    p: function p() { return this.addCommand({c:'p',a:{}}); },
    z: function z() { return this.addCommand({c:'z',a:{}}); },
    m: function m({x,y}) { return this.addCommand({c:'m',a:arguments[0]}); },
    l: function l({x,y}) { return this.addCommand({c:'l',a:arguments[0]}); },
    q: function q({x1,y1,x,y}) { return this.addCommand({c:'q',a:arguments[0]});},
    c: function c({x1,y1,x2,y2,x,y}) { return this.addCommand({c:'c',a:arguments[0]}); },
    a: function a({dw,x,y}) {
        let prvcmd = this.commands[this.commands.length-1],
            xp = prvcmd.a.x, yp = prvcmd.a.y, pi2 = 2*Math.PI;
        if (dw > Number.EPSILON && dw < pi2 || dw < -Number.EPSILON && dw > -pi2) {
            let dx = x-xp, dy = y-yp, tw2 = Math.tan(dw/2),
                rx = dx/2 - dy/tw2/2, ry = dy/2 + dx/tw2/2,
                w = Math.atan2(-ry,-rx);
            this.addCommand({c:'a',a:{x,y,x0:xp+rx,y0:yp+ry,r:Math.hypot(rx,ry),w,dw,wend:w+dw,ccw:dw<0}})
        }
        else  // draw a straight line instead ...
            this.addCommand({c:'l',a:{x,y}});
        return this;
    },
    stroke: function stroke({d}={}) { return this.addCommand({c:'stroke',a:arguments[0]}); },
    fill: function fill({d}={}) { return this.addCommand({c:'fill',a:arguments[0]}); },
    drw: function drw({d}={}) {
        if (d && typeof d === "string") arguments[0].d = new Path2D(d); // maybe better add svg path string to command ... ?
        return this.addCommand({c:'drw',a:arguments[0]}); 
    },
    exe: function(ctx) {
        let handler = g2.handler(ctx);
//        console.log(`ctx=${JSON.stringify(ctx)}, hdl=${handler}`)
//        try {
            if (handler && handler.init(ctx,this))
               this.apply(handler, ctx, this);
//        }
//        catch(e) {
//            console.log(`${e}: c:${command.c}, a:${JSON.stringify(command.a)}`);
//        }
        return this;
    },
    apply: function(handler, ctx, g) {
        for (let cmd of g.commands) {
            if (handler[cmd.c])
                cmd.a ? handler[cmd.c](ctx,cmd.a) : handler[cmd.c](ctx);
            else if (g2.prototype[cmd.c].group)
                g2.prototype.apply(handler,ctx,g2.prototype[cmd.c].group(cmd.a));
        }
    },
    // helpers ...
    addCommand: function({c,a}) {
        if (a) {
            for (let key in a)
                if (!Object.getOwnPropertyDescriptor(a,key).get && typeof a[key] === 'function') {
                    Object.defineProperty(a, key, { get:a[key], enumerable:true, configurable:true, writabel:false });
//                    console.log("make getter:"+key+"="+a[key])
                }
            if (this[c].prototype) a.__proto__ = this[c].prototype;
        }
        this.commands.push(arguments[0]);
        return this;
    }
};

g2.prototype.vec = function vec({x1,y1,x2,y2,lw,ls,ld}) { return this.addCommand({c:'vec',a:arguments[0]}); }
g2.prototype.vec.group = function({x1,y1,x2,y2,lw,ls,ld}) {
    let z = 2, dx = x2-x1, dy = y2-y1, r = Math.hypot(dx,dy);
    return g2().beg({x:x1,y:y1,w:Math.atan2(dy,dx),lc:"round",lj:"round",fs:"@ls",lw:lw||1,ls:ls||'black',ld:ld||[]})
                    .p().m({x:0,y:0})
                    .l({x:r,y:0})
                    .stroke()
                    .p().m({x:r,y:0})
                    .l({x:r-5*z,y:z})
                    .a({dw:-Math.PI/3,x:r-5*z,y:-z})
                    .z()
                    .drw()
                .end();
}

// statics ...

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

g2.symbol = {};

g2.handler = function(ctx) {
    return ctx instanceof CanvasRenderingContext2D ? ctx.g2_handler || (ctx.g2_handler = g2.canvasHdl())
         : ctx instanceof g2.picker ? ctx
         : ctx instanceof g2.io ? ctx
         : ctx instanceof g2.squiggle ? ctx
         : false;
}

g2.canvasHdl = function() {
    if (this instanceof g2.canvasHdl) {
        this.cur = {fs:'transparent',ls:'#000',lw:1,lc:"butt",lj:"miter",ld:[],ml:10,sh:[0,0],font:'12px sans-serif',thal:'start',tval:'alphabetic'};
        this.stack = [this.cur];
        this.matrix = [[1,0,0,1,0.5,0.5]];
        this.gridBase = 2;
        this.gridExp = 1;
        return this;
     }
     return g2.canvasHdl.apply(Object.create(g2.canvasHdl.prototype),arguments);
};

g2.canvasHdl.prototype = {
    init: function(ctx,grp) {
        this.stack.length = 1;
        this.matrix.length = 1;
        this.initStyle(ctx);
        this.initTrf(ctx);
        return true;
    },
/*
    exe: function(ctx,command) {
        let g = g2.prototype[command.c].create(command.a),
            tmp = command.a && this.state.setStyle(ctx,command.a);
        for (cmd of g.commands) {
            if (this[cmd.c])   // can handle command by myself ... !
                cmd.a ? this[cmd.c](ctx,cmd.a) : this[cmd.c](ctx);
            else if (g2.prototype[cmd.c].create)  // apply provided command group ... !
                this.exe(ctx,cmd);
        }
        if (tmp) this.state.resetStyle(ctx,tmp);
    },
*/
    cartesian: function(ctx) {
        this.pushTrf(ctx,[1,0,0,-1,0,ctx.canvas.height]);
    },
    pan: function(ctx,{dx,dy}) {
        this.pushTrf(ctx,[1,0,0,1,dx,dy]);
    },
    zoom: function(ctx,{x,y,scl}) {
        this.pushTrf(ctx,[scl,0,0,scl,(1-scl)*x,(1-scl)*y]);
    },
    view: function(ctx,{x,y,scl}) {
        this.pushTrf(ctx,[scl,0,0,scl,x,y]);
    },
    grid: function(ctx,{color,size}={}) {
        let b = ctx.canvas.width, h = ctx.canvas.height,
            {x,y,scl,cartesian} = this.homoTrf,
            sz = size || this.gridSize(scl),
            xoff = Math.round(x%sz-sz), yoff = Math.round(y%sz-sz);
        ctx.save();
        ctx.setTransform(1,0,0, 1,0,0);
        ctx.strokeStyle = color || "#ccc";
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x=xoff,nx=b+1; x<nx; x+=sz) { ctx.moveTo(x,0); ctx.lineTo(x,h); }
        for (let y=yoff,ny=h+1; y<ny; y+=sz) { ctx.moveTo(0,y); ctx.lineTo(b,y); }
        ctx.stroke();
        ctx.restore();
    },
    clr: function(ctx,{b,h}={}) { 
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        ctx.clearRect(0,0,b||ctx.canvas.width,h||ctx.canvas.height);
        ctx.restore();
    },
    cir: function(ctx,{x,y,r}) {
        ctx.beginPath();
        ctx.arc(x,y,Math.abs(r),0,2*Math.PI,true);
        this.drw(ctx,arguments[1]);
    },
    arc: function(ctx,{x,y,r,w,dw}) {
        w = w||0;
        dw = dw||2*Math.PI;
        ctx.beginPath();
        ctx.arc(x,y,Math.abs(r),w,w+dw,dw<0);
        this.drw(ctx,arguments[1]);
    },
    ell: function(ctx,{x,y,rx,ry,rot,w,dw}) {
        ry = ry||rx;
        rot = rot||0;
        w = w||0;
        dw = dw||2*Math.PI;
        ctx.beginPath();
        ctx.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot,w,w+dw,dw<0);
        this.drw(ctx,arguments[1]);
    },
    rec: function(ctx,{x,y,b,h}) { 
        let tmp = this.setStyle(ctx,arguments[1]);
        h = h || b;
        ctx.fillRect(x,y,b,h);
        ctx.strokeRect(x,y,b,h);
        this.resetStyle(ctx,tmp);
    },
    lin: function(ctx,{x1,y1,x2,y2}) {
        ctx.beginPath()
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        this.stroke(ctx,arguments[1]);
    },
    ply: function(ctx,{pts,closed,x,y,w,split,itr}) {
        let p, i, len = itr.len, istrf = !!(x || y || w), cw, sw;
        if (istrf) this.setTrf(ctx,[cw=(w?Math.cos(w):1),sw=(w?Math.sin(w):0),-sw,cw,x,y]);
        ctx.beginPath();
        ctx.moveTo((p=itr(0)).x,p.y);
        for (i=1; i < len; i++) {
            p = itr(i);
            if (split && i%2 === 0) ctx.moveTo(p.x,p.y);  
            else                    ctx.lineTo(p.x,p.y);
        }
        if (closed && !split)  // closed then ..
            ctx.closePath();
        this.drw(ctx,arguments[1]);
        if (istrf) this.resetTrf(ctx);
        return i-1;  // number of points ..
    },
    spline: function(ctx,{bez,pts,x,y,w,closed}) {
        let i, len = bez.len, istrf = x || y || w, cw, sw;
        if (istrf) this.setTrf(ctx,[cw=(w?Math.cos(w):1),sw=(w?Math.sin(w):0),-sw,cw,x,y]);
        ctx.beginPath();
        ctx.moveTo(bez[0].x,bez[0].y);
        for (i=0; i < len-1; i++)
            ctx.bezierCurveTo(bez[i].x1,bez[i].y1,bez[i].x2,bez[i].y2,bez[i+1].x,bez[i+1].y);
        if (closed)
            ctx.closePath();
        this.drw(ctx,arguments[1]);
        if (istrf) this.resetTrf(ctx);
    },
    txt: function(ctx,{str,x,y,w}) {
        let tmp = this.setStyle(ctx,arguments[1]), 
            sw = w ? Math.sin(w) : 0, 
            cw = w ? Math.cos(w) : 1;
        this.setTrf(ctx,this.state.isCartesian ? [cw,sw,sw,-cw,x,y]
                                               : [cw,sw,-sw,cw,x,y]);
        if (ctx.fillStyle === 'rgba(0, 0, 0, 0)') {
            ctx.fillStyle = ctx.strokeStyle;
            tmp.fs = 'transparent';
        }
        ctx.fillText(str,0,0);
        this.resetTrf(ctx);
        this.resetStyle(ctx,tmp);
    },
    use: function(ctx,{grp,x,y,w,scl}) {
        let ssw, scw;
        w = w || 0;
        scl = scl || 1;
        ssw = w ? Math.sin(w)*scl : 0;
        scw = w ? Math.cos(w)*scl : scl;
        this.pushStyle(ctx,arguments[1]);
        this.pushTrf(ctx,[scw,ssw,-ssw,scw,x||0,y||0]);
        g2.prototype.apply(this,ctx,grp);
        this.popTrf(ctx);
        this.popStyle(ctx);
    },
    beg: function(ctx,{x,y,w,scl,matrix}) {
        let trf = matrix;
        if (!matrix) {
            let ssw, scw;
            w = w || 0;
            scl = scl || 1;
            ssw = w ? Math.sin(w)*scl : 0;
            scw = w ? Math.cos(w)*scl : scl; 
            trf = [scw,ssw,-ssw,scw,x,y];
        }
        this.pushStyle(ctx,arguments[1]);
        this.pushTrf(ctx,trf);
    },
    end: function(ctx,{x,y,w,scl,matrix}) {
        this.popTrf(ctx);
        this.popStyle(ctx);
    },
    p: function(ctx) { ctx.beginPath(); },
    z: function(ctx) { ctx.closePath(); },
    m: function(ctx,{x,y}) { ctx.moveTo(x,y); },
    l: function(ctx,{x,y}) { ctx.lineTo(x,y); },
    q: function(ctx,{x,y,x1,y1}) { ctx.quadraticCurveTo(x1,y1,x,y); },
    c: function(ctx,{x,y,x1,y1,x2,y2}) { ctx.bezierCurveTo(x1,y1,x2,y2,x,y); },
    a: function(ctx,{x,y,x0,y0,r,w,dw,wend,ccw}) { ctx.arc(x0,y0,r,w,wend,ccw); },
    stroke: function(ctx,{d}={}) {
        let tmp = this.setStyle(ctx,arguments[1]);
        d ? ctx.stroke(d) : ctx.stroke();
        this.resetStyle(ctx,tmp);
    },
    fill: function(ctx,{d}={}) {
        let tmp = this.setStyle(ctx,arguments[1]);
        d ? ctx.fill(d) : ctx.fill();
        this.resetStyle(ctx,tmp);
    },
    drw: function(ctx,{d}={}) {
        let tmp = this.setStyle(ctx,arguments[1]);
        d ? ctx.fill(d) : ctx.fill();
        if (ctx.shadowColor !== 'rgba(0, 0, 0, 0)' && ctx.fillStyle !== 'rgba(0, 0, 0, 0)') {
           let shc = ctx.shadowColor;        // avoid stroke shadow when filled ...
           ctx.shadowColor = 'rgba(0, 0, 0, 0)';
           d ? ctx.stroke(d) : ctx.stroke();
           ctx.shadowColor = shc;
        }
        else
           d ? ctx.stroke(d) : ctx.stroke();
        this.resetStyle(ctx,tmp);
    },

    arrow: function(ctx,x1,y1,x2,y2,style) {
        let tmp = this.setStyle(ctx,style), len, w, cw, sw;
        x1 = g2.eval(x1);
        y1 = g2.eval(y1);
        x2 = g2.eval(x2);
        y2 = g2.eval(y2);
        len = Math.hypot(x2-x1,y2-y1);
        w = Math.atan2(y2-y1,x2-x1);
        cw = w ? Math.cos(w) : 1; 
        sw = w ? Math.sin(w) : 0;
        ctx.beginPath()
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.stroke();
        this.setTrf(ctx,[cw,-sw,sw,cw,x2,y2]);
        ctx.beginPath()
          ctx.moveTo(0,0)
          ctx.lineTo(-9,-2)
          ctx.lineTo(-9, 2)
        ctx.closePath()
        ctx.fill();
        ctx.stroke();
        this.resetTrf(ctx);
        this.resetStyle(ctx,tmp);
    },
    nod: function(ctx,x,y,style) {
        let tmp = this.setStyle(ctx,Object.assign({ls:'#333',fs:'#dedede'},style));
        x = g2.eval(x);
        y = g2.eval(y);
        ctx.beginPath()
        ctx.arc(x,y,4,0,2*Math.PI,true);
        ctx.fill();
        ctx.stroke();
        this.resetStyle(ctx,tmp);
    },
    nodfix: function(ctx,x,y,w,style) {
        let tmp = this.setStyle(ctx,Object.assign({ls:'#333',fs:'#aeaeae'},style)),cw,sw;
        x = g2.eval(x);
        y = g2.eval(y);
        w = g2.eval(w)||0;
        cw = w ? Math.cos(w) : 1; 
        sw = w ? Math.sin(w) : 0;
        this.setTrf(ctx,[cw,-sw,sw,cw,x,y]);
        ctx.beginPath()
          ctx.moveTo(-8,-12)
          ctx.lineTo(0,0)
          ctx.lineTo(+8,-12)
        ctx.fill();
        ctx.stroke();
        ctx.beginPath()
          ctx.arc(0,0,4,0,2*Math.PI,true);
        this.state.setStyle(ctx,{fs:'#dedede'});
        ctx.fill();
        ctx.stroke();
        this.resetTrf(ctx);
        this.resetStyle(ctx,tmp);
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
        font: (ctx,q) => { ctx.font=q||'14px serif'; },
        thal: (ctx,q) => { ctx.textAlign=q; },
        tval: (ctx,q) => { ctx.textBaseline=q; }
    },
    initStyle: function(ctx) {
        for (key in this.cur)
            if (this.get[key] && this.get[key](ctx) !== this.cur[key])
                this.set[key](ctx, g2.eval(this.cur[key]));
    },
    setStyle: function(ctx,style) {  // short circuit style setting 
        let q, prv = {};
        for (key in style) {
            if (this.get[key]) {  // style keys only ...
                if (typeof style[key] === 'string' && style[key][0] === '@') {
                    let ref = style[key].substr(1);
//                     console.log(style[key] + " detected!")
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](ctx);
//                        console.log(style[key] + " changed!")
                }
                if ((q=this.get[key](ctx)) !== style[key]) {
                    prv[key] = q;
                    this.set[key](ctx, g2.eval(style[key]));
                }
            }
        }
        return prv;
    },
    resetStyle: function(ctx,style) {   // short circuit style reset
        for (key in style)
            this.set[key](ctx, style[key]);
    },
    pushStyle: function(ctx,style) {
        let cur = {};  // hold changed properties ...
        for (key in style) 
            if (this.get[key]) {  // style keys only ...
                if (typeof style[key] === 'string' && style[key][0] === '@') {
                    let ref = style[key].substr(1);
                    style[key] = g2.symbol[ref] || this.get[ref] && this.get[ref](ctx);
                }
                if (this.cur[key] !== style[key])
                    this.set[key](ctx, (cur[key]=style[key]));
            }
        this.stack.push(this.cur = Object.assign({},this.cur,cur));
    },
    popStyle: function(ctx) {
        let cur = this.stack.pop();
//console.log('cur='+JSON.stringify(cur)+"["+this.get['ld'](ctx)+"]")
        this.cur = this.stack[this.stack.length-1];
//console.log('this.cur='+JSON.stringify(this.cur)+"["+this.get['ld'](ctx)+"]")
        for (key in this.cur)
            if (this.get[key] && this.cur[key] !== cur[key])
               this.set[key](ctx, this.cur[key]);
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
    initTrf: function(ctx) {
        ctx.setTransform(...this.matrix[0]);
    },
    setTrf: function(ctx,t) {
        ctx.setTransform(...this.concatTrf(this.matrix[this.matrix.length-1],t));
    },
    resetTrf: function(ctx) {
        ctx.setTransform(...this.matrix[this.matrix.length-1]);
    },
    pushTrf: function(ctx,t) {
        let q_t = this.concatTrf(this.matrix[this.matrix.length-1],t);
        this.matrix.push(q_t);
        ctx.setTransform(...q_t);
    },
    popTrf: function(ctx) {
        this.matrix.pop();
        ctx.setTransform(...this.matrix[this.matrix.length-1]);
    },
    get isCartesian() {  // det of mat2x2 < 0 !
        let m = this.matrix[this.matrix.length-1];
        return m[0]*m[3] - m[1]*m[2] < 0;
    },
    get homoTrf() {
        let m = this.matrix[this.matrix.length-1];
        return {x:m[4],y:m[5],scl:Math.hypot(m[0],m[1]),cartesian:m[0]*m[3] - m[1]*m[2] < 0};
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

g2.picker = function() {
    if (this instanceof g2.picker) {
        this.hitlist = [];
        this.matrix = [[1,0,0,1,0,0]];  // [s*cw,s*sw,-s*sw,s*cw,x,y] ... SVG matrix structure
        this.solid = [false];           // solid stack ... based on fill 'fs' attributes
        return this;
    }
    return g2.picker.apply(Object.create(g2.picker.prototype),arguments);
};
g2.picker.prototype = {
    init: function(ctx) {
        this.hitlist.length = 0;  // not always clear the hitlist array !?
        this.matrix.length = 1;
        return true; 
    },
    // state management ...
    at: function(p) { this.p = p; return this; },
    // current transform (no cartesian, zoom, pan)
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
    inv: function() {
        let t = this.matrix[this.matrix.length-1], det = t[0]*t[3] - t[1]*t[2];
        return [ t[3]/det, -t[1]/det, -t[2]/det, t[0]/det, 
                 (t[2]*t[5]-t[4]*t[3])/det, (t[4]*t[2]-t[0]*t[5])/det];
    },
    pushTrf: function(t) {  // mat = [a,d,b,e,c,f]
        this.matrix.push(this.concatTrf(this.matrix[this.matrix.length-1],t));
    },
    popTrf: function() { this.matrix.pop(); },
    trfPnt: function(p) {
        if (this.matrix.length > 1) {
            let t = this.matrix[this.matrix.length-1];
            return { x: t[0]*p.x + t[2]*p.y + t[4],
                    y: t[1]*p.x + t[3]*p.y + t[5] };
        }
        return p;
    },
    invTrfPnt: function(p) {
        if (this.matrix.length > 1) {
            let t = this.matrix[this.matrix.length-1], det = t[0]*t[3] - t[1]*t[2];
            return { x: ( t[3]*p.x - t[2]*p.y + t[2]*t[5]-t[4]*t[3])/det,
                     y: (-t[1]*p.x + t[0]*p.y + t[4]*t[2]-t[0]*t[5])/det };
        }
        return p;
    },
    out: function(c,a) { /*console.log('hittest: '+c+"=>"+a);*/ },
    // command overloading
    arc: (ctx,args) => ctx.out("arc", args),
    beg: (ctx,args) => ctx.out("beg", args),
    c: (ctx,args) => ctx.out("c", args),
    cartesian: (ctx) => ctx.out("cartesian"),
    cir: function(ctx,a) {
        let dx = this.p.x - a.x, dy = this.p.y - a.y, eps = 3;
        if (dx*dx + dy*dy <= a.r*a.r + eps*eps) {
            a.sh=[0,0,10,"black"];
        }
    },
    clr: (ctx) => ctx.out("clr"),
    drw: (ctx,args) => ctx.out("drw", args),
    ell: (ctx,args) => ctx.out("ell", args),
    end: (ctx) => ctx.out("end"),
    fill: (ctx,args) => ctx.out("fill", args),
    grid: (ctx,args) => ctx.out("grid", args),
    l: (ctx,args) => ctx.out("l", args),
    lin: function(ctx,a) {
        let dx = a.x2 - a.x1, dy = a.y2 - a.y1, dx2 = this.p.x - a.x1, dy2 = this.p.y - a.y2,
            dot = dx*dx2 + dy*dy2, perp = dx*dy2 - dy*dx2, len = Math.hypot(dx,dy), eps = 3;
        if (-eps < perp && perp < eps && -eps < dot && dot < len*len) {
            console.log('perp/dot='+perp+'/'+dot) 
            //            this.hitlist = 
            a.sh=[0,0,10,"black"];
        }
    },
    m: (ctx,args) => ctx.out("m", args),
    pan: (ctx,args) => ctx.out("pan", args),
    ply: (ctx,args) => { ctx.out("ply", args) },
    use: function(ctx,args) {
        if (args.grp instanceof g2) {
            g2.prototype.apply(this, ctx, args.grp);
        }
    }
};

g2.io = function() {
   if (this instanceof g2.io) {
      this.model = {main:[]};
      this.curgrp = this.model.main;
      this.grpidx = 1;
      return this;
   }
   return g2.io.apply(Object.create(g2.io.prototype));
};
g2.io.parse = function(str) {
    let model = JSON.parse(str);
    return g2.io.parseGrp(model,'main');
}
g2.io.parseGrp = function(model, id) {
    let g;
    if (id in model) {
        g = g2({id});
        for (let cmd of model[id]) {
            if (cmd.c === 'use')
                cmd.a.grp = g2.io.parseGrp(model, cmd.a.grp);
            g[cmd.c](cmd.a);
        }
        return g;
    }
    else if (id in g2.symbol)
        return g2.symbol[id];
    return null;
}

g2.io.prototype = {
    init: function(ctx,grp) { 
        console.log('io init');
        return true; 
    },
    out: function(c,a) { this.curgrp.push(a?{c:c,a:a}:{c:c}); },
    stringify: function() { return JSON.stringify(this.model); },
    toString: function() { return JSON.stringify(this.model); },

    arc: (ctx,args) => ctx.out("arc", args),
    beg: (ctx,args) => ctx.out("beg", args),
    c: (ctx,args) => ctx.out("c", args),
    cartesian: (ctx) => ctx.out("cartesian"),
    cir: (ctx,args) => ctx.out("cir", args),
    clr: (ctx) => ctx.out("clr"),
    drw: (ctx,args) => ctx.out("drw", args),
    ell: (ctx,args) => ctx.out("ell", args),
    end: (ctx) => ctx.out("end"),
    fill: (ctx,args) => ctx.out("fill", args),
    grid: (ctx,args) => ctx.out("grid", args),
    l: (ctx,args) => ctx.out("l", args),
    lin: (ctx,args) => ctx.out("lin", args),
    m: (ctx,args) => ctx.out("m", args),
    pan: (ctx,args) => ctx.out("pan", args),
    p: (ctx) => ctx.out("p"),
    ply: (ctx,args) => { delete args.itr; ctx.out("ply", args) },
    q: (ctx,args) => ctx.out("q", args),
    rec: (ctx,args) => ctx.out("rec", args),
    spline: (ctx,args) => { delete args.itr; delete args.b; ctx.out("spline", args) },
    stroke: (ctx,args) => ctx.out("stroke", args),
    txt: (ctx,args) => ctx.out("txt", args),
    view: (ctx,args) => ctx.out("view", args),
    zoom: (ctx,args) => ctx.out("zoom", args),
    use: function(ctx,args) {
        if (args.grp instanceof g2) {
            let grp = args.grp;
            if (!grp.id) grp.id = `$grp${this.grpidx++}`;
            if (!(grp.id in this.model)) {
                let curgrp = this.curgrp;
                this.curgrp = this.model[grp.id] = [];
                for (command of grp.commands)
                    ctx.out(command.c,command.a);
                this.curgrp = curgrp;
            }
            args.grp = grp.id;
        }
        ctx.out("use", args);
    }
}

g2.squiggle = function() {
   if (this instanceof g2.squiggle) {
       this.refctx = arguments[0];
       return this;
   }
   return g2.squiggle.apply(Object.create(g2.squiggle.prototype),arguments);
}

g2.squiggle.prototype = {
    init: function(ctx,grp) {
        this.refhdl = g2.handler(this.refctx);
        if (this.refhdl) this.refhdl.init(this.refctx,grp);
        return true; 
    },
    out: function(c,a) { a ? this.refhdl[c](this.refctx,a) : this.refhdl[c](this.refctx); },

    a: function(ctx,{x,y,x0,y0,r,w,dw,wend,ccw}) { g2.squiggle.arc(this.pts,{x:x0,y:y0,r,w,dw}) },
    arc: function(ctx,{x,y,r,w,dw}) {
        let pts = [];
        g2.squiggle.arc(pts,arguments[1]);
        ctx.out("ply",Object.assign(arguments[1],{pts,itr:g2.pntIterator["{x,y}"](pts),closed:dw>=2*Math.PI}));
    },
    beg: (ctx,args) => ctx.out("beg", args),
    c: (ctx,args) => ctx.out("c", args),
    c: function(ctx,{x,y,x1,y1,x2,y2}) { g2.squiggle.cubicTo(this.pts,arguments[1]) },
    cartesian: (ctx) => ctx.out("cartesian"),
    cir: function(ctx,{x,y,r}) {
        let pts = [];
        g2.squiggle.arc(pts,Object.assign(arguments[1],{w:0,dw:2*Math.PI}));
        ctx.out("ply",Object.assign(arguments[1],{pts,itr:g2.pntIterator["{x,y}"](pts),closed:true}));
    },
    clr: (ctx) => ctx.out("clr"),
    drw: function(ctx,{}) { ctx.out("ply",Object.assign(arguments[1],{pts:this.pts,itr:g2.pntIterator["{x,y}"](this.pts)})); },
    ell: (ctx,args) => ctx.out("ell", args),
    end: (ctx) => ctx.out("end"),
    fill: function(ctx,{}) { ctx.out("ply",Object.assign(arguments[1],{pts:this.pts,itr:g2.pntIterator["{x,y}"](this.pts)})); },
    grid: (ctx,args) => ctx.out("grid", args),
    l: function(ctx,{x,y}) { g2.squiggle.lineTo(this.pts,arguments[1]) },
    lin: function(ctx,{x1,y1,x2,y2}) {
        let pts = [];
        g2.squiggle.moveTo(pts,{x:x1,y:y1})
                   .lineTo(pts,{x:x2,y:y2});
        ctx.out("ply",Object.assign(arguments[1],{pts,itr:g2.pntIterator["{x,y}"](pts)}));
    },
    m: function(ctx,{x,y}) { g2.squiggle.moveTo(this.pts,arguments[1]) },
    pan: (ctx,args) => ctx.out("pan", args),
    p: function(ctx) { this.pts = []; ctx.out("p"); },
    ply: function(ctx,{pts,closed,itr}) {
        let sqpts = [];
        g2.squiggle.moveTo(sqpts,itr(0));
        for (let i=1, n=pts.length; i<n; i++)
            g2.squiggle.lineTo(sqpts,itr(i));
        if (closed) g2.squiggle.lineTo(sqpts,itr(0));
        ctx.out("ply",Object.assign(arguments[1],{sqpts,itr:g2.pntIterator["{x,y}"](sqpts)}));
    },
    q: function(ctx,{x,y,x1,y1}) { g2.squiggle.quadraticTo(this.pts,arguments[1]) },
    rec: function(ctx,{x,y,b,h}) {
        let pts = [];
        g2.squiggle.moveTo(pts,{x,y})
                   .lineTo(pts,{x:x+b,y})
                   .lineTo(pts,{x:x+b,y:y+h})
                   .lineTo(pts,{x,y:y+h})
                   .lineTo(pts,{x,y});
        ctx.out("ply",Object.assign(arguments[1],{pts,itr:g2.pntIterator["{x,y}"](pts)}));
    },
    spline: (ctx,args) => ctx.out("spline", args),
    stroke: function(ctx,{}) { ctx.out("ply",Object.assign(arguments[1],{pts:this.pts,itr:g2.pntIterator["{x,y}"](this.pts)})); },
    txt: (ctx,args) => ctx.out("txt", args),
    view: (ctx,args) => ctx.out("view", args),
    z: function(ctx) { g2.squiggle.lineTo(this.pts,this.pts[0]) },
    zoom: (ctx,args) => ctx.out("zoom", args),
}

// statics
g2.squiggle.moveTo = function(pts,p0) {
    pts.push(p0);
    return this;
}
g2.squiggle.lineTo = function(pts,{x,y}) {
    let p0 = pts[pts.length-1], x0 = p0.x, y0 = p0.y,
        dx = x - x0, dy = y - y0, len = Math.hypot(dx,dy),
        du = len < 40  ? 1/2 : 1 / Math.floor(len/20),
        deviation = (len < 20 ? 1/20*len : 1)*3,
        pt = (u) => {
            let t = 3*u*u - 2*u*u*u,
                sqig =  deviation*(Math.random() - 0.5);
            return { x:(1-t)*x0 + t*x - sqig*(len && dy/len), 
                     y:(1-t)*y0 + t*y + sqig*(len && dx/len) }; 
        };

    for (let u=du; u <= 1; u += du)
        pts.push(pt(u));

    return this;
}
g2.squiggle.arc = function(pts,{x,y,r,w,dw}) {
//console.log('arc='+JSON.stringify(arguments[1]));
    let len = Math.abs(r*dw),
        du = len < 30 ? 1 / Math.max(3,Math.floor(Math.abs(dw)*2+0.5))
                      : 1 / 20,
        deviation = (len < 30 ? 1/120*len
                   : len < 100 ? 1/4
                   : len < 200 ? 1/2
                   : 1)*3,
        pt = (u) => {
            let t = dw < Math.PI ? 3*u*u - 2*u*u*u : u,
                sqig = deviation*(Math.random() - 0.5),
                sw = Math.sin(w+t*dw), cw = Math.cos(w+t*dw);
            return { x: x + (r+sqig)*cw,
                     y: y + (r+sqig)*sw };
        };

    for (let u = pts.length?du:0; u <= 1; u += du)
        pts.push(pt(u));

    return this;
}
g2.squiggle.quadraticTo = function(pts,{x1,y1,x,y}) {
    let p0 = pts[pts.length-1], x0 = p0.x, y0 = p0.y,
        ax = x1 - x0,      ay = y1 - y0,
        bx = x  - x1 - ax, by = y  - y1 - ay,
        k = 5/12,
        // See also: http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/ for possible improvement.
        len = Math.hypot(x1-x0,y1-y0)*k + Math.hypot(x-x1,y-y1)*k + Math.hypot(x-x0,y-y0)*(1-k),
        du = len < 60  ? 1/3 : 1 / Math.floor(len/15),
        deviation = (len <  30 ? 1/60*len
                   : len < 100 ? 1/2
                   : 1)*3,
        pt = (u) => {
            let t = (x1-x0)*(x-x1) + (y1-y0)*(y-y1) < 0 ? u : 3*u*u - 2*u*u*u,
                xd = 2*(ax + bx*t), yd = 2*(ay + by*t), dd = Math.hypot(xd,yd),
                sqig = deviation*(Math.random() - 0.5);
            return { x: x0 + 2*ax*t + bx*t*t - sqig*yd/dd,
                     y: y0 + 2*ay*t + by*t*t + sqig*xd/dd,u };
        };

    for (let u=du; u <= 1; u += du)
        pts.push(pt(u));

    return this;
}
g2.squiggle.cubicTo = function(pts,{x1,y1,x2,y2,x,y}) {
    let p0 = pts[pts.length-1], x0 = p0.x, y0 = p0.y,
        x01 = x1-x0,       y01 = y1-y0,
        x12 = x2-x1,       y12 = y2-y1,
        x32 = x2-x,        y32 = y2-y,
        x03 = x-x0,        y03 = y-y0,
        ax = x01,          ay = y01,
        bx = x12-ax,       by = y12-ay,
        cx = -x32-2*bx-ax, cy = -y32-2*by-ay,
        k = 1/4,
        len = Math.hypot(x01,y01)*k +
              Math.hypot(x01*(1-k) + x12/2,y01*(1-k) + y12/2)*k +
              Math.hypot(x03+(x32-x01)*(2-k)*k-x12*k,y03+(y32-y01)*(2-k)*k-y12*k) +
              Math.hypot(x32*(1-k) - x12/2,y32*(1-k) - y12/2)*k +
              Math.hypot(x32,y32)*k,
        du = len < 60  ? 1/4 : 1 / Math.floor(len/10),
        deviation = (len <  30 ? 1/120*len
                   : len < 100 ? 1/4
                   : len < 200 ? 1/2
                   : 1)*3,
        pt = (u) => {
            let t = 3*u*u - 2*u*u*u,
                xd = 3*(ax + 2*bx*t + cx*t*t), yd = 3*(ay + 2*by*t + cy*t*t),
                dd = Math.hypot(xd,yd),
                sqig = deviation*(Math.random() - 0.5);
            return { x: x0 + 3*ax*t + 3*bx*t*t + cx*t*t*t - sqig*yd/dd,
                     y: y0 + 3*ay*t + 3*by*t*t + cy*t*t*t + sqig*xd/dd,u };
        };

    for (let u=du; u <= 1; u += du)
        pts.push(pt(u));

    return this;
}

// utils
g2.eval = (q) => q instanceof Function ? q() : q
/*
g2.context = function(ctx) { return g2.context.handler && g2.context.handler(ctx); }
g2.context.addHandler = function(hdl) 
{ 
    let h = g2.context.handler; 
    g2.context.handler = h ? (ctx) => h(ctx) || hdl(ctx) : hdl; 
}
*/
// fn argument must be a function with timestamp 't' as single argument
// returning true to continue or false to stop RAF.
function render(fn) {
    function animate(t) {
        if (fn(t))
            requestAnimationFrame(animate);
    }
    animate(performance.now());
} 

// use it with node.js ... ?
if (typeof module !== 'undefined') module.exports = g2;
