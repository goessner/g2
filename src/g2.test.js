
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
global.CanvasRenderingContext2D = function CanvasRenderingContext2D() { };
global.CanvasRenderingContext2D.prototype = {
    clearRect: jest.fn(),
    fillRect: jest.fn(),
    strokeRect: jest.fn(),
    // Drawing text
    fillText: jest.fn(),
    strokeText: jest.fn(),
    measureText: jest.fn(),
    // Line styles
    set lineWidth(a) { jest.fn() },
    lineCap: jest.fn(),
    lineJoin: jest.fn(),
    miterLimit: jest.fn(),
    getLineDash: jest.fn(),
    setLineDash: jest.fn(),
    lineDashOffset: jest.fn(),
    lineDashOffset: jest.fn(),
    // Text styles
    set font(a) { jest.fn() },
    set textAlign(a) { jest.fn() },
    set textBaseline(a) { jest.fn() },
    direction: jest.fn(),
    // Fill and stroke styles
    set fillStyle(a) { jest.fn() },
    set strokeStyle(a) { jest.fn() },
    // Gradient and patterns
    createLinearGradient: jest.fn(),
    createRadialGradient: jest.fn(),
    createPattern: jest.fn(),
    // Shadows
    set shadowBlur(a) { jest.fn() },
    set shadowColor(a) { jest.fn() },
    set shadowOffsetX(a) { jest.fn() },
    set shadowOffsetY(a) { jest.fn() },
    // Paths
    beginPath: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    arc: jest.fn(),
    arcTo: jest.fn(),
    ellipse: jest.fn(),
    rect: jest.fn(),
    // Drawing paths
    fill: jest.fn(),
    stroke: jest.fn(),
    drawFocusIfNeeded: jest.fn(),
    scrollPathIntoView: jest.fn(),
    clip: jest.fn(),
    isPointInPath: jest.fn(),
    isPointInStroke: jest.fn(),
    // Transformations
    rotate: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
    transform: jest.fn(),
    setTransform: jest.fn(),
    // Compositing
    globalAlpha: jest.fn(),
    globalCompositeOperation: jest.fn(),
    // Drawing Images
    drawImage: jest.fn(),
    // Pixel manipulation
    createImageData: jest.fn(),
    getImageData: jest.fn(),
    putImageData: jest.fn(),
    // The canvas state
    save: jest.fn(),
    restore: jest.fn(),
    canvas: jest.fn(),
}
g2 = require('./g2.core');

