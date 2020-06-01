"use strict";

class G2ChartElement extends HTMLElement {
    static get observedAttributes() {
        return [
            'width',
            'height',
        ];
    }

    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
    }

    get width() { return +this.getAttribute('width') || 301; }
    set width(q) { q && this.setAttribute('width', q)}
    get height() { return +this.getAttribute('height') || 201; }
    set height(q) { q && this.setAttribute('height', q)}

    connectedCallback() {
        this._root.innerHTML = G2ChartElement.template({
            width: this.width, height: this.height });

        this._ctx = this._root.getElementById('cnv').getContext('2d');
        
        const g = g2().del().clr().view({cartesian: true});

        try {
            const funcs = JSON.parse(this.innerHTML.trim());
            const t = 20;
            const i = {
                x: t,
                y: t,
                b: this.width - t * 2,
                h: this.height - t * 2,
                xaxis: {},
                yaxis: {},
                funcs
            }
            g.chart(i);
        }
        catch(e) {
            g.txt({str: e, y:5});
        }
        g.exe(this._ctx);
    }

    disconnectedCallback() {
        // TODO
    }

    static template({ width, height }) {
        return `<canvas id='cnv' width=${width} height=${height}
            style="border:solid 1px black;"></canvas>`
    }
}
customElements.define('g2-chart', G2ChartElement);
