/**
 * g2 (c) 2013-15 Stefan Goessner
 * @license
 * MIT License
 */
/* jshint -W014 */

/* jshint -W030 */
// Used polyfills
Math.hypot = Math.hypot || function(x,y) { return Math.sqrt(x*x+y*y); };

/**
 * Maintains a queue of 2D graphics commands.
 * @param {object} [args] Arguments object with one or more members.
 * @param {bool} [args.cartesian] Set cartesian coordinates.
 * @param {object} [args.pan]
 * @param {float} [args.pan.dx] Pan in x.
 * @param {float} [args.pan.dy] Pan in y.
 * @param {object} [args.zoom]
 * @param {float} [args.zoom.x] Zoom center x.
 * @param {float} [args.zoom.y] Zoom center y.
 * @param {float} [args.zoom.scl] Zoom factor.
 * @param {object} [args.trf]
 * @param {float} [args.trf.x] Transform in x.
 * @param {float} [args.trf.y] Transform in y.
 * @param {float} [args.trf.scl] Zoom factor.
 * @example
 * // How to use g2()
 * var ctx = document.getElementById("c").getContext("2d"); // Get your canvas context.
 * g2()                  // The first call of g2() creates a g2 object.
 *  .lin(50,50,100,100)  // Append commands.
 *  .lin(100,100,200,50)
 *  .exe(ctx);           // Execute commands.
 */
function g2() {
   if (this instanceof g2)
      return this.constructor.apply(this,arguments);
   else
      return g2.apply(Object.create(g2.prototype),arguments);
}

// === g2 statics ====
/**
 * Current version.
 * Using semantic versioning 'http://semver.org/'.
 * @type {string}
 * @const
 */
g2.version = "1.0.0";
g2.transparent = "rgba(0, 0, 0, 0)";

/**
 * Constructor.
 * @method
 * @returns {object} g2
 * @private
 */
g2.prototype.constructor = function constructor(args) {
   if (args) {  // only root g2's should have arguments ...
      this.state = g2.State.create();
      if (args.zoom) this.zoom(args.zoom.scl,args.zoom.x,args.zoom.y);
      if (args.pan)  this.pan(args.pan.dx,args.pan.dy);
      if (args.trf)  this.trf(args.trf.x,args.trf.y,args.trf.scl);
      if (args.cartesian) this.state.cartesian = args.cartesian;  // static property ...
   }
   this.cmds = [{c:constructor.cmd, a:[this]}];
   return this;
};
g2.prototype.constructor.cmd = function constructor_c(self) {
   if (this.fillStyle === "#000000") { // root g2 found ... because parent g2's would have already modified 'fillStyle' to transparent.
      var state = self.state || (self.state = g2.State.create());
      this.setTransform(1,0,0,state.cartesian?-1:1,0.5,(state.cartesian?this.canvas.height:0)+0.5);
      state.reset(this)
           .set("trf",state.trf0,this);
      this.font = state.font;
   }
};

/**
 * Set cartesian coordinates mode within a viewport.
 * @method
 * @returns {object} g2
 */
g2.prototype.cartesian = function cartesian() {
   (this.state || (this.state = g2.State.create())).cartesian = true;
   return this;
};

/**
 * Pan a distance within a viewport.
 * @method
 * @returns {object} g2
 * @param {float} dx x-component to pan.
 * @param {float} dy y-component to pan.
 */
g2.prototype.pan = function pan(dx,dy) {
   this.state = this.state || g2.State.create();
   this.state.trf0.x += dx;
   this.state.trf0.y += dy;
   return this;
};

/**
 * Zoom within a viewport.
 * @method
 * @returns {object} g2
 * @param {float} scl Scaling factor.
 * @param {float} [x=0] x-component of zoom center.
 * @param {float} [y=0] y-component of zoom center.
 */
