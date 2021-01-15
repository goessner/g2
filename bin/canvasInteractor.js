/**
 * canvasInteractor.js (c) 2018 Stefan Goessner
 * @file interaction manager for html `canvas`.
 * @author Stefan Goessner
 * @license MIT License
 */
/* jshint -W014 */
// Managing multiple canvases per static interactor as singleton ... 
// .. using a single requestAnimationFrame loop !
const canvasInteractor = {
    create() {
        const o = Object.create(this.prototype);
        o.constructor.apply(o,arguments); 
        return o; 
    },
    // global static tickTimer properties
    fps: '?',
    fpsOrigin: 0,
    frames: 0,
    rafid: 0,
    instances: [],
    // global static timer methods
    tick(time) {
        canvasInteractor.fpsCount(time);
        for (const instance of canvasInteractor.instances) {
            instance.notify('tick',{t:time,dt:(time-instance.t)/1000,dirty:instance.dirty});  // notify listeners .. 
            instance.t = time;
            instance.dirty = false;
        }
        canvasInteractor.rafid = requestAnimationFrame(canvasInteractor.tick);   // request next animation frame ...
    },
    add(instance) {
        canvasInteractor.instances.push(instance);
        if (canvasInteractor.instances.length === 1)  // first instance added ...
            canvasInteractor.tick(canvasInteractor.fpsOrigin = performance.now());
    },
    remove(instance) {
        canvasInteractor.instances.splice(canvasInteractor.instances.indexOf(instance),1);
        if (canvasInteractor.instances.length === 0)   // last instance removed ...
            cancelAnimationFrame(canvasInteractor.rafid);
    },
    fpsCount(time) {
        if (time - canvasInteractor.fpsOrigin > 1000) {  // one second interval reached ...
            const fps = ~~(canvasInteractor.frames*1000/(time - canvasInteractor.fpsOrigin) + 0.5); // ~~ as Math.floor()
            if (fps !== canvasInteractor.fps)
                for (const instance of canvasInteractor.instances)
                    instance.notify('fps',canvasInteractor.fps=fps);
            canvasInteractor.fpsOrigin = time;
            canvasInteractor.frames = 0;
        }
        canvasInteractor.frames++;
    },

    prototype: {
        constructor(ctx, {x,y,scl,cartesian}) {
            // canvas interaction properties
            this.ctx = ctx;
            this.view = {x:x||0,y:y||0,scl:scl||1,cartesian:cartesian||false};
            this.evt = {
                type: false,
                basetype: false,
                x: -2, y:-2,
                xi: 0, yi:0,
                dx: 0, dy: 0,
                btn: 0,
                xbtn: 0, ybtn: 0,
                xusr: -2, yusr: -2,
                dxusr: 0, dyusr: 0,
                delta: 0,
                inside: false,
                hit: false,  // something hit by pointer ...
                dscl: 1,     // for zooming ...
                eps: 5       // some pixel tolerance ...
            };
            this.dirty = true;
            // event handler registration
            const canvas = ctx.canvas;
            canvas.addEventListener("pointermove", this, false);
            canvas.addEventListener("pointerdown", this, false);
            canvas.addEventListener("pointerup", this, false);
            canvas.addEventListener("pointerenter", this, false);
            canvas.addEventListener("pointerleave", this, false);
            canvas.addEventListener("wheel", this, false);
            canvas.addEventListener("pointercancel", this, false);
        },
        deinit() {
            const canvas = this.ctx.canvas;

            canvas.removeEventListener("pointermove", this, false);
            canvas.removeEventListener("pointerdown", this, false);
            canvas.removeEventListener("pointerup", this, false);
            canvas.removeEventListener("pointerenter", this, false);
            canvas.removeEventListener("pointerleave", this, false);
            canvas.removeEventListener("wheel", this, false);
            canvas.removeEventListener("pointercancel", this, false);

            this.endTimer();

            delete this.signals;
            delete this.evt;
            delete this.ctx;

            return this;
        },
        // canvas interaction interface
        handleEvent(e) {
            if (e.type in this && (e.isPrimary || e.type === 'wheel')) {  // can I handle events of type e.type .. ?
                const bbox = e.target.getBoundingClientRect && e.target.getBoundingClientRect() || {left:0, top:0},
                      x = e.clientX - Math.floor(bbox.left),
                      y = e.clientY - Math.floor(bbox.top),
                      btn = e.buttons !== undefined ? e.buttons : e.button || e.which;

                this.evt.type = e.type;
                this.evt.basetype = e.type;  // obsolete now ... ?
                this.evt.xi = this.evt.x;    // interim coordinates ...
                this.evt.yi = this.evt.y;    // ... of previous event.
                this.evt.dx = this.evt.dy = 0;
                this.evt.x = x;
                this.evt.y = this.view.cartesian ? this.ctx.canvas.height - y : y;
                this.evt.xusr = (this.evt.x - this.view.x)/this.view.scl;
                this.evt.yusr = (this.evt.y - this.view.y)/this.view.scl;
                this.evt.dxusr = this.evt.dyusr = 0;
                this.evt.dbtn = btn - this.evt.btn;
                this.evt.btn = btn;
                this.evt.delta = Math.max(-1,Math.min(1,e.deltaY||e.wheelDelta)) || 0;

                if (this.isDefaultPreventer(e.type))
                    e.preventDefault();
                this[e.type]();  // handle specific event .. !
                this.notify(this.evt.type,this.evt);  // .. tell the world .. !
            }
            else
                console.log(e)
        },
        pointermove() {
            this.evt.dx = this.evt.x - this.evt.xi;
            this.evt.dy = this.evt.y - this.evt.yi;
            if (this.evt.btn === 1) {    // pointerdown state ...
                this.evt.dxusr = this.evt.dx/this.view.scl;  // correct usr coordinates ...
                this.evt.dyusr = this.evt.dy/this.view.scl;
                this.evt.xusr -= this.evt.dxusr;  // correct usr coordinates ...
                this.evt.yusr -= this.evt.dyusr;
                if (!this.evt.hit) {      // let outer app perform panning ...
                    this.evt.type = 'pan';
                }
                else
                    this.evt.type = 'drag';
            }
            // view, geometry or graphics might be modified ...
            this.dirty = true;
        },
        pointerdown() { 
            this.evt.xbtn = this.evt.x;
            this.evt.ybtn = this.evt.y;
        },
        pointerup() { 
            this.evt.type = this.evt.x===this.evt.xbtn && this.evt.y===this.evt.ybtn ? 'click' : 'pointerup';
            this.evt.xbtn = this.evt.x;
            this.evt.ybtn = this.evt.y;
        },
        pointerleave() { 
            this.evt.inside = false;
        },
        pointerenter() { 
            this.evt.inside = true;
        },
        wheel() {
            this.evt.dscl = this.evt.delta>0?8/10:10/8;
            this.evt.eps /= this.evt.dscl;
            this.dirty = true;
        },
        isDefaultPreventer(type) {
            return ['pointermove','pointerdown','pointerup','wheel'].includes(type);
        },
        pntToUsr: function(p) { 
            let vw = this.view; 
            p.x = (p.x - vw.x)/vw.scl; 
            p.y = (p.y - vw.y)/vw.scl; 
            return p; 
        },
        // tickTimer interface
        startTimer() {  // shouldn't there be a global startTimer method ?
            canvasInteractor.add(this);
            this.notify('timerStart',this);                    // notify potential listeners .. 
            return this;
        },
        endTimer() {
            this.notify('timerEnd',this.t/1000);              // notify potential listeners .. 
            canvasInteractor.remove(this);      
            return this;
        },
        // observable interface
        notify(key,val) {
            if (this.signals && this.signals[key]) 
                for (let hdl of this.signals[key]) 
                    hdl(val);
            return this;
        },
        on(key,handler) {   // support array of keys as first argument.
            if (Array.isArray(key))
                for (let k of key) 
                    this.on(k,handler);
            else
                ((this.signals || (this.signals = {})) && this.signals[key] || (this.signals[key]=[])).push(handler);
            
            return this;
        },
        remove(key,handler) {
            const idx = (this.signals && this.signals[key]) ? this.signals[key].indexOf(handler) : -1;
            if (idx >= 0)
                this.signals[key].splice(idx,1);
        }
    }
};
