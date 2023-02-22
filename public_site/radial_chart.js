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
  const innerRadius = outerRadius / 3;
  const chart = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // top 10 data only
  data = data.sort((a, b) => b.t - a.t).slice(0, 10);
  // x and y extent and scale
  const xExtent = new Set(data.map((d) => d.x));
  const yExtent = d3.extent(data, (d) => d.t);
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
    .attr("y", (d) => -yScale(d))
    .attr("text-anchor", "middle")
    .attr("background-color", "blue")
    .text(yScale.tickFormat(5, "s"));

  // y axis label
  chart
    .append("text")
    .attr("y", -yScale(yExtent[1]) - 20)
    .attr("text-anchor", "middle")
    .attr("font-weight", 700)
    .text("Count");

  // chart title
  chart
    .append("text")
    .attr("y", -yScale(yExtent[1]) - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .text(title);

  // arc generator for the circular bars
  const arcGeneratorTotal = d3
    .arc()
    .innerRadius((d) => yScale(0))
    .outerRadius((d) => yScale(d.t))
    .startAngle((d) => xScale(d.x) + 0.15)
    .endAngle((d) => xScale(d.x) + xScale.bandwidth() - 0.15)
    .padRadius(innerRadius);

  // groups for the bars
  const bars = chart.selectAll("bar").data(data).join("g");

  // bars for total perpetrator
  bars
    .append("path")
    .attr("fill", "#7DB9B6")
    .attr("opacity", 0.7)
    .attr("d", arcGeneratorTotal);

  // x labels above the bars
  bars
    .append("text")
    .attr(
      "transform",
      (d) =>
        `rotate(${((xScale(d.x) + xScale.bandwidth() / 2) * 180) / Math.PI})`
    )
    .attr("y", (d) => -yScale(d.t) - 10)
    .attr("text-anchor", "middle")
    .text((d) => d.x);
}

function raceRadialChart(svg, data, title) {
  const width = svg.attr("width");
  const height = svg.attr("height");
  const margin = 50;
  const outerRadius = Math.min(width, height) / 2 - margin;
  const innerRadius = outerRadius / 3;
  const chart = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  // x and y extent and scale
  const xExtent = new Set(data.map((d) => d.x));
  const yExtent = d3.extent(data, (d) => d.m + d.f);
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
    .attr("font-weight", 700)
    .text("Count");

  // chart title
  chart
    .append("text")
    .attr("y", -yScale(yExtent[1]) - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .text(title);

  // arc generator for the circular bars
  const arcGeneratorTotal = d3
    .arc()
    .innerRadius((d) => yScale(d.f))
    .outerRadius((d) => yScale(d.m + d.f))
    .startAngle((d) => xScale(d.x) + 0.15)
    .endAngle((d) => xScale(d.x) + xScale.bandwidth() - 0.15)
    .padRadius(innerRadius);

  const arcGeneratorJuvie = d3
    .arc()
    .innerRadius((d) => yScale(0))
    .outerRadius((d) => yScale(d.f))
    .startAngle((d) => xScale(d.x) + 0.15)
    .endAngle((d) => xScale(d.x) + xScale.bandwidth() - 0.15)
    .padRadius(innerRadius);

  // groups for the bars
  const bars = chart
    .selectAll("bar")
    .data(data)
    .join("g")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout);

  // bars for total perpetrator
  bars
    .append("path")
    .attr("fill", "#7DB9B6")
    .attr("opacity", 0.7)
    .attr("d", arcGeneratorTotal);
  // .on("mouseover", mouseover)
  // .on("mouseout", mouseout);

  // bars for juvie perpetrator
  bars
    .append("path")
    .attr("fill", "red")
    .attr("opacity", 0.7)
    .attr("d", arcGeneratorJuvie);
  // .on("mouseover", mouseover)
  // .on("mouseout", mouseout);

  // x labels above the bars
  bars
    .append("text")
    .attr(
      "transform",
      (d) =>
        `rotate(${((xScale(d.x) + xScale.bandwidth() / 2) * 180) / Math.PI})`
    )
    .attr("y", (d) => -yScale(d.m + d.f) - 10)
    .attr("text-anchor", "middle")
    .text((d) => d.x);

  // info display in the center (for hover over)
  const infoBox = axes.append("g");

  function mouseover() {
    const bar = d3.select(this);
    const d = bar.data()[0];

    infoBox
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .text(d.x);

    infoBox
      .append("text")
      .attr("text-anchor", "middle")
      .text(`male: ${d.m} (${((d.m / (d.m + d.f)) * 100).toFixed(2)}%)`);

    infoBox
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", 15)
      .text(`female: ${d.f} (${((d.f / (d.m + d.f)) * 100).toFixed(2)}%)`);
  }

  function mouseout() {
    infoBox.selectAll("*").remove();
  }
}

function stateRadialChart(svg, data, title) {
  const width = svg.attr("width");
  const height = svg.attr("height");
  const margin = 50;
  const outerRadius = Math.min(width, height) / 2 - margin;
  const innerRadius = outerRadius / 3;
  const chart = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  data = data.sort((a, b) => b.t - a.t).slice(0, 10);
  // x and y extent and scale
  const xExtent = new Set(data.map((d) => d.x));
  const yExtent = d3.extent(data, (d) => d.m + d.f);
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
    .attr("font-weight", 700)
    .text("Count");

  // chart title
  chart
    .append("text")
    .attr("y", -yScale(yExtent[1]) - 50)
    .attr("text-anchor", "middle")
    .attr("font-size", 24)
    .text(title);

  // arc generator for the circular bars
  const arcGeneratorTotal = d3
    .arc()
    .innerRadius((d) => yScale(d.f))
    .outerRadius((d) => yScale(d.m + d.f))
    .startAngle((d) => xScale(d.x) + 0.15)
    .endAngle((d) => xScale(d.x) + xScale.bandwidth() - 0.15)
    .padRadius(innerRadius);

  const arcGeneratorJuvie = d3
    .arc()
    .innerRadius((d) => yScale(0))
    .outerRadius((d) => yScale(d.f))
    .startAngle((d) => xScale(d.x) + 0.15)
    .endAngle((d) => xScale(d.x) + xScale.bandwidth() - 0.15)
    .padRadius(innerRadius);

  // groups for the bars
  const bars = chart.selectAll("bar").data(data).join("g");

  // bars for total perpetrator
  bars
    .append("path")
    .attr("fill", "#7DB9B6")
    .attr("opacity", 0.7)
    .attr("d", arcGeneratorTotal);

  // bars for juvie perpetrator
  bars
    .append("path")
    .attr("fill", "red")
    .attr("opacity", 0.7)
    .attr("d", arcGeneratorJuvie);

  // x labels above the bars
  bars
    .append("text")
    .attr(
      "transform",
      (d) =>
        `rotate(${((xScale(d.x) + xScale.bandwidth() / 2) * 180) / Math.PI})`
    )
    .attr("y", (d) => -yScale(d.m + d.f) - 10)
    .attr("text-anchor", "middle")
    .text((d) => d.x);
}
