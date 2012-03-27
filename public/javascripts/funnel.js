Funnel = function(elem, options) {
  var self = this;

  this.funnel = document.getElementById(elem);

  this.cx = this.funnel.clientWidth;
  this.cy = this.funnel.clientHeight;

  this.options = options || {};

  this.padding = {
    "top":    this.options.title  ? 50 : 25,
    "right":  25,
    "bottom": 25,
    "left":   25
  };

  this.size = {
    "width":  this.cx - this.padding.left - this.padding.right,
    "height": this.cy - this.padding.top  - this.padding.bottom
  };

  this.data = this.options.data || []

  var m = [25, 25, 25, 25],
    w = 350 - m[1] - m[3],
    h = 250 - m[0] - m[2],
    y1 = 10,
    y2 = (h - (y1 * (self.data.length - 1))) / self.data.length,
    debug = false;

  var svg = d3.select(this.funnel).append("svg:svg")
    .attr("width",  w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("border", "1")
    .append("g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  if (debug) {
    svg.append('svg:polygon')
      .attr('class',  'outline')
      .attr('points', function(d, i) {
        return [
          [ 0,     0 ].join(","),
          [ w / 2, h ].join(","),
          [ w,     0 ].join(",")
        ].join(" ");
      })
      .attr('stroke-width', '1');
  }

  var funnel = svg.append("svg:g").attr("class", "data");

  var chunks = funnel.selectAll("g.chunk")
    .data(self.data);

  var chunk = chunks.enter()
    .append("svg:g")
    .attr("class", "chunk")
    .on("click", function(d) { alert("Navigate to " + d.label + "\\n Count " + d.value);  });

  chunk.append("svg:polygon")
    .attr('fill', function(d) {
      return d.colour;
    })
    .attr('stroke', 'darkblue')
    .attr('points', function(d, i) {

      var b1 = i * (y1 + y2);
      var b2 = (i * (y1 + y2)) + y2;

      var d = function(x) {
        return ((w * x) / (2 * h));
      };

      return [
        [ d(b1),     b1 ].join(","),
        [ w - d(b1), b1 ].join(","),
        [ w - d(b2), b2 ].join(","),
        [ d(b2),     b2 ].join(",")
      ].join(" ");
    })
    .attr('stroke-width', '1');

  chunk.append("svg:text")
    .attr('class', 'label')
    .attr("y", function(d, i) {
      return (i * (y1 + y2)) + (y2 / 2);
    })
    .attr("x", function(d) {
      return w / 2;
    })
    .attr("text-anchor", "middle")
    .attr('stroke', 'darkblue')
    .text(function(d) {
      return d.label;
    });
}
