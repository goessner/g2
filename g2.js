/**
 * g2 (c) 2013-16 Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 * 
 */
/* jshint -W014 */
/* jshint -W030 */

/**
 * Create a queue of 2D graphics commands.
 * @param {object} [opts] Custom options object. It is simply copied into the 'g2' object for later individual use.
 * @returns {object} g2
 * @example
 * // How to use g2()
 * var ctx = document.getElementById("c").getContext("2d");
 * g2()                  // Create 'g2' instance.
 *  .lin(50,50,100,100)  // Append ...
 *  .lin(100,100,200,50) // ... commands.
 *  .exe(ctx);           // Execute commands addressing canvas context.
 */
function g2() {
   if (this instanceof g2) {
      if (arguments) Object.assign(this,arguments[0]);
      this.cmds = [];
      this.curIdx = false;
      return this;
   }
   else
      return g2.apply(Object.create(g2.prototype),arguments);
}

/**
 * Add command to command queue.
 * @private
 */
g2.prototype.addCmd = function addCmd(cmd) { this.cmds.push(cmd); return this; };

/**
 * Get current command.
 * @private
 */
Object.defineProperty(g2.prototype, "curCmd", {
    get: function () { return this.curIdx !== false ? this.cmds[this.curIdx] : null; } }
);

/**
 * State stack.
 * Lazy getter (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get)
 * @type {object}
 * @const
 * @private
 */
Object.defineProperty(g2.prototype, "state", {
   get: function () { return this._state || (this._state = g2.State.create(this)); },
   set: function (val) { this._state = val; }
});

/**
 * Set the view's cartesian mode flag (immediate state modifier - no command).<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#cartesian)
 * @method
 * @returns {object} g2
 * @param {bool} [on=true] Cartesian flag. Set it off by 'false'. Any other value is interpreted as 'true'.
 */
g2.prototype.cartesian = function cartesian(on) {
   this.state.cartesian = (on !== false);
   return this;
};

/**
 * Pan the view by a relative displacement vector (immediate state modifier - no command).<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#pan)
 * @method
 * @returns {object} g2
 * @param {float} dx pan x-value in device units.
 * @param {float} dy pan y-value in device units.
 */
g2.prototype.pan = function pan(dx,dy) {
   this.state.trf0.x += dx;
   this.state.trf0.y += dy;
   return this;
};

/**
 * Zoom the view by a scaling factor with respect to center (immediate state modifier - no command).<br>
 * Scaling is performed relative to current scale.<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#zoom)
 * @method
 * @returns {object} g2
 * @param {float} scl Relative scaling factor.
 * @param {float} [x=0] x-component of zoom center in device units.
 * @param {float} [y=0] y-component of zoom center in device units.
 */
g2.prototype.zoom = function zoom(scl,x,y) {
   this.state.trf0.x = (1-scl)*(x||0) + scl*this.state.trf0.x;
   this.state.trf0.y = (1-scl)*(y||0) + scl*this.state.trf0.y;
   this.state.trf0.scl *= scl;
   return this;
};

/**
 * Set the view by placing origin coordinates and scaling factor in device units.  
 * Cartesian flag is not affected (immediate state modifier - no command).<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#view)  
 * @method
 * @returns {object} g2
 * @param {float} [x=0] x-origin in device units.
 * @param {float} [y=0] y-origin in device units.
 * @param {float} [scl=1] Absolute scaling factor.
 */
g2.prototype.view = function view(x,y,scl) {
   this.state.trf0.x  = x;
   this.state.trf0.y = y;
   this.state.trf0.scl = scl;
   return this;
};

/**
 * Delete all commands. Does not modify view state. (no command)<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#del)
 * @method
 * @returns {object} g2
 */
g2.prototype.del = function del() { // see http://jsperf.com/truncating-arrays-correctly
   this.cmds.length = 0;
   return this;
};

// Path commands
/**
 * Get current path point from previous command object.
 * @private
 */
g2.prototype._curPnt = function() {
   var lastcmd = this.cmds.length && this.cmds[this.cmds.length-1] || false;
   return lastcmd && (lastcmd.cp || lastcmd.a);
};

/**
 * Begin new path.<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @returns {object} g2
 */
g2.prototype.p = function p() {
   return this.addCmd({c:p});
};

/**
 * Move to point.<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @returns {object} g2
 * @param {float} x Move to x coordinate
 * @param {float} y Move to y coordinate
 */
g2.prototype.m = function m(x,y) {
   return this.addCmd({c:m,a:[x,y]});
};

/**
 * Create line segment to point.<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @returns {object} g2
 * @param {float} x x coordinate of target point.
 * @param {float} y y coordinate of target point.
 * @example
 * g2().p()          // Begin path.
 *     .m(0,50)      // Move to point.
 *     .l(300,0)     // Line segment to point.
 *     .l(400,100)   // ...
 *     .stroke()     // Stroke path.
 *     .exe(ctx);    // Render to context.
 */
g2.prototype.l = function l(x,y) {
   return this.addCmd({c:l,a:[x,y]});
};

/**
 * Create quadratic bezier curve segment to point.<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @returns {object} g2
 * @param {float} x1 x coordinate of control point.
 * @param {float} y1 y coordinate of control point.
 * @param {float} x x coordinate of target point.
 * @param {float} y y coordinate of target point.
 * @example
 * g2().p()               // Begin path.
 *     .m(0,0)            // Move to point.
 *     .q(200,200,400,0)  // Quadratic bezier curve segment.
 *     .stroke()          // Stroke path.
 *     .exe(ctx);         // Render to context.
 */
g2.prototype.q = function q(x1,y1,x,y) {
   return this.addCmd({c:q,a:[x1,y1,x,y],cp:[x,y]});
};

