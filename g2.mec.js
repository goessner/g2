/**
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
 * Draw vector arrow.
 * @method
 * @returns {object} g2
 * @param {object} [p={x:0,y:0}] Start point.
 * @param {object} [r={dx:10,dy:0}] End point / direction vector in:<br>
 *                                  {x,y} absolute coordinates<br>
 *                                  {dx,dy} relative coordinates<br>
 *                                  {r,w} polar coordinates
 */
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

/**
 * Draw slider.
 * @method
 * @returns {object} g2
 * @param {number} x x-value center.
 * @param {number} y y-value center.
 * @param {angle} w Rotation angle [rad]
 * @param {number} [args.b=32] Slider breadth.
 * @param {number} [args.h=16] Slider height.
 */
g2.prototype.slider = function () { return this.addCommand({c:'slider',a:arguments[0]}); }
g2.prototype.slider.prototype = g2.mixin({},g2.prototype.rec.prototype,{
    g2() {
        let args = this;
        args.b = args.b || 32;
        args.h = args.h || 16;
        args = Object.assign({},{x:x,y:y,w:w,b:b,h:h},this);
        return g2().beg({x:args.x,y:args.y,w:args.w})
                   .rec({x:-args.b/2,y:-args.h/2,b:args.b,h:args.h})
                   .end()
    }
})

/**
 * Draw linear spring
 * @method
 * @returns {object} g2
 * @param {object} [p={x:0,y:0}] Start point.
 * @param {object} [r={dx:10,dy:0}] Spring end point / direction vector in:<br>
 *                                  {x,y} absolute coordinates<br>
 *                                  {dx,dy} relative coordinates<br>
 *                                  {r,w} polar coordinates
 * @param {object} args Arguments object holding style properties. See 'g2.prototype.style' for details.
 * @param {number} [args.h=16] Spring height.
 */
g2.prototype.spring = function () { return this.addCommand({c:'spring',a:arguments[0]}); }
g2.prototype.spring.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        let args = this;
        let x1 = 'x1' in args ? args.x1
               : 'x'  in args ? args.x
               : 0;
        let y1 = 'y1' in args ? args.y1
               : 'y'  in args ? args.y
               : 0;
        let x2 = 'x2' in args ? args.x2
               : 'dx' in args ? (x1 + args.dx)
               : 'r'  in args ? x1 + args.r*Math.cos(args.w||0)
               : x1+10;
        let y2 = 'y2' in args ? args.y2
               : 'dy' in args ? (y1 + args.dy)
               : 'r'  in args ? y1 + args.r*Math.sin(args.w||0)
               : y1;
        let len = Math.hypot(x2-x1, y2-y1);
        let xm = (x2+x1)/2;
        let ym = (y2+y1)/2;
        let h = args && args.h || 16;
        let ux = (x2-x1)/len;
        let uy = (y2-y1)/len;
        return g2().p()
                   .m({x:x1,y:y1})
                   .l({x:xm-ux*h/2,y:ym-uy*h/2})
                   .l({x:xm+(-ux/6+uy/2)*h,y:ym+(-uy/6-ux/2)*h})
                   .l({x:xm+( ux/6-uy/2)*h,y:ym+( uy/6+ux/2)*h})
                   .l({x:xm+ux*h/2,y:ym+uy*h/2})
                   .l({x:x2,y:y2})
                   .stroke({ls:"@nodcolor",args,fs:"transparent",lc:"round",lj:"round"});
    }
})

/**
 * Draw line with centered square damper symbol.
 * @method
 * @returns {object} g2
 * @param {object} [p={x:0,y:0}] Start point.
 * @param {object} [r={dx:10,dy:0}] Damper end point / direction vector in:<br>
 *                                  {x,y} absolute coordinates<br>
 *                                  {dx,dy} relative coordinates<br>
 *                                  {r,w} polar coordinates
 * @param {object} args Arguments object.
 * @param {number} [args.h=16] Spring height.
 * @param {any} [args.style] Style property. See 'g2.prototype.style' for details.
 */
