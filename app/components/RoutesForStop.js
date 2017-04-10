import React, { Component } from 'react';
import { Container, Header, Body, Button, Content, Title, Left, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import RouteList from './RouteList.js'

export default class RoutesForStop extends Component {
  constructor(props){
    super(props);

    this.state = { stop: props.stop, routes: props.stop.routes };

    this.getStop(props.stop);
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{ this.state.stop.name }</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <RouteList routes={this.state.routes} />
        </Content>
      </Container>
    );
  }

  getStop(stop) {
    const url = "https://bustime.mta.info/api/siri/stop-monitoring.json?MonitoringRef=" + stop.id + "&key=c83296ce-9d58-4801-b9d9-eb1957e30f14";

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var routes = responseJson.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit.map(routeHolderJson => {
          var routeJson = routeHolderJson.MonitoredVehicleJourney;
          return { coords: { latitude: routeJson.VehicleLocation.Latitude, 
                             longitude: routeJson.VehicleLocation.Longitude }, 
                   name: routeJson.PublishedLineName, id: routeJson.LineRef, direction: routeJson.DirectionRef, vehicle_id: routeJson.VehicleRef,
                   prediction: routeJson.MonitoredCall.ExpectedArrivalTime, 
                   distance: routeJson.MonitoredCall.Extensions.Distances.PresentableDistance };
        });
        this.setState({ routes: routes })
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  }
}
