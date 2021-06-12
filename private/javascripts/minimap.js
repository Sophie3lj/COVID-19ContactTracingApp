mapboxgl.accessToken = 'pk.eyJ1Ijoic29waGllM2xqIiwiYSI6ImNrb2R5YXNoazA2MHMybm80cHVsdzRzY3oifQ.BlVnpNJHCi01_yqgo7ZexA';
var map = new mapboxgl.Map({
    container: 'minimap', // container ID
    style: 'mapbox://styles/sophie3lj/ckojqizu24trv18kefcc9vu80', // style URL
    center: [138.599503, -34.921230], // starting position [lng, lat]
    zoom: 10 // starting zoom
});