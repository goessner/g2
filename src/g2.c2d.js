/**
 * @fileoverview g2.c2d.js
 * @author Stefan Goessner (c) 2013-16
 * @license MIT License
 */
/* jshint -W014 */

g2.ifc.c2d = function(ctx) { return ctx instanceof CanvasRenderingContext2D; }
g2.proxy.c2d = function(ctx) { return ctx; }

g2.prototype.exe.c2d = {
   beg: function(owner) {        // owner g2 object ...
      if (g2.exeStack++ === 0) { // outermost g2 ...
         var state = (this.g2_owner = owner).state,
             t = state.trf;      // initial transform (zoom, pan ...)
         state.beg(this);
         this.setTransform(t.scl,0,0,state.cartesian?-t.scl:t.scl,t.x+0.5,(state.cartesian?this.canvas.height-t.y:t.y)+0.5);
         this.lineWidth = 1;
         this.strokeStyle = "#000";
         this.setLineDash([]);
         this.font = state.cssFont;
         this.fillStyle = g2.transparent;
      }
   },
   end: function() {
      if (--g2.exeStack === 0) {
         this.fillStyle = "#000000";
         this.g2_owner.state.end(this);
         delete this.g2_owner;
      }
   }
};

/**
 * canvas 2d interface
 */
g2.prototype.p.c2d = CanvasRenderingContext2D.prototype.beginPath;

g2.prototype.m.c2d = CanvasRenderingContext2D.prototype.moveTo;

g2.prototype.l.c2d = CanvasRenderingContext2D.prototype.lineTo;

g2.prototype.q.c2d = CanvasRenderingContext2D.prototype.quadraticCurveTo;

g2.prototype.c.c2d = CanvasRenderingContext2D.prototype.bezierCurveTo;

g2.prototype.a.c2d = CanvasRenderingContext2D.prototype.arc;

g2.prototype.z.c2d = CanvasRenderingContext2D.prototype.closePath;

g2.prototype.stroke.c2d = function stroke_c2d(style,d) {
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   if (d && typeof Path2D !== "undefined")
      this.stroke(new Path2D(d));
   else
      this.stroke();
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.fill.c2d = function fill_c2d(style,d) {
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   if (d && typeof Path2D !== "undefined")
      this.fill(new Path2D(d));
   else
      this.fill();
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.drw.c2d = function drw_c2d(style,d) {
   var p2d = d && typeof Path2D !== "undefined" ? new Path2D(d) : false;
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   p2d ? this.fill(p2d) : this.fill();
   if (this.fillStyle !== g2.transparent && this.shadowColor !== g2.transparent) {
      var tmp = this.shadowColor;        // avoid stroke shadow when filled ...
      this.shadowColor = "transparent";  // "rgba(0, 0, 0, 0)"
      p2d ? this.stroke(p2d) : this.stroke();
      this.shadowColor = tmp;
   }
   else
      p2d ? this.stroke(p2d) : this.stroke();
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.txt.c2d = function txt_c2d(s,x,y,w,style) {
   var state = this.g2_owner.state;

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
   var cartesian = this.g2_owner.state.cartesian;
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
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   this.beginPath();
   this.moveTo(x1,y1);
   this.lineTo(x2,y2);
   this.stroke();
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.rec.c2d = function rec_c2d(x,y,b,h,style) {
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   this.beginPath();
   this.rect(x,y,b,h);
   g2.prototype.drw.c2d.call(this);
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.cir.c2d = function cir_c2d(x,y,r,style) {
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   this.beginPath();
   this.arc(x,y,r,0,Math.PI*2,true);
   g2.prototype.drw.c2d.call(this);
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.arc.c2d = function arc_c2d(x,y,r,w,dw,style) {
   if (style) { this.save();this.g2_owner.state.save().add(style); }
   this.beginPath();
   this.arc(x,y,r,w,w+dw,dw<0);
   g2.prototype.drw.c2d.call(this);
   if (style) { this.g2_owner.state.restore(); this.restore(); }
};

g2.prototype.ply.c2d = function ply_c2d(parr,mode,itr,style) {
   var p, i = 0, split = mode === "split";
   p = itr(parr,i++);
   if (!p.done) {      // draw polygon ..
      this.beginPath();
      this.moveTo(p.x,p.y);
      while (!(p = itr(parr,i++)).done) {
         if (split && i%2) this.moveTo(p.x,p.y);  
         else              this.lineTo(p.x,p.y);
      }
      if (mode && !split)  // closed then ..
         this.closePath();
   }
   g2.prototype.drw.c2d.call(this,style);
   return i-1;  // number of points ..
};

g2.prototype.beg.c2d = function beg_c2d(args) {
   this.save();
   this.g2_owner.state.save().add(args);
};

g2.prototype.end.c2d = function end_c2d() {
   this.g2_owner.state.restore();
   this.restore();
};

g2.prototype.clr.c2d = function clr_c2d() {
   this.save();
   this.setTransform(1,0,0,1,0,0);
   this.clearRect(0,0,this.canvas.width,this.canvas.height);
   this.restore();
};

g2.prototype.grid.c2d = function grid_c2d(color,size) {
   var state = this.g2_owner.state, trf = state.trf0,
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
   var owner = this.g2_owner;
   this.save();
   owner.state.save().add(args);
   owner.exe(this,g);
   owner.state.restore();
   this.restore();
};

g2.prototype.style.c2d = function style_c2d(args) {
   this.g2_owner.state.add(args);
};

g2.State.c2d = {
   "fs": function(val) { 
            this.fillStyle = val.indexOf && val.indexOf("hatch(") === 0 ? g2.State.c2d.hatch.call(this,val.substring(6,val.indexOf(")",7)).split(","))
                           : val === "transparent" ? g2.transparent 
                           : val; 
         },
   "ls": function(val) { 
            this.strokeStyle = val.indexOf && val.indexOf("hatch(") === 0 ? g2.State.c2d.hatch.call(this,val.substring(6,val.indexOf(")",7)).split(","))
                             : val === "transparent" ? g2.transparent 
                             : val; 
         },
   "lw": function(val,state) { this.lineWidth = val/(state.get("lwnosc") ? state.trf.scl : 1); },
   "lc": function(val) { this.lineCap = val; },
   "lj": function(val) { this.lineJoin = val; },
   "lo": function(val) { this.lineDashOffset = val; },  // TODO make lw dependent
   "ld": function(val,state) {
            var scl = state.get("lwnosc") ? state.trf.scl : 1;
            if (scl !== 1) {
               var lw = this.lineWidth*scl, ld = [];
               for (var i=0,n=val.length; i<n; i++) ld.push(val[i]/lw);
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
   "lwnosc": function(val,state) {                      // undocumented beta feature
                if (val !== state.get("lwnosc")) {  // value changing ...
                   if (val) this.lineWidth /= state.trf.scl;
                   else     this.lineWidth *= state.trf.scl;
                }
             },
   "trf": function(t) {
             var scl = t.scl || 1,
                 sw = scl*(t.w?Math.sin(t.w):0), cw = scl*(t.w?Math.cos(t.w):1);
             this.transform(cw,sw,-sw,cw,t.x||0,t.y||0);
          },
   "matrix": function(m) {
                this.transform.apply(this,m);
             },
   "hatch": function hatch(val) {
      console.log(val)
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
};
