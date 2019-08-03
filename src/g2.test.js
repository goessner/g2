
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
    font: jest.fn(),
    textAlign: jest.fn(),
    textBaseline: jest.fn(),
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
    let getGridItr;
    // create spies for getters
    let fillStyleSpy;
    let strokeStyleSpy;
    let lineWidthSpy;
    let shadowOffsetXSpy;
    let shadowOffsetYSpy;
    let shadowBlurSpy;
    let shadowColorSpy;
    let setAndResetStyle;

    beforeEach(() => {
        jest.resetAllMocks();
        ctx = new CanvasRenderingContext2D();
        ctx.canvas = {
            height: 150,
            width: 300
        };
        // Mock of the iteration count for grids:
        getGridItr = (sz, x = 0, y = 0) => {
            let itr = 0;
            for (let xitr = (x + 0.5) % sz, nx = ctx.canvas.width + 1; xitr < nx; xitr += sz) {
                itr++;
            }
            for (let yitr = (y + 0.5) % sz, ny = ctx.canvas.height + 1; yitr < ny; yitr += sz) {
                itr++;
            }
            return itr;
        };

        fillStyleSpy = jest.spyOn(ctx, 'fillStyle', 'set');
        strokeStyleSpy = jest.spyOn(ctx, 'strokeStyle', 'set');
        lineWidthSpy = jest.spyOn(ctx, 'lineWidth', 'set');
        shadowOffsetXSpy = jest.spyOn(ctx, 'shadowOffsetX', 'set');
        shadowOffsetYSpy = jest.spyOn(ctx, 'shadowOffsetY', 'set');
        shadowBlurSpy = jest.spyOn(ctx, 'shadowBlur', 'set');
        shadowColorSpy = jest.spyOn(ctx, 'shadowColor', 'set');

        // TODO: Integrate defaults better
        setAndResetStyle = ({
            fs = 'transparent',
            ls = '#000',
            sh = [0, 0, 0, 'rgba(0, 0, 0, 0)'],
            lw = 1 }) => {
            // init style
            expect(fillStyleSpy).toHaveBeenNthCalledWith(1, 'transparent');
            expect(strokeStyleSpy).toHaveBeenNthCalledWith(1, '#000');
            expect(lineWidthSpy).toHaveBeenNthCalledWith(1, 1);
            expect(shadowOffsetXSpy).toHaveBeenNthCalledWith(1, 0);
            expect(shadowOffsetYSpy).toHaveBeenNthCalledWith(1, 0);
            expect(shadowBlurSpy).toHaveBeenNthCalledWith(1, 0);
            expect(shadowColorSpy).toHaveBeenNthCalledWith(1, 'black');
            // style
            expect(fillStyleSpy).toHaveBeenNthCalledWith(2, fs);
            expect(strokeStyleSpy).toHaveBeenNthCalledWith(2, ls);
            expect(shadowOffsetXSpy).toHaveBeenNthCalledWith(2, sh[0]);
            expect(shadowOffsetYSpy).toHaveBeenNthCalledWith(2, sh[1]);
            expect(shadowBlurSpy).toHaveBeenNthCalledWith(2, sh[2]);
            expect(shadowColorSpy).toHaveBeenNthCalledWith(2, sh[3]);
            expect(ctx.stroke).toHaveBeenCalled();
            // reset style
            expect(fillStyleSpy).toHaveBeenNthCalledWith(3, undefined);
            expect(strokeStyleSpy).toHaveBeenNthCalledWith(3, undefined);
            expect(shadowOffsetXSpy).toHaveBeenNthCalledWith(3, 0);
            expect(shadowOffsetYSpy).toHaveBeenNthCalledWith(3, 0);
            expect(shadowBlurSpy).toHaveBeenNthCalledWith(3, 0);
            expect(shadowColorSpy).toHaveBeenNthCalledWith(3, 'rgba(0, 0, 0, 0)');

            if (lw !== 1) {
                expect(lineWidthSpy).toHaveBeenNthCalledWith(2, lw);
                expect(lineWidthSpy).toHaveBeenNthCalledWith(3, undefined);

            }
        };
    });

    it('should be instanceof CanvasRenderingContext2D', () => {
        expect(ctx instanceof CanvasRenderingContext2D).toBe(true);
    });

    it('should draw a grid, then clear the board', () => {
        g2().grid().clr().exe(ctx);
        // grid
        expect(ctx.setTransform).toHaveBeenNthCalledWith(1, 1, 0, 0, 1, 0, 0);
        expect(strokeStyleSpy).toHaveBeenCalledWith('#ccc');
        expect(lineWidthSpy).toHaveBeenCalledWith(1);
        const itr = getGridItr(20);
        expect(ctx.moveTo).toHaveBeenCalledTimes(itr);
        expect(ctx.lineTo).toHaveBeenCalledTimes;
        expect(ctx.stroke).toHaveBeenCalled();
        // clr
        expect(ctx.setTransform).toHaveBeenNthCalledWith(2, 1, 0, 0, 1, 0, 0);
        expect(ctx.clearRect).toHaveBeenCalledWith(0, 0, ctx.canvas.width, ctx.canvas.height);
        // For grid and clr:
        expect(ctx.save).toHaveBeenCalledTimes(2);
        expect(ctx.restore).toHaveBeenCalledTimes(2);
    });

    it('should change the view to cartesian', () => {
        g2().view({ cartesian: true }).exe(ctx);

        expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, -1, 0.5, ctx.canvas.height - 0.5);
    });

    it('should pan the view', () => {
        const [x, y] = [25, 30];
        g2().view({ x, y }).exe(ctx);

        expect(ctx.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, x + 0.5, y + 0.5);
    });

    it('should scale the view', () => {
        const [x, y, scl] = [35, 40, 1.5];
        g2().view({ x, y, scl }).exe(ctx);

        expect(ctx.setTransform).toHaveBeenCalledWith(scl, 0, 0, scl, x + 0.5, y + 0.5);
    });

    it('should zoom in', () => {
        const [x, y, scl] = [35, 40, 1.5];
        g2().view({ x, y }).grid().view({ scl }).exe(ctx);

        // pan
        expect(ctx.setTransform).toHaveBeenNthCalledWith(1, 1, 0, 0, 1, x + 0.5, y + 0.5);
        // grid
        expect(ctx.save).toHaveBeenCalled();
        expect(ctx.setTransform).toHaveBeenNthCalledWith(2, 1, 0, 0, 1, 0, 0);
        expect(strokeStyleSpy).toHaveBeenCalledWith('#ccc');
        expect(lineWidthSpy).toHaveBeenCalledWith(1);
        const itr = getGridItr(20, x, y);
        expect(ctx.moveTo).toHaveBeenCalledTimes(itr);
        expect(ctx.lineTo).toHaveBeenCalledTimes(itr);
        expect(ctx.stroke).toHaveBeenCalled();
        expect(ctx.restore).toHaveBeenCalled();
        // "zoom" afterwards
        expect(ctx.setTransform).toHaveBeenNthCalledWith(3, scl, 0, 0, scl, x + 0.5, y + 0.5);
    });

    it('should draw a circle', () => {
        const [x, y, r] = [30, 40, 5];
        g2().cir({ x, y, r }).exe(ctx);
        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.arc).toHaveBeenCalledWith(x, y, r, 0, 2 * Math.PI, true);
        expect(ctx.fill).toHaveBeenCalled();
        expect(shadowColorSpy).toHaveBeenCalledWith('black');
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should draw a circle with style', () => {
        const [x, y, r, fs, ls, sh] =
            [50, 50, 10, 'yellow', 'blue', [3, 5, 7, 'rgba(0,0,0,0.5)']];
        g2().cir({ x, y, r, fs, ls, sh }).exe(ctx);
        // cir
        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.arc).toHaveBeenCalledWith(x, y, r, 0, 2 * Math.PI, true);
        expect(ctx.fill).toHaveBeenCalled();

        setAndResetStyle({ fs, ls, sh });
    });

    it('should draw an ellipsis', () => {
        const [x, y, rx, ry, rot] = [100, 50, 20, 40, 2];
        g2().ell({ x, y, rx, ry, rot }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.ellipse).toHaveBeenCalledWith(x, y, rx, ry, rot, 0, 2 * Math.PI, false);
        expect(ctx.fill).toHaveBeenCalled();
        expect(shadowColorSpy).toHaveBeenCalledWith('black');
        expect(ctx.stroke).toHaveBeenCalled();

    });

    it('should draw an ellipsis with style', () => {
        const [x, y, rx, ry, rot, fs, ls, sh] =
            [70, 40, 10, 20, 1, 'yellow', 'blue', [3, 5, 7, 'rgba(0,0,0,0.5)']];

        g2().ell({ x, y, rx, ry, rot, fs, ls, sh }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.ellipse).toHaveBeenCalledWith(x, y, rx, ry, rot, 0, 2 * Math.PI, false);
        expect(ctx.fill).toHaveBeenCalled();

        setAndResetStyle({ fs, ls, sh });
    });

    it('should draw an arc', () => {
        const [x, y, r, w, dw] = [90, 50, 35, 1 / 3 * Math.PI, 4 / 3 * Math.PI];
        g2().arc({ x, y, r, w, dw }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.arc).toHaveBeenCalledWith(x, y, r, w, w + dw, false);
        expect(ctx.fill).toHaveBeenCalled();

        expect(shadowColorSpy).toHaveBeenCalledWith('black');
        expect(ctx.stroke).toHaveBeenCalled();
    });

    it('should draw an arc with style', () => {
        const [x, y, r, w, dw, ls, lw, fs, sh] =
            [120, 50, 35, 1, 2, 'green', 5, 'purple', [5, 5, 5, 'rgba(0,0,0,0.5)']];
        g2().arc({ x, y, r, w, dw, ls, lw, fs, sh }).exe(ctx);

        expect(ctx.beginPath).toHaveBeenCalled();
        expect(ctx.arc).toHaveBeenCalledWith(x, y, r, w, w + dw, false);
        expect(ctx.fill).toHaveBeenCalled();

        setAndResetStyle({ ls, lw, fs, sh });
    });
});
