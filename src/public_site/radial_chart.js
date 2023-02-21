/**
 * Create a radial chart for the given data.
 * @param svg the canvas for chart display.
 * @param data data in the format of [{x: "category", y: value}]
 */
function radialChart(svg, data) {
  const width = svg.attr("width");
  const height = svg.attr("height");
  const margin = 50;
  const outerRadius = Math.min(width, height) / 2 - margin;
  const innerRadius = outerRadius / 3;
  const chart = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // x and y extent and scale 
  const xExtent = new Set(data.map(d => d.x));
  const yExtent = d3.extent(data, d => d.y)
  const xScale = d3.scaleBand().domain(xExtent).range([0, 2 * Math.PI]);
  const yScale = d3.scaleRadial().domain([0, yExtent[1]]).range([innerRadius, outerRadius]);

  // groups for the circular axes on the radial chart
  const axes = chart.selectAll("axis")
    .data(yScale.ticks(5))
    .join("g");

  // circular y axes
  axes.append("circle")
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("opacity", 0.5)
    .attr("r", yScale);

  // white background behind the axis labels
  axes.append("rect")
    .attr("x", -15)
    .attr("y", d => -yScale(d) - 10)
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white");

  // y axis labels on the circular axes
  axes.append("text")
    .attr("y", d => -yScale(d) + 6)
    .attr("text-anchor", "middle")
    .attr("background-color", "blue")
    .text(yScale.tickFormat(5, "s"));

  // y axis label
  chart.append("text")
    .attr("y", -yScale(yExtent[1]) - 20)
    .attr("text-anchor", "middle")
    .text("Number Executed");

  // arc generator for the circular bars
  const arcGenerator = d3.arc()
    .innerRadius(d => yScale(0))
    .outerRadius(d => yScale(d.y))
    .startAngle(d => xScale(d.x) + 0.15)
    .endAngle(d => xScale(d.x) + xScale.bandwidth() - 0.15)
    .padRadius(innerRadius);

  // groups for the bars
  const bars = chart.selectAll("bar")
    .data(data)
    .join("g");

  // bars
  bars.append("path")
    .attr("fill", "blue")
    .attr("opacity", 0.7)
    .attr("d", arcGenerator);

  // x labels above the bars
  bars.append("text")
    .attr("transform", d => `rotate(${(xScale(d.x) + xScale.bandwidth()/2) * 180/Math.PI})`)
    .attr("y", d => -yScale(d.y) - 10)
    .text(d => d.x);
}