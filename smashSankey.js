/* ----------------------------------------------------------------------------
File: smashSankey.js
Contructs a Sankey graph of winrates for characters in Super Smash Bros Ultimates tournaments

Credit to SSB world for their data which I scraped to make the graph: https://ssbworld.com/characters/win-percentage/

Credit to Gerardo Furtado for his project "Sankey Diagram with v5" which I heavily refered to when making this graph: https://bl.ocks.org/GerardoFurtado/ff2096ed1aa29bb74fa151a39e9c1387

Credit to Tom Shanley for his project which I heavily refered to as well when making this graph: https://blockbuilder.org/tomshanley/60c473ad73a250d5ed467bec3073698b
-----------------------------------------------------------------------------*/
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */

var imagePath = "https://ssbworld.com/images/character-profiles/rounded/"

var genderCase = ['corrin','robin','wii-fit-trainer']

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1100 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

//var formatWins = d3.format(",.2f"),
//    formatWin = function(d) { return formatWins(d) + " wins"; },
//    colorWin = "green";
//var formatLosses = d3.format(",.2f"),
//    formatLoss = function(d) { return formatLosses(d) + " losses"; },
//    colorLoss = "red";

var capitalize = function(d) {if(genderCase.includes(d)){d = d+"-M-"}
                                 return d.charAt(0).toUpperCase() + d.slice(1);}

var svg = d3.select("body")
            .append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height])
    .nodeId(function(d){return d.name});

var path = d3.sankeyLinkHorizontal()






d3.json('sankstats.json').then(function(d){
    var data = sankey(d)
    
    function dragmove (d) {
      d3.select(this).attr('transform','translate(' +
                           d.x0 +',' +
                           (d.y0 = Math.max(0, Math.min(height - d.height, d3.event.y))) +')'
                          )
      d.y = d.y0
      sankey.update(data)
      link.attr('d', d3.sankeyLinkHorizontal())
    }
    
    var drag = d3.drag().on('drag', dragmove)
    
    var link = svg.append('g')
       .selectAll('.link')
       .data(data.links)
       .enter()
       .append('path')
       .attr('class', 'link')
       .attr('d', path)
       .style('opacity', 0.2)
       .style("stroke-width", function(d) { return Math.max(1, d.dy); })
       .sort(function(a, b) { return b.dy - a.dy; });
    
    link.append("title")
        .text(function(d) {
                    return d.source.name + " → " + 
                        d.target.name + ": " + d.value; });

    var node = svg
        .append('g')
        .selectAll('.node')
        .data(data.nodes)
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('transform', function (d) {
          d.x = d.x0
          d.y = d.y0
          return 'translate(' + d.x0 + ',' + d.y0 + ')'
        })
        .call(drag)
//        .on('click', handleNodeClick)
    
    node.append('rect')
        .attr('height', function (d) {
              d.height = d.y1 - d.y0
              return d.height
        })
        .attr('width', sankey.nodeWidth())
        .style('fill', 'black')
    
    node.append("svg:image")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 49)
        .attr("xlink:href", function(d){
            let filename = imagePath + capitalize(d.name) + "-Profile-Round.png"
            return filename
        })
    d3.json('stats.json').then(function(s){
        node.append("title")
            .text(function(d) {
                    return 'Win rate: ' + s[d.source.name]['win rate'] 
                        + "\n Usage: " 
                        + s[d.source.name]['usage']; });
    })
    
//    function handleNodeClick (d) {
//        if (d3.event.defaultPrevented) return
//
//        // Reset colour of nodes to black
//        d3.selectAll('rect').style('fill', 'white')
//
//        d3.selectAll('.link')
//          .style('stroke', 'black')
//          .style('opacity', 0.2)
//
//        // Highlight clicked node
//        d3.selectAll('rect').style('fill', function (d2, i) {
//          return d.name == d2.name ? 'LightCoral' : 'white'
//        })
//
//        iterateLinkedLinksRight(d) // Recurse source direction
//        iterateLinkedLinksLeft(d) // Recurse target direction
//      }
//
//    function iterateLinkedLinksRight (pStartNode) {
//    // Select links that have a given source name
//    d3.selectAll('path.link')
//      .filter(function (pLinkedLink, i) {
//        return pLinkedLink.source.name == pStartNode.name
//      })
//      .style('stroke', 'LightCoral')
//      .style('opacity', 0.6)
//      .each(iterateLinkedNodesRight)
//  }
//  
//  function iterateLinkedNodesRight (pStartLink) {
//    // Select nodes that have a given source name
//    d3.selectAll('rect')
//      .filter(function (pLinkedNode, i) {
//        return pLinkedNode.name == pStartLink.target.name
//      })
//      .style('fill', 'LightCoral')
//      .each(iterateLinkedLinksRight)
//  }
//
//  function iterateLinkedLinksLeft (pStartNode) {
//    // Select links that have a given source name
//    d3.selectAll('path.link')
//      .filter(function (pLinkedLink, i) {
//        return pLinkedLink.target.name == pStartNode.name
//      })
//      .style('stroke', 'LightCoral')
//      .style('opacity', 0.6)
//      .each(iterateLinkedNodesLeft)
//  }
//  
//  function iterateLinkedNodesLeft (pStartLink) {
//    // Select nodes that have a given source name
//    d3.selectAll('rect')
//      .filter(function (pLinkedNode, i) {
//        return pLinkedNode.name == pStartLink.source.name
//      })
//      .style('fill', 'LightCoral')
//      .each(iterateLinkedLinksLeft)
//  }
})
