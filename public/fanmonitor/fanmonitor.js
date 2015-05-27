// var socket = io.connect('http://localhost:5000/fanfeed');  // for local testing
var socket = io.connect('/fanfeed');  // for publishing
var drawer, bindSocketEvents;

$(document).ready(function() {
  bindSocketEvents();
});

bindSocketEvents = function() {
  socket.on('connect', function () {
    console.log('User connected!');
  });

  socket.on('date', function(data) {
    $('#date').text(data.date);
  });

  fanstate = false;

  var first_time = true;
  socket.on('newPkt', function(pkt) {
    var str = "temparature: " + pkt.temp.toFixed(2) + '<br>' + "threshold: " + pkt.threshold.toFixed(2) + '<br>';
    drawer.threshold = pkt.threshold;

    if (first_time) {
      drawer.init(pkt);
      first_time = false;  
    } else {
      drawer.update(pkt);  
    }
    $('#newData').html(str);
    $('#countData').html(1 + parseInt($('#countData').html()));
    if (pkt.state && !fanstate) {
      $('#fanImg').attr('src', '/image/fan_animated.gif');
      fanstate = true;
    } else if (!pkt.state && fanstate) {
      $('#fanImg').attr('src', '/image/fan_static.png');
      fanstate = false;
    }
  });
};

  
drawer = {
  init: function(pkt) {
    pkt.myx = 0;
    var initPkt = pkt;
    this.datanow = [initPkt];
    this.firstDraw(drawer.datanow);
  },
  datanow: undefined,
  svgUpdator: undefined,
  threshold: undefined,
  update: function(pkt) {
    pkt.myx = 0;
    for (var i = 0, len = drawer.datanow.length; i < len; ++i) {
      drawer.datanow[i].myx += 1;
    }
    drawer.datanow.unshift(pkt);
    drawer.datanow = drawer.datanow.slice(0, 20);
    drawer.svgUpdator();
  },
  firstDraw: function(data) {
    console.log("Drawing..");
    var margin = {top: 30, right: 20, bottom: 30, left: 50};
    var width = 400 - margin.left - margin.right;
    var height = 270 - margin.top - margin.bottom;

    var xScale = d3.scale.linear()
      .range([0, width])
      .domain([0, 20]);
    var yScale = d3.scale.linear()
      .range([height, 0])
      .domain([20, 40]);
      // .domain([0, d3.max(data, function (d) { return d[drawer.dtype]; })]);
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(0);
    var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(5);
    
    var valueline = d3.svg.line()
      .x(function(d) { return xScale(d.myx);  })
      .y(function(d) { return yScale(d.temp); });
    var svg = d3.select("#temp-figure").append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g').attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // var innerG = svg.append('g');
    svg.append('path').attr('class', 'line').attr('id', 'data')
      .attr('d', valueline(data));
    svg.append('path').attr('class', 'line').attr('id', 'threshold')
      .attr('d', valueline([{myx : 0, temp : 31}, {myx : 20, temp : 31}]))

    svg.append('g').attr('class', 'x axis')
      .attr('transform', 'translate(0, ' + height + ')')
      .call(xAxis);
    svg.append('g').attr('class', 'y axis')
      .call(yAxis);

    drawer.svgUpdator = function() {
      var svg = d3.select("#temp-figure").transition();
      svg.select('path#data').duration(0).attr('d', valueline(drawer.datanow));
    };
  }
};
 

  




