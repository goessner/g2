/**
 * g2 (c) 2013-15 Stefan Goessner
 * @license
 * MIT License
 */
/* jshint proto: true */
/* jshint -W014 */
/* jshint -W030 */

// Used polyfills
Math.sign = Math.sign || function(x) { return +x > 0 ? 1 : (+x < 0 ? -1 : 0); };
Math.hypot = Math.hypot || function(x,y) { return Math.sqrt(x*x+y*y); };
Object.setPrototypeOf = Object.setPrototypeOf || function(o,proto) { if (typeof(proto) === "object") o.__proto__ = proto; return o; };
// Lightweight class definition (similar to ES6) based on Object.setPrototypeOf
function Class(base,proto) { return proto ? Object.setPrototypeOf(proto,base) : Object.setPrototypeOf(base,{create: function() {var o = Object.create(this);o.constructor.apply(o,arguments);return o;}});}

// read 'http://stackoverflow.com/questions/1114024/constructors-in-javascript-objects'
// also read http://js-bits.blogspot.de/2010/08/constructors-without-using-new.html
/**
 * Maintains an ordered list of 2D graphics commands.
 * @class
 * @classdesc Maintains an ordered list of 2D graphics commands.
 * @param {object} args Arguments object [Optional] with one or more members of the following ..
 *                 { cartesian: <boolean>,
 *                   pan: { dx:<float>, dy:<float> },
 *                   zoom: { x:<float>, y:<float> }, scl:<float> },
 *                   trf: { x:<float>, y:<float> }, scl:<float> }
 *                 }
 * @example
 *
 * // How to use g2()
 * var ctx = document.getElementById("g").getContext("2d"); // Get your canvas context.
 * g2()                 // The first call of g2() creates an g2 object and returns itself.
 *  .lin(50,50,100,100) // Here your can list your commands.
 *  .lin(100,100,200,50)
 *  .exe(ctx);          // Execute your commands.
 */
function g2() {
   if (this instanceof g2)
      return this.constructor.apply(this,arguments);
   else
      return g2.apply(Object.create(g2.prototype),arguments);
}

g2.prototype.constructor = function constructor(args) {
   this.state = g2.State.create();
   this.state.trf0 = {x:0,y:0,scl:1}; // holding initial zoom, pan, ...
   if (args) {
      if (args.zoom) this.zoom(args.zoom.scl,args.zoom.x,args.zoom.y);
      if (args.pan)  this.pan(args.pan.dx,args.pan.dy);
      if (args.trf)  this.trf0(args.trf.x,args.trf.y,args.trf.scl);
      if (args.cartesian) this.state.cartesian = args.cartesian;  // static property ...
   }
   this.cmds = [{c:constructor.cmd, a:[this]}];
   return this;
};
g2.prototype.constructor.cmd = function constructor_c(self) {
   if (this.fillStyle === "#000000") { // root g2 found ... because parent g2's would have already modified 'fillStyle' to transparent.
      var state = self.state, cartesian = state.cartesian;
      this.setTransform(1,0,0,cartesian?-1:1,0.5,(cartesian?this.canvas.height:0)+0.5);
      state.clear()
           .set("fs","transparent",this)
           .set("trf",state.trf0,this)
      this.font = state.font;
   }
};

/**
 * Set cartesian coordinates mode.
 * @method
 * @returns {object} g2
 */
g2.prototype.cartesian = function cartesian() { 
   this.state.cartesian = true;
   return this;
};

/**
 * Set initial transform by pan.
 * @method
 * @returns {object} g2
 * @param {float} dx x-component to pan
 * @param {float} dy y-component to pan
 */
g2.prototype.pan = function pan(dx,dy) {
   this.state.trf0.x += dx;
   this.state.trf0.y += dy;
   return this;
};

/**
 * Set initial transform by zoom.
 * @method
 * @returns {object} g2
 * @param {float} scl zoom scaling factor.
 * @param {float} x x-component of zoom center.
 * @param {float} y y-component of zoom center.
 */
g2.prototype.zoom = function zoom(scl,x,y) {
   this.state.trf0.x  = (1-scl)*(x||0) + scl*this.state.trf0.x;
   this.state.trf0.y  = (1-scl)*(y||0) + scl*this.state.trf0.y;
   this.state.trf0.scl *= scl;
   return this;
};

