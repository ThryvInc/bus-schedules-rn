import React, { Component } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  Dimensions,
  InteractionManager,
  PermissionsAndroid,
  Platform } from 'react-native';
import { Container, Header, Body, Button, Content, Title, Left, Right, Icon, StyleProvider, Spinner } from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import { Actions } from 'react-native-router-flux';
import StopList from './StopList.js';
import MapView from 'react-native-maps';
import API from '../lib/API.js';

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
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => Actions.pop({refresh:{}})}>
                <Icon name='arrow-back' />
              </Button>
            </Left>
            <Body>
              <Title>Choose a Stop</Title>
            </Body>
            <Right/>
          </Header>
          <Content>
            <View style={{width: width, height: height/2}}>
              <MapView style={styles.map} 
                initialRegion={initialRegion} 
                region={coordinates} 
                geolocationOptions={GEOLOCATION_OPTIONS} 
                showsScale={true} 
                showsUserLocation={true} >
                { this.state.stops.map(stop => (
                  <MapView.Marker pinColor='#a5d250' title={stop.name} coordinate={stop.coords} key={stop.id} onPress={() => Actions.routesForStop({ stop: stop })} />
                ))}
              </MapView>
            </View>
            { this.state.loading? <Spinner /> : <StopList stops={this.state.stops} /> }
          </Content>
        </Container>
      </StyleProvider>
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
        this.getStops(position.coords);
      },
      (error) => {if (Platform.OS === 'android') {alert(JSON.stringify(error))}},
      {timeout: 10000}
    );
  }

  watchLocation() {
    this.watchID = navigator.geolocation.watchPosition((position) => {
      this.setState({ lastPosition: position.coords, loading: true });
      this.getStops(position.coords)
    });
  }

  getStops(location) {
    API.getStops(location, stops => this.setStops({stops: stops, loading: false }), 
      error => alert(JSON.stringify(error)))
  }

  setStops(stopsUpdateObject) {
    this.setState(stopsUpdateObject);
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
