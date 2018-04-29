tests.push(
new Test('vec',
`g2().vec({x1: 50, y1: 50, x2:250, y2:100})`),

new Test('dim',
`g2().dim({x1:20,y1:75,x2:200,y2:75})`),

new Test('slider',
`g2().slider({x:150, y:75, w:Math.PI/4, b:64, h:32, fs:"@linkfill"})`),

new Test('spring',
`g2().spring({x:50,y:100, r:100, w: -Math.PI/8})`),

new Test('damper',
`g2().damper({x1:120,y:60, x2: 240, dy: 10})`),

new Test('link',
`let A = {x:50,y:25},B = {x:150,y:25},
     C = {x:50,y:75}, D = {x:100,y:75},
     E = {x:50,y:125};
g2().view({cartesian:true})
    .link({pts:[A,B,E,A,D,C]})`),

new Test('link2',
`let A = {x:50,y:25},B = {x:150,y:25},
    C = {x:50,y:75}, D = {x:100,y:75},
    E = {x:50,y:125};
g2().view({cartesian:true})
    .link2({pts:[A,B,E,A,D,C]})
    .use({grp:"nodfix",...A,scl:1.5})
    .use({grp:"nod",...B,scl:1.5})
    .use({grp:"nod",...C,scl:1.5})
    .use({grp:"nod",...D,scl:1.5})
    .use({grp:"nodflt",...E,w:-Math.PI/2,scl:1.5})`),

new Test('beam',
`NO EXAMPLE PROVIDED`),

new Test('beam2',
`NO EXAMPLE PROVIDED`),

new Test('bar',
`NO EXAMPLE PROVIDED`),

new Test('bar2',
`NO EXAMPLE PROVIDED`),

new Test('pulley',
`g2().view({cartesian:true})
     .pulley({x:150,y:80,r:50})`),

new Test('pulley2',
`g2().view({cartesian:true})
     .pulley2({x:150,y:80,r:50})`),

new Test('rope',
`let A = {x:50,y:30}, B = {x:200,y:75};
g2().view({cartesian:true})
    .pulley({...A,r:20}).pulley2({...B,r:40}).rope({p1:A,r1:20,p2:B,r2:40})`)

)
