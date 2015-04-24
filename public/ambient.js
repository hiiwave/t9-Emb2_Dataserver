// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This ambient module example console.logs
ambient light and sound levels and whenever a
specified light or sound level trigger is met.
*********************************************/

var tessel = require('tessel');
var ambientlib = require('ambient-attx4');

var ambient = ambientlib.use(tessel.port['A']);

ambient.on('ready', function () {
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
    ambient.getLightLevel( function(err, ldata) {
      if (err) throw err;
      ambient.getSoundLevel( function(err, sdata) {
        if (err) throw err;
        console.log("Light level:", ldata.toFixed(8), " ", "Sound Level:", sdata.toFixed(8));
      });
    });
    
    ambient.setLightTrigger(0.5);
    // Set a light level trigger
    // The trigger is a float between 0 and 1
    ambient.on('light-trigger', function(data) {
    console.log("Our light trigger was hit:", data);

    // Clear the trigger so it stops firing
    ambient.clearLightTrigger();
    //After 1.5 seconds reset light trigger
    setTimeout(function () {

        ambient.setLightTrigger(0.5);

    },1500);
  });
  // Set a sound level trigger
  // The trigger is a float between 0 and 1
  ambient.setSoundTrigger(0.1);

  ambient.on('sound-trigger', function(data) {
    console.log("Something happened with sound: ", data);

    // Clear it
    ambient.clearSoundTrigger();

    //After 1.5 seconds reset sound trigger
    setTimeout(function () {

        ambient.setSoundTrigger(0.1);

    },1500);

  });

    var packet = {
      light = ldata.toFixed(8);
      sound = sdata.toFixed(8);
    }
    feed.postData(JSON.stringify(packet));
    feed.ready = false;
  }
};
feed.init();
});

ambient.on('error', function (err) {
  console.log(err)
});
