new TestContainer(
    "core",
    tests = [
        new Test('clr',
            `g2().grid().clr()`),

        new Test('view',
            `g2().view({cartesian:true}).grid().origin()`),

        new Test('view-2',
            `g2().view({x:25,y:30}).grid().origin()`),

        new Test('view-3',
            `g2().view({scl:1.5,x:35,y:40}).grid().origin()`),

        new Test('view-4',
            `g2().view({x:35,y:35}).grid().view({scl:1.5}).origin()`),

        new Test('grid',
            `g2().grid()`),

        new Test('cir',
            `g2().cir({x:40,y:40,r:20,fs:'yellow'})
    .cir({x:120,y:60,r:40,ls:'red'})
    .cir({x:200,y:80,r:30,ld:[1,0,1]})`),

        new Test('cir-2',
            `g2().cir({x:40,y:40,r:20,fs:'yellow',sh:[5,5,5,'rgba(0,0,0,0.5)']})
    .cir({x:120,y:60,r:40,ls:'red',sh:[5,5,5,'rgba(0,0,0,0.7)']})
    .cir({x:200,y:80,r:30,ld:[1,0,1],sh:[5,5,5,'rgba(0,0,0,1)']})`),

        new Test('ell',
            `g2().ell({x:100,y:50,rx:20,ry:40,rot:2,fs:'orange'})
    .ell({x:210,y:50,rx:10,ry:30,w:1,dw:5,ls:'blue'})`),

        new Test('arc',
            `g2().arc({x:90,y:50,r:35,w:1/3*pi,dw:4/3*pi,ls:'blue',lw:5,fs:'#ddd'})
    .arc({x:120,y:50,r:35,w:1/3*pi,dw:-2/3*pi,ls:'blue',lw:5,fs:'#ddd'})`),

        new Test('arc-2',
            `g2().arc({x:90,y:50,r:35,w:1/3*pi,dw:4/3*pi,ls:'green',lw:5,fs:'#ddd',sh:[5,5,5,'rgba(0,0,0,0.5)']})
  .arc({x:120,y:50,r:35,w:1/3*pi,dw:-2/3*pi,ls:'green',lw:5,fs:'#ddd',sh:[5,5,5,'rgba(0,0,0,0.5)']})`),

        new Test('rec',
            `g2().rec({x:60,y:20,b:80,h:40,ls:'red',lw:3,fs:'#ddd'})
    .rec({x:120,y:70,b:80,h:40,ls:'blue',lw:3,fs:'#ddd',sh:[5,5,5,'rgba(0,0,0,0.5)']})`),

        new Test('lin',
            `g2().lin({x1:20,y1:30,x2:180,y2:80,ls:'green',lw:3})
    .lin({x1:30,y1:100,x2:200,y2:120,ls:'orange',lw:3,sh:[5,5,5,'rgba(0,0,0,0.5)']})`),

        new Test('ply',
            `g2().ply({pts:[20,10,60,80,120,30,180,90],ls:'red',lw:3,fs:'#ddd'})`),

        new Test('ply-2',
            `g2().ply({pts:[[20,10],[60,80],[120,30],[180,90]],ls:'red',lw:3,fs:'#ddd',w:0.3})`),

        new Test('ply-3',
            `g2().ply({y:30,pts:[{x:20,y:10},{x:60,y:80},{x:120,y:30},{x:180,y:90}],ls:'red',lw:3,fs:'#ddd',w:-0.3})`),

        new Test('ply-4',
            `g2().ply({pts:[20,10,60,80,120,30,180,90],ls:'red',lw:3})
    .ply({pts:[20,50,60,110,120,60,180,120],ls:'red',lw:3,sh:[5,5,5,'rgba(0,0,0,0.5)']})`),

        new Test('ply-5',
            `g2().ply({pts:[20,10,60,80,120,30,180,90],closed:true,ls:'red',lw:3,fs:'#ddd'})`),

        new Test('txt',
            `g2().txt({str:'Hello',x:30,y:30,w:0,fs:'red',font:'normal 30px serif'})
    .txt({str:'World!',x:120,y:30,w:0,fs:'blue',font:'normal 30px serif',sh:[5,5,5,'rgba(0,0,0,0.5)']})`),

        new Test('txt-2',
            `g2().txt({str:'Hello',x:100,y:50,w:0})
    .txt({str:'Hello',x:100,y:50,w:pi/2})
    .txt({str:'Hello',x:100,y:50,w:pi})
    .txt({str:'Hello',x:100,y:50,w:-pi/2})`),

        new Test('txt-3',
            `g2().grid({color:'#ccc',size:25})
    .txt({str:'LL',x:100,y:25,w:0,tval:'bottom'})
    .txt({str:'ML',x:100,y:50,w:0,tval:'middle'})
    .txt({str:'UL',x:100,y:75,w:0,tval:'top'})`),

        new Test('txt-4',
            `g2().grid({color:'#ccc',size:25})
    .beg({thal:'center'})
    .txt({str:'LL',x:100,y:25,w:0,tval:'bottom'})
    .txt({str:'ML',x:100,y:50,w:0,tval:'middle'})
    .txt({str:'UL',x:100,y:75,w:0,tval:'top'})
    .end()`),

        new Test('txt-5',
            `g2().grid({color:'#ccc',size:25})
    .beg({thal:'right'})
    .txt({str:'LL',x:100,y:25,w:0,tval:'bottom'})
    .txt({str:'ML',x:100,y:50,w:0,tval:'middle'})
    .txt({str:'UL',x:100,y:75,w:0,tval:'top'})
    .end()`),

        new Test('use',
            `g2().ins(() => { symbol = g2()
    .rec({x:-25,y:-25,b:50,h:50,ls:'gray',lw:3,fs:'@fs2'})
    .cir({x:0,y:0,r:20})
    })
    .use({grp:symbol,x:65,y:50,fs:'red',fs2:'green'})
    .use({grp:symbol,x:135,y:50,fs:'blue',fs2:'yellow'})`),

        new Test('use-2',
            `g2().ins(() => {smiley = g2()
    .cir({x:0,y:0,r:5})
    .arc({x:0,y:0,r:3,w:0.5,dw:2})
    .cir({x:-2,y:-1,r:1,fs:'snow'})
    .cir({x:2,y:-1,r:1,fs:'snow'})})
    .use({grp:smiley,x:50,y:50,fs:'yellow',scl:4,lw:1})
    .use({grp:smiley,x:150,y:50,fs:'orange',scl:5,lw:1});`),

        new Test('img',
            `g2().img({uri:'img/atom.png',b:200,h:100})`),

        new Test('img-2',
            `// intended 'file Not Found' error.
g2().img({uri:'unknown.png',x:1,y:1,b:30,h:30})`),

        new Test('img-3',
        `g2().img({uri:'img/flower.jpg'})`),
                
        new Test('img-4',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10})`),

        new Test('img-5',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10, b: 100, h: 50})`),

        new Test('img-6',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10 , b: 100, h: 50, w: 0.5})
        .rec({x: 10, y: 10, b: 100, h: 50})`),

        new Test('img-7',
        `g2().img({uri:'img/flower.jpg', y: 60 , xoff:-10, yoff:-50, b: 100, h: 50})`),

        new Test('img-8',
        `g2().img({uri:'img/flower.jpg', y: 60 , x:10, yoff:-50, b: 100, h: 50, w: 0.5})
    .rec({x: 10, y: 10, b: 100, h: 50})`),

        new Test('img-9',
        `g2().img({uri:'img/flower.jpg', y: 10, x: 10, scl: 0.5})`),
    
        new Test('img-10',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10, b:200, h: 100, sx:10, sy:10})
    .rec({x: 10, y: 10, b: 200, h: 100})`),

        new Test('img-11',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10, b: 200, h: 100, sx: 10, sy: 10, w: 0.5})
    .beg({x: 10, y: 10, w: 0.5})
    .rec({b: 200, h: 100})
    .end()`),

        new Test('img-12',
        `g2().img({uri:'img/flower.jpg', x: 50, y: 50, b:140, h:65, xoff:10, yoff:10})
    .rec({x: 50, y: 50, b: 150, h: 75})`),

        new Test('img-13',
        `g2().img({uri:'img/flower.jpg', x: 50, y: 50, b:140, h:65, xoff: 10, yoff: 10, w:0.5})
    .beg({x:50, y:50, w:0.5})
    .rec({b: 150, h: 75})
    .end()`),

        new Test('img-14',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10, sb: 100, sh: 100, h: 60})`),

        new Test('img-15',
        `g2().img({uri:'img/flower.jpg', x: 10, y: 10, sb: 100, sh: 100, h: 60, w: 0.5})`),

        new Test('img-16',
        `g2().view({cartesian:true})
    .img({uri:'img/flower.jpg'})`),

        new Test('img-17',
        `g2().view({cartesian:true})
    .img({uri:'img/flower.jpg', y: 10, x: 20, scl: 0.5, xoff:50, w:0.4}) `),

        new Test('img-18',
        `g2().view({cartesian:true})
            .img({uri:'img/flower.jpg', x: 10, y: 10, scl:.4})
            .img({uri:'img/flower.jpg', x: 80, y: 50, scl:.4})
            .img({uri:'img/flower.jpg', x: 160, y: 100, scl:.4})`),

        new Test('img-19',
        `g2().view({cartesian:true}) .img({uri:'img/flower.jpg', x: 10, y: 10, sy:50, scl:.4})
    .cir({x:10,y:10,r:5})`),

        new Test('beg',
            `g2().beg({w:0.2,scl:2,ls:'#666',fs:'orange',lw:3,lc:'round',lj:'round'})
    .rec({x:30,y:10,b:30,h:20})
    .cir({x:130,y:20,r:20,fs:'green'})
    .end()`),

        new Test('end',
            `g2().beg({w:0.2,scl:2,ls:'#666',fs:'orange',lw:3,lc:'round',lj:'round'})
    .rec({x:30,y:10,b:30,h:20})
    .end()
    .cir({x:130,y:20,r:20,fs:'green'})`),

        new Test('stroke',
            `g2().p()
    .m({x:25,y:25})
    .q({x1:50,y1:0,x:75,y:25})
    .a({dw:-pi/2,x:75,y:75})
    .c({x1:50,y1:75,x2:50,y2:25,x:25,y:25})
    .z()
    .stroke({ls:'#888',lw:8,lc:'round',lj:'round'})`),

        new Test('fill',
            `g2().p()
    .m({x:25,y:25})
    .q({x1:50,y1:0,x:75,y:25})
    .a({dw:-pi/2,x:75,y:75})
    .c({x1:50,y1:75,x2:50,y2:25,x:25,y:25})
    .z()
    .fill({fs:'green'})`),

        new Test('drw',
            `g2().p()
    .m({x:25,y:25})
    .q({x1:50,y1:0,x:75,y:25})
    .a({dw:-pi/2,x:75,y:75})
    .c({x1:50,y1:75,x2:50,y2:25,x:25,y:25})
    .z()
    .drw({ls:'#888',fs:'green',lw:8,lc:'round',lj:'round'})`),

        new Test('drw-2',
            `g2().drw({d:'M100,10L123.5,82.4L61,37.6'+'L138,37.6L76.5,82.4Z'})`),

        new Test('drw-3',
            `g2().drw({lw:4,ls:'#080',fs:'#0f0',d:'M100,10L123.5,82.4L61,37.6'+'L138,37.6L76.5,82.4Z'})`),

        new Test('del',
            `g2().rec({x:60,y:30,b:80,h:40}).del().cir({x:100,y:50,r:35})`),

        new Test('ins',
`const node = { fill:'lime', g2() {
    return g2().cir({x:160,y:50,r:15,fs:this.fill,lw:4,sh:[8,8,8,"gray"]})}
};
let color = 'red';
g2().cir({x:40,y:50,r:15,fs:color,lw:4,sh:[8,8,8,"gray"]})
    .ins(()=>{color='green'})
    .cir({x:80,y:50,r:15,fs:color,lw:4,sh:[8,8,8,"gray"]})
    .ins((g)=>g.cir({x:120,y:50,r:15,fs:'orange',lw:4,sh:[8,8,8,"gray"]}))
    .ins(node)`)
    ]);
