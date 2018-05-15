/**
 * g2.chart (c) 2015-16 Stefan Goessner
 * @license
 * MIT License
 */

// treat node.js
if (this.require !== undefined)  // assume 'g2.js' in the same directory ...
   g2 = require("./g2.js");

var g2 = g2 || { prototype:{} };  // for jsdoc only ...

/**
 * Create a line chart.<br>
 * @constructor
 * @returns {object} chart
 * @param {object} args Chart arguments object or
 * @param {float} args.x x-position of chart rectangle.
 * @param {float} args.y y-position of chart rectangle.
 * @param {float} [args.b=150} breadth of chart rectangle.
 * @param {float} [args.h=100] height of chart rectangle.
 * @param {string} [args.title='chart'] chart title.
 * @param {string} [args.title='chart'] chart title.
 * @param {float} [args.xmin=0] minimal x-axis value. If not given it is calculated from chart data values.
 * @param {float} [args.xmax=1] maximal x-axis value. If not given it is calculated from chart data values.
 * @param {float} [args.ymin=0] minimal y-axis value. If not given it is calculated from chart data values.
 * @param {float} [args.ymax=1] maximal y-axis value. If not given it is calculated from chart data values.
 */
g2.prototype.chart = function chart(args) {
   var ch = Object.getPrototypeOf(args) === g2.Chart.prototype ? args : g2.Chart.create(args);
   return ch.draw(this);
}

/**
 * `g2.Chart` is a tiny class for creating line charts. As a `g2`extension it is meant to be used with `g2` models.
 * But it can also be used standalone. (Requires cartesian coordinates).
 * Do not use `new g2.Chart()`, call `g2.Chart.create()` instead for creating instances.
 * @class
 * @namespace
 */
