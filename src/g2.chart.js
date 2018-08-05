/**
 * g2.chart (c) 2015-18 Stefan Goessner
 * @license
 * MIT License
 */

var g2 = g2 || { prototype:{} };  // for jsdoc only ...

/**
 * Create x/y-line chart.
 * @constructor
 * @returns {object} chart
 * @param {object} args - Chart arguments object or 
 * @param {float} args.x - x-position of lower left corner of chart rectangle.
 * @param {float} args.y - y-position of lower left corner of chart rectangle.
 * @param {float} [args.b=150] - width of chart rectangle.
 * @param {float} [args.h=100] - height of chart rectangle.
 * @param {string} [args.ls] - border color.
 * @param {string} [args.fs] - fill color.
 * @param {(string|object)} [args.title] - chart title.
 * @param {string} [args.title.text] - chart title text string.
 * @param {float} [args.title.offset=0] - chart title vertical offset.
 * @param {object} [args.title.style] - chart title style.
 * @param {string} [args.title.style.font=14px serif] - chart title font.
 * @param {string} [args.title.style.thal=center] - chart title horizontal align.
 * @param {string} [args.title.style.tval=bottom] - chart title vertical align.
 * @param {array} [args.funcs=[]] - array of dataset `data` and/or function `fn` objects.
 * @param {object} [args.funcs[item]] - dataset or function object.
 * @param {array} [args.funcs[item].data] - data points as flat array `[x,y,..]`, array of point arrays `[[x,y],..]` or array of point objects `[{x,y},..]`.
 * @param {function} [args.funcs[item].fn] - function `y = f(x)` recieving x-value returning y-value.
 * @param {float} [args.funcs[item].dx] - x increment to apply to function `fn`. Ignored with data points.
 * @param {boolean} [args.funcs[item].fill] - fill region between function graph and x-origin line.
 * @param {boolean} [args.funcs[item].dots] - place circular dots at data points (Avoid with `fn`s).
 * @param {boolean|object} [args.xaxis=false] - x-axis.
 * @param {boolean|object} [args.xaxis.grid=false] - x-axis grid lines.
 * @param {string} [args.xaxis.grid.ls] - x-axis grid line style (color).
 * @param {string} [args.xaxis.grid.lw] - x-axis grid line width.
 * @param {string} [args.xaxis.grid.ld] - x-axis grid line dash style.
 * @param {boolean} [args.xaxis.line=true] - display x-axis base line.
 * @param {boolean} [args.xaxis.origin=false] - display x-axis origin line.
 * @param {boolean|object} [args.yaxis=false] - y-axis.
 * @param {boolean|object} [args.yaxis.grid=false] - y-axis grid lines.
 * @param {string} [args.yaxis.grid.ls] - y-axis grid line style color.
 * @param {string} [args.yaxis.grid.lw] - y-axis grid line width.
 * @param {string} [args.yaxis.grid.ld] - y-axis grid line dash style.
 * @param {boolean} [args.yaxis.line=true] - display y-axis base line.
 * @param {boolean} [args.yaxis.origin=false] - display y-axis origin line.
 * @param {float} [args.xmin] - minimal x-axis value. If not given it is calculated from chart data values.
 * @param {float} [args.xmax] - maximal x-axis value. If not given it is calculated from chart data values.
 * @param {float} [args.ymin] - minimal y-axis value. If not given it is calculated from chart data values.
 * @param {float} [args.ymax] - maximal y-axis value. If not given it is calculated from chart data values.
 */
