var loggedin =  "NO";

var vueinst = new Vue({
    el: '#app',
    data: {
        checkins: false,
        hotspots: false,
        user_log: "",
        user_name: ""
    }
});


// when i tried to do it using normal stuff
function updateMenu(){
	vueinst.user_log = loggedin;
	/*
	if(loggedin == "USER"){
		document.getElementById("user_menu").classList.remove("hide-menu");
		document.getElementById("default_menu").classList.add("hide-menu");
	} else if(loggedin == "VENUE"){
		document.getElementById("venue_menu").classList.remove("hide-menu");
		document.getElementById("default_menu").classList.add("hide-menu");
	} else if(loggedin == "ADMIN"){
		document.getElementById("venue_menu").classList.remove("hide-menu");
		document.getElementById("default_menu").classList.add("hide-menu");
	} else {
		if (!document.getElementById("user_menu").classList.contains("hide-menu")){
			document.getElementById("user_menu").classList.add("hide-menu");
		} else if(!document.getElementById("venue_menu").classList.contains("hide-menu")) {
			document.getElementById("venue_menu").classList.add("hide-menu");
		} else if(!document.getElementById("admin_menu").classList.contains("hide-menu")){
			document.getElementById("admin_menu").classList.add("hide-menu");
		} else {
			document.getElementById("default_menu").classList.remove("hide-menu");
		}
	}*/
}

function loginCheck(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			var login_info = JSON.parse(this.responseText) ;
			vueinst.user_log = login_info.user_type;
			vueinst.user_name = login_info.user_name;
		}
	};

	xhttp.open('GET', '/users/LoginCheck', true) ;
    xhttp.send();
}


mapboxgl.accessToken = 'pk.eyJ1Ijoic29waGllM2xqIiwiYSI6ImNrb2R5YXNoazA2MHMybm80cHVsdzRzY3oifQ.BlVnpNJHCi01_yqgo7ZexA';
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/sophie3lj/ckojqizu24trv18kefcc9vu80', // style URL
    center: [138.599503, -34.921230], // starting position [lng, lat]
    zoom: 10 // starting zoom
});

var checkins_visible = false ;
var hotspots_visible = false ;
var address ;
var checkin_markers = [] ;
var hotspot_markers = [] ;

function addOrRemCheckin(){
    if (!checkins_visible){
        var xhttp = new XMLHttpRequest() ;
        xhttp.onreadystatechange = function() {
            if ( this.readyState == 4 && this.status == 200 ) {
                var checkins = JSON.parse(this.responseText) ;
                var date ;
                var venue ;
                var new_marker;

                for ( let row of checkins){
                    if (row.lat == null){
                        address = row.street_number.toString() + ' ' + row.street_name + ', ' + row.suburb_name + ' ' + row.state + ' ' + row.postcode.toString() ;
                        venue = 'Venue: ' + row.venue_name + ' (' + row.suburb_name + ') ' ;
                        mapboxClient.geocoding.forwardGeocode({
                            query: address,
                            autocomplete: false,
                            limit: 1
                        }).send().then(function (response) {
                            var feature = response.body.features[0];
                            var new_marker;
                            if (row.hotspot == null){
                                new_marker = new mapboxgl.Marker({color: "#8CB89F"}).setLngLat(feature.center).addTo(map);
                            }
                            else{
                                new_marker = new mapboxgl.Marker({color: "orange"}).setLngLat(feature.center).addTo(map);
                            }
                            checkin_markers.push(new_marker) ;
                        });
                    }
                    else{
                        venue = 'Location: lat(' + row.lat.toString() + ') lng(' + row.lng.toString() + ') ' ;
                        if (row.hotspot == null){
                            new_marker = new mapboxgl.Marker({color: "#8CB89F"}).setLngLat([row.lng,row.lat]).addTo(map);
                        }
                        else{
                            new_marker = new mapboxgl.Marker({color: "orange"}).setLngLat([row.lng,row.lat]).addTo(map);
                        }
                        checkin_markers.push(new_marker) ;
                    }

                    date = new Date(row.date_time);

                    if ( 'ADMIN' in row ){
                        if (row.hotspot == null){
                            document.getElementById('addCheckins').innerHTML = document.getElementById('addCheckins').innerHTML + '<div class="checkin"><p>' + venue + '</p><p>User: ' + row.first_name + ' ' + row.last_name + '</p><p>Date: ' + date.toLocaleDateString() + '</p></div>';
                        }
                        else{
                            document.getElementById('addCheckins').innerHTML = document.getElementById('addCheckins').innerHTML + '<div class="checkin"><p>' + venue + '</p><p>User: ' + row.first_name + ' ' + row.last_name + '</p><p>Date: ' + date.toLocaleDateString() + '</p><p><i class="fas fa-exclamation-triangle"></i></p></div>';
                        }
                    }
                    else{
                        if (row.hotspot == null){
                            document.getElementById('addCheckins').innerHTML = document.getElementById('addCheckins').innerHTML + '<div class="checkin"><p>' + venue + '</p><p>Date: ' + date.toLocaleDateString() + '</p></div>';
                        }
                        else{
                            document.getElementById('addCheckins').innerHTML = document.getElementById('addCheckins').innerHTML + '<div class="checkin"><p>' + venue + '</p><p>Date: ' + date.toLocaleDateString() + '</p><p><i class="fas fa-exclamation-triangle"></i></p></div>';
                        }
                    }
                }
            }
        } ;

        xhttp.open('GET', '/mapCheckins', true) ;
        xhttp.send() ;
    }
    else{
        document.getElementById('addCheckins').innerHTML = '' ;
        for ( let marker of checkin_markers){
            marker.remove() ;
        }
        checkin_markers = [] ;
    }

    checkins_visible = !checkins_visible ;
}


