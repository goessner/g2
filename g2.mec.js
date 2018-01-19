/**
 * g2.mec (c) 2013-17 Stefan Goessner
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

g2.prototype.lin.prototype = {
   get dx() { return this.x2 - this.x1; },
   get dy() { return this.y2 - this.y1; },
   get len() { return Math.hypot(this.dx,this.dy); },
   pointAt: function(loc) {
      let t = loc==="beg" ? 0 
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
   hit: function({x,y,eps}) {
       let dx = this.dx, dy = this.dy, dx2 = x - this.x1, dy2 = y - this.y2,
           dot = dx*dx2 + dy*dy2, perp = dx*dy2 - dy*dx2;
       return -eps < perp && perp < eps && -eps < dot && dot < this.len;
   }
};
g2.prototype.rec.prototype = {
   dir: { c:[0,0,1],e:[1,0,1],ne:[1,1,Math.SQRT2],n:[0,1,1],nw:[-1,1,Math.SQRT2],w:[-1,0,1],sw:[-1,-1,Math.SQRT2],s:[0,-1,1],se:[1,-1,Math.SQRT2] },
   get len() { return 2*(this.b+this.h); },
   pointAt: function(loc) {
      var q = this.dir[loc || "c"] || this.dir['c'], nx = q[0], ny = q[1];
      return { x: this.x + (1 + nx)*this.b/2,
               y: this.y + (1 + ny)*this.h/2,
               dx: -ny/q[2],
               dy:  nx/q[2]
      };
   }
};
g2.prototype.cir.prototype = {
   dir: { c:[0,0],e:[1,0],ne:[Math.SQRT2/2,Math.SQRT2/2],n:[0,1],nw:[-Math.SQRT2/2,Math.SQRT2/2],w:[-1,0],sw:[-Math.SQRT2/2,-Math.SQRT2/2],s:[0,-1],se:[Math.SQRT2/2,-Math.SQRT2/2] },
   get len() { return 2*Math.PI*this.r; },
   pointAt: function(loc) {
      var q = (loc+0 === loc) ? [Math.cos(loc*2*Math.PI),Math.sin(loc*2*Math.PI)] 
                              : this.dir[loc || "c"],
          nx = q[0], ny = q[1];
      return getify({ x: ()=>this.x + nx*this.r,
                      y: ()=>this.y + ny*this.r,
                      dx: -ny, 
                      dy:  nx });
   }
};
g2.prototype.arc.prototype = {
   get len() { return Math.abs(this.r*this.dw); },
   get angle() { return this.dw/Math.PI*180; },
   pointAt: function(loc) {
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
g2.prototype.use.prototype = {
   dir: g2.prototype.cir.prototype.dir,
   get r() { return 5; },
   pointAt: g2.prototype.cir.prototype.pointAt
};

g2.prototype.vec = function vec({x1,y1,x2,y2,lw}) { return this.addCommand({c:'vec',a:arguments[0]}); }
g2.prototype.vec.create = function({x1,y1,x2,y2,lw}) {
    let z = 2, dx = x2-x1, dy = y2-y1, r = Math.hypot(dx,dy);
    return g2().beg({x:x1,y:y1,w:Math.atan2(dy,dx),lc:"round",lj:"round",fs:"@ls"})
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
g2.prototype.vec.prototype = g2.prototype.lin.prototype;

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

g2.prototype.label = function label({str,loc,off,fs,font}) {
    let idx = g2.getCmdIdx(this.commands,(cmd) => "pointAt" in cmd.a);
    if (idx) {
        let p = this.commands[idx].a.pointAt(loc),
            xoff, yoff,
            offset = (off+0 === off) ? (off || 1) // amount of offset ...
                   : (loc === "c") ? 0
                   : 5;                          // use constant ..

        if (off !== "left") offset = -offset;  // 'right of' dir ... turn dir vector negative ... default
        xoff = -p.dy*offset; yoff = p.dx*offset;

        if (str[0] === "@" && (s=this.commands[idx].a[str.substr(1)]))   // expect 's' as string convertable to a number ...
            str = "" + (Number.isInteger(+s) ? +s : Number(s).toFixed(Math.max(g2.symbol.labelSignificantDigits-Math.log10(s),0)))  // use at least 3 significant digits after decimal point.
                     + (str.substr(1) === "angle" ? "°" : "");
        return this.txt({str,x:()=>p.x+xoff,y:()=>p.y+yoff,
                         thal: ()=>xoff > 0 ? "left"   : xoff < 0 ? "right"  : "center", 
                         tval: ()=>yoff > 0 ? "bottom" : yoff < 0 ? "top"  : "middle",
                         fs:fs||'black',
                         font});
    }
    return this;
};

/*
g2.prototype.damper = function damper({x1,y1,x2,y2,h=16}) {
    let dx = x2-x1, dy = y2-y1, len = Math.hypot(dx,dy), g = g2();
    if (len <= h)
        g.lin({x1,y1,x2,y2,lc:'round',lj:'round'});
    else {
        let ux = dx/len, uy = dy/len,
            xm = (x1+x2)/2, ym = (y1+y2)/2;
        g.p()
         .m({x:x1,y:y1})
         .l({x:xm-ux*h/2,y:ym-uy*h/2})
         .m({x:xm+( ux-uy)*h/2,y:ym+( uy+ux)*h/2})
         .l({x:xm+(-ux-uy)*h/2,y:ym+(-uy+ux)*h/2})
         .l({x:xm+(-ux+uy)*h/2,y:ym+(-uy-ux)*h/2})
         .l({x:xm+( ux+uy)*h/2,y:ym+( uy-ux)*h/2})
         .m({x:xm,y:ym})
         .l({x:x2,y:y2})
         .drw({fs:"transparent",lc:"round",lj:"round"});
    }
    this.commands.push({c:'damper',a:arguments[0],g:g.commands});
    return this;
};
g2.prototype.damper.pointAt = g2.prototype.lin.pointAt;
*/

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
    let idx = mrk && g2.getCmdIdx(this.commands,(cmd) => "pointAt" in this[cmd.c]);
    if (idx) {
        let ownerArgs = this.commands[idx].a,
            p = g2.prototype[this.commands[idx].c].pointAt(Object.assign({loc:loc!==undefined?loc:0.5},ownerArgs));
            w = dir < 0 ? Math.atan2(-p.dy,-p.dx) 
            : dir > 0 ? Math.atan2( p.dy, p.dx) 
            : 0;
//        console.log('fs='+fs);
        this.use({grp:mrk,x:p.x,y:p.y,w:w,scl:ownerArgs.lw || 1,
                  ls:ls || ownerArgs.ls || 'black',fs:fs || ls || ownerArgs.ls || 'black'});
    }
    return this;
}