g2.prototype.chart = function chart({x,y,b,h,style,title,funcs,xaxis,xmin,xmax,yaxis,ymin,ymax}) {
    return this.addCommand({c:'chart',a:arguments[0]});
}
g2.prototype.chart.prototype = {
    g2() {
        const g = g2(),
              funcs = this.get('funcs'),
              title = this.title && this.get('title');

        if (!this.b) this.b = this.defaults.b;
        if (!this.h) this.h = this.defaults.h;
        // initialize function graphs (only once ...)
        if (funcs && funcs.length) {  // init all funcs ...
            for (let i=0; i<funcs.length; i++)
                this.initFunc(funcs[i],this.xmin===undefined,
                                       this.xmax===undefined,
                                       this.ymin===undefined,
                                       this.ymax===undefined);
        }
//        if (this.xaxis)
            this.xAxis = this.autoAxis(this.get('xmin'),this.get('xmax'),0,this.b);
//        if (this.yaxis)
            this.yAxis = this.autoAxis(this.get('ymin'),this.get('ymax'),0,this.h);

        // draw background & border ...
        g.rec({x:this.x,y:this.y,b:this.b,h:this.h,
               fs:this.get("fs"),ls:this.get("ls")});

        // draw title & axes ...
        g.beg({x:this.x,y:this.y,lw:1,...this.defaults.style,...this.style});

        if (title)
            g.txt({ str: this.title && this.title.text || this.title, 
                    x: this.get('b')/2,
                    y: this.get('h') + this.get("title","offset"),
                    w: 0,
                    ...this.defaults.title.style,
                    ...(this.title && this.title.style || {})});
        if (this.xaxis) this.drawXAxis(g);
        if (this.yaxis) this.drawYAxis(g);

        g.end();

        // draw funcs ...
        if (funcs)
            funcs.forEach((fnc,i) => { this.drawFunc(g,fnc,this.defaults.colors[i%this.defaults.colors.length]); });

        return g;
    },
    /**
     * Initialize chart function.
     * @private
     */
    initFunc(fn,setXmin,setXmax,setYmin,setYmax) {
        // Install func iterator.
        let itr;
        if (fn.data && fn.data.length) { // data must have a polyline conform array structure
            itr = fn.itr = g2.pntItrOf(fn.data);  // get iterator ...
        }
        else if (fn.fn && !setXmin && !setXmax && fn.dx) {
            itr = fn.itr = (i) => { let x = this.xmin + i*fn.dx; return { x:x, y:fn.fn(x) }; }
            itr.len = (this.xmax - this.xmin)/fn.dx + 1;
        }
        // Get func's bounding box
        if (itr && (setXmin || setXmax || setYmin || setYmax)) {
            let xmin = Number.POSITIVE_INFINITY, ymin = Number.POSITIVE_INFINITY, 
                xmax = Number.NEGATIVE_INFINITY, ymax = Number.NEGATIVE_INFINITY,
                p;  // data point
            for (let i=0, n=itr.len; i<n; i++) {
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

            if (fn.color && typeof fn.color === "number") // color index [0..n]
                fn.color = this.defaults.colors[fn.color % this.defaults.colors.length];
        }
    },
    autoAxis(zmin,zmax,tmin,tmax) {
        let base = 2, exp = 1, eps = Math.sqrt(Number.EPSILON),
            Dz = zmax - zmin || 1,      // value range
            Dt = tmax - tmin || 1,      // area range
            scl = Dz > eps ? Dt/Dz : 1, // scale [usr]->[pix]
            dz = base*Math.pow(10,exp), // tick size [usr]
            dt = Math.floor(scl*dz),    // tick size [pix]
            N,                          // # segments
            dt01,                       // reminder segment
            i0, j0, jth, t0, res;

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
            dt = scl*dz;
        }
        i0 = (scl*Math.abs(zmin) + eps/2)%dt < eps
           ? Math.floor(zmin/dz)
           : Math.floor(zmin/dz) + 1;
        z0 = i0*dz;
        t0 = Math.round(scl*(z0 - zmin));
//        console.log("Dt="+Dt+",N="+(Dt - t0)/ dt)
//        console.log("DT="+Dt+",N="+(Dt - t0)/ dt)
        N = Math.floor((Dt - t0)/ dt) + 1;
        j0 = base % 2 && i0 % 2 ? i0 + 1 : i0; 
        jth = exp === 0 && N < 11 ? 1 : base===2 && N > 9 ? 5 : 2;

        return {
            zmin,               // min usr value
            zmax,               // max usr value
            base,               // one of [1,2,5]
            exp,                // 10^exp
            scl,                // scale [usr]->[pix]
            dt,                 // tick range [pix]
            dz,                 // tick range [usr]
            N,                  // # of ticks
            t0,                 // start tick position [pix]
            z0,                 // start tick position [usr]
            i0,                 // first tick index relative to tick origin (can be negative)
            j0,                 // first labeled tick
            jth,                // # of ticks between two major ticks
            itr(i) {            // tick iterator 
                return { t: this.t0 + i*this.dt,
                    z: parseFloat((this.z0 + i*this.dz).toFixed(Math.abs(this.exp))),
                    maj: (this.j0 - this.i0 + i)%this.jth === 0 };
            }
        }
    },
    /**
     * Draw x-axis.
     * @private
     */
    drawXAxis(g) {
        let tick,
            showgrid = this.xaxis && this.xaxis.grid,
            gridstyle = showgrid && {...this.defaults.xaxis.grid,...this.xaxis.grid},
            showaxis = this.xaxis || this.xAxis,
            axisstyle = showaxis && {...this.defaults.xaxis.style,
                                     ...this.defaults.xaxis.labels.style,
                                     ...(this.xaxis && this.xaxis.style || {}) },
            showline = showaxis && this.get("xaxis","line"),
            showlabels = this.xAxis && showaxis && this.get("xaxis","labels"),
            showticks = this.xAxis && showaxis && this.get("xaxis","ticks"),
            ticklen = showticks ? this.get("xaxis","ticks","len") : 0,
            showorigin = showaxis && this.get("xaxis","origin"),
            title = this.xaxis && (this.get("xaxis","title","text") || this.xaxis.title) || '';
//console.log(this.xAxis)
        // draw tick/grid lines
        g.beg(axisstyle);
        for (let i=0; i<this.xAxis.N; i++) {
            tick = this.xAxis.itr(i);
            if (showticks) g.lin({x1:tick.t,x2:tick.t,y2:tick.maj ? -ticklen : -2/3*ticklen});
            if (showgrid)  g.lin({x1:tick.t,x2:tick.t,y2:this.h,...gridstyle});
            if (showlabels && tick.maj)  // add label
                g.txt({ str: parseFloat(tick.z),
                        x: tick.t,
                        y: -(this.get("xaxis","ticks","len")+this.get("xaxis","labels","offset")),
                        w: 0,
                        ...(this.get("xaxis","labels","style") || {}) });
        }
        if (showline) 
            g.lin({x2:this.b});
        if (showorigin && this.xmin <= 0 && this.xmax >= 0) 
            g.lin({x1:-this.xAxis.zmin*this.xAxis.scl,
                   x2:-this.xAxis.zmin*this.xAxis.scl,y2:this.h});  // origin line emphasized ...
        if (title)
            g.txt({str:title.text || title,
                   x:this.b/2,
                   y:-(  this.get("xaxis","title","offset")
                        +(showticks  && this.get("xaxis","ticks","len") || 0)     
                        +(showlabels && this.get("xaxis","labels","offset") || 0)     
                        +(showlabels && parseFloat(this.get("xaxis","labels","style","font")) || 0)),
                   w:0,
                   ...(this.get('xaxis','title','style'))});
        g.end();
    },
    /**
     * Draw y-axis.
     * @private
     */
    drawYAxis(g) {
        let tick,
            showgrid = this.yaxis && this.yaxis.grid,
            gridstyle = showgrid && {...this.defaults.yaxis.grid,...this.yaxis.grid},
            showaxis = this.yaxis || this.yAxis,
            axisstyle = showaxis && {...this.defaults.yaxis.style,
                                     ...this.defaults.yaxis.labels.style,
                                     ...(this.yaxis && this.yaxis.style || {}) },
            showline = showaxis && this.get("yaxis","line"),
            showlabels = this.yAxis && showaxis && this.get("yaxis","labels"),
            showticks = this.yAxis && showaxis && this.get("yaxis","ticks"),
            ticklen = showticks ? this.get("yaxis","ticks","len") : 0,
            showorigin = showaxis && this.get("yaxis","origin"),
            title = this.yaxis && (this.get("yaxis","title","text") || this.yaxis.title) || '';

        // draw tick/grid lines
        g.beg(axisstyle);
        for (let i=0; i<this.yAxis.N; i++) {
            tick = this.yAxis.itr(i);
            if (showticks) g.lin({y1:tick.t,x2:tick.maj ? -ticklen : -2/3*ticklen,y2:tick.t});
            if (showgrid)  g.lin({y1:tick.t,x2:this.b,y2:tick.t,...gridstyle});
            if (showlabels && tick.maj)  // add label
                g.txt({ str: parseFloat(tick.z),
                        x: -(this.get("yaxis","ticks","len")+this.get("yaxis","labels","offset")),
                        y: tick.t,
                        w: Math.PI/2,
                        ...this.get("yaxis","labels","style") });
        }
        if (showline) 
            g.lin({y2:this.h});
        if (showorigin && this.ymin <= 0 && this.ymax >= 0) 
            g.lin({y1:-this.yAxis.zmin*this.yAxis.scl,x2:this.b,y2:-this.yAxis.zmin*this.yAxis.scl});  // origin line emphasized ...
        if (title)
            g.txt({ str: title.text || title,
                    x:-(  this.get("yaxis","title","offset")
                        +(showticks  && this.get("yaxis","ticks","len") || 0)     
                        +(showlabels && this.get("yaxis","labels","offset") || 0)     
                        +(showlabels && parseFloat(this.get("yaxis","labels","style","font")) || 0)),
                    y:this.h/2,
                    w:Math.PI/2,
                    ...(this.get('yaxis','title','style'))});
        g.end();
    },
    /**
     * Draw chart function.
     * @private
     */
    drawFunc(g,fn,defaultcolor) {
        let itr = fn.itr;

        if (itr) {
            let fill = fn.fill || fn.style && fn.style.fs && fn.style.fs !== "transparent",
                color = fn.color = fn.color || fn.style && fn.style.ls || defaultcolor,
                plydata = [], 
                args = { pts:plydata,
                         closed:false,
                         ls:color,
                         fs:(fill?g2.color.rgbaStr(color,0.125):'transparent'),
                         lw:1,
                         ...fn.style };

            if (fill)  // start from base line (y=0)
                plydata.push(this.pntOf({x:itr(0).x,y:0}));
            for (let i=0, n=itr.len; i<n; i++)
                plydata.push(this.pntOf(itr(i)));
            if (fill)  // back to base line (y=0)
                plydata.push(this.pntOf({x:itr(itr.len-1).x,y:0}));
            if (fn.spline && g.spline)
                g.spline(args);
            else
                g.ply(args);
            if (fn.dots) {
                g.beg({fs:"snow"});
                for (var i=0; i<plydata.length; i++)
                    g.cir({...plydata[i],r:2,lw:1});
                g.end();
            }
        }
    },
    /**
     * Point in canvas coordinates of xy values in chart area.
     * Result is trimmed to chart area region limits.
     * TODO: implement true polygon clipping against window ... !
     * @returns {object} point.
     * @param {object} xy xy values in chart area.
     */
    pntOf: function(xy) {
        return { x: this.x + Math.max(Math.min((xy.x - this.xAxis.zmin)*this.xAxis.scl,this.b),0),
                 y: this.y + Math.max(Math.min((xy.y - this.yAxis.zmin)*this.yAxis.scl,this.h),0) };
    },
   /**
      * Get nested chart property either as custom property or as default property.
      * @private
      */
    get(n1,n2,n3,n4) {
        const loc = n4 ? this[n1] && this[n1][n2] && this[n1][n2][n3] && this[n1][n2][n3][n4]
                       : n3 ? this[n1] && this[n1][n2] && this[n1][n2][n3]
                            : n2 ? this[n1] && this[n1][n2]
                                 : n1 ? this[n1] 
                                      : undefined,
              dflts = this.defaults;
        return loc !== undefined 
             ? loc
             : n4 ? dflts[n1] && dflts[n1][n2] && dflts[n1][n2][n3] && dflts[n1][n2][n3][n4]
                  : n3 ? dflts[n1] && dflts[n1][n2] && dflts[n1][n2][n3]
                       : n2 ? dflts[n1] && dflts[n1][n2]
                            : n1 ? dflts[n1]
                                 : undefined;
    },
  // default properties
    defaults: {
        x: 0,
        y: 0,
        xmin: 0, xmax: 1,
        ymin: 0, ymax: 1,
        b: 150,
        h: 100,
        ls:"transparent",
        fs:"#efefef",
        color: false,
        colors: [
            "#426F42", /*medium seagreen*/
            "#8B2500", /*orange red 4*/
            "#23238E", /*navy*/
            "#5D478B"  /*medium purple 4*/
        ],
        title: {
            text: '',
            offset: 3,
            style: { font:"16px serif", fs:"black", thal:"center", tval:"bottom" }
        },
        funcs: [],
/*
        func: {
            style: { lw:1, fs:"transparent" },
            // s. https://web.njit.edu/~kevin/rgb.txt.html
        },
*/
        xaxis: {
            fill: false,
            line: true,
            style: { ls:"#888", thal:"center", tval:"top", fs:"black" },
            origin: false,
            title: {
                text: null,
                offset: 1,
                style: { font:"12px serif", fs:"black" },
            },
            ticks: { len: 6 },
            grid: { ls:"#ddd", ld:[] },
            labels: {
                loc: "auto",    // "auto" | [2,4,6] | [{v:3.14,s:"pi"},{v:6.28,s:"2*pi"}]
                offset: 1,
                style: { font:"11px serif", fs:"black" },
            }
        },
        yaxis: {
            line: true,
            style: { ls:"#888", thal:"center", tval:"bottom", fs:"black"  },
            origin: false,
            title: {
                text: null,
                offset: 2,
                style: { font:"12px serif", fs:"black" },
            },
            ticks: { len: 6 },
            grid: { ls:"#ddd", ld:[] },
            labels: {
                loc: "auto",    // "auto" | [2,4,6] | [{v:3.14,s:"pi"},{v:6.28,s:"2*pi"}]
                offset: 1,
                style: { font:"11px serif", fs:"black" },
            }
        }
    }
}

g2.color = {
    // convert to object {r,g,b,a}
    rgba(color,alpha) {
        let res;
        alpha = alpha !== undefined ? alpha : 1;
        // color name ?
        if (color === "transparent")
            return {r:0,g:0,b:0,a:0};
        if (color in g2.color.names)
            color = "#" + g2.color.names[color];
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
    rgbaStr(color,alpha) {
        const c = g2.color.rgba(color,alpha);
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
