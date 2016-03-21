/**
 * map.js
 * contains functions for the map
 * used by guides and tourists
 */

//variables
var map;
var geocoder;
var markers = [];
var markerCount = 0;
var userMarker = null;

var defaultLocation = {lat: 46.947248, lng: 7.451586}; //Bern

//used to delay click to allow doubleclick
var click_timeout;
var click_timeoutTimer = 200; //ms

var locationUpdateIntervalls = { //ms
    off: -0,
    bat_man: 60000,
    spider_man: 30000,
    iron_man: 10000,
    super_man: 5000,
    flash: 1000
};

var locationUpdateIntervall = locationUpdateIntervalls.iron_man;

/**
 * callback when the map script has been successfully loaded
 */
function initMap() {
    if(showLogs) console.log('init map');
    map = new google.maps.Map(document.getElementById('map'), {
        center: defaultLocation,
        zoom: 10,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false
    });
    
    addMapListeners();
    addTouristMarker(defaultLocation);
}
/**
 * adds listeners on the map element
 */
function addMapListeners() {
    //place a marker or remove it
    map.addListener('click', function (event) {
        if(showLogs) console.log('map click');
        //waits ms for marker to be placed		
        click_timeout = setTimeout(function () {
            if(showLogs) console.log('map click timeout ended');
            addMarker(++markerCount, event.latLng);
            var data = {add: true, id: markerCount, pos: event.latLng};
            sendMapData({marker: data});
        }, click_timeoutTimer);
    });
    //double click zooms
    map.addListener('dblclick', function (event) {
        if(showLogs) console.log('doubleclick, zoom level: ' + map.getZoom());
        clearTimeout(click_timeout);
    });

}
/**
 * adds a new marker to the map and saves it in an array
 * @param {int} id id of marker
 * @param {Object {double, double}} position lat lng of the marker to set
 */
function addMarker(id, position) {
    if(showLogs) console.log('add marker: ' + id);
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        //title: 'Hello World!',
        id: id
    });
    
    markerCount = id;
    
    marker.addListener('click', function (event) {
        var id = marker.id;
        if(showLogs) console.log('marker: ' + id + ' clicked');
        removeMarker(id);
        var data = {rem: true, id: id};
        sendMapData({marker: data});
    });

    markers.push(marker);
}
/**
 * removes the marker from the map and array
 * @param {int} id id of the marker to remove
 */
function removeMarker(id) {
    if(showLogs) console.log('removing marker: ' + id);
    //marker.setMap(null);
    markers = jQuery.grep(markers, function (value) {
        if(value.id != id){
            return value.id != id;
        }else{
            value.setMap(null);
        }
    });
}
/**
 * sets the position of the tourist marker
 * @param {Object {double, double}} pos to set tourist marker
 */
function setTouristLocation(pos){
    if(showLogs) console.log('tourist location lat: ' + pos.lat + ' lng: ' + pos.lng);
    userMarker.setPosition(pos);
}
/**
 * sets the orientataion of the tourist marker
 * @param {int} orient orientataion
 */
function setTouristOrientation(orient) {
    if(showLogs) console.log('tourist orientation:  lat: '+ orient);
    userMarker.setMap(null);
    userMarker.icon.rotation = rot;
    userMarker.setMap(map);
}
/**
 * adds the tourist's marker to the map
 * @param {Object {double, double}} pos to set marker
 */
function addTouristMarker(pos) {
    if(showLogs) console.log('add user marker');
    userMarker = new google.maps.Marker({
        position: pos,
        icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 5,
            rotation: 0
        },
        map: map
    });
}

//TODO do... and in .connection.js as well
function checkValidLocation(){
    
}