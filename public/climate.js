// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic climate example logs a stream
of temperature and humidity to the console.
*********************************************/

var tessel = require('tessel');
// if you're using a si7020 replace this lib with climate-si7020
var climatelib = require('climate-si7020');

var climate = climatelib.use(tessel.port['B']);


climate.on('ready', function() {
  console.log('Connected to si7005');
  var feed = {
    init : function() {
      setInterval(function() {
        feed.ready? feed.action():0;
      }, 1500);
    },
    ready : true,
    postData : function(data) {
      var sendSuccess = function () {
        console.log('Got response of POST /feed: ' + this.responseText);
        $('#pktCount').html(1 + parseInt($('#pktCount').html()));
        feed.ready = true;
      };
      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/feed');
      xhr.onload = sendSuccess;
      xhr.send(data); 
    },
    action : function() {
     climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        temp = (temp - 32)*(5/9);
        console.log('Degrees:', temp.toFixed(4) + 'C', 'Humidity:', humid.toFixed(4) + '%RH');
      });
    });
      var packet = {
        degrees = temp.tofixed(4);
        humid = humid.toFixed(4);
      }
      feed.postData(JSON.stringify(packet));
      feed.ready = false;
    }
  };
  feed.init();
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});