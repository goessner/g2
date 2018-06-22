g2.prototype.aid = function aid({}) { return this.addCommand({c:'aid',a:arguments[0]}); }
g2.prototype.aid.prototype = g2.mixin({},g2.prototype.lin.prototype,{
    g2() {
        // HERE ARE SOME QUESTIONABLE IMPERFECTIONS, BUT IT WORKS SO FAR
        // IT DRAWS MORE THEN NECESSARY IN EXTREME EDGE CASES THOUGH...
        const args = this;

        x_y1 = Math.tan(args.w) * (0 - args.x) + args.y;
        x_x1 = 0;
        x_r1 = Math.hypot(args.x-x_x1,args.y-x_y1);

        x_y2 = Math.tan(args.w) * (ctx.canvas.width - args.x) + args.y;
        x_x2 = ctx.canvas.width;
        x_r2 = Math.hypot(args.x-x_x2,args.y-x_y2);

        y_y1 = 0;
        y_x1 = (0 - args.y) / Math.tan(args.w) + args.x;
        y_r1 = Math.hypot(args.x-y_x1,args.y-y_y1);

        y_y2 = ctx.canvas.height;
        y_x2 = (ctx.canvas.width - args.y) / Math.tan(args.w) + args.x;
        y_r2 = Math.hypot(args.x-y_x2,args.y-y_y2);

        x1 = x_r1 < y_r1 ? x_x1 : y_x1;
        y1 = x_r1 < y_r1 ? x_y1 : y_y1;
        x2 = x_r1 < y_r1 ? x_x2 : y_x2;
        y2 = x_r1 < y_r1 ? x_y2 : y_y2;

        return g2().lin({x1:x1,y1:y1,x2:x2,y2:y2,ld:[6,3],ls:'#666'})
    }
});

/**
 * Polygonial line load. The first and last point define the base line onto which
 * the load is acting orthogonal.
 * @method
 * @returns {object} this
 * @param {array} pts Array of load contour points.
 * @param {real} spacing Spacing of the vectors drawn as a positive real number, interprete as<br>
 *                       * spacing &lt; 1: spacing = 1/m with a partition of m.<br>
 *                       * spacing &gt; 1: length of spacing.
 * @param {object} [style] Arguments object.
 */

// g2.prototype.load = function load(pts,spacing,style) {
//     function iterator(p,dlambda) {
//        var ux = pn.x - p0.x, uy = pn.y - p0.y, uu = ux*ux + uy*uy,
//            lam = [], dlam, lambda = -dlambda;

//        for (var i = 0; i < n; i++)  // build array of projection parameters of polypoints onto base line.
//           lam[i] = ((pitr(i).x - p0.x)*ux + (pitr(i).y - p0.y)*uy)/uu;

//        return {
//           next: function() {
//              lambda += dlambda;
//              for (var i = 0; i < n; i++) {
//                 dlam = lam[i+1] - lam[i];
//                 if (dlam > 0 && lam[i] <= lambda && lambda <= lam[i+1]) {
//                    var mu = (lambda - lam[i])/dlam;
//                    return {
//                       value: {
//                          p1: {x:p0.x + lambda*ux, y:p0.y + lambda*uy},
//                          p2: {x:pitr(i).x + mu*(pitr(i+1).x-pitr(i).x), y:pitr(i).y + mu*(pitr(i+1).y-pitr(i).y)}
//                       }
//                    }
//                 }
//              }
//              return { done: true };
//           }
//        };
//     }

//     var pitr = g2.prototype.ply.itrOf(pts), n = pitr.len, p0 = pitr(0), pn = pitr(n-1),
//         dlambda = spacing < 1 ? spacing : spacing/Math.hypot(pn.x-p0.x,pn.y-p0.y),
//         itr = iterator(pts,dlambda), val;
//     this.ply(pts,false,Object.assign({fs:"@linkfill"},style,{ls:"transparent"}));

//     while (!(val = itr.next()).done)
//        this.vec(val.value.p2,val.value.p1,style);

//     this.proxy(g2.prototype.ply,[pts,false]);

//     return this;
//  }