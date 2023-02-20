const svg = d3.select("svg#barchart");
const width = svg.attr("width");
const height = svg.attr("height");
const margin = {top: 10, right: 10, bottom: 50, left: 50};
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

let annotations = svg.append("g").attr("id","annotations");
let chartArea = svg.append("g").attr("id","points")
                .attr("transform",`translate(${margin.left},${margin.top})`);



d3.csv("dpic_us_executions_db.csv").then(data => {
console.log(data);
// create scales for x and y axes
// const xScale = d3.scaleBand()
//     .domain(data.map(d => d.Race))
//     .range([0, chartWidth])
//     .padding(0.1);
//     console.log(xScale.domain());

// const yScale = d3.scaleLinear().domain([0,200]).range([chartHeight, 0])
// console.log(yScale.domain());

// let leftAxis = d3.axisLeft(yScale).tickFormat(d3.format('.0%'));
// let bottomAxis = d3.axisBottom(xScale);
// annotations.append("g")
//             .attr("class", "y axis")
//             .attr("transform",`translate(${margin.left-10},${margin.top})`)
//             .call(leftAxis)

// annotations.append("g")
//             .attr("class", "x axis")
//             .attr("transform",`translate(${margin.left},${chartHeight+margin.top})`)
//             .call(bottomAxis)







});