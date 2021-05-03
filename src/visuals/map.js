async function drawMap(selector, metric) {
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

  // the svg 
  var svg = d3.select(selector)
    .append("svg")
    .attr("id", "svg-map")
    .attr("viewBox", "0 0 " + width + " " + height )
    .attr("preserveAspectRatio", "xMinYMin")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)

  // tooltip component
  var tooltip = d3.select(selector).append('div')
  .attr('class', 'hidden tooltip');

  // Map and projection
  var path = d3.geoPath();

  // Data and color scale
  var metricData  = new Map();
  var fipsToCounty = new Map();

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
    d3.json("https://raw.githubusercontent.com/reading-stiener/Covid-tracker-CT/main/public/map_json_files/ct-merge-topo.json", data => console.log(data)),
    fetch("https://b6f34df26dd1.ngrok.io/covidgendata?type=countyAgg")
      .then(data => data.json())
      .then(data => {
        data.forEach(element => {
          metricData.set(element.fips, element[metric]);
          fipsToCounty.set(element.fips, element.county);
        });
      })
  ]
  Promise.all(promises).then(ready)

  function ready([us]) { 
    svg.append('g')
    .attr('class', 'counties')
    .attr('transform', 'translate(200,-200) rotate(25,0,0)')
    .selectAll('.province')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter().append('path')
    .attr('class', d => {
      return 'province ' + d.properties.STATEFP + d.properties.COUNTYFP;
    })
    .attr('fill', function(d) {
        var scaleVal = metricData.get('09' +  d.id) / Math.max(...metricData.values()) * 10;
        return colorScale(d[metric] = scaleVal); 
    })
    .attr('d', path)
    .on('mousemove', d => {
      var mouse = d3.mouse(svg.node()).map(d => {
        return parseInt(d);
      })
      tooltip.classed('hidden', false)
        .attr('style', 'left:' + (mouse[0])
            +'px; top:' +  (mouse[1]) + 'px')
        .attr('border-color', 'black')
          .html(
            '<span>' + fipsToCounty.get('09' +  d.id) + '</span> <br>'+
            '<span>'+ metricData.get('09' +  d.id) + ' '+ metric + '</span>'
          )
    })
    .on('mouseout', () => { 
      tooltip.classed('hidden', true);
    })
  }
}

