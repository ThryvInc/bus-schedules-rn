
export default class MTAAPI {
	static getStops(location, success, failure){
		const url = "https://bustime.mta.info/api/where/stops-for-location.json?lat=" + location.latitude + "&lon=" + location.longitude + "&latSpan=0.005&lonSpan=0.005&key=c83296ce-9d58-4801-b9d9-eb1957e30f14";

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var stops = responseJson.data.stops.map(stopJson => {
          return { coords: { latitude: stopJson.lat, longitude: stopJson.lon }, 
                   name: stopJson.name, id: stopJson.id, routes: stopJson.routes };
        });
        success(stops);
      })
      .catch((error) => {
      	failure(error);
      });
	}

	static getStopPredictions(stop, success, failure){
		const url = "https://bustime.mta.info/api/siri/stop-monitoring.json?MonitoringRef=" + stop.id + "&key=c83296ce-9d58-4801-b9d9-eb1957e30f14";

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var routePredictions = responseJson.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.map(routeHolderJson => {
          var routeJson = routeHolderJson.MonitoredVehicleJourney;
          return { coords: { latitude: routeJson.VehicleLocation.Latitude, 
                             longitude: routeJson.VehicleLocation.Longitude }, 
                   name: routeJson.PublishedLineName, id: routeJson.LineRef, direction: routeJson.DirectionRef, vehicle_id: routeJson.VehicleRef,
                   prediction: routeJson.MonitoredCall.ExpectedArrivalTime, 
                   distance: routeJson.MonitoredCall.Extensions.Distances.PresentableDistance };
        });


        success(routePredictions);
      })
      .catch((error) => {
        failure(error);
      });
	}

	static getStopRoutes(stop, success, failure) {
		MTAAPI.getStopPredictions(stop, routePredictions => {
			var routes = [];
	    if (routePredictions.length > 0) {
	      routes.push(routePredictions[0]);
	      for (var i = 0; i < routePredictions.length; i++) {
	        if (routes.length === 0 || routes.filter(route => route.name === routePredictions[i].name).length == 0) {
	          routes.push(routePredictions[i])
	        }
	      }
	    }

	    success(routes);
		}, failure);
	}

	static getStopRoutePredictions(route, stop, success, failure){
		MTAAPI.getStopPredictions(stop, routePredictions => {
			success(routePredictions.filter(prediction => prediction.name === route.name));
		}, failure);
	}
}