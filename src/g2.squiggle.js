/**
 * g2.squiggle (c) 2013-17 Stefan Goessner
 * @license MIT License
 * @link https://github.com/goessner/g2
 * 
 */

// call without using 'new' ...
g2.squiggle = function(refctx) {
   if (this instanceof g2.squiggle) {
       this.refctx = refctx;
       this.refhdl = null;
       this.path = {d:''};
       return this;
   }
   return g2.squiggle.apply(Object.create(g2.squiggle.prototype),arguments);
}
g2.handler.factory.push((ctx) => ctx instanceof g2.squiggle ? ctx : false);

g2.squiggle.defaultStyle = Object.assign({},g2.defaultStyle,{font:'14px cursive'});
g2.squiggle.deviation = 3;
g2.squiggle.prototype = {
    init: function(grp,style) {
        this.path.d = '';  // use for path commands ..
        this.refhdl = g2.handler(this.refctx);
        if (this.refhdl) this.refhdl.init(grp, g2.squiggle.defaultStyle);
        return true;
    },
    exe: function(commands) {
        for (let cmd of commands) {
            if (this[cmd.c])
                cmd.a ? this[cmd.c](cmd.a) : this[cmd.c]();
            else if (cmd.a && 'macro' in cmd.a)
                this.exe(cmd.a.macro().commands);
            else
                this.refhdl[cmd.c](cmd.a);
        }
    },
    out: function(c,a) { this.refhdl[c] ? (a ? this.refhdl[c](a) : this.refhdl[c]()) : false; },

    // commands overloading ...
    a: function({x,y,x0,y0,r,w,dw,wend,ccw}) { this.arcTo({x:x0,y:y0,rx:r,ry:r,w,dw}); },
    arc: function({x,y,r,w,dw}) {
        w = w||0;
        dw = dw||2*Math.PI;
        this.beginPath()
            .moveTo({x:x+r*Math.cos(w),y:y+r*Math.sin(w)})
            .arcTo({x,y,rx:r,ry:r,w,dw});
        this.out("drw",Object.assign({d:this.path.d,lj:"round",lc:"round"},arguments[0]));
    },
    c: function({x1,y1,x2,y2,x,y}) { this.cubicTo({x1,y1,x2,y2,x,y}) },
    cir: function({x,y,r}) {
        let pts = [], args = Object.assign({},arguments[1],{w:0,dw:2*Math.PI});
        this.beginPath()
            .moveTo({x:x+r,y})
            .arcTo({x,y,rx:r,ry:r,w:0,dw:2*Math.PI});
        this.out("drw",Object.assign({d:this.path.d,lj:"round",lc:"round"},arguments[0]));
    },
    drw: function({d}={}) {  this.out("drw",Object.assign({d:d||this.path.d,lj:"round",lc:"round"},arguments[0])); },
    ell: function({x,y,rx,ry,w,dw,rot}) {
        ry = ry||rx;
        w = w||0;
        dw = dw||2*Math.PI;
        rot = rot||0;
        if (rot) { this.out("beg",{x:x||0,y:y||0,w:rot}); x = y = 0; }
        this.beginPath()
             .moveTo({x:x+rx*Math.cos(w),y:y+ry*Math.sin(w)})
             .arcTo({x,y,rx,ry,w,dw});
        this.out("drw",Object.assign({d:this.path.d,lj:"round",lc:"round"},arguments[0]));
        if (rot) this.out("end");
    },
    fill: function({d}={}) {  this.out("fill",Object.assign({d:d||this.path.d,lj:"round",lc:"round"},arguments[0])); },
    l: function({x,y}) { this.lineTo({x,y}) },
    lin: function({x1,y1,x2,y2}) {
        this.beginPath()
            .moveTo({x:x1,y:y1})
            .lineTo({x:x2,y:y2});
        this.out("stroke",Object.assign({d:this.path.d,lj:"round",lc:"round"},arguments[0]));
    },
    m: function({x,y}) { this.moveTo({x,y}) },
    p: function() { this.beginPath(); },
    ply: function({pts,closed,itr,x,y,w}) {
        istrf = x || y || w;
        this.beginPath().moveTo(itr(0));
        for (let i=1, n=itr.len; i<n; i++)
            this.lineTo(itr(i));
        if (closed) this.closePath();
        if (istrf) this.out("beg",{x:x||0,y:y||0,w:w||0});
        this.out("drw",Object.assign({d:this.path.d,lj:"round",lc:"round"},arguments[0]));
        if (istrf) this.out("end");
    },
    q: function({x1,y1,x,y}) { this.quadraticTo({x1,y1,x,y}) },
    rec: function({x,y,b,h}) {
        this.beginPath()
            .moveTo({x,y})
            .lineTo({x:x+b,y})
            .lineTo({x:x+b,y:y+h})
            .lineTo({x,y:y+h})
            .closePath();
        this.out("drw",Object.assign({d:this.path.d,lj:"round",lc:"round"},arguments[0]));
    },
    stroke: function({d}={}) { this.out("stroke",Object.assign({d:d||this.path.d,lj:"round",lc:"round"},arguments[0])); },
    txt: function({font}) {
        this.out("txt", Object.assign({},{font:'14px cursive'},arguments[0]))
    },
    use: function({grp}) {
        this.refhdl.beg(this.refctx,arguments[0]);
        this.exe(grp.commands);
        this.refhdl.end(this.refctx);
    },
    z: function(ctx) { this.closePath() },

    // low level path functions ..
    beginPath: function() { this.path.d = ''; return this; },
    moveTo: function({x,y}) {
        this.path.d += `M${x},${y}`;
        this.path.p0 = this.path.p = {x,y};
        return this;
    },
    lineTo: function({x,y}) {
        let x0 = this.path.p.x, y0 = this.path.p.y,
            dx = x - x0, dy = y - y0, len = Math.hypot(dx,dy),
            du = len < 40  ? 1/2 : 1 / Math.floor(len/20),
            deviation = (len < 20 ? 1/20*len : 1)*g2.squiggle.deviation,
            pt = (u) => {
                let t = 3*u*u - 2*u*u*u,
                    sqig =  deviation*(Math.random() - 0.5);
                return { x:(1-t)*x0 + t*x - sqig*(len && dy/len), 
                         y:(1-t)*y0 + t*y + sqig*(len && dx/len) }; 
            };
        for (let u=du, umax=1+du/2; u <= umax; u += du)
            this.path.d += `L${pt(u).x},${pt(u).y}`;
    
        this.path.p = {x,y};
        return this;
    },
    closePath: function() {
        this.lineTo(this.path.p0);
        this.path.d += 'Z';
        return this;
    },
    arcTo: function({x,y,rx,ry,w,dw}) {
        let len = Math.abs((rx+ry)/2*dw),
            du = len < 30 ? 1 / Math.max(3,Math.floor(Math.abs(dw)*2+0.5))
                          : 1 / 20,
            deviation = (len <  30 ? 1/120*len
                       : len < 100 ? 1/4
                       : len < 200 ? 1/2
                       : 1)*g2.squiggle.deviation,
            pt = (u) => {
                let t = dw < Math.PI ? 3*u*u - 2*u*u*u : u,
                    sqig = deviation*(Math.random() - 0.5),
                    sw = Math.sin(w+t*dw), cw = Math.cos(w+t*dw);
                return { x: x + (rx+sqig)*cw,
                         y: y + (ry+sqig)*sw };
            };
        
        for (let u=du, umax=1+du/2; u <= umax; u += du)
            this.path.d += `L${pt(u).x},${pt(u).y}`;

        this.path.p = pt(1);
        return this;
    },
    quadraticTo: function({x1,y1,x,y}) {
        let x0 = this.path.p.x, y0 = this.path.p.y,
            ax = x1 - x0,      ay = y1 - y0,
            bx = x  - x1 - ax, by = y  - y1 - ay,
            k = 5/12,
            // See also: http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/ for possible improvement.
            len = Math.hypot(x1-x0,y1-y0)*k + Math.hypot(x-x1,y-y1)*k + Math.hypot(x-x0,y-y0)*(1-k),
            du = len < 60  ? 1/3 : 1 / Math.floor(len/15),
            deviation = (len <  30 ? 1/60*len
                       : len < 100 ? 1/2
                       : 1)*g2.squiggle.deviation,
            pt = (u) => {
                let t = (x1-x0)*(x-x1) + (y1-y0)*(y-y1) < 0 ? u : 3*u*u - 2*u*u*u,
                    xd = 2*(ax + bx*t), yd = 2*(ay + by*t), dd = Math.hypot(xd,yd),
                    sqig = deviation*(Math.random() - 0.5);
                return { x: x0 + 2*ax*t + bx*t*t - sqig*yd/dd,
                         y: y0 + 2*ay*t + by*t*t + sqig*xd/dd,u };
            };
    
        for (let u=du, umax=1+du/2; u <= umax; u += du)
            this.path.d += `L${pt(u).x},${pt(u).y}`;

        this.path.p = {x,y};
        return this;
    },
    cubicTo: function({x1,y1,x2,y2,x,y}) {
        let x0 = this.path.p.x, y0 = this.path.p.y,
            x01 = x1-x0,        y01 = y1-y0,
            x12 = x2-x1,        y12 = y2-y1,
            x32 = x2-x,         y32 = y2-y,
            x03 = x-x0,         y03 = y-y0,
            ax = x01,           ay = y01,
            bx = x12-ax,        by = y12-ay,
            cx = -x32-2*bx-ax,  cy = -y32-2*by-ay,
            k = 1/4,
            len = Math.hypot(x01,y01)*k +
                  Math.hypot(x01*(1-k) + x12/2,y01*(1-k) + y12/2)*k +
                  Math.hypot(x03+(x32-x01)*(2-k)*k-x12*k,y03+(y32-y01)*(2-k)*k-y12*k) +
                  Math.hypot(x32*(1-k) - x12/2,y32*(1-k) - y12/2)*k +
                  Math.hypot(x32,y32)*k,
            du = len < 60  ? 1/4 : 1 / Math.floor(len/10),
            deviation = (len <  30 ? 1/120*len
                       : len < 100 ? 1/4
                       : len < 200 ? 1/2
                       : 1)*g2.squiggle.deviation,
            pt = (u) => {
                let t = 3*u*u - 2*u*u*u,
                    xd = 3*(ax + 2*bx*t + cx*t*t), yd = 3*(ay + 2*by*t + cy*t*t),
                    dd = Math.hypot(xd,yd),
                    sqig = deviation*(Math.random() - 0.5);
                return { x: x0 + 3*ax*t + 3*bx*t*t + cx*t*t*t - sqig*yd/dd,
                         y: y0 + 3*ay*t + 3*by*t*t + cy*t*t*t + sqig*xd/dd,u };
            };
    
        for (let u=du, umax=1+du/2; u <= umax; u += du)
            this.path.d += `L${pt(u).x},${pt(u).y}`;
        this.path.p = {x,y};
        return this;
    }
}
