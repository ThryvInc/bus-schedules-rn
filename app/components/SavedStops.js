import React, { Component } from 'react';
import { AsyncStorage,
  PermissionsAndroid,
  Platform } from 'react-native';
import { Container, Header, Body, Button, Content, Title, Left, List, ListItem, Right, StyleProvider, Text, Icon, Spinner } from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import { Actions } from 'react-native-router-flux';
import StopList from './StopList.js'

export default class SavedStops extends Component {
  constructor(props){
    super(props);
    
    this.state = { stops: [], loading: true };
  }

  componentDidMount(){
    this.loadStops();
  }

  componentWillReceiveProps() {
    this.loadStops();
  }

  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
            <Left>
              <Button transparent>
              </Button>
            </Left>
            <Body>
              <Title>Saved Stops</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => Actions.chooseStop()}>
                <Icon name='add' />
              </Button>
            </Right>
          </Header>
          <Content>
            { this.state.loading? <Spinner /> : 
            <List dataArray={this.state.stops} renderRow={stop =>
              <ListItem onPress={() => {Actions.routesForStop({ stop: stop });} }>
                <Text>{stop.name}</Text>
                <Right>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            } />}
          </Content>
        </Container>
      </StyleProvider>
    );
  }

  loadStops(){
    AsyncStorage.getItem('SavedStops').then(stopsString => {
      var stops = JSON.parse(stopsString)
      if (stops !== null && stops.length !== 0) {
        this.setState({stops: stops, loading: false});
      }else{
        this.setState({stops: [], loading: true})

        if (Platform.OS === 'android') {
          setTimeout(() => PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
            .then(granted => {
              if (granted) Actions.chooseStop();
            }), 500);
          
        } else {
          setTimeout(() => Actions.chooseStop(), 500);
        }
      }
    });
  }
}
