/**
 * g2.lib (c) 2013-17 Stefan Goessner
 * geometric constants and higher functions
 * @license MIT License
 * @link https://github.com/goessner/g2
 */
"use strict"

var g2 = g2 || {};  // for standalone usage ...

g2 = Object.assign(g2, {
    EPS: Number.EPSILON,
    PI: Math.PI,
    PI2: 2*Math.PI,
    SQRT2: Math.SQRT2,
    SQRT2_2: Math.SQRT2/2,
    /**
     * Map angle to the range [0 .. 2*pi].
     * @param {number} w Angle in radians.
     * @returns {number} Angle in radians in interval [0 .. 2*pi].
     */
    toPi2(w) { return (w % g2.PI2 + g2.PI2) % g2.PI2; },
    /**
     * Map angle to the range [-pi .. pi].
     * @param {number} w Angle in radians.
     * @returns {number} Angle in radians in interval [-pi .. pi].
     */
    toPi(w) { return (w = (w % g2.PI2 + g2.PI2) % g2.PI2) > g2.PI ? w - g2.PI2 : w; },
    /**
     * Map angle to arc sector [w0 .. w0+dw].
     * @param {number} w Angle in range [0 .. 2*pi].
     * @param {number} w0 Start angle in range [0 .. 2*pi].
     * @param {number} dw angular range in radians. Can be positive or negative.
     * @returns {number} Normalised angular parameter lambda.
     * '0' corresponds to w0 and '1' to w0+dw. To reconstruct an angle from
     *   the return parameter lambda use: w = w0 + lambda*dw.
     */
    toArc: function(w,w0,dw) {
        if (dw > g2.EPS || dw < -g2.EPS) {
            if      (w0 > w && w0+dw > g2.PI2) w0 -= g2.PI2;
            else if (w0 < w && w0+dw < 0)      w0 += g2.PI2;
            return (w-w0)/dw;

        }
        return 0;
    },
    /**
     * Test, if point is located on line.
     * @param {x,y} point to test.
     * @param {x1,y1} start point of line.
     * @param {x2,y2} end point of line.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnLin({x,y},p1,p2,eps=Number.EPSILON) {
        let dx = p2.x - p1.x, dy = p2.y - p1.y, dx2 = x - p1.x, dy2 = y - p1.y,
            dot = dx*dx2 + dy*dy2, perp = dx*dy2 - dy*dx2, len = Math.hypot(dx,dy), epslen = eps*len;
        return -epslen < perp && perp < epslen && -epslen < dot && dot < len*(len+eps);
    },
    /**
     * Test, if point is located on circle circumference.
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnCir({x:xp,y:yp},{x,y,r},eps=Number.EPSILON) {
        let dx = xp - x, dy = yp - y,
            ddis = dx*dx + dy*dy - r*r, reps = eps*r;
        return -reps < ddis && ddis < reps;
    },
    /**
     * Test, if point is located on a circular arc.
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnArc({x:xp,y:yp},{x,y,r,w,dw},eps=Number.EPSILON) {
        var dx = xp - x, dy = yp - y, dist = Math.hypot(dx,dy),
            mu = g2.toArc(g2.toPi2(Math.atan2(dy,dx)),g2.toPi2(w),dw);
        return r*Math.abs(dw) > eps && Math.abs(dist-r) < eps && mu >= 0 && mu <= 1;
    },
    /**
     * Test, if point is located on a polygon line.
     * @param {x,y} point to test.
     * @param {pts,closed} polygon.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnPly({x,y},{pts,closed},eps=Number.EPSILON) {
    //  console.log(pts)
        for (var i=0,n=pts.length; i<(closed ? n : n-1); i++)
            if (g2.isPntOnLin({x,y},pts[i],pts[(i+1)%n],eps))
                return true;
        return false;
    },
    /**
     * Test, if point is located on a box. A box in contrast to a rectangle
     * is always aligned parallel to coordinate system axes, with its
     * local origin `{x,y}` located in the center. The dimensions `{b,h}` are
     * half size dimensions (so upper right corner is {x+b,y+h}).
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @param {number} eps.
     * @return {boolean} the test result.
     */
    isPntOnBox({x:xp,y:yp},{x,y,b,h},eps=Number.EPSILON) {
        var dx = x.p - x, dy = yp - y;
        return dx >=  b-eps && dx <=  b+eps && dy <=  h+eps && dy >= -h-eps
            || dx >= -b-eps && dx <=  b+eps && dy <=  h+eps && dy >=  h-eps
            || dx >= -b-eps && dx <= -b+eps && dy <=  h+eps && dy >= -h-eps
            || dx >= -b-eps && dx <=  b+eps && dy <= -h+eps && dy >= -h-eps;
    },
    /**
     * Test, if point is located inside of a circle.
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @return {boolean} the test result.
     */
    isPntInCir({x:xp,y:yp},{x,y,r}) {
        return (x - xp)**2 + (y - yp)**2 < r*r;
    },
    /**
     * Test, if point is located inside of a closed polygon.
     * (see http://paulbourke.net/geometry/polygonmesh/)
     * @param {x,y} point to test.
     * @param {pnts,closed} polygon.
     * @returns {boolean} point is on polygon lines.
     */
    isPntInPly({x,y},{pts,closed},eps=Number.EPSILON) {
        let match = 0;
        for (let n=pts.length,i=0,pi=pts[i],pj=pts[n-1]; i<n; pj=pi,pi=pts[++i])
            if(    (y >  pi.y || y >  pj.y)
                && (y <= pi.y || y <= pj.y)
                && (x <= pi.x || x <= pj.x)
                &&  pi.y !== pj.y
                && (pi.x === pj.x || x <= pj.x + (y-pj.y)*(pi.x-pj.x)/(pi.y-pj.y)))
                match++;
        return match%2 != 0;  // even matches required for being outside ..
    },
    /**
     * Test, if point is located inside of a box. A box in contrast to a rectangle
     * is always aligned parallel to coordinate system axes, with its
     * local origin `{x,y}` located in the center. The dimensions `{b,h}` are
     * half size dimensions (so upper right corner is {x+b,y+h}).
     * @param {x,y} point to test.
     * @param {x,y,r} circle.
     * @return {boolean} the test result.
     */
    isPntInBox({x:xp,y:yp},{x,y,b,h}) {
        var dx = xp - x, dy = yp - y;
        return dx >= -b && dx <= b && dy >= -h && dy <= h;
    },

    arc3pts(x1,y1,x2,y2,x3,y3) {
        const dx1 = x2 - x1, dy1 = y2 - y1;
        const dx2 = x3 - x2, dy2 = y3 - y2;
        const den = dx1*dy2 - dy1*dx2;
        const lam = Math.abs(den) > Number.EPSILON
                  ? 0.5*((dx1 + dx2)*dx2 + (dy1 + dy2)*dy2)/den
                  : 0;
        const x0 = lam ? x1 + 0.5*dx1 - lam*dy1 : x1 + 0.5*(dx1 + dx2);
        const y0 = lam ? y1 + 0.5*dy1 + lam*dx1 : y1 + 0.5*(dy1 + dy2);
        const dx01 = x1 - x0, dy01 = y1 - y0;
        const dx03 = x3 - x0, dy03 = y3 - y0;
        const dw = lam ? Math.atan2(dx01*dy03-dy01*dx03,dx01*dx03+dy01*dy03) : 0;
        const r  = dw ? Math.hypot(dy01,dx01) : 0.5*Math.hypot(dy1+dy2,dx1+dx2);

        return {x:x0,y:y0,r:r,w:Math.atan2(dy01,dx01),dw};
    }
})