/**
 * Set initial transform.
 * @method
 * @returns {object} g2
 * @param {float} x x-translation.
 * @param {float} y y-translation.
 * @param {float} scl Scaling factor.
 */
g2.prototype.trf0 = function trf0(x,y,scl) {
   this.state.trf0.x = x;
   this.state.trf0.y = y;
   this.state.trf0.scl = scl;
   return this;
};

// Path commands

// internal helper method .. get current path point from previous command object
g2.prototype._curPnt = function() {
   var lastcmd = this.cmds.length && this.cmds[this.cmds.length-1] || false;
   return lastcmd && (lastcmd.cp || lastcmd.a);
};

/**
 * Begin new path.
 * @method
 * @returns {object} g2
 */
g2.prototype.p = function p() {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.beginPath});
   return this;
};

/**
 * Move to point.
 * @method
 * @returns {object} g2
 * @param {float | array | object } x Point x coordinate
 * @param {float | undefined} y Point y coordinate
 */
g2.prototype.m = function m(x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.moveTo,a:[x,y]});
   return this;
};

/**
 * Draw line to point.
 * @method
 * @returns {object} g2
 * @param {float} x Point x coordinate
 * @param {float} y Point y coordinate
 * @example
 *
 *   g2()
 *   .p()
 *   .m(0,50)
 *   .l(300,0)
 *   .l(400,100)
 *   .stroke()
 *   .exe(ctx);
 * ![Example](img/line.png "Example")
 */
g2.prototype.l = function l(x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.lineTo,a:[x,y]});
   return this;
};

/**
 * Draw quadratic curve to point approximating the control point.
 * @method
 * @returns {object} g2
 * @param {float} x1 x coordinate of control point
 * @param {float} y1 y coordinate of control point
 * @param {float} x x coordinate of point
 * @param {float} y y coordinate of point
 * @example
 *
 *   g2()
 *   .p()
 *   .m(0,0)
 *   .q(200,200,400,0)
 *   .stroke()
 *   .exe(ctx);
 * ![Example](img/quadratic.png "Example")
 */
g2.prototype.q = function q(x1,y1,x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.quadraticCurveTo,a:[x1,y1,x,y],cp:[x,y]});
   return this;
};

/**
 * Create bézier curve from position to point.
 * @method
 * @returns {object} g2
 * @param {float} x1 x coordinate of first control point
 * @param {float} y1 y coordinate of first control point
 * @param {float} x2 x coordinate of second control point
 * @param {float} y2 y coordinate of second control point
 * @param {float} x x coordinate of endpoint
 * @param {float} y y coordinate of endpoint
 * @example
 *
 *   g2()
 *   .p()
 *   .m(0,100)
 *   .c(100,200,200,0,400,100)
 *   .stroke()
 *   .exe(ctx);
 * ![Example](img/curve.png "Example")
 */
g2.prototype.c = function c(x1,y1,x2,y2,x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.bezierCurveTo,a:[x1,y1,x2,y2,x,y],cp:[x,y]});
   return this;
};

// arc path command
/**
 * Draw arc with an angular range dw to point [x,y].
 * @method
 * @returns {object} g2
 * @param {float} dw Angle in radians. Can be positive or negative.
 * @param {float} x Target x coordinate
 * @param {float} y Target y coordinate
 * @example
 *
 *   g2()
 *   .p()
 *   .m(50,50)
 *   .a(2,300,100)
 *   .stroke()
 *   .exe(ctx);
 * ![Example](img/a.png "Example")
 */
g2.prototype.a = function a(dw,x,y) {
   var p1 = this._curPnt();
   if (p1) {
      var dx = x-p1[0], dy = y-p1[1], tw2 = Math.tan(dw/2),
          rx = dx/2 - dy/tw2/2, ry = dy/2 + dx/tw2/2,
          w = Math.atan2(-ry,-rx);
      this.cmds.push({c:CanvasRenderingContext2D.prototype.arc,a:[p1[0]+rx,p1[1]+ry,Math.hypot(rx,ry),w,w+dw,dw<0],cp:[x,y]});
   }
   return this;
};
/**
 * Close current path.
 * @method
 * @returns {object} g2
 */
g2.prototype.z = function z() {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.closePath});
   return this;
};

// stroke, fill, draw
/**
 * Stroke the current path or path object.
 * @method
 * @param {object} p Path2D object
 * @returns {object} g2
 */
