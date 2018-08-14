/**
 * g2.mec (c) 2013-16 Stefan Goessner
 * @file mechanical extensions to `g2`.
 * @author Stefan Goessner
 * @license MIT License
 */
"use strict"

/**
 * Mechanical extensions.
 * (Requires cartesian coordinates)
 * @namespace
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
 * @returns {object} g2
 * @param {object} - dimension arguments object.
 * @property {number} x1 - start x coordinate.
 * @property {number} y1 - start y coordinate.
 * @property {number} x2 - end x coordinate.
 * @property {number} y2 - end y coordinate.
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
        return g2().beg({x:args.x1 - args.off*Math.sin(w),y:args.y1 + args.off*Math.cos(w),w:w})
                   .vec({
                       x1:args.inside ? 1 : -25,
                       y1:0,x2:0,y2:0,
                       fixed:args.fixed,
                       fs:args.fs,ls:args.ls,lw:args.lw})
                   .vec({
                       x1:args.inside ? 0 : len + 25,y1:0,
                       x2:args.inside ? len : len,y2:0,
                       fixed:args.fixed,
                       fs:args.fs,ls:args.ls,lw:args.lw})
                   .ins(g => {if(!args.inside)
                       {g.lin({x1:0,y1:0,x2:len,y2:0,fs:args.fs,ls:args.ls,lw:args.lw})}})
                   .end()
                   .ins(g => {if(!!args.off) {
                       g.lin({x1:args.x1,y1:args.y1,
                        x2:args.x1 - (over + args.off)*Math.sin(w),
                        y2:args.y1 + (over + args.off)*Math.cos(w),
                        lw:args.lw/2,lw:args.lw/2,ls:args.ls,fs:args.fs})
                        .lin({x1:args.x1+Math.cos(w)*len,y1:args.y1+Math.sin(w)*len,
                        x2:args.x1+Math.cos(w)*len-(over + args.off)*Math.sin(w),
                        y2:args.y1+Math.sin(w)*len+(over + args.off)*Math.cos(w),
                        lw:args.lw/2,ls:args.ls,fs:args.fs})
                   }})
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
        return g2().beg({x:args.x,y:args.y,w:args.w})
                   .arc({x:0,y:0,r:args.r,w:0,dw:args.dw,ls:args.ls,lw:args.lw})
                   .vec({x1:args.inside ? args.r-.15:args.r-3.708,
                         y1:args.inside?1:24.723,x2:args.r,y2:0,fs:args.fs,ls:args.ls,lw:args.lw,fixed:30})
                   .lin({x1:args.r-3.5,y1:0,x2:args.r+3.5,y2:0,fs:args.fs,ls:args.ls,lw:args.lw})
                   .end()
                   .beg({x:args.x,y:args.y,w:args.w+args.dw})
                   .vec({x1:args.inside ? args.r-.15:args.r-3.708,
                         y1:args.inside?-1:-24.723,x2:args.r,y2:0,fs:args.fs,ls:args.ls,lw:args.lw,fixed:30})
                   .lin({x1:args.r-3.5,y1:0,x2:args.r+3.5,y2:0,fs:args.fs,ls:args.ls,lw:args.lw})
                   .end()
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
        return g2().beg(Object.assign({}, args, {x:args.x1,y:args.y1,w:Math.atan2(dy,dx)}))
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
        return g2().beg({x:args.x,y:args.y,w:args.w,fs:args.fs})
                   .rec({x:-args.b/2,y:-args.h/2,b:args.b,h:args.h})
                   .end()
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
        const h = args.h
        const ux = (args.x2-args.x1)/len;
        const uy = (args.y2-args.y1)/len;
        return g2().p()
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
        return g2().p()
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
        return g2().ply(Object.assign({closed:true,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'},this))
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
        return g2().ply(Object.assign({closed:false,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'},this))
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
        return g2().lin({x1:args.x1,y1:args.y1,x2:args.x2,y2:args.y2,ls:'@nodcolor',lw:7,lc:'round'})
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
        return g2().cir({x:args.x,y:args.y,r:args.r,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
                   .cir({x:args.x,y:args.y,r:args.r-5,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
                   .cir({x:args.x,y:args.y,r:args.r-6,ls:'#8e8e8e',fs:'transparent',lw:2})
                   .cir({x:args.x,y:args.y,r:args.r-8,ls:'#aeaeae',fs:'transparent',lw:2})
                   .cir({x:args.x,y:args.y,r:args.r-10,ls:'#cecece',fs:'transparent',lw:2})
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
        return g2().bar2({x1:args.x,y1:args.y-args.r+4,x2:args.x,y2:args.y+args.r-4})
                   .bar2({x1:args.x-args.r+4,y1:args.y,x2:args.x+args.r-4,y2:args.y})
                   .cir({x:args.x,y:args.y,r:args.r-2.5,ls:'#e6e6e6',fs:'transparent',lw:5})
                   .cir({x:args.x,y:args.y,r:args.r,ls:'@nodcolor',fs:'transparent',lw:1})
                   .cir({x:args.x,y:args.y,r:args.r-5,ls:'@nodcolor',fs:'transparent',lw:1})
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
        let p0 = pp,
            h = args.h
        let p = itr(++i);
        let dx = p.x - pp.x,
            dy = p.y - pp.y,
            len = Math.hypot(dx,dy) || 1;
        let ep = {x:dx/len,y:dy/len};
        let e0 = ep,
            eq = [p0],
            sign = args.pos === 'left' ? 1 : -1;
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
        return g2().beg({x:-0.5,y:-0.5,ls:'@linkcolor',lw:2,fs:'transparent',lc:'butt',lj:'miter'})
                   .ply(Object.assign({}, args,{pts:eq,ls:'@nodfill2',lw:2*h}))
                   .ply(Object.assign({}, args))
                   .end()

    }
});

/**
 * Polygonial line load. The first and last point define the base line onto which
 * the load is acting orthogonal.
 * @method
 * @returns {object} g2
 * @param {object} - load arguments object.
 * @property {object[] | number[][] | number[]} pts - array of points.
 * @property {number} spacing - spacing of the vectors drawn as a positive real number, interprete as<br>
 *                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>
 *                       * spacing &gt; 1: length of spacing.
 */
