var vueinst = new Vue({
    el: '#app',
    data: {
        checkins: false,
        hotspots: false
    }
});


mapboxgl.accessToken = 'pk.eyJ1Ijoic29waGllM2xqIiwiYSI6ImNrb2R5YXNoazA2MHMybm80cHVsdzRzY3oifQ.BlVnpNJHCi01_yqgo7ZexA';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/sophie3lj/ckojqizu24trv18kefcc9vu80', // style URL
    center: [138.599503, -34.921230], // starting position [lng, lat]
    zoom: 10 // starting zoom
});

var marker1 = new mapboxgl.Marker({color: "#8CB89F",draggable: true}).setLngLat([138.60414, -34.919159]).addTo(map);
var marker2 = new mapboxgl.Marker({color: "#8CB89F",draggable: true}).setLngLat([138.6107, -34.9753]).addTo(map);
var marker3 = new mapboxgl.Marker({color: "#8CB89F",draggable: true}).setLngLat([138.688497246, -34.825330032]).addTo(map);