g2.prototype.stroke = function stroke(p) {
   this.cmds.push(p ? {c:CanvasRenderingContext2D.prototype.stroke,a:[p]}
                    : {c:CanvasRenderingContext2D.prototype.stroke} );
   return this;
};

/**
 * Fill the current path or path object.
 * @method
 * @param {object} p Path2D object
 * @returns {object} g2
 */
g2.prototype.fill = function fill(p) {
   this.cmds.push(p ? {c:CanvasRenderingContext2D.prototype.fill,a:[p]}
                    : {c:CanvasRenderingContext2D.prototype.fill} );
   return this;
};

/**
 * Shortcut for stroke and fill the current path or path object.
 * In case of shadow, only the path interior creates shadow, not the path contour additionally.
 * @method
 * @param {object} p Path2D object [optional]
 * @returns {object} g2
 */
g2.prototype.drw = function drw(p) {
   this.cmds.push(p ? {c:drw.cmd,a:[p]} : {c:drw.cmd});
   return this;
};
g2.prototype.drw.cmd = function drw_c(p) {
   p ? this.fill(p) : this.fill();
   if (this.fillStyle !== g2.transparent && this.shadowColor !== g2.transparent) {
      var tmp = this.shadowColor;        // avoid stroke shadow when filled ...
      this.shadowColor = "transparent";  // "rgba(0, 0, 0, 0)"
      p ? this.stroke(p) : this.stroke();
      this.shadowColor = tmp;
   }
   else
      p ? this.stroke(p) : this.stroke();
};


// Graphics elements
/**
 * Draw text.
 * Using ctx.fillText if 'fontColor' is not 'transparent', else ctx.strokeText.
 * @method
 * @returns {object} g2
 * @param {string} s Drawing text
 * @param {float} x x coordinate of text position
 * @param {float} y y coordinate of text position
 * @param {float} maxWidth Currently not used due to Chrome 36 (can't deal with 'undefined')
 */
g2.prototype.txt = function txt(s,x,y,maxWidth) {
   this.cmds.push({c:txt.cmd,a:[this,s,x||0,y||0,maxWidth]});
   return this;
};
g2.prototype.txt.cmd = function txt_c(self,s,x,y,maxWidth) {
   var state = self.state, foc = state.get("foc");

   if (state.cartesian || foc !== g2.transparent) this.save();
   if (state.cartesian) { this.scale(1,-1); y = -y; }

   if (foc !== g2.transparent) {
      this.fillStyle = foc;
      this.fillText(s,x,y);  // maxWidth currently not used due to Chrome 42 (can#t deal with 'undefined')
   }
   else
      this.strokeText(s,x,y);

   if (state.cartesian || foc !== g2.transparent) this.restore();
};

/**
 * Draw image
 * @method
 * @returns {object} this
 * @param {string} uri Image uri or data:url.
 * @param {float} x X-coordinate of image (upper left)
 * @param {float} y Y-coordinate of image (upper left)
 * @param {float} b Width. [optional]
 * @param {float} h Height. [optional]
 * @param {float} xoff X-offset. [optional]
 * @param {float} yoff Y-offset. [optional]
 * @param {float} dx X-delta. [optional]
 * @param {float} dy Y-delta. [optional]
 */
g2.prototype.img = function img(uri,x,y,b,h,xoff,yoff,dx,dy) {
   var image = new Image();  // use native Promise object in future ..
   image.src = uri;
   this.cmds.push({c:img.cmd,a:[this,function(){return image;},x||0,y||0,b,h,xoff,yoff,dx,dy]});
   return this;
};
g2.prototype.img.cmd = function img_c(self,image,x,y,b,h,xoff,yoff,dx,dy) {
   var img = image();
   b = b || img && img.width;
   h = h || img && img.height;
   if (self.state.cartesian) { this.save(); this.scale(1,-1); y = -y-h; }
   if (xoff || yoff || dx || dy)  // non-zero anyone .. ?
      this.drawImage(img,xoff,yoff,dx,dy,x,y,b,h);
   else
      this.drawImage(img,x,y,b,h);
   if (self.state.cartesian) { this.restore(); }
};

/**
 * Draw dot with size of stroke width using stroke color.
 * @method
 * @returns {object} g2
 * @param {float} x x coordinate
 * @param {float} y y coordinate
 */