g2.prototype.zoom = function zoom(scl,x,y) {
   this.state = this.state || g2.State.create();
   this.state.trf0.x  = (1-scl)*(x||0) + scl*this.state.trf0.x;
   this.state.trf0.y  = (1-scl)*(y||0) + scl*this.state.trf0.y;
   this.state.trf0.scl *= scl;
   return this;
};

/**
 * Set transform directly within a viewport.
 * @method
 * @returns {object} g2
 * @param {float} x x-translation.
 * @param {float} y y-translation.
 * @param {float} scl Scaling factor.
 */
g2.prototype.trf = function trf(x,y,scl) {
   this.state = this.state || g2.State.create();
   this.state.trf0.x = x;
   this.state.trf0.y = y;
   this.state.trf0.scl = scl;
   return this;
};

/**
 * Get user coordinates from canvas coordinates for point (with respect to initial transform).
 * @method
 * @returns {object} User coordinates  {x, y}
 * @param {float} x x-translation.
 * @param {float} y y-translation.
 * @param {float} h Viewport (canvas) height. Only needed in cartesian coordinate system.
 */
g2.prototype.pntToUsr = function pntToUsr(x,y,h) {
   var trf = this.state && this.state.trf0 || false;
   return !trf ? {x:x,y:y}
               : this.state.cartesian ? {x:(x - trf.x)/trf.scl, y:-(y - (h - trf.y))/trf.scl}
                                      : {x:(x - trf.x)/trf.scl, y:(y - trf.y)/trf.scl};
};

/**
 * Get user coordinates from canvas coordinates for direction vector (with respect to initial transform).
 * @method
 * @returns {object} User coordinates {x, y}
 * @param {float} x x-translation.
 * @param {float} y y-translation.
 */
g2.prototype.vecToUsr = function vecToUsr(x,y) {
   var trf = this.state && this.state.trf0 || false;
   return !trf ? {x:x,y:y}
               : this.state.cartesian ? {x:x/trf.scl, y:-y/trf.scl}
                                      : {x:x/trf.scl, y:y/trf.scl};
};

// Path commands

// internal helper method .. 
// get current path point from previous command object
g2.prototype._curPnt = function() {
   var lastcmd = this.cmds.length && this.cmds[this.cmds.length-1] || false;
   return lastcmd && (lastcmd.cp || lastcmd.a);
};
// get index of command resolving 'callbk' to 'true'.
// see 'Array.prototype.findIndex'
g2.prototype.findCmdIdx = function(callbk) { 
   for (var i = this.cmds.length-1; i > 0; i--) 
      if (callbk(this.cmds[i],i,this.cmds))
         return i;
   return 0;  // command with index '0' signals 'failing' ...
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
 * Create line to point.
 * @method
 * @returns {object} g2
 * @param {float} x Point x coordinate.
 * @param {float} y Point y coordinate.
 * @example
 * var g = g2();  // Create g2 object.
 * g.p()          // Begin path.
 *  .m(0,50)      // Move to point.
 *  .l(300,0)     // Create line to point.
 *  .l(400,100)   // ...
 *  .stroke()     // Stroke path.
 *  .exe(ctx);    // Render to canvas context.
 */
g2.prototype.l = function l(x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.lineTo,a:[x,y]});
   return this;
};

/**
 * Create quadratic bezier curve to point.  
 * ![Example](../img/q.png "Example")
 * @method
 * @returns {object} g2
 * @param {float} x1 x coordinate of control point.
 * @param {float} y1 y coordinate of control point.
 * @param {float} x x coordinate of point.
 * @param {float} y y coordinate of point.
 * @example
 * var g = g2();       // Create g2 object.
 * g.p()               // Begin path.
 *  .m(0,0)            // Move to point.
 *  .q(200,200,400,0)  // Create quadratic bezier curve.
 *  .stroke()          // Stroke path.
 *  .exe(ctx);         // Render to canvas context.
 */
g2.prototype.q = function q(x1,y1,x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.quadraticCurveTo,a:[x1,y1,x,y],cp:[x,y]});
   return this;
};

