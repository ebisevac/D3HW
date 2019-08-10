// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartG = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

var xLabel="In Poverty (%):";
var yLabel="Obesity (%)";

function xScale(anyData, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(anyData, d => d[chosenXAxis]) * 0.8,
        d3.max(anyData, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

function chosenY(chosenX){
  if (chosenX === "poverty") {
    var chosenY="obesity";
  }
  else if (chosenX === "age") {
      var chosenY="smokes";
    }
  else {
    var chosenY="healthcare";
  }
  return chosenY
}

function yScale(anyData, chosenXAxis) {
  // create scales
  var chosenYAxis=chosenY(chosenXAxis);
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(anyData,d=>d[chosenYAxis]*0.8),
      d3.max(anyData, d => d[chosenYAxis]*1.2)
    ])
    .range([height,0]);

  return yLinearScale;

}


function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
  
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
  
    return xAxis;
}

function renderYAxes(newYScale, xAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return yAxis;
}

function renderCirclesx(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(500)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

function renderCirclesy(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(500)
    .attr("cy", d => newYScale(d[chosenYAxis]));

  return circlesGroup;
}

function updated3Tip(chosenXAxis, circlesGroup) {

    if (chosenXAxis === "poverty") {
      var labelx = "In Poverty (%):";
      var datay="obesity";
      var labely="Obese (%):";
    }
    else if (chosenXAxis === "age") {
        var labelx = "Age (Median):";
        var datay="smokes";
        var labely="Smokes (%):";
      }
    else {
      var labelx = "Household Income (Median):";
      var datay="healthcare";
      var labely="Lacks Healthcare (%):";
    }
  
    var d3Tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${labely} ${d[datay]}<br>${labelx} ${d[chosenXAxis]}`);
      });
  
    circlesGroup.call(d3Tip).on('mouseover',d3Tip.show).on('mouseout',d3Tip.hide);
 
    return circlesGroup;
  }

d3.csv('data.csv').then(function(censData) {
    console.log(censData);
  
    // parse data
    censData.forEach(function(myData) {
      myData.obesity= +myData.obesity;
      myData.poverty = +myData.poverty;
      myData.smokes = +myData.smokes;
      myData.age = +myData.age;
      myData.healthcare = +myData.healthcare;
      myData.income = +myData.income;
      console.log(myData.poverty)

    });


    var xLinearScale = xScale(censData, chosenXAxis);
    console.log(chosenXAxis)
    console.log(chosenYAxis)
    // Create y scale function
    var yLinearScale = yScale(censData, chosenXAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartG.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    var yAxis = chartG.append("g")
    .classed("y-axis", true)
    .call(leftAxis);
  
    // append y axis

  
    // append initial circles
    var circlesGroup = chartG.selectAll("circle")
      .data(censData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .attr("fill", "#69b3a2")
      .attr("opacity", ".5");

    // Create group for  3 x- axis labels
    var xlabelsG = chartG.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var pLevel = xlabelsG.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "poverty") // value to grab for event listener
      .classed("inactive", true)
      .text("In Poverty (%)");
  
    var aLevel = xlabelsG.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var iLevel = xlabelsG.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "income") // value to grab for event listener
      .classed("active", true)
      .text("Household Income (Median)");

    // append y axis
    var yLabelsG=chartG.append("g");
    // .attr("transform",`translate(-70,${height/2}`);

    var iLevely=chartG.append("g").append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -30)
      .attr("x", -height/2)
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks Healthcare (%)");

    var aLevely=chartG.append("g").append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -50)
      .attr("x", -height/2)
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)");

    var pLevely=chartG.append("g").append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -70)
      .attr("x", -height/2)
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obese (%)");
  
    // update d3Tip function above csv import
    var circlesGroup = updated3Tip(chosenXAxis, circlesGroup);
  
    // x axis labels event listener
    xlabelsG.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
          chosenYAxis=chosenY(chosenXAxis);
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(censData, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis);
          // updates circles with new x values
          circlesGroup = renderCirclesx(circlesGroup, xLinearScale, chosenXAxis);
  
          // updates d3tips with new info
          circlesGroup = updated3Tip(chosenXAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "age") {
            aLevel
              .classed("active", true)
              .classed("inactive", false);
            pLevel
              .classed("active", false)
              .classed("inactive", true);
            iLevel
              .classed("active", false)
              .classed("inactive", true);
            aLevely
              .classed("active", true)
              .classed("inactive", false);
            pLevely
              .classed("active", false)
              .classed("inactive", true);
            iLevely
              .classed("active", false)
              .classed("inactive", true);
          }
          else if (chosenXAxis ==="income"){
            aLevel
              .classed("active", false)
              .classed("inactive", true);
            pLevel
              .classed("active", false)
              .classed("inactive", true);
            iLevel
              .classed("active", true)
              .classed("inactive", false);
            aLevely
              .classed("active", false)
              .classed("inactive", true);
            pLevely
              .classed("active", false)
              .classed("inactive", true);
            iLevely
              .classed("active", true)
              .classed("inactive", false);
          }
          else if (chosenXAxis ==="poverty"){
            aLevel
              .classed("active", false)
              .classed("inactive", true);
            pLevel
              .classed("active", true)
              .classed("inactive", false);
            iLevel
              .classed("active", false)
              .classed("inactive", true);
            aLevely
              .classed("active", false)
              .classed("inactive", true);
            pLevely
              .classed("active", true)
              .classed("inactive", false);
            iLevely
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });

})
