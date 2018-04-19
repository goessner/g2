/**
 * g2 element prototypes (c) 2015-18 Stefan Goessner
 * @file extensions to `g2`.
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

// g2 symbols (values & geometries) predefined
g2.symbol.nodcolor = "#333";
g2.symbol.nodfill  = "#dedede";
g2.symbol.nodfill2 = "#aeaeae";
g2.symbol.linkcolor = "#666";
g2.symbol.linkfill = "rgba(200,200,200,0.5)";
g2.symbol.dimcolor = "darkslategray";
g2.symbol.solid = [];
g2.symbol.dash = [15,10];
g2.symbol.dot = [4,4];
g2.symbol.tick = g2().p().m({x:0,y:-2}).l({x:0,y:2}).stroke({lc:"round",lwnosc:true});
g2.symbol.dashdot = [25,6.5,2,6.5];
g2.symbol.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234

g2.symbol.dot = g2().cir({x:0,y:0,r:1.5,ls:"transparent"});
g2.symbol.sqr = g2().rec({x:-1.5,y:-1.5,b:3,h:3,ls:"transparent"});
g2.symbol.pol = g2().cir({x:0,y:0,r:6,fs:"@nodfill"})
                    .cir({x:0,y:0,r:2.5,fs:"@ls",ls:"transparent"});
g2.symbol.gnd = g2().cir({x:0,y:0,r:6,ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                    .p().m({x:0,y:6}).a({dw:Math.PI/2,x:-6,y:0}).l({x:6,y:0}).a({dw:-Math.PI/2,x:0,y:-6}).z().fill({fs:"@nodcolor"});
g2.symbol.nod = g2().cir({x:0,y:0,r:4,ls:"@nodcolor",fs:"@nodfill",lwnosc:true});
g2.symbol.dblnod = g2().cir({x:0,y:0,r:6,ls:"@nodcolor",fs:"@nodfill"}).cir({x:0,y:0,r:3,ls:"@nodcolor",fs:"@nodfill2",lwnosc:true});
g2.symbol.nodfix = g2().p()
                         .m({x:-8,y:-12})
                         .l({x:0,y:0})
                         .l({x:8,y:-12})
                       .drw({ls:"@nodcolor",fs:"@nodfill2"})
                       .cir({x:0,y:0,r:4,ls:"@nodcolor",fs:"@nodfill"});
g2.symbol.dblnodfix = g2().p()
                            .m({x:-8,y:-12})
                            .l({x:0,y:0})
                            .l({x:8,y:-12})
                          .drw({ls:"@nodcolor",fs:"@nodfill2"})
                          .cir({x:0,y:0,r:6,ls:"@nodcolor",fs:"@nodfill"})
                          .cir({x:0,y:0,r:3,ls:"@nodcolor",fs:"@nodfill2"});
g2.symbol.nodflt = g2().p()
                         .m({x:-8,y:-12})
                         .l({x:0,y:0})
                         .l({x:8,y:-12})
                       .drw({ls:"@nodcolor",fs:"@nodfill2"})
                       .cir({x:0,y:0,r:4,ls:"@nodcolor",fs:"@nodfill"})
                       .lin({x1:-9,y1:-19,x2:9,y2:-19,ls:"@nodfill2",lw:5,lwnosc:false})
                       .lin({x1:-9,y1:-15.5,x2:9,y2:-15.5,ls:"@nodcolor",lw:2,lwnosc:false});
g2.symbol.origin = function() {
   let z = 3.5;
   return g2().beg({lc:"round",lj:"round",fs:"@ls"})
              .p().m({x:6*z,y:0}).l({x:0,y:0}).l({x:0,y:6*z}).stroke()
              .p().m({x:10*z,y:0}).l({x:6*z,y:3/4*z}).a({dw:-Math.PI/3,x:6*z,y:-3/4*z}).z()
              .m({x:0,y:10*z}).l({x:3/4*z,y:6*z}).a({dw: Math.PI/3,x:-3/4*z,y:6*z}).z().drw()
              .cir({x:0,y:0,r:2.5})
              .end();
}();

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
       return { x: this.x1 + dx*t,
                y: this.y1 + dy*t,
                dx: len ? dx/len : 1,
                dy: len ? dy/len : 0
       };
    },
    hitContour({x,y,eps}) { return g2.isPntOnLin({x,y},{x:this.x1,y:this.y1},{x:this.x2,y:this.y2},eps) },
    drag({dx,dy}) {
        this.x1 += dx; this.x2 += dx;
        this.y1 += dy; this.y2 += dy;
    },
    handles(grp) {
        grp.handle({x:this.x1,y:this.y1,_update:({dx,dy})=>{this.x1+=dx;this.y1+=dy}})
           .handle({x:this.x2,y:this.y2,_update:({dx,dy})=>{this.x2+=dx;this.y2+=dy}})
    }
};

g2.prototype.rec.prototype = {
    _dir: { c:[0,1],e:[1,0],ne:[Math.SQRT2/2,Math.SQRT2/2],n:[0,1],nw:[-Math.SQRT2/2,Math.SQRT2/2],
            w:[-1,0],sw:[-Math.SQRT2/2,-Math.SQRT2/2],s:[0,-1],se:[Math.SQRT2/2,-Math.SQRT2/2] },
    get len() { return 2*(this.b+this.h); },
    pointAt(loc) {
       var q = this._dir[loc || "c"] || this._dir['c'], nx = q[0], ny = q[1];
       return { x: this.x + (1 + nx)*this.b/2,
                y: this.y + (1 + ny)*this.h/2,
                dx: -ny,
                dy:  nx
       };
    }
};

g2.prototype.cir.prototype = {
    w: 0,    // default start angle (used for dash-dot orgin and editing)
    _dir: { c:[0,0],e:[1,0],ne:[Math.SQRT2/2,Math.SQRT2/2],n:[0,1],nw:[-Math.SQRT2/2,Math.SQRT2/2],
            w:[-1,0],sw:[-Math.SQRT2/2,-Math.SQRT2/2],s:[0,-1],se:[Math.SQRT2/2,-Math.SQRT2/2] },
    get isSolid() { return this.fs && this.fs !== 'transparent' },
    get len() { return 2*Math.PI*this.r; },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
    pointAt(loc) {
       var q = (loc+0 === loc) ? [Math.cos(loc*2*Math.PI),Math.sin(loc*2*Math.PI)]
                               : (this._dir[loc || "c"] || [0,0]),
           nx = q[0], ny = q[1];
       return { x: this.x + nx*this.r,
                y: this.y + ny*this.r,
                dx: -ny,
                dy:  nx };
    },
    hitContour({x,y,eps}) { return g2.isPntOnCir({x,y},this,eps) },
    hitInner({x,y,eps}) {return g2.isPntInCir({x,y},this,eps) },
    drag({dx,dy}) { this.x += dx; this.y += dy },
    handles(grp) {
        const p0 = {
                x:this.x, y:this.y,
                _update:({dx,dy})=>{this.x+=dx;this.y+=dy;p1.x+=dx;p1.y+=dy;}
              },
              p1 = {
                x:this.x+this.r*Math.cos(this.w||0),
                y:this.y+this.r*Math.sin(this.w||0),
                _info:()=>`r:${this.r.toFixed(1)}<br>w:${(this.w/Math.PI*180).toFixed(1)}°`,
                _update:({x,y})=>{
                            this.r = Math.hypot(y-this.y,x-this.x);
                            this.w = Math.atan2(y-this.y,x-this.x);}
              };
        grp.lin({x1:()=>this.x,y1:()=>this.y,x2:()=>p1.x,y2:()=>p1.y,ld:[4,3],ls:'#666'})
           .handle(p0)
           .handle(p1)
    }
};

g2.prototype.arc.prototype = {
    get len() { return Math.abs(this.r*this.dw); },
    get angle() { return this.dw/Math.PI*180; },
    pointAt(loc) {
       var t = loc==="beg" ? 0
             : loc==="end" ? 1
             : loc==="mid" ? 0.5
             : loc+0 === loc ? loc
             : 0.5,
           ang = this.w+t*this.dw, cang = Math.cos(ang), sang = Math.sin(ang), r = loc === "c" ? 0 : this.r;
       return { x: this.x + r*cang,
                y: this.y + r*sang,
                dx: -sang,
                dy:  cang
       };
    },
    isSolid: false,
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
    hitContour({x,y,eps}) { return g2.isPntOnArc({x,y},this,eps) },
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
                            this.dw = lam*dw;}
            };
        if (this.w === undefined) this.w = 0;
        grp.lin({x1:()=>this.x,y1:()=>this.y,x2:()=>p1.x,y2:()=>p1.y,ld:[4,3],ls:'#666'})
           .lin({x1:()=>this.x,y1:()=>this.y,x2:()=>p2.x,y2:()=>p2.y,ld:[4,3],ls:'#666'})
           .handle(p0)
           .handle(p1)
           .handle(p2)
    }
};

g2.prototype.ply.prototype = {
    get isSolid() { return this.closed && this.fs && this.fs !== 'transparent'; },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
    x: 0, y: 0,
    hitContour({x,y,eps}) { let p={x:x-this.x,y:y-this.y}; return g2.isPntOnPly(p,this,eps) }, // translational only .. at current .. !
    hitInner({x,y,eps}) { let p={x:x-this.x,y:y-this.y}; return g2.isPntInPly(p,this,eps) }, // translational only .. at current .. !
    drag({dx,dy}) { this.x += dx; this.y += dy; },
    handles(grp) {
        let p, slf=this;
        for (let n = this._itr.len, i=0; i<n; i++)
            grp.handle({ x:(p=this._itr(i)).x+this.x,y:p.y+this.y,i:i,
                         _update({dx,dy}){let p=slf._itr(this.i);p.x+=dx;p.y+=dy} });
    }
}

g2.prototype.use.prototype = {
    _dir: g2.prototype.cir.prototype._dir,
    r: 5,
    pointAt: g2.prototype.cir.prototype.pointAt
};

// complex macros / add prototypes to argument objects

g2.prototype.vec = function vec({}) { return this.addCommand({c:'vec',a:arguments[0]}); }
g2.prototype.vec.prototype = g2.mixin({},g2.prototype.lin.prototype,{
    g2() {
        let {x1,y1,x2,y2,lw,sh} = this;
        let z = 2+(lw||1), dx = x2-x1, dy = y2-y1, r = Math.hypot(dx,dy),
        args = Object.assign({},{x:x1,y:y1,w:Math.atan2(dy,dx),lc:"round",lj:"round",sh},this);
        return g2().beg(args)
                     .p().m({x:0,y:0})
                     .l({x:r,y:0})
                     .stroke({fs:'transparent'})
                     .p().m({x:r,y:0})
                     .l({x:r-5*z,y:z})
                     .a({dw:-Math.PI/3,x:r-5*z,y:-z})
                     .z()
                     .drw({fs:"@ls"})
                   .end();
    }
})

g2.prototype.dim = function dim({}) { return this.addCommand({c:'dim',a:arguments[0]}); }
g2.prototype.dim.prototype = g2.mixin({},g2.prototype.lin.prototype,{
    g2() {
        let {x1,y1,x2,y2,lw,ls,sh} = this, sz = Math.round((lw||1)/2)+4,
            dx = x2-x1, dy = y2-y1, len = Math.hypot(dx,dy),
            args = Object.assign({lc:"round",lj:"round",sh},{x:x1,y:y1,w:Math.atan2(dy,dx)},this);

        return g2().beg(args)
                     .p().m({x:0,y:0}).l({x:len,y:0})
                         .m({x:0,y:sz}).l({x:0,y:-sz})
                         .m({x:len,y:sz}).l({x:len,y:-sz})
                     .stroke({fs:'transparent'})
                   .end();
   }
})

/**
 * Angular dimension
 * @method
 * @returns {object} g2
 * @param {object} [p={x:0,y:0}] Center point.
 * @param {float} r Radius
 * @param {float} [w=0] Start angle (in radian).
 * @param {float} [dw=Math.PI/2] Angular range in radian. In case of positive values it is running counterclockwise with
 *                right handed (cartesian) coordinate system.
 * @param {object} args Arguments object holding style properties. See 'g2.prototype.style' for details.
 * @param {string} [args.pos=in] Draw dimension arrows:<br>
 *                                 'in':  between ticks<br>
 *                                 'out': outside of ticks
 */