g2.prototype.load = function () { return this.addCommand({c:'load',a:arguments[0]}); }
g2.prototype.load.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        const args = Object.assign({ pointAt: this.pointAt, spacing: 20, w: -Math.PI/2 }, this);
        const pitr = g2.pntItrOf(args.pts),
            startLoc = [],
            arr = [];
        let arrLen = 0;
        for (let itr = 0; itr < pitr.len ; itr++) {
            arr.push(pitr(itr));
        }
        if (arr[arr.length-1] !== arr[0]) { arr.push(arr[0]) };
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
                if((y >= pi.y || y >= pj.y)
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

        return g2().ply({pts:args.pts,closed:true,ls:'transparent',fs:'@linkfill'})
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
                                    x1:x,
                                    y1:y,
                                    x2:t.x,
                                    y2:t.y,
                                    ls: args.ls || "darkred",
                                    lw: args.lw || 1
                                });
                            }
                        }
                    })
    }
});

/**
 * Symbols.
 * @method
 * @param {object} - symbol arguments object.
 * @property {number} x - x-value center.
 * @property {number} y - y-value center.
 * @example
 * g2().view({cartesian:true})
 *     .pol({x:20,y:75})
 *     .gnd({x:60,y:75})
 *     .nod({x:100,y:75})
 *     .dblnod({x:140,y:75})
 *     .nodfix({x:180,y:75})
 *     .nodflt({x:220,y:75})
 *     .origin({x:260,y:75})
 */

g2.prototype.pol = function () { return this.addCommand({c:'pol',a:arguments[0]||{}}); }
g2.prototype.pol.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);
        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
                   .cir({r:6,fs:'@nodfill'})
                   .cir({r:2.5,fs:'@ls',ls:'transparent'})
                   .end();
    }
}),

 g2.prototype.gnd = function () { return this.addCommand({c:'gnd',a:arguments[0]||{}}); }
 g2.prototype.gnd.prototype = g2.mixin({}, g2.prototype.use.prototype, {
     g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);

        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
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

g2.prototype.nod = function () { return this.addCommand({c:'nod',a:arguments[0]||{}}); }
g2.prototype.nod.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);

        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
                   .cir({r:4,ls:'@nodcolor',fs:'@nodfill',lwnosc:true})
                   .end();
    }
})

