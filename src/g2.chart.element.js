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
            'xlabels',
            'ylabels',
            'xticks',
            'yticks',
            'xtitle',
            'ytitle'
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
    get xmin() { return +this.getAttribute('xmin') || undefined; }
    set xmin(q) { return q && +this.setAttribute('xmin', q) }
    get xmax() { return +this.getAttribute('xmax') || undefined; }
    set xmax(q) { return q && +this.setAttribute('xmax', q) }
    get ymin() { return +this.getAttribute('ymin') || undefined; }
    set ymin(q) { return q && +this.setAttribute('ymin', q) }
    get ymax() { return +this.getAttribute('ymax') || undefined; }
    set ymax(q) { return q && +this.setAttribute('ymax', q) }
    get title() { return this.getAttribute('title') || ''; }
    set title(q) { return q && this.setAttribute('title', q) }
    get xlabels() { return this.getAttribute('xlabels') !== 'false'; }
    get ylabels() { return this.getAttribute('ylabels') !== 'false'; }
    get xticks() { return this.getAttribute('xticks') !== 'false'; }
    get yticks() { return this.getAttribute('yticks') !== 'false'; }
    get xtitle() { return this.getAttribute('xtitle'); }
    get ytitle() { return this.getAttribute('ytitle'); }

    connectedCallback() {
        this._root.innerHTML = G2ChartElement.template({
            width: this.width, height: this.height
        });

        const xmargin = (this.yticks && 5) + (this.ylabels && 15) + (this.ytitle && 15);
        const ymargin = (this.xticks && 5) + (this.xlabels && 15) + (this.xtitle && 15);

        this._chart = {
            x: xmargin,
            y: ymargin,
            xmin: this.xmin,
            xmax: this.xmax,
            ymin: this.ymin,
            ymax: this.ymax,
            title: this.title,
            b: this.width - 5 - xmargin,
            h: this.height - 5 - ymargin - (this.title && 15),
            xaxis: () => this.xaxis || { ticks: this.xticks, labels: this.xlabels, title: this.xtitle },
            yaxis: () => this.yaxis || { ticks: this.yticks, labels: this.ylabels, title: this.ytitle },
            title: () => this.title || "",
            funcs: []
        };

        if (this.innerHTML) {
            let res;

            try { res = JSON.parse(this.innerHTML); }
            catch (e) { 
                console.error(e); 
                this._g.txt({ str: e, y: 5 });
            }

            this._chart.funcs.push(...G2ChartElement.validateFunc(res));
        }

        this._ctx = this._root.getElementById('cnv').getContext('2d');
        this._g = g2().del().clr().view({ cartesian: true }).chart(this._chart);
/*
        try {
            // If not true, the element should be referenced by another module.
            if (this.innerHTML !== '') {
                // Remove all functions (declared by "fn": fn) and fetch them before parsing.
                // Then bring them back in using Function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#Never_use_eval

                // Find all functions declared by "fn:" like here: https://goessner.github.io/g2/g2.chart.html#example-multiple-functions
                const funcRegEx = /(("|')fn("|'):)([^(,|})]+)/g;
                const funcs = JSON.parse(this.innerHTML.replace(funcRegEx, '"fn":"PLACEHOLDER"').trim());
                let itr = 0;
                for (const a of this.innerHTML.matchAll(funcRegEx)) {
                    funcs[itr].fn = (() => Function('"use strict"; return (' + a[4] + ')')())();
                    itr++;
                }
                this.funcs = funcs;
            }
        }
        catch (e) {
            console.warn(e);
            this._g.txt({ str: e, y: 5 });
        }
        finally {
            this._g.nod({
                x: () => this.nod && this.nod().x,
                y: () => this.nod && this.nod().y,
                scl: () => this.nod && this.nod().scl || 0
            });
            this.render();
        }
*/
        this.render();
    }

    render() {
        this._g.exe(this._ctx);
    }
/*
    setFuncs(funcs) {
        this.funcs = funcs;
        return this;
    }
*/
    disconnectedCallback() {
        // TODO
    }

    static validateFunc(obj, funcs) {
        funcs = funcs || [];
        if (Array.isArray(obj))  // array of functions ...
            for (const o of obj)
                G2ChartElement.validateFunc(o, funcs);
        else if (typeof obj === 'object') {  // single function ...
            if ('fn' in obj) {
                const fnc = Function('"use strict";return (' + obj['fn'] + ')')();
                obj.fn = typeof fnc === 'function' ? fnc : undefined;  // todo: error message ...
            }
            if ('fn' in obj || 'data' in obj)
                funcs.push(obj);
        }
        return funcs;
    }

    static template({ width, height }) {
        return `<canvas id='cnv' width=${width} height=${height}></canvas>`
    }
}
customElements.define('g2-chart', G2ChartElement);