g2.prototype.adim = function adim({}) { return this.addCommand({c:'adim',a:arguments[0]}); }
g2.prototype.adim.prototype = g2.mixin({},g2.prototype.arc.prototype,{
    g2: function() {
        let {x,y,r,w,dw,lw,ls,sh} = this, sz = Math.round((lw||1)/2)+4,
            ri = r - sz, ra = r + sz,
            args = Object.assign({lc:"round",lj:"round",sh},this,{w:0,fs:'transparent'});
            c1  = Math.cos(w), s1 = Math.sin(w),
            c2  = Math.cos(w+dw), s2 = Math.sin(w+dw);
        return g2().beg(args)
                    .arc({x:0,y:0,r,w,dw})
                    .lin({x1:ri*c1,y1:ri*s1,x2:ra*c1,y2:ra*s1})
                    .lin({x1:ri*c2,y1:ri*s2,x2:ra*c2,y2:ra*s2})
                   .end()
    }
});

/**
 * Draw spline by points.
 * Implementing a centripetal Catmull-Rom spline (thus avoiding cusps and self-intersections).
 * Using iterator function for getting points from array by index.
 * It must return current point object {x,y} or object {done:true}.
 * Default iterator expects sequence of x/y-coordinates as a flat array [x,y,...],
 * array of [[x,y],...] arrays or array of [{x,y},...] objects.
 * @see https://pomax.github.io/bezierinfo
 * @see https://de.wikipedia.org/wiki/Kubisch_Hermitescher_Spline
 * [Example](https://goessner.github.io/g2-svg/test/index.html#spline)
 * @method
 * @returns {object} this
 * @param {array} p Array of points.
 * @param {bool} [closed = false] Closed spline.
 * @param {object} style Style object.
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
                p1, p2, p3, p4, d1, d2, d3, d1d2, d2d3, scl2, scl3, den2, den3, istrf = x || y || w;

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
                gbez.c({ x: p3.x, y: p3.y,
                        x1: (-d2*p1.x + scl2*p2.x + d1*p3.x)/den2,
                        y1: (-d2*p1.y + scl2*p2.y + d1*p3.y)/den2,
                        x2: (-d2*p4.x + scl3*p3.x + d3*p2.x)/den3,
                        y2: (-d2*p4.y + scl3*p3.y + d3*p2.y)/den3 });
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
 * See element for support and meaning of arguments.
 * *Please note:* any use of the `label` element requires previous setting of the `cartesian` flag, as it
 * highly depends on definition of a right handed coordinate system (which is required
 * exclusively here).
 * @method
 * @returns {object} g2
 * @param {string} str Label text
 * @param {float | string} [loc='c'] Label location depending on referenced element.<br>
 *                     'c': centered, wrt. rec, cir, arc<br>
 *                     'beg','mid', 'end', wrt. lin<br>
 *                     'n', 'ne', 'e', 'se', 's', 'sw', 'w', or 'nw': cardinal directions
 * @param {float} off  Offset distance [optional].
 */