/**
 * Create cubic bezier curve to point.  
 * ![Example](../img/c.png "Example")
 * @method
 * @returns {object} g2
 * @param {float} x1 x coordinate of first control point.
 * @param {float} y1 y coordinate of first control point.
 * @param {float} x2 x coordinate of second control point.
 * @param {float} y2 y coordinate of second control point.
 * @param {float} x x coordinate of endpoint.
 * @param {float} y y coordinate of endpoint.
 * @example
 * var g = g2();                // Create g2 object.
 * g.p()                        // Begin path.
 *  .m(0,100)                   // Move to point.
 *  .c(100,200,200,0,400,100)   // Create cubic bezier curve.
 *  .stroke()                   // Stroke path.
 *  .exe(ctx);                  // Render to canvas context.
 */
g2.prototype.c = function c(x1,y1,x2,y2,x,y) {
   this.cmds.push({c:CanvasRenderingContext2D.prototype.bezierCurveTo,a:[x1,y1,x2,y2,x,y],cp:[x,y]});
   return this;
};

// arc path command
/**
 * Draw arc with angular range dw to point.  
 * ![Example](../img/a.png "Example")
 * @method
 * @returns {object} g2
 * @param {float} dw Angle in radians. Can be positive or negative.
 * @param {float} x x coordinate of endpoint.
 * @param {float} y y coordinate of endpoint.
 * @example
 * var g = g2();    // Create g2 object.
 * g.p()            // Begin path.
 *  .m(50,50)       // Move to point.
 *  .a(2,300,100)   // Create cubic bezier curve.
 *  .stroke()       // Stroke path.
 *  .exe(ctx);      // Render to canvas context.
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
 * @param {object} [p] Path2D object
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
 * @param {object} [p] Path2D object
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
 * @param {object} [p] Path2D object
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
 * @param {float} [x=0] x coordinate of text position.
 * @param {float} [y=0] y coordinate of text position.
 * @param {float} [maxWidth] Currently not used due to Chrome 36 (can't deal with 'undefined').
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
 * Draw image. It should be noted that the command queue will not be executed until all images have been completely loaded.
 * This also applies to images of child objects. If an image can not be loaded, it will be replaced by a broken-image.
 * @method
 * @returns {object} g2
 * @param {string} uri Image uri or data:url. On error: Broken Image will be loaded.
 * @param {float} [x=0] X-coordinate of image (upper left).
 * @param {float} [y=0] Y-coordinate of image (upper left).
 * @param {float} [b] Width.
 * @param {float} [h] Height.
 * @param {float} [xoff] X-offset.
 * @param {float} [yoff] Y-offset.
 * @param {float} [dx] X-delta.
 * @param {float} [dy] Y-delta.
 */
