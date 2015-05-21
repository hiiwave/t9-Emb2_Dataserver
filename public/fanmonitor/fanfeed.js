function PacketGen(temp, state) {
  this.temp = temp;
};
function randU(min, max) {
  return min + (max - min) * Math.random();
};

var feed = {
  init : function() {
    setInterval(function() {
      feed.ready? feed.action():0;
    }, 1500);
  },
  ready : true,
  postData : function(data) {
    var sendSuccess = function () {
      console.log('Got response of POST /feedfan: ' + this.responseText);
      $('#pktCount').html(1 + parseInt($('#pktCount').html()));
      feed.ready = true;
    };
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/feedfan');
    xhr.onload = sendSuccess;
    xhr.send(data); 
  },
  action : function() {
    var tmp1 = randU(30, 32);
    var packet = {
      temp  : tmp1,
      state : tmp1 > 31 
    };
    feed.postData(JSON.stringify(packet));
    feed.ready = false;
  }
};
feed.init();