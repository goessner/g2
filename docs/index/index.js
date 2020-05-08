class Test {
  constructor(name,src) {
      this.name = name;
      this.src = src;
  }
}
const pi = Math.PI;
const tests = [

new Test('view',
`g2().view({cartesian:true}).grid().origin()`),

new Test('view2',
`g2().view({x:25,y:30}).grid().origin()`),

new Test('view3',
`g2().view({scl:1.5,x:35,y:40}).grid().origin()`),

new Test('view4',
`g2().view({x:35,y:35}).grid().view({scl:1.5}).origin()`),

new Test('del',
`g2().rec({x:60,y:30,b:80,h:40}).del().cir({x:100,y:50,r:35})`),

new Test('lin',
`g2().lin({x1:20,y1:30,x2:180,y2:80,ls:'green',lw:3})`),

new Test('rec',
`g2().rec({x:60,y:30,b:80,h:40,ls:'red',lw:3,fs:'#ddd'})`),

new Test('cir',
`g2().cir({x:100,y:50,r:35})`),

new Test('arc',
`g2().arc({x:90,y:50,r:35,w:1/3*pi,dw:4/3*pi,ls:'blue',lw:5,fs:'#ddd'})
.arc({x:120,y:50,r:35,w:1/3*pi,dw:-2/3*pi,ls:'blue',lw:5,fs:'#ddd'})`),

new Test('ply',
`g2().ply({pts:[20,10,60,80,120,30,180,90],ls:'red',lw:3})`),

new Test('ply2',
`g2().ply({pts:[20,10,60,80,120,30,180,90],ls:'red',lw:3,fs:'#ddd'})`),

new Test('ply3',
`g2().ply({pts:[[20,10],[60,80],[120,30],[180,90]],ls:'red',lw:3,fs:'#ddd'})`),

new Test('ply4',
`g2().ply({pts:[{x:20,y:10},{x:60,y:80},{x:120,y:30},{x:180,y:90}],ls:'red',lw:3,fs:'#ddd'})`),

new Test('ply5',
`g2().ply({pts:[20,10,60,80,120,30,180,90],closed:true,ls:'red',lw:3,fs:'#ddd'})`),

new Test('path',
`g2()
.p()
.m({x:25,y:25})
.q({x1:50,y1:0,x:75,y:25})
.a({dw:-pi/2,x:75,y:75})
.c({x1:50,y1:75,x2:50,y2:25,x:25,y:25})
.z()
.stroke({ls:'#888',lw:8,lc:'round',lj:'round'})`),

new Test('path2',
`g2()
.p()
.m({x:25,y:25})
.q({x1:50,y1:0,x:75,y:25})
.a({dw:-pi/2,x:75,y:75})
.c({x1:50,y1:75,x2:50,y2:25,x:25,y:25})
.z()
.fill({fs:'green'})`),

new Test('path3',
`g2()
.p()
.m({x:25,y:25})
.q({x1:50,y1:0,x:75,y:25})
.a({dw:-pi/2,x:75,y:75})
.c({x1:50,y1:75,x2:50,y2:25,x:25,y:25})
.z()
.drw({ls:'#888',fs:'green',lw:8,
lc:'round',lj:'round'})`),

new Test('path4',
`g2().drw({d:'M100,10L123.5,82.4L61,37.6'+'L138,37.6L76.5,82.4Z'})`),

new Test('path5',
`g2().drw({lw:4,ls:'#080',fs:'#0f0',d:'M100,10L123.5,82.4L61,37.6'+'L138,37.6L76.5,82.4Z'})`),

new Test('spline',
`g2().spline({pts:[50,40,150,60,150,60],closed:false,lw:4,ls:'#080'})`),

new Test('spline2',
`g2().spline({pts:[50,20,50,80,150,20],closed:false,lw:4,ls:'#080'})`),

new Test('spline3',
`g2().spline({pts:[50,30,150,20,150,80,50,70],closed:true,lw:4,ls:'#080',fs:'orange'})`),

new Test('txt',
`g2().txt({str:'Hello',x:30,y:30,w:0,fs:'red',font:'normal 30px serif'})`),

new Test('txt2',
`g2().txt({str:'Hello',x:100,y:50,w:0})
.txt({str:'Hello',x:100,y:50,w:pi/2})
.txt({str:'Hello',x:100,y:50,w:pi})
.txt({str:'Hello',x:100,y:50,w:-pi/2})`),

new Test('txt3',
`g2().grid({color:'#ccc',size:25})
.txt({str:'LL',x:100,y:25,w:0,tval:'bottom'})
.txt({str:'ML',x:100,y:50,w:0,tval:'middle'})
.txt({str:'UL',x:100,y:75,w:0,tval:'top'})`),

new Test('txt4',
`g2().grid({color:'#ccc',size:25})
.beg({thal:'center'})
.txt({str:'LL',x:100,y:25,w:0,tval:'bottom'})
.txt({str:'ML',x:100,y:50,w:0,tval:'middle'})
.txt({str:'UL',x:100,y:75,w:0,tval:'top'})
.end()`),

new Test('txt5',
`g2().grid({color:'#ccc',size:25})
.beg({thal:'right'})
.txt({str:'LL',x:100,y:25,w:0,tval:'bottom'})
.txt({str:'ML',x:100,y:50,w:0,tval:'middle'})
.txt({str:'UL',x:100,y:75,w:0,tval:'top'})
.end()`),

new Test('img',
`g2().img({uri:'../docs/img/atom.png',b:200,h:100})`),

new Test('img2',
`// intended 'file Not Found' error.
g2().img({uri:'unknown.png',x:1,y:1,b:30,h:30})`),

new Test('img3',
`g2().img({uri:'img/imageTst.png'})`),
        
new Test('img4',
`g2().img({uri:'img/imageTst.png', x: 10, y: 10})`),

new Test('img5',
`g2().img({uri:'img/imageTst.png', x: 10, y: 10, b: 100, h: 50})`),

new Test('img6',
`g2().img({uri:'img/imageTst.png', x: 10, y: 10 , b: 100, h: 50, w: 0.5})
  .rec({x: 10, y: 10, b: 100, h: 50})`),

new Test('img7',
`g2()
  .img({uri:'img/imageTst.png', x: 10, yoff: -50, y: 60, b: 100, h: 50, w: 0.5})
  .rec({x: 10, y: 10, b: 100, h: 50})`),

new Test('img8',
`g2().img({uri:'img/imageTst.png', y: 10, x: 10, scl: 0.5})`),

new Test('img9',
`g2().img({uri:'img/imageTst.png', x: 10, y: 10, dx: 100, dy: 100, h: 60})`),

new Test('img10',
`g2().view({cartesian:true})
  .img({uri:'img/imageTst.png'})`),

new Test('img11',
`g2().view({cartesian:true})
  .img({uri:'img/imageTst.png', x: 10, y: 10, scl:.4})
  .img({uri:'img/imageTst.png', x: 80, y: 50, scl:.4})
  .img({uri:'img/imageTst.png', x: 160, y: 100, scl:.4})`),

new Test('img12',
`g2().img({uri:'img/imageTst.png', x: 10, y: 10, b: 200, h: 100, sx: 10, sy: 10, w: 0.5})
    .beg({x: 10, y: 10, w: 0.5})
    .rec({b: 200, h: 100})
    .end()`),

new Test('img13',
`g2().img({uri:'img/imageTst.png', x: 50, y: 50, b:140, h:65, xoff: 10, yoff: 10, w:0.5})
    .beg({x:50, y:50, w:0.5})
    .rec({b: 150, h: 75})
    .end()`),

new Test('beg-end',
`g2().beg({x:70,y:30,w:0.2,scl:2,ls:'#666',fs:'orange',lw:3,lc:'round',lj:'round'})
.rec({x:0,y:0,b:30,h:20}).end()`),

new Test('use',
`g2()
.ins(() =>{ symbol = g2()
.rec({x:-25,y:-25,b:50,h:50,ls:'gray',lw:3,fs:'@fs2'})
.cir({x:0,y:0,r:20})})
.use({grp:symbol,x:65,y:50,fs:'red',fs2:'green'})
.use({grp:symbol,x:135,y:50,fs:'blue',fs2:'yellow'})`),

new Test('use2',
`g2().ins(() => {smiley = g2()
.cir({x:0,y:0,r:5})
.arc({x:0,y:0,r:3,w:0.5,dw:2})
.cir({x:-2,y:-1,r:1,fs:'snow'})
.cir({x:2,y:-1,r:1,fs:'snow'})})
.use({grp:smiley,x:50,y:50,fs:'yellow',scl:4,lw:1})
.use({grp:smiley,x:150,y:50,fs:'orange',scl:5,lw:1});`),

new Test('shadow',
`g2().beg({lw:3,ls:'#456',fs:'yellow',ld:[8, 4, 2, 4], sh:[5,5,5,'rgba(0,0,0,0.7)']})
.rec({x:30,y:40,b:50,h:20})
.cir({x:140,y:50,r:40})`),

new Test('grid',
`g2().grid()`),
];