g2.prototype.img = function img(uri,x,y,b,h,xoff,yoff,dx,dy) {
   var image = new Image(), state = this.state ? this.state
                                               : (this.state = g2.State.create());
   state.loading++;
   image.onload = function load() { state.loading--; };
   image.onerror = function() { image.src = g2.prototype.img.broken; };
   image.src = uri;
   this.cmds.push({c:img.cmd,a:[this,image,x||0,y||0,b,h,xoff,yoff,dx,dy]});
   return this;
};
g2.prototype.img.cmd = function img_c(self,img,x,y,b,h,xoff,yoff,dx,dy) {
   b = b || img && img.width;
	h = h || img && img.height;
	if (self.state.cartesian) { this.save(); this.scale(1,-1); y = -y-h; }
	if (xoff || yoff || dx || dy)  // non-zero anyone .. ?
	   this.drawImage(img,xoff,yoff,dx,dy,x,y,b,h);
	else
	   this.drawImage(img,x,y,b,h);
	if (self.state.cartesian) { this.restore(); }
};
g2.prototype.img.broken = "data:image/gif;base64,R0lGODlhHgAeAKIAAAAAmWZmmZnM/////8zMzGZmZgAAAAAAACwAAAAAHgAeAEADimi63P5ryAmEqHfqPRWfRQF+nEeeqImum0oJQxUThGaQ7hSs95ezvB4Q+BvihBSAclk6fgKiAkE0kE6RNqwkUBtMa1OpVlI0lsbmFjrdWbMH5Tdcu6wbf7J8YM9H4y0YAE0+dHVKIV0Efm5VGiEpY1A0UVMSBYtPGl1eNZhnEBGEck6jZ6WfoKmgCQA7";
/**
 * Draw line.
 * @method
 * @returns {object} g2
 * @param {float} x1 Start x coordinate.
 * @param {float} y1 Start y coordinate.
 * @param {float} x2 End x coordinate.
 * @param {float} y2 End y coordinate.
 * @example
 * var g = g2();        // Create g2 object.
 * g.lin(10,10,190,10)  // Draw line.
 *  .exe(ctx);          // Render to canvas context.
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
 * @param {float} x x-value upper left corner.
 * @param {float} y y-value upper left corner.
 * @param {float} b Width.
 * @param {float} h Height.
 * @example
 * var g = g2();        // Create g2 object.
 * g.rec(100,80,40,30)  // Draw rectangle.
 *  .exe(ctx);          // Render to canvas context.
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
 * @param {float} x x-value center.
 * @param {float} y y-value center.
 * @param {float} r Radius.
 * @example
 * var g = g2();     // Create g2 object.
 * g.cir(100,80,20)  // Draw circle.
 *  .exe(ctx);       // Render to canvas context.
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
 * ![Example](../img/arc.png "Example")
 * @method
 * @returns {object} g2
 * @param {float} x x-value center.
 * @param {float} y y-value center.
 * @param {float} r Radius.
 * @param {float} [w=0] Start angle (in radian).
 * @param {float} [dw=2*pi] Angular range in radian. In case of positive values it is running clockwise with
 *                left handed default coordinate system.
 * @example
 * var g = g2();
 * g.arc(300,400,390,-Math.PI/4,-Math.PI/2)
 *  .exe(ctx);
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
 * @param {boolean} [closed=false] Draw closed polygon.
 * @param {object} [opts] Options object.
 * @param {string} [opts.fmt=x,y] Predefined polygon point iterators: `"x,y"` (Flat Array of x,y-values sequence), `"[x,y]"` (Array of [x,y] arrays), `"{x,y}"` (Array of {x,y} objects)
 * @param {function} [opts.itr] Iterator function getting array and point index as parameters: `function(arr,i)`. It has priority over 'fmt'.
 * @example
 * g2().ply([100,50,120,60,80,70]),
 *     .ply([150,60],[170,70],[130,80]],true,{fmt:"[x,y]"}),
 *     .ply({x:160,y:70},{x:180,y:80},{x:140,y:90}],true,{fmt:"{x,y}"}),
 *     .exe(ctx);
 */
g2.prototype.ply = function ply(parr,closed,opts) {
   var itr = opts && (opts.itr || opts.fmt && g2.prototype.ply.iterators[opts.fmt]) || false;
   this.cmds.push({c:ply.cmd,a:[parr,closed,itr]});
   return this;
};
g2.prototype.ply.cmd = function ply_c(parr,closed,itr) {
   var p, i = 0;
   itr = itr || g2.prototype.ply.itr;
   p = itr(parr,i++);
   if (!p.done) {      // draw polygon ..
      this.beginPath();
      this.moveTo(p.x,p.y);
      while (!(p = itr(parr,i++)).done)
         this.lineTo(p.x,p.y);
      if (closed)
         this.closePath();
   }
   g2.prototype.drw.cmd.call(this);
   return i-1;  // number of points ..
};

// predefined polygon point iterators
g2.prototype.ply.iterators = {
   "x,y":   function itr(arr,i) { return i < arr.length/2 ? {x:arr[2*i],y:arr[2*i+1]} : {done:true,count:arr.length/2}; },
   "[x,y]": function itr(arr,i) { return i < arr.length ? {x:arr[i][0],y:arr[i][1]} : {done:true,count:arr.length}; },
   "{x,y}": function itr(arr,i) { return i < arr.length ? arr[i] : {done:true,count:arr.length}; }
};
// default polygon point iterator ... flat array
g2.prototype.ply.itr = g2.prototype.ply.iterators["x,y"];

