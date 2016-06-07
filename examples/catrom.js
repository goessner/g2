// s. http://stackoverflow.com/questions/9489736/catmull-rom-curve-with-no-cusps-and-no-self-intersections

// c0 + c1*t + c2*t*t + c3*t*t*t
function evalPoly3(c,t) {
   return c[0] + c[1]*t + c[2]*t*t + c[3]*t*t*t;
}

function toCubic(p0,p1,p2,p3) {
   var d0 = Math.sqrt(Math.hypot(p1.x-p0.x,p1.y-p0.y)),
       d1 = Math.sqrt(Math.hypot(p2.x-p1.x,p2.y-p1.y)),
       d2 = Math.sqrt(Math.hypot(p3.x-p2.x,p3.y-p2.y));

    // safety check for repeated points
    if (d1 < 1e-4)    d1 = 1.0;
    if (d0 < 1e-4)    d0 = d1;
    if (d2 < 1e-4)    d2 = d1;

   // s. https://de.wikipedia.org/wiki/Kubisch_Hermitescher_Spline
   var tx1 = ((p1.x - p0.x) / d0 - (p2.x - p0.x) / (d0 + d1) + (p2.x - p1.x) / d1),
       tx2 = ((p2.x - p1.x) / d1 - (p3.x - p1.x) / (d1 + d2) + (p3.x - p2.x) / d2),
       ty1 = ((p1.y - p0.y) / d0 - (p2.y - p0.y) / (d0 + d1) + (p2.y - p1.y) / d1),
       ty2 = ((p2.y - p1.y) / d1 - (p3.y - p1.y) / (d1 + d2) + (p3.y - p2.y) / d2);

   return [ { x:p1.x, y:p1.y, dx:tx1, dy:ty1 },
            { x:p2.x, y:p2.y, dx:tx2, dy:ty2 } ];
}

var p0 = {x:0,y:0}, p1 = {x:10,y:10}, p2 = {x:20,y:10}, p3 = {x:30,y:0},
    q = toCubic(p0,p1,p2,p3);
    
console.log(q);
