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
    center: [138, -34], // starting position [lng, lat]
    zoom: 7 // starting zoom
});