g2.prototype.dot = function dot(x,y) {
   this.cmds.push({c:dot.cmd,a:[x,y]});
   return this;
};
g2.prototype.dot.cmd = function dot_c(x,y) {
   var w = this.lineWidth;
   this.beginPath();
   this.moveTo(x-w/2,y);
   this.lineTo(x+w/2,y);
   this.stroke();
};

/**
 * Draw line.
 * @method
 * @returns {object} g2
 * @param {float} x1 Start x coordinate
 * @param {float} y1 Start y coordinate
 * @param {float} x2 End x coordinate
 * @param {float} y2 End y coordinate
 * @example
 *
 *   g2()
 *   .lin(10,10,190,10)
 *   .exe(ctx);
 */
g2.prototype.lin = function lin(x1,y1,x2,y2) {
   this.cmds.push({c:lin.cmd,a:[x1,y1,x2,y2]});
   return this;
};
g2.prototype.lin.cmd = function lin_c(x1,y1,x2,y2) {
   this.beginPath();
   this.moveTo(x1,y1);
   this.lineTo(x2,y2);
   this.stroke();
};

/**
 * Draw rectangle.
 * @method
 * @returns {object} g2
 * @param {float} x X-value upper left corner
 * @param {float} y Y-value  upper left corner
 * @param {float} b Width
 * @param {float} h Height
 */
g2.prototype.rec = function rec(x,y,b,h) {
   this.cmds.push({c:rec.cmd,a:[x,y,b,h]});
   return this;
};
g2.prototype.rec.cmd = function rec_c(x,y,b,h) {
   this.beginPath();
   this.rect(x,y,b,h);
   g2.prototype.drw.cmd.call(this);
};

/**
 * Draw circle.
 * @method
 * @returns {object} g2
 * @param {float} x X-value center
 * @param {float} y Y-value center
 * @param {float} r Radius
 */
g2.prototype.cir = function cir(x,y,r) {
   this.cmds.push({c:cir.cmd,a:[x,y,r]});
   return this;
};
g2.prototype.cir.cmd = function cir_c(x,y,r) {
   this.beginPath();
   this.arc(x,y,r,0,Math.PI*2,true);
   g2.prototype.drw.cmd.call(this);
};

/**
 * Draw arc. No fill applied.
 * @method
 * @returns {object} g2
 * @param {float} x X-value center
 * @param {float} y Y-value center
 * @param {float} r Radius
 * @param {float} w Start angle (in radian) [default 0]
 * @param {float} dw Angular range in radian. In case of positive values it is running clockwise with
 *                left handed default coordinate system. [default 2*pi]
 * @example
 *
 *   g2()
 *   .arc(300,400,390,-Math.PI/4,-Math.PI/2)
 *   .exe(ctx);
 * ![Example](img/arc.png "Example")
 */
g2.prototype.arc = function arc(x,y,r,w,dw) {
   this.cmds.push({c:arc.cmd,a:[x,y,r,w,dw]});
   return this;
};
g2.prototype.arc.cmd = function arc_c(x,y,r,w,dw) {
   this.beginPath();
   this.arc(x,y,r,w,w+dw,dw<0);
   this.stroke();
};

/**
 * Draw polygon.
 * Using iterator function getting array and point index as parameters
 * returning corresponding point object {x:<float>,y:<float>} [optional].
 * Default iterator expects sequence of x/y-coordinates as a flat array ([x0,y0,x1,y1,...])
 * @method
 * @returns {object} this
 * @param {array} parr Array of points
 * @param {boolean} closed Draw closed polygon.
 * @example
 *
 *   g2()
 *   .ply([[100,50],[120,60],[80,70]],false)
 *   .exe(ctx);
 * ![Example](img/poly.png "Example")
 */
g2.prototype.ply = function ply(parr,closed) {
   this.cmds.push({c:ply.cmd,a:[parr,closed]});
   return this;
};
g2.prototype.ply.cmd = function ply_c(parr,closed) {
   var p, i = 0, itr = g2.ply.itr;
   p = itr(parr,i++);
   if (!p.done) {      // draw polygon ..
      this.beginPath();
      this.moveTo(p.x,p.y);
      p = itr(parr,i++);
      while (!p.done) {
         this.lineTo(p.x,p.y);
         p = itr(parr,i++);
      }
      if (closed)
         this.closePath();
   }
   g2.prototype.drw.cmd.call(this);
   return i-1;  // number of points ..
};

