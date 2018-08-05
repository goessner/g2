tests.push(
    new Test('g2.chart.js',
`g2().view({cartesian:true})
     .chart({x:40,y:40,b:190,h:90,
            funcs:[{data:[-2,4,2,-1,3,3,4,2],fill:true}],
            title:{text:"chart"},
            xaxis:{title:"x-axis",grid:true,origin:true},
            yaxis:{title:"y-axis"},
    })`)
)