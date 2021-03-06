tests.push(
new Test ('g2.mec.js',
    `g2().txt({str:"the following tests are for g2.mec.js",x:50,y:50})`),

new Test('symbols',
`
const label = (str) => ({str, loc:'s', off:15});
g2().view({cartesian:true})
     .pol({x:20,y:75,label:label('pol')})
     .gnd({x:60,y:75,label:label('gnd')})
     .nod({x:100,y:75,label:label('nod')})
     .dblnod({x:140,y:75,label:label('dblnod')})
     .nodfix({x:180,y:75,label:label('nodfix')})
     .nodflt({x:220,y:75,label:label('nodflt')})
     .origin({x:260,y:75,label:label('origin')})`),

new Test('vec',
`g2().vec({x1:50,y1:20,x2:250,y2:120})`),

new Test('avec',
`g2().avec({x: 220, y: 50, r: 30, w: 1, dw: -Math.PI})
     .avec({x: 180, y: 80, w: Math.PI/2, dw: Math.PI, r: 50})
     .lin({x1: 180, x2: 180, y1: 20, y2: 140})
     .avec({x: 65, y: 65, r: 60, w: 1})
     .avec({x: 80, y: 50, r: 70, dw: 1, w:2})
     .lin({x1:80,y1:50,x2:80+Math.cos(3)*75,y2:50+Math.sin(3)*75})
     .lin({x1:80,y1:50,x2:80+Math.cos(2)*75,y2:50+Math.sin(2)*75})`),

new Test('dim',
`g2().dim({x1:20,y1:75,x2:200,y2:75})
     .dim({x1:20,y1:125,x2:200,y2:125,inside:false})`),

new Test('dim2',
`A = {x1: 30, y1:50, x2: 200, y2: 50};
B = {x1: 40, y1: 80, x2: 210, y2: 130};
g2().lin({...A, ls: "red", lw: 2})
    .dim({...A, off: 15})
    .lin({...B, ls: "red", lw: 2})
    .dim({...B, off: 10})`),

new Test('adim',
`g2().adim({x:100,y:70,r:50,w:pi/3,dw:4*pi/3})
     .adim({x:200,y:70,r:50,w:pi/3,dw:-4*pi/3,inside:false})`),

new Test('slider',
`g2().grid().slider({x:150,y:75,w:Math.PI/4,b:64,h:32})`),

new Test('spring',
`g2().spring({x1:50,y1:50,x2:200,y2:25})
     .spring({x1:50,y1:100,x2:200,y2:125,h:32})`),

new Test('damper',
`g2().damper({x1:120,y1:60,x2:240,y2:70})
     .damper({x1:50,y1:100,x2:200,y2:125,h:32})`),

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
    .nodfix({...A,scl:1.2})
    .nod({...B,scl:1.2})
    .nod({...C,scl:1.2})
    .nod({...D,scl:1.2})
    .nodflt({...E,w:-Math.PI/2,scl:1.2})`),

new Test('beam',
`g2().view({cartesian:true})
     .beam({pts:[[200,125],[50,125],[50,50],[200,50]]})`),

new Test('beam2',
`g2().view({cartesian:true})
     .beam2({pts:[[200,125],[50,125],[50,50],[200,50]]})`),

new Test('bar',
`g2().bar({x1:50,y1:20,x2:250,y2:120})`),

new Test('bar2',
`g2().bar2({x1:50,y1:120,x2:250,y2:120})`),

new Test('pulley',
`g2().view({cartesian:true})
     .pulley({x:150,y:80,r:50})`),

new Test('pulley2',
`g2().view({cartesian:true})
     .pulley2({x:150,y:80,r:50})`),

new Test('rope',
`let A = {x:50,y:30}, B = {x:200,y:75};
g2().view({cartesian:true})
    .pulley({...A,r:20}).pulley2({...B,r:40})
    .rope({p1:A,r1:20,p2:B,r2:40})`),

new Test('ground',
`g2().ground({pts:[25,25,25,75,75,75,75,25,125,25],pos:'left'})`),

new Test('load',
`g2().view({cartesian:true})
     .bar({x1:20,y1:50,x2:220,y2:50})
     .load({pts:[20,50,30,140,250,90,220,50],
          lw:1,w:-Math.PI/3,ls:"blue"})`),

new Test('load2',
`g2().view({cartesian:true})
     .load({pts:[10,10,100,10,100,130,200,130,200,60,10,60],spacing:10})`),

new Test('mec',
`let A = {x:50,y:25},B = {x:150,y:25},
    C = {x:50,y:75}, D = {x:100,y:75},
    E = {x:50,y:125};
g2().view({cartesian:true})
    .link2({pts:[A,B,E,A,D,C]})
    .nodfix({...A,scl:1.2})
    .nod({...B,scl:1.2})
    .nod({...C,scl:1.2})
    .nod({...D,scl:1.2})
    .nodflt({...E,w:-Math.PI/2,scl:1.2})
    .ground({pts:[{x:E.x-23,y:E.y+20},{x:A.x-23,y:A.y-18},{x:D.x,y:A.y-18}]})
    .vec({x1:D.x,y1:D.y,x2:D.x+50,y2:D.y,ls:'darkred',lw:2})
    .vec({x1:B.x,y1:B.y,x2:B.x,y2:B.y-20,ls:'darkred',lw:0.5})
    .dim({x1:E.x,y1:E.y+15,x2:D.x,y2:E.y+15,label:'b'})
    .dim({x1:D.x,y1:E.y+15,x2:B.x,y2:E.y+15,label:'b'})
    .dim({x1:B.x+15,y1:E.y,x2:B.x+15,y2:D.y,label:'b'})
    .dim({x1:B.x+15,y1:D.y,x2:B.x+15,y2:B.y,label:'b'})`));
