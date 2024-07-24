// Parse the Data
d3.json("assets/json/studentData.json", function(overview_bar_data){

  // maximum number of lessons completed
  // add 3 (or another constant) to make all bars in the chart visible,
  // otherwise students near the top would be too bright to see against the background
  const max_lc = d3.max(overview_bar_data, function(d) { return +d.lessonsCompleted; }) + 3

  // colorscheme
  var interCool = d3.scaleSequential().domain([0, max_lc])
    .interpolator(d3.interpolateCool);

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 30, bottom: 70, left: 50},
  width = 900 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  // append the svg object to the correct div within the page
  var svg_overview_bar = d3.select("#overview_barchart_div")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3.scaleBand()
    .range([ 0, 850 ]) // 850 fits nicely on the page
    .domain(overview_bar_data.map(function(d) { return d.firstName; }))
    .padding(0.2);
  svg_overview_bar.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "15px");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, max_lc])
    .range([ height, 0]);
    svg_overview_bar.append("g")
    .call(d3.axisLeft(y));

  // Add bars 
  svg_overview_bar.selectAll("mybar1")
    .data(overview_bar_data)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.firstName); })
      .attr("y", function(d) { return y(d.lessonsCompleted); })
      .attr("width", x.bandwidth() - 5) // change the constant for aesthetics
      .attr("height", function(d) { return height - y(d.lessonsCompleted); })
      .attr("fill", function(d) { return interCool(d.lessonsCompleted); })
      .attr("stroke", "black")
   
  // Add X axis label
  // svg_overview_bar.append("text")
  //   .attr("text-anchor", "end")
  //   .attr("x", width - 450)
  //   .attr("y", height + margin.top + 40)
  //   .text("Student")

  // Add Y axis label
  svg_overview_bar.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top-20)
    .text("# Lessons Completed")

})