async function drawLineChart(selector, metric) { 
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
  width = 1500 - margin.left - margin.right,
  height = 800 - margin.top - margin.bottom;

  // setting up stroke colors
  if (metric == 'new_deceased') { 
    var strokeColor = "#ef3b2c";
  } else if (metric == 'new_confirmed') { 
    var strokeColor = "#6baed6"; 
  } else if (metric == 'new_persons_fully_vaccinated') { 
    var strokeColor = "#238b45"; 
  } else { 
    var strokeColor = 'gray'; 
  }

  // append the svg object to the body of the page
  var svg = d3.select(selector)
  .append("svg")
  .attr("id", "svg-line")
  // .attr("width", width + margin.left + margin.right)
  // .attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", "0 0 " + 1500 + " " + 800 )
  .attr("preserveAspectRatio", "xMinYMin")
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  fetch(" https://b6f34df26dd1.ngrok.io/covidgendata?type=state")
  .then(data => data.json())
  .then(data => {
    
    // add x axis
    var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return new Date(d.date.value); 
    }))
    .range([ 0, width ]);
    

    svg.append("g")
    .style("font", "20px times")
    .attr("class", "caption")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
            .tickFormat(d3.timeFormat("%b %y")));

    // Add Y axis
    var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d[metric]; })])
    .range([ height, 0 ]);

    svg.append("g")
    .style("font", "20px times") 
    .call(d3.axisLeft(y));

    //Add the line
    svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", strokeColor)
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .defined(d => (!isNaN(d[metric]) || d[metric]!=0))
      .x(function(d) { return x(new Date(d.date.value)) })
      .y(function(d) { return y(d[metric]) })
    )
  })
}

//drawLineChart("#my_dataviz", 'new_persons_fully_vaccinated');
