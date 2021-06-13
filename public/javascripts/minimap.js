mapboxgl.accessToken = 'pk.eyJ1Ijoic29waGllM2xqIiwiYSI6ImNrb2R5YXNoazA2MHMybm80cHVsdzRzY3oifQ.BlVnpNJHCi01_yqgo7ZexA';
var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
var map = new mapboxgl.Map({
    container: 'minimap', // container ID
    style: 'mapbox://styles/sophie3lj/ckojqizu24trv18kefcc9vu80', // style URL
    center: [138.599503, -34.921230], // starting position [lng, lat]
    zoom: 10 // starting zoom
});



function minimapLoad(){
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
                    //hotspot_markers.push(new_marker) ;
                });
            }
        }
    };

    xhttp.open('GET', '/MiniMapHotspots', true) ;
    xhttp.send() ;
}