/*
 registerKeyboardHandler = function(callback) {
 var callback = callback;
 d3.select(window).on("keydown", callback);
 };
 */

TimeLine = function(chart, options) {
  var self = this;

  this.chart = document.getElementById(chart);
  this.cx = this.chart.clientWidth;
  this.cy = this.chart.clientHeight;
//  this.cx = document.width;
//  this.cy = document.height;

  this.options = options || {};
  this.options.xmax = options.xmax || 30;
  this.options.xmin = options.xmin || 0;
  this.options.ymax = options.ymax || 10;
  this.options.ymin = options.ymin || 0;

  this.options.xeve = options.xeve || 70;
  this.options.yeve = options.yeve || 40;

//  console.log(options);

  this.format = d3.time.format("%d/%m");

  this.padding = {
    "top":    this.options.title  ? 40 : 20,
    "right":                        30,
    "bottom": this.options.xlabel ? 60 : 10,
    "left":   this.options.ylabel ? 70 : 45
  };

  this.size = {
    "width":  this.cx - this.padding.left - this.padding.right,
    "height": this.cy - this.padding.top  - this.padding.bottom
  };

  this.eve = {
    "width"  : this.options.xeve,
    "height" : this.options.yeve,
    "offset" : 10
  }

  /*
   this.x = d3.scale.linear()
   .domain([this.options.xmin, this.options.xmax])
   .range([0, this.size.width]);
   */

  this.x = d3.time.scale()
    .domain([this.options.xmin, this.options.xmax])
    .range([0, this.size.width]);

  this.downx = Math.NaN;

  this.y = d3.scale.linear()
    .domain([this.options.ymax, this.options.ymin])
    .nice()
    .range([0, this.size.height])
    .nice();

  this.downy = Math.NaN;

  this.dragged = this.selected = null;

  this.svg = d3.select(this.chart).append("svg:svg")
    .attr("width",  this.cx)
    .attr("height", this.cy)
    .append("g")
    .attr("transform", "translate(" + this.padding.left + "," + this.padding.top + ")");

  this.plot = this.svg.append("svg:rect")
    .attr("width", this.size.width)
    .attr("height", this.size.height)
//    .style("fill", "#FAFAFA")
    .attr("pointer-events", "all")
    .on("mousedown.drag", self.plot_drag())
    .on("touchstart.drag", self.plot_drag())

  this.plot.call(d3.behavior.zoom().x(this.x).y(this.y).on("zoom", this.redraw()));

  d3.select(this.chart)
    .on("mousemove.drag", self.mousemove())
    .on("touchmove.drag", self.mousemove())
    .on("mouseup.drag",   self.mouseup())
    .on("touchend.drag",  self.mouseup());

  d3.json("/events", function(json) {
    self.events = json;

    self.grouped = d3.nest()
      .key(function(d) { return self.day(d.date); })
      .entries(self.events);

    self.redraw()();
  });

  io.connect('http://localhost', {}).on("event", function(event) {
    self.events.push(event);

    self.grouped = d3.nest()
      .key(function(d) { return self.day(d.date); })
      .entries(self.events);

    self.update();
  });
};

TimeLine.prototype.plot_drag = function() {
  var self = this;
  return function() {
//    registerKeyboardHandler(self.keydown());
    d3.select('body').style("cursor", "move");
    /*
     if (d3.event.altKey) {
     var p = d3.svg.mouse(self.svg.node());
     var newpoint = {};
     newpoint.x = self.x.invert(Math.max(0, Math.min(self.size.width,  p[0])));
     newpoint.y = self.y.invert(Math.max(0, Math.min(self.size.height, p[1])));
     self.points.push(newpoint);
     self.points.sort(function(a, b) {
     if (a.x < b.x) { return -1 };
     if (a.x > b.x) { return  1 };
     return 0
     });
     self.selected = newpoint;
     self.update();
     d3.event.preventDefault();
     d3.event.stopPropagation();
     }
     */
  }
};

/*
 TimeLine.prototype.hours = function(domain) {
 return this.ranges(domain, 1000 * 60 * 60);
 }

 TimeLine.prototype.days = function(domain) {
 return this.ranges(domain, 1000 * 60 * 60 * 24);
 }

 TimeLine.prototype.ranges = function(domain, factor) {
 var d0 = domain[0],
 d1 = domain[1],
 dz = [];

 d0 += factor - (d0 % factor || factor);

 while (d0 <= d1) {
 dz.push(new Date(d0));
 d0 += factor;
 }

 return dz;
 }
 */

TimeLine.prototype.day = function(date) {
  return date + (864e5 - (date % 864e5 || 864e5));
}

