var tessel = require('tessel');

//ambient
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['A']);

//climate
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['B']);

//gps
var gpsLib = require('gps-a2235h');
gpsLib.debug = 0; // switch this to 1 for debug logs, 2 for printing out raw nmea messages
var gps = gpsLib.use(tessel.port['C']); 

ambient.on('ready', function () {
	climate.on('ready', function() {
  		console.log('Connected to si7005');
  		gps.on('ready', function () {
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
    			
    //get ambient data
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
  	//get climate data
  	climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
        temp = (temp - 32)*(5/9);
        console.log('Degrees:', temp.toFixed(4) + 'C', 'Humidity:', humid.toFixed(4) + '%RH');
      });
    });

    //get gps data
    // Emit coordinates when we get a coordinate fix
  	gps.on('coordinates', function (coords) {
    	console.log('Lat:', coords.lat, '\tLon:', coords.lon, '\tTimestamp:', coords.timestamp);
  	});

 	// Emit altitude when we get an altitude fix
  	gps.on('altitude', function (alt) {
    	console.log('Got an altitude of', alt.alt, 'meters (timestamp: ' + alt.timestamp + ')');
  	});

  	// Emitted when we have information about a fix on satellites
  	gps.on('fix', function (data) {
    	console.log(data.numSat, 'fixed.');
  	});

  	gps.on('dropped', function(){
    	// we dropped the gps signal
    	console.log("gps signal dropped");
  	});   			
    var packet = {
    	light = ldata.toFixed(8);
      	sound = sdata.toFixed(8);
      	degrees = temp.tofixed(4);
        humid = humid.toFixed(4);
        lat = coords.lat;
        lot = coords.lon;
        timestamp = coords.timestamp;
        date = new Date();
    }
    feed.postData(JSON.stringify(packet));
    feed.ready = false;
  }
};
feed.init();