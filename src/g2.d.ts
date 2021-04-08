// // Type definitions for g2 2.0
// // Project: https://github.com/goessner/g2
// // Definitions by: Stefan Goessner

export const g2: g2;
export function registerThree(): void;

export interface coordinate {
    x?: number;
    y?: number;
}
export interface radii {
    rx: number;
    ry: number;
}
export interface magnitude {
    b: number;
    h: number;
}
export interface position1 {
    x1?: number;
    y1?: number;
}
export interface position2 {
    x2: number;
    y2: number;
}
export interface position_n extends coordinate { }
export interface delta_coordinate {
    dx?: number;
    dy?: number;
}
export interface off_coordinate {
    xoff?: number;
    yoff?: number;
}
export interface radius { r: number; }
export interface scale { scl?: number; }
export interface cartesian { cartesian?: boolean; }
export interface size { size?: number; }
export interface delta_angle { dw?: number; }
export interface angle { w?: number; }
export interface rotation { rot?: number; }
export interface closed { closed?: boolean; }
export interface points { pts: position_n[]; }
export interface text { str: string; }
export interface g2object { grp: g2; }
export interface uri { uri: string; }
export interface matrix { matrix?: number[] }
export interface g2symbol { symbol: string }
export interface svg {
    /*
     * Draw a SVG Path.
     */
    d: string;
}

interface linestyle extends Partial<color> {
    lw?: number,
}

interface color {
    fs?: string,
    ls?: string,
}

export interface view extends coordinate, scale, cartesian { }
export interface grid extends size { color: string }
export interface cir extends coordinate, radius, linestyle { }
export interface ell extends
    coordinate, radii, angle, delta_angle, rotation, linestyle { }
export interface arc extends coordinate, radius, angle, delta_angle, linestyle { }
export interface rec extends coordinate, magnitude, linestyle { }
export interface lin extends position1, position2, linestyle { }
export interface ply extends coordinate, closed, angle, points, linestyle { }
export interface txt extends text, coordinate, angle, linestyle { }
export interface use extends g2object, coordinate, scale, angle, linestyle { }
export interface img extends
    uri, coordinate, angle, magnitude, delta_coordinate, off_coordinate { }
export interface beg extends coordinate, angle, scale, matrix { }
export interface m extends coordinate { }
export interface l extends coordinate { }
export interface q extends position1, position_n { }
export interface c extends coordinate, position1, position2 { }
export interface a extends coordinate, delta_angle { _xp: number, _yp: number }
export interface stroke extends svg, linestyle { }
export interface fill extends svg, linestyle { }
export interface drw extends svg, linestyle { }

export interface spline extends coordinate, points { }
// NOTE Deprecated.
// export interface label extends text { loc?: string | number, off?: number }
// export interface mark extends g2symbol { loc?: number | number[] }

export interface dim extends position1, position2 { }
export interface adim extends coordinate, radius, angle, delta_angle { }
export interface vec extends position1, position2 { }
export interface slider extends coordinate, angle, size { }
export interface spring extends position1, position2 { }
export interface damper extends position1, position2 { h: number }
export interface link extends coordinate, angle, points { }
export interface link2 extends coordinate, angle, points { }
export interface beam extends coordinate, angle, points { }
export interface beam2 extends coordinate, angle, points { }
export interface bar extends position1, position2 { }
export interface bar2 extends bar { }
export interface pulley extends coordinate, radius { }
export interface pulley2 extends pulley { }
export interface rope extends position1, position2 { r1: number, r2: number }
export interface ground extends coordinate, closed, angle, points { }
export interface load extends points, angle { spacing?: number }
export interface pol extends coordinate { }
export interface gnd extends coordinate { }
export interface nod extends coordinate { }
export interface dblnod extends coordinate { }
export interface nodfix extends coordinate { }
export interface nodflt extends coordinate { }
export interface origin extends coordinate { }

type ctx = any;
type handler = any;
export interface g2 {
    /**
     * create a g2object
     * @see https://github.com/goessner/g2/wiki
     */
    (): g2,
    /**
     * handler factory.
     * Please note that ctx and handler could be kind of anything...
     */
    handler: {
        factory: Array<(ctx: ctx) => handler>,
    },
    /**
     * command queue
     */
    commands: { a: any, c: keyof g2 }[]
    /**
     * clear viewport
     * @see https://github.com/goessner/g2/wiki/animation
     */
    clr: () => g2;

    /**
     * change view
     * @see https://github.com/goessner/g2/wiki/view
     */
    view: (obj: view) => g2;

    /**
     * create grid
     * @see https://github.com/goessner/g2/wiki/
     */
    grid: (obj: grid) => g2;

    /**
     * create a circle
     * @see https://github.com/goessner/g2/wiki/elements
     */
    cir: (obj: cir) => g2;

    /**
     * create a ellipse
     * @see https://github.com/goessner/g2/wiki/elements
     */
    ell: (obj: ell) => g2;

    /**
     * create an arc
     * @see https://github.com/goessner/g2/wiki/elements
     */
    arc: (obj: arc) => g2;

