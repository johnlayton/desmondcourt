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

  var y1 = this.options.gap || 10,
      y2 = (self.size.height - (y1 * (self.data.length - 1))) / self.data.length;

  var svg = d3.select(this.funnel).append("svg:svg")
    .attr("width",  self.cx)
    .attr("height", self.cy)
    .append("g")
      .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");

  if (this.options.debug) {
    svg.append('svg:polygon')
      .attr('class',  'outline')
      .attr('points', function(d, i) {
        return [
          [ 0,     0 ].join(","),
          [ self.size.width / 2, self.size.height ].join(","),
          [ self.size.width,     0 ].join(",")
        ].join(" ");
      })
      .attr('stroke-width', '1');
  }

  var funnel = svg.append("svg:g")
    .attr("class", "data");

  var chunks = funnel.selectAll("g.chunk")
    .data(self.data);

  var chunk = chunks.enter()
    .append("svg:g")
      .attr("class", "chunk");

  chunk.append("svg:polygon")
    .attr('fill', function(d) {
      return d.colour;
    })
    .attr('stroke', 'darkblue')
    .attr('points', function(d, i) {

      var b1 = i * (y1 + y2);
      var b2 = (i * (y1 + y2)) + y2;

      var d = function(x) {
        return ((self.size.width * x) / (2 * self.size.height));
      };

      return [
        [ d(b1),     b1 ].join(","),
        [ self.size.width - d(b1), b1 ].join(","),
        [ self.size.width - d(b2), b2 ].join(","),
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
      return self.size.width / 2;
    })
    .attr("text-anchor", "middle")
    .attr('stroke', '#335599')
    .text(function(d) {
      return d.label;
    });
}
