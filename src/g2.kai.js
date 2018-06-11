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
