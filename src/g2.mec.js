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
 * @param {number} args.x1 - start x coordinate.
 * @param {number} args.y1 - start y coordinate.
 * @param {number} args.x2 - end x coordinate.
 * @param {number} args.y2 - end y coordinate.
 * @param {boolean} [args.inside=true] - draw dimension arrows between or outside of ticks.
 * @example
 *  g2().dim({x1:60,y1:40,x2:190,y2:120})
 */
g2.prototype.dim = function dim({}) { return this.addCommand({c:'dim', a:arguments[0]}); }
g2.prototype.dim.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
    g2() {
        const args = {...this,lc:'round',lj:'round',w:0};
        const sz = Math.round((args.lw||1)/2)+2;
        const dx = args.x2-args.x1, dy = args.y2-args.y1, len = Math.hypot(dx,dy);
        const inside = 'inside' in args && !args.inside ? -1 : 1;
        return g2().beg({x:args.x1,y:args.y1,w:dy/dx})
                    .p().m({x:0,y:0}).l({x:len,y:0})
                        .m({x:0,y:sz}).l({x:0,y:-sz})
                        .m({x:len,y:sz}).l({x:len,y:-sz})
                    .stroke({fs:'transparent'})
                    .p().m({x:len,y:0})
                            .l({x:len-inside*5*sz,y:sz})
                            .a({dw:-inside*Math.PI/3,x:len-inside*5*sz,y:-sz})
                            .z()
                        .m({x:0,y:0})
                            .l({x:inside*5*sz,y:sz})
                            .a({dw:inside*Math.PI/3,x:inside*5*sz,y:-sz})
                            .z()
                        .drw({fs:'@ls'})
                   .end();
    }
});

/**
 * Angular dimension
 * @method
 * @returns {object} g2
 * @param {object} - angular dimension arguments.
 * @param {number} args.x - start x coordinate.
 * @param {number} args.y - start y coordinate.
 * @param {number} args.r - radius
 * @param {number} [args.w=0] - start angle (in radian).
 * @param {number} [args.dw=Math.PI/2] - angular range in radian. In case of positive values it is running counterclockwise with
 *                                       right handed (cartesian) coordinate system.
 * @param {boolean} [args.inside=true] - draw dimension arrows between or outside of ticks.
 * @example
 * g2().adim({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
 */
g2.prototype.adim = function adim({}) { return this.addCommand({c:'adim',a:arguments[0]}); }
g2.prototype.adim.prototype = g2.mixin({}, g2.prototype.arc.prototype, {
    g2() {
        const args = {...this,lc:'round',lj:'round',w:0};
        const inside = 'inside' in args && !args.inside ? -1 : 1;
        const wm = inside*(args.dw >= 0 ? 12/args.r : -12/args.r);
        const sz = Math.round((args.lw||1)/2)+2;
        const ri = args.r - sz, ra = args.r + sz;
        const c1  = Math.cos(args.w), s1 = Math.sin(args.w);
        const c2  = Math.cos(args.w+args.dw), s2 = Math.sin(args.w+args.dw);
        const c1m = Math.cos(args.w+wm), s1m = Math.sin(args.w+wm);
        const c2m = Math.cos(args.w+args.dw-wm), s2m = Math.sin(args.w+args.dw-wm);
        return g2().beg({x:args.x,y:args.y,w:c1})
                    .arc({x:0,y:0,r:args.r,w:args.w,dw:args.dw})
                    .p()
                    .m({x:args.r*c1,y:args.r*s1})
                    .l({x:ri*c1m,y:ri*s1m})
                    .a({w:Math.PI/3,x:ra*c1m,y:ra*s1m})
                    .z()
                    .m({x:ri*c1,y:ri*s1})
                    .l({x:ra*c1,y:ra*s1})
                    .m({x:args.r*c2,y:args.r*s2})
                    .l({x:ri*c2m,y:ri*s2m})
                    .a({w:-Math.PI/3,x:ra*c2m,y:ra*s2m})
                    .z()
                    .m({x:ri*c2,y:ri*s2})
                    .l({x:ra*c2,y:ra*s2})
                    .drw({fs:'@ls'})
                   .end()
    }
});

/**
 * Draw vector arrow.
 * @method
 * @returns {object} g2
 * @param {object} - vector arguments object.
 * @param {number} args.x1 - start x coordinate.
 * @param {number} args.y1 - start y coordinate.
 * @param {number} args.x2 - end x coordinate.
 * @param {number} args.y2 - end y coordinate.
 * @example
 * g2().vec({x1:50,y1:20,x2:250,y2:120})
 */
g2.prototype.vec = function vec({}) { return this.addCommand({c:'vec',a:arguments[0]}); }
g2.prototype.vec.prototype = g2.mixin({},g2.prototype.lin.prototype,{
    g2() {
        const args = {...this,lc:'round',lj:'round'};
        const z = 2+(args.lw||1);
        const dx = args.x2-args.x1, dy = args.y2-args.y1, r = Math.hypot(dx,dy);
        return g2().beg({...args,x:args.x1,y:args.y1,w:dy/dx})
                     .p().m({x:0,y:0})
                     .l({x:r,y:0})
                     .stroke({fs:'transparent'})
                     .p().m({x:r,y:0})
                     .l({x:r-5*z,y:z})
                     .a({dw:-Math.PI/3,x:r-5*z,y:-z})
                     .z()
                     .drw({fs:'@ls'})
                   .end();
    }
})

/**
 * Draw slider.
 * @method
 * @returns {object} g2
 * @param {object} - slider arguments object.
 * @param {number} args.x - start x coordinate.
 * @param {number} args.y - start y coordinate.
 * @param {number} [args.b=32] - slider breadth.
 * @param {number} [args.h=16] - slider height.
 * @param {number} [args.w=0] - rotation.
 * @example
 * g2().slider({x:150,y:75,w:Math.PI/4,b:64,h:32})
 */
