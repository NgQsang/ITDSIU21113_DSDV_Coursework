//generate random data (an array of 20 random values)
//using the Math.random() function (https://developer.mozilla.org/enUS/docs/Web/JavaScript/Reference/Global_Objects/Math/random)
//and the Math.floor() function (https://developer.mozilla.org/enUS/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)
//using the Array.from() function (https://developer.mozilla.org/enUS/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
var data = Array.from({ length: 20 }, () => Math.floor(Math.random() * 100));

//set up the dimensions of the chart
var width = 400; 
var height = 300; 

//calculates the width of each bar by dividing the total width (width) by the number of data points (data.length). 
//ensures that the bars are evenly spaced within the chart.
var barWidth = width / data.length;

//create an SVG element within the specified container
//use D3.js to select an HTML container with the ID "bar" and append an SVG element inside it
var svg = d3.select("#bar")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//create a scale for the x-axis (assuming it's ordinal)
var xScale = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([0, width])
  //adds a small gap between the bars.
  .padding(0.05);

//create a scale for the y-axis
var yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  //range to the height of the chart in a top-down manner
  .range([height, 0]);

//create the bars
svg.selectAll("rect")
  .data(data)
  .enter()
  .append("rect")
  .attr("x", (d, i) => xScale(i))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d))
  .attr("fill", d => "rgb(0, 0, " + Math.floor(d * 2.55) + ")"); // Color based on value
// Add value labels above the bars
svg.selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .text(d => d)
  .attr("x", (d, i) => xScale(i) + xScale.bandwidth() / 2)
  .attr("y", d => yScale(d) - 5)
  .attr("text-anchor", "middle")
  .style("fill", "black");