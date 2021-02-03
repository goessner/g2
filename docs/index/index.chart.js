tests.push(
        new Test('chart',
                `g2().view({cartesian:true})
     .chart({x:40,y:40,b:190,h:90,
            funcs:[{data:[-2,4,2,-1,3,3,4,2],fill:true}],
            title:{text:"chart"},
            xaxis:{title:"x-axis",grid:true,origin:true},
            yaxis:{title:"y-axis"},
    })`),
        new Test('chart2',
                `g2().view({cartesian:true})
.chart({x:40,y:40,b:190,h:90,fs:'black',
funcs:[
        {data:[-2,4,2,-1,3,3,4,2],style:{ls:'violet',lw:3}},
        {fn:Math.sin,dx:Math.PI/20,style:{ls:'green',lw:3}}
],
title:{text:"chart"},
xaxis:{title:"x-axis",origin:true},
yaxis:{title:"y-axis",origin:true},
})`),

        new Test('chart3',
                `g2().view({cartesian:true})
.chart({x:40,y:40,b:190,h:90,fs:'black',
    funcs:[
            {data:[-2,4,2,-1,3,3,4,2],style:{ls:'violet',lw:3,sh:[5,5,5,'rgba(255,0,255,0.7)']}},
            {fn:Math.sin,dx:Math.PI/20,style:{ls:'green',lw:3,sh:[5,5,5,'rgba(0,255,0,0.5)']}}
    ],
    title:{text:"chart"},
    xaxis:{title:"x-axis",origin:true},
    yaxis:{title:"y-axis",origin:true},
})`),
        new Test('chart4',
                `g2().view({cartesian:true})
.chart({x:40,y:40,b:190,h:90,
    funcs:[{data:[-2,4,2,-1,3,3,4,2],fill:true}],
    title:{text:"chart",style:{fs:'blue'}},
    xaxis:{
            title:{text:"x-axis",style:{fs:'#0f0'}},
            grid:true,origin:true,labels:{style:{fs:'#f0f'}}
    },
    yaxis:{title:"y-axis",style:{fs:'rgb(255,0,0)'}},
})`),
        new Test('chart5',
                `g2().view({ cartesian: true })
.chart({
    x: 40, y: 40, b: 190, h: 90,
    funcs: () => [{ data: [-2, 4, 2, -1, 3, 3, 4, 2], fill: true }],
    ymin: 2,
    title: { text: "chart" },
    xaxis: { title: "x-axis", grid: true, origin: true },
    yaxis: { title: "y-axis" },
})`));