g2.prototype.damper = function () { return this.addCommand({c:'damper',a:arguments[0]}); }
g2.prototype.damper.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        let args = this;
        let x1 = 'x1' in args ? args.x1
               : 'x'  in args ? args.x
               : 0;
        let y1 = 'y1' in args ? args.y1
               : 'y'  in args ? args.y
               : 0;
        let x2 = 'x2' in args ? args.x2
               : 'dx' in args ? (x1 + args.dx)
               : 'r'  in args ? x1 + args.r*Math.cos(args.w||0)
               : x1+10;
        let y2 = 'y2' in args ? args.y2
               : 'dy' in args ? (y1 + args.dy)
               : 'r'  in args ? y1 + args.r*Math.sin(args.w||0)
               : y1;
        let len = Math.hypot(x2-x1, y2-y1);
        let xm = (x2+x1)/2;
        let ym = (y2+y1)/2;
        let h = args && args.h || 16;
        let ux = (x2-x1)/len;
        let uy = (y2-y1)/len;
        return g2().p()
                   .m({x:x1,y:y1})
                   .l({x:xm-ux*h/2,y:ym-uy*h/2})
                   .m({x:xm+( ux-uy)*h/2,y:ym+( uy+ux)*h/2})
                   .l({x:xm+(-ux-uy)*h/2,y:ym+(-uy+ux)*h/2})
                   .l({x:xm+(-ux+uy)*h/2,y:ym+(-uy-ux)*h/2})
                   .l({x:xm+( ux+uy)*h/2,y:ym+( uy-ux)*h/2})
                   .m({x:xm,y:ym})
                   .l({x:x2,y:y2})
                   .stroke({ls:"@nodcolor",args,fs:"transparent",lc:"round",lj:"round"});
    }
})

/**
 * Draw polygonial link.
 * @method
 * @returns {object} this
 * @param {array} pts Array of points.
 * @param {bool} [closed = false] true:closed<br> false:non-closed.
 * @param {object} [style] Style object.
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
 * @returns {object} this
 * @param {array} pts Array of points.
 * @param {bool} [closed = false] true:closed<br> false:non-closed.
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
 * @returns {object} this
 * @param {array} pts Array of points.
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
 * @returns {object} this
 * @param {array} pts Array of points.
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
 * @returns {object} this
 * @param {v2} [p={x:0,y:0}] Start point.
 * @param {v2} [r={dx:10,dy:0}] Bar vector in absolute {x,y}, relative {dx,dy} or polar {r,w} coordinates.
 * @param {object} [style] Style object.
 */
g2.prototype.bar = function () { return this.addCommand({c:'bar',a:arguments[0]}); }
g2.prototype.bar.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        let args = this;
        let x1 = 'x1' in args ? args.x1
               : 'x'  in args ? args.x
               : 0;
        let y1 = 'y1' in args ? args.y1
               : 'y'  in args ? args.y
               : 0;
        let x2 = 'x2' in args ? args.x2
               : 'dx' in args ? (x1 + args.dx)
               : 'r'  in args ? x1 + args.r*Math.cos(args.w||0)
               : x1+10;
        let y2 = 'y2' in args ? args.y2
               : 'dy' in args ? (y1 + args.dy)
               : 'r'  in args ? y1 + args.r*Math.sin(args.w||0)
               : y1;
        return g2().lin({...this,ls:'@linkcolor',lw:6,lc:'round'});
    }
})

/**
 * Draw bar.
 * @method
 * @returns {object} this
 * @param {v2} [p={x:0,y:0}] Start point.
 * @param {v2} [r={dx:10,dy:0}] Bar end point in absolute {x,y} or vector in relative {dx,dy} or polar {r,w} coordinates.
 */
g2.prototype.bar2 = function () { return this.addCommand({c:'bar2',a:arguments[0]}); }
g2.prototype.bar2.prototype = g2.mixin({}, g2.prototype.lin.prototype,{
    g2() {
        let args = this;
        let x1 = 'x1' in args ? args.x1
               : 'x'  in args ? args.x
               : 0;
        let y1 = 'y1' in args ? args.y1
               : 'y'  in args ? args.y
               : 0;
        let x2 = 'x2' in args ? args.x2
               : 'dx' in args ? (x1 + args.dx)
               : 'r'  in args ? x1 + args.r*Math.cos(args.w||0)
               : x1+10;
        let y2 = 'y2' in args ? args.y2
               : 'dy' in args ? (y1 + args.dy)
               : 'r'  in args ? y1 + args.r*Math.sin(args.w||0)
               : y1;
        return g2().lin({x1:x1,y1:y1,x2:x2,y2:y2,ls:'@nodcolor',lw:7,lc:'round'})
                   .lin({x1:x1,y1:y1,x2:x2,y2:y2,ls:'@nodfill2',lw:4.5,lc:'round'})
                   .lin({x1:x1,y1:y1,x2:x2,y2:y2,ls:'@nodfill',lw:2,lc:'round'});
    }
})