describe('g2 canvas tests', () => {
    let ctx;
    let gridItrMock;
    // create spies for getters
    let setAndResetStyle;
    let spy;
    const colors = [undefined, 'yellow', 'rgb(0.5,0.5,0.5)'];
    const numbers = [undefined, 0, 10];
    // TODO combine shadows with numbers and colors?
    const shadows = [[0, 0, 0, 'transparent'], [0.5, 0.5, 0.5, 'red']];
    // combine takes an object with styles (whereas the styles are {key: styleArray})
    // and performs "fn" on each variation of them.
    // TODO check which combine is better...
    // function combine(c, fn) {
    //     function incrementWithOverflow(v, supremum) {
    //         if (++v === supremum) {
    //             return 0;
    //         }
    //         return v;
    //     }
    //     function* combinate(input) {
    //         const props = Object.getOwnPropertyNames(input);
    //         const limit = props.map(prop => input[prop].length).reduce((acc, v) => acc * v);
    //         const workingSet = props.map(prop => ({ id: prop, values: input[prop], state: 0 }));

    //         let ptr = 0;
    //         for (let i = 0; i < limit; ++i) {
    //             yield workingSet.map(opt => ({ [opt.id]: opt.values[opt.state] }))
    //                 .reduce((acc, keyValuePair) => Object.assign(acc, keyValuePair), {});

    //             workingSet[ptr].state = incrementWithOverflow(
    //                 workingSet[ptr].state, workingSet[ptr].values.length);
    //             if (workingSet[ptr].state === 0) {
    //                 ptr = incrementWithOverflow(ptr, workingSet.length);
    //             }
    //         }
    //     }
    //     for (const combination of combinate(c)) {
    //         fn(combination);
    //     };
    // };

    // Combine all properties inside of "arr" to be called with one another.
    // This should only be done once for every property because the number of tests gets ridiculous.
    // TODO: recursive and therefore memory intensive. See above for a better solution but meh...
    const combine = (arr, fn) => {
        const rabbithole = (branch, fn, lvl = 0, rabbit = []) => {
            for (const path of branch[lvl][1]) {
                rabbit[lvl] = path;
                if (branch[lvl + 1]) {
                    rabbithole(branch, fn, lvl + 1, rabbit);
                } else {
                    const exit = {};
                    branch.forEach((key, door) => {
                        exit[key[0]] = rabbit[door];
                    });
                    fn(exit);
                }
            }
        };
        rabbithole(Object.entries(arr), fn);
    };

    function dflt(a, def) {
        return typeof a === 'number' ? a : def;
    }
    // create output for objects based on entries
    function currentCombination(obj) {
        let str = '';
        for (const entry of Object.entries(obj)) {
            str += entry[0] + `: ${entry[1]}, `;
        }
        return str.substr(0, str.length - 2);
    }

    beforeEach(() => {

        jest.resetAllMocks();
        ctx = new CanvasRenderingContext2D();
        ctx.canvas = {
            height: 150,
            width: 300
        };
        // Mock of the iteration count for grids:
        gridItrMock = (sz, x = 0, y = 0) => {
            let itr = 0;
            for (let xitr = (x + 0.5) % sz, nx = ctx.canvas.width + 1; xitr < nx; xitr += sz) {
                itr++;
            }
            for (let yitr = (y + 0.5) % sz, ny = ctx.canvas.height + 1; yitr < ny; yitr += sz) {
                itr++;
            }
            return itr;
        };
        // create spies for all setters
        spy = {
            fs: jest.spyOn(ctx, 'fillStyle', 'set'),
            ls: jest.spyOn(ctx, 'strokeStyle', 'set'),
            lw: jest.spyOn(ctx, 'lineWidth', 'set'),
            shadowOffsetX: jest.spyOn(ctx, 'shadowOffsetX', 'set'),
            shadowOffsetY: jest.spyOn(ctx, 'shadowOffsetY', 'set'),
            shadowBlur: jest.spyOn(ctx, 'shadowBlur', 'set'),
            shadowColor: jest.spyOn(ctx, 'shadowColor', 'set'),
            font: jest.spyOn(ctx, 'font', 'set'),
            tval: jest.spyOn(ctx, 'textBaseline', 'set'),
            thal: jest.spyOn(ctx, 'textAlign', 'set')
        };
        // After every calling of a method, it is expected, that the styling is set and reset
        // Because that happens every time, this method is created:
        setAndResetStyle = (arg) => {
            const def = g2.defaultStyle;
            // init style
            expect(spy.fs).toHaveBeenNthCalledWith(1, def.fs);
            expect(spy.ls).toHaveBeenNthCalledWith(1, def.ls);
            expect(spy.lw).toHaveBeenNthCalledWith(1, def.lw);
            expect(spy.shadowOffsetX).toHaveBeenNthCalledWith(1, 0);
            expect(spy.shadowOffsetY).toHaveBeenNthCalledWith(1, 0);
            expect(spy.shadowBlur).toHaveBeenNthCalledWith(1, 0);
            expect(spy.shadowColor).toHaveBeenNthCalledWith(1, 'black');
            expect(spy.font).toHaveBeenNthCalledWith(1, def.font);

            ['fs', 'ls', 'lw', 'font', 'tval', 'thal'].forEach((s) => {
                if (arg[s]) {
                    // TODO there is a problem with 'black' and 'rgba(0,0,0,0)' which is set in "drw()"...
                    expect(spy[s]).toHaveBeenNthCalledWith(2, arg[s]);
                    // expect(spy[s]).toHaveBeenNthCalledWith(3, undefined);
                }
            });
            // If the command contains a shadow, it is expected to be set and reset.
            if (arg.sh) {
                // set
                expect(spy.shadowOffsetX).toHaveBeenNthCalledWith(2, arg.sh[0]);
                expect(spy.shadowOffsetY).toHaveBeenNthCalledWith(2, arg.sh[1]);
                expect(spy.shadowBlur).toHaveBeenNthCalledWith(2, arg.sh[2]);
                expect(spy.shadowColor).toHaveBeenNthCalledWith(2, arg.sh[3]);
                // reset
                expect(spy.shadowOffsetX).toHaveBeenNthCalledWith(3, 0);
                expect(spy.shadowOffsetY).toHaveBeenNthCalledWith(3, 0);
                expect(spy.shadowBlur).toHaveBeenNthCalledWith(3, 0);
                expect(spy.shadowColor).toHaveBeenNthCalledWith(3, 'rgba(0, 0, 0, 0)');
            }
        };
    });

    it('should be instanceof CanvasRenderingContext2D', () => {
        expect(ctx instanceof CanvasRenderingContext2D).toBe(true);
    });

    describe('grid', () => {
        const params = {
            color: colors, // colors is an array with all colors to test
            size: numbers // numbers is an array with some numbers to test
        };
        combine(params, ({ color, size }) => {
            const args = { color, size };
            it(`should draw a grid with ${currentCombination(args)}`, () => {
                g2().grid(args).clr().exe(ctx);
                // grid
                expect(ctx.setTransform).toHaveBeenNthCalledWith(1, 1, 0, 0, 1, 0, 0);
                expect(spy.ls).toHaveBeenCalledWith(color || '#ccc');
                expect(spy.lw).toHaveBeenCalledWith(1);
                // TODO get number of iterations...
                // const itr = getGridItr(20);
                // expect(ctx.moveTo).toHaveBeenCalledTimes(itr);
                // expect(ctx.lineTo).toHaveBeenCalledTimes();
                expect(ctx.stroke).toHaveBeenCalled();
                // clr
                expect(ctx.setTransform).toHaveBeenNthCalledWith(2, 1, 0, 0, 1, 0, 0);
                expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, ctx.canvas.width, ctx.canvas.height);
                // For grid and clr:
                expect(ctx.save).toHaveBeenCalledTimes(2);
                expect(ctx.restore).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('view', () => {
        const params = {
            cartesian: [true, false, undefined],
            x: numbers,
            y: numbers,
            scl: numbers,
        };
        combine(params, ({ cartesian, x, y, scl }) => {
            const args = { cartesian, x, y, scl };
            it(`should change the view with ${currentCombination(args)}`, () => {
                g2().view(args).exe(ctx);
                // catch undefined:
                scl = typeof scl === 'number' ? scl : 1;
                x = typeof x === 'number' ? x : 0;
                y = typeof y === 'number' ? y : 0;
                expect(ctx.setTransform).toHaveBeenCalledWith(
                    scl, 0, 0,
                    cartesian && scl ? -scl : scl, // yepp... because -0 !== 0
                    x + 0.5, (cartesian ? ctx.canvas.height - 1 - y : y) + 0.5);
            });
        });
    });
    describe('cir', () => {
        const params = {
            x: numbers,
            y: numbers,
            r: numbers.filter(v => v !== undefined),
            fs: colors,
            ls: colors,
            lw: numbers,
            sh: shadows,
        };
        combine(params, ({ x, y, r, fs, ls, lw, sh }) => {
            const args = { x, y, r, fs, ls, lw, sh };
            it(`should draw a circle with ${currentCombination(args)}`, () => {
                g2().cir(args).exe(ctx);
                x = dflt(x, 0);
                y = dflt(y, 0);

                expect(ctx.beginPath).toHaveBeenCalled();
                expect(ctx.arc).toHaveBeenCalledWith(x, y, r, 0, 2 * Math.PI, true);
                expect(ctx.fill).toHaveBeenCalled();
                setAndResetStyle({ fs, ls, lw, sh });
            });
        });
    });

    describe('ellipsis', () => {
        const params = {
            x: numbers,
            y: numbers,
            rx: numbers.filter(a => a !== undefined),
            ry: numbers.filter(a => a !== undefined),
            rot: numbers
        };
        combine(params, ({ x, y, rx, ry, rot }) => {
            const args = { x, y, rx, ry, rot };
            it(`should draw an ellipsis with ${currentCombination(args)}`, () => {
                g2().ell(args).exe(ctx);
                x = dflt(x, 0);
                y = dflt(y, 0);
                rot = dflt(rot, 0);

                expect(ctx.beginPath).toHaveBeenCalled();
                expect(ctx.ellipse).toHaveBeenCalledWith(x, y, rx, ry, rot, 0, 2 * Math.PI, false);
                expect(ctx.fill).toHaveBeenCalled();
            });
        });
    });

    describe('arc', () => {
        const params = {
            x: numbers,
            y: numbers,
            r: numbers,
            w: numbers,
            dw: numbers
        };
        combine(params, ({ x, y, r, w, dw }) => {
            const args = { x, y, r, w, dw };
            it(`should draw an arc with ${currentCombination(args)}`, () => {
                g2().arc(args).exe(ctx);
                x = dflt(x, 0);
                y = dflt(y, 0);
                w = dflt(w, 0);
                dw = dflt(dw, 2 * Math.PI);

                if (Math.abs(args.r) > Number.EPSILON) {
                    expect(ctx.beginPath).toHaveBeenCalled();
                    // NOTE: The case for Math.abs(dw) === Number.EPSILON is not covered...
                    if (Math.abs(args.dw) > Number.EPSILON) {
                        expect(ctx.arc).toHaveBeenCalledWith(x, y, r, w, w + dw, false);
                        expect(ctx.fill).toHaveBeenCalled();
                        expect(ctx.stroke).toHaveBeenCalled();
                    }
                    else if (Math.abs(args.dw < Number.EPSILON)) {
                        const cw = Math.cos(w), sw = Math.sin(w);
                        expect(ctx.moveTo).toHaveBeenCalledWith(
                            x - args.r * cw, y - args.r * sw);
                        expect(ctx.lineTo).toHaveBeenCalledWith(
                            x + args.r * cw, y + args.r * sw);
                    }
                }

            });
        });
    });

    describe('rec', () => {
        params = {
            x: numbers,
            y: numbers,
            b: numbers.filter(a => a !== undefined),
            h: numbers.filter(a => a !== undefined)
        };
        combine(params, ({ x, y, b, h, lw, fs, ls, sh }) => {
            const args = { x, y, b, h, lw, fs, ls, sh };
            it(`should draw an rectangle with ${currentCombination(args)}`, () => {
                g2().rec({ x, y, b, h }).exe(ctx);
                x = dflt(x, 0);
                y = dflt(y, 0);
                expect(ctx.fillRect).toHaveBeenCalledWith(x, y, b, h);
                expect(ctx.strokeRect).toHaveBeenCalledWith(x, y, b, h);
            });
        });
    });

    describe('lin', () => {
        const params = {
            x1: numbers,
            y1: numbers,
            x2: numbers.filter(a => a !== undefined),
            y2: numbers.filter(a => a !== undefined),
        };
        combine(params, ({ x1, y1, x2, y2 }) => {
            const args = { x1, y1, x2, y2 };
            it(`should draw a line with ${currentCombination(args)}`, () => {
                g2().lin(args).exe(ctx);
                x1 = dflt(x1, 0);
                y1 = dflt(y1, 0);

                expect(ctx.beginPath).toHaveBeenCalled();
                expect(ctx.moveTo).toHaveBeenCalledWith(x1, y1);
                expect(ctx.lineTo).toHaveBeenCalledWith(x2, y2);
                expect(ctx.stroke).toHaveBeenCalled();
            });
        });
    });

    it('should draw a polygon with format [x1, y1, ..., xn, yn]', () => {
        const pts = [0, 0, 10, 10, 20, 20, 30, 35];
        const [x, y] = [10, 10];
        g2().ply({ x, y, pts }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0.5, 0.5); // TODO why?
        expect(ctx.moveTo).toHaveBeenCalledWith(pts[0], pts[1]);
        for (let i = 2, j = 1; i < pts.length; i += 2, j++) {
            expect(ctx.lineTo).toHaveBeenNthCalledWith(j, pts[i], pts[i + 1]);
        };
        expect(ctx.closePath).not.toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should draw a polygon with format [[x1, y2], ..., [xn, yn]] and close', () => {
        const pts = [[20, 20], [30, 30], [60, 60]];
        const [x, y, closed] = [40, 30, true];
        g2().ply({ x, y, pts, closed }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.setTransform(1, 0, 0, 1, 0.5, 0.5)); // TODO why?
        expect(ctx.moveTo).toHaveBeenCalledWith(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
            expect(ctx.lineTo).toHaveBeenNthCalledWith(i, pts[i][0], pts[i][1]);
        }
        expect(ctx.closePath).toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should draw a polygon with format [{x1, x2}, ... {xn, yn}] and do not close', () => {
        const pts = [{ x: 30, y: 40 }, { x: 10, y: 60 }, { x: 70, y: 10 }];
        const [x, y, closed] = [0, 0, false];
        g2().ply({ x, y, pts, closed }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.setTransform).not.toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalledWith(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            expect(ctx.lineTo).toHaveBeenNthCalledWith(i, pts[i].x, pts[i].y);
        }
        expect(ctx.closePath).not.toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should draw a polygon with style', () => {
        const pts = [{ x: 30, y: 40 }, { x: 10, y: 60 }, { x: 70, y: 10 }];
        const [x, y, closed, fs, ls, lw, sh]
            = [0, 0, false, 'yellow', '#1234', 10, [0.2, 0.3, 0.4, '#9182']];

        g2().ply({ x, y, pts, closed, fs, ls, lw, sh }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.setTransform).not.toHaveBeenCalled();
        expect(ctx.moveTo).toHaveBeenCalledWith(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            expect(ctx.lineTo).toHaveBeenNthCalledWith(i, pts[i].x, pts[i].y);
        }
        expect(ctx.closePath).not.toHaveBeenCalled();
        expect(ctx.stroke).toHaveBeenCalled();

        setAndResetStyle({ fs, ls, lw, sh });
    });

    it('should write a text', () => {
        const [str, x, y, w] = ['Hello World', 10, 20, 1];
        g2().txt({ str, x, y, w }).exe(ctx);

        expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 0.5, 0.5); // TODO why?
        expect(ctx.fillText).toHaveBeenCalledWith(str, 0, 0);
    });
    // NOTE: No shadow, because the setter and getter is 'black' here and not 'rgba(0,0,0,0)...
    // This should be changed in g2 and then changed here...
    it('should write a text with style', () => {
        const [str, x, y, w, fs, ls, font, sh]
            = ['Bye world', 20, 30, 0, 'red', '#00f', '16px serif', [0.5, 0.5, 0.5, 'red']];
        g2().txt({ str, x, y, w, fs, ls, font }).exe(ctx);

        expect(ctx.fillText).toHaveBeenCalledWith(str, 0, 0);
        setAndResetStyle({ fs, ls, font });
    });

    describe('should write alternatively aligned text', () => {
        const thalArr = ['start', 'end', 'left', 'right', 'center'];
        const tvalArr = ['top', 'hanging', 'middle', 'alphabetic', 'ideographic', 'bottom'];
        const str = 'aligned';
        for (let h = 0; h < thalArr.length; ++h) {
            for (let v = 0; v < tvalArr.length; ++v) {
                const nth = h * tvalArr.length + h + 1;
                it(`should write a text with alignment ${thalArr[h]} ${tvalArr[v]}`, () => {
                    g2().txt({ str, thal: thalArr[h], tval: tvalArr[v] }).exe(ctx);
                    setAndResetStyle({ tval: tvalArr[v], thal: thalArr[h] });
                });
            }
        }
    });
});
