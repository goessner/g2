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
 * @param {object} [p={x:0,y:0,w:0}] Center point.
 * @param {angle} w Rotation angle [rad]
 * @param {object} args Arguments object holding style properties. See 'g2.prototype.style' for details.
 * @param {float} [args.b=32] Slider breadth.
 * @param {float} [args.h=16] Slider height.
 */
g2.prototype.slider = function () { return this.addCommand({c:'slider',a:arguments[0]}); }
g2.prototype.slider.prototype = g2.mixin({},g2.prototype.rec.prototype,{
    g2() {
        let {x,y,w,b,h,lw,sh} = this;
        args = Object.assign({},{x:x,y:y,w:w,b:b,h:h},this);
        return g2().beg(args)
                   .rec({x:-b/2,y:-h/2,b:b,h:h})
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
 * @param {float} [args.h=16] Spring height.
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
 * @param {float} [args.h=16] Spring height.
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
 * @param {float} [r=25] Radius.
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
 * @param {float} [r=25] Radius.
 */
g2.prototype.pulley2 = function () { return this.addCommand({c:'pulley2',a:arguments[0]}); }
g2.prototype.pulley2.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        return g2().bar2({x1:this.x,y1:this.y-this.r+4,x2:this.x,y2:this.y+this.r-4})
                   .bar2({x1:this.x-this.r+4,y1:this.y,x2:this.x+this.r-4,y2:this.y})
                //   .cir({x:this.x,y:this.y,r:this.r,ls:"@nodcolor",fs:"#e6e6e6",lw:1})
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
 * @param {float} [r1=20] Start pulley radius. With positive radius the rope leaves the
 *                        pulley in counterclockwise direction. Negative radius
 *                        forces the rope to leave in clockwise direction (cartesian rule).
 * @param {v2} [p2={x:0,y:0}] End pulley center.
 * @param {float} [r2=20] End pulley radius. With positive radius the rope leaves the
 *                        pulley in counterclockwise direction. Negative radius
 *                        forces the rope to leave in clockwise direction (cartesian rule).
 */
g2.prototype.rope = function () { return this.addCommand({c:'rope',a:arguments[0]}); }
g2.prototype.rope.prototype = g2.mixin({}, g2.prototype.cir.prototype,{
    g2() {
        let args = this;
        let Rmin = 10;
        let R1 = this.r1 > Rmin ? this.r1 - 2.5
               : this.r1 < Rmin ? this.r1 + 2.5
               : 0;
        let R2 = this.r2 > Rmin ? this.r1 - 2.5
               : this.r2 < Rmin ? this.r1 + 2.5
               : 0;
        // THINK ABOUT A WAY TO IMPLEMENT 2 POINTS WITHOUT x1, x2, y1, y2
        return g2().bar2({x1:this.x,y1:this.y-this.r+4,x2:this.x,y2:this.y+this.r-4})
                   .bar2({x1:this.x-this.r+4,y1:this.y,x2:this.x+this.r-4,y2:this.y})
                //   .cir({x:this.x,y:this.y,r:this.r,ls:"@nodcolor",fs:"#e6e6e6",lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-2.5,ls:"#e6e6e6",fs:"transparent",lw:5})
                   .cir({x:this.x,y:this.y,r:this.r,ls:"@nodcolor",fs:"transparent",lw:1})
                   .cir({x:this.x,y:this.y,r:this.r-5,ls:"@nodcolor",fs:"transparent",lw:1})
    }
})


g2.prototype.rope = function rope(p1,r1,p2,r2,style) {
   var Rmin = 10,
       R1 = r1 >  Rmin ? r1 - 2.5
          : r1 < -Rmin ? r1 + 2.5
          : 0,
       R2 = r2 >  Rmin ? r2 - 2.5
          : r2 < -Rmin ? r2 + 2.5
          : 0,
       dx = p2.x-p1.x, dy = p2.y-p1.y, dd = dx*dx + dy*dy,
       R12 = R1+R2, l = Math.sqrt(dd - R12*R12),
       cpsi = (R12*dx + l*dy)/dd,
       spsi = (R12*dy - l*dx)/dd,
       x1 = p1.x + cpsi*R1,
       y1 = p1.y + spsi*R1,
       x2 = p2.x - cpsi*R2,
       y2 = p2.y - spsi*R2;
   return this.lin(x1,y1,x2,y2,Object.assign({ls:"#888",lw:4},style))
              .proxy(g2.prototype.lin,[x1,y1,x2,y2]);
}
/**
 * Polygon ground.
 * @method
 * @returns {object} this
 * @param {array} pts Array of points
 * @param {bool} [closed=false] Closed polygon.
 * @param {object} [args] Arguments object.
 * @param {float} [args.h=4] Ground shade line width.
 * @param {string} [args.pos=right] Ground shade position ["left","right"].
 */
g2.prototype.ground = function ground(pts,closed,args) {
   var i, p0, pp, pn, p, e0, dx, dy, ep, en, len, lam, eq = [],
       h = args && args.h || 4,
       sign = args && args.pos === "left" ? 1 : -1,
       itr =  g2.prototype.ply.itrOf(pts,args);
   p0 = pp = itr(i=0);
   eq.push(p0);
   p = itr(i=1);
   dx = p.x-pp.x; dy = p.y-pp.y; len = Math.hypot(dx,dy) || 1;
   e0 = ep = {x:dx/len,y:dy/len};
   for (pn = itr(++i); i < itr.len; pn = itr(++i)) {
      dx = pn.x-p.x; dy = pn.y-p.y; len = Math.hypot(dx,dy) || 1;
      en = {x:dx/len,y:dy/len};
      lam = (1 - en.x*ep.x - en.y*ep.y) / (ep.y*en.x - ep.x*en.y);
      eq.push({x:p.x+sign*(h+1)*(lam*ep.x - ep.y), y:p.y+sign*(h+1)*(lam*ep.y + ep.x)});
      ep = en;
      pp = p;
      p = pn;
   }
   if (closed) {
      dx = p0.x-p.x; dy = p0.y-p.y; len = Math.hypot(dx,dy) || 1;
      en = {x:dx/len,y:dy/len};
      lam = (1 - en.x*ep.x - en.y*ep.y) / (ep.y*en.x - ep.x*en.y);
      eq.push({x:p.x+sign*(h+1)*(lam*ep.x - ep.y), y:p.y+sign*(h+1)*(lam*ep.y + ep.x)});
      lam = (1 - e0.x*en.x - e0.y*en.y) / (en.y*e0.x - en.x*e0.y);
      eq[0] = {x:p0.x+sign*(h+1)*(-lam*e0.x - e0.y), y:p0.y+sign*(h+1)*(-lam*e0.y + e0.x)};
   }
   else {
      eq[0] = {x:p0.x-sign*(h+1)*e0.y, y:p0.y+sign*(h+1)*e0.x};
      eq.push({x:p.x -sign*(h+1)*ep.y, y:p.y +sign*(h+1)*ep.x});
   }
   return this.beg(Object.assign({x:-0.5,y:-0.5,ls:"@linkcolor",lw:2},args,{fs:"transparent",lc:"butt",lj:"miter"}))
                 .ply(eq,closed,{ls:"@nodfill2",lw:2*h})
                 .ply(pts,closed,args)
              .end()
};

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
g2.prototype.load = function load(pts,spacing,style) {
   function iterator(p,dlambda) {
      var ux = pn.x - p0.x, uy = pn.y - p0.y, uu = ux*ux + uy*uy,
          lam = [], dlam, lambda = -dlambda;

      for (var i = 0; i < n; i++)  // build array of projection parameters of polypoints onto base line.
         lam[i] = ((pitr(i).x - p0.x)*ux + (pitr(i).y - p0.y)*uy)/uu;

      return {
         next: function() {
            lambda += dlambda;
            for (var i = 0; i < n; i++) {
               dlam = lam[i+1] - lam[i];
               if (dlam > 0 && lam[i] <= lambda && lambda <= lam[i+1]) {
                  var mu = (lambda - lam[i])/dlam;
                  return {
                     value: {
                        p1: {x:p0.x + lambda*ux, y:p0.y + lambda*uy},
                        p2: {x:pitr(i).x + mu*(pitr(i+1).x-pitr(i).x), y:pitr(i).y + mu*(pitr(i+1).y-pitr(i).y)}
                     }
                  }
               }
            }
            return { done: true };
         }
      };
   }

   var pitr = g2.prototype.ply.itrOf(pts), n = pitr.len, p0 = pitr(0), pn = pitr(n-1),
       dlambda = spacing < 1 ? spacing : spacing/Math.hypot(pn.x-p0.x,pn.y-p0.y),
       itr = iterator(pts,dlambda), val;
   this.ply(pts,false,Object.assign({fs:"@linkfill"},style,{ls:"transparent"}));

   while (!(val = itr.next()).done)
      this.vec(val.value.p2,val.value.p1,style);

   this.proxy(g2.prototype.ply,[pts,false]);

   return this;
}

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
 * @property {number} [State.labelSignificantDigits=3]   default label's significant digits after floating point.
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

/**
 * Mechanical symbols and line markers as individual `g2` instances. Use them via `use` command.<br>
 * @namespace
 * @property {object} symbol    `g2` symbol namespace.
 * @property {object} symbol.origin   origin symbol.
 * @property {object} symbol.nod   node symbol.
 * @property {object} symbol.dblnod   double-node symbol.
 * @property {object} symbol.nodfix  fixed node / bearing symbol.
 * @property {object} symbol.dblnodfix  fixed double-node / bearing symbol.
 * @property {object} symbol.nodflt  floating node / bearing symbol.
 * @property {object} symbol.dblnodfix  floating double-node / bearing symbol.
 * @property {object} symbol.gnd  ground node symbol.
 * @property {object} symbol.pol  pole symbol.
 * @property {object} symbol.dot  dot marker symbol.
 * @property {object} symbol.sqr  square marker symbol.
 * @property {object} symbol.tilde  tilde marker symbol.
 * @property {object} symbol.arrow  arrow marker symbol.
 * @property {object} symbol.tick  tick marker symbol.
 * @property {object} symbol.arrowtick  arrow-tick marker symbol.
 */
g2.symbol = g2.symbol || {};
g2.symbol.origin = function() {
   var z = 3.5;
   return g2().beg({lc:"round",lj:"round",lw:1,fs:"@nodfill"})
                .p().m(6*z,0).l(0,0).l(0,6*z).stroke()
                .p().m(10*z,0).l(6*z,3/4*z).a(-Math.PI/3,6*z,-3/4*z).z()
                    .m(0,10*z).l(3/4*z,6*z).a( Math.PI/3,-3/4*z,6*z).z().drw()
                .cir(0,0,z)
              .end();
}();
g2.symbol.nod =    g2().cir(0,0,4,{ls:"@nodcolor",fs:"@nodfill",lwnosc:true});
g2.symbol.dblnod = g2().cir(0,0,6,{ls:"@nodcolor",fs:"@nodfill"}).cir(0,0,3,{ls:"@nodcolor",fs:"@nodfill2",lwnosc:true});
g2.symbol.nodfix = g2().style({ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                       .p()
                         .m(-8,-12)
                         .l(0,0)
                         .l(8,-12)
                       .drw({fs:"@nodfill2"})
                       .cir(0,0,4);
g2.symbol.dblnodfix = g2().style({ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                         .p()
                         .m(-8,-12)
                         .l(0,0)
                         .l(8,-12)
                       .drw({ls:"@nodcolor",fs:"@nodfill2"})
                       .cir(0,0,6,{ls:"@nodcolor",fs:"@nodfill"})
                       .cir(0,0,3,{ls:"@nodcolor",fs:"@nodfill2"});
g2.symbol.nodflt = g2().style({ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                       .p()
                         .m(-8,-12)
                         .l(0,0)
                         .l(8,-12)
                         .z()
                       .drw({fs:"@nodfill2"})
                       .cir(0,0,4,{fs:"@nodfill"})
                       .lin(-9,-19,9,-19,{ls:"@nodfill2",lw:5,lwnosc:false})
                       .lin(-9,-15.5,9,-15.5,{ls:"@nodcolor",lw:2,lwnosc:false});
g2.symbol.dblnodflt = g2().style({ls:"@nodcolor",fs:"@nodfill2",lwnosc:true})
                       .p()
                         .m(-8,-12)
                         .l(0,0)
                         .l(8,-12)
                         .z()
                       .drw()
                       .cir(0,0,6,{fs:"@nodfill"})
                       .cir(0,0,3)
                       .lin(-9,-19,9,-19,{ls:"@nodfill2",lw:5,lwnosc:false})
                       .lin(-9,-15.5,9,-15.5,{lw:2,lwnosc:false});
g2.symbol.gnd =    g2().cir(0,0,6,{ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                       .p().m(0,6).a(-Math.PI/2,6,0).l(-6,0).a(Math.PI/2,0,-6).z().fill({fs:"@nodcolor"});
g2.symbol.pol =    g2().cir(0,0,6,{ls:"@nodcolor",fs:"@nodfill",lwnosc:true})
                       .cir(0,0,2.5,{ls:"@nodcolor",fs:"@nodcolor"});
                       
g2.symbol.dot = g2().cir(0,0,1.5,{fs:"@ls",ls:"transparent"});
g2.symbol.sqr = g2().rec(-1.5,-1.5,3,3,{fs:"@ls",ls:"transparent"});
g2.symbol.tilde = g2().p().m(0,2).a(Math.PI/2,0,0).a(-Math.PI/2,0,-2).stroke({lc:"round",lwnosc:true});
g2.symbol.arrow = g2().p().m(0,0).l(-7,-2).a(Math.PI/3,-7,2).z().drw({fs:"@ls",lj:"round",lwnosc:true});
g2.symbol.tick = g2().p().m(0,-2).l(0,2).stroke({lc:"round",lwnosc:true});
g2.symbol.arrowtick = g2().p().m(0,-2).l(0,2).m(0,0).l(-7,-2).a(Math.PI/3,-7,2).z().drw({lj:"round",lc:"round"});
g2.symbol.ifo2pos = g2().style({ls:"@nodcolor",lc:"round",fs:"@ls",lw:1,lwnosc:true})
                        .p().m(0,2).a(-Math.PI/2,0,0).a(Math.PI/2,0,-2)
                            .m(6,-6).a(Math.PI/2,6,6).stroke()
                        .p().m(3,6).l(3,-2).m(3,-6).l(4,-2).a(-Math.PI/3,2,-2).z()
                            .m(7,3).a(-Math.PI/3,8.5,4).l(6,6).z()
                        .drw();
g2.symbol.ifo2neg = g2().style({ls:"@nodcolor",lj:"miter",fs:"@ls",lw:1,lwnosc:true})
                         .p().m(0,2).a(Math.PI/2,0,0).a(-Math.PI/2,0,-2)
                             .m(-6,-6).a(-Math.PI/2,-6,6).stroke()
                         .p().m(-3,-6).l(-3,5).m(-3,6).l(-4,3).a(-Math.PI/3,-2,3).z()
                             .m(-7,3).a(Math.PI/3,-8.5,4).l(-6,6).z()
                        .drw();
g2.symbol.ifo3pos = g2().style({ls:"@nodcolor",lc:"round",fs:"@ls",lw:1,lwnosc:true})
                        .p().m(0,2).a(-Math.PI/2,0,0).a(Math.PI/2,0,-2)
                            .m(6,-6).a(Math.PI/2,6,6).stroke()
                        .p().m(3,6).l(3,-2).m(3,-6).l(4,-2).a(-Math.PI/3,2,-2).z()
                            .m(7,3).a(-Math.PI/3,8.5,4).l(6,6).z()
                            .m(4,0).l(10,0).m(14,0).l(10,-1).a(Math.PI/3,10,1).z()
                        .drw();
g2.symbol.ifo3neg = g2().style({ls:"@nodcolor",lc:"round",fs:"@ls",lw:1,lwnosc:true})
                        .p().m(0,2).a(Math.PI/2,0,0).a(-Math.PI/2,0,-2)
                            .m(-6,-6).a(-Math.PI/2,-6,6).stroke()
                        .p().m(-3,-6).l(-3,5).m(-3,6).l(-4,3).a(-Math.PI/3,-2,3).z()
                            .m(-7,3).a(Math.PI/3,-8.5,4).l(-6,6).z()
                            .m(-4,0).l(-10,0).m(-14,0).l(-10,-1).a(-Math.PI/3,-10,1).z()
                        .drw();

// ======================

g2.prototype.lin.create = function() { var o = Object.create(g2.prototype.lin.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.lin.prototype = {
   constructor: function(x1,y1,x2,y2,style) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.style = style;
   },
   get dx() { return this.x2 - this.x1; },
   get dy() { return this.y2 - this.y1; },
   get len() { return Math.hypot(this.dx,this.dy); },
   p: function(loc) {
      var t = loc==="beg" ? 0 
            : loc==="end" ? 1 
            : (loc+0 === loc) ? loc 
            : 0.5,   // 'mid' ..
          len = this.len;
      return { x: this.x1 + this.dx*t,
               y: this.y1 + this.dy*t,
               dx: this.dx/len,
               dy: this.dy/len
      };
   },
};

g2.prototype.rec.create = function() { var o = Object.create(g2.prototype.rec.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.rec.prototype = {
   dir: { c:[0,0,1],e:[1,0,1],ne:[1,1,Math.SQRT2],n:[0,1,1],nw:[-1,1,Math.SQRT2],w:[-1,0,1],sw:[-1,-1,Math.SQRT2],s:[0,-1,1],se:[1,-1,Math.SQRT2] },
   constructor: function(x,y,b,h,style) {
      this.x = x;
      this.y = y;
      this.b = b;
      this.h = h;
      this.style = style;
   },
   get len() { return 2*(this.b+this.h); },
   p: function(loc) {
      var q = this.dir[loc || "c"] || this.dir['c'], nx = q[0], ny = q[1];
      return { x: this.x + (1 + nx)*this.b/2,
               y: this.y + (1 + ny)*this.h/2,
               dx: -ny/q[2],
               dy:  nx/q[2]
      };
   }
};

g2.prototype.cir.create = function() { var o = Object.create(g2.prototype.cir.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.cir.prototype = {
   dir: { c:[0,0],e:[1,0],ne:[Math.SQRT2/2,Math.SQRT2/2],n:[0,1],nw:[-Math.SQRT2/2,Math.SQRT2/2],w:[-1,0],sw:[-Math.SQRT2/2,-Math.SQRT2/2],s:[0,-1],se:[Math.SQRT2/2,-Math.SQRT2/2] },
   constructor: function(x,y,r,style) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.style = style;
   },
   get len() { return 2*Math.PI*this.r; },
   p: function(loc) {
      var q = (loc+0 === loc) ? [Math.cos(loc*2*Math.PI),Math.sin(loc*2*Math.PI)] 
                              : this.dir[loc || "c"],
          nx = q[0], ny = q[1];
      return { x: this.x + nx*this.r,
               y: this.y + ny*this.r,
               dx: -ny, 
               dy:  nx 
      };
   }
};

g2.prototype.arc.create = function() { var o = Object.create(g2.prototype.arc.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.arc.prototype = {
   constructor: function(x,y,r,w,dw,style) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.w = w;
      this.dw = dw;
      this.style = style;
   },
   get len() { return Math.abs(this.r*this.dw); },
   get angle() { return this.dw/Math.PI*180; },
   p: function(loc) {
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
   }
};

g2.prototype.ply.create = function() { var o = Object.create(g2.prototype.ply.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.ply.prototype = {
   constructor: function(pts,mode,itr,style) {
      this.pts = pts;
      this.mode = mode;
      this.itr = itr || g2.prototype.ply.itrOf(pts,style);
      this.style = style;
   },
   get n() { return this.itr.len; },
   get closed() { return this.mode === true; },
   get len() {  // cannot cache polygon length, as points might be dynamically modified ...
      var i, j, itr = this.itr, pi = itr(0), pj, n = this.n, closed = this.closed, len = 0;
      for (i=0, j=1; i < (closed ? n : n-1); i++, j=(i+1)%n) {
         pj = itr(j);
         len += Math.hypot(pj.x-pi.x, pj.y-pi.y);
         pi = pj;
      }
      return len;
   },
   // substitute locations in array 'q'.
   loc: function(loc) {
      if      (loc === "beg") loc = "#0";
      else if (loc === "end") loc = "#"+Math.max(this.n-1,0);
      else if (loc === undefined) loc = 0.5;  // "mid"
      return loc;
   },
   locs: function(q) {
      function idxarr(m,n) { var a=[]; for(var i=m;i < n;i++) a.push("#"+i); return a; }
      for (var i=0; i<q.length; i++) {
         if      (q[i] === "beg") q[i] = "#0";
         else if (q[i] === "end") q[i] = "#"+Math.max(this.n-1,0);
         else if (q[i] === "mid") q = q.splice(i,1) && q.concat(idxarr(1,Math.max(1,this.n-1)));
         else if (q[i] === "all") q = q.splice(i,1) && q.concat(idxarr(0,Math.max(1,this.n)));
         else if (q === undefined) q[i] = 0.5;
      }
      return q;
   },
   p: function(loc) {
      if (typeof loc === "string" && loc[0] === "#")
          return this.pIdx(+loc.substr(1));
      else
          return this.pPar(loc);
   },
   pIdx: function(j) {
      var closed = this.closed, n = this.n, itr = this.itr,
          i = closed ? (j-1+n)%n : Math.max(j-1,0), 
          k = closed ? (j+1)%n : Math.min(j+1,n-1), 
          pi = itr(i), pj = itr(j), pk = itr(k),
          dij = Math.hypot(pj.x - pi.x, pj.y - pi.y),
          djk = Math.hypot(pk.x - pj.x, pk.y - pj.y),
          dx = (dij > Number.EPSILON ? (pj.x - pi.x)/dij : 0) + 
               (djk > Number.EPSILON ? (pk.x - pj.x)/djk : 0), 
          dy = (dij > Number.EPSILON ? (pj.y - pi.y)/dij : 0) + 
               (djk > Number.EPSILON ? (pk.y - pj.y)/djk : 0), 
          dd = Math.hypot(dx,dy);
      return { x: pj.x,
               y: pj.y,
               dx: dd > Number.EPSILON ? dx/dd : 0, 
               dy: dd > Number.EPSILON ? dy/dd : 0
      };
   },
   pPar: function(u) {
      var i, j, itr = this.itr, pi = itr(0), pj, n = this.n, len = this.len, 
          closed = this.closed, s = 0, dx, dy, ds, su, ui;
      if (len > 0) {
         u = Math.max(0,Math.min(1,u));  // 0 <= u <= 1
         su = u*len;
         for (i=0, j=1; i <= (closed ? n : n-1); i++, j=(i+1)%n) {
            pj = itr(j);
            dx = pj.x-pi.x; 
            dy = pj.y-pi.y;
            ds = Math.hypot(dx,dy);
            if (s + ds >= su) {
               ui = (u - s/len)*len/ds;
               return { x: pi.x + ui*dx,
                        y: pi.y + ui*dy,
                        dx: dx/ds, 
                        dy: dy/ds
               };
            }
            s += ds;
            pi = pj;
        }
      }
      return itr(0);
   }
};

g2.prototype.spline.create = function() { var o = Object.create(g2.prototype.spline.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.spline.prototype = {
   constructor: function(pts,closed,style) {
      this.pts = pts;
      this.closed = closed;
      this.itr = g2.prototype.ply.itrOf(pts,style)
      this.style = style;
   },
   get n() { return this.itr.len; },
   get len() { return 1; }, // fake .. not implemented .. !
   // substitute locations in array 'q'.
   loc: function(loc) {
      if      (loc === "beg") loc = "#0";
      else if (loc === "end") loc = "#"+Math.max(this.n-1,0);
      return loc;
   },
   locs: function(q) {
      function idxarr(m,n) { var a=[]; for(var i=m;i < n;i++) a.push("#"+i); return a; }
      for (var i=0; i<q.length; i++) {
         if      (q[i] === "beg") q[i] = "#0";
         else if (q[i] === "end") q[i] = "#"+Math.max(this.n-1,0);
         else if (q[i] === "mid") q = q.splice(i,1) && q.concat(idxarr(1,Math.max(1,this.n-1)));
         else if (q[i] === "all") q = q.splice(i,1) && q.concat(idxarr(0,Math.max(1, this.closed ? this.n-1 : this.n)));
      }
      return q;
   },
   p: function(loc) {
      if (typeof loc === "string" && loc[0] === "#")
          return this.pIdx(+loc.substr(1));
      else
          return this.pIdx(0);
   },
   pIdx: function(j) {
       var pj = this.itr(j), dx, dy, dd, res;
       if (this.closed || j !== this.n-1) {
           dx = pj.x1-pj.x;
           dy = pj.y1-pj.y;
       }
       else {
           var pi = this.itr(j-1);
           dx = pj.x - pi.x2;
           dy = pj.y - pi.y2;
       }
       dd = Math.hypot(dx,dy);
       return { x: pj.x,
                y: pj.y,
                dx: dd > Number.EPSILON ? dx/dd : 0, 
                dy: dd > Number.EPSILON ? dy/dd : 0
       };
   }
};

g2.prototype.use.create = function() { var o = Object.create(g2.prototype.use.prototype); o.constructor.apply(o,arguments[0]); return o; };
g2.prototype.use.prototype = {
   dir: g2.prototype.cir.prototype.dir,
   constructor: function(g,args) {
      this.g = g;
      this.args = args;
   },
   get x() { return this.args && this.args.x || 0; },
   get y() { return this.args && this.args.y || 0; },
   get r() { return 5; },
   p: g2.prototype.cir.prototype.p
};

/*
   hatch: function hatch(val) {
      var ctx = document.createElement('canvas').getContext('2d'), 
          sz = +val[3] || 10, sz2 = (sz+1)*0.5;
      ctx.canvas.width = ctx.canvas.height = sz;
      ctx.fillStyle = val[1] || "white";
      ctx.fillRect(0,0,sz,sz);
      ctx.strokeStyle = val[0] || "black";
      ctx.lineWidth = +val[2] || 1;
      ctx.lineCap = "square";
      ctx.beginPath();
      ctx.moveTo(sz2,0.5);
      ctx.lineTo(sz+0.5,sz2);
      ctx.moveTo(0.5,sz2);
      ctx.lineTo(sz2,sz+0.5);
      ctx.stroke();
      return ctx.createPattern(ctx.canvas,'repeat');
   }
*/

/**
 * Debug helper method.
 * Convert g2 command queue to JSON formatted string.
 * @param {string} [space] Number of spaces to use for indenting JSON output.
 * @return {string} JSON string of command queue.
 */
/*
g2.prototype.dump = function(space) {
   function trace(obj) {
      var out = [],o,cmd,a,c,args;
      for (var i=0, n=obj.cmds.length; i < n; i++) {
         args = [];
         cmd = obj.cmds[i];
         a = cmd.a;
         for (var j=0,m=a && a.length || 0; j < m; j++) {
            if (typeof a[j] === "object" && a[j] instanceof g2) {
               if (a[j] !== obj) args.push(trace(a[j]));
            }
            else if (a[j] !== undefined)
               args.push(a[j]);
         }
         c = /\W*function\s+([\w\$]+)\(/.exec(cmd.c.toString())[1];
         if (args.length) {
            o = {};
            o[c] = args;
         }
         else
            o = c;
         out.push(o);
      }
      return out;
   }
   return JSON.stringify(trace(this), undefined, space);
};
*/