g2.prototype.slider = function () { return this.addCommand({c:'slider',a:arguments[0]}); }
g2.prototype.slider.prototype = g2.mixin({},g2.prototype.rec.prototype,{
    g2() {
        args = this;
        args.b = args.b || 32;
        args.h = args.h || 16;
        return g2().beg({x:args.x,y:args.y,w:args.w,fs:'#ccc'})
                   .rec({x:-args.b/2,y:-args.h/2,b:args.b,h:args.h})
                   .end()
    }
})

/**
 * Draw linear spring
 * @method
 * @returns {object} g2
 * @param {object} - linear spring arguments object.
 * @param {number} args.x1 - start x coordinate.
 * @param {number} args.y1 - start y coordinate.
 * @param {number} args.x2 - end x coordinate.
 * @param {number} args.y2 - end y coordinate.
 * @param {number} [args.h=16] Spring height.
 * @example
 * g2().spring({x1:50,y1:100,x2:200,y2:75})
 */
g2.prototype.spring = function () { return this.addCommand({c:'spring',a:arguments[0]}); }
g2.prototype.spring.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        let args = this;
        let len = Math.hypot(args.x2-args.x1, args.y2-args.y1);
        let xm = (args.x2+args.x1)/2;
        let ym = (args.y2+args.y1)/2;
        let h = args.h || 16;
        let ux = (args.x2-args.x1)/len;
        let uy = (args.y2-args.y1)/len;
        return g2().p()
                   .m({x:args.x1,y:args.y1})
                   .l({x:xm-ux*h/2,y:ym-uy*h/2})
                   .l({x:xm+(-ux/6+uy/2)*h,y:ym+(-uy/6-ux/2)*h})
                   .l({x:xm+( ux/6-uy/2)*h,y:ym+( uy/6+ux/2)*h})
                   .l({x:xm+ux*h/2,y:ym+uy*h/2})
                   .l({x:args.x2,y:args.y2})
                   .stroke({ls:'@nodcolor',...this,fs:'transparent',lc:'round',lj:'round'});
    }
})

/**
 * Draw line with centered square damper symbol.
 * @method
 * @returns {object} g2
 * @param {object} - damper arguments object.
 * @param {number} args.x1 - start x coordinate.
 * @param {number} args.y1 - start y coordinate.
 * @param {number} args.x2 - end x coordinate.
 * @param {number} args.y2 - end y coordinate.
 * @param {number} [args.h=16] - damper height.
 *  * g2().damper({x1:60,y1:120,x2:200,y2:75})
 */
g2.prototype.damper = function () { return this.addCommand({c:'damper',a:arguments[0]}); }
g2.prototype.damper.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        const args = this;
        let len = Math.hypot(args.x2-args.x1, args.y2-args.y1);
        let xm = (args.x2+args.x1)/2;
        let ym = (args.y2+args.y1)/2;
        let h = args.h || 16;
        let ux = (args.x2-args.x1)/len;
        let uy = (args.y2-args.y1)/len;
        return g2().p()
                   .m({x:args.x1,y:args.y1})
                   .l({x:xm-ux*h/2,y:ym-uy*h/2})
                   .m({x:xm+( ux-uy)*h/2,y:ym+( uy+ux)*h/2})
                   .l({x:xm+(-ux-uy)*h/2,y:ym+(-uy+ux)*h/2})
                   .l({x:xm+(-ux+uy)*h/2,y:ym+(-uy-ux)*h/2})
                   .l({x:xm+( ux+uy)*h/2,y:ym+( uy-ux)*h/2})
                   .m({x:xm,y:ym})
                   .l({x:args.x2,y:args.y2})
                   .stroke({ls:'@nodcolor',...this,fs:'transparent',lc:'round',lj:'round'});
    }
})

/**
 * Draw polygonial link.
 * @method
 * @returns {object} g2
 * @param {object} - link arguments object.
 * @param {object[] | number[][] | number[]} args.pts - array of points.
 * @param {bool} [args.closed = false] - closed link.
 * @param {number} args.x - start x coordinate.
 * @param {number} args.y - start y coordinate.
 * @param {number} [args.w=0] - angle.
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
        return g2().ply({...this, closed:true,ls:'@linkcolor',fs:'transparent',lw:7,lc:'round',lj:'round'});
    }
})

/**
 * Draw alternate glossy polygonial link.
 * @method
 * @returns {object} g2
 * @param {object} - link2 arguments object.
 * @param {object[] | number[][] | number[]} args.pts - array of points.
 * @param {bool} [args.closed = false] - closed link.
 * @param {number} args.x - start x coordinate.
 * @param {number} args.y - start y coordinate.
 * @param {number} [args.w=0] - angle.
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
        return g2().ply({...this,closed:true,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'})
                   .ply({...this,closed:true,ls:'@nodfill2',fs:'transparent',lw:4.5,lc:'round',lj:'round'})
                   .ply({...this,closed:true,ls:'@nodfill',fs:'transparent',lw:2,lc:'round',lj:'round'});
    }
})

/**
 * Draw polygonial beam.
 * @method
 * @returns {object} g2
 * @param {object} - beam arguments object.
 * @param {object[] | number[][] | number[]} args.pts - array of points.
 * @param {number} args.x - start x coordinate.
 * @param {number} args.y - start y coordinate.
 * @param {number} [args.w=0] - angle.
 * @example
 * g2().view({cartesian})
 *     .beam({pts:[[200,125][50,125][50,50][200,50]]})
 */
g2.prototype.beam = function () { return this.addCommand({c:'beam',a:arguments[0]}); }
g2.prototype.beam.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        return g2().ply({...this, closed:false,ls:'@linkcolor',fs:'transparent',lw:7,lc:'round',lj:'round'});
    }
})

