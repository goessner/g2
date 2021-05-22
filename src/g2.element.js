/**
 * g2.element.js (c) 2019-21 Stefan Goessner
 * @license MIT License
 */
"use strict";

class G2Element extends HTMLElement {
    static get observedAttributes() {
        return ['width', 'height','cartesian','grid', 'x0', 'y0', 'darkmode', 'interactive','background'];
    }

    constructor() {
        super();
        this._root = this.attachShadow({ mode:'open' });
    }

    get width() { return +this.getAttribute('width') || 301; }
    set width(q) { if (q) this.setAttribute('width',q); }
    get height() { return +this.getAttribute('height') || 201; }
    set height(q) { if (q) this.setAttribute('height',q); }
    get x0() { return (+this.getAttribute('x0')) || 0; }
    set x0(q) { if (q) this.setAttribute('x0',q); }
    get y0() { return (+this.getAttribute('y0')) || 0; }
    set y0(q) { if (q) this.setAttribute('y0',q); }
    get cartesian() { return this.hasAttribute('cartesian'); }
    set cartesian(q) { q ? this.setAttribute('cartesian','') : this.removeAttribute('cartesian'); }
    get grid() { return this.hasAttribute('grid') || false; }
    set grid(q) { q ? this.setAttribute('grid','') : this.removeAttribute('grid'); }
    get darkmode() { return this.hasAttribute('darkmode') || false; }
    get interactive() { return this.hasAttribute('interactive') || false; }
    get background() { return this.getAttribute('background') || false; }
    get g() { return this._g; }
    get canvas() { return  this._ctx && this._ctx.canvas || false }
    get readyState() { return !!this._g; }

    update() { 
        if (!this.interactive && this._g && this._ctx) 
            this._g.exe(this._ctx); 
    }

    init() {
        const state = {x:this.x0,y:this.y0,cartesian:this.cartesian};
        // add shadow dom
        this._root.innerHTML = G2Element.template({width:this.width,height:this.height,darkmode:this.darkmode});
        // cache elements of shadow dom
        this._logview = this._root.getElementById('logview');
        // set up canvas context 
        this._ctx = this._root.getElementById('cnv').getContext('2d');
        // set up canvas background 
        if (this.background && G2Element[this.background])
            this._ctx.canvas.style.backgroundImage = 'url('+G2Element[this.background]+')';
        // set up canvas interactor 
        if (this.interactive) {
            this._interactor = canvasInteractor.create(this._ctx, state);
            this._selector = g2.selector(this._interactor.evt);
            this._interactor.on('tick', e => this.ontick(e))
                            .on('pan', e => this.onpan(e))
                            .on('drag', e => this.ondrag(e))
                            .on('wheel', e => this.onwheel(e));
        }
        this._g = g2().clr().view(this.interactive && this._interactor.view || state);
        if (this.grid) this._g.grid({color:this.darkmode?'#999':'#ccc'});
        this.initContent(this.innerHTML.trim(), e => this.log(e));
        if (this.interactive)
            this._interactor.startTimer();
        else    // no tick timer .. !
            this._g.exe(this._ctx);
        this.dispatchEvent(new CustomEvent('init'));
    }
    initContent(content, onErr) {
        if (!content) return;
        try { 
            content = JSON.parse(content);                      // is valid JSON string ?
            content = g2.io.parseGrp(content, 'main', onErr);   // is valid g2 json string
            if (content && content.commands) {                  // content is a valid g2 object.
                this._g.commands.push(...content.commands);     // inject commands of `main` group ...
            }                                                   // ... into `_g` with a little brute force.
        }
        catch(e) {
            const w = this.width, h = this.height, x0 = this.x0, y0 = this.y0, dx = w/20, dy = h/20,
                  x = q => q*w-x0, y = q => q*h-y0;

            content = g2({id:'main'}).stroke({"d":`M${x(0.05)},${y(0.05)} ${x(0.45)},${y(0.45)}M${x(0.55)},${y(0.55)} ${x(0.95)},${y(0.95)}M${x(0.05)},${y(0.95)} ${x(0.45)},${y(0.55)}M${x(0.55)},${y(0.45)} ${x(0.95)},${y(0.05)}`,lw:10,ls:"red",lc:"round"});
            this._g.ins(content);
            onErr(e.message);
        }
        return !!content;
    }
    deinit() {
        delete this._selector;
        if (this.interactive) {
            delete this._interactor.deinit();
            delete this._interactor;
            delete this._selector;
        }
        delete this._g;
        // delete cached data
        delete this._ctx;
    }
    log(str) { 
        this._logview.innerHTML += str; 
    }

    ontick(e) {
        this.dispatchEvent(new CustomEvent('tick'));
        if (this.interactive)
            this._g.exe(this._selector);
        this._g.exe(this._ctx);
    }
    onpan(e) { 
        this._interactor.view.x = this.x0 += e.dx;
        this._interactor.view.y = this.y0 += e.dy;
    }
    ondrag(e) {    // only modify selected geometry here .. do not redraw .. !
        if (this._selector.selection && this._selector.selection.drag) {
            this._selector.selection.drag({x:e.xusr,y:e.yusr,dx:e.dxusr,dy:e.dyusr,mode:'drag'});
            this.dispatchEvent(new CustomEvent('drag'));
        }
    }
    onwheel(e) {
        this._interactor.view.x = e.x + e.dscl*(this._interactor.view.x - e.x);
        this._interactor.view.y = e.y + e.dscl*(this._interactor.view.y - e.y);
        this._interactor.view.scl *= e.dscl;
    }

    on(hdl,fn) { }

    // standard lifecycle callbacks
    // https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
    connectedCallback() {
        this.init();
    }
    disconnectedCallback() {
        this.deinit();
    }
    attributeChangedCallback(name, oldval, val) {
        if (this._root && this._root.getElementById('cnv')) {
            if (name === 'width') {  // todo: preserve minimum width
                this._root.getElementById('cnv').setAttribute('width',val);
                this._root.querySelector('.status').style.width = val+'px';
            }
            if (name === 'height')   // todo: preserve minimum height
                this._root.getElementById('cnv').setAttribute('height',val);
        }
    }

    static template({width,height,darkmode}) {
return `
<style>
    #cnv {
        background-color:${darkmode?'#777':'#eee'};
        touch-action: none;
    }
</style>
<div style="width:${width};">
<canvas id="cnv" width="${width}" height="${height}" touch-action="none"></canvas><br>
<pre id="logview"></pre>
</div>
`
    }

    static get paper() { return " data:image/png;base64,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"; }
}
customElements.define('g-2', G2Element);