function addOrRemHotspot(){
    if (!hotspots_visible){
        var xhttp = new XMLHttpRequest() ;
        xhttp.onreadystatechange = function() {
            if ( this.readyState == 4 && this.status == 200 ) {
                var hotspots = JSON.parse(this.responseText) ;

                for ( let row of hotspots){
                    mapboxClient.geocoding.forwardGeocode({
                        query: row.suburb_name + ' SA Australia',
                        autocomplete: false,
                        limit: 1
                    }).send().then(function (response) {
                        var feature = response.body.features[0];
                        var new_marker = new mapboxgl.Marker({color: "#ff6666"}).setLngLat(feature.center).addTo(map);
                        hotspot_markers.push(new_marker) ;
                    });

                    if ( 'ADMIN' in row ){
                        document.getElementById('addHotspots').innerHTML = document.getElementById('addHotspots').innerHTML + '<div class="checkin"><p>Suburb: ' + row.suburb_name + '</p><button class="pure-button pure-button-primary rounded-button" style="margin-bottom: 1em;" onclick="deleteHotspot('+ row.id +')">Remove</button></div>';
                    }
                    else{
                        document.getElementById('addHotspots').innerHTML = document.getElementById('addHotspots').innerHTML + '<div class="checkin"><p>Suburb: ' + row.suburb_name + '</p></div>';
                    }
                }

                if ( 'ADMIN' in hotspots[0] ){
                    document.getElementById('addHotspots').innerHTML = document.getElementById('addHotspots').innerHTML + '<input style="margin: 1em auto; display: block; width: 90%;" type="text" id="newHotspot" name="newHotspot" placeholder="New Hotspot"/><button class="pure-button pure-button-primary rounded-button" style="margin: 1em auto; display: block;" onclick="createHotspot()">Add</button>' ;
                }
            }
        } ;

        xhttp.open('GET', '/mapHotspots', true) ;
        xhttp.send() ;
    }
    else{
        document.getElementById('addHotspots').innerHTML = '' ;
        for ( let marker of hotspot_markers){
            marker.remove() ;
        }
        hotspot_markers = [] ;
    }

    hotspots_visible = !hotspots_visible ;
}

function deleteHotspot(id){
    let old_hotspot = {
		hotspot_id: id
	};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
            hotspots_visible = true;
            addOrRemHotspot();
            addOrRemHotspot();
             if (checkins_visible){
                 addOrRemCheckin();
                 addOrRemCheckin();
             }
		}
	};

	xhttp.open('POST', '/deleteHotspot', true) ;
	xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(old_hotspot));

}

function createHotspot(){

    let new_hotspot = {
		suburb: document.getElementById('newHotspot').value
	};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
            hotspots_visible = true;
            addOrRemHotspot();
            addOrRemHotspot();
             if (checkins_visible){
                 addOrRemCheckin();
                 addOrRemCheckin();
             }
		}
	};

	xhttp.open('POST', '/createHotspot', true) ;
	xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(new_hotspot));
}

function logout(){

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if ( this.readyState == 4 && this.status == 200 ) {
			window.location.pathname="/";
		}
	};

	xhttp.open('POST', '/users/logout', true) ;
    xhttp.send();
}

