//call the correct function already set up for the new svg element in the HTML file
function createHistogram10Bins(svg, inputString) {
  //define the histogram 10 bins
  const bins = ['A-B', 'C-D', 'E-G', 'H-J', 'K-M', 'N-P', 'Q-S', 'T-V', 'W-X', 'Y-Z'];

  //initialize an object to store character counts in each bin
  const binCounts = {};
  for (const bin of bins) {
    binCounts[bin] = 0;
  }

  //process the input string and update bin counts
  inputString = inputString.toUpperCase();
  for (const char of inputString) {
    let charFound = false;
    for (const bin of bins) {
      if (bin === 'Other') {
        binCounts[bin]++;
        charFound = true;
        break;
      } else if (char >= bin[0] && char <= bin[2]) {
        binCounts[bin]++;
        charFound = true;
        break;
      }
    }
    if (!charFound) {
      binCounts['Other']++;
    }
  }

  //create the SVG container for the histogram
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 500 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svgContainer = d3.select(svg);

  //create and append the bars to the SVG
  svgContainer.selectAll("rect")
    .data(Object.entries(binCounts))
    .enter()
    .append("rect")
    .attr("x", (d, i) => i * 50)
    .attr("y", d => height - d[1] * 30)
    .attr("width", 50)
    .attr("height", d => d[1] * 30)
    .attr("fill", "blue")
    .attr("stroke", "black");

  //add labels to the bars
  svgContainer.selectAll("text")
    .data(Object.entries(binCounts))
    .enter()
    .append("text")
    .text(d => d[1])
    .attr("x", (d, i) => i * 50 + 25)
    .attr("y", d => height - d[1] * 10 + 15)
    .attr("text-anchor", "middle")
    .attr("fill", "white");

//calculate the lowest y-coordinate of the bars
const lowestY = d3.min(Object.values(binCounts), d => d) * 10;

//add a line at the bottom
svgContainer.append("line")
  .attr("x1", margin.left)
  .attr("y1", height - lowestY)
  .attr("x2", width + margin.left)
  .attr("y2", height - lowestY)
  .attr("stroke", "black");
}
//get the SVG element and create the histogram
const svg10Bins = document.getElementById('histogram10Bins');
createHistogram10Bins(svg10Bins, "Tung"); // 10 bins
