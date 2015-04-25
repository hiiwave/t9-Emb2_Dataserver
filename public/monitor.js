var socket = io.connect();

socket.on('connect', function () {
  console.log('User connected!');
});

socket.on('date', function(data) {
  $('#date').text(data.date);
});

socket.on('newPkt', function(pkt) {
  var str = pkt.date + '<br>' + pkt.noise + '<br>' + pkt.temparature + '<br>' + pkt.humidity + '<br>' + pkt.lat + '<br>' + pkt.lng;
  $('#newData').html(str);
  $('#countData').html(1 + parseInt($('#countData').html()));
});

socket.on('newImg', function(imgpkt) {
	var b64raw = imgpkt.raw;
	var imgsrc = 'data:' + imgpkt.contentType + ';base64,' + b64raw;
	$('#newImg').attr('src', imgsrc);
	// var outputImg = document.createElement('img');
	// outputImg.src = 'data:' + imgpkt.contentType + ';base64,' + b64raw;
	// document.body.appendChild(outputImg);
})

socket.on('countDb', function(count) {
  $('#countData').html(count);
});

socket.on('historyPkt', function(pkt) {  
  var str = pkt.date + '<br>' + pkt.noise + '<br>' + pkt.temparature + '<br>' + pkt.humidity + '<br>' + pkt.lat + '<br>' + pkt.lng;
  $('#newData').html(str);
  console.log("History data got: " + str);
});