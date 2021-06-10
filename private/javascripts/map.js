var vueinst = new Vue({
    el: '#app',
    data: {
        checkins: false,
        hotspots: false,
        loggedin: false
    }
});


function loggedIn(){
    vueinst.loggedin = true;
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

                for ( let row of checkins){
                    address = row.street_number.toString() + ' ' + row.street_name + ', ' + row.suburb_name + ' ' + row.state + ' ' + row.postcode.toString() ;
                    mapboxClient.geocoding.forwardGeocode({
                        query: address,
                        autocomplete: false,
                        limit: 1
                    }).send().then(function (response) {
                        var feature = response.body.features[0];
                        if (row.hotspot == null){
                            var new_marker = new mapboxgl.Marker({color: "#8CB89F"}).setLngLat(feature.center).addTo(map);
                        }
                        else{
                            var new_marker = new mapboxgl.Marker({color: "orange"}).setLngLat(feature.center).addTo(map);
                        }
                        checkin_markers.push(new_marker) ;
                    });

                    if (row.hotspot == null){
                        document.getElementById('addCheckins').innerHTML = document.getElementById('addCheckins').innerHTML + '<div class="checkin"><p>' + 'Venue: ' + row.venue_name + '</p><p>Date: ' + row.date_time + '</p></div>';
                    }
                    else{
                        document.getElementById('addCheckins').innerHTML = document.getElementById('addCheckins').innerHTML + '<div class="checkin"><p>' + 'Venue: ' + row.venue_name + '</p><p>Date: ' + row.date_time + '</p><i class="fas fa-exclamation-triangle"></i></div>';
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
                        document.getElementById('addHotspots').innerHTML = document.getElementById('addHotspots').innerHTML + '<div class="checkin"><p>' + 'Suburb: ' + row.suburb_name + '</p><button class="pure-button pure-button-primary rounded-button" style="margin-bottom: 1em;" onclick="deleteHotspot('+ row.id +')">Remove</button></div>';
                    }
                    else{
                        document.getElementById('addHotspots').innerHTML = document.getElementById('addHotspots').innerHTML + '<div class="checkin"><p>' + 'Suburb: ' + row.suburb_name + '</p></div>';
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


}

function createHotspot(){

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





/*
mapboxClient.geocoding.forwardGeocode({
    query: '147 King William Rd, Unley SA 5061',
    autocomplete: false,
    limit: 1
}).send().then(function (response) {
    var feature = response.body.features[0];
    new mapboxgl.Marker().setLngLat(feature.center).addTo(map);
});










var marker1 = new mapboxgl.Marker({color: "#8CB89F",draggable: true}).setLngLat([138.60414, -34.919159]).addTo(map);
var marker2 = new mapboxgl.Marker({color: "#8CB89F",draggable: true}).setLngLat([138.6107, -34.9753]).addTo(map);
var marker3 = new mapboxgl.Marker({color: "#8CB89F",draggable: true}).setLngLat([138.688497246, -34.825330032]).addTo(map);

*/