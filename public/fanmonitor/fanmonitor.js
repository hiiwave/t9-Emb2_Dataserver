var socket = io.connect('http://localhost:5000/fanfeed');
// var socket = io.connect('/fanfeed');

socket.on('connect', function () {
  console.log('User connected!');
});

socket.on('date', function(data) {
  $('#date').text(data.date);
});

fanstate = false;

socket.on('newPkt', function(pkt) {
  var str = "temparature: " + pkt.temp.toFixed(2) + '<br>';
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