g2.ply = {
   iterators: {
      "x,y":   function itr(arr,i) { return i < arr.length/2 ? {x:arr[2*i],y:arr[2*i+1]} : {done:true}; },
      "[x,y]": function itr(arr,i) { return i < arr.length ? {x:arr[i][0],y:arr[i][1]} : {done:true}; },
      "{x,y}": function itr(arr,i) { return i < arr.length ? arr[i] : {done:true}; }
   }
};
// default polygon point iterator ... assume flat array
g2.ply.itr = g2.ply.iterators["x,y"];


/**
 * Begin subcommands. Style state is saved. Optionally apply (similarity) transformation.
 * @method
 * @returns {object} g2
 * @param {float} x Translation value x
 * @param {float} y Translation value y
 * @param {float} w Rotation angle (in radians)
 * @param {float} scl Scale factor
 */
g2.prototype.beg = function beg(x,y,w,scl) {
   this.cmds.push(arguments.length ? {c:beg.cmd2,a:[this,x||0,y||0,w||0,scl||1]}
                                   : {c:beg.cmd1,a:[this]});
   return this;
};
g2.prototype.beg.cmd1 = function beg_c1(self) {
   self.state.save(this);
};
g2.prototype.beg.cmd2 = function beg_c2(self,x,y,w,scl) {
   var state = self.state;
   state.save(this);
   state.set("trf",{x:x,y:y,w:w,scl:scl},this);
};
/**
 * End subcommands. Previous style state is restored.
 * @method
 * @returns {object} g2
 */
g2.prototype.end = function end() {
   this.cmds.push({c:end.cmd,a:[this]});
   return this;
};
g2.prototype.end.cmd = function end_c(self) {
   self.state.restore(this);
};

/**
 * Clear canvas.
 * @method
 * @returns {object} this
 */
g2.prototype.clr = function clr() {
   this.cmds.push({c:clr.cmd});
   return this;
};
g2.prototype.clr.cmd = function clr_c() {
   this.save();
   this.setTransform(1,0,0,1,0,0);
   this.clearRect(0,0,this.canvas.width,this.canvas.height);
   this.restore();
};

// helper commands
/**
 * Set static options for any command object.
 * @method
 * @returns {object} g2
 * @param {string} name
 * @param {object} op
 * @example
 *
 *   g2()
 *   .cir(25,25,20)
 *   .opts("label",{o:"s"})   // Set label position to south.
 *   .label("Circle")
 *   .exe(ctx);
 * ![Example](img/opts.png "Example")
 */
g2.prototype.set = function set(name,opts) {
   if (g2[name])
      this.cmds.push({c:set.cmd,a:[name,opts]});
   return this;
};
g2.prototype.set.cmd = function set_c(name,opts) { for (var m in opts) g2[name][m] = opts[m]; };

/**
 * Show grid.
 * @method
 * @returns {object} g2
 * @param {string} color CSS grid color
 * @param {float}  size  Grid size (if g2 has a viewport object assigned, viewport's grid size is more relevant).
 */
