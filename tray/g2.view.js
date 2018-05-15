/**
 * g2.viewport (c) 2016-17 Stefan Goessner
 * @file custom html canvas element for `g2`.
 * @author Stefan Goessner
 * @license MIT License
 */
"use strict";

let g2ui = {
    register: function(g2Element, tagname) {
        Object.setPrototypeOf(g2Element['prototype'], HTMLElement.prototype);
        for (let elms = document.getElementsByTagName(tagname), i=0; i < elms.length; i++)
            g2Element(Object.setPrototypeOf(elms[i],g2Element['prototype']));
    },
    registerElement: function(g2Element, tagname) {
        if (document.readyState === "loading")
            document.addEventListener("DOMContentLoaded", g2ui.register.bind(null, g2Element, tagname));
        else
            g2ui.register(g2Element,tagname);
    }
}

// see https://stackoverflow.com/questions/4288253/html5-canvas-100-width-height-of-viewport

// g2-view element .. managing single canvas at current.
function g2View(elm) { return elm.constructor(); }
g2View.prototype = {
    constructor: function() {
        this.width = +this.getAttribute('width');
        this.height = +this.getAttribute('height');
        this.innerHTML = this.html;
        this.removeAttribute('style');  // remove css visibility of <g2-canvas> parent element .. !
        this.ctx = this.querySelector('canvas').getContext('2d');
        this.g2main = g2().clr();
        this.cartesian = !!eval(this.getAttribute('cartesian'));
        if (this.cartesian) this.g2main.cartesian();
        this.viewport = {x:0,y:0,scl:1};
        if (this.getAttribute('viewport')) {
            let vw = this.getAttribute('view').split(',');
            this.setViewport(vw[0]||0,vw[1]||0,vw[2]||1);
        }
        this.g2main.view({x:()=>this.viewport.x,y:()=>this.viewport.y,scl:()=>this.viewport.scl});
        if (!!eval(this.getAttribute('grid'))) this.g2main.grid();
        this.g2 = g2();
        this.g2main.use({grp:this.g2});
        this.selectable = !!eval(this.getAttribute('selectable'));
        if (this.selectable) {
            this.pos = {x:0,y:0};
            this.picker = g2.picker();
        }
        this.initEventHandling();
        this.signals = {};
        this.dirty = true;
        (this.mainLoop.ptr = this.mainLoop.bind(this))(performance.now());
        return this;
    },
    get html() { return `<canvas width="${this.width}" height="${this.height}" style="border:solid 1px black; cursor:pointer;${this.getAttribute('style')}"></canvas>` },
    // viewport handling ...
    render: function() { this.g2main.exe(this.ctx); },
    pick: function() { this.g2main.exe(this.picker.at(this.pos)); },
    mainLoop: function mainLoop(t) {
        if (this.dirty) {
            this.dirty = false;
            this.notify('step');
            if (this.selectable) this.pick();
            this.render();
        }
        requestAnimationFrame(mainLoop.ptr);
    },
    formatUsrPnt: function({x,y,str}) {
        let frac = Math.max(Math.floor(2*Math.log10(this.viewport.scl)),0);
        x = x.toFixed(frac); y = y.toFixed(frac);
        return str();
    },
    pntToUsr: function(x,y) { let vp = this.viewport; return {x:(x - vp.x)/vp.scl, y:(y - vp.y)/vp.scl} },
//    vecToUsr: function(x,y) { let vp = this.viewport; return {x:(x + vp.x)/vp.scl, y:(y + vp.y)/vp.scl} },
    setView: function(x,y,scl=1) { this.view.x=x; this.view.y=y; this.view.scl=scl; },
    pan: function(dx,dy) { this.viewport.x+=dx; this.viewport.y+=this.cartesian?-dy:dy; },
    zoom: function(x,y,scl) {
        this.viewport.x = (1-scl)*x + scl*this.viewport.x
        this.viewport.y = (1-scl)*y + scl*this.viewport.y
        this.viewport.scl *= scl 
    },
    // event handling ...
    notify: function(key,val) {
        if (this.signals[key])
            this.signals[key].forEach((handler) => handler(val));
    },
    observe: function(key,handler) {
        (this.signals[key] || (this.signals[key]=[])).push(handler);
        return handler;
    },
    remove: function(key,handler) {
        let idx = this.signals[key] ? this.signals[key].indexOf(handler) : -1;
        if (idx >= 0)
           this.signals[key].splice(idx,1);
    },
    initEventHandling: function() {
        this.addEventListener("mousemove", this.mousemove, false);
        this.addEventListener("mousedown", this.buttondown, false);
        this.addEventListener("mouseup", this.mouseup, false);
        this.addEventListener("mouseenter", this.mouseenter, false);
        this.addEventListener("mouseleave", this.mouseleave, false);
        this.addEventListener("wheel", this.wheel, false);
    },
    mousemove: function(e) {
        let evt = this.getEventData(e);
        if (evt.dx || evt.dy) {
            this.notify(evt.buttons ? 'drag' : 'mouse', evt);
            this.pos = {x:evt.x, y:evt.y};
            this.dirty = true;
        }
    },
    buttondown: function(e) { this.notify('buttondown', this.getEventData(e)); },
    buttonup: function(e) { this.notify('buttonup', this.getEventData(e)); },
    wheel: function(e) { this.notify('wheel', this.getEventData(e)); },

    getEventData: function(e) {
        let bbox = e.target.getBoundingClientRect(),
            x = e.clientX - Math.floor(bbox.left),
            y = e.clientY - Math.floor(bbox.top);
//console.log(e.deltaY+','+e.wheelDelta)
        return {
            buttons: (e.buttons !== undefined ? e.buttons : (e.which || e.button)),
            x: x,
            y: this.cartesian ? this.height - y : y,
            dx: e.movementX,
            dy: e.movementY,
            delta: Math.max(-1,Math.min(1,e.deltaY||e.wheelDelta)) || 0
        }
    }
}
g2ui.registerElement(g2View,'g2-view')
