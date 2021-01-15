
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