/**
 * Begin subcommands. Style state is saved. Optionally apply (similarity) transformation.
 * @method
 * @returns {object} g2
 * @param {float} x Translation value x.
 * @param {float} y Translation value y.
 * @param {float} w Rotation angle (in radians).
 * @param {float} scl Scale factor.
 */
g2.prototype.beg = function beg(x,y,w,scl) {
   this.cmds.push({c:beg.cmd, a:(arguments.length ? [this,x||0,y||0,w||0,scl||1] : [this]), open:true});
   return this;
};
g2.prototype.beg.cmd = function beg_c(self,x,y,w,scl) {
   self.state.save(this);
   if (arguments.length > 1)
      self.state.set("trf",{x:x,y:y,w:w,scl:scl},this);
};
/**
 * End subcommands. Previous style state is restored.
 * @method
 * @returns {object} g2
 */
g2.prototype.end = function end() {
   this.cmds.push({c:end.cmd,a:[this,this.findCmdIdx(end.isBeg)]});
   return this;
};
g2.prototype.end.cmd = function end_c(self,begidx) {
   self.state.restore(this);
};
g2.prototype.end.isBeg = function(cmd) {
   if (cmd.c === g2.prototype.beg.cmd && cmd.open === true) {
      delete cmd.open;
      return true;
   }
   return false;
};

/**
 * Clear canvas.
 * @method
 * @returns {object} g2
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
 * Show grid.
 * @method
 * @returns {object} g2
 * @param {string} [color=#ccc] CSS grid color.
 * @param {float} [size] Grid size (if g2 has a viewport object assigned, viewport's grid size is more relevant).
 */
