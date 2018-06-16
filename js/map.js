var  map;
var  infoWindow;
var  locations = [
  {
    title: "Lotus Temple",
      lat:28.5534967,lng:77.2566377
  },  {
    title: 'Red Fort',
      lat: 28.6561639, lng: 77.2388316
  }, {
    title: 'Qutub Minar',
      lat:28.5265723,lng: 77.1844791
  }, {
    title: 'India Gate',
      lat: 28.6129167,lng: 77.227321
  }, {
    title: 'Jama Masjid',
      lat: 28.6507677,lng: 77.2339893
  }
];
function myMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center:new google.maps.LatLng(28.702897,77.1450243),
    //mapTypeId:google.maps.MapTypeId.HYBRID,
    mapTypeControl: false,
    panControl: true,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: true,
    overviewMapControl: true,
    animation: google.maps.Animation.BOUNCE,
    position: google.maps.ControlPosition.TOP_CENTER,
    rotateControl: true,
    zoom: 10,
    mapTypeControl: false,

  });

  var  largeInfowindow = new google.maps.InfoWindow();
  infoWindow = new google.maps.InfoWindow();
  var  bounds = new google.maps.LatLngBounds();
  for (var  i = 0; i < locations.length; i++) {
    var  position = locations[i].location;
    var  title = locations[i].title;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon:'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
      id:i
    });
    marker.setVisible(true);
    vm.locationsList()[i].marker = marker;
    // Create an onclick event to open the large infowindow at each marker and change the animation
    bounds.extend(marker.position);
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
      animateUponClick(this);
    });
  }
  map.fitBounds(bounds);
} // end InitMap

// Adds two bounces after clicking. = could be moved into separate function
// This is being called on line 87 within the loop for marker creation
function animateUponClick(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 2000);
}
//for different coloured markers
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21, 34));
  return markerImage;
}
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time
    // to load.
    infowindow.setContent('');
    infowindow.marker = marker;

    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 30;
    var  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    $.ajax(wikiURL,{
      dataType: "jsonp",
      data: {
        async: true
      }
    }).done(function(response) {
      var  articleStr = response[1];
      var  URL = 'http://en.wikipedia.org/wiki/' + articleStr;
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      infowindow.setContent('<div>' +
        '<h3>' + marker.title + '</h3>' + '</div><br><a href ="' + URL + '">' + URL + '</a><hr><div id="pano"></div>');
      // Open the infowindow on the correct marker.
      infowindow.open(map, marker);
    }).fail(function(jqXHR, textStatus) {
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      infowindow.setContent('<div>' +
        '<h3>' + marker.title + '</h3>' + '</div><br><p>Sorry. We could not contact Wikipedia! </p><hr><div id="pano"></div>');
        infowindow.open(map, marker);
    });
//The above jqXHR is a jqery api
  }
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
        // infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
      }
    }
  // Wikipedia API Ajax request - sampled from udacity lecture, need to add additional msg if there are no relevant wiki links to selected place.

    

} //end populateInfoWindow
var googleError = function() {
  vm.mapError(true);
};
