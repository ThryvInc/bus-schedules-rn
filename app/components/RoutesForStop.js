import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { Container, Header, Body, Button, Content, Title, Left, List, ListItem, Right, StyleProvider, Text, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import { Actions } from 'react-native-router-flux';
import API from '../lib/API.js';

export default class RoutesForStop extends Component {
  constructor(props){
    super(props);

    this.state = { stop: props.stop, routes: props.stop.routes, isMounted: false, isSaved: false };

    AsyncStorage.getItem('SavedStops').then(stopsString => {
      var stops = JSON.parse(stopsString)
      this.setState({ isSaved: stops.filter(stop => stop.id === this.state.stop.id).length > 0 })
    });

    this.getStop(props.stop);
  }

  componentDidMount(){
    this.state = { stop: this.state.stop, routes: this.state.routes, isMounted: true, isSaved: this.state.isSaved }
  }

  componentWillUnmount(){
    this.state = { isMounted: false}
  }

  render() {
    return (
      <StyleProvider style={getTheme(commonColor)}>
        <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => Actions.pop({refresh:{}})}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{ this.state.stop.name }</Title>
            </Body>
            <Right>
              <Button transparent onPress={() => {
                if (!this.state.isSaved) {
                  AsyncStorage.getItem('SavedStops').then(stopsString => {
                    var stops = JSON.parse(stopsString)
                    var stop = {name: this.state.stop.name, id: this.state.stop.id};
                    if (stops == null) {
                      stops = []
                    }
                    stops.push(stop);
                    AsyncStorage.setItem('SavedStops', JSON.stringify(stops));
                  });
                } else {
                  AsyncStorage.getItem('SavedStops').then(stopsString => {
                    var stops = JSON.parse(stopsString)
                    AsyncStorage.setItem('SavedStops', JSON.stringify(stops.filter(stop => stop.id !== this.state.stop.id)));
                  });
                }
                this.setState({ isSaved: !this.state.isSaved })
              }}>
                {this.state.isSaved? <Icon name="md-star" /> : <Icon name="md-star-outline" /> }
              </Button>
            </Right>
          </Header>
          <Content>
            <List dataArray={this.state.routes} renderRow={(route) =>
              <ListItem icon onPress={() => 
                Actions.predictionsForRouteStop({ stop: this.state.stop, route: route })
              }>
                <Body>
                  <Text>{route.name}</Text>
                </Body>
                <Right>
                  <Text>{route.distance}</Text>
                  <Icon name="arrow-forward" />
                </Right>
              </ListItem>
            } />
          </Content>
        </Container>
      </StyleProvider>
    );
  }

  getStop(stop) {
    API.getStopRoutes(stop, routes => {
      this.setState({ routes: routes })
    }, error => alert(JSON.stringify(error)))

    setTimeout(() => { 
      if (this.state.isMounted) {
        this.getStop(stop);
      } 
    }, 10000);
  }
}
