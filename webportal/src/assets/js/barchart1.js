// Parse the Data
//d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function(data1) {

d3.csv("assets/csv/studentData.csv", function(data1){

  // colorscheme
  // domain should be [0, max(assignmentsCompleted)]
  var interCool = d3.scaleSequential().domain([0, 10])
    .interpolator(d3.interpolateCool);

  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 30, bottom: 70, left: 50},
  width = 900 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg_bar1 = d3.select("#barchart1_div")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

  console.log(data1);

  // X axis
  var x = d3.scaleBand()
    .range([ 0, 700 ])
    .domain(data1.map(function(d) { return d.Student; }))
    .padding(0.2);
  svg_bar1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "15px");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
    svg_bar1.append("g")
    .call(d3.axisLeft(y));

  // Bars
  svg_bar1.selectAll("mybar1")
    .data(data1)
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.Student); })
      .attr("y", function(d) { return y(d.AssignmentsCompleted); })
      .attr("width", x.bandwidth() - 10)
      .attr("height", function(d) { return height - y(d.AssignmentsCompleted); })
      .attr("fill", function(d) { return interCool(d.AssignmentsCompleted); })
    
  // Add X axis label:
  svg_bar1.append("text")
    .attr("text-anchor", "end")
    .attr("x", width - 450)
    .attr("y", height + margin.top + 40)
    .text("Student");

  svg_bar1.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left+20)
    .attr("x", -margin.top-20)
    .text("# Lessons Completed")

})