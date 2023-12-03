//set the dimensions and margins of the graph
const width = 800;
const height = 600;

let displayedProvinces = 20;
let data;

//initial sorting criteria
let initialSortingCriteria = "ascending";
let svg;

function rowConverter(d) {
  const gdpVND = parseFloat(d["GRDP-VND"].replace(",", "."));//remove commas, reformat the csv dataset
  return {
    ma: d.ma,
    province: d.province,//convert to a number
    area: +d.area,//...same
    population: +d.population,//...same
    density: +d.density, //...same
    GRDP_VND: gdpVND,
    GRDP_USD: +d["GRDP-USD"],
  };
}

//load dataset(csv file)
d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter)
  .then(function (csvData) {
    data = csvData;

    //updateChart();
    initialize_horizontal_bar();
  })
  .catch(function (error) {
    console.log(error);
  });

//a. function initialize_horizontal_bar(data) {
//setting the width and height of the chart
function initialize_horizontal_bar() {
  svg = d3
    .select("#Horizontal_BarChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("margin-top", "-10px"); //adjust the margin-top to create space below the title
  
  updateChart();
}

//function updateChart() {
function updateChart() {
  const updatedData = data.slice(0, displayedProvinces);//a.
//select the top 20 provinces with the highest GRDP_VND
//const updatedData = data.slice(0, 20);

  //event handler for the combobox
  //hint by teacher
  //sorting the data based on the sorting criteria
  if (initialSortingCriteria === "ascending") {
    updatedData.sort((a, b) => a.GRDP_VND - b.GRDP_VND);
  } else if (initialSortingCriteria === "descending") {
    updatedData.sort((a, b) => b.GRDP_VND - a.GRDP_VND);
  }

  //a. define the scales for the x axis(GRDP_VND values)
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(updatedData, (d) => d.GRDP_VND)])
    .range([0, width - 300]);

  //a. define the scales for the y axis(provinces)
  const yScale = d3
    .scaleBand()
    .domain(updatedData.map((d) => d.province))
    .range([0, height - 50])
    .padding(0.2);

  //clear the svg content before adding new elements
  svg.selectAll("*").remove();

  //create a color scale
  const colorScale = d3
    .scaleSequential(d3.interpolateReds)
    .domain([d3.min(data, (d) => d.GRDP_VND), d3.max(data, (d) => d.GRDP_VND)]);
  const bars = svg.selectAll("rect").data(updatedData);

//a. create a horizontal bar chart
  bars
    .enter()//add enter() to create new bars
    .append("rect")
    
    //.merge(bars)
    .merge(bars)
    .attr("x", 100)
    .attr("y", (d) => yScale(d.province))
    .attr("width", (d) => xScale(d.GRDP_VND))
    .attr("height", yScale.bandwidth())
    .attr("fill", "orange")

    //e.Use transition, duration, on “start”, on “end” 
    //to make animation and highlight for changes in the chart
    .transition()
    .duration(100)
    .on("start", function () {
      d3.select(this).attr("fill", "blue"); //highlight during transition
    })
    .on("end", function (d) {
      d3.select(this).attr("fill", colorScale(d.GRDP_VND)); //fill with color from the scale
    })
    .attr("width", (d) => xScale(d.GRDP_VND));

  //b. add labels on the right for the GRDP_VND values  
  const grpdLabels = svg
  .selectAll(".grpd-label")
  .data(updatedData);

  grpdLabels
    .enter()
    .append("text")
    .merge(grpdLabels)
    .text((d) => d.GRDP_VND)
    .attr("x", 40)
    .attr("y", (d) => yScale(d.province) + yScale.bandwidth() / 2)
    .attr("dy", "0.25em")
    .attr("font-size", "18px");

  //b. add labels on the left for the provinces
  const provinceLabels = svg
  .selectAll(".province-label")
  .data(updatedData);

  provinceLabels
    .enter()
    .append("text")
    .merge(provinceLabels)
    .text((d) => d.province)
    .attr("x", (d) => xScale(d.GRDP_VND) + 105)//setting the x position for labels
    .attr("y", (d) => yScale(d.province) - 2 + yScale.bandwidth() / 2)//setting the y position for labels
    .attr("dy", "0.50em")
    .attr("font-size", "15px");

  //b. create x-axis ticks
  svg
  .append("g")
  .attr("class", "x-axis")
  //add the x-axis at the bottom of the chart
  .attr("transform", "translate(100, 550)")
  .call(d3.axisBottom(xScale).ticks(6).tickFormat(d3.format(".2s")));

  //b. create y-axis ticks
  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(100, 0)")
    .call(d3.axisLeft(yScale).tickFormat(""));

  //add x-axis label
  svg
    .append("text")
    .attr("x", width / 2.25)
    .attr("y", height - 5)//ajust the position of the x-axis label
    .style("text-anchor", "middle")
    .text("GRDP in VND")
    .attr("font-size", "20px");
  
  //add y-axis label
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -2)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Storted by GRDP in VND")
    .attr("font-size", "20px");

  //add the title for the chart
 //svg
    //.append("text")
    //.attr("x", width / 2)
    //.attr("y", 100)
    //.attr("text-anchor", "middle")
    //.attr("font-size", "28px")
    //.text("Horizontal Bar Chart of GRDP in VND by Province");//

}

//c. add an event listener to the "Add Provinces" button
document.getElementById("addProvincesButton").addEventListener("click", () => {
  //check if there are more provinces to display  
  if (displayedProvinces < data.length) {
    displayedProvinces++;//increment the number of displayed provinces
    updateChart();//update the chart with the new data
  }
});

//d. add an event listener to the "Remove Provinces" button
document
  .getElementById("removeProvincesButton")
  .addEventListener("click", () => {
    //...same
    if (displayedProvinces > 1) {
      displayedProvinces--;//decrement the number of displayed provinces
      updateChart();//...same
    }
  });

//f. add an event listener to the "Sorting Criteria" dropdown menu
document
  .getElementById("SortingCriteria")
  .addEventListener("change", function () {
    initialSortingCriteria = this.value; //f. update the sorting criteria
    updateChart(); //f. update the chart with animation
  });