TimeLine.prototype.update = function() {
  var self = this;

  var tx = function(d, i) {
    if (d.y) {
      return "translate(" + self.x(new Date(d.date)) + "," + self.y(d.y) + ")";
    } else {
      return "translate(" + self.x(new Date(d.date)) + "," + (self.size.height - (self.eve.offset + ( (self.eve.height +  (self.eve.offset * 2)) *  i) )) + ")";
    }
  };

  var day = self.svg.selectAll("g.day")
    .data(self.grouped, function(d){ return d.key; });

  day.enter()
    .append("svg:g")
    .attr("class", "day");

  var events = day.selectAll("g.event")
    .data(function(d) { return d.values; })
    .attr("transform", tx);

  var event = events.enter()
    .append("svg:g")
    .attr("class", "event")
    .attr("transform", tx)
    .on("mousedown.drag",  self.event_drag())
    .on("touchstart.drag", self.event_drag());

  event.append('svg:polygon')
    .attr('fill',   'lightsteelblue')
    .attr('stroke', 'darkblue')
    .attr('points', function(d, i) {

      var o = self.eve.offset;
      var h = self.eve.height;
      var w = self.eve.width;

      return [
        [ -o,       -(o + h) ].join(","),
        [  w - o,   -(o + h) ].join(","),
        [  w - o,   -o ].join(","),
        [ (o / 2),  -o ].join(","),
        [  0,        0 ].join(","),
        [ -(o / 2), -o ].join(","),
        [ -o,       -o ].join(",")
      ].join(" ");
    })
    .attr('stroke-width', '1');

  event.append('svg:text')
    .attr("class", "name")
    /*
     .attr("y", function(d) {
     return -(self.eve.offset + (self.eve.height / 2 ));
     })
     */
    .attr("x", function(d) {
      return 0; //self.eve.offset;
    })
    .attr("y", function(d) {
      return - self.eve.height;
    })
    .attr("text-anchor", "start")
    .text(function(d) {
      return d.name; //self.format(new Date(d.date));
    });

  event.append('svg:text')
    .attr('class', 'date')
    .attr("x", function(d) {
      return 0; //self.eve.offset;
    })
    .attr("y", function(d) {
      return - (3 * self.eve.offset);
    })
    .attr("text-anchor", "start")
    .text(function(d) {
      return d3.time.format("%X")(new Date(d.date));
    });

  event.append('svg:text')
    .attr('class', 'date')
    .attr("x", function(d) {
      return 0; //self.eve.offset;
    })
    .attr("y", function(d) {
      return - (2 * self.eve.offset);
    })
    .attr("text-anchor", "start")
    .text(function(d) {
      return d3.time.format("%a %b %e %Y")(new Date(d.date));
    });

  events.exit()
    .remove();

  day.exit()
    .remove();

  if (d3.event && d3.event.keyCode) {
    d3.event.preventDefault();
    d3.event.stopPropagation();
  }
}

TimeLine.prototype.mousemove = function() {
  var self = this;
  return function() {
    var p = d3.svg.mouse(self.svg[0][0]),
      t = d3.event.changedTouches;

    if (self.dragged) {
      self.dragged.y = self.y.invert(Math.max(0, Math.min(self.size.height, p[1])));
      self.update();
    };

    if (!isNaN(self.downx)) {
      d3.select('body').style("cursor", "ew-resize");
      var rupx = self.x.invert(p[0]),
        xaxis1 = self.x.domain()[0],
        xaxis2 = self.x.domain()[1],
        xextent = xaxis2 - xaxis1;
      if (rupx != 0) {
        var changex, new_domain;
        changex = self.downx / rupx;
        new_domain = [xaxis1, xaxis1 + (xextent * changex)];
        self.x.domain(new_domain);
        self.redraw()();
      }
      d3.event.preventDefault();
      d3.event.stopPropagation();
    };
    /*
     if (!isNaN(self.downy)) {
     d3.select('body').style("cursor", "ns-resize");
     var rupy = self.y.invert(p[1]),
     yaxis1 = self.y.domain()[1],
     yaxis2 = self.y.domain()[0],
     yextent = yaxis2 - yaxis1;
     if (rupy != 0) {
     var changey, new_domain;
     changey = self.downy / rupy;
     new_domain = [yaxis1 + (yextent * changey), yaxis1];
     self.y.domain(new_domain);
     self.redraw()();
     }
     d3.event.preventDefault();
     d3.event.stopPropagation();
     }
     */
  }
};