/**
 * Create cubic bezier curve to point.<br>
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @returns {object} g2
 * @param {float} x1 x coordinate of first control point.
 * @param {float} y1 y coordinate of first control point.
 * @param {float} x2 x coordinate of second control point.
 * @param {float} y2 y coordinate of second control point.
 * @param {float} x x coordinate of target point.
 * @param {float} y y coordinate of target point.
 * @example
 * g2().p()                        // Begin path.
 *     .m(0,100)                   // Move to point.
 *     .c(100,200,200,0,400,100)   // Create cubic bezier curve.
 *     .stroke()                   // Stroke path.
 *     .exe(ctx);                  // Render to canvas context.
 */
g2.prototype.c = function c(x1,y1,x2,y2,x,y) {
   return this.addCmd({c:c,a:[x1,y1,x2,y2,x,y],cp:[x,y]});
};

/**
 * Draw arc with angular range to target point.<br>
 * ![Example](img/a.png "Example")
 * @method
 * @returns {object} g2
 * @param {float} dw Angular range in radians.
 * @param {float} x x coordinate of target point.
 * @param {float} y y coordinate of target point.

 * @example
 * var g = g2();    // Create g2 object.
 * g2().p()            // Begin path.
 *     .m(50,50)       // Move to point.
 *     .a(2,300,100)   // Create cubic bezier curve.
 *     .stroke()       // Stroke path.
 *     .exe(ctx);      // Render to canvas context.
 */
g2.prototype.a = function a(dw,x,y) {
   var p1 = this._curPnt(), pi2 = 2*Math.PI;
   if (p1 && (dw > Number.EPSILON && dw < pi2 || dw < -Number.EPSILON && dw > -pi2)) {
      var dx = x-p1[0], dy = y-p1[1], tw2 = Math.tan(dw/2),
          rx = dx/2 - dy/tw2/2, ry = dy/2 + dx/tw2/2,
          w = Math.atan2(-ry,-rx);
      return this.addCmd({c:a,a:[p1[0]+rx,p1[1]+ry,Math.hypot(rx,ry),w,w+dw,dw<0],cp:[x,y]});
   }
   else  // draw a straight line instead ...
      return this.addCmd({c:g2.prototype.l,a:[x,y]});
};

/**
 * Close current path by straight line.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @returns {object} g2
 */
g2.prototype.z = function z() {
   return this.addCmd({c:z});
};

// stroke, fill, draw
/**
 * Stroke the current path or path object.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @param {object} [style=undefined] Style properties. See 'g2.style' for details.
 * @param {string} [d = undefined] SVG path definition string. Current path is ignored then.
 * @returns {object} g2
 */
g2.prototype.stroke = function stroke(style,d) {
   var args = (style === undefined && d === undefined) ? false  // no args
            : (typeof style === "string") ? [null,style]     // svg path string as single argument
            : (typeof style === "object" && !d) ? [style]    // style object as single argument
            : [style,d];                                     // both arguments
   return this.addCmd(args?{c:stroke,a:args}:{c:stroke});
};

/**
 * Fill the current path or path object.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @param {object} [style=undefined] Style properties. See 'g2.style' for details.
 * @param {string} [d = undefined] SVG path definition string. Current path is ignored then.
 * @returns {object} g2
 */
g2.prototype.fill = function fill(style,d) {
   var args = (style === undefined && d === undefined) ? false  // no args
            : (typeof style === "string") ? [null,style]     // svg path string as single argument
            : (typeof style === "object" && !d) ? [style]    // style object as single argument
            : [style,d];                                     // both arguments
   return this.addCmd(args?{c:fill,a:args}:{c:fill});
};

/**
 * Shortcut for stroke and fill the current path or path object.
 * In case of shadow style, only the path interior creates shadow, not also the path contour.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#path)
 * @method
 * @param {object} [style=undefined] Style properties. See 'g2.style' for details.
 * @param {string} [d = undefined] SVG path definition string.  Current path is ignored then.
 * @returns {object} g2
 */
g2.prototype.drw = function drw(style,d) {
   var args = (style === undefined && d === undefined) ? []  // no args
            : (typeof style === "string") ? [null,style]     // svg path string as single argument
            : (typeof style === "object" && !d) ? [style]    // style object as single argument
            : [style,d];                                     // both arguments
   return this.addCmd({c:drw,a:args});
};

// Graphics elements
/**
 * Draw text string at anchor point.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#txt)
 * @method
 * @returns {object} g2
 * @param {string} s Text string.
 * @param {float} [x=0] x coordinate of text anchor position.
 * @param {float} [y=0] y coordinate of text anchor position.
 * @param {float} [w=0] w Rotation angle about anchor point with respect to positive x-axis.
 * @param {object} [style=undefined] args Object with styling values.
 */
g2.prototype.txt = function txt(s,x,y,w,style) {
   return this.addCmd({c:txt,a:[s,x||0,y||0,w||0,style]});
};

/**
 * Draw image. The command queue will not be executed until all images have been completely loaded.
 * This also applies to images of reused g2 objects. If an image can not be loaded, it will be replaced by a broken-image symbol.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#img)
 * @method
 * @returns {object} g2
 * @param {string} uri Image uri or data:url.
 * @param {float} [x=0] X-coordinate of image (upper left).
 * @param {float} [y=0] Y-coordinate of image (upper left).
 * @param {float} [b = undefined] Width.
 * @param {float} [h = undefined] Height.
 * @param {float} [xoff = undefined] X-offset.
 * @param {float} [yoff = undefined] Y-offset.
 * @param {float} [dx = undefined] Region x.
 * @param {float} [dy = undefined] Region y.
 */