/**
 * Draw alternate glossy polygonial beam.
 * @method
 * @returns {object} g2
 * @param {object} - beam2 arguments object.
 * @param {object[] | number[][] | number[]} args.pts - array of points.
 * @param {number} args.x - start x coordinate.
 * @param {number} args.y - start y coordinate.
 * @param {number} [args.w=0] - angle.
 * @example
 * g2().view({cartesian})
 *     .beam2({pts:[[200,125][50,125][50,50][200,50]]})
 */
g2.prototype.beam2 = function () { return this.addCommand({c:'beam2',a:arguments[0]}); }
g2.prototype.beam2.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        return g2().ply({...this,closed:false,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'})
                   .ply({...this,closed:false,ls:'@nodfill2',fs:'transparent',lw:4.5,lc:'round',lj:'round'})
                   .ply({...this,closed:false,ls:'@nodfill',fs:'transparent',lw:2,lc:'round',lj:'round'});
    }
})

/**
 * Draw bar.
 * @method
 * @returns {object} g2
 * @param {object} - bar arguments object.
 * @param {number} args.x1 - start x coordinate.
 * @param {number} args.y1 - start y coordinate.
 * @param {number} args.x2 - end x coordinate.
 * @param {number} args.y2 - end y coordinate.
 * @example
 * g2().bar({x1:50,y1:20,x2:250,y2:120})
 */
g2.prototype.bar = function () { return this.addCommand({c:'bar',a:arguments[0]}); }
g2.prototype.bar.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        let args = this;
        return g2().lin({...this,ls:'@linkcolor',lw:6,lc:'round'});
    }
})

/**
 * Draw alternate glossy bar.
 * @method
 * @returns {object} g2
 * @param {object} - bar2 arguments object.
 * @param {number} args.x1 - start x coordinate.
 * @param {number} args.y1 - start y coordinate.
 * @param {number} args.x2 - end x coordinate.
 * @param {number} args.y2 - end y coordinate.
 * @example
 * g2().bar2({x1:50,y1:20,x2:250,y2:120})
 */
g2.prototype.bar2 = function () { return this.addCommand({c:'bar2',a:arguments[0]}); }
g2.prototype.bar2.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        const args = this;
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
 * @param {number} args.x - x-value center.
 * @param {number} args.y - y-value center.
 * @param {number} args.r - radius.
 * @param {number} args.w - angle.
 * @example
 * g2().pulley({x:100,y:75,r:50})
 */
g2.prototype.pulley = function () { return this.addCommand({c:'pulley',a:arguments[0]}); }
g2.prototype.pulley.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        return g2().cir({x:this.x,y:this.y,r:this.r,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-5,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-6,ls:'#8e8e8e',fs:'transparent',lw:2})
                   .cir({x:this.x,y:this.y,r:this.r-8,ls:'#aeaeae',fs:'transparent',lw:2})
                   .cir({x:this.x,y:this.y,r:this.r-10,ls:'#cecece',fs:'transparent',lw:2})
    }
})

/**
 * Draw alternate pulley.
 * @method
 * @returns {object} g2
 * @param {object} - pulley2 arguments object.
 * @param {number} args.x - x-value center.
 * @param {number} args.y - y-value center.
 * @param {number} args.r - radius.
 * @param {number} args.w - angle.
 * @example
 * g2().pulley2({x:50,y:30,r:25})
 */
g2.prototype.pulley2 = function () { return this.addCommand({c:'pulley2',a:arguments[0]}); }
g2.prototype.pulley2.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        return g2().bar2({x1:this.x,y1:this.y-this.r+4,x2:this.x,y2:this.y+this.r-4})
                   .bar2({x1:this.x-this.r+4,y1:this.y,x2:this.x+this.r-4,y2:this.y})
                   .cir({x:this.x,y:this.y,r:this.r-2.5,ls:'#e6e6e6',fs:'transparent',lw:5})
                   .cir({x:this.x,y:this.y,r:this.r,ls:'@nodcolor',fs:'transparent',lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-5,ls:'@nodcolor',fs:'transparent',lw:1})
    }
})
/**
 * Draw rope. Amount of pulley radii must be greater than 10 units. They are forced to zero otherwise.
 * @method
 * @returns {object} g2
 * @param {object} - rope arguments object.
 * @param {object | number} args.p1 - starting point or Coordinate.
 * @param {object | number} args.p2 - end point or Coordinate.
 * @param {number} args.r - radius of parent element.
 * @example
 * let A = {x:50,y:30}, B = {x:200,y:75};
 * g2().view({cartesian:true})
 *     .pulley({...A,r:20})
 *     .pulley2({...B,r:40})
 *     .rope({p1:A,r1:20,p2:B,r2:40})
 */
g2.prototype.rope = function () { return this.addCommand({c:'rope',a:arguments[0]}); }
g2.prototype.rope.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        let x1 = 'p1' in this ? this.p1.x
               : 'x1' in this ? this.x1
               : 'x'  in this ? this.x
               : 0;
        let y1 = 'p1' in this ? this.p1.y
               : 'y1' in this ? this.y1
               : 'y'  in this ? this.y
               : 0;
        let x2 = 'p2' in this ? this.p2.x
               : 'x2' in this ? this.x2
               : 'dx' in this ? (x1 + this.dx)
               : 'r'  in this ? x1 + this.r*Math.cos(this.w||0)
               : x1+10;
        let y2 = 'p2' in this ? this.p2.y
               : 'y2' in this ? this.y2
               : 'dy' in this ? (y1 + this.dy)
               : 'r'  in this ? y1 + this.r*Math.sin(this.w||0)
               : y1;
        let Rmin = 10;
        let R1 = this.r1 > Rmin ? this.r1 - 2.5
               : this.r1 <-Rmin ? this.r1 + 2.5
               : 0;
        let R2 = this.r2 > Rmin ? this.r2 - 2.5
               : this.r2 < Rmin ? this.r2 + 2.5
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
 * @param {object[] | number[][] | number[]} args.pts - array of points.
 * @param {bool} [args.closed=false] - closed polygon.
 * @param {number} [args.h=4] - ground shade line width.
 * @param {string} [args.pos=right] - ground shade position ['left','right'].
 * @example
 * g2().ground({pts:[25,25,25,75,75,75,75,25,125,25],pos:'left'})
 */
