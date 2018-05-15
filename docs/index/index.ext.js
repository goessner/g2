tests.push(
    new Test ('g2.ext.js',
    `//the following tests are for g2.ext.js from
    g2()`),

    new Test('symbols',
    `g2().view({cartesian:true})
         .pol({x:20,y:75}).label({str:'pol',loc:'s',off:25})
         .gnd({x:60,y:75}).label({str:'gnd',loc:'s',off:25})
         .nod({x:100,y:75}).label({str:'nod',loc:'s',off:25})
         .dblnod({x:140,y:75}).label({str:'dblnod',loc:'s',off:25})
         .nodfix({x:180,y:75}).label({str:'nodfix',loc:'s',off:25})
         .nodflt({x:220,y:75}).label({str:'nodflt',loc:'s',off:25})
         .origin({x:260,y:75}).label({str:'origin',loc:'s',off:25})`),
)