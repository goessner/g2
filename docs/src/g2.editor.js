/**
 * g2.editor.js (c) 2018 Stefan Goessner
 * @file editor interfaces for `g2` elements.
 * @author Stefan Goessner
 * @license MIT License
 */
"use strict"

/**
 * Extensions.
 * (Requires cartesian coordinate system)
 * @namespace
 */
var g2 = g2 || { prototype:{} };  // for jsdoc only ...

// extend prototypes for argument objects
g2.editor = function() {
    if (this instanceof g2.editor) {
        this.draggable = false;
        this.handles = g2();
        return this;
    }
    return g2.editor.apply(Object.create(g2.editor.prototype),arguments);
};
g2.handler.factory.push((ctx) => ctx instanceof g2.editor ? ctx : false);

g2.NONE = 0x0; g2.OVER = 0x1; g2.DRAG = 0x2; g2.EDIT = 0x4;
g2.editor.state = ['NONE','OVER','DRAG','OVER+DRAG','EDIT','OVER+EDIT'];

g2.editor.prototype = {
    init(grp) {
        return true;
    },
    get selection() {
        return this.handles.commands.length && this.handles || false;
    },
    get dragInfo() { return this.draggable && '_info' in this.draggable && this.draggable._info() },
    g2() { return this.handles; },
    exe(commands) {
        if (this.evt) {   // selection state can change only with events... !
            if (this.selection) {
                if (this.evt.type === 'click') {           // something selected ..
                    for (let cmd of commands)
                        if (cmd.a && cmd.a.state)
                            cmd.a.state = g2.NONE;
                    this.handles.del();
                }
                else {
                    for (let cmd of this.handles.commands)  // treat handles interactivity !
                        if (cmd.c === 'handle')
                            this.hit(cmd.a);
                }
            }
            else {
                for (let elm=false, i=commands.length; i && !elm; i--)  // stop after first hit .. starting from list end !
                    elm = this.hit(commands[i-1].a)
            }
            this.evt = false;
        }
    },
    on({type,x,y,dx,dy,btn}) {
        this.evt = {type,x,y,dx,dy,btn,eps:2};
        return this;
    },
    hit(elm) {
        const {type,dx,dy} = this.evt;
        if (!elm) {  // commands without arguments object .. !
            return false;
        }
        else if (elm.state & g2.EDIT) {                               // in EDIT mode
            if (type === 'click')                                     // leave EDIT mode ..
                elm.state ^= g2.EDIT;
        }
        else if (!(elm.state & g2.OVER)) {                            // not in OVER mode
            if (type === 'pointer' && this.elementHit(elm,this.evt))  // enter OVER mode ..
                elm.state |= g2.OVER;
        }
        else if (elm.state & g2.DRAG) {                               // in DRAG mode
            if (type === 'drag' && elm.drag)                          // drag element ..
                elm.drag({dx,dy});
            else if (type === 'buttonup')                             // leave DRAG mode ..
                this.elementDragEnd(elm);
            else if (type === 'click')
                this.elementEdit(elm);                                // enter EDIT mode ..
        }
        else if (elm.state & g2.OVER) {                               // in OVER mode
            if (type === 'pointer' && !this.elementHit(elm,this.evt)) // leave OVER mode ..
                elm.state ^= g2.OVER;
            else if (type === 'buttondown')                           // enter DRAG mode ..
                this.elementDragBeg(elm);
        }
        else
            console.log('what state .. '+g2.editor.state[elm.state]);

        this.curState = g2.editor.state[elm && elm.state || 0];

        return elm.state && elm;
    },
    elementHit(elm,{x,y,eps}) {
        return elm.isSolid ? elm.hitInner && elm.hitInner({x,y,eps})
                           : elm.hitContour && elm.hitContour({x,y,eps});
    },
    elementDragBeg(elm) {
        elm.state |= g2.DRAG;
        this.draggable = elm;
    },
    elementDragEnd(elm) {
        elm.state ^= g2.DRAG;
        this.draggable = false;
    },
    elementEdit(elm) {
        if ('handles' in elm) {
            elm.state = elm.state ^ g2.OVER | g2.EDIT;
            elm.handles(this.handles);
        }
    },
};

// implement zoom agnostic handle ...
g2.prototype.handle = function handle({x,y,_update,info}) { return this.addCommand({c:'handle',a:arguments[0]}); };
g2.prototype.handle.prototype = {
    isSolid: true,
    sz: 4,
    hitInner({x,y,eps}) { return Math.abs(this.x-x) < this.sz+eps && Math.abs(this.y-y) < this.sz+eps; },
    drag({dx,dy}) { this.x += dx; this.y += dy; this._update({x:this.x,y:this.y,dx,dy}); },
    get fs() { return this.state & g2.DRAG ? 'beige' : 'lightgoldenrodyellow' },
    get sh() { return this.state ? [0,0,5,"gray"] : false },
    _info() { return `x:${this.x}<br>y:${this.y}` }
}
g2.canvasHdl.prototype.handle = function({x,y,sz,fs,sh}) {
    let m = this.matrix[this.matrix.length-1],
        scl = Math.hypot(m[0],m[1]),
        z = sz/scl,
        tmp = this.setStyle({ls:'#444',lw:1/scl,fs,sh});
    this.ctx.fillRect(x-z+0.5,y-z+0.5,2*z,2*z);
    this.ctx.strokeRect(x-z+0.5,y-z+0.5,2*z,2*z);
    this.resetStyle(tmp);
}
