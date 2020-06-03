/* ----------------------------------------------------------------------------
File: smashSankey.js
Contructs a Sankey graph of winrates for characters in Super Smash Bros Ultimates using data scraped from https://ssbworld.com/

Credit to Gerardo Furtado for his project "Sankey Diagram with v5" which I heavily refered to when making this graph: https://bl.ocks.org/GerardoFurtado/ff2096ed1aa29bb74fa151a39e9c1387
-----------------------------------------------------------------------------*/
/*eslint-env es6*/
/*eslint-env browser*/
/*eslint no-console: 0*/
/*global d3 */


var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var formatWins = d3.format(",.2f"),
    formatWin = function(d) { return formatWins(d) + " wins"; },
    colorWin = "green";
var formatLosses = d3.format(",.2f"),
    formatLoss = function(d) { return formatLosses(d) + " losses"; },
    colorLoss = "red";

var svg = d3.select("body")
            .append("svg")
                .attr("width",width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = d3.sankeyLinkHorizontal()