TimeLine.prototype.mouseup = function() {
  var self = this;
  return function() {
    document.onselectstart = function() {
      return true;
    };
    d3.select('body').style("cursor", "auto");
    d3.select('body').style("cursor", "auto");
    if (!isNaN(self.downx)) {
      self.redraw()();
      self.downx = Math.NaN;
      d3.event.preventDefault();
      d3.event.stopPropagation();
    };
    if (!isNaN(self.downy)) {
      self.redraw()();
      self.downy = Math.NaN;
      d3.event.preventDefault();
      d3.event.stopPropagation();
    }
    if (self.dragged) {
      self.dragged = null
    }
  }
}

TimeLine.prototype.event_drag = function() {
  var self = this;
  return function(d) {
//    registerKeyboardHandler(self.keydown());
    document.onselectstart = function() { return false; };
    self.selected = self.dragged = d;
    self.update();
  }
};

TimeLine.prototype.keydown = function() {
  var self = this;
  return function() {
    if (!self.selected) return;
    switch (d3.event.keyCode) {
      case 8: // backspace
      case 46: { // delete
        /*
         var i = self.points.indexOf(self.selected);
         self.points.splice(i, 1);
         self.selected = self.points.length ? self.points[i > 0 ? i - 1 : 0] : null;
         self.update();
         */
        break;
      }
    }
  }
};

TimeLine.prototype.redraw = function() {
  var self = this;
  return function() {
    var tx = function(d) {
      return "translate(" + self.x(d) + ",0)";
    },
      ty = function(d) {
        return "translate(0," + self.y(d) + ")";
      },
      stroke = function(d) {
        return "#000000"; //return d ? "#ccc" : "#666";
      };
    /*
     fx = self.x.tickFormat(10),
     fy = self.y.tickFormat(10);
     */

    // Regenerate x-ticks
    var gx = self.svg.selectAll("g.x")
      .data(self.x.ticks(8))
//      .data(self.days(self.x.domain()), Number)
//      .data(self.x.ticks(10), String)
      .attr("transform", tx);

    gx.select("text")
      .text(self.x.tickFormat());
//      .text(self.format);

    var gxe = gx.enter().insert("g", "a")
      .attr("class", "x")
      .attr("transform", tx);

    gxe.append("line")
      .attr("stroke", stroke)
      .attr("y1", self.size.height - 10)
      .attr("y2", self.size.height);

    gxe.append("text")
      .attr("class", "axis")
      .attr("y", self.size.height)
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .text(self.x.tickFormat())
//      .text(self.format)
      .style("cursor", "ew-resize")
      .on("mouseover", function(d) { d3.select(this).style("font-weight", "bold");})
      .on("mouseout",  function(d) { d3.select(this).style("font-weight", "normal");})
      .on("mousedown.drag",  self.xaxis_drag())
      .on("touchstart.drag", self.xaxis_drag());

    gx.exit()
      .remove();
    /*
     // Regenerate y-ticks
     var gy = self.svg.selectAll("g.y")
     .data(self.y.ticks(10), String)
     .attr("transform", ty);

     gy.select("text")
     .text(fy);

     var gye = gy.enter().insert("g", "a")
     .attr("class", "y")
     .attr("transform", ty)
     .attr("background-fill", "#FFEEB6");

     gye.append("line")
     .attr("stroke", stroke)
     .attr("x1", 0)
     .attr("x2", self.size.width);

     gye.append("text")
     .attr("class", "axis")
     .attr("x", -3)
     .attr("dy", ".35em")
     .attr("text-anchor", "end")
     .text(fy)
     .style("cursor", "ns-resize")
     .on("mouseover", function(d) { d3.select(this).style("font-weight", "bold");})
     .on("mouseout",  function(d) { d3.select(this).style("font-weight", "normal");})
     .on("mousedown.drag",  self.yaxis_drag())
     .on("touchstart.drag", self.yaxis_drag());

     gy.exit()
     .remove();
     */

    self.plot.call(d3.behavior.zoom().x(self.x).y(self.y).on("zoom", self.redraw()));

    self.update();
  }
}

TimeLine.prototype.xaxis_drag = function() {
  var self = this;
  return function(d) {
    document.onselectstart = function() { return false; };
    var p = d3.svg.mouse(self.svg[0][0]);
    self.downx = self.x.invert(p[0]);
  }
};

/*
 TimeLine.prototype.yaxis_drag = function(d) {
 var self = this;
 return function(d) {
 document.onselectstart = function() { return false; };
 var p = d3.svg.mouse(self.svg[0][0]);
 self.downy = self.y.invert(p[1]);
 }
 };
 */
