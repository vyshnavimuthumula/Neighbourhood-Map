var  Location = function(input) {
  this.title = input.title;
  this.location = input.location;
};
var  ViewModel = function() {
  var  self = this;
  self.locationsList = ko.observableArray([]);
  locations.forEach(function(location) {
    self.locationsList.push(new Location(location));
  });
  self.mapError = ko.observable(false);
  self.filter = ko.observable('');
  self.filteredLocations = ko.computed(function() {
    var  filterResult = self.filter().toLowerCase();
    if (!filterResult) {
      for (var i = 0; i < self.locationsList().length; i++) {
        if (self.locationsList()[i].marker) {
          self.locationsList()[i].marker.setVisible(true);
        }
      }//end for loop
      return self.locationsList();
    } else {
      return ko.utils.arrayFilter(self.locationsList(), function(loc) {
        var  equal = loc.title.toLowerCase().indexOf(filterResult) >= 0;
        if (loc.marker) {
          loc.marker.setVisible(equal);
        }
        // return match status to item in list view if match
        return equal;
      });
    }
  }, self);
  self.clearFilter = function() {
    self.filter('');    
    for (var i = 0; i < self.locationsList().length; i++) {
      //get all the markers back
      self.locationsList()[i].marker.setVisible(true);
    }
  };

  self.currentLocation = ko.observableArray([this.locationsList()[0]]);

  this.selectLocation = function(clickedLocation) {
    //sets the currentLoc to selected element from the list view
    self.currentLocation(clickedLocation);
    animateUponClick(clickedLocation.marker);
    populateInfoWindow(clickedLocation.marker, infoWindow);
  };
  self.visibleMenu = ko.observable(false),
  self.clickMe = function() {
    this.visibleMenu(!this.visibleMenu());
};

};
var  vm = new ViewModel();
ko.applyBindings(vm);