g2.prototype.ground = function () { return this.addCommand({c:'ground',a:arguments[0]}); }
g2.prototype.ground.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        const args = this;
        const itr = g2.pntItrOf(args.pts);
        let pn, en, lam, i,
            p0 = pp = itr(i=0),
            h = args && args.h || 4;
            let p = itr(++i);
            let dx = p.x - pp.x,
            dy = p.y - pp.y,
            len = Math.hypot(dx,dy) || 1,
            e0 = ep = {x:dx/len,y:dy/len},
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
                   .ply({...args,pts:eq,ls:'@nodfill2',lw:2*h})
                   .ply({...args})
                   .end()

    }
});

/**
 * Polygonial line load. The first and last point define the base line onto which
 * the load is acting orthogonal.
 * @method
 * @returns {object} g2
 * @param {object} - load arguments object.
 * @param {object[] | number[][] | number[]} args.pts - array of points.
 * @param {real} spacing - spacing of the vectors drawn as a positive real number, interprete as<br>
 *                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>
 *                       * spacing &gt; 1: length of spacing.
 */
g2.prototype.load = function () { return this.addCommand({c:'load',a:arguments[0]}); }
g2.prototype.load.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        // OBVIOUS TODO HERE!!
        return g2().ply({pts:this.pts,closed:true,ls:'transparent',fs:'@linkfill'})
                  // .ply({pts:gnd,closed:false,ls:'rgba(100,100,100,0.5)'/*@nodfill2*/,fs:'transparent',lw:2*h,lc:'butt',lj:'miter'})
}});

