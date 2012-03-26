
var m = [20, 120, 20, 120],
  w = 1280 - m[1] - m[3],
  h = 800 - m[0] - m[2],
  i = 0,
  duration = 500,
  events,
  format = d3.time.format("%m/%d"),
  t0 = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 10)),
  t1 = new Date(),
//  delay = 3000;
//
//var w = 960,
//  h = 500,
/*
  this.x = d3.time.scale()
  .domain([this.options.xmin, this.options.xmax])
  .range([0, this.size.width]);
*/

  x0 = d3.time.scale().domain([t0, t1]).range([0, w]),
  x1 = d3.time.scale().domain([t0, t1]).range([0, w]);

/*
var svg = d3.select("body").append("svg:svg")
  .attr("width", w)
  .attr("height", h);
*/

/*
//redraw();
//setInterval(redraw, delay);

function redraw() {
  x1.domain([t0, t1 = new Date(2010, 0, Math.floor(Math.random() * 21) + 10)]);

  var tick = svg.selectAll("g.tick")
    .data(days(x1.domain()), Number);

  var tickEnter = tick.enter().append("svg:g")
    .attr("class", "tick")
    .attr("transform", function(d) { return "translate(" + x0(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1e-6);

  tickEnter.append("svg:line")
    .attr("y1", -10)
    .style("stroke", "#000")
    .style("stroke-width", "1.5px");

  tickEnter.append("svg:text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .style("font", "10px sans-serif")
    .text(format);

  tickEnter.transition()
    .duration(delay)
    .attr("transform", function(d) { return "translate(" + x1(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1);

  tick.transition()
    .duration(delay)
    .attr("transform", function(d) { return "translate(" + x1(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1);

  tick.exit().transition()
    .duration(delay)
    .attr("transform", function(d) { return "translate(" + x1(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1e-6)
    .remove();

  x0.domain([t0, t1]);
}
 */

function days(domain) {
  var d0 = domain[0],
      d1 = domain[1],
      dz = [];
  d0 += 864e5 - (d0 % 864e5 || 864e5);
  while (d0 <= d1) {
    dz.push(new Date(d0));
    d0 += 864e5;
  }
  return dz;
}


var svg = d3.select("#chart").append("svg:svg")
  .attr("width", w + m[1] + m[3])
  .attr("height", h + m[0] + m[2])
  .append("g")
  .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

d3.json("/events", function(json) {

  events = json;
/*
  root.x0 = h / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
*/
  update(events);
});

function update(events) {

  var now = new Date

//  x1.domain([t0, t1 = new Date(2010, 0, Math.floor(Math.random() * 21) + 10)]);

  var tick = svg.selectAll("g.tick")
    .data(x1.ticks(10))
//    .data(days(x1.domain()), Number);

  var tickEnter = tick.enter().append("svg:g")
    .attr("class", "tick")
    .attr("transform", function(d) { return "translate(" + x0(d) + "," + (h / 2) + ")"; });
//    .style("opacity", 1e-6);

  tickEnter.append("svg:line")
    .attr("y1", -10)
    .style("stroke", "#000")
    .style("stroke-width", "1.5px");

  tickEnter.append("svg:text")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("text-anchor", "middle")
    .style("font", "10px sans-serif")
    .text(format);

/*
  tickEnter.transition()
    .duration(delay)
    .attr("transform", function(d) { return "translate(" + x1(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1);

  tick.transition()
    .duration(delay)
    .attr("transform", function(d) { return "translate(" + x1(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1);

  tick.exit().transition()
    .duration(delay)
    .attr("transform", function(d) { return "translate(" + x1(d) + "," + (h / 2) + ")"; })
    .style("opacity", 1e-6)
    .remove();
*/

  x0.domain([t0, t1]);

  var event = svg.selectAll("g.event")
    .data(events);

  var eventEnter = event.enter().append("svg:g")
    .attr("class", "event")
    .attr("transform", function(d) { return "translate(" + x0(new Date(d.date)) + "," + ((h / 2) - 20) + ")"; });


/*
    .attr("transform", function(d, i) {
//      return "translate(20," + 20 * (i + 1) + ")";
      return "translate(20," + ((now.getTime() - d.date) / (1000 * 60 * 60)) + ")";
    });
*/


/*
  var nodeEnter = node.enter().append("g")
    .attr("class", "node")
    .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
    .on("click", click);
*/

/*
  nodeEnter.append("circle")
    .attr("r", 1e-6)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
*/


/*
  g.append("rect")
    .attr("x", -10)
    .attr("y", function(d, i){
      return 30 * (i + 1);
    })
    .attr("width", 80)
    .attr("height", 20)
    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });
*/
  eventEnter.append("rect")
    /*
    .attr("x", -10)
    .attr("y", ((h / 2) - 20))
    .attr("y", function(d, i){
      return 30 * (i + 1);
    })
*/
    .attr("width", 80)
    .attr("height", 20)
    .style("fill", "lightsteelblue");
//    .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  eventEnter.append("text")
//    .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
    .attr("dy", ".35em")
//    .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
    .attr("text-anchor", "middle")
    .text(function(d) { return d.name; });
//    .style("fill-opacity", 1e-6);

/*
  g.append("text")
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .text(String);
*/

}

$(document).ready(function () {
  var socket = io.connect('http://localhost', {});

/*
  socket.on('news', function(msg){
    $("#client_count").html(msg.clients);
  });

  socket.on('data', function(msg){
//    console.log(msg);
    //$("#change_list").append('<li>' + msg.name + '</li>');
    $('<div class="msg">' + msg + '</div>').prependTo($('#data')).fadeOut(5000);
  });

  socket.on("lead", function(lead) {
    console.log(lead);
//    $("#leads").append('<li>' + lead.first_name + ' ' + lead.last_name + '</li>');
    $('<div class="msg">' + lead.email + '</div>').prependTo($('#leads')).fadeOut(5000);
  });
*/

  socket.on("event", function(event) {
    console.log(event);
  });

/*
  socket.on("file", function(file) {
    console.log(file);
//    $("#files").append('<li>' + file + '</li>');
    $('<div class="msg">' + file + '</div>').prependTo($('#files')).fadeOut(5000);
  });
*/
//  $('#roundabout').roundabout();

});
