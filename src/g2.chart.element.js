"use strict";

class G2ChartElement extends HTMLElement {
    static get observedAttributes() {
        return [
            'width',
            'height',
            'xmin',
            'xmax',
            'ymin',
            'ymax',
            'title',
        ];
    }

    constructor() {
        super();
        this._root = this.attachShadow({ mode: 'open' });
    }

    get width() { return +this.getAttribute('width') || 301; }
    set width(q) { q && this.setAttribute('width', q) }
    get height() { return +this.getAttribute('height') || 201; }
    set height(q) { q && this.setAttribute('height', q) }
    get xmin() { return +this.getAttribute('xmin') || 0; }
    set xmin(q) { return q && +this.setAttribute('xmin', q) }
    get xmax() { return +this.getAttribute('xmax') || 0; }
    set xmax(q) { return q && +this.setAttribute('xmax', q) }
    get ymin() { return +this.getAttribute('ymin') || 0; }
    set ymin(q) { return q && +this.setAttribute('ymin', q) }
    get ymax() { return +this.getAttribute('ymax') || 0; }
    set ymax(q) { return q && +this.setAttribute('ymax', q) }
    get title() { return this.getAttribute('title') || ''; }
    set title(q) { return q && this.setAttribute('title', q) }

    connectedCallback() {
        this._root.innerHTML = G2ChartElement.template({
            width: this.width, height: this.height });

        this._ctx = this._root.getElementById('cnv').getContext('2d');
        
        const g = g2().del().clr().view({cartesian: true});

        try {
            // Remove all functions (declared by "fn": fn) and fetch them before parsing.
            // Then bring them back in using Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval
            
            // Find all functions declared by "fn:" like here: https://goessner.github.io/g2/g2.chart.html#example-multiple-functions
            const funcRegEx = /(("|')fn("|'):)([^(,|})]+)/g;
            const funcs = JSON.parse(this.innerHTML.replace(funcRegEx, '"fn":"PLACEHOLDER"').trim());
            let itr = 0;
            for (const a of this.innerHTML.matchAll(funcRegEx))
            {
                funcs[itr].fn = (() => Function('"use strict"; return (' + a[4] + ')')())();
                itr++;
            }
            const t = 20;
            const i = {
                x: t,
                y: t,
                xmin: this.xmin,
                xmax: this.xmax,
                ymin: this.ymin,
                ymax: this.ymax,
                title: this.title,
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
