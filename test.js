const pts = [{x:0,y:0},{x:10,y:10},{x:20,y:10}];

const test = {
    get len() {
        let len_itr = 0;
        let last_pt = {x:0,y:0};
        pts.map(pt => {
            len_itr += Math.hypot(pt.x-last_pt.x, pt.y-last_pt.y);
            last_pt = pt;
        });
        return len_itr;
    }
};

console.log(test.len)