g2.prototype.grid = function grid(color,size) {
   if (!this.state.gridBase) {
      this.state.gridBase = 2;
      this.state.gridExp  = 1;
      this.cmds.push({c:grid.cmd,a:[this,color,size]});
   }
   return this;
};
g2.prototype.grid.cmd = function grid_c(self,color,size) {
   var state = self.state, trf = state.get("trf"),
       cartesian = state.cartesian,
       b = this.canvas.width, h = this.canvas.height,
       sz = size || g2.prototype.grid.getSize(state,trf.scl),
       xoff = trf.x ? trf.x%sz-sz : 0, yoff = trf.y ? trf.y%sz-sz : 0;

   this.save();
   if (cartesian) this.setTransform(1,0,0,-1,0.5,h+0.5);
   else           this.setTransform(1,0,0,1,0.5,0.5);
   this.strokeStyle = color || "#ccc";
   this.lineWidth = 1;
   this.beginPath();
   for (var x=xoff,nx=b+1; x<nx; x+=sz) { this.moveTo(x,0); this.lineTo(x,h); }
   for (var y=yoff,ny=h+1; y<ny; y+=sz) { this.moveTo(0,y); this.lineTo(b,y); }
   this.stroke();
   this.restore();
};
g2.prototype.grid.getSize = function(state,scl) {
   var base = state.gridBase,
       exp = state.gridExp,
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
 * Use g2 graphics commands from another g2 source object by reference.
 * With this command you can reuse instances of grouped graphics commands
 * while applying a similarity transformation on them.
 * In fact you might want to build custom graphics libraries on top of that feature.
 * @method
 * @returns {object} this
 * @param {object | string} g g2 source object or symbol name found in 'g2.symbol' namespace.
 * @param {float} x Drawing x position
 * @param {float} y Drawing y position
 * @param {float} w Rotation Angle (in radians)
 * @param {float} Scale Factor x
 * @example
 *
 *	var symbol = g2().rec(0,0,30,10).lin(30,5,50,5,"arrow");
 *	g2()
 *	.use(symbol,10,10,0,3,3)
 *	.exe(ctx);
 * ![Example](img/sym.png "Example")
 */
g2.prototype.use = function use(g,x,y,w,scl) {
   if (typeof g === "string")  // should be a member name of the 'g2.symbol' namespace
      g = g2.symbol[g];
   if (g && g !== this) // avoid self reference ..
      this.cmds.push(arguments.length > 1 ? {c:use.cmd,a:[this,g,x,y,w,scl]}
                                          : {c:use.cmd1,a:[this,g]});
   return this;
};
g2.prototype.use.cmd1 = function use_c1(self,g) {
   self.exe(this,g);
};
g2.prototype.use.cmd = function use_c(self,g,x,y,w,scl) {
   var state = self.state;
   state.save(this);
   state.set("trf",{x:x,y:y,w:w,scl:scl},this);
   self.exe(this,g);
   state.restore(this);
};

// style command ..
g2.prototype.style = function style() {
   if (arguments && arguments.length)   // even number of arguments required .. not tested here ?
      this.cmds.push({c:style.cmd,a:[this,Array.prototype.slice.call(arguments)]});
   return this;
};
g2.prototype.style.cmd = function style_c(self,list) {
   var state=self.state,name,val;
   for (var i=0; i<list.length; i+=2) {
      name = list[i];
      val = list[i+1];
      val = typeof val === "string" && val[0] === "@"
          ? state.get(val.substr(1),this)
          : val;
      state.set(name,val,this);
   }
};

// helper functions
/**
 * Execute g2 commands.
 * @method
 * @returns {object} g2
 * @param {object} ctx Canvas Context
 * @param {object} g g2 Object to execute. [default=this] [optional]
 */
g2.prototype.exe = function exe_c(ctx,g) {
   var cmds = (g || this).cmds;
   if (ctx && cmds) {
      var gstate = g && g.state;
      if (g)   // external g2 in use .. copy state
         g.state = this.state;
      for (var i=0,n=cmds.length,cmd; i<n; i++)  // invoke the command queue
         (cmd=cmds[i]).c.apply(ctx,cmd.a);
      if (g)  // external g2 in use .. restore style
         g.state = gstate;
      else // must be parent g2 ...
         ctx.fillStyle = "#000000";  // ... reset .. for properly reinitializing ...
   }
   return this;
};

/**
 * Copy all g2 graphics commands from another g2 object.
 * @method
 * @returns {object} this
 * @param {object} g g2 object to copy commands from.
 * @example
 *
 *   var myStyle = g2().fs("#ccc").ls("green").lw(5);
 *   g2()
 *   .cpy(myStyle)
 *   .rec(10,10,200,50)
 *   .exe(ctx);
 * ![Example](img/cpy.png "Example")
 */
g2.prototype.cpy = function cpy(g) {
   if (g !== this)
      g.cmds.forEach(function(c,i) {if (i) this.cmds.push(c);},this); // avoid copying first '_init' command ...
   return this;
};

/**
 * Delete commands from the given location to the end of the commands array.
 * @method
 * @returns {object} g2
 * @param { undefined } delete commands array.
 */
g2.prototype.del = function del() { // see http://jsperf.com/truncating-arrays-correctly
   this.cmds.length = 1;  // do not delete 'constructor' command.
   return this;
};

/**
 * Convert g2 command stack to JSON formatted string.
 * @param {string} space Number of spaces to use for indenting JSON output [optional].
 * @return {string} JSON string of command stack.
 */
g2.prototype.dump = function(space) {
   function trace(obj) {
      var out = [],o,cmd,a,c,args;
      for (var i=0,n=obj.cmds.length; i<n; i++) {
         args = [];
         cmd = obj.cmds[i];
         a = cmd.a;
         for (var j=0,m=a && a.length || 0; j<m; j++) {
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

// === g2 statics ====
/**
 * Current version.
 * @type {string}
 * @const
 */
g2.version = "1.3";
g2.transparent = "rgba(0, 0, 0, 0)";

// State stack management class.
g2.State = Class({
   constructor: function() {
      this.stack = [{}];
   },
   has: function(name,ctx) {
      name = this.alias[name] || name;
      return ctx && this.filter[name]
          || name in this.stack[this.stack.length-1]
          || this.hasOwnProperty(name);
   },
   get: function(name,ctx) {  // omit 'ctx' in 'this.filter[name]' function to avoid infinite recursion ... !
      name = this.alias[name] || name;
      return ctx && this.filter[name] && this.filter[name].get && this.filter[name].get.call(this,ctx)
          || this.stack[this.stack.length-1][name]
          || this[name]
   },
   set: function(name,val,ctx) { // omit 'ctx' in 'this.filter[name]' function to avoid infinite recursion ... !
      name = this.alias[name] || name;
      if (ctx && this.filter[name] && this.filter[name].set)
         this.filter[name].set.call(this,val,ctx);
      else
         this.stack[this.stack.length-1][name] = val;
      return this;
   },
   save: function(ctx) {
      this.stack.push(JSON.parse(JSON.stringify(this.stack[this.stack.length-1])));
      if (ctx) ctx.save();
      return this;
   },
   restore: function(ctx) {
      this.stack.pop();
      if (ctx) ctx.restore();
      return this;
   },
   clear: function() {
      this.stack = [{}];
      return this;
   },
   transform: function(t,ctx) {
      var trf = this.stack[this.stack.length-1].trf || this.trf,
          sw=t.w?Math.sin(t.w):0,cw=t.w?Math.cos(t.w):1;
      this.stack[this.stack.length-1].trf = {
         x:t.scl*cw*trf.x - t.scl*sw*trf.y + t.x,
         y:t.scl*sw*trf.x + t.scl*cw*trf.y + t.y,
         w: trf.w + t.w,
         scl:trf.scl*t.scl
      };
      ctx.transform(t.scl*cw,t.scl*sw,-t.scl*sw,t.scl*cw,t.x,t.y);
      return this;
   },
   get currentScale() { return (this.stack[this.stack.length-1].trf || this.trf).scl; },
   get font() {
      var fos = this.get("fos"),
          fow = this.get("fow"),
          foz = this.get("foz"),
          fof = this.get("fof"),
          font = "";
      fos = fos === "normal" ? "" : fos;
      fow = fow === "normal" ? "" : fow;
      if (fos !== "normal") font += fos + " ";
      if (fow !== "normal") font += fow + " ";
      font += foz + "px " + fof;
      return font;
   },
});

// initial state values ... corresponding to Canvas Context ...
g2.State.transparent = "rgba(0, 0, 0, 0)";   // constant value
g2.State.fs = g2.State.transparent;
g2.State.lm = "normal";  // linemode .. "normal" or 'jitter'
g2.State.foc = "#000";   // fontColor
g2.State.fos = "normal"; // fontStyle [normal | italic | oblique]
g2.State.fow = "normal"; // fontWeight [normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 ... ] s. CSS
g2.State.foz = 12;       // fontSize
g2.State.fof = "serif";  // fontFamily [serif | sans-serif | monospace | cursiv | fantasy | arial | verdana | ... ] s. CSS
g2.State.trf = {x:0,y:0,scl:1};


g2.State.alias = {
   "strokeStyle": "ls",  // read: lineStroke ...
   "fillStyle":   "fs",
   "lineWidth":   "lw",
   "lineCap":     "lc",
   "lineJoin":    "lj",
   "lineDash":    "ld",
   "lineDashOffset":"lo",
   "miterLimit": "ml",
   "shadowOffsetX": "shx",
   "shadowOffsetY":"shy",
   "shadowBlur":"shb",
   "shadowColor":"shc",
   "fontColor":"foc",
   "fontStyle":"fos",
   "fontWeight":"fow",
   "fontSize":"foz",
   "fontFamily":"fof",
   "textAlign":"thal",    // text horizontal align ..
   "textBaseline":"tval",  // text vertical align ..
   "fontSizeNonScalable": "foznosc",
   "lineWidthNonScalable": "lwnosc"
};
g2.State.filterProperty = function(property) {
   return { get: function(ctx) { return ctx[property]; }, set: function(val,ctx) { ctx[property] = val; } };
};
g2.State.filter = {
   "ls": {
      get: function(ctx) { return ctx.strokeStyle; },
      set: function(val,ctx) { ctx.strokeStyle = val === "transparent" ? g2.transparent : val; }
   },
   "fs": {
      get: function(ctx) { return ctx.fillStyle; },
      set: function(val,ctx) { ctx.fillStyle = val === "transparent" ? g2.transparent : val; }
   },
   "lw": {
      get: function(ctx) { return ctx.lineWidth*(this.get("lwnosc") ? this.currentScale : 1); },
      set: function(val,ctx) { ctx.lineWidth = val/(this.get("lwnosc") ? this.currentScale : 1); }
   },
   "lc": g2.State.filterProperty("lineCap"),
   "lj": g2.State.filterProperty("lineJoin"),
   "ld": {
      get: function(ctx) {
         if (ctx) {
            var lw = ctx.lineWidth,
                ld = ctx.getLineDash();
            for (var i=0,n=ld.length; i<n; i++) ld[i] /= lw;
            return  ld;
         }
         return [];
      },
      set: function(val,ctx) {
         if (ctx) {
            var scl = this.get("lwnosc") ? this.currentScale : 1,
                lw = this.get("lw",ctx);
            for (var i=0,n=val.length; i<n; i++) val[i] /= scl/lw;
            ctx.setLineDash(val);
         }
      }
   },
   "lo": {  // TODO: make lw-dependent ..
      get: function(ctx) { return ctx.lineDashOffset; },
      set: function(val,ctx) { ctx.lineDashOffset = val; }
   },
   "ml": g2.State.filterProperty("miterLimit"),
   "shx": g2.State.filterProperty("shadowOffsetX"),
   "shy": g2.State.filterProperty("shadowOffsetY"),
   "shb": g2.State.filterProperty("shadowBlur"),
   "shc": {
      get: function(ctx) { return ctx.shadowColor; },
      set: function(val,ctx) { ctx.shadowColor = val === "transparent" ? g2.transparent : val; }
   },
   "thal": g2.State.filterProperty("textAlign"),
   "tval": g2.State.filterProperty("textBaseline"),
   "fos": {
      set: function(val,ctx) { this.set("fos",val); ctx.font = this.font; }
   },
   "fow": {
      set: function(val,ctx) { this.set("fow",val); ctx.font = this.font; }
   },
   "foz": {
      get: function(ctx) {
         var scl = this.get("foznosc") ? this.currentScale : 1;
         return this.get("foz")*scl;
      },
      set: function(val,ctx) {
         var scl = this.get("foznosc") ? this.currentScale : 1;
         this.set("foz",val/scl);
         ctx.font = this.font;
      }
   },
   "fof": {
      set: function(val,ctx) { this.set("fof",val); if (ctx) ctx.font = this.font; }
   },
   "lwnosc": {
      set: function(val,ctx) {
         if (val !== this.get("lwnosc")) {  // value changing ...
            var lw  = this.get("lw",ctx);
            this.set("lwnosc",val);
            this.set("lw",lw,ctx);
         }
      }
   },
   "foznosc": {
      set: function(val,ctx) {
         if (val !== this.get("foznosc")) {  // value changing ...
            var foz = this.get("foz");
            this.set("foznosc",val);
            this.set("foz",foz,ctx);
         }
      }
   },
   "trf": {
      set: function(val,ctx) {
         var sclChg = val.scl !== this.get("trf").scl,  // scale value changing ...
             lw, ld, foz;
         if (sclChg) {
             lw = this.get("lw",ctx),
             ld = this.get("ld",ctx),
             foz = this.get("foz",ctx);
         }
         this.transform(val,ctx);

         if (sclChg) {
            this.set("lw",lw,ctx);
            this.set("ld",ld,ctx);
            this.set("foz",foz,ctx);
         }
      }
   }
};

// create symbol namespace ..
g2.symbol = {};
g2.symbol.origin = function() {
   var g = g2(), z = 2;
   g.style("lc","round","lj","round","fs","snow","lw",1)
    .p().m(6*z,0).l(0,0).l(0,6*z).stroke()
    .p().m(10*z,0).l(6*z,3/4*z).a(-Math.PI/3,6*z,-3/4*z).z()
        .m(0,10*z).l(3/4*z,6*z).a( Math.PI/3,-3/4*z,6*z).z().drw()
    .cir(0,0,z);
   return g;
}();
