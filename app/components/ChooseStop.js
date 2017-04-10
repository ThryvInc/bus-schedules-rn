import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  Dimensions,
  InteractionManager,
  PermissionsAndroid,
  Platform } from 'react-native';
import { Container, Header, Body, Button, Content, Title, Left, Right, Icon, Spinner } from 'native-base';
import { Actions } from 'react-native-router-flux';
import StopList from './StopList.js';
import MapView from 'react-native-maps';

const GEOLOCATION_OPTIONS = { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 };

export default class ChooseStop extends Component {
  watchID: ?number = null;

  constructor(props){
    super(props);
    
    this.state = { 
      stops: [],
      initialPosition: { latitude: 40.7628, longitude: -73.95 },
      lastPosition: null,
      loading: true,
      locked: true
    };
  }

  render() {
    const { width, height } = Dimensions.get('window');
    const initialRegion = {
            latitude: this.state.initialPosition.latitude,
            longitude: this.state.initialPosition.longitude,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          };
    const coordinates = this.state.lastPosition == null ? initialRegion : {
            latitude: this.state.lastPosition.latitude,
            longitude: this.state.lastPosition.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          };

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent onPress={() => Actions.pop()}>
              <Icon name='arrow-back' />
            </Button>
          </Left>
          <Body>
            <Title>Choose a Stop</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name='exit' />
            </Button>
          </Right>
        </Header>
        <Content>
          <View style={{width: width, height: height/2}}>
            <MapView style={styles.map} 
              initialRegion={initialRegion} 
              region={coordinates} 
              geolocationOptions={GEOLOCATION_OPTIONS} 
              provider="google" 
              showsScale={true} 
              showsUserLocation={true} >
              { this.state.stops.map(stop => (
                <MapView.Marker pinColor='yellow' title={stop.name} coordinate={stop.coords} key={stop.id} onPress={() => Actions.routesForStop({ stop: stop })} />
              ))}
            </MapView>
          </View>
          { this.state.loading? <Spinner /> : <StopList stops={this.state.stops} /> }
        </Content>
      </Container>
    );
  }

  componentDidMount() {
    this.mounted = true;

    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
        .then(granted => {
          if (granted && this.mounted) this.watchLocation();
        });
    } else {
      this.watchLocation();
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({ lastPosition: position.coords});
      },
      (error) => alert(JSON.stringify(error)),
      {timeout: 2000}
    );
  }

  watchLocation() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({ lastPosition: position.coords, loading: true });
      this.getStops(position.coords)
    });
  }

  getStops(location) {
    const url = "https://bustime.mta.info/api/where/stops-for-location.json?lat=" + location.latitude + "&lon=" + location.longitude + "&latSpan=0.005&lonSpan=0.005&key=c83296ce-9d58-4801-b9d9-eb1957e30f14";

    fetch(url)
      .then((response) => response.json())
      .then((responseJson) => {
        var stops = responseJson.data.stops.map(stopJson => {
          return { coords: { latitude: stopJson.lat, longitude: stopJson.lon }, 
                   name: stopJson.name, id: stopJson.id, routes: stopJson.routes };
        });
        this.setStops({stops: stops, loading: false })
      })
      .catch((error) => {
        alert(JSON.stringify(error));
      });
  }

  setStops(stopsUpdateObject) {
    this.setState(stopsUpdateObject);
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.mounted = false;
    if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
