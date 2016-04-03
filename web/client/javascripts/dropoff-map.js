Template.dropoffMap.onRendered( function () {
	GoogleMaps.load({v: '3', key: 'AIzaSyD5YWFkkWv5p2_i3AW4z095xd74lpVpSd4'});	
});

Template.dropoffMap.helpers({
	dropoffMapOptions: function() {
		// Make sure the maps API has loaded
		if (GoogleMaps.loaded()) {
			// Map initialization options
			return {
				center: new google.maps.LatLng(-37.8136, 144.9631),
				zoom: 8
			};
		}
	}
});
