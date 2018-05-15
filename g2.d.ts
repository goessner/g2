// // Type definitions for g2 2.0
// // Project: https://github.com/goessner/g2
// // Definitions by: Stefan Goessner

/**
 * create a g2object
 * https://github.com/goessner/g2/wiki
 */
declare function g2():g2;

interface coordinate {
    x: number;
    y: number;
}
interface radii {
    rx: number;
    ry: number;
}
interface magnitude {
    b: number;
    h: number;
}
interface position1 {
    x1: number;
    y1: number;
}
interface position2 {
    x2: number;
    y2: number;
}
interface position_n {
    xn: number;
    yn: number;
}
interface delta_coordinate {
    dx: number;
    dy: number;
}
interface off_coordinate {
    xoff: number;
    yoff: number;
}
interface radius {      r: number;}
interface scale {       scl: number;}
interface cartesian {   cartesian: boolean;}
interface color {       color: string;}
interface size {        size: number;}
interface delta_angle { dw: number;}
interface angle {       w: number;}
interface rotation {    rot: number;}
interface closed {      closed: boolean;}
interface points {      pts: position_n[];}
interface text {        str: string;}
interface g2object {    grp: g2;}
interface uri {         uri: string;}
interface matrix {      matrix: number[]}
interface svg {
    /*
     * Draw a SVG Path.
     */
   d: string;}

interface view extends  coordinate, scale, cartesian {}
interface grid extends  color, size {}
interface cir extends   coordinate, radius {}
interface ell extends   coordinate, radii, angle, delta_angle, rotation {}
interface arc extends   coordinate, radius, angle, delta_angle {}
interface rec extends   coordinate, magnitude {}
interface lin extends   position1, position2 {}
interface ply extends   coordinate, closed, angle, points {}
interface txt extends   text, coordinate, angle {}
interface use extends   g2object, coordinate, scale, angle {}
interface img extends   uri, coordinate, angle, magnitude, delta_coordinate, off_coordinate {}
interface beg extends   coordinate, angle, scale, matrix {}
interface m extends     coordinate {}
interface l extends     coordinate {}
interface q extends     position1, position2 {}
interface c extends     coordinate, position1, position2 {}
interface a extends     coordinate, angle {}
interface stroke extends svg {}
interface fill extends   svg {}
interface drw extends    svg {}

interface g2 {

    /**
     * clear viewport
     * https://github.com/goessner/g2/wiki/animation
     */
    clr:()=>g2;

    /**
     * change view
     * https://github.com/goessner/g2/wiki/view
     */
    view:(obj:view)=>g2;

    /**
     * create grid
     * https://github.com/goessner/g2/wiki/
     */
    grid:(obj:grid)=>g2;

    /**
     * create a circle
     * https://github.com/goessner/g2/wiki/elements
     */
    cir:(obj:cir)=>g2;

    /**
     * create a ellipse
     * https://github.com/goessner/g2/wiki/elements
     */
    ell:(obj:ell)=>g2;

    /**
     * create an arc
     * https://github.com/goessner/g2/wiki/elements
     */
    arc:(obj:arc)=>g2;

    /**
     * create a rectangle
     */
    rec:(obj:rec)=>g2;

    /**
     * create a line
     * https://github.com/goessner/g2/wiki/elements
     */
    lin:(obj:lin)=>g2;

    /**
     * create a polygon
     * https://github.com/goessner/g2/wiki/elements
     */
    ply:(obj:ply)=>g2;

    /**
     * write a text
     * https://github.com/goessner/g2/wiki/elements
     */
    txt:(obj:txt)=>g2;

    /**
     * reuse a g2-object
     * https://github.com/goessner/g2/wiki/reuse
     */
    use:(obj:use)=>g2;

    /**
     * import an image
     * https://github.com/goessner/g2/wiki/elements
     */
    img:(obj:img)=>g2;

    /**
     * create a "view-matrix"
     * https://github.com/goessner/g2/wiki
     */
    beg:(obj:beg)=>g2;

    /**
     * pops the "top-matrix"
     * https://github.com/goessner/g2/wiki
     */
    end:()=>g2;

    /**
     * begin new path
     * https://github.com/goessner/g2/wiki/paths
     */
    p:()=>g2;

    /**
     * close path
     * https://github.com/goessner/g2/wiki/paths
     */
    z:()=>g2;

    /**
     * move to position
     * https://github.com/goessner/g2/wiki/paths
     */
    m:(obj:m)=>g2;

    /**
     * create line segment
     * https://github.com/goessner/g2/wiki/paths
     */
    l:(obj:l)=>g2;

    /**
     * quadratic curve to
     * https://github.com/goessner/g2/wiki/paths
     */
    q:(obj:q)=>g2;

    /**
     * bezier-curve to
     * https://github.com/goessner/g2/wiki/paths
     */
    c:(obj:c)=>g2;

    /**
     * arc to
     * https://github.com/goessner/g2/wiki/paths
     */
    a:(obj:a)=>g2;

    /**
     * stroke the previously defined path
     * https://github.com/goessner/g2/wiki/paths
     */
    stroke:(obj:stroke)=>g2;

    /**
     * fill the previously defined path
     * https://github.com/goessner/g2/wiki/paths
     */
    fill:(obj:fill)=>g2;

    /**
     * fill and stroke the previously defined path in that order
     * https://github.com/goessner/g2/wiki/paths
     */
    drw:(obj:drw)=>g2;
}