g2.prototype.img = function img(uri,x,y,b,h,xoff,yoff,dx,dy) {
   var image = new Image(), state = this.state;
   state.loading++;
   image.onload = function load() { state.loaded(); };
   image.onerror = function() { image.src = g2.prototype.img.broken;  };
   image.src = uri;
   return this.addCmd({c:img,a:[image,(x+0.5)||0,(y+0.5)||0,b,h,xoff,yoff,dx,dy]});
};
g2.prototype.img.broken = "data:image/gif;base64,R0lGODlhHgAeAKIAAAAAmWZmmZnM/////8zMzGZmZgAAAAAAACwAAAAAHgAeAEADimi63P5ryAmEqHfqPRWfRQF+nEeeqImum0oJQxUThGaQ7hSs95ezvB4Q+BvihBSAclk6fgKiAkE0kE6RNqwkUBtMa1OpVlI0lsbmFjrdWbMH5Tdcu6wbf7J8YM9H4y0YAE0+dHVKIV0Efm5VGiEpY1A0UVMSBYtPGl1eNZhnEBGEck6jZ6WfoKmgCQA7";
/**
 * Draw line by start point and end point.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#lin)
 * @method
 * @returns {object} g2
 * @param {float} x1 Start x coordinate.
 * @param {float} y1 Start y coordinate.
 * @param {float} x2 End x coordinate.
 * @param {float} y2 End y coordinate.
 * @param {object} [style] Style properties. See 'g2.style' for details.
 * @example
 * g2().lin(10,10,190,10)  // Draw line.
 *     .exe(ctx);          // Render to context.
 */
g2.prototype.lin = function lin(x1,y1,x2,y2,style) {
   return this.addCmd({c:lin,a:[x1,y1,x2,y2,style]});
};

/**
 * Draw rectangle by anchor point and dimensions.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#rec)
 * @method
 * @returns {object} g2
 * @param {float} x x-value upper left corner.
 * @param {float} y y-value upper left corner.
 * @param {float} b Width.
 * @param {float} h Height.
 * @param {object} [style] Style properties. See 'g2.style' for details.
 * @example
 * g2().rec(100,80,40,30)  // Draw rectangle.
 *     .exe(ctx);          // Render to context.
 */
g2.prototype.rec = function rec(x,y,b,h,style) {
   return this.addCmd({c:rec,a:[x,y,b,h,style]});
};

/**
 * Draw circle by center and radius.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#cir)
 * @method
 * @returns {object} g2
 * @param {float} x x-value center.
 * @param {float} y y-value center.
 * @param {float} r Radius.
 * @param {object} [style] Style properties. See 'g2.style' for details.
 * @example
 * g2().cir(100,80,20)  // Draw circle.
 *     .exe(ctx);       // Render to context.
 */
g2.prototype.cir = function cir(x,y,r,style) {
   return this.addCmd({c:cir,a:[x,y,r,style]});
};

/**
 * Draw arc by center point, radius, start angle and angular range.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#arc)  
 * ![Example](../img/arc.png "Example")
 * @method
 * @returns {object} g2
 * @param {float} x x-value center.
 * @param {float} y y-value center.
 * @param {float} r Radius.
 * @param {float} [w=0] Start angle (in radian).
 * @param {float} [dw=2*pi] Angular range in Radians.
 * @param {object} [style] Style properties. See 'g2.style' for details.
 * @example
 * g2().arc(300,400,390,-Math.PI/4,-Math.PI/2)
 *     .exe(ctx);
 */
g2.prototype.arc = function arc(x,y,r,w,dw,style) {
   return this.addCmd({c:arc,a:[x,y,r,w||0,dw||2*Math.PI,style]});
};

/**
 * Draw polygon by points.
 * Using iterator function for getting points from array by index.
 * It must return current point object {x,y} or object {done:true}.
 * Default iterator expects sequence of x/y-coordinates as a flat array [x,y,...],
 * array of [[x,y],...] arrays or array of [{x,y},...] objects.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#ply)
 * @method
 * @returns {object} this
 * @param {array} parr Array of points.
 * @param {bool|'split'} [mode = false] true:closed, false:non-closed, 'split:intermittend lines.
 * @param {object} args Arguments object.
 * @param {function} [args.itr] Iterator function getting array and point index as parameters.
 * @param {any} [args.style] Style property. See 'g2.style' for details. 
 * @example
 * g2().ply([100,50,120,60,80,70]),
 *     .ply([150,60],[170,70],[130,80]],true),
 *     .ply({x:160,y:70},{x:180,y:80},{x:140,y:90}],'split'),
 *     .exe(ctx);
 */
