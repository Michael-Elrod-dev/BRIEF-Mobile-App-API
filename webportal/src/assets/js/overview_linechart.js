// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 60, left: 60},
    width = 460 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#linechart_div")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("assets/csv/loginData.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { date : d3.timeParse("%m/%d/%Y")(d.Week), value : d.TotalLogins }
  },

  // Now I can use this dataset:
  function(data) {

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%m/%d")).tickValues(data.map(function(d) {return d.date})))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    

    // Max value observed:
    const max = d3.max(data, function(d) { return +d.value; })

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, max])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Set the gradient
    svg.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", y(0))
      .attr("x2", 0)
      .attr("y2", y(max))
      .selectAll("stop")
        .data([
          {offset: "0%", color: "blue"},
          {offset: "100%", color: "red"}
        ])
      .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "url(#line-gradient)")
      .attr("stroke", "black" )
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(function(d) { return x(d.date) })
        .y0(y(0))
        .y1(function(d) { return y(d.value) })
      )
      
  // Add X axis label:
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 180)
    .attr("y", height + margin.top + 40)
    .text("Week");

  svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top-20)
    .text("# Logins")



})