g2.prototype.label = function label({str,loc,off,fs,font,fs2}) {
    let idx = g2.getCmdIdx(this.commands, (cmd) => { return cmd.a && 'pointAt' in cmd.a}); // find reference index of previous element adding label to ...
    if (idx) {
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
                tanlen = p.dx*p.dx + p.dy*p.dy,            // tangent length .. (0 || 1) .. !
                h = parseInt(font||g2.defaultStyle.font),  // char height
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
                label.ell({x:p.x,y:p.y,rx:n*0.8*h/2+2,ry:h/2+2,ls:fs||'black',fs:fs2||'#ffc'})
//                 .rec({x:p.x-n*0.8*h/2/Math.SQRT2,y:p.y-h/2/Math.SQRT2,b:n*0.8*h/Math.SQRT2,h:h/Math.SQRT2})
            label.txt({str, x:p.x,y:p.y,
                       thal: "center",
                       tval: "middle",
                       fs: fs||'black',
                       font })
        }
        return label;
    }
}
/*
g2.prototype.label.prototype = {
    g2() {
        let {_refelem,str,loc,off,fs,font} = this,
            p = _refelem.a.pointAt(loc),
            xoff, yoff, sz = parseInt(font||g2.defaultStyle.font), b = str.length*sz,
            offset = (off+0 === off) ? (off || 1) // amount of offset ...
                   : (loc === "c") ? 0
                   : 1;                          // use constant ..
        if (off !== "left") offset = -offset;  // 'right of' dir ... turn dir vector negative ... default
        xoff = -p.dy*offset; yoff = p.dx*offset;

        if (str[0] === "@" && (s=_refelem.a[str.substr(1)]) !== undefined)   // expect 's' as string convertable to a number ...
            str = "" + (Number.isInteger(+s) ? +s : Number(s).toFixed(Math.max(g2.symbol.labelSignificantDigits-Math.log10(s),0)))  // use at least 3 significant digits after decimal point.
                     + (str.substr(1) === "angle" ? "°" : "");
        return g2().txt({str,x:()=>p.x+xoff,y:()=>p.y+yoff,
                         thal: ()=>xoff > 0 ? "left"   : xoff < 0 ? "right"  : "center",
                         tval: ()=>yoff > 0 ? "bottom" : yoff < 0 ? "top"  : "middle",
                         fs:fs||'black',
                         font})
                   .rec({x:()=>p.x+xoff-p.dy*b,y:()=>p.y+yoff-p.dx*h,b,h:sz})
    }
}
*/
/**
 * Draw marker on line element.
 * @method
 * @returns {object} g2
 * @param {object | string} mrk  `g2` object or Marker name.
 * @param {number | string} loc
 *                    line parameter [0..1]<br>
 *                    line location ['beg','end','mid',..].
 * @param {int} [dir=0]  Direction:<br>
 *                   -1 : negative tangent direction<br>
 *                    0 : no orientation (rotation)<br>
 *                    1 : positive tangent direction
 * @example
 * g2().lin(10,10,100,10).mark("tick",0.75,1)
 *     .arc(100,100,50,3.14).mark("sqr",1);<br>
 * [Example](https://goessner.github.io/g2-mec/test/index.html#mark)
 *
 */
g2.prototype.mark = function mark({mrk,loc,dir,fs,ls}) {
    test = this.commands;
    let idx = mrk && g2.getCmdIdx(this.commands, (cmd) => { return cmd.a && 'pointAt' in cmd.a});
    if (idx) {
        let ownerArgs = this.commands[idx].a;
        for (let itr in loc) {
            p = this.commands[idx].a.pointAt(loc[itr]);
            w = dir < 0 ? Math.atan2(-p.dy,-p.dx)
            : dir > 0 ? Math.atan2( p.dy, p.dx)
            : 0;
        this.use({grp:mrk,x:p.x,y:p.y,w:w,scl:ownerArgs.lw || 1,
            ls:ownerArgs.ls || 'black', fs:ownerArgs.ls || 'black'});
        }
//        console.log('fs='+fs);
    }
    return this;
}

// Helper methods .. not chainable.
