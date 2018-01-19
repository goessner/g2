/**
 * @fileoverview g2.svg.js
 * @author Stefan Goessner (c) 2015-17
 * @license MIT License
 */
/* jshint -W014 */

// treat node.js
if (this.require !== undefined)  // assume 'g2.js' in the same directory ...
    g2 = require("./g2.js");

g2.svgHdl = function(ctx) {
    if (this instanceof g2.svgHdl) {
        this.ctx = ctx;
        this.grpidx = 0;
        return this;
    }
    return g2.svgHdl.apply(Object.create(g2.svgHdl.prototype),[ctx]);
};
g2.handlers.push((ctx) => {                                              // container element ..
    return Object.getPrototypeOf(ctx) === g2.svgHdl.prototype            // g2.svg already ..
        || typeof ctx === "object" && "height" in ctx && "width" in ctx  // for node.js .. { width:401, height:301 }
        || "innerHTML" in ctx ? g2.svgHdl(ctx) : null;                   // for browser .. <div data-width="401" data-height="301"></div>
})

g2.svg.prototype = {
    get width() { 
        return "innerHTML" in this.ctx 
                ? +this.ctx.getAttribute("data-width") 
                : +this.ctx.width; 
    },
    get height() { 
        return "innerHTML" in this.ctx
                ? +this.ctx.getAttribute("data-height") 
                : +this.ctx.height;
    },
    get str()  { return this.content[this.content.open]; },
    set str(s) { this.content[this.content.open] = s; },
    init: function(ctx,grp) {
        this.content = {
           svg: "",        // main section
           head: "",       // defs section
           body: "",       // visible section
           open: "body"
        };
        this.name = grp.id || '$grp' + (++this.grpidx);
        this.outerTransform = false;
        this.openGroups = [];
        this.path = false;
        this.useReg = [];  // registry of used g2 objects ...
        return true; 
    },
    exe: function(ctx,commands) {
        // build body by commands first...
        this.content.open = "body";
        for (let cmd of commands) {
            if (this[cmd.c])
                cmd.a ? this[cmd.c](ctx,cmd.a) : this[cmd.c](ctx);
        }
        // chrome and edge don't support transform property on outermost <svg> element. So add outer <g> element.
        if (this.cartesian)
            this.str = '<g transform="matrix('+[1,0,0,-1,+0.5,this.height-0.5]+')">\n' + this.str + '</g>\n';
        else  // if (t.x !== 0 || t.y !== 0 || t.scl !== 1 ) {
            this.str = '<g transform="matrix('+[1,0,0,1,+0.5,+0.5]+')">\n' + this.str + '</g>\n';

        // build svg wrapper ..
        this.content.open = "svg";
        this.str = '<svg width="'+this.width+'" height="'+this.height+'" fill="transparent" stroke="black">\n';
console.log(this.toString())
        this.ctx.innerHTML = this.toString();
    },
    cartesian: function(ctx) { this.cartesian = true; },
    cir: function(ctx,{x,y,r}) {
        this.str += '<circle cx="'+x+'" cy="'+y+'" r="'+r+'"';
    },
    toString: function() {
        let out = this.content.svg;
        if (this.content.head)
            out += '<defs>\n' + this.content.head + '</defs>\n';
        out += this.content.body + '</svg>\n';
        return out;
    },
};
/*
g2.svg = {
   create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
   prototype: {
      constructor: function(ctx) {
         this.ctx = ctx;
         this.name = "$" + g2.Svg.instances++ + "_";
         this.content = {
            svg: "",        // main section
            head: "",       // defs section
            body: "",       // visible section
            open: "body"
         };
         this.outerTransform = false;
         this.openGroups = [];
         this.path = false;
         this.useReg = [];  // registry of used g2 objects ...
      },
      get width() { return "innerHTML" in this.ctx 
                         ? +this.ctx.getAttribute("data-width") 
                         : +this.ctx.width; 
      },
      get height() { return "innerHTML" in this.ctx
                          ? +this.ctx.getAttribute("data-height") 
                          : +this.ctx.height;
      },
      get str()  { return this.content[this.content.open]; },
      set str(s) { this.content[this.content.open] = s; },
      toString: function() {
         var out = this.content.svg;
         if (this.content.head)
            out += '<defs>\n' + this.content.head + '</defs>\n';
         out += this.content.body + '</svg>\n';
         return out;
      },
      applyStyle: function(args,state,local) {
         for (var m in args) {
            var val = args[m];
            if (typeof val === "string" && val[0] === "@")
               val = state.getAttr(val.substr(1));
            if (!local) state.setAttr(m, val);
            if (g2.State.svg.set[m])
               g2.State.svg.set[m].call(this,val,state);
         }
      }
   },
   instances: 0
};

g2.ifc.svg = function(ctx) {
   return Object.getPrototypeOf(ctx) === g2.Svg.prototype
       || "innerHTML" in ctx
       || typeof ctx === "object" && "height" in ctx && "width" in ctx;
}
g2.context.svg = function(ctx) { return Object.getPrototypeOf(ctx) === g2.Svg.prototype ? ctx : g2.Svg.create(ctx); }

g2.prototype.exe.pre.svg = function(g) {        // calling g2 object ...
   if (g2.exeStack++ === 0) { // outermost g2 ...
      var state = (this.g2state = g.state), t = state.trf;      // initial transform (zoom, pan ...)
      this.content.open = "svg";
      this.str = '<svg width="'+this.width+'" height="'+this.height+'" fill="transparent" stroke="black"';
      this.str += ' font-family="'+state.get('fof')+'" font-style="'+state.get('fos')+
                  '" font-size="'+state.get('foz')+'" font-weight="'+state.get('fow')+'">\n';
      this.content.open = "body";
      // chrome and edge don't support transform property on outermost <svg> element. So add outer <g> element.
      if (state.cartesian) {
         this.str += '<g transform="matrix('+[t.scl,0,0,-t.scl,t.x+0.5,this.height-t.y+0.5]+')">\n';
         this.outerTransform = true;          
      }
      else { // if (t.x !== 0 || t.y !== 0 || t.scl !== 1 ) {
         this.str += '<g transform="matrix('+[t.scl,0,0,t.scl,t.x+0.5,t.y+0.5]+')">\n';
         this.outerTransform = true;          
      }
   }
   else {                          // 'used' g2 object
      this.content.open = "head";  // .. so write it to the defs section.
      this.str += '<g id="'+this.currentGroupName+'">\n';
      this.openGroups.push("group");
   }
};
g2.prototype.exe.post.svg = function() {
   if (--g2.exeStack === 0) {
      while (this.openGroups.pop())
         this.str += '</g>\n';
      if (this.outerTransform)
         this.str +='</g>\n';
      // write svg string ...
      if ("innerHTML" in this.ctx )
         this.ctx.innerHTML = this.toString();
      else
         this.ctx.svg = this.toString();
   }
   else {                       // 'used' g2 object
      while (this.openGroups.pop() !== "group") // close all defined groups ...
         this.str += '</g>\n';
      this.str += '</g>\n';
      this.content.open = "body";
   }
};

g2.prototype.p.svg = function p_svg() {
   this.path = "";
};

g2.prototype.m.svg = function m_svg(x,y) {
   this.path += 'M'+x+','+y;
};

g2.prototype.l.svg = function l_svg(x,y) {
   this.path += 'L'+x+','+y;
};

g2.prototype.q.svg = function q_svg(x1,y1,x,y) {
   this.path += 'Q'+x1+','+y1+','+x+','+y;
};

g2.prototype.c.svg = function c_svg(x1,y1,x2,y2,x,y) {
   this.path += 'C'+x1+','+y1+','+x2+','+y2+','+x+','+y;
};

g2.prototype.a.svg = function a_svg(x0,y0,r,w1,w2,ccw) {
   var x = x0 + r*Math.cos(w2), y = y0 + r*Math.sin(w2),
       dw = ccw ? w1 - w2 : w2 - w1;
   this.path += 'A'+r+','+r+',0,'+(Math.abs(dw)>Math.PI?1:0)+','+(ccw?0:1)+','+x+','+y;
};

g2.prototype.z.svg = function z_svg(x1,y1,x2,y2,x,y) {
   this.path += 'Z';
};

g2.prototype.stroke.svg = function stroke_svg(style,d) {
   if (d) this.path = d;
   if (this.path) {
      this.str += '<path';
      if (style) this.g2state.save().add(style);
      this.str += ' fill="transparent" d="'+this.path+'"/>\n';
      if (style) this.g2state.restore();
   }
   this.path = false;
};

g2.prototype.fill.svg = function fill_svg(style,d) {
   if (d) this.path = d;
   if (this.path) {
      this.str += '<path';
      if (style) this.g2state.save().add(style);
      this.str += ' stroke="none" d="'+this.path+'"/>\n';
      if (style) this.g2state.restore();
   }
   this.path = false;
};
g2.prototype.drw.svg = function drw_svg(style,d) {
   if (d) this.path = d;
   if (this.path){
      this.str += '<path';
      if (style) this.g2state.save().add(style);
      this.str += ' d="'+this.path+'"/>\n';
      if (style) this.g2state.restore();
   }
   this.path = false;
};
g2.prototype.txt.svg = function txt_svg(s,x,y,w,style) {
   var state = this.g2state;
   this.str += '<text stroke="none"';
   if (style) state.save().add(style);
   if (!(style && "foc" in style) && state.get("foc") !== state.get("fill"))
      this.str += ' fill="'+state.get("foc")+'"';
   if (state.get("tval"))
      g2.State.svg.tval.call(this,state.get("tval"));
   if (state.cartesian || w) {
      var sw = (w?Math.sin(w):0), cw = (w?Math.cos(w):1);
      // compensate cartesian transform to prevent vertically mirrored text about horizontal axis.
      this.str += state.cartesian
                ? ' transform="matrix('+[cw,sw,sw,-cw,x||0,y||0]+')"'
                : ' transform="matrix('+[cw,sw,-sw,cw,x||0,y||0]+')"';
   }
   else
      this.str += ' x="'+x+'" y="'+y+'"';
   this.str += '>'+s+'</text>\n';
   if (style) state.restore();
};

g2.prototype.img.svg = function img_svg(img,x,y,b,h) {
   b = b || img.width;
   h = h || img.height;
   this.str += '<image xlink:href="'+img.src+'" width="'+b+'" height="'+h+'"';
   this.str += this.g2state.cartesian
             ? ' transform="matrix('+[1,0,0,-1,x,y+h]+')"'
             : ' x="'+x+'" y="'+y+'"';
   this.str += '></image>\n';
};

g2.prototype.lin.svg = function lin_svg(x1,y1,x2,y2,style) {
   this.str += '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"';
   if (style) this.g2state.save().add(style);
   this.str += '/>\n';
   if (style) this.g2state.restore();
};

g2.prototype.rec.svg = function rec_svg(x,y,b,h,style) {
   this.str += '<rect x="'+x+'" y="'+y+'" width="'+b+'" height="'+h+'"';
   if (style) this.g2state.save().add(style);
   this.str += '/>\n';
   if (style) this.g2state.restore();
};

g2.prototype.cir.svg = function cir_svg(x,y,r,style) {
   this.str += '<circle cx="'+x+'" cy="'+y+'" r="'+r+'"';
   if (style) this.g2state.save().add(style);
   this.str += '/>\n';
   if (style) this.g2state.restore();
};

g2.prototype.arc.svg = function arc_svg(x,y,r,w,dw,style) {
   this.str += '<path d="M'+(x+Math.cos(w)*r)+','+(y+Math.sin(w)*r)+'A'+r+','+r+',0,'+(+(Math.abs(dw)>Math.PI))+
                        ','+(+(Math.sign(dw)>0))+','+(x+Math.cos(w+dw)*r)+','+(y+Math.sin(w+dw)*r)+'"';
   if (style) this.g2state.save().add(style);
   this.str += '/>\n';
   if (style) this.g2state.restore();
};

g2.prototype.earc.svg = function arc_svg(x,y,rx,ry,w,dw,args) {
   var phi = args && args.rot || 0, 
       cp  = Math.cos(phi),  sp  = Math.sin(phi),
       rx1 = rx*Math.cos(w), ry1 = ry*Math.sin(w),
       x1 = rx1*cp - ry1*sp, y1 = rx1*sp + ry1*cp,
       rx2 = rx*Math.cos(w+dw), ry2 = ry*Math.sin(w+dw),
       x2 = rx2*cp - ry2*sp, y2 = rx2*sp + ry2*cp;
   this.str += '<path d="M'+(x+x1)+','+(y+y1)+'A'+rx+','+ry+','+(phi/Math.PI*180)+','+(+(Math.abs(dw)>Math.PI))+
                        ','+(+(Math.sign(dw)>0))+','+(x+x2)+','+(y+y2)+'"';
   if (args) this.g2state.save().add(args);
   this.str += '/>\n';
   if (args) this.g2state.restore();
};

g2.prototype.ply.svg = function ply_svg(pts,mode,pi,style) {
   var p, i = 0, split = mode === "split", pstr = '';
   pstr += 'M'+(p=pi(0)).x+','+p.y;
   for (i=1; i < pi.len; i++) 
      pstr += (split ? (i%2 === 0 ? 'M' : 'L') : ' ') + (p=pi(i)).x + ',' + p.y;
   if (mode && !split)  // closed then ..
      pstr += 'Z';
   this.str += '<path';
   if (style) this.g2state.save().add(style);
   this.str += ' d="'+pstr+'"/>\n';
   if (style) this.g2state.restore();
};

g2.prototype.spline.svg = function spline_svg(b,closed,style) {
   var pstr = '';
   pstr += 'M'+b[0].x+','+b[0].y;
   for (var i=0, n=b.length; i < n-1; i++)
      pstr += 'C'+b[i].x1+','+b[i].y1+','+b[i].x2+','+b[i].y2+','+b[i+1].x+','+b[i+1].y;
   if (closed)
      pstr += 'Z';
   this.str += '<path';
   if (style) this.g2state.save().add(style);
   this.str += ' d="'+pstr+'"/>\n';
   if (style) this.g2state.restore();
};

g2.prototype.beg.svg = function beg_svg(args) {
   this.g2state.save();
   this.openGroups.push("beg");
   this.str += '<g';
   if (args) {
      this.g2state.add(args);
   }
   this.str += '>\n';
};

g2.prototype.end.svg = function end_svg() {
   while (this.openGroups.pop() !== "beg")
      this.str += '</g>\n';
   this.str += '</g>\n';
   this.g2state.restore();
};

g2.prototype.clr.svg = function clr_svg() {
//   this.content.head = this.content.body = "";  // cannot clear body content due to initial transform ...
};

g2.prototype.grid.svg = function grid_svg(color,size) {
   var state = this.g2state, trf = state.trf,  // no ctx required ...
       b = this.width, h = this.height, trf0 = state.trf0, s = trf0.scl,
       sz = size || g2.prototype.grid.getSize(state,trf ? s : 1),
       xoff = trf.x ? trf.x%sz-sz : 0, yoff = trf.y ? trf.y%sz-sz : 0;

   this.str += '<path stroke="'+(color||'#ccc')+'" stroke-width="1"';
   this.str += state.cartesian ? ' transform="matrix('+[1/s,0,0,-1/s,-trf0.x/s,(h-trf0.y)/s]+')"'
                               : ' transform="matrix('+[1/s,0,0,1/s,-trf0.x/s,-trf0.y/s]+')"';
   this.str += ' d="'; 
   for (var x=xoff,nx=b+1; x<nx; x+=sz) 
      this.str += 'M'+x+',0'+'L'+x+','+h;
   for (var y=yoff,ny=h+1; y<ny; y+=sz) 
      this.str += 'M0,'+y+'L'+b+','+y;
   this.str += '"/>\n';
};

g2.prototype.use.svg = function use_svg(g,args) {
   var idx = this.useReg.indexOf(g), name;

   for (var m in g2.symbol)   // lookup `g2.symbol` dictionary for `g`.
      if (g2.symbol[m] === g)
         name = m;
   if (idx < 0) {             // referenced g2 object 'g' not in 'use registry' ..
      idx = this.useReg.push(g) - 1;
      this.currentGroupName = name || (this.name + idx);
      this.g2state.save();
      g2.prototype.exe.use.call(g,this,"svg");
      this.g2state.restore();
   }
   this.g2state.save();
   this.str += '<use xlink:href="#'+(name || (this.name + idx))+'"';
   if (args)
      this.g2state.add(args);
   this.str += '/>\n';
   this.g2state.restore();
};

g2.prototype.style.svg = function style_svg(args) {
   this.openGroups.push("style");  // open 'style' labeled group ...
   this.str += '<g';
   this.g2state.add(args);
   this.str += '>\n';
};

g2.State.svg = {
   "fs": function(val) { 
            val = val.indexOf && val.indexOf("hatch(") === 0 
                ? g2.State.svg.hatch.call(this,val.substring(6,val.indexOf(")",7)).split(","))
                : val;
            this.str += ' fill="' + val + '"';
         },
   "ls": function(val) {
            val = val.indexOf && val.indexOf("hatch(") === 0 
                ? g2.State.svg.hatch.call(this,val.substring(6,val.indexOf(")",7)).split(","))
                : val;
            this.str += ' stroke="' + val + '"';
         },
   "lw": function(val,state) { this.str += ' stroke-width="'+val+'"'; },
   "lwnosc": function(val,state) { this.str += ' vector-effect="non-scaling-stroke"'; },
   "lc": function(val) {  this.str += ' stroke-linecap="'+val+'"'; },
   "lj": function(val) { this.str += ' stroke-linejoin="'+val+'"'; },
   "lo": function(val) { this.str += ' stroke-dashoffset="'+val+'"'; },  // TODO make lw dependent
   "ld": function(val,state) {
            var scl = state.get("lwnosc") ? state.current.scl : 1;
            if (!val.length)
                  this.str += ' stroke-dasharray="none"';
            else if (scl !== 1) {
               var lw = state.get("lw")*scl, ld = [];
               for (var i=0,n=val.length; i<n; i++) ld.push(val[i]/lw);
                  this.str += ' stroke-dasharray="'+ld+'"';
            }
            else
               this.str += ' stroke-dasharray="'+val+'"';
         },
   "ml": function(val) { this.str += ' stroke-miterlimit="'+val+'"'; },
   // use simple css drop-shadow instead of svg filters.
   // s. https://developer.mozilla.org/de/docs/Web/SVG/Element/feGaussianBlur
   // s. https://developer.mozilla.org/de/docs/Web/CSS/box-shadow
   // s. http://thenewcode.com/598/boxshadow-property-vs-dropshadow-filter-a-complete-comparison
   "sh": function(val,state) {
            this.str += ' style="filter:drop-shadow('+(val[0]||5)+'px '+(val[1]||5)+'px '+(val[2]||5)+'px '+(val[3]||'rgba(0,0,0,0.5)')+'"';
         },
   "foc": function(val) { this.str += ' fill="'+val+'"'; },
   "fos": function(val) { this.str += ' font-style="'+val+'"'; },
   "fow": function(val) { this.str += ' font-weight="'+val+'"'; },
   "foz": function(val) { this.str += ' font-size="'+val+'"'; },
   "fof": function(val) { this.str += ' font-family="'+val+'"'; },
   "thal": function(val) {
              var filter = {"left":"start","center":"middle","right":"end"};
              this.str += ' text-anchor="'+(filter[val]||val)+'"';
           },
   "tval": function(val) { 
              var filter = {"top":"hanging","bottom":"ideographic"};
              this.str += ' dominant-baseline="'+(filter[val]||val)+'"';
           },
   "trf": function(t) {
             var scl = t.scl || 1,
                 sw = scl*(t.w?Math.sin(t.w):0), cw = scl*(t.w?Math.cos(t.w):1);
             this.str += ' transform="matrix('+[cw,sw,-sw,cw,t.x||0,t.y||0]+')"';
          },
   "matrix": function(m) {
                this.str += ' transform="matrix('+m+')"';
             }
}             
*/
// SVG does not support hatch pattern fill color at current (2016/01) ..
   /*
   "hatch": function hatch(val) {
               var idx = this.useReg.indexOf(val.toString());  // lookup hatch pattern in 'use registry' ..
               if (idx < 0) {  // referenced hatch pattern not in 'use registry' ..
                  var sz = +val[3] || 10, sz2 = (sz+1)*0.5;
                  idx = this.useReg.push(val.toString()) - 1;
                  this.content.open = "head";  // .. so write it to the defs section.
                  this.str += '<pattern id="'+(this.name + idx)+'"'+
                                      ' width="'+sz+'"'+
                                      ' height="'+sz+'"'+
                                      ' patternUnits="userSpaceOnUse">\n';
                  this.str += '<path d="M'+sz2+',0.5L'+(sz+0.5)+','+sz2+'M0.5,'+sz2+'L'+sz2+','+(sz+0.5)+'"'+
                                    'stroke="'+(val[0] || "black")+'" stroke-linecap="square"/>\n';
                  this.str += '</pattern>\n';
                  this.content.open = "body";
               }
               return "url(#"+(this.name + idx)+")";
            }
    */

