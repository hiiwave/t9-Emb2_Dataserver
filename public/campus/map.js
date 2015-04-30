var showSpot = function(idx) {
  var drawer = {
    init: function() {
      var reqbody = 
      this.reqData();
    },
    idSet: function() {
      /*
        place     time db_date_order
        明達館       1749  1-20
        總圖後草坪   1800  21-45
        總圖前     1810  46-68
        小木屋鬆餅   1820  68-84
        校門口     1828  85-93
        新體    1840  94-112
        博理館     1922  113-132
        社科院     1930  132-155
      */
      switch (idx) {
        case 0:
          return {idBegin: 1, idEnd: 20}
          break;
        case 1:
          return {idBegin: 21, idEnd: 45}
          break;
        case 2:
          return {idBegin: 46, idEnd: 68}
          break;
        case 3:
          return {idBegin: 68, idEnd: 84}
          break;
        case 4:
          return {idBegin: 85, idEnd: 93}
          break;
        case 5:
          return {idBegin: 94, idEnd: 112}
          break;
        case 6:
          return {idBegin: 113, idEnd: 131}
          break; 
        case 7:
          return {idBegin: 133, idEnd: 155}
          break; 
        default:
          console.error("No such dataset");
      }
    },
    reqData: function() {
      var sendSuccess = function () {
        // console.log('Got response of POST /feed: ' + this.responseText);
        var data = drawer.preConf(JSON.parse(this.responseText));
        drawer.draw(data);
      };
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/reqspot');
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      xhr.onload = sendSuccess;
      xhr.send(JSON.stringify(drawer.idSet())); 
    },
    preConf: function(data) {
      for(var key in data) {
        data[key].date = new Date(data[key].date);
        // console.log(data[key].date);
      };
      return data;
    },
    draw: function(data) {
      console.log("Drawing..");
      var width = 300, height = 300;

      var x = d3.time.scale().range([0, width]);
      var y = d3.scale.linear().range([height, 0]);
      var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(5);
      var yAxis = d3.svg.axis().scale(y).orient("left").ticks(5);
      var dateFormat = d3.time.format('%X');
      var valueline = d3.svg.line()
        .x(function(d) { return x(d.date);  })
        .y(function(d) { return y(d.noise); });
      var svg = d3.select("#spot-data").append('svg')
        .attr('width', width)
        .attr('height', height)
      x.domain(d3.extent(data, function (d) {
        return d.date;
      }));
      y.domain([0, d3.max(data, function (d) {
        return d.noise;
      })])
      svg.append('path').attr('class', 'line')
        .attr('d', valueline(data));
      svg.append('g').attr('class', 'x axis')
        .attr('transform', 'translate(0, ' + height + ')')
        .call(xAxis);
      svg.append('g').attr('class', 'y axis')
        .call(yAxis);
    }
  }
  drawer.init();
};


