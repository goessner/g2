class Test {
    constructor(name,src,run) {
        this.name = name;
        this.src = src;
        this.run = run;
    }
}
const pi = Math.PI;
const tests = [

    new Test('origin','',
g2().use({grp:'origin',x:80,y:20,scl:1.5,fs:'silver'})
    .use({grp:'origin',x:130,y:50,w:pi/6,ls:'navy',fs:'wheat'})),

    new Test('origin','',
g2().view({cartesian:true})
    .use({grp:'origin',x:80,y:20,scl:1.5,fs:'silver'})
    .use({grp:'origin',x:130,y:50,w:pi/6,ls:'navy',fs:'wheat'})),

    new Test('node symbols','',
g2().view({cartesian:true})
    .use({grp:'nod',x:25,y:75})
    .use({grp:'dblnod',x:25,y:25})
    .use({grp:'nodfix',x:75,y:75})
    .use({grp:'dblnodfix',x:75,y:25})
    .use({grp:'nodlft',x:125,y:75})
    .use({grp:'dblnodflt',x:125,y:25})
    .use({grp:'pol',x:175,y:75})
    .use({grp:'gnd',x:175,y:25})),

    new Test('node symbols scaled','',
g2().view({cartesian:true})
        .use({grp:'nod',x:25,y:75,scl:1.5})
        .use({grp:'dblnod',x:25,y:25,scl:1.5})
        .use({grp:'nodfix',x:75,y:75,scl:1.5})
        .use({grp:'dblnodfix',x:75,y:25,scl:1.5})
        .use({grp:'nodlft',x:125,y:75,scl:1.5})
        .use({grp:'dblnodflt',x:125,y:25,scl:1.5})
        .use({grp:'pol',x:175,y:75,scl:1.5})
        .use({grp:'gnd',x:175,y:25,scl:1.5})),

    new Test('bar','',
g2().view({cartesian:true})
    .txt({str:'i don\'t think this works..:'}))
]