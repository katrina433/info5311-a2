/**
 * Create a radial chart for the given data.
 *
 * @param svg the canvas for chart display.
 * @param data data in the format of INACCURATE -> [{x: category, t: total }]
 */
function radialChart(svg, data, title) {
  const width = svg.attr("width");
  const height = svg.attr("height");
  const margin = 50;
  const outerRadius = Math.min(width, height) / 2 - margin;
  const innerRadius = outerRadius / 2;
  const chart = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // x and y extent and scale
  const xExtent = new Set(data.map((d) => d.x));
  const yExtent = d3.extent(data, (d) =>
    Object.values(d.y).reduce((acc, cur) => acc + cur, 0)
  );
  const xScale = d3
    .scaleBand()
    .domain(xExtent)
    .range([0, 2 * Math.PI]);
  const yScale = d3
    .scaleRadial()
    .domain([0, yExtent[1]])
    .range([innerRadius, outerRadius]);

  // groups for the circular axes on the radial chart
  const axes = chart.selectAll("axis").data(yScale.ticks(5)).join("g");

  // circular y axes
  axes
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", "gray")
    .attr("opacity", 0.5)
    .attr("r", yScale);

  // white background behind the axis labels
  axes
    .append("rect")
    .attr("x", -15)
    .attr("y", (d) => -yScale(d) - 10)
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white");

  // y axis labels on the circular axes
  axes
    .append("text")
    .attr("y", (d) => -yScale(d) + 6)
    .attr("text-anchor", "middle")
    .attr("background-color", "blue")
    .text(yScale.tickFormat(5, "s"));

  // y axis label
  chart
    .append("text")
    .attr("y", -yScale(yExtent[1]) - 20)
    .attr("text-anchor", "middle")
    .text("Count");

  // chart title
  chart
    .append("text")
    .attr("y", -yScale(yExtent[1]) - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .text(title);

  // groups for the bars
  const bars = chart
    .selectAll("bar")
    .data(data)
    .join("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  // Generate bars
  const colors = ["#7DB9B6", "red", "blue", "green", "purple"];
  Object.keys(data[0].y).forEach((label, i) => {
    const calcInnerRadius = (d) =>
      Object.values(d.y)
        .slice(0, i)
        .reduce((acc, cur) => acc + cur, 0);

    const arcGenerator = d3
      .arc()
      .innerRadius((d) => yScale(calcInnerRadius(d)))
      .outerRadius((d) => yScale(calcInnerRadius(d) + d.y[label]))
      .startAngle((d) => xScale(d.x) + 0.15)
      .endAngle((d) => xScale(d.x) + xScale.bandwidth() - 0.15)
      .padRadius(innerRadius);

    bars
      .append("path")
      .attr("fill", colors[i])
      .attr("opacity", 0.7)
      .attr("d", arcGenerator);
  });

  // x labels above the bars
  bars
    .append("text")
    .attr(
      "transform",
      (d) =>
        `rotate(${((xScale(d.x) + xScale.bandwidth() / 2) * 180) / Math.PI})`
    )
    .attr(
      "y",
      (d) => -yScale(Object.values(d.y).reduce((acc, cur) => acc + cur, 0)) - 10
    )
    .attr("text-anchor", "middle")
    .text((d) => d.x);

  // info display in the center (for hover over)
  const infoBox = axes.append("g");

  function mouseover() {
    const bar = d3.select(this);
    const d = bar.data()[0];

    const numCategories = Object.values(d.y).length;
    const totalCount = Object.values(d.y).reduce((acc, cur) => acc + cur, 0);

    infoBox
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -20 * Math.floor((numCategories + 1) / 2))
      .text(d.x);

    Object.entries(d.y).forEach(([label, val], i) => {
      infoBox
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 20 * i - Math.floor((numCategories + 1) / 2))
        .text(`${label}: ${val} (${((val / totalCount) * 100).toFixed(2)}%)`);
    });
  }

  function mouseout() {
    infoBox.selectAll("*").remove();
  }
}