    /**
     * create a rectangle
     */
    rec: (obj: rec) => g2;

    /**
     * create a line
     * @see https://github.com/goessner/g2/wiki/elements
     */
    lin: (obj: lin) => g2;

    /**
     * create a polygon
     * @see https://github.com/goessner/g2/wiki/elements
     */
    ply: (obj: ply) => g2;

    /**
     * write a text
     * @see https://github.com/goessner/g2/wiki/elements
     */
    txt: (obj: txt) => g2;

    /**
     * reuse a g2-object
     * @see https://github.com/goessner/g2/wiki/reuse
     */
    use: (obj: use) => g2;

    /**
     * import an image
     * @see https://github.com/goessner/g2/wiki/elements
     */
    img: (obj: img) => g2;

    /**
     * create a "view-matrix"
     * @see https://github.com/goessner/g2/wiki
     */
    beg: (obj: beg) => g2;

    /**
     * pops the "top-matrix"
     * @see https://github.com/goessner/g2/wiki
     */
    end: () => g2;

    /**
     * begin new path
     * @see https://github.com/goessner/g2/wiki/paths
     */
    p: () => g2;

    /**
     * close path
     * @see https://github.com/goessner/g2/wiki/paths
     */
    z: () => g2;

    /**
     * move to position
     * @see https://github.com/goessner/g2/wiki/paths
     */
    m: (obj: m) => g2;

    /**
     * create line segment
     * @see https://github.com/goessner/g2/wiki/paths
     */
    l: (obj: l) => g2;

    /**
     * quadratic curve to
     * @see https://github.com/goessner/g2/wiki/paths
     */
    q: (obj: q) => g2;

    /**
     * bezier-curve to
     * @see https://github.com/goessner/g2/wiki/paths
     */
    c: (obj: c) => g2;

    /**
     * arc to
     * @see https://github.com/goessner/g2/wiki/paths
     */
    a: (obj: a) => g2;

    /**
     * stroke the previously defined path
     * @see https://github.com/goessner/g2/wiki/paths
     */
    stroke: (obj: stroke) => g2;

    /**
     * fill the previously defined path
     * @see https://github.com/goessner/g2/wiki/paths
     */
    fill: (obj: fill) => g2;

    /**
     * fill and stroke the previously defined path in that order
     * @see https://github.com/goessner/g2/wiki/paths
     */
    drw: (obj: drw) => g2;

    /**
     * execute command queue on specified context
     * @see https://github.com/goessner/g2/wiki/concepts
     */
    exe: (arg: RenderingContext) => undefined;

    /**
     * draw spline by points
     * @see https://pomax.github.io/bezierinfo
     * @see https://de.wikipedia.org/wiki/Kubisch_Hermitescher_Spline
     * @see https://github.com/goessner/g2/wiki/g2.ext
     */
    spline: (obj: spline) => g2;

    /**
     * set dimensions between two points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    dim: (obj: dim) => g2;

    /**
     * set dimensions between two angles
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    adim: (obj: adim) => g2;

    /**
     * set vector between two points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    vec: (obj: vec) => g2;

    /**
     * put a slider at a position with size and angle
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    slider: (obj: slider) => g2;

    /**
     * set a string with height between two positions
     * @see https://github.com/goessner/g2/wiki/g2.mec
    */
    spring: (obj: spring) => g2;

    /**
     * set a damper with height between two positions
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    damper: (obj: damper) => g2;

    /**
     * set a closed link between points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    link: (obj: link) => g2;

    /**
     * set an alternative closed link between points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    link2: (obj: link2) => g2;

    /**
     * set an open beam between points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    beam: (obj: beam) => g2;

    /**
     * set an alternative open beam between points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    beam2: (obj: beam2) => g2;

    /**
     * set a bar between 2 points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    bar: (obj: bar) => g2;

    /**
     * set an alternative bar between 2 points
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    bar2: (obj: bar2) => g2;

    /**
     * set a stylized pulley
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    pulley: (obj: pulley) => g2;

    /**
     * set an alternative stylized pulley
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    pulley2: (obj: pulley2) => g2;

    /**
     * set a rope between two points with radial offset
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    rope: (obj: rope) => g2;

    /**
     * set a ground between points with direction
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    ground: (obj: ground) => g2;

    /**
     * set a polygonial load with
     * vector direction indicators
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    load: (obj: load) => g2;

    /**
     * set ground nod
     * @see https://github.com/goessner/g2/wiki/g2.mec
    */
    gnd: (obj: gnd) => g2;

    /**
     * set nod
     * @see https://github.com/goessner/g2/wiki/g2.mec
    */
    nod: (obj: nod) => g2;

    /**
     * set double nod
     * @see https://github.com/goessner/g2/wiki/g2.mec
    */
    dblnod: (obj: dblnod) => g2;

    /**
     * set fixed nod
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    nodfix: (obj: nodfix) => g2;

    /**
     * set floating nod
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    nodflt: (obj: nodflt) => g2;

    /**
     * set origin
     * @see https://github.com/goessner/g2/wiki/g2.mec
     */
    origin: (obj: origin) => g2;
}
