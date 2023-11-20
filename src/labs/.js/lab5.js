// rowConverter function to convert data from csv file
var rowConverter = function (d) {
  return {
    "Province/State": String(d["Province/State"]),
    "Country/Region": String(d["Country/Region"]),
    Lat: parseFloat(d['Lat']),
    Long: parseFloat(d["Long"]),
    ["5/4/20"]: String(d["5/4/20"]),
  };
};

// Set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 50, left: 50},
    width = 800 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

// Append the svg 
var svg = d3.select("#scatterplot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Read the data
// Load the data from the provided CSV URL
d3.csv(
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  function (data) {
    // Filter the data for 05/04/2020
    var date = "5/4/20";
    var filteredData = data.filter(function (d) {
      return d[date] !== undefined;
    });

    // Define scales for x and y
    var xScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, function (d) {
          return parseFloat(d["Long"]);
        }),
        d3.max(filteredData, function (d) {
          return parseFloat(d["Long"]);
        }),
      ])
      .range([0, width]);

    var yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, function (d) {
          return parseFloat(d["Lat"]);
        }),
        d3.max(filteredData, function (d) {
          return parseFloat(d["Lat"]);
        }),
      ])
      .range([height, 0]);

    // Define the circle radius scale based on confirmed cases
    var rScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, function (d) {
          return parseFloat(d[date]);
        }),
        d3.max(filteredData, function (d) {
          return parseFloat(d[date]);
        }),
      ])
      .range([5, 50]);

    // Create circles for each data point
    svg
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")
      .attr("cx", function (d) {
        return xScale(parseFloat(d["Long"]));
      })
      .attr("cy", function (d) {
        return yScale(parseFloat(d["Lat"]));
      })
      .attr("r", function (d) {
        return rScale(parseFloat(d[date]));
      })
      .attr("fill", "green")
      .attr("fill-opacity", 0.4);

    //
    svg
      .selectAll("circle")
      .data(filteredData)
      .enter()
      .append("circle")

    // Add x and y axes
    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g").call(yAxis);

    // Add axis labels
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 20)
      .style("text-anchor", "middle");
      //.text("Longitude"); No label

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left)
      .attr("dy", "1em")
      .style("text-anchor", "middle");
      //.text("Latitude"); No label

      //-	Use tooltip to show information related to each country/region 
      //on mouseover event of the representing circle
      // Define the div for the tooltip
      var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Tooltip
      svg.selectAll("circle")
        .on("mouseover", function (d) {
          div.transition()
            .duration(200)
            .style("opacity", 0.9);
          div.html((d["Country/Region"] + d["Province/State"]) + "<br/>Confirmed cases: " + d["5/4/20"] + "<br/>Longitude: " + d.Long + "<br/>Latitude: "+ d.Lat)
            .style("left", (d3.event.pageX + 10) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        });
  }
);