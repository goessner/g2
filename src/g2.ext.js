
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


