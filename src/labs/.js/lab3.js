//read a csv file using d3 
d3.csv("https://tungth.github.io/data/vn-provinces-data.csv")
.then(data => {
    data.forEach(d => {
    d["GRDP-VND"] = +d["GRDP-VND"].replace(',','.');
});
    console.log(data);
    your_draw_chart_function(data);
});

//the function to draw the chart
//hint from teacher:
function your_draw_chart_function(data) {
    console.log(data.length);

    //set the dimensions and margins of the graph
    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
    var width = 300 - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#scatterplot")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //add the scales
    var xScales = d3.scaleLinear()
        xScales.domain(d3.extent(data, d => +d.population))
        xScales.range([0, width]);
    
    var yScales = d3.scaleLinear()
        yScales.domain(d3.extent(data, d => +d["GRDP-VND"]))
        yScales.range([height, 0]);
    
    //add the dots points
    // Define a discrete color scale
    //-d)
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    //- b) Show each data point as a circle with its area proportional to the area of the province.
    // Define a scaling function for circle radius based on the province's area
    var radiusScale = d3.scaleSqrt()
    .domain(d3.extent(data, d => +d.area)) //define the domain based on the area data
    .range([3, 10]); //set the range of circle radii

    svg.selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScales(+d.population))
        .attr("cy", d => yScales(+d["GRDP-VND"]))
        .attr("r", d => radiusScale(+d.area))//-b) use the scaling function to set the radius
        .style("fill", d => colorScale(d.density));//-d)
    
    //-	c) Show axis with name of the axis and ticks for the chart
    //add the x-axis
    //- a)
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScales).tickFormat(d3.format(".2s")));
    
    //-	a) 
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("Population");

    //add the y-axis
    //- a)
    svg.append("g")
        .call(d3.axisLeft(yScales));
    
    //-	a)
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + 20)
        .attr("x", -margin.top)
        .text("GRPD-VND (million VND/person/year)");
}