g2.Chart = {
   create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
   prototype: {
      constructor: function(args) {
         var fncs;
         if (args) Object.assign(this,args);
         if (this.funcs && this.funcs.length) {  // init all funcs ...
            for (let i=0; i<this.funcs.length; i++)
               this.initFunc(this.funcs[i],this.xmin===undefined,
                                           this.xmax===undefined,
                                           this.ymin===undefined,
                                           this.ymax===undefined);
         }
         if (this.xmin !== undefined && this.xmax !== undefined)
            this.xAxis = g2.Chart.AutoAxis.create(this.xmin,this.xmax,0,this.b);
         if (this.ymin !== undefined && this.ymax !== undefined)
            this.yAxis = g2.Chart.AutoAxis.create(this.ymin,this.ymax,0,this.h);
      },
     /**
      * Get chart property as custom or default value.
      * @private
      */
      get: function(n1,n2,n3,n4) {
          var loc = n4 ? this[n1] && this[n1][n2] && this[n1][n2][n3] && this[n1][n2][n3][n4]
                       : n3 ? this[n1] && this[n1][n2] && this[n1][n2][n3]
                            : n2 ? this[n1] && this[n1][n2]
                                 : n1 ? this[n1]
                                      : undefined;
          return loc !== undefined
               ? loc
               : n4 ? g2.Chart[n1] && g2.Chart[n1][n2] && g2.Chart[n1][n2][n3] && g2.Chart[n1][n2][n3][n4]
                     : n3 ? g2.Chart[n1] && g2.Chart[n1][n2] && g2.Chart[n1][n2][n3]
                          : n2 ? g2.Chart[n1] && g2.Chart[n1][n2]
                               : n1 ? g2.Chart[n1]
                                    : undefined;
      },
      /**
       * Initialize char function.
       * @private
       */
      initFunc: function(fn,setXmin,setXmax,setYmin,setYmax) {
         // Install func iterator.
         var itr;
         if (fn.data && fn.data.length) { // data must have a polyline conform array structure
            itr = fn.itr = g2.prototype.ply.itrOf.call(null,fn.data);  // get iterator ...
         }
         else if (fn.fn && !setXmin && !setXmax && fn.dx) {
            itr = fn.itr = (i) => { var x = this.xmin + i*fn.dx; return { x:x,y:fn.fn(x) }; }
            itr.len = (this.xmax - this.xmin)/fn.dx + 1;
         }
         // Get func's bounding box
         if (itr) {
            var xmin = Number.POSITIVE_INFINITY, ymin = Number.POSITIVE_INFINITY,
                xmax = Number.NEGATIVE_INFINITY, ymax = Number.NEGATIVE_INFINITY,
                p;  // data point
            for (var i=0, n=itr.len; i<n; i++) {
               p = itr(i);
               if (p.x < xmin) xmin = p.x;
               if (p.y < ymin) ymin = p.y;
               if (p.x > xmax) xmax = p.x;
               if (p.y > ymax) ymax = p.y;
            }
            fn.xmin = xmin; fn.xmax = xmax, fn.ymin = ymin, fn.ymax = ymax;
            if (setXmin && (this.xmin === undefined || xmin < this.xmin)) this.xmin = xmin;
            if (setXmax && (this.xmax === undefined || xmax < this.xmax)) this.xmax = xmax;
            if (setYmin && (this.ymin === undefined || ymin < this.ymin)) this.ymin = ymin;
            if (setYmax && (this.ymax === undefined || ymax < this.ymax)) this.ymax = ymax;

            if (fn.color && typeof fn.color === "number") fn.color = g2.Chart.func.colors[fn.color % g2.Chart.func.colors.length];
         }
      },
      /**
       * Point value in user coordinates of chart area from canvas point.
       * @returns {object} Chart area point.
       * @param {object} pix Point in canvas coordinates.
       */
      valOf: function(pix) {  // to do implementation ...
         return pix;
      },
      /**
       * Point value in canvas coordinates of point in user coordinates from chart area.
       * @returns {object} Canvas point.
       * @param {object} usr Point in canvas coordinates.
       */
      pixOf: function(usr) {
         return { x: this.x + (usr.x - this.xAxis.zmin)*this.xAxis.scl,
                  y: this.y + (usr.y - this.yAxis.zmin)*this.yAxis.scl };
      },
      /**
       * Point value in canvas coordinates of point in user coordinates from chart area.
       * Yields same result as `pixOf` but trimmed to chart area region limits.
       * @returns {object} Canvas point.
       * @param {object} usr Trimmed point in canvas coordinates.
       */
      trimPixOf: function(val) {
         return { x: this.x + Math.max(Math.min((val.x - this.xAxis.zmin)*this.xAxis.scl,this.b),0),
                  y: this.y + Math.max(Math.min((val.y - this.yAxis.zmin)*this.yAxis.scl,this.h),0) };
      },
      /**
       * Y-value in user coordinates from x-value in user coordinates for a specific function.
       * @returns {float} Y-value in user coordinates.
       * @param {float} x X-axis in user coordinates.
       */
      yOf: function(fnc,x) {
         if (fnc.fn)
            return fnc.fn(x);
         else if (fnc.data) {
            var cur, prv = fnc.itr(0), yprv;
            for (var i=1; i<fnc.itr.len; i++) {
               cur = fnc.itr(i);
               if (prv.x < x && x <= cur.x)
                  return prv.y + (x - prv.x)/(cur.x - prv.x)*(cur.y - prv.y);
               prv = cur;
            }
         }
         return fnc.itr(0);
      },
      /**
       * Append chart to *g2* object `g`.
       * @returns {object} *g2* object `g`.
       * @param {object} g *g2* object to append chart to.
       */
      draw: function(g) {
         var title = this.title,
             funcs = this.get("funcs");
         // draw background & border ...
         g.rec(this.x,this.y,this.b,this.h,this.get("style"));
         // draw title & axes ...
         g.beg(Object.assign({x:this.x,y:this.y,lw:1},g2.Chart.style,this.style));
         if (title)
            g.txt(title.text || title,this.b/2,this.h + this.get("title","offset"),0,
                  Object.assign({},g2.Chart.title.style,this.title && this.title.style));
         this.drawXAxis(g);
         this.drawYAxis(g);
         g.end();
         // draw funcs ...
         if (funcs)
            funcs.forEach((fnc,i) => { this.drawFunc(g,fnc,g2.Chart.func.colors[i]); });
         return g;
      },
      /**
       * Draw chart function.
       * @private
       */
      drawFunc: function(g,fn,defaultcolor) {
         var plydata = [], itr = fn.itr,
             fill = fn.fill || fn.style && fn.style.fs && fn.style.fs !== "transparent",
             color = fn.color = fn.color || fn.style && fn.style.ls || defaultcolor,
             style = Object.assign({},g2.Chart.func.style,
                                      fill ? {ls:color,fs:g2.Chart.Color.rgbaStr(color,0.125)}
                                           : {ls:color},
                                      fn.style);
         if (itr) {
            if (fill)  // start from base line (y=0)
               plydata.push(this.trimPixOf({x:itr(0).x,y:0}));
            for (var i=0, n=itr.len; i<n; i++)
               plydata.push(this.trimPixOf(itr(i)));
            if (fill)  // back to base line (y=0)
               plydata.push(this.trimPixOf({x:itr(itr.len-1).x,y:0}));
            if (fn.spline)
               g.spline(plydata,false,style);
            else
               g.ply(plydata,false,style);
            if (fn.dots) {
               g.beg({fs:"snow"});
               for (var i=0; i<plydata.length; i++)
                  g.cir(plydata[i].x,plydata[i].y,2,{lw:1});
               g.end();
            }
         }
      },
      /**
       * Draw marker points in canvas coordinates according to x-axis value in user space for all functions in chart.
       * @returns {object} `g2` object.
       * @param {object} g `g2`target object.
       * @param {float} x X-axis value.
       */
      drawMarkersAt: function(g,x) {
         var mrk;
         this.funcs.forEach(fnc => { if (x > fnc.xmin + Number.EPSILON && x < fnc.xmax - Number.EPSILON)
                                        g.cir((mrk=this.trimPixOf({x:x,y:this.yOf(fnc,x)})).x,mrk.y,3,{ls:fnc.color,fs:"whitesmoke",lw:1})});
         return g;
      },
      /**
       * Draw x-axis.
       * @private
       */
      drawXAxis: function(g) {
         var tick,
             showgrid = this.xaxis && this.xaxis.grid,
             gridstyle = showgrid
                       ? Object.assign({},g2.Chart.xaxis.grid,this.xaxis.grid)
                       : null,
             showaxis = this.xaxis || this.xAxis,
             axisstyle = showaxis && Object.assign({},g2.Chart.xaxis.style,g2.Chart.xaxis.labels.style,
                                                     this.xaxis && this.xaxis.style),
             showline = showaxis && this.get("xaxis","line"),
             showlabels = this.xAxis && showaxis && this.get("xaxis","labels"),
             showticks = this.xAxis && showaxis && this.get("xaxis","ticks"),
             ticklen = showticks ? this.get("xaxis","ticks","len") : 0,
             showorigin = showaxis && this.get("xaxis","origin"),
             title = this.xaxis && this.xaxis.title,
             itr = this.xAxis && this.xAxis.itr();
         // draw tick/grid lines
         g.beg(axisstyle);
         for (i=0,n=itr && itr.len; i<n; i++) {
            tick = itr(i);
            if (showticks) g.lin(tick.t,0,tick.t,tick.maj ? -ticklen : -2/3*ticklen);
            if (showgrid)  g.lin(tick.t,0,tick.t,this.h,gridstyle);
            if (showlabels && tick.maj)  // add label
               g.txt(parseFloat(tick.z),tick.t,-(this.get("xaxis","ticks","len")+this.get("xaxis","labels","offset")),0,
                     Object.assign({},g2.Chart.xaxis.labels.style,this.xaxis && this.xaxis.labels && this.xaxis.labels.style));
         }
         if (showline) g.lin(0,0,this.b,0);
         if (showorigin && this.xmin <= 0 && this.xmax >= 0) g.lin(-this.xAxis.zmin*this.xAxis.scl,0,-this.xAxis.zmin*this.xAxis.scl,this.h);  // origin line emphasized ...
         if (title) {
            g.txt(title.text || title,this.b/2,-(  this.get("xaxis","title","offset")
                                                 +(showticks  && this.get("xaxis","ticks","len") || 0)
                                                 +(showlabels && this.get("xaxis","labels","offset") || 0)
                                                 +(showlabels && this.get("xaxis","labels","style","foz") || 0)),0,
                  Object.assign({},g2.Chart.xaxis.title.style,this.xaxis && this.xaxis.title && this.xaxis.title.style));
         }
         g.end();
      },
      /**
       * Draw y-axis.
       * @private
       */
      drawYAxis: function(g) {
         var tick,
             showgrid = this.yaxis && this.yaxis.grid,
             gridstyle = showgrid
                       ? Object.assign({},g2.Chart.yaxis.grid,this.yaxis.grid)
                       : null,
             showaxis = this.yaxis || this.yAxis,
             axisstyle = showaxis && Object.assign({},g2.Chart.yaxis.style,g2.Chart.yaxis.labels.style,
                                                      this.yaxis && this.yaxis.style),
             showline = showaxis && this.get("yaxis","line"),
             showlabels = this.yAxis && this.get("yaxis","labels"),
             showticks = this.yAxis && this.get("yaxis","ticks"),
             ticklen = showticks ? this.get("yaxis","ticks","len") : 0,
             showorigin = showaxis && this.get("yaxis","origin"),
             title = this.yaxis && this.yaxis.title,
             itr = this.yAxis && this.yAxis.itr();
         // draw tick/grid lines
         g.beg(axisstyle);
         for (i=0,n=itr && itr.len; i<n; i++) {
            tick = itr(i);
            if (showticks) g.lin(0,tick.t,tick.maj ? -ticklen : -2/3*ticklen,tick.t);
            if (showgrid)  g.lin(0,tick.t,this.b,tick.t,gridstyle);
            if (showlabels && tick.maj)  // add label
               g.txt(parseFloat(tick.z),-(this.get("yaxis","ticks","len")+this.get("yaxis","labels","offset")),tick.t,Math.PI/2);
         }
         if (showline) g.lin(0,0,0,this.h);
         if (showorigin && this.ymin <= 0 && this.ymax >= 0) g.lin(0,-this.yAxis.zmin*this.yAxis.scl,this.b,-this.yAxis.zmin*this.yAxis.scl);  // origin line emphasized ...
         if (title)
            g.txt(title.text || title,-( this.get("yaxis","title","offset")
                                        +(showticks  && this.get("yaxis","ticks","len") || 0)
                                        +(showlabels && this.get("yaxis","labels","offset") || 0)
                                        +(showlabels && this.get("yaxis","labels","style","foz") || 0)),this.h/2,Math.PI/2,
                        Object.assign({},g2.Chart.yaxis.title.style,this.yaxis && this.yaxis.title && this.yaxis.title.style));
         g.end();
      }
   },
/**
 * Create an axis from given range with ticks.<br>
 * @private
 * @constructor
 * @returns {object} axis
 * @param {float} zmin min-value in user units.
 * @param {float} zmax max-value in user units.
 * @param {float} tmin min-value in device units (tick space).
 * @param {float} tmax max-value in device units (tick space).
 */
   AutoAxis: {
      create: function() { var o = Object.create(this.prototype); o.constructor.apply(o,arguments); return o; },
      prototype: {
         constructor: function(zmin,zmax,tmin,tmax) {
            var base = 2, exp = 1, eps = Math.sqrt(Number.EPSILON),
                Dz = zmax - zmin || 1,      // value range
                Dt = tmax - tmin || 1,      // area range
                s = Dz > eps ? Dt/Dz : 1,   // scale [usr]->[pix]
                dz = base*Math.pow(10,exp), // tick size [usr]
                dt = s*dz,                  // tick size [pix]
                N,                          // # segments
                dt01,                       // reminder segment
                i0, j0, jth, t0;

            while (dt < 14 || dt > 35) {
               if (dt < 14) {
                  if      (base == 1) base = 2;
                  else if (base == 2) base = 5;
                  else if (base == 5) { base = 1; exp++; }
               }
               else { // dtick > 35
                  if      (base == 1) { base = 5; exp--; }
                  else if (base == 2) base = 1;
                  else if (base == 5) base = 2;
               }
               dz = base*Math.pow(10,exp);
               dt = s*dz;
            }
            i0 = (s*Math.abs(zmin) + eps/2)%dt < eps
               ? Math.floor(zmin/dz)
               : Math.floor(zmin/dz) + 1;
            z0 = i0*dz;
            t0 = Math.round(s*(z0 - zmin));
            N = Math.floor((Dt - t0)/ dt) + 1;
            j0 = base % 2 && i0 % 2 ? i0 + 1 : i0;
            jth = exp === 0 && N < 11 ? 1 : base===2 && N > 9 ? 5 : 2;

            this.zmin = zmin;
            this.zmax = zmax;
            this.base = base;                              // [1,2,5]
            this.exp = exp;                                // 10^exp
            this.scl = s;                                  // scale [usr]->[pix]
            this.dt = dt;                                  // tick range [pix]
            this.dz = dz;                                  // tick range [usr]
            this.N = N;                                    // # of ticks
            this.t0 = t0;                                  // start tick position [pix]
            this.z0 = z0;                                  // start tick position [usr]
            this.i0 = i0;                                  // first tick index relative to tick origin (can be negative)
            this.j0 = j0;                                  // first labeled tick
            this.jth = jth;                                // # of ticks between two major ticks
/*
            console.log("zmin="+zmin+", zmax="+zmax+", Dz="+Dz)
            console.log("tmin="+tmin+", tmax="+tmax+", Dt="+Dt)
            console.log("s="+s+", base="+base+", exp="+exp)
            console.log("dt="+dt+", dz="+dz)
            console.log("N="+N)
            console.log("t0="+t0)
            console.log("z0="+z0)
            console.log("zmin/dz="+(zmin/dz))
            console.log("N=Dt/dt="+(Dt/dt))
            console.log("s*zmin%dt="+(s*zmin%dt))
            console.log("i0="+i0)
            console.log("jth="+jth)
*/
         },
         itr: function() {
            var itr = (i) => {
               return { t: this.t0 + i*this.dt,
//                        z: (this.z0 + i*this.dz).toFixed(-this.exp),
                        z: (this.z0 + i*this.dz).toFixed(Math.abs(this.exp)),
                        maj: (this.j0 - this.i0 + i)%this.jth === 0 };
            };
            itr.len = this.N;
            return itr;
         }
      }
   },
   // chart default properties
   style: { ls:"transparent",fs:"#efefef" },
   color: false,
   title: {
      text: null,
      offset: 3,
      style: { foc:"#000", foz:16, thal:"center", tval:"bottom" }
   },
   funcs: [],
   func: {
      style: { lw:1, fs:"transparent" },
      // s. https://web.njit.edu/~kevin/rgb.txt.html
      colors: ["#426F42", /*medium seagreen*/
               "#8B2500", /*orange red 4*/
               "#23238E", /*navy*/
               "#5D478B"  /*medium purple 4*/
             ]
   },
   xaxis: {
      line: true,
      style: { ls:"#888", thal:"center", tval:"top", foc:"black" },
      origin: false,
      title: {
         text: null,
         offset: 1,
         style: { foz:12 },
      },
      ticks: { len: 6 },
      grid: { ls:"#ddd", ld:[] },
      labels: {
         loc: "auto",    // "auto" | [2,4,6] | [{v:3.14,s:"pi"},{v:6.28,s:"2*pi"}]
         offset: 1,
         style: { foz:11 }
      }
   },
   yaxis: {
      line: true,
      style: { ls:"#888", thal:"center", tval:"bottom", foc:"black"  },
      origin: false,
      title: {
         text: null,
         offset: 2,
         style: { foz:12 },
      },
      ticks: { len: 6 },
      grid: { ls:"#ddd", ld:[] },
      labels: {
         loc: "auto",    // "auto" | [2,4,6] | [{v:3.14,s:"pi"},{v:6.28,s:"2*pi"}]
         offset: 1,
         style: { foz:11 }
      }
   },
  /**
   * Convert color from any format to object {r,g,b,a}.
   * @private
   */
   Color: {
      // convert to object {r,g,b,a}
      rgba: function(color,alpha) {
         var res;
         alpha = alpha != undefined ? alpha : 1;
         // color name ?
         if (color === "transparent")
            return {r:0,g:0,b:0,a:0};
         if (color in g2.Chart.Color.names)
            color = "#" + g2.Chart.Color.names[color];
         // #rrggbb
         if (res = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return {r:parseInt(res[1], 16), g:parseInt(res[2], 16), b:parseInt(res[3], 16), a:alpha};
         // Look for #rgb
         if (res = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return {r:parseInt(res[1] + res[1], 16), g:parseInt(res[2] + res[2], 16), b:parseInt(res[3] + res[3], 16), a:alpha};
         // rgb(rrr,ggg,bbb)
         if (res = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return {r:parseInt(res[1]), g:parseInt(res[2]), b:parseInt(res[3]), a:alpha};
         // rgba(rrr,ggg,bbb,a)
         if (res = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(color))
            return {r:parseInt(res[1]), g:parseInt(res[2]), b:parseInt(res[3]),a:(alpha!==undefined?alpha:parseFloat(res[4]))};
         // rgb(rrr%,ggg%,bbb%)
         if (res = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return {r:parseFloat(res[1]) * 2.55, g:parseFloat(res[2]) * 2.55, b:parseFloat(result[3]) * 2.55, a:alpha};
      },
      rgbaStr: function(color,alpha) {
         var c = g2.Chart.Color.rgba(color,alpha);
         return "rgba("+c.r+","+c.g+","+c.b+","+c.a+")";
      },
      names: {
         aliceblue: 'f0f8ff', antiquewhite: 'faebd7', aqua: '00ffff', aquamarine: '7fffd4', azure: 'f0ffff', beige: 'f5f5dc', bisque: 'ffe4c4', black: '000000',
         blanchedalmond: 'ffebcd', blue: '0000ff', blueviolet: '8a2be2', brown: 'a52a2a', burlywood: 'deb887', cadetblue: '5f9ea0', chartreuse: '7fff00',
         chocolate: 'd2691e', coral: 'ff7f50', cornflowerblue: '6495ed', cornsilk: 'fff8dc', crimson: 'dc143c', cyan: '00ffff', darkblue: '00008b', darkcyan: '008b8b',
         darkgoldenrod: 'b8860b', darkgray: 'a9a9a9', darkgreen: '006400', darkkhaki: 'bdb76b', darkmagenta: '8b008b', darkolivegreen: '556b2f', darkorange: 'ff8c00',
         darkorchid: '9932cc', darkred: '8b0000', darksalmon: 'e9967a', darkseagreen: '8fbc8f', darkslateblue: '483d8b', darkslategray: '2f4f4f', darkturquoise: '00ced1',
         darkviolet: '9400d3', deeppink: 'ff1493', deepskyblue: '00bfff', dimgray: '696969', dodgerblue: '1e90ff', feldspar: 'd19275', firebrick: 'b22222',
         floralwhite: 'fffaf0', forestgreen: '228b22', fuchsia: 'ff00ff', gainsboro: 'dcdcdc', ghostwhite: 'f8f8ff', gold: 'ffd700', goldenrod: 'daa520', gray: '808080',
         green: '008000', greenyellow: 'adff2f', honeydew: 'f0fff0', hotpink: 'ff69b4', indianred : 'cd5c5c', indigo : '4b0082', ivory: 'fffff0', khaki: 'f0e68c',
         lavender: 'e6e6fa', lavenderblush: 'fff0f5', lawngreen: '7cfc00', lemonchiffon: 'fffacd', lightblue: 'add8e6', lightcoral: 'f08080', lightcyan: 'e0ffff',
         lightgoldenrodyellow: 'fafad2', lightgrey: 'd3d3d3', lightgreen: '90ee90', lightpink: 'ffb6c1', lightsalmon: 'ffa07a', lightseagreen: '20b2aa',
         lightskyblue: '87cefa', lightslateblue: '8470ff', lightslategray: '778899', lightsteelblue: 'b0c4de', lightyellow: 'ffffe0', lime: '00ff00', limegreen: '32cd32',
         linen: 'faf0e6', magenta: 'ff00ff', maroon: '800000', mediumaquamarine: '66cdaa', mediumblue: '0000cd', mediumorchid: 'ba55d3', mediumpurple: '9370d8',
         mediumseagreen: '3cb371', mediumslateblue: '7b68ee', mediumspringgreen: '00fa9a', mediumturquoise: '48d1cc', mediumvioletred: 'c71585', midnightblue: '191970',
         mintcream: 'f5fffa', mistyrose: 'ffe4e1', moccasin: 'ffe4b5', navajowhite: 'ffdead', navy: '000080', oldlace: 'fdf5e6', olive: '808000', olivedrab: '6b8e23',
         orange: 'ffa500', orangered: 'ff4500', orchid: 'da70d6', palegoldenrod: 'eee8aa', palegreen: '98fb98', paleturquoise: 'afeeee', palevioletred: 'd87093',
         papayawhip: 'ffefd5', peachpuff: 'ffdab9', peru: 'cd853f', pink: 'ffc0cb', plum: 'dda0dd', powderblue: 'b0e0e6', purple: '800080', rebeccapurple:'663399',
         red: 'ff0000', rosybrown: 'bc8f8f', royalblue: '4169e1', saddlebrown: '8b4513', salmon: 'fa8072', sandybrown: 'f4a460', seagreen: '2e8b57', seashell: 'fff5ee',
         sienna: 'a0522d', silver: 'c0c0c0', skyblue: '87ceeb', slateblue: '6a5acd', slategray: '708090', snow: 'fffafa', springgreen: '00ff7f', steelblue: '4682b4',
         tan: 'd2b48c', teal: '008080', thistle: 'd8bfd8', tomato: 'ff6347', turquoise: '40e0d0', violet: 'ee82ee', violetred: 'd02090', wheat: 'f5deb3', white: 'ffffff',
         whitesmoke: 'f5f5f5', yellow: 'ffff00', yellowgreen: '9acd32'
      }
   }
};