g2.prototype.ply = function ply(pts,mode,args) {
   var itr = ply.itrOf(pts,args);
   if (itr)
      this.addCmd({c:ply,a:[pts,mode,itr,args]});
   return this;
};
// predefined spline point iterators
g2.prototype.ply.iterators = {
   "x,y":   function(pts) { function pitr(i) { return {x:pts[2*i],y:pts[2*i+1]}; }; pitr.len = pts.length/2; return pitr; },
   "[x,y]": function(pts) { function pitr(i) { return {x:pts[i][0],y:pts[i][1]}; }; pitr.len = pts.length;   return pitr; },
   "{x,y}": function(pts) { function pitr(i) { return pts[i]; };                    pitr.len = pts.length;   return pitr; }
};
g2.prototype.ply.itrOf = function(pts,args) {
   return !(pts && pts.length) ? undefined
          : args && typeof args.itr === "function" ? args.itr(pts)
          : typeof pts[0] === "number" ? g2.prototype.ply.iterators["x,y"](pts)
          : Array.isArray(pts[0]) && pts[0].length >= 2 ? g2.prototype.ply.iterators["[x,y]"](pts)
          : typeof pts[0] === "object" && "x" in pts[0] && "y" in pts[0] ? g2.prototype.ply.iterators["{x,y}"](pts)
          : undefined;
};

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
g2.prototype.spline = function spline(p,closed,style) {
   var pi = g2.prototype.ply.itrOf(p,style);  // points iterator ...
   if (pi) {
      var b = [], i, n = pi.len, 
          p1, p2, p3, p4, d1, d2, d3, d1d2, d2d3, scl2, scl3, den2, den3;

      for (var i=0; i < (closed ? n : n-1); i++) {
         if (i === 0) {
            p1 = closed ? pi(n-1) : {x:2*pi(0).x-pi(1).x, y:2*pi(0).y-pi(1).y};
            p2 = pi(0);
            p3 = pi(1);
            p4 = n === 2 ? (closed ? pi(0) : {x:2*pi(1).x-pi(0).x, y:2*pi(1).y-pi(0).y}) : pi(2);
            d1 = Math.max(Math.hypot(p2.x-p1.x,p2.y-p1.y),Number.EPSILON);  // don't allow ..
            d2 = Math.max(Math.hypot(p3.x-p2.x,p3.y-p2.y),Number.EPSILON);  // zero point distances ..
         }
         else {
            p1 = p2;
            p2 = p3;
            p3 = p4;
            p4 = (i === n-2) ? (closed ? pi(0) : {x:2*pi(n-1).x-pi(n-2).x, y:2*pi(n-1).y-pi(n-2).y})
               : (i === n-1) ? pi(1)
               : pi(i+2);
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
      b.push(closed ? {x:pi(0).x,y:pi(0).y} : {x:pi(n-1).x,y:pi(n-1).y});
      this.addCmd({c:spline,a:[b,closed,style]});
   }
   return this;
}

/**
 * Begin subcommands. Current state is saved. 
 * Optionally apply transformation or style properties.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#beg-end)
 * @method
 * @returns {object} g2
 * @param {object} args Arguments object.
 * @param {float} [args.x=0] Translation value x.
 * @param {float} [args.y=0] Translation value y.
 * @param {float} [args.w=0] Rotation angle (in radians).
 * @param {float} [args.scl=1] Scale factor.
 * @param {array} [args.matrix] Matrix instead of single transform arguments (SVG-structure [a,b,c,d,x,y]).
 * @param {any} [args.style] Style property. See 'g2.style' for details.
 */
g2.prototype.beg = function beg(args) {
   return this.addCmd(args ? {c:beg, a:[args], open:true} : {c:beg, open:true});
};

/**
 * End subcommands. Previous state is restored.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#beg-end)
 * @method
 * @returns {object} g2
 */
g2.prototype.end = function end() {
   return this.addCmd({c:end});
};
// potential helper function finding matching 'beg' command ...
g2.prototype.end.myBeg = function(cmd) {  // test if 'cmd' is matching 'beg' command ...
   if (cmd.c === g2.prototype.beg.cmd && cmd.open === true) {
      delete cmd.open;
      return true;
   }
   return false;
};

/**
 * Clear viewport command.
 * @method
 * @returns {object} g2
 */
g2.prototype.clr = function clr() {
   return this.addCmd({c:clr});
};

// helper commands
/**
 * Draw grid.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#grid)
 * @method
 * @returns {object} g2
 * @param {string} [color=#ccc] CSS grid color.
 * @param {float} [size] Grid size.
 */
g2.prototype.grid = function grid(color,size) {
   this.state.gridBase = 2;
   this.state.gridExp  = 1;
   return this.addCmd({c:grid,a:[color,size]});
};
// helper function for calculating grid size at rendering time ..
g2.prototype.grid.getSize = function(state,scl) {
   var base = state.gridBase || 2,
       exp = state.gridExp || 1,
       sz;
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
   state.gridBase = base;
   state.gridExp = exp;
   return sz;
}

/**
 * Reference g2 graphics commands from another g2 object.
 * With this command you can reuse instances of grouped graphics commands
 * while applying a similarity transformation and style properties on them.
 * In fact you might want to build custom graphics libraries on top of that feature.  
 * [Example](https://goessner.github.io/g2-svg/test/index.html#rec)
 * @method
 * @returns {object} g2
 * @param {object | string} g g2 source object or symbol name found in 'g2.symbol' namespace.
 * @param {object} args Arguments object.
 * @param {float} [args.x=0] Translation value x.
 * @param {float} [args.y=0] Translation value y.
 * @param {float} [args.w=0] Rotation angle (in radians).
 * @param {float} [args.scl=1] Scale factor.
 * @param {array} [args.matrix] Matrix instead of single transform arguments (SVG-structure [a,b,c,d,x,y]).
 * @param {any} [args.style] Style property. See 'g2.prototype.style' for details.
 * @example
 * g2.symbol.cross = g2().lin(5,5,-5,-5).lin(5,-5,-5,5);  // Define symbol.
 * g2().use("cross",{x:100,y:100})  // Draw cross at position 100,100.
 *     .exe(ctx);                   // Render to context.
 */
g2.prototype.use = function use(g,args) {
   if (typeof g === "string")  // must be a member name of the 'g2.symbol' namespace
      g = g2.symbol[g];
   if (g && g !== this) {      // avoid self reference ..
      var state = this.state;  // ensure state is properly initialized ...
      if (g.state && g.state.loading) { // referencing g2 object potentially containing images ...
         state.loading++;
         g.state.onload(g2.State.prototype.loaded.bind(state));
      }
      this.addCmd({c:use,a:[g,args]});
   }
   return this;
};

/**
 * Apply new style properties.
 * @method
 * @returns {object} g2
 * @param {object} args Style properties object. 
 * @param {string} [args.fs=transparent]  Fill color (fillStyle).
 * @param {string} [args.ls=black]  Line color (lineStroke).
 * @param {float} [args.lw=1]   Line width.
 * @param {string} [args.lc=butt]  Line cap [`butt`, `round`, `square`].
 * @param {string} [args.lj=miter]  Line join [`round`, `bevel` and `miter`].
 * @param {float} [args.ml=10]   Miter limit'.
 * @param {array} [args.ld=[]]   Line dash array.
 * @param {int} [args.lo=0]     Line dash offset.
 * @param {array} [args.sh=[0,0,0,"transparent""]]   Shadow values array [x-offset,y-offset,blur,color].
 * @param {string} [args.thal=start] Text horizontal alignment ['start', 'end', 'left', 'right' or 'center'].
 * @param {string} [args.tval=alphabetic] Text vertical alignment ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'].
 * @param {string} [args.fof=serif]  Font family ['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'arial', 'verdana', ... ] s. CSS
 * @param {float} [args.foz=12]   Font size.
 * @param {string} [args.foc=black]  Font color.
 * @param {string} [args.fow=normal]  Font weight ['normal','bold','lighter','bolder',100,200,...,900].
 * @param {string} [args.fos=normal]  Font style ['normal','italic','oblique'].
 * @param {array} [args.hatch=["black","white",1,10]] Hatch style 45° [color,bgcolor,linewidth,distance].
 * @example
 * g = g2();
 * g2().style({ fs:"#58dbfa",         // Set fill style.
 *              lw:10,                // Set line width.
 *              ls:"#313942",         // Set line style.
 *              lj:"round" })         // Set line join.
 *     .rec(10,10,300,100)
 *     .style({ lw:20,                // Set line width.
 *              fs:"transparent",     // Set fill style.
 *              sh:[10,0,10,"black"], // Set shadow x-translation.
 *              ld:[1,2] })           // Set line dash.
 *     .p().m(40,40).c(150,150,200,0,280,50).drw()
 *     .exe(ctx);
 */
g2.prototype.style = function style(args) {
   return this.addCmd({c:style,a:[args]});
};

// helper functions
/**
 * Execute g2 commands. It does so automatically and recursively with 'use'ed commands.
 * @method
 * @returns {object} g2
 * @param {object} ctx Context.
 */
g2.prototype.exe = function exe(ctx) {
   var state = this.state;
   if (state.loading) // give images a chance to complete loading .. 
      requestAnimationFrame(exe.bind(this,ctx));  // .. so wait a while ..
   else if (ctx) {
      var context, ifc, cmds = this.cmds;
      state.pre(ctx);
      context = state.ctx;
      ifc = state.ifc;
      exe.pre[ifc].call(context,this);
      for (var i=0,n=cmds.length,cmd; i < n; i++) // invoke the command queue
         if (ifc in cmds[i].c)
            (cmd=cmds[this.curIdx = i]).c[ifc].apply(context,cmd.a);
      exe.post[ifc].call(context,this);
      state.post();
   }
   return this;
};
g2.prototype.exe.use = function exe_use(ctx,ifc) {
   var cmds = this.cmds, n = cmds.length, cmd;
   g2.prototype.exe.pre[ifc].call(ctx,this);
   for (var i=0; i < n; i++)     // invoke the command queue
      if (ifc in cmds[i].c)
         (cmd=cmds[this.curIdx = i]).c[ifc].apply(ctx,cmd.a);
   g2.prototype.exe.post[ifc].call(ctx,this);
}
g2.prototype.exe.pre  = {};   // map of interface dependent pre-processing functions
g2.prototype.exe.post = {};   // map of interface dependent post-processing functions

/**
 * Copy all g2 graphics commands from a source g2 object.<br>
 * If the source object is 'this', nothing is done.<br>
 * (no command)
 * @method
 * @returns {object} g2
 * @param {object} g g2 source object to copy commands from.
 * @example
 * var smiley = g2().cir(60,60,50).cir(40,40,10).cir(80,40,10).arc(60,60,30,0.8,2);
 * g2().style({lw:8,fs:"yellow"})
 *     .cpy(smiley)  // Copy all commands from 'smiley'.
 *     .exe(ctx);
 * @example
 * function smiley(g) {
 *    // do some calculations ...
 *    return g.cir(60,60,50).cir(40,40,10).cir(80,40,10).arc(60,60,30,0.8,2);
 * }
 * var g = g2();
 * g.style({lw:8,fs:"yellow"})
 *  .cpy(smiley(g))  // invoke smiley here in method chain.
 *  .exe(ctx);
 */
g2.prototype.cpy = function cpy(g) {
   if (g && g !== this)
      g.cmds.forEach(function(c) { this.cmds.push(c); }, this);
   return this;
};
/*
 * Proxy command for reuse of `proto` objects extending command objects.
 * @method
 * @returns {object} g2
 * @param {function} method `g2.prototype` method for reusing corresponding `proto` object.
 * @param {array} args Arguments array.
 */
g2.prototype.proxy = function proxy(method,args) {
   if (method && method.prototype) {
       var f = function(){};
       f.create = method.create;
       f.prototype = method.prototype;
       this.addCmd({a:args,c:f});
   }
   return this;
};

// Helper methods .. not chainable.
/**
 * Get index of command resolving 'callbk' to 'true' starting from end of the queue walking back.<br>
 * see 'Array.prototype.findIndex'.
 * @private
 */
g2.prototype.findCmdIdx = function(callbk) { 
   for (var i = this.cmds.length-1; i >= 0; i--)
      if (callbk(this.cmds[i],i,this.cmds))
         return i;
   return false;  // command with index '0' signals 'failing' ...
};

/**
 * Get user coordinates from device coordinates for point.
 * @method
 * @returns {object} User coordinates  {x, y}
 * @param {float} x x-value in device units.
 * @param {float} y y-value in device units.
 * @param {float} [h] Viewport (canvas) height in device units. Only needed in cartesian coordinate system.
 */
g2.prototype.pntToUsr = function pntToUsr(x,y,h) {
   var trf = this.state && this.state.trf0 || false;
   return !trf ? {x:x,y:y}
               : this.state.cartesian ? {x:(x - trf.x)/trf.scl, y:-(y - (h - trf.y))/trf.scl}
                                      : {x:(x - trf.x)/trf.scl, y: (y - trf.y)/trf.scl};
};

/**
 * Get user coordinates from device coordinates for unbound vector.
 * @method
 * @returns {object} User coordinates {x, y}
 * @param {float} x x-value in device units.
 * @param {float} y y-value in device units.
 */
g2.prototype.vecToUsr = function vecToUsr(x,y) {
   var trf = this.state && this.state.trf0 || false;
   return !trf ? {x:x,y:y}
               : this.state.cartesian ? {x:x/trf.scl, y:-y/trf.scl}
                                      : {x:x/trf.scl, y: y/trf.scl};
};

// === g2 statics ====
g2.transparent = "rgba(0, 0, 0, 0)";
g2.exeStack = 0;
g2.context = Object.create(null);  // object holding functions getting context objects (if supported!)
g2.ifc = Object.create(null);  // object holding interface strings ..

/**
 * State stack management class.
 * @private
 */
g2.State = {
   create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
   prototype: {
      constructor: function() {
         this.stack = [{}];               // state stack
         this._current = {};              // current state
         this.trf0 = {x:0,y:0,w:0,scl:1}; // holding primary transform: zoom, pan, ...
         this.loading = 0;                // loading images .. 
         this.loadHdl = [];               // .. or else ..
      },
      // pre / post command execution ...
      pre: function(ctx) {
         for (var ifc in g2.ifc)
            if (g2.ifc[ifc](ctx))
               this.ctx = g2.context[this.ifc = ifc](ctx);
         this.stack = [{}];
         this._current = {};
      },
      post: function() { delete this.ctx; delete this.ifc; },  // buggy with use command ...

      // manage style properties ...
      get: function(name) {
         return name in this ? this[name] : (this._current[name] || g2.State[name]);
      },
      set: function(name,val) { 
         this._current[name] = val; 
      },
      add: function(args) {
         var ifcState = g2.State[this.ifc], m2, val, trf = {};
         for (var m in args) {
            val = args[m];
            if (typeof val === "string" && val[0] === "@" && !(val = this.get(val.substr(1))))  // simply cancel referencing with unknown attribute name ...
               break;
            if (m === "x" || m === "y" || m === "w" || m === "scl")  // transform ..
               trf[m] = val;
            else if (!(m in this._current) || val !== this._current[m]) {
               this._current[m] = val;
               if (ifcState[m])
                  ifcState[m].call(this.ctx,val,this);
            }
         }
         if (Object.keys(trf).length) {
            this.trf = trf;
            if (ifcState["trf"])
               ifcState["trf"].call(this.ctx,trf,this);
         }
         return this;
      },

      save: function() { this.stack.push(Object.assign({}, this._current)); return this; },
      restore: function() { this._current = Object.assign({}, this.stack.pop()); return this; },
      get current() { return this._current; },
      set current(val) { this._current = val; },
      get trf() { return this._current.trf || this.trf0; },
      set trf(t) {
         var w = t.w || 0, scl = t.scl || 1,
             sw = scl*(w?Math.sin(w):0), cw = scl*(w?Math.cos(w):1),
             trf = this._current.trf || this.trf0;
         this._current.trf = {
            x:cw*trf.x - sw*trf.y + (t.x || 0),
            y:sw*trf.x + cw*trf.y + (t.y || 0),
            w: trf.w + w,
            scl:trf.scl*scl
         };
      },
      get lwOwner() { return this._current["lw"] || 1; },
      get cssFont() {
         var fos = this.get("fos"), fow = this.get("fow");
         return (fos === "normal" ? "" : (fos+" ")) +
                (fow === "normal" ? "" : (fow+" ")) +
                (this.get("foz") + "px " + this.get("fof"));
      },
      // managing load events ...
      onload: function onload(hdl) { this.loadHdl.push(hdl); },
      loaded: function loaded() { 
         if (--this.loading === 0) {
            while (this.loadHdl.length)
               this.loadHdl.pop()();
         }
      }
   },

   // initial state values ... corresponding to Canvas Context ...
   fs: g2.transparent,  // fillStyle
   ls: "#000",          // lineStroke
   lw: 1,               // lineWidth
   lc: "butt",          // lineCap
   lj: "miter",         // lineJoin
   lwnosc: false,       // lineWidth nonscalable .. 
   ml: 10,              // miterLimit
   sh: [0,0,0,g2.transparent], // shadow
   foc: "#000",         // fontColor
   fos: "normal",       // fontStyle [normal | italic | oblique]
   fow: "normal",       // fontWeight [normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 ... ] s. CSS
   foz: 12,             // fontSize
   fof: "serif",        // fontFamily [serif | sans-serif | monospace | cursiv | fantasy | arial | verdana | ... ] s. CSS
   foznosc: false,      // fontSize nonscalable ... experimental
   trf: {x:0,y:0,w:0,scl:1}
};

// create symbol namespace ..
/**
 * Namespace for symbol objects. A symbol can be used by `use("symbolname")`.
 * @type {object}
 * @example
 * g2.symbol.cross = g2().lin(5,5,-5,-5).lin(5,-5,-5,5);  // Define symbol.
 * g2().use("cross",{x:100,y:100})  // Draw cross at position 100,100.
 *     .exe(ctx);                   // Render to context.
 */
g2.symbol = Object.create(null); // {};

// insert in browser environment only !!!
if (typeof CanvasRenderingContext2D !== "undefined") { // use shortcut 'c2d'

g2.context.c2d = function(ctx) { return ctx; }
g2.ifc.c2d = function(ctx) { return ctx instanceof CanvasRenderingContext2D; }

g2.prototype.exe.pre.c2d = function(g) {         // using g2 object ..
   if (!this.g2ified) {                          // first time call using this canvas context ..
      this.fillStyle = g2.transparent;             // style ...
      this.font = g.state.cssFont;
      this.save();                                 // intentionally no corrsponding restore ..
      this.g2ified = true;
   }

   if (g2.exeStack++ === 0) {                      // outermost g2 ...
      var state = (this.g2state = g.state), t = state.trf;      // initial transform (zoom, pan ...)
      this.setTransform(t.scl,0,0,state.cartesian?-t.scl:t.scl,t.x+0.5,(state.cartesian?this.canvas.height-t.y:t.y)+0.5);
      this.save();
   }
};
g2.prototype.exe.post.c2d = function() {
   if (--g2.exeStack === 0) {
      delete this.g2state;
      this.restore();
   }
};
g2.prototype.p.c2d = CanvasRenderingContext2D.prototype.beginPath;

g2.prototype.m.c2d = CanvasRenderingContext2D.prototype.moveTo;

g2.prototype.l.c2d = CanvasRenderingContext2D.prototype.lineTo;

g2.prototype.q.c2d = CanvasRenderingContext2D.prototype.quadraticCurveTo;

g2.prototype.c.c2d = CanvasRenderingContext2D.prototype.bezierCurveTo;

g2.prototype.a.c2d = CanvasRenderingContext2D.prototype.arc;

g2.prototype.z.c2d = CanvasRenderingContext2D.prototype.closePath;

g2.prototype.stroke.c2d = function stroke_c2d(style,d) {
   if (style) { this.save(); this.g2state.save().add(style); }
   if (d && typeof Path2D !== "undefined")
      this.stroke(new Path2D(d));
   else
      this.stroke();
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.fill.c2d = function fill_c2d(style,d) {
   if (style) { this.save();this.g2state.save().add(style); }
   if (d && typeof Path2D !== "undefined")
      this.fill(new Path2D(d));
   else
      this.fill();
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.drw.c2d = function drw_c2d(style,d) {
   var p2d = d && typeof Path2D !== "undefined" ? new Path2D(d) : false;
   if (style) { this.save();this.g2state.save().add(style); }
   p2d ? this.fill(p2d) : this.fill();
   if (this.fillStyle !== g2.transparent && this.shadowColor !== g2.transparent) {
      var tmp = this.shadowColor;        // avoid stroke shadow when filled ...
      this.shadowColor = "transparent";  // "rgba(0, 0, 0, 0)"
      p2d ? this.stroke(p2d) : this.stroke();
      this.shadowColor = tmp;
   }
   else
      p2d ? this.stroke(p2d) : this.stroke();
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.txt.c2d = function txt_c2d(s,x,y,w,style) {
   var state = this.g2state;

   this.save();
   if (style) state.save().add(style);
   if (w) {
      var sw = Math.sin(w), cw = Math.cos(w);
      this.transform(cw,sw,-sw,cw,(1-cw)*x+sw*y,-sw*x+(1-cw)*y);
   }
   if (state.cartesian) { this.scale(1,-1); y = -y; }
   if (state.get("foc") !== g2.transparent) {
      this.fillStyle = state.get("foc");
      this.fillText(s,x,y);
   }
   else {
      this.fillText(s,x,y);
      this.strokeText(s,x,y);
   }
   if (style) state.restore();
   this.restore();
};

g2.prototype.img.c2d = function img_c2d(img,x,y,b,h,xoff,yoff,dx,dy) {
   var cartesian = this.g2state.cartesian;
   b = b || img && img.width;
   h = h || img && img.height;
   if (cartesian) { this.scale(1,-1); y = -y-h; }
   if (xoff || yoff || dx || dy)  // non-zero anyone .. ?
	  this.drawImage(img,xoff,yoff,dx,dy,x,y,b,h);
   else
      this.drawImage(img,x,y,b,h);
   if (cartesian) { this.scale(1,-1); }  // inverse scaling ..
};

g2.prototype.lin.c2d = function lin_c2d(x1,y1,x2,y2,style) {
   if (style) { this.save(); this.g2state.save().add(style); }
   this.beginPath();
   this.moveTo(x1,y1);
   this.lineTo(x2,y2);
   this.stroke();
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.rec.c2d = function rec_c2d(x,y,b,h,style) {
   if (style) { this.save(); this.g2state.save().add(style); }
   this.beginPath();
   this.rect(x,y,b,h);
   g2.prototype.drw.c2d.call(this);
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.cir.c2d = function cir_c2d(x,y,r,style) {
   if (style) { this.save(); this.g2state.save().add(style); }
   this.beginPath();
   this.arc(x,y,r,0,Math.PI*2,true);
   g2.prototype.drw.c2d.call(this);
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.arc.c2d = function arc_c2d(x,y,r,w,dw,style) {
   if (style) { this.save(); this.g2state.save().add(style); }
   this.beginPath();
   this.arc(x,y,r,w,w+dw,dw<0);
   g2.prototype.drw.c2d.call(this);
   if (style) { this.g2state.restore(); this.restore(); }
};

g2.prototype.ply.c2d = function ply_c2d(pts,mode,pi,style) {
   var p, i = 0, split = mode === "split";
   this.beginPath();
   this.moveTo((p=pi(0)).x,p.y);
   for (i=1; i < pi.len; i++) {
      p = pi(i);
      if (split && i%2 === 0) this.moveTo(p.x,p.y);  
      else                    this.lineTo(p.x,p.y);
   }
   if (mode && !split)  // closed then ..
      this.closePath();
   
   g2.prototype.drw.c2d.call(this,style);
   return i-1;  // number of points ..
};

g2.prototype.spline.c2d = function spline_c2d(b,closed,style) {
   this.beginPath();
   this.moveTo(b[0].x,b[0].y);
   for (var i=0, n=b.length; i < n-1; i++)
      this.bezierCurveTo(b[i].x1,b[i].y1,b[i].x2,b[i].y2,b[i+1].x,b[i+1].y);
   if (closed)
      this.closePath();
   g2.prototype.drw.c2d.call(this,style);
};

g2.prototype.beg.c2d = function beg_c2d(args) {
   this.save();
   this.g2state.save().add(args);
};

g2.prototype.end.c2d = function end_c2d() {
   this.g2state.restore();
   this.restore();
};

g2.prototype.clr.c2d = function clr_c2d() {
   this.save();
   this.setTransform(1,0,0,1,0,0);
   this.clearRect(0,0,this.canvas.width,this.canvas.height);
   this.restore();
};

g2.prototype.grid.c2d = function grid_c2d(color,size) {
   var state = this.g2state, trf = state.trf0,
       b = this.canvas.width, h = this.canvas.height,
       sz = size || g2.prototype.grid.getSize(state,trf.scl),
       xoff = trf.x ? trf.x%sz-sz : 0, yoff = trf.y ? trf.y%sz-sz : 0;

   this.save();
   if (state.cartesian) this.setTransform(1,0,0,-1,0.5,h-0.5);
   else                 this.setTransform(1,0,0,1,0.5,0.5);
   this.strokeStyle = color || "#ccc";
   this.lineWidth = 1;
   this.beginPath();
   for (var x=xoff,nx=b+1; x<nx; x+=sz) { this.moveTo(x,0); this.lineTo(x,h); }
   for (var y=yoff,ny=h+1; y<ny; y+=sz) { this.moveTo(0,y); this.lineTo(b,y); }
   this.stroke();
   this.restore();
};

g2.prototype.use.c2d = function use_c2d(g,args) {
   var state = this.g2state, gstate = g.state;
   this.save();
   state.save().add(args);
   g.state = state;
   g2.prototype.exe.use.call(g,this,"c2d");
   state.restore();
   this.restore();
   g.state = gstate;
};

g2.prototype.style.c2d = function style_c2d(args) {
   this.g2state.add(args);
};

g2.State.c2d = {
   "fs": function(val) { this.fillStyle = val === "transparent" ? g2.transparent : val; },
   "ls": function(val) { this.strokeStyle = val === "transparent" ? g2.transparent : val; },
   "lw": function(val,state) { this.lineWidth = val/(state.get("lwnosc") ? state.trf.scl : 1); },
   "lc": function(val) { this.lineCap = val; },
   "lj": function(val) { this.lineJoin = val; },
   "lo": function(val) { this.lineDashOffset = val; },
   "ld": function(val,state) {
            var scl = state.get("lwnosc") ? state.trf.scl : 1;
            if (scl !== 1) {
               var ld = [];
               for (var i=0,n=val.length; i<n; i++) ld.push(val[i]/scl);
               this.setLineDash(ld);
            }
            else
               this.setLineDash(val);
         },
   "ml": function(val) { this.miterLimit = val; },
   "sh": function(val) {
            if (val && val.length > 1) {
               this.shadowOffsetX = val[0];
               this.shadowOffsetY = val[1];
               this.shadowBlur = val[2] || 0;
               this.shadowColor = val[3] || "rgba(0,0,0,0.5)";
            }
         },
   "thal": function(val) { this.textAlign = val; },
   "tval": function(val) { this.textBaseline = val; },
   "fos": function(val,state) { this.font = state.cssFont; },
   "fow": function(val,state) { this.font = state.cssFont; },
   "foz": function(val,state) { this.font = state.cssFont; },  // evtl. use foznosc
   "fof": function(val,state) { this.font = state.cssFont; },
   "trf": function(t,state) {
             var scl = t.scl || 1,
                 sw = scl*(t.w?Math.sin(t.w):0), cw = scl*(t.w?Math.cos(t.w):1);
             this.transform(cw,sw,-sw,cw,t.x||0,t.y||0);
             if (state.get("lwnosc") && scl !== 1) g2.State.c2d.lwscale.call(this,1/scl);
          },
   "matrix": function(m) {
                this.transform.apply(this,m);
             },
   "lwnosc": function(val,state) {
                var scl = state.trf.scl;
                if (scl !== 1)
                   g2.State.c2d.lwscale.call(this, val ? 1/scl : scl)
             },
   // linewidth dependent scaling helper function ...
   lwscale: function(scl) {
      var ld = this.getLineDash();
      this.lineWidth *= scl;
      if (ld.length) {
         for (var i=0,n=ld.length; i<n; i++) 
            ld[i] *= scl;
         this.lineDashOffset *= scl;
         this.setLineDash(ld);
      }
   },
};

} // end of typeof CanvasRenderingContext2D !!!


// treat node.js
if (typeof module === "object" && module.exports)
   module.exports = g2;
