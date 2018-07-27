/**
 * g2 element prototypes (c) 2015-18 Stefan Goessner
 * @file extensions to `g2`.
 * @author Stefan Goessner
 * @license MIT License
 */
"use strict"

/**
 * Additional methods for g2.
 * @typedef {g2}
 * @param {object} [opts] Custom options object. It is simply copied into the 'g2' instance, but not used from the g2 kernel.
 * @returns {g2}
 */
var g2 = g2 || { prototype:{} };  // for jsdoc only ...

// g2 symbols (values & geometries) predefined
g2.symbol.nodcolor = "#333";
g2.symbol.nodfill  = "#dedede";
g2.symbol.nodfill2 = "#aeaeae";
g2.symbol.linkcolor = "#666";
g2.symbol.linkfill = "rgba(225,225,225,0.75)";
g2.symbol.dimcolor = "darkslategray";
g2.symbol.solid = [];
g2.symbol.dash = [15,10];
g2.symbol.dot = [4,4];
g2.symbol.tick = g2().p().m({x:0,y:-2}).l({x:0,y:2}).stroke({lc:"round",lwnosc:true});
g2.symbol.dashdot = [25,6.5,2,6.5];
g2.symbol.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234

g2.symbol.dot = g2().cir({x:0,y:0,r:2,ls:"transparent"});
g2.symbol.sqr = g2().rec({x:-1.5,y:-1.5,b:3,h:3,ls:"transparent"});

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
    _dir: { c:[0,0],e:[1,0],ne:[1,1],n:[0,1],nw:[-1,1],
            w:[-1,0],sw:[-1,-1],s:[0,-1],se:[1,-1] },
    get len() { return 2*(this.b+this.h); },
    pointAt(loc) {
       const q = this._dir[loc || "c"] || this._dir['c'], nx = q[0], ny = q[1];
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
    get isSolid() { return this.closed && this.fs && this.fs !== 'transparent' },
    get sh() { return this.state & g2.OVER ? [0,0,5,"black"] : false },
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
        return { x: x + dx*t2,
                 y: y + dy*t2,
                 dx: len2 ? dx/len2 : 1,
                 dy: len2 ? dy/len2 : 0
        };
    },
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
    let idx = g2.getCmdIdx(this.commands, (cmd) => { return cmd.a && 'pointAt' in cmd.a}); // find reference index of previous element adding label to ...
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

/**
 * Draw marker on line element.
 * @method
 * @returns {object} g2
 * @param {object} - Marker arguments object.
 * @property {object | string} mrk - `g2` object or `name` of mark in `symbol` namespace.
 * @property {number | string} loc - line parameter [0..1]<br>
 *                                      line location ['beg','end','mid',..].
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
    let idx = g2.getCmdIdx(this.commands, (cmd) => { return cmd.a && 'pointAt' in cmd.a}); // find reference index of previous element adding mark to ...
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
        return { grp:mrk,x:p.x,y:p.y,w:w,scl:elem.lw || 1,
                 ls:ls || elem.ls || 'black',
                 fs:fs || ls || elem.ls || 'black' }
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

// Helper methods .. not chainable.
