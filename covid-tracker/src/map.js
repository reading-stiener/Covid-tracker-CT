// the svg 
var svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height"); 

// Map and projection
var path = d3.geoPath();

// Data and color scale
var confirmed = d3.map();

var legendScale = d3.scaleLinear()
    .domain([1, 10])
    .rangeRound([600, 860]);

var colorScale = d3.scaleThreshold()
.domain(d3.range(2,10))
.range(d3.schemeBlues[9]);

var g = svg.append("g")
.attr("class", "key")
.attr("transform", "translate(0,40)");

g.selectAll("rect")
.data(colorScale.range().map(function(d) {
    d = colorScale.invertExtent(d);
    if (d[0] == null) d[0] = legendScale.domain()[0];
    if (d[1] == null) d[1] = legendScale.domain()[1];
    return d;
  }))
.enter().append("rect")
  .attr("height", 8)
  .attr("x", function(d) { return legendScale(d[0]); })
  .attr("width", function(d) { return legendScale(d[1]) - legendScale(d[0]); })
  .attr("fill", function(d) { return colorScale(d[0]); });

g.append("text")
.attr("class", "caption")
.attr("x", legendScale.range()[0])
.attr("y", -6)
.attr("fill", "#000")
.attr("text-anchor", "start")
.attr("font-weight", "bold")
.text("Confirmed cases");

g.call(d3.axisBottom(legendScale)
  .tickSize(13)
  .tickFormat(function(x, i) { return i ? x : x + "%"; })
  .tickValues(colorScale.domain()))
.select(".domain")
  .remove();

var promises = [
  d3.json("https://d3js.org/us-10m.v1.json"),
  fetch("http://localhost:3000/covidgendata?type=countyAgg")
    .then(data => data.json())
    .then(data => { confirmed.set(data.fips, data.confirmed); })
]
console.log(promises);
console.log(confirmed);
Promise.all(promises).then(ready)


function ready([us]) { 
  svg.append("g")
  .attr("class", "counties")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.counties).features)
  .enter().append("path")
    .attr("fill", function(d) { return colorScale(d.confirmed = confirmed.get(d.fips)); })
    .attr("d", path)
  .append("title")
    .text(function(d) { return d.confirmed + "%"; });

  svg.append("path")
    .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
    .attr("class", "states")
    .attr("d", path);
}