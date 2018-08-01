tests.push(
    new Test ('g2.ext.js',
    `g2().txt({str:"the following tests are for g2.ext.js",x:50,y:50})`),

    new Test('label',
    `g2().view({cartesian:true})
         .cir({x:75,y:75,r:50,ld:[6,3]})
         .label({str:"c",loc:"c"})
         .label({str:"n",loc:"n",off:10})
         .label({str:"ne",loc:"ne",off:10})
         .label({str:"e",loc:"e",off:10})
         .label({str:"se",loc:"se",off:10})
         .label({str:"s",loc:"s",off:10})
         .label({str:"sw",loc:"sw",off:10})
         .label({str:"w",loc:"w",off:10})
         .label({str:"nw",loc:"nw",off:10})`),

    new Test('label2',
    `g2().view({cartesian:true})
         .rec({x:50,y:30,b:100,h:75,ld:[6,3]})
         .label({str:"c",loc:"c",border:true})
         .label({str:"n",loc:"n",off:10,border:true})
         .label({str:"ne",loc:"ne",off:10,border:true})
         .label({str:"e",loc:"e",off:10,border:true})
         .label({str:"se",loc:"se",off:10,border:true})
         .label({str:"s",loc:"s",off:10,border:true})
         .label({str:"sw",loc:"sw",off:10,border:true})
         .label({str:"w",loc:"w",off:10,border:true})
         .label({str:"nw",loc:"nw",off:10,border:true})`),

    new Test('label3',
    `g2().view({cartesian:true})
        .pol({x:20,y:75}).label({str:'pol',loc:'s',off:25})
        .gnd({x:60,y:75}).label({str:'gnd',loc:'s',off:25})
        .nod({x:100,y:75}).label({str:'nod',loc:'s',off:25})
        .dblnod({x:140,y:75}).label({str:'dblnod',loc:'s',off:25})
        .nodfix({x:180,y:75}).label({str:'nodfix',loc:'s',off:25})
        .nodflt({x:220,y:75}).label({str:'nodflt',loc:'s',off:25})
        .origin({x:260,y:75}).label({str:'origin',loc:'s',off:25})`),

    new Test('mark',
    `g2().view({cartesian:true})
         .cir({x:75,y:75,r:50,ld:[6,3]})
         .mark({mrk:"dot",loc:["c","n","ne","e","se","s","sw","w","nw"]})`),

    new Test('mark2',
    `g2().view({cartesian:true})
         .rec({x:50,y:30,b:100,h:75,ld:[6,3]})
         .mark({mrk:"dot",loc:["c","n","ne","e","se","s","sw","w","nw"]})`),

    new Test('mark3',
    `g2().view({cartesian:true})
         .ply({pts:[40,40,100,40,100,100,200,100,200,40]})
         .mark({mrk:"dot",loc:["beg",0.25,"mid",0.75,1]})
         .mark({mrk:"tick",loc:[0.1,0.3,0.5,0.7,0.9]})`),
)