/**
 * Draw pulley.
 * @method
 * @returns {object} this
 * @param {v2} [p={x:0,y:0}] Center point.
 * @param {number} [r=25] Radius.
 */
g2.prototype.pulley = function () { return this.addCommand({c:'pulley',a:arguments[0]}); }
g2.prototype.pulley.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        return g2().cir({x:this.x,y:this.y,r:this.r,ls:"@nodcolor",fs:"#e6e6e6",lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-5,ls:"@nodcolor",fs:"#e6e6e6",lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-6,ls:"#8e8e8e",fs:"transparent",lw:2})
                   .cir({x:this.x,y:this.y,r:this.r-8,ls:"#aeaeae",fs:"transparent",lw:2})
                   .cir({x:this.x,y:this.y,r:this.r-10,ls:"#cecece",fs:"transparent",lw:2})
    }
})


/**
 * Draw alternate pulley.
 * @method
 * @returns {object} this
 * @param {object} [pos={x:0,y:0,w:0}] Center point position and rotation angle.
 * @param {number} [r=25] Radius.
 */
g2.prototype.pulley2 = function () { return this.addCommand({c:'pulley2',a:arguments[0]}); }
g2.prototype.pulley2.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        return g2().bar2({x1:this.x,y1:this.y-this.r+4,x2:this.x,y2:this.y+this.r-4})
                   .bar2({x1:this.x-this.r+4,y1:this.y,x2:this.x+this.r-4,y2:this.y})
                   .cir({x:this.x,y:this.y,r:this.r-2.5,ls:"#e6e6e6",fs:"transparent",lw:5})
                   .cir({x:this.x,y:this.y,r:this.r,ls:"@nodcolor",fs:"transparent",lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-5,ls:"@nodcolor",fs:"transparent",lw:1})
    }
})
/**
 * Draw rope. Amount of pulley radii must be greater than 10 units. They are forced to zero otherwise.
 * @method
 * @returns {object} this
 * @param {v2} [p1={x:0,y:0}] Start pulley center.
 * @param {number} [r1=20] Start pulley radius. With positive radius the rope leaves the
 *                        pulley in counterclockwise direction. Negative radius
 *                        forces the rope to leave in clockwise direction (cartesian rule).
 * @param {v2} [p2={x:0,y:0}] End pulley center.
 * @param {number} [r2=20] End pulley radius. With positive radius the rope leaves the
 *                        pulley in counterclockwise direction. Negative radius
 *                        forces the rope to leave in clockwise direction (cartesian rule).
 */
g2.prototype.rope = function () { return this.addCommand({c:'rope',a:arguments[0]}); }
g2.prototype.rope.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        let args = this;
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
               : 'r'  in args ? x1 + args.r*Math.cos(args.w||0)
               : x1+10;
        let y2 = 'p2' in args ? args.p2.y
               : 'y2' in args ? args.y2
               : 'dy' in args ? (y1 + args.dy)
               : 'r'  in args ? y1 + args.r*Math.sin(args.w||0)
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
 * @returns {object} this
 * @param {array} pts Array of points
 * @param {bool} [closed=false] Closed polygon.
 * @param {object} [args] Arguments object.
 * @param {number} [args.h=4] Ground shade line width.
 * @param {string} [args.pos=right] Ground shade position ["left","right"].
 */
