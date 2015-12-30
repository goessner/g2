/**
 * @fileoverview g2.c2d.js
 * @author Stefan Goessner (c) 2013-14
 * @license MIT License
 */
/* jshint -W014 */

g2.ifc.c2d = function(ctx) { return ctx instanceof CanvasRenderingContext2D; }
g2.proxy.c2d = function(ctx) { return ctx; }

g2.prototype.exe.c2d = {
   beg: function(self) {
      if (g2.exeStack++ === 0) { // outermost g2 ...
         var state = self.state || (self.state = g2.State.create(self)), t = state.trf0;
         this.setTransform(t.scl,0,0,state.cartesian?-t.scl:t.scl,t.x+0.5,(state.cartesian?this.canvas.height-t.y:t.y)+0.5);
         this.lineWidth = 1;
         this.strokeStyle = "#000";
         this.setLineDash([]);
         this.font = g2.State.c2d.getAttr.call(this,"font",state);
         this.fillStyle = g2.transparent;
         state.stack = [{}];
      }
   },
   end: function(self) {
      if (--g2.exeStack === 0)
         this.fillStyle = "#000000";
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

g2.prototype.stroke.c2d = function stroke_c2d(d) {
   if (d && typeof Path2D !== "undefined")
      this.stroke(new Path2D(d));
   else
      this.stroke();
};

g2.prototype.fill.c2d = function fill_c2d(d) {
   if (d && typeof Path2D !== "undefined")
      this.fill(new Path2D(d));
   else
      this.fill();
};

g2.prototype.drw.c2d = function drw_c2d(d) {
   var p2d = d && typeof Path2D !== "undefined" ? new Path2D(d) : false;
   p2d ? this.fill(p2d) : this.fill();
   if (this.fillStyle !== g2.transparent && this.shadowColor !== g2.transparent) {
      var tmp = this.shadowColor;        // avoid stroke shadow when filled ...
      this.shadowColor = "transparent";  // "rgba(0, 0, 0, 0)"
      p2d ? this.stroke(p2d) : this.stroke();
      this.shadowColor = tmp;
   }
   else
      p2d ? this.stroke(p2d) : this.stroke();
};

g2.prototype.txt.c2d = function txt_c2d(self,s,x,y,w,args) {
   var state = self.state, foc;
   state.save();
   this.save();
   g2.prototype.style.c2d.call(this,self,args);
   foc = state.getAttr("foc");
   if (w) {
      var sw = Math.sin(w), cw = Math.cos(w);
      this.transform(cw,sw,-sw,cw,(1-cw)*x+sw*y,-sw*x+(1-cw)*y);
   }
   if (state.cartesian) { this.scale(1,-1); y = -y; }
   if (foc !== g2.transparent) {
      this.fillStyle = foc;
      this.fillText(s,x,y);
   }
   else {
      this.fillText(s,x,y);
      this.strokeText(s,x,y);
   }
   this.restore();
   state.restore();
};

g2.prototype.img.c2d = function img_c2d(self,img,x,y,b,h,xoff,yoff,dx,dy) {
   b = b || img && img.width;
	h = h || img && img.height;
	if (self.state.cartesian) { this.save(); this.scale(1,-1); y = -y-h; }
	if (xoff || yoff || dx || dy)  // non-zero anyone .. ?
	   this.drawImage(img,xoff,yoff,dx,dy,x,y,b,h);
	else
	   this.drawImage(img,x,y,b,h);
	if (self.state.cartesian) { this.restore(); }
};

g2.prototype.lin.c2d = function lin_c2d(x1,y1,x2,y2) {
   this.beginPath();
   this.moveTo(x1,y1);
   this.lineTo(x2,y2);
   this.stroke();
};

g2.prototype.rec.c2d = function rec_c2d(x,y,b,h) {
   this.beginPath();
   this.rect(x,y,b,h);
   g2.prototype.drw.c2d.call(this);
};

g2.prototype.cir.c2d = function cir_c2d(x,y,r) {
   this.beginPath();
   this.arc(x,y,r,0,Math.PI*2,true);
   g2.prototype.drw.c2d.call(this);
};

g2.prototype.arc.c2d = function arc_c2d(x,y,r,w,dw) {
   this.beginPath();
   this.arc(x,y,r,w,w+dw,dw<0);
   g2.prototype.drw.c2d.call(this);
};

g2.prototype.ply.c2d = function ply_c2d(parr,mode,itr) {
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
   g2.prototype.drw.c2d.call(this);
   return i-1;  // number of points ..
};

g2.prototype.beg.c2d = function beg_c2d(self,args) {
   var state = self.state;
   state.save();
   this.save();
   if (args) {
      if ("x" in args || "y" in args || "w" in args || "scl" in args) {
         state.transform(args);
         g2.State.c2d.set.trf.call(this,args,state);
      }
      else if ("matrix" in args)
         this.transform.apply(this,args.matrix);
      g2.prototype.style.c2d.call(this,self,args);
   }
};

g2.prototype.end.c2d = function end_c2d(self,begidx) {
   this.restore();
   self.state.restore();
};

g2.prototype.clr.c2d = function clr_c2d() {
   this.save();
   this.setTransform(1,0,0,1,0,0);
   this.clearRect(0,0,this.canvas.width,this.canvas.height);
   this.restore();
};

g2.prototype.grid.c2d = function grid_c2d(self,color,size) {
   var state = self.state, trf = state.getAttr("trf"),  // no ctx required ...
       cartesian = state.cartesian,
       b = this.canvas.width, h = this.canvas.height,
       sz = size || g2.prototype.grid.getSize(state,trf ? trf.scl : 1),
       xoff = trf.x ? trf.x%sz-sz : 0, yoff = trf.y ? trf.y%sz-sz : 0;

   this.save();
   if (cartesian) this.setTransform(1,0,0,-1,0.5,h-0.5);
   else           this.setTransform(1,0,0,1,0.5,0.5);
   this.strokeStyle = color || "#ccc";
   this.lineWidth = 1;
   this.beginPath();
   for (var x=xoff,nx=b+1; x<nx; x+=sz) { this.moveTo(x,0); this.lineTo(x,h); }
   for (var y=yoff,ny=h+1; y<ny; y+=sz) { this.moveTo(0,y); this.lineTo(b,y); }
   this.stroke();
   this.restore();
};

g2.prototype.use.c2d = function use_c2d(self,g,args) {
   var state = self.state;
   state.save();
   this.save();
   if (args) {
      if ("x" in args || "y" in args || "w" in args || "scl" in args) {
         state.transform(args);
         g2.State.c2d.set.trf.call(this,args,state);
      }
      else if ("matrix" in args)
         this.transform.apply(this,args.matrix);
      g2.prototype.style.c2d.call(this,self,args);
   }
   self.exe(this,g);
   this.restore();
   state.restore();
};

g2.prototype.style.c2d = function style_c2d(self,args) {
   var state = self.state, val;
   for (var m in args) {
      val = args[m];
      if (typeof val === "string" && val[0] === "@")
         val = g2.State.c2d.getAttr.call(this,val.substr(1),state);
      g2.State.c2d.setAttr.call(this,m,val,state);
   }
};

g2.State.c2d = {
   getAttr: function(name,state) {
      return g2.State.c2d.get[name]
           ? g2.State.c2d.get[name].call(this,state)
           : state.getAttr(name);
   },
   setAttr: function(name,val,state) {
      var tnames = {x:0,y:0,w:0,scl:0};
      if (!(name in tnames)) 
          g2.State.c2d.set[name] 
        ? g2.State.c2d.set[name].call(this,val,state)
        : state.setAttr(name,val);
   },
   get: {
      "fs": function() { return this.fillStyle; },
      "ls": function() { return this.strokeStyle; },
      "lw": function(state) { return this.lineWidth*(state.getAttr("lwnosc") ? state.currentScale : 1); },
      "lc": function() { return this.lineCap; },
      "lj": function() { return this.lineJoin; },
      "lo": function() { return this.lineDashOffset; },  // TODO make lw dependent
      "ld": function() {
               var lw = this.lineWidth,
                   ld = this.getLineDash();
               for (var i=0,n=ld.length; i<n; i++) ld[i] /= lw;
               return  ld;
            },
      "ml": function() { return this.miterLimit; },
      "sh": function() { return [this.shadowOffsetX,this.shadowOffsetY,this.shadowBlurthis.shadowColor]; },
      "thal": function() { return this.textAlign; },
      "tval": function() { return this.textBaseline; },
      "font": function(state) {
                 var fos = state.getAttr("fos"),
                     fow = state.getAttr("fow"),
                     foz = state.getAttr("foz"),
                     fof = state.getAttr("fof"),
                     font = (fos === "normal" ? "" : (fos+" ")) +
                            (fow === "normal" ? "" : (fow+" ")) +
                            (foz + "px " + fof);
                  return font;
              }
   },
   set: {
      "fs": function(val) { this.fillStyle = val === "transparent" ? g2.transparent : val; },
      "ls": function(val) { this.strokeStyle = val === "transparent" ? g2.transparent : val; },
      "lw": function(val,state) { this.lineWidth = val/(state.getAttr("lwnosc") ? state.currentScale : 1); },
      "lc": function(val) { this.lineCap = val; },
      "lj": function(val) { this.lineJoin = val; },
      "lo": function(val) { this.lineDashOffset = val; },  // TODO make lw dependent
      "ld": function(val,state) {
               var scl = state.getAttr("lwnosc") ? state.currentScale : 1;
               if (scl !== 1) {
                  var lw = this.lineWidth*scl, ld = [];
                  for (var i=0,n=val.length; i<n; i++) ld.push(val[i]/lw);
                  this.setLineDash(ld);
               }
               else
                  this.setLineDash(val);
            },
      "ml": function(val) { this.miterLimit = val; },
      "sh": function(val,state) {
               if (val) {
                  state.setAttr("sh",val);
                  if (val[0]) this.shadowOffsetX = val[0] || 5;
                  if (val[1]) this.shadowOffsetY = val[1] || 5;
                  if (val[2]) this.shadowBlur = val[2] || 5;
                  if (val[3]) this.shadowColor = val[3] || "rgba(0,0,0,0.5)";
               }
            },
      "thal": function(val) { this.textAlign = val; },
      "tval": function(val) { this.textBaseline = val; },
      "foc": function(val,state) { state.setAttr("foc",val === "transparent" ? g2.transparent : val); },
      "fos": function(val,state) { state.setAttr("fos",val); this.font = g2.State.c2d.get["font"](state); },
      "fow": function(val,state) { state.setAttr("fow",val); this.font = g2.State.c2d.get["font"](state); },
      "foz": function(val,state) { state.setAttr("foz",val/(state.getAttr("foznosc") ? state.currentScale : 1)); this.font = g2.State.c2d.get["font"](state); },
      "fof": function(val,state) { state.setAttr("fof",val); this.font = g2.State.c2d.get["font"](state); },
      "lwnosc": function(val,state) {                      // undocumented beta feature
                   if (val !== state.getAttr("lwnosc")) {  // value changing ...
                      if (val) this.lineWidth /= state.currentScale;
                      else     this.lineWidth *= state.currentScale;
                      state.setAttr("lwnosc",val);
                   }
                },
      "foznosc": function(val,state) {                       // undocumented beta feature
                    if (val !== state.getAttr("foznosc")) {  // value changing ...
                       var foz = state.getAttr("foz");
                       if (val) foz /= state.currentScale;
                       else     foz *= state.currentScale;
                       state.setAttr("foz",foz);
                       this.font = state.font;
                       state.setAttr("lwnosc",val);
                    }
                 },
      "trf": function(t,state) {
                var scl = t.scl || 1,
                    sclChg = scl !== 1,  // scale value changing ...
                    lw, ld, foz,
                    sw = scl*(t.w?Math.sin(t.w):0), cw = scl*(t.w?Math.cos(t.w):1);
                if (sclChg) {   // do not scale these style attributes ... so store them ...
                   lw = g2.State.c2d.get["lw"].call(this,state);
                   ld = g2.State.c2d.get["ld"].call(this,state);
                   foz = state.getAttr("foz");
                }
                this.transform(cw,sw,-sw,cw,t.x||0,t.y||0);
                if (sclChg) {   // ... for reassignment.
                   g2.State.c2d.set["lw"].call(this,lw,state);
                   g2.State.c2d.set["ld"].call(this,ld,state);
                   g2.State.c2d.set["foz"].call(this,foz,state);
                }
             }
   }
}