/**
 * Symbols.
 * @method
 * @param {object} - symbol arguments object.
 * @param {number} args.x - x-value center.
 * @param {number} args.y - y-value center.
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
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
                   .cir({r:6,fs:'@nodfill'})
                   .cir({r:2.5,fs:'@ls',ls:'transparent'})
                   .end();
    }
}),

 g2.prototype.gnd = function () { return this.addCommand({c:'gnd',a:arguments[0]||{}}); }
 g2.prototype.gnd.prototype = g2.mixin({}, g2.prototype.use.prototype, {
     g2() {
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
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
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
                   .cir({r:4,ls:'@nodcolor',fs:'@nodfill',lwnosc:true})
                   .end();
    }
})

g2.prototype.dblnod = function () { return this.addCommand({c:'dblnod',a:arguments[0]||{}}); }
g2.prototype.dblnod.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
                   .cir({r:6,ls:'@nodcolor',fs:'@nodfill'})
                   .cir({r:3,ls:'@nodcolor',fs:'@nodfill2',lwnosc:true})
                   .end();
    }
})

g2.prototype.nodfix = function () { return this.addCommand({c:'nodfix',a:arguments[0]||{}}); }
g2.prototype.nodfix.prototype = g2.mixin({}, g2.prototype.use.prototype, {
    g2() {
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
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
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
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
        let z = 3.5;
        return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0,lc:'round',lj:'round',fs:'#ccc'})
                   .p()
                   .m({x:6*z,y:0})
                   .l({x:0,y:0})
                   .l({x:0,y:6*z})
                   .stroke()
                   .p()
                   .m({x:10*z,y:0})
                   .l({x:6*z,y:3/4*z})
                   .a({dw:-Math.PI/3,x:6*z,y:-3/4*z})
                   .z()
                   .m({x:0,y:10*z})
                   .l({x:3/4*z,y:6*z})
                   .a({dw: Math.PI/3,x:-3/4*z,y:6*z})
                   .z()
                   .drw()
                   .cir({x:0,y:0,r:2.5,fs:'#ccc'})
                   .end();/**
                   * g2.mec (c) 2013-16 Stefan Goessner
                   * @file mechanical extensions to `g2`.
                   * @author Stefan Goessner
                   * @license MIT License
                   */
                  /* jshint -W014 */

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
                   * @param {number} args.x1 - start x coordinate.
                   * @param {number} args.y1 - start y coordinate.
                   * @param {number} args.x2 - end x coordinate.
                   * @param {number} args.y2 - end y coordinate.
                   * @param {boolean} [args.inside=true] - draw dimension arrows between or outside of ticks.
                   * @example
                   *  g2().dim({x1:60,y1:40,x2:190,y2:120})
                   */
                  g2.prototype.dim = function dim({}) { return this.addCommand({c:'dim', a:arguments[0]}); }
                  g2.prototype.dim.prototype = g2.mixin({}, g2.prototype.lin.prototype, {
                      g2() {
                          const args = {...this,lc:'round',lj:'round',w:0};
                          const sz = Math.round((args.lw||1)/2)+2;
                          const dx = args.x2-args.x1, dy = args.y2-args.y1, len = Math.hypot(dx,dy);
                          const inside = 'inside' in args && !args.inside ? -1 : 1;
                          return g2().beg({x:args.x1,y:args.y1,w:dy/dx === Infinity ? Math.PI/2 : dy/dx === -Infinity ? -Math.PI/2 : dy/dx})
                                      .p().m({x:0,y:0}).l({x:len,y:0})
                                          .m({x:0,y:sz}).l({x:0,y:-sz})
                                          .m({x:len,y:sz}).l({x:len,y:-sz})
                                      .stroke({fs:'transparent'})
                                      .p().m({x:len,y:0})
                                              .l({x:len-inside*5*sz,y:sz})
                                              .a({dw:-inside*Math.PI/3,x:len-inside*5*sz,y:-sz})
                                              .z()
                                          .m({x:0,y:0})
                                              .l({x:inside*5*sz,y:sz})
                                              .a({dw:inside*Math.PI/3,x:inside*5*sz,y:-sz})
                                              .z()
                                          .drw({fs:'@ls'})
                                     .end();
                      }
                  });

                  /**
                   * Angular dimension
                   * @method
                   * @returns {object} g2
                   * @param {object} - angular dimension arguments.
                   * @param {number} args.x - start x coordinate.
                   * @param {number} args.y - start y coordinate.
                   * @param {number} args.r - radius
                   * @param {number} [args.w=0] - start angle (in radian).
                   * @param {number} [args.dw=Math.PI/2] - angular range in radian. In case of positive values it is running counterclockwise with
                   *                                       right handed (cartesian) coordinate system.
                   * @param {boolean} [args.inside=true] - draw dimension arrows between or outside of ticks.
                   * @example
                   * g2().adim({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
                   */
                  g2.prototype.adim = function adim({}) { return this.addCommand({c:'adim',a:arguments[0]}); }
                  g2.prototype.adim.prototype = g2.mixin({}, g2.prototype.arc.prototype, {
                      g2() {
                          const args = {...this,lc:'round',lj:'round',w:0};
                          const inside = 'inside' in args && !args.inside ? -1 : 1;
                          const wm = inside*(args.dw >= 0 ? 12/args.r : -12/args.r);
                          const sz = Math.round((args.lw||1)/2)+2;
                          const ri = args.r - sz, ra = args.r + sz;
                          const c1  = Math.cos(args.w), s1 = Math.sin(args.w);
                          const c2  = Math.cos(args.w+args.dw), s2 = Math.sin(args.w+args.dw);
                          const c1m = Math.cos(args.w+wm), s1m = Math.sin(args.w+wm);
                          const c2m = Math.cos(args.w+args.dw-wm), s2m = Math.sin(args.w+args.dw-wm);
                          return g2().beg({x:args.x,y:args.y,w:c1})
                                      .arc({x:0,y:0,r:args.r,w:args.w,dw:args.dw})
                                      .p()
                                      .m({x:args.r*c1,y:args.r*s1})
                                      .l({x:ri*c1m,y:ri*s1m})
                                      .a({w:Math.PI/3,x:ra*c1m,y:ra*s1m})
                                      .z()
                                      .m({x:ri*c1,y:ri*s1})
                                      .l({x:ra*c1,y:ra*s1})
                                      .m({x:args.r*c2,y:args.r*s2})
                                      .l({x:ri*c2m,y:ri*s2m})
                                      .a({w:-Math.PI/3,x:ra*c2m,y:ra*s2m})
                                      .z()
                                      .m({x:ri*c2,y:ri*s2})
                                      .l({x:ra*c2,y:ra*s2})
                                      .drw({fs:'@ls'})
                                     .end()
                      }
                  });

                  /**
                   * Draw vector arrow.
                   * @method
                   * @returns {object} g2
                   * @param {object} - vector arguments object.
                   * @param {number} args.x1 - start x coordinate.
                   * @param {number} args.y1 - start y coordinate.
                   * @param {number} args.x2 - end x coordinate.
                   * @param {number} args.y2 - end y coordinate.
                   * @example
                   * g2().vec({x1:50,y1:20,x2:250,y2:120})
                   */
                  g2.prototype.vec = function vec({}) { return this.addCommand({c:'vec',a:arguments[0]}); }
                  g2.prototype.vec.prototype = g2.mixin({},g2.prototype.lin.prototype,{
                      g2() {
                          const args = {...this,lc:'round',lj:'round'};
                          const z = 2+(args.lw||1);
                          const dx = args.x2-args.x1, dy = args.y2-args.y1, r = Math.hypot(dx,dy);
                          return g2().beg({...args,x:args.x1,y:args.y1,w:dy/dx === Infinity ? Math.PI/2 : dy/dx === -Infinity ? -Math.PI/2 : dy/dx})
                                       .p().m({x:0,y:0})
                                       .l({x:r,y:0})
                                       .stroke({fs:'transparent'})
                                       .p().m({x:r,y:0})
                                       .l({x:r-5*z,y:z})
                                       .a({dw:-Math.PI/3,x:r-5*z,y:-z})
                                       .z()
                                       .drw({fs:'@ls'})
                                     .end();
                      }
                  })

                  /**
                   * Draw slider.
                   * @method
                   * @returns {object} g2
                   * @param {object} - slider arguments object.
                   * @param {number} args.x - start x coordinate.
                   * @param {number} args.y - start y coordinate.
                   * @param {number} [args.b=32] - slider breadth.
                   * @param {number} [args.h=16] - slider height.
                   * @param {number} [args.w=0] - rotation.
                   * @example
                   * g2().slider({x:150,y:75,w:Math.PI/4,b:64,h:32})
                   */
                  g2.prototype.slider = function () { return this.addCommand({c:'slider',a:arguments[0]}); }
                  g2.prototype.slider.prototype = g2.mixin({},g2.prototype.rec.prototype,{
                      g2() {
                          args = this;
                          args.b = args.b || 32;
                          args.h = args.h || 16;
                          return g2().beg({x:args.x,y:args.y,w:args.w,fs:'#ccc'})
                                     .rec({x:-args.b/2,y:-args.h/2,b:args.b,h:args.h})
                                     .end()
                      }
                  })

                  /**
                   * Draw linear spring
                   * @method
                   * @returns {object} g2
                   * @param {object} - linear spring arguments object.
                   * @param {number} args.x1 - start x coordinate.
                   * @param {number} args.y1 - start y coordinate.
                   * @param {number} args.x2 - end x coordinate.
                   * @param {number} args.y2 - end y coordinate.
                   * @param {number} [args.h=16] Spring height.
                   * @example
                   * g2().spring({x1:50,y1:100,x2:200,y2:75})
                   */
                  g2.prototype.spring = function () { return this.addCommand({c:'spring',a:arguments[0]}); }
                  g2.prototype.spring.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
                      g2() {
                          let args = this;
                          let len = Math.hypot(args.x2-args.x1, args.y2-args.y1);
                          let xm = (args.x2+args.x1)/2;
                          let ym = (args.y2+args.y1)/2;
                          let h = args.h || 16;
                          let ux = (args.x2-args.x1)/len;
                          let uy = (args.y2-args.y1)/len;
                          return g2().p()
                                     .m({x:args.x1,y:args.y1})
                                     .l({x:xm-ux*h/2,y:ym-uy*h/2})
                                     .l({x:xm+(-ux/6+uy/2)*h,y:ym+(-uy/6-ux/2)*h})
                                     .l({x:xm+( ux/6-uy/2)*h,y:ym+( uy/6+ux/2)*h})
                                     .l({x:xm+ux*h/2,y:ym+uy*h/2})
                                     .l({x:args.x2,y:args.y2})
                                     .stroke({ls:'@nodcolor',...this,fs:'transparent',lc:'round',lj:'round'});
                      }
                  })

                  /**
                   * Draw line with centered square damper symbol.
                   * @method
                   * @returns {object} g2
                   * @param {object} - damper arguments object.
                   * @param {number} args.x1 - start x coordinate.
                   * @param {number} args.y1 - start y coordinate.
                   * @param {number} args.x2 - end x coordinate.
                   * @param {number} args.y2 - end y coordinate.
                   * @param {number} [args.h=16] - damper height.
                   *  * g2().damper({x1:60,y1:120,x2:200,y2:75})
                   */
                  g2.prototype.damper = function () { return this.addCommand({c:'damper',a:arguments[0]}); }
                  g2.prototype.damper.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
                      g2() {
                          const args = this;
                          let len = Math.hypot(args.x2-args.x1, args.y2-args.y1);
                          let xm = (args.x2+args.x1)/2;
                          let ym = (args.y2+args.y1)/2;
                          let h = args.h || 16;
                          let ux = (args.x2-args.x1)/len;
                          let uy = (args.y2-args.y1)/len;
                          return g2().p()
                                     .m({x:args.x1,y:args.y1})
                                     .l({x:xm-ux*h/2,y:ym-uy*h/2})
                                     .m({x:xm+( ux-uy)*h/2,y:ym+( uy+ux)*h/2})
                                     .l({x:xm+(-ux-uy)*h/2,y:ym+(-uy+ux)*h/2})
                                     .l({x:xm+(-ux+uy)*h/2,y:ym+(-uy-ux)*h/2})
                                     .l({x:xm+( ux+uy)*h/2,y:ym+( uy-ux)*h/2})
                                     .m({x:xm,y:ym})
                                     .l({x:args.x2,y:args.y2})
                                     .stroke({ls:'@nodcolor',...this,fs:'transparent',lc:'round',lj:'round'});
                      }
                  })

                  /**
                   * Draw polygonial link.
                   * @method
                   * @returns {object} g2
                   * @param {object} - link arguments object.
                   * @param {object[] | number[][] | number[]} args.pts - array of points.
                   * @param {bool} [args.closed = false] - closed link.
                   * @param {number} args.x - start x coordinate.
                   * @param {number} args.y - start y coordinate.
                   * @param {number} [args.w=0] - angle.
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
                          return g2().ply({...this, closed:true,ls:'@linkcolor',fs:'transparent',lw:7,lc:'round',lj:'round'});
                      }
                  })

                  /**
                   * Draw alternate glossy polygonial link.
                   * @method
                   * @returns {object} g2
                   * @param {object} - link2 arguments object.
                   * @param {object[] | number[][] | number[]} args.pts - array of points.
                   * @param {bool} [args.closed = false] - closed link.
                   * @param {number} args.x - start x coordinate.
                   * @param {number} args.y - start y coordinate.
                   * @param {number} [args.w=0] - angle.
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
                          return g2().ply({...this,closed:true,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'})
                                     .ply({...this,closed:true,ls:'@nodfill2',fs:'transparent',lw:4.5,lc:'round',lj:'round'})
                                     .ply({...this,closed:true,ls:'@nodfill',fs:'transparent',lw:2,lc:'round',lj:'round'});
                      }
                  })

                  /**
                   * Draw polygonial beam.
                   * @method
                   * @returns {object} g2
                   * @param {object} - beam arguments object.
                   * @param {object[] | number[][] | number[]} args.pts - array of points.
                   * @param {number} args.x - start x coordinate.
                   * @param {number} args.y - start y coordinate.
                   * @param {number} [args.w=0] - angle.
                   * @example
                   * g2().view({cartesian})
                   *     .beam({pts:[[200,125][50,125][50,50][200,50]]})
                   */
                  g2.prototype.beam = function () { return this.addCommand({c:'beam',a:arguments[0]}); }
                  g2.prototype.beam.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
                      g2() {
                          return g2().ply({...this, closed:false,ls:'@linkcolor',fs:'transparent',lw:7,lc:'round',lj:'round'});
                      }
                  })

                  /**
                   * Draw alternate glossy polygonial beam.
                   * @method
                   * @returns {object} g2
                   * @param {object} - beam2 arguments object.
                   * @param {object[] | number[][] | number[]} args.pts - array of points.
                   * @param {number} args.x - start x coordinate.
                   * @param {number} args.y - start y coordinate.
                   * @param {number} [args.w=0] - angle.
                   * @example
                   * g2().view({cartesian})
                   *     .beam2({pts:[[200,125][50,125][50,50][200,50]]})
                   */
                  g2.prototype.beam2 = function () { return this.addCommand({c:'beam2',a:arguments[0]}); }
                  g2.prototype.beam2.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
                      g2() {
                          return g2().ply({...this,closed:false,ls:'@nodcolor',fs:'transparent',lw:7,lc:'round',lj:'round'})
                                     .ply({...this,closed:false,ls:'@nodfill2',fs:'transparent',lw:4.5,lc:'round',lj:'round'})
                                     .ply({...this,closed:false,ls:'@nodfill',fs:'transparent',lw:2,lc:'round',lj:'round'});
                      }
                  })

                  /**
                   * Draw bar.
                   * @method
                   * @returns {object} g2
                   * @param {object} - bar arguments object.
                   * @param {number} args.x1 - start x coordinate.
                   * @param {number} args.y1 - start y coordinate.
                   * @param {number} args.x2 - end x coordinate.
                   * @param {number} args.y2 - end y coordinate.
                   * @example
                   * g2().bar({x1:50,y1:20,x2:250,y2:120})
                   */
                  g2.prototype.bar = function () { return this.addCommand({c:'bar',a:arguments[0]}); }
                  g2.prototype.bar.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
                      g2() {
                          let args = this;
                          return g2().lin({...this,ls:'@linkcolor',lw:6,lc:'round'});
                      }
                  })

                  /**
                   * Draw alternate glossy bar.
                   * @method
                   * @returns {object} g2
                   * @param {object} - bar2 arguments object.
                   * @param {number} args.x1 - start x coordinate.
                   * @param {number} args.y1 - start y coordinate.
                   * @param {number} args.x2 - end x coordinate.
                   * @param {number} args.y2 - end y coordinate.
                   * @example
                   * g2().bar2({x1:50,y1:20,x2:250,y2:120})
                   */
                  g2.prototype.bar2 = function () { return this.addCommand({c:'bar2',a:arguments[0]}); }
                  g2.prototype.bar2.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
                      g2() {
                          const args = this;
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
                   * @param {number} args.x - x-value center.
                   * @param {number} args.y - y-value center.
                   * @param {number} args.r - radius.
                   * @param {number} args.w - angle.
                   * @example
                   * g2().pulley({x:100,y:75,r:50})
                   */
                  g2.prototype.pulley = function () { return this.addCommand({c:'pulley',a:arguments[0]}); }
                  g2.prototype.pulley.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
                      g2() {
                          return g2().cir({x:this.x,y:this.y,r:this.r,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
                                     .cir({x:this.x,y:this.y,r:this.r-5,ls:'@nodcolor',fs:'#e6e6e6',lw:1})
                                     .cir({x:this.x,y:this.y,r:this.r-6,ls:'#8e8e8e',fs:'transparent',lw:2})
                                     .cir({x:this.x,y:this.y,r:this.r-8,ls:'#aeaeae',fs:'transparent',lw:2})
                                     .cir({x:this.x,y:this.y,r:this.r-10,ls:'#cecece',fs:'transparent',lw:2})
                      }
                  })

                  /**
                   * Draw alternate pulley.
                   * @method
                   * @returns {object} g2
                   * @param {object} - pulley2 arguments object.
                   * @param {number} args.x - x-value center.
                   * @param {number} args.y - y-value center.
                   * @param {number} args.r - radius.
                   * @param {number} args.w - angle.
                   * @example
                   * g2().pulley2({x:50,y:30,r:25})
                   */
                  g2.prototype.pulley2 = function () { return this.addCommand({c:'pulley2',a:arguments[0]}); }
                  g2.prototype.pulley2.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
                      g2() {
                          return g2().bar2({x1:this.x,y1:this.y-this.r+4,x2:this.x,y2:this.y+this.r-4})
                                     .bar2({x1:this.x-this.r+4,y1:this.y,x2:this.x+this.r-4,y2:this.y})
                                     .cir({x:this.x,y:this.y,r:this.r-2.5,ls:'#e6e6e6',fs:'transparent',lw:5})
                                     .cir({x:this.x,y:this.y,r:this.r,ls:'@nodcolor',fs:'transparent',lw:1})
                                     .cir({x:this.x,y:this.y,r:this.r-5,ls:'@nodcolor',fs:'transparent',lw:1})
                      }
                  })
                  /**
                   * Draw rope. Amount of pulley radii must be greater than 10 units. They are forced to zero otherwise.
                   * @method
                   * @returns {object} g2
                   * @param {object} - rope arguments object.
                   * @param {object | number} args.p1 - starting point or Coordinate.
                   * @param {object | number} args.p2 - end point or Coordinate.
                   * @param {number} args.r - radius of parent element.
                   * @example
                   * let A = {x:50,y:30}, B = {x:200,y:75};
                   * g2().view({cartesian:true})
                   *     .pulley({...A,r:20})
                   *     .pulley2({...B,r:40})
                   *     .rope({p1:A,r1:20,p2:B,r2:40})
                   */
                  g2.prototype.rope = function () { return this.addCommand({c:'rope',a:arguments[0]}); }
                  g2.prototype.rope.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
                      g2() {
                          let x1 = 'p1' in this ? this.p1.x
                                 : 'x1' in this ? this.x1
                                 : 'x'  in this ? this.x
                                 : 0;
                          let y1 = 'p1' in this ? this.p1.y
                                 : 'y1' in this ? this.y1
                                 : 'y'  in this ? this.y
                                 : 0;
                          let x2 = 'p2' in this ? this.p2.x
                                 : 'x2' in this ? this.x2
                                 : 'dx' in this ? (x1 + this.dx)
                                 : 'r'  in this ? x1 + this.r*Math.cos(this.w||0)
                                 : x1+10;
                          let y2 = 'p2' in this ? this.p2.y
                                 : 'y2' in this ? this.y2
                                 : 'dy' in this ? (y1 + this.dy)
                                 : 'r'  in this ? y1 + this.r*Math.sin(this.w||0)
                                 : y1;
                          let Rmin = 10;
                          let R1 = this.r1 > Rmin ? this.r1 - 2.5
                                 : this.r1 <-Rmin ? this.r1 + 2.5
                                 : 0;
                          let R2 = this.r2 > Rmin ? this.r2 - 2.5
                                 : this.r2 < Rmin ? this.r2 + 2.5
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
                   * @param {object[] | number[][] | number[]} args.pts - array of points.
                   * @param {bool} [args.closed=false] - closed polygon.
                   * @param {number} [args.h=4] - ground shade line width.
                   * @param {string} [args.pos=right] - ground shade position ['left','right'].
                   * @example
                   * g2().ground({pts:[25,25,25,75,75,75,75,25,125,25],pos:'left'})
                   */
                  g2.prototype.ground = function () { return this.addCommand({c:'ground',a:arguments[0]}); }
                  g2.prototype.ground.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
                      g2() {
                          const args = this;
                          const itr = g2.pntItrOf(args.pts);
                          let pn, en, lam, i,
                              p0 = pp = itr(i=0),
                              h = args && args.h || 4;
                              let p = itr(++i);
                              let dx = p.x - pp.x,
                              dy = p.y - pp.y,
                              len = Math.hypot(dx,dy) || 1,
                              e0 = ep = {x:dx/len,y:dy/len},
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
                                     .ply({...args,pts:eq,ls:'@nodfill2',lw:2*h})
                                     .ply({...args})
                                     .end()

                      }
                  });

                  /**
                   * Polygonial line load. The first and last point define the base line onto which
                   * the load is acting orthogonal.
                   * @method
                   * @returns {object} g2
                   * @param {object} - load arguments object.
                   * @param {object[] | number[][] | number[]} args.pts - array of points.
                   * @param {real} spacing - spacing of the vectors drawn as a positive real number, interprete as<br>
                   *                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>
                   *                       * spacing &gt; 1: length of spacing.
                   */
                  g2.prototype.load = function () { return this.addCommand({c:'load',a:arguments[0]}); }
                  g2.prototype.load.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
                      g2() {
                          // OBVIOUS TODO HERE!!
                          return g2().ply({pts:this.pts,closed:true,ls:'transparent',fs:'@linkfill'})
                                    // .ply({pts:gnd,closed:false,ls:'rgba(100,100,100,0.5)'/*@nodfill2*/,fs:'transparent',lw:2*h,lc:'butt',lj:'miter'})
                  }});

                  /**
                   * Symbols.
                   * @method
                   * @param {object} - symbol arguments object.
                   * @param {number} args.x - x-value center.
                   * @param {number} args.y - y-value center.
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
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
                                     .cir({r:6,fs:'@nodfill'})
                                     .cir({r:2.5,fs:'@ls',ls:'transparent'})
                                     .end();
                      }
                  }),

                   g2.prototype.gnd = function () { return this.addCommand({c:'gnd',a:arguments[0]||{}}); }
                   g2.prototype.gnd.prototype = g2.mixin({}, g2.prototype.use.prototype, {
                       g2() {
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
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
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
                                     .cir({r:4,ls:'@nodcolor',fs:'@nodfill',lwnosc:true})
                                     .end();
                      }
                  })

                  g2.prototype.dblnod = function () { return this.addCommand({c:'dblnod',a:arguments[0]||{}}); }
                  g2.prototype.dblnod.prototype = g2.mixin({}, g2.prototype.use.prototype, {
                      g2() {
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
                                     .cir({r:6,ls:'@nodcolor',fs:'@nodfill'})
                                     .cir({r:3,ls:'@nodcolor',fs:'@nodfill2',lwnosc:true})
                                     .end();
                      }
                  })

                  g2.prototype.nodfix = function () { return this.addCommand({c:'nodfix',a:arguments[0]||{}}); }
                  g2.prototype.nodfix.prototype = g2.mixin({}, g2.prototype.use.prototype, {
                      g2() {
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
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
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0})
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
                          let z = 3.5;
                          return g2().beg({x:this.x||0,y:this.y||0,scl:this.scl||1,w:this.w||0,lc:'round',lj:'round',fs:'#ccc'})
                                     .p()
                                     .m({x:6*z,y:0})
                                     .l({x:0,y:0})
                                     .l({x:0,y:6*z})
                                     .stroke()
                                     .p()
                                     .m({x:10*z,y:0})
                                     .l({x:6*z,y:3/4*z})
                                     .a({dw:-Math.PI/3,x:6*z,y:-3/4*z})
                                     .z()
                                     .m({x:0,y:10*z})
                                     .l({x:3/4*z,y:6*z})
                                     .a({dw: Math.PI/3,x:-3/4*z,y:6*z})
                                     .z()
                                     .drw()
                                     .cir({x:0,y:0,r:2.5,fs:'#ccc'})
                                     .end();
                      }
                  })

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
                   * @property {string} [State.linkfill=rgba(200,200,200,0.5)]   link fill color, semi-transparent.
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
                  g2.State.linkfill = 'rgba(200,200,200,0.5)';
                  g2.State.dimcolor = 'darkslategray';
                  g2.State.solid = [];
                  g2.State.dash = [15,10];
                  g2.State.dot = [4,4];
                  g2.State.dashdot = [25,6.5,2,6.5];
                  g2.State.labelOffset = 5;
                  g2.State.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234
    }
})

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
 * @property {string} [State.linkfill=rgba(200,200,200,0.5)]   link fill color, semi-transparent.
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
g2.State.linkfill = 'rgba(200,200,200,0.5)';
g2.State.dimcolor = 'darkslategray';
g2.State.solid = [];
g2.State.dash = [15,10];
g2.State.dot = [4,4];
g2.State.dashdot = [25,6.5,2,6.5];
g2.State.labelOffset = 5;
g2.State.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234