g2.prototype.ground = function () { return this.addCommand({c:'ground',a:arguments[0]}); }
g2.prototype.ground.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        // OBVIOUS TODO HERE!
        let args = this;
        return g2().ply({pts:args.pts,closed:false,ls:'@linkcolor',fs:'transparent',lw:2,lc:'butt',lj:'miter'})
                  // .ply({pts:gnd,closed:false,ls:'rgba(100,100,100,0.5)'/*@nodfill2*/,fs:'transparent',lw:2*h,lc:'butt',lj:'miter'})
}})
// g2.prototype.ground = function ground(pts,closed,args) {
//    var i, p0, pp, pn, p, e0, dx, dy, ep, en, len, lam, eq = [],
//        h = args && args.h || 4,
//        sign = args && args.pos === "left" ? 1 : -1,
//        itr =  g2.prototype.ply.itrOf(pts,args);
//    p0 = pp = itr(i=0);
//    eq.push(p0);
//    p = itr(i=1);
//    dx = p.x-pp.x; dy = p.y-pp.y; len = Math.hypot(dx,dy) || 1;
//    e0 = ep = {x:dx/len,y:dy/len};
//    for (pn = itr(++i); i < itr.len; pn = itr(++i)) {
//       dx = pn.x-p.x; dy = pn.y-p.y; len = Math.hypot(dx,dy) || 1;
//       en = {x:dx/len,y:dy/len};
//       lam = (1 - en.x*ep.x - en.y*ep.y) / (ep.y*en.x - ep.x*en.y);
//       eq.push({x:p.x+sign*(h+1)*(lam*ep.x - ep.y), y:p.y+sign*(h+1)*(lam*ep.y + ep.x)});
//       ep = en;
//       pp = p;
//       p = pn;
//    }
//    if (closed) {
//       dx = p0.x-p.x; dy = p0.y-p.y; len = Math.hypot(dx,dy) || 1;
//       en = {x:dx/len,y:dy/len};
//       lam = (1 - en.x*ep.x - en.y*ep.y) / (ep.y*en.x - ep.x*en.y);
//       eq.push({x:p.x+sign*(h+1)*(lam*ep.x - ep.y), y:p.y+sign*(h+1)*(lam*ep.y + ep.x)});
//       lam = (1 - e0.x*en.x - e0.y*en.y) / (en.y*e0.x - en.x*e0.y);
//       eq[0] = {x:p0.x+sign*(h+1)*(-lam*e0.x - e0.y), y:p0.y+sign*(h+1)*(-lam*e0.y + e0.x)};
//    }
//    else {
//       eq[0] = {x:p0.x-sign*(h+1)*e0.y, y:p0.y+sign*(h+1)*e0.x};
//       eq.push({x:p.x -sign*(h+1)*ep.y, y:p.y +sign*(h+1)*ep.x});
//    }
//    return this.beg(Object.assign({x:-0.5,y:-0.5,ls:"@linkcolor",lw:2},args,{fs:"transparent",lc:"butt",lj:"miter"}))
//                  .ply(eq,closed,{ls:"@nodfill2",lw:2*h})
//                  .ply(pts,closed,args)
//               .end()
// };

/**
 * Polygonial line load. The first and last point define the base line onto which
 * the load is acting orthogonal.
 * @method
 * @returns {object} this
 * @param {array} pts Array of load contour points.
 * @param {real} spacing Spacing of the vectors drawn as a positive real number, interprete as<br>
 *                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>
 *                       * spacing &gt; 1: length of spacing.
 * @param {object} [style] Arguments object.
 */
g2.prototype.load = function () { return this.addCommand({c:'load',a:arguments[0]}); }
g2.prototype.load.prototype = g2.mixin({}, g2.prototype.ply.prototype,{
    g2() {
        let args = this;
        // OBVIOUS TODO HERE!!
        return g2().ply({pts:args.pts, closed:true,ls:'transparent',fs:'@linkfill'})
                  // .ply({pts:gnd,closed:false,ls:'rgba(100,100,100,0.5)'/*@nodfill2*/,fs:'transparent',lw:2*h,lc:'butt',lj:'miter'})
}})

// g2.prototype.load = function load(pts,spacing,style) {
//    function iterator(p,dlambda) {
//       var ux = pn.x - p0.x, uy = pn.y - p0.y, uu = ux*ux + uy*uy,
//           lam = [], dlam, lambda = -dlambda;

//       for (var i = 0; i < n; i++)  // build array of projection parameters of polypoints onto base line.
//          lam[i] = ((pitr(i).x - p0.x)*ux + (pitr(i).y - p0.y)*uy)/uu;

//       return {
//          next: function() {
//             lambda += dlambda;
//             for (var i = 0; i < n; i++) {
//                dlam = lam[i+1] - lam[i];
//                if (dlam > 0 && lam[i] <= lambda && lambda <= lam[i+1]) {
//                   var mu = (lambda - lam[i])/dlam;
//                   return {
//                      value: {
//                         p1: {x:p0.x + lambda*ux, y:p0.y + lambda*uy},
//                         p2: {x:pitr(i).x + mu*(pitr(i+1).x-pitr(i).x), y:pitr(i).y + mu*(pitr(i+1).y-pitr(i).y)}
//                      }
//                   }
//                }
//             }
//             return { done: true };
//          }
//       };
//    }
//
//    var pitr = g2.prototype.ply.itrOf(pts), n = pitr.len, p0 = pitr(0), pn = pitr(n-1),
//        dlambda = spacing < 1 ? spacing : spacing/Math.hypot(pn.x-p0.x,pn.y-p0.y),
//        itr = iterator(pts,dlambda), val;
//    this.ply(pts,false,Object.assign({fs:"@linkfill"},style,{ls:"transparent"}));

//    while (!(val = itr.next()).done)
//       this.vec(val.value.p2,val.value.p1,style);

