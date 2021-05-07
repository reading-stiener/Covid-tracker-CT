async function drawMap(selector, metric) {
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 960 - margin.top - margin.bottom;

  // Data maps
  var metricData  = new Map();
  var fipsToCounty = new Map();

  // setting up color scheme for maps 
  if (metric == 'new_deceased') { 
    var colorScheme = d3.schemeReds;
  } else if (metric == 'new_confirmed') { 
    var colorScheme = d3.schemeBlues; 
  } else if (metric == 'new_persons_fully_vaccinated') { 
    var colorScheme = d3.schemeGreens; 
  } else { 
    var colorScheme = d3.schemeGreys; 
  }

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
    .attr('class', 'tooltip');

    // Map and projection
    var path = d3.geoPath();

    var legendScale = d3.scaleLinear()
        .domain([1, 10])
        .rangeRound([100, 500]);

    var colorScale = d3.scaleThreshold()
    .domain(d3.range(2, 10))
    .range(colorScheme[9]);

    var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(-80,50)");

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
      .attr("y", -20)
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .attr("font-weight", "bold")
      .text(metric);

    console.log(legendScale.domain());
    console.log(legendScale.range())

    g.call(d3.axisBottom(legendScale)
      .tickSize(13)
      .tickFormat(function(x, i) {
        var maxData = Math.max(...metricData.values());
        if (maxData > 10000) { 
          return i ? Math.round(x / 9000 * maxData) : Math.round(x / 9000 * maxData) + "k"; 
        } else { 
          return Math.round(x / 9 * maxData)
        }
      })
        
      .tickValues(colorScale.domain()))
      .select(".domain")
      .remove();

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
    .on('mouseover', d => {
      tooltip
        .style('left', (d3.event.pageX - 100)+'px')
        .style('top', (d3.event.pageY - 50)+'px')
        .style('display', 'block')
        .html(
          '<span>' + fipsToCounty.get('09' +  d.id) + '</span> <br>'+
          '<span>'+ metricData.get('09' +  d.id) + ' '+ metric + '</span>'
        )
    })
    // .on('mouseout', d => { 
    //   tooltip.attr('class', 'tooltip')
    //     .style('display', 'none');
    // })
  }
}