g2.prototype.grid = function grid(color,size) {
   this.state = this.state || g2.State.create();
   this.state.gridBase = 2;
   this.state.gridExp  = 1;
   this.cmds.push({c:grid.cmd,a:[this,color,size]});
   return this;
};
g2.prototype.grid.cmd = function grid_c(self,color,size) {
   var state = self.state, trf = state.get("trf"),
       cartesian = state.cartesian,
       b = this.canvas.width, h = this.canvas.height,
       sz = size || g2.prototype.grid.getSize(state,trf ? trf.scl : 1),
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
 * Use g2 graphics commands from another g2 source object by reference.
 * With this command you can reuse instances of grouped graphics commands
 * while applying a similarity transformation on them.
 * In fact you might want to build custom graphics libraries on top of that feature.
 * @method
 * @returns {object} g2
 * @param {object | string} g g2 source object or symbol name found in 'g2.symbol' namespace.
 * @param {float} [x=0] Drawing x position.
 * @param {float} [y=0] Drawing y position.
 * @param {float} [w=0] Rotation Angle (in radians).
 * @param {float} [scl=1] Scale Factor.
 * @example
 * g2.symbol.circle = g2().cir(0,0,1);  // Define symbol of unit size '1'.
 * g2().use("circle", 100, 100, 0, 50)  // Draw circle with radius 50 at position 100|100.
 *     .exe(ctx);                       // Render to canvas context.
 */
g2.prototype.use = function use(g,x,y,w,scl) {
   if (typeof g === "string")  // must be a member name of the 'g2.symbol' namespace
      g = g2.symbol[g];
   if (g && g !== this) { // avoid self reference ..
      if (g.state && g.state.loading) { // referencing g2 object containing images ...
         var state = this.state || (this.state = g2.State.create());
         state.loading++;
         g.state.addListener("load",function() { state.loading--; });
      }
      this.cmds.push({c:use.cmd,a:arguments.length===1?[this,g]:[this,g,x,y,w,scl]});
   }
   return this;
};
g2.prototype.use.cmd = function use_c(self,g,x,y,w,scl) {
   var state = self.state;
   state.save(this);
   if (arguments.length > 2)
      state.set("trf",{x:x||0,y:y||0,w:w||0,scl:scl||1},this);
   self.exe(this,g);
   state.restore(this);
};

// style command ..
/**
 * Modifies the current graphics state.
 * @method
 * @returns {object} g2
 * @param {object} args Modifies graphics state by any number of properties. As an property name many of the known canvas names, as well as their short form are permitted.
 * @param {string} args.fillStyle Set fill color.
 * @param {string} args.fs See 'fillStyle'.
 * @param {string} args.strokeStyle Set stroke color.
 * @param {string} args.ls See 'strokeStyle'.
 * @param {float} args.lineWidth Set line width.
 * @param {float} args.lw See 'lineWidth'.
 * @param {string} args.lineCap Adds a cap to the line. Possible values: `butt`, `round` and `square`
 * @param {string} args.lc See 'lineCap'.
 * @param {string} args.lineJoin Set the way in which lines are joined. Possible values: `round`, `bevel` and `miter`
 * @param {string} args.lj See 'lineJoin'.
 * @param {float} args.miterLimit Set the mitering of the corner.
 * @param {float} args.ml See 'miterLimit'.
 * @param {array} args.lineDash Set the line dash.
 * @param {array} args.ld See 'lineDash'.
 * @param {int} args.lineDashOffset Set the offset of line dash.
 * @param {int} args.lo See 'lineDashOffset'.
 * @param {string} args.lineMode Set line mode. In _g2_'s basic form only `normal` supported.
 * @param {string} args.lm See 'lineMode'.
 * @param {float} args.shadowOffsetX Set the offset of the shadow in x.
 * @param {float} args.shx See 'shadowOffsetX'.
 * @param {float} args.shadowOffsetY Set the offset of the shadow in y.
 * @param {float} args.shy See 'shadowOffsetY'.
 * @param {float} args.shadowBlur Set the level of the blurring effect.
 * @param {float} args.shb See 'shadowBlur'.
 * @param {string} args.shadowColor Set the shadow color.
 * @param {string} args.shc See 'shadowColor'.
 * @param {string} args.textAlign Set holizontal text alignment.
 * @param {string} args.thal See 'textAlign'.
 * @param {string} args.textBaseline Set vertical text alignment.
 * @param {string} args.tval See 'textBaseline'.
 * @param {string} args.fontFamily Set font family.
 * @param {string} args.fof See 'fontFamily'.
 * @param {float} args.fontSize Set font size.
 * @param {float} args.foz See 'fontSize'.
 * @param {string} args.fontColor Set font color.
 * @param {string} args.foc See 'fontColor'.
 * @param {string} args.fontWeight Set font weight.
 * @param {string} args.fow See 'fontWeight'.
 * @param {string} args.fontStyle Set font style.
 * @param {string} args.fos See 'fontStyle'.
 * @param {bool} args.fontSizeNonScalable Prevent text scaling.
 * @param {bool} args.foznosc See 'fontSizeNonScalable'.
 * @param {bool} args.lineWidthNonScalable Prevent line scaling.
 * @param {bool} args.lwnosc See 'lineWidthNonScalable'.
 * @example
 * g = g2();
 * g.style({ fillStyle:"#58dbfa",  // Set fill style.
 *           lw:10,                // Set line width.
 *           ls:"#313942",         // Set line style.
 *           lj:"round" })         // Set line join.
 *  .rec(10,10,300,100)
 *  .style({ lw:20,                // Set line again.
 *           fs:"transparent",     // Set fill style.
 *           shx:10,               // Set shadow x-translation.
 *           shc:"black",          // Set shadow color
 *           shb:10,               // Set shadow blur.
 *           ld:[0.05,0.25] })     // Set line dash.
 *  .p().m(40,40).c(150,150,200,0,280,50).drw();
 * g.exe(ctx);
 */
g2.prototype.style = function style() {
   if (arguments) {
      if (arguments.length > 1) {  // old style api with flat "name","value" pair list ... will be deprecated some time.
         var styleObj = {};
         for (var i=0; i<arguments.length; i+=2)
            styleObj[arguments[i]] = arguments[i+1];
         this.cmds.push({c:style.cmd,a:[this,styleObj]});
      }
      else if (typeof arguments[0] === "object")  // new style api ... arguments.length === 1
         this.cmds.push({c:style.cmd,a:[this,arguments[0]]});
   }
   return this;
};
g2.prototype.style.cmd = function style_c(self,list) {
   var state=self.state, val;
   for (var m in list) {
      val = list[m];
      state.set(m, typeof val === "string" && val[0] === "@" ? state.get(val.substr(1),this) : val, this);
   }
};

// helper functions
/**
 * Execute g2 commands.
 * @method
 * @returns {object} g2
 * @param {object} ctx Canvas Context.
 * @param {object} [g=this] g2 Object to execute.
 */
g2.prototype.exe = function exe(ctx,g) {
   var cmds = (g || this).cmds;
   if (this.state && this.state.loading)  // give images a chance to complete loading ..
      requestAnimationFrame(exe.bind(this,ctx,g));  // .. so wait a while ..
   else if (ctx && cmds) {
      var gstate = g && g.state;
      if (g)   // external g2 in use .. copy state
         g.state = this.state;
      for (var i=0,n=cmds.length,cmd; i<n; i++)  // invoke the command queue
         (cmd=cmds[i]).c.apply(ctx,cmd.a);
      if (g)  // external g2 in use .. restore state
         g.state = gstate;
      else // must be parent g2 ...
         ctx.fillStyle = "#000000";  // ... reset .. for properly reinitializing ...
   }
   return this;
};

/**
 * Copy all g2 graphics commands from a g2 object. The copied commands are discrete and independent.
 * @method
 * @returns {object} g2
 * @param {object} g g2 object to copy commands from.
 * @example
 * var circle = g2().cir(100,100,50);
 * g2().cpy(circle);  // Copy all commands from 'circle'.
 * @example
 * function circle(g) {
 *    // do some calculations to define a circle for sorts
 *    return g.cir(100,100,50)
 * }
 * var g = g2();
 * g.cpy(circle(g));
 */
g2.prototype.cpy = function cpy(g) {
   if (g !== this)
      g.cmds.forEach(function(c,i) {if (i) this.cmds.push(c);},this); // avoid copying first '_init' command ...
   return this;
};

/**
 * Delete all commands.
 * @method
 * @returns {object} g2
 */
g2.prototype.del = function del() { // see http://jsperf.com/truncating-arrays-correctly
   this.cmds.length = 1;  // do not delete 'constructor' command.
   return this;
};

/**
 * Convert g2 command queue to JSON formatted string.
 * @param {string} [space] Number of spaces to use for indenting JSON output.
 * @return {string} JSON string of command queue.
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

// meta helper method ...
g2.filterProperty = function(property) {
   return { get: function(ctx) { return ctx[property]; }, set: function(val,ctx) { ctx[property] = val; } };
};
// State stack management class.
g2.State = {
   create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
   prototype: {
      constructor: function() {
         this.stack = [{}];
         this.trf0 = {x:0,y:0,w:0,scl:1}; // holding initial zoom, pan, ...
         this._loading = 0;
         this.on = {load:[]};
      },
      // manage asynchrone image loading ...
      get loading() { return this._loading; },
      set loading(n) { if ((this._loading = n) === 0) this.invokeListeners("load"); },
      // implement simple event listeners ...
      hasListeners: function(name)   { return this.on[name] && this.on[name].length; },
      hasListener: function(name,fn) { if (this.on[name]) for (var i=0;i<this.on[name].length;i++) if (this.on[name][i] === fn) return true; return false; },
      addListener: function(name,fn) { if (!this.hasListener(name,fn)) this.on[name].push(fn); },
      removeListener: function(name,fn) { if (this.on[name]) for (var i=0;i<this.on[name].length;i++) if (this.on[name][i] === fn) { this.on[name].splice(i,1); break; } },
      invokeListeners: function(name) { if (this.on[name]) for (var i=0;i<this.on[name].length;i++) this.on[name][i](); },
      // manage style attributes ...
      has: function(name,ctx) {
         name = g2.State.alias[name] || name;
         return ctx && g2.State.filter[name]
             || name in this.stack[this.stack.length-1]
             || this.hasOwnProperty(name);
      },
      get: function(name,ctx) {  // omit 'ctx' here when calling 'g2.State.filter[name]' function to avoid infinite recursion ... !
         name = g2.State.alias[name] || name;
         return ctx && g2.State.filter[name] && g2.State.filter[name].get && g2.State.filter[name].get.call(this,ctx)
             || this.stack[this.stack.length-1][name]
             || g2.State[name]
      },
      set: function(name,val,ctx) { // omit 'ctx' here when calling 'g2.State.filter[name]' function to avoid infinite recursion ... !
         name = g2.State.alias[name] || name;
         if (ctx && g2.State.filter[name] && g2.State.filter[name].set)
            g2.State.filter[name].set.call(this,val,ctx);
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
      reset: function(ctx) {
         this.stack = [{}];
         this.loadfn = [];
         ctx.lineWidth = 1;
         ctx.strokeStyle = "#000";
         ctx.fillStyle = g2.transparent;
         ctx.setLineDash([]);
         return this;
      },
      transform: function(t,ctx) {
         var trf = this.stack[this.stack.length-1].trf || g2.State.trf,
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
      get currentScale() { return (this.stack[this.stack.length-1].trf || g2.State.trf).scl; },
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
      }
   },
   // initial state values ... corresponding to Canvas Context ...
   fs: g2.transparent,  // fillStyle
   lm: "normal",  // linemode .. "normal" or 'jitter'
   foc: "#000",   // fontColor
   fos: "normal", // fontStyle [normal | italic | oblique]
   fow: "normal", // fontWeight [normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 ... ] s. CSS
   foz: 12,       // fontSize
   fof: "serif",  // fontFamily [serif | sans-serif | monospace | cursiv | fantasy | arial | verdana | ... ] s. CSS
   trf: {x:0,y:0,w:0,scl:1},

   alias: {
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
   },
   filter: {
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
      "lc": g2.filterProperty("lineCap"),
      "lj": g2.filterProperty("lineJoin"),
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
                   lw = this.get("lw",ctx),
                   ld = [];
               for (var i=0,n=val.length; i<n; i++) ld.push(val[i]/scl*lw);
               ctx.setLineDash(ld);
            }
         }
      },
      "lo": {  // TODO: make lw-dependent ..
         get: function(ctx) { return ctx.lineDashOffset; },
         set: function(val,ctx) { ctx.lineDashOffset = val; }
      },
      "ml": g2.filterProperty("miterLimit"),
      "shx": g2.filterProperty("shadowOffsetX"),
      "shy": g2.filterProperty("shadowOffsetY"),
      "shb": g2.filterProperty("shadowBlur"),
      "shc": {
         get: function(ctx) { return ctx.shadowColor; },
         set: function(val,ctx) { ctx.shadowColor = val === "transparent" ? g2.transparent : val; }
      },
      "thal": g2.filterProperty("textAlign"),
      "tval": g2.filterProperty("textBaseline"),
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
               lw = this.get("lw",ctx);
               ld = this.get("ld",ctx);
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
   }
};

// create symbol namespace ..
/**
 * Namespace for symbol objects. A symbol can be used by `use("symbolname")`.
 * @type {object}
 * @example
 * g2.symbol.circle = g2().cir(0,0,1);            // Define symbol of unit size '1'
 * g2().use("circle", 100, 100, 0, 50).exe(ctx);  // Draw circle with radius 50 at position 100|100
 */
g2.symbol = Object.create(null); // {};
