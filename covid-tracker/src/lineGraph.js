console.log("script started");
// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

fetch("http://localhost:3000/covidgendata?type=state")
  .then(data => data.json())
  .then(data => {

  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return new Date(d.date.value); 
    }))
    .range([ 0, width ]);
  
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.confirmed; })])
    .range([ height, 0 ]);
  
  svg.append("g")
    .call(d3.axisLeft(y));

  //Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .defined(d => !isNaN(d.confirmed))
      .x(function(d) { return x(new Date(d.date.value)) })
      .y(function(d) { return y(d.confirmed) })
    )
  
   // deaths
   svg.append("path")
   .datum(data)
   .attr("fill", "none")
   .attr("stroke", "red")
   .attr("stroke-width", 3)
   .attr("d", d3.line()
     .defined(d => (!isNaN(d.confirmed) || d.confirmed!=0))
     .x(function(d) { return x(new Date(d.date.value)) })
     .y(function(d) { return y(d.deaths) })
   )
})
//console.log(data);
console.log("script ended");