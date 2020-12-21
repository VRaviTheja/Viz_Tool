function scattermat(filename, texttodisplay) {

  d3.select('#dropdownMenu2').text('Scree Plot').style("background-color", "#6c757d");
  d3.select('#dropdownMenu3').text('Scatter Plot').style("background-color", "#6c757d");
  d3.select('#dropdownMenu4').text('MDS Euclidean').style("background-color", "#6c757d");
  d3.select('#dropdownMenu5').text('MDS Correlation').style("background-color", "#6c757d");
  d3.select('#dropdownMenu6').text(texttodisplay).style("background-color", "#343a40");

  d3.selectAll(".mainchart").remove();
  var size = 175, padding = 20;

  var x = d3.scaleLinear()
      .range([padding / 2, size - padding / 2]);

  var y = d3.scaleLinear()
      .range([size - padding / 2, padding / 2]);

  var xAxis = d3.axisBottom()
      .scale(x)
      .ticks(6);

  var yAxis = d3.axisLeft()
      .scale(y)
      .ticks(6);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  d3.csv(filename).then(function(data) {

    var domainByTrait = {},
        traits = d3.keys(data[0]),n = traits.length;

    traits.forEach(function(trait) {
      domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
      //domainByTrait[trait] = d3.extent([-2,2]);
    });

    xAxis.tickSize(size * n);
    yAxis.tickSize(-size * n);

    var svg = d3.select("#myChart").append("svg")
        .attr("class", "mainchart")
        .attr("width", size * n + padding)
        .attr("height", size * n + padding)
      .append("g")
        .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

    svg.selectAll(".x.axis")
        .data(traits)
      .enter().append("g")
        .attr("class", "x axis")
        .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
        .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

    svg.selectAll(".y.axis")
        .data(traits)
      .enter().append("g")
        .attr("class", "y axis")
        .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
        .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

    var cell = svg.selectAll(".cell")
        .data(cross(traits, traits))
      .enter().append("g")
        .attr("class", "cell")
        .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
        .each(plot);

    // Titles for the diagonal.
    cell.filter(function(d) { return d.i === d.j; }).append("text")
        .attr("x", padding)
        .attr("y", padding)
        .attr("dy", ".71em")
        .text(function(d) { return d.x; });

    

    function plot(p) {
      var cell = d3.select(this);

      x.domain(domainByTrait[p.x]);
      y.domain(domainByTrait[p.y]);

      cell.append("rect")
          .attr("class", "frame")
          .attr("x", padding / 2)
          .attr("y", padding / 2)
          .attr("width", size - padding)
          .attr("height", size - padding);

      cell.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("cx", function(d) { return x(d[p.x]); })
          .attr("cy", function(d) { return y(d[p.y]); })
          .attr("r", 4)
          .style("fill", function(d) { return color(d); });
    }

  });

  function cross(a, b) {
    var c = [], n = a.length, m = b.length, i, j;
    for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
    return c;
  }



};