g2.prototype.dblnod = function () { return this.addCommand({c:'dblnod',a:arguments[0]||{}}); }
g2.prototype.dblnod.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);

        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
                   .cir({r:6,ls:'@nodcolor',fs:'@nodfill'})
                   .cir({r:3,ls:'@nodcolor',fs:'@nodfill2',lwnosc:true})
                   .end();
    }
})

g2.prototype.nodfix = function () { return this.addCommand({c:'nodfix',a:arguments[0]||{}}); }
g2.prototype.nodfix.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);

        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
                   .p()
                   .m({x:-8,y:-12})
                   .l({x:0,y:0})
                   .l({x:8,y:-12})
                   .drw({ls:'@nodcolor',fs:'@nodfill2'})
                   .cir({x:0,y:0,r:4,ls:'@nodcolor',fs:'@nodfill'})
                   .end();
    }
})

g2.prototype.nodflt = function () { return this.addCommand({c:'nodflt',a:arguments[0]||{}}); }
g2.prototype.nodflt.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0},this);

        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w})
                   .p()
                   .m({x:-8,y:-12})
                   .l({x:0,y:0})
                   .l({x:8,y:-12})
                   .drw({ls:'@nodcolor',fs:'@nodfill2'})
                   .cir({x:0,y:0,r:4,ls:'@nodcolor',fs:'@nodfill'})
                   .lin({x1:-9,y1:-19,x2:9,y2:-19,ls:'@nodfill2',lw:5,lwnosc:false})
                   .lin({x1:-9,y1:-15.5,x2:9,y2:-15.5,ls:'@nodcolor',lw:2,lwnosc:false})
                   .end();
    }
})

g2.prototype.origin = function () { return this.addCommand({c:'origin',a:arguments[0]||{}}); }
g2.prototype.origin.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        const args = Object.assign({x:0,y:0,scl:1,w:0,z:3.5},this);

        return g2().beg({x:args.x,y:args.y,scl:args.scl,w:args.w,lc:'round',lj:'round',fs:'#ccc'})
                   .vec({x1:0,y1:0,x2:10*args.z,y2:0,lw:0.8,fs:'#ccc'})
                   .vec({x1:0,y1:0,x2:0,y2:10*args.z,lw:0.8,fs:'#ccc'})
                   .cir({x:0,y:0,r:2.5,fs:'#ccc'})
                   .end();
    }
});

/**
 * Mechanical style values.
 * Not really meant to get overwritten. But if you actually want, proceed.<br>
 * Theses styles can be referenced using the comfortable '@' syntax.
 * @namespace
 * @property {object} State  `g2` state namespace.
 * @property {string} [State.nodcolor=#333]    node color.
 * @property {string} [State.nodfill=#dedede]   node fill color.
 * @property {string} [State.nodfill2=#aeaeae]    alternate node fill color, somewhat darker.
 * @property {string} [State.linkcolor=#666]   link color.
 * @property {string} [State.linkfill=rgba(225,225,225,0.75)]   link fill color, semi-transparent.
 * @property {string} [State.dimcolor=darkslategray]   dimension color.
 * @property {array} [State.solid=[]]   solid line style.
 * @property {array} [State.dash=[15,10]]   dashed line style.
 * @property {array} [State.dot=[4,4]]   dotted line style.
 * @property {array} [State.dashdot=[25,6.5,2,6.5]]   dashdotted line style.
 * @property {number} [State.labelOffset=5]    default label offset distance.
 * @property {number} [State.labelSignificantDigits=3]   default label's significant digits after numbering point.
 */
g2.State = g2.State || {};
g2.State.nodcolor = '#333';
g2.State.nodfill  = '#dedede';
g2.State.nodfill2 = '#aeaeae';
g2.State.linkcolor = '#666';
g2.State.linkfill = 'rgba(225,225,225,0.75)';
g2.State.dimcolor = 'darkslategray';
g2.State.solid = [];
g2.State.dash = [15,10];
g2.State.dot = [4,4];
g2.State.dashdot = [25,6.5,2,6.5];
g2.State.labelOffset = 5;
g2.State.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234