//    this.proxy(g2.prototype.ply,[pts,false]);

//    return this;
// }

g2.prototype.pol = function () { return this.addCommand({c:'pol',a:arguments[0]}); }
g2.prototype.pol.prototype = g2.mixin({}, {
    g2() {
        let args = this;
        return g2().cir({x:args.x,y:args.y,r:6,fs:"@nodfill"})
                   .cir({x:args.x,y:args.y,r:2.5,fs:"@ls",ls:"transparent"});
    }
 });

 g2.prototype.gnd = function () { return this.addCommand({c:'gnd',a:arguments[0]}); }
 g2.prototype.gnd.prototype = g2.mixin({}, {
     g2() {
         let args = this;
         return g2().beg({x:args.x,y:args.y})
                    .cir({x:0,y:0,r:6,ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                    .p()
                    .m({x:0,y:6})
                    .a({dw:Math.PI/2,x:-6,y:0})
                    .l({x:6,y:0})
                    .a({dw:-Math.PI/2,x:0,y:-6})
                    .z()
                    .fill({fs:"@nodcolor"})
                    .end();
    }
});

g2.prototype.nod = function () { return this.addCommand({c:'nod',a:arguments[0]}); }
g2.prototype.nod.prototype = g2.mixin({}, {
    g2() {
        let args = this;
        return g2().cir({x:args.x,y:args.y,r:4,ls:"@nodcolor",fs:"@nodfill",lwnosc:true});
    }
});

g2.prototype.dblnod = function () { return this.addCommand({c:'dblnod',a:arguments[0]}); }
g2.prototype.dblnod.prototype = g2.mixin({}, {
    g2() {
        let args = this;
        return g2().cir({x:args.x,y:args.y,r:6,ls:"@nodcolor",fs:"@nodfill"})
                   .cir({x:args.x,y:args.y,r:3,ls:"@nodcolor",fs:"@nodfill2",lwnosc:true});
    }
});

g2.prototype.nodfix = function () { return this.addCommand({c:'nodfix',a:arguments[0]}); }
g2.prototype.nodfix.prototype = g2.mixin({}, {
    g2() {
        let args = this;
        return g2().beg({x:args.x,y:args.y})
                   .p()
                   .m({x:-8,y:-12})
                   .l({x:0,y:0})
                   .l({x:8,y:-12})
                   .drw({ls:"@nodcolor",fs:"@nodfill2"})
                   .cir({x:0,y:0,r:4,ls:"@nodcolor",fs:"@nodfill"})
                   .end();
    }
});

g2.prototype.nodflt = function () { return this.addCommand({c:'nodflt',a:arguments[0]}); }
g2.prototype.nodflt.prototype = g2.mixin({}, {
    g2() {
        let args = this;
        return g2().beg({x:args.x,y:args.y})
                   .p()
                   .m({x:-8,y:-12})
                   .l({x:0,y:0})
                   .l({x:8,y:-12})
                   .drw({ls:"@nodcolor",fs:"@nodfill2"})
                   .cir({x:0,y:0,r:4,ls:"@nodcolor",fs:"@nodfill"})
                   .lin({x1:-9,y1:-19,x2:9,y2:-19,ls:"@nodfill2",lw:5,lwnosc:false})
                   .lin({x1:-9,y1:-15.5,x2:9,y2:-15.5,ls:"@nodcolor",lw:2,lwnosc:false})
                   .end();
    }
});

g2.prototype.origin = function () { return this.addCommand({c:'origin',a:arguments[0]}); }
g2.prototype.origin.prototype = g2.mixin({}, {
    g2() {
        args = this;
        let z = 3.5;
        return g2().beg({x:args.x,y:args.y,lc:"round",lj:"round",fs:"@ls"})
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
                   .cir({x:0,y:0,r:2.5})
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
g2.State.nodcolor = "#333";
g2.State.nodfill  = "#dedede";
g2.State.nodfill2 = "#aeaeae";
g2.State.linkcolor = "#666";
g2.State.linkfill = "rgba(200,200,200,0.5)";
g2.State.dimcolor = "darkslategray";
g2.State.solid = [];
g2.State.dash = [15,10];
g2.State.dot = [4,4];
g2.State.dashdot = [25,6.5,2,6.5];
g2.State.labelOffset = 5;
g2.State.labelSignificantDigits = 3;  //  0.1234 => 0.123,  0.01234 => 0.0123, 1.234 => 1.23, 12.34 => 12.3, 123.4 => 123, 1234 => 1234