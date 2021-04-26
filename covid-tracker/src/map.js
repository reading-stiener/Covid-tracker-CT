function drawMap(selector) {
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

  // the svg 
  var svg = d3.select(selector)
    // Container class to make it responsive.
    .classed("svg-container", true) 
    .append("svg")
    // Responsive SVG needs these 2 attributes and no width and height attr.
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 1000 960")
    // Class to make it responsive.
    .classed("svg-content-responsive", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

  // Map and projection
  var path = d3.geoPath();

  // Data and color scale
  var confirmed = new Map();

  var legendScale = d3.scaleLinear()
      .domain([1, 10])
      .rangeRound([100, 500]);

  var colorScale = d3.scaleThreshold()
  .domain(d3.range(2, 10))
  .range(d3.schemeBlues[9]);

  var g = svg.append("g")
  .attr("class", "key")
  .attr("transform", "translate(-100,0)");

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
    d3.json("ct-merge-topo.json", data => console.log(data)),
    fetch("http://localhost:3000/covidgendata?type=countyAgg")
      .then(data => data.json())
      .then(data => {
        data.forEach(element => {
          confirmed.set(element.fips, element.new_confirmed); 
        });
      })
  ]
  Promise.all(promises).then(ready)

  function ready([us]) { 
    svg.append("g")
    .attr("class", "counties")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append("path")
      .attr("fill", function(d) {
        var scaleVal = confirmed.get("09" +  d.id) / Math.max(...confirmed.values()) * 10;
        return colorScale(d.confirmed = scaleVal); 
      })
      .attr("d", path)
      .append("title")
      .text(function(d) { return d.confirmed + "%"; });
  }
}



drawMap("#map_viz");