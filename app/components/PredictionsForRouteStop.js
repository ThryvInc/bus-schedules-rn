import React, { Component } from 'react';
import { Container, Header, Body, Button, Content, Title, Left, List, ListItem, Right, StyleProvider, Text, Icon } from 'native-base';
import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';
import { Actions } from 'react-native-router-flux';
import API from '../lib/API.js';

export default class PredictionsForRouteStop extends Component {
  constructor(props){
    super(props);
    this.state = { stop: props.stop, route: props.route, predictions: [] };
    this.getStopPredictions(this.state.stop);
  }

  componentDidMount(){
    this.state = { stop: this.state.stop, route: this.state.route, predictions: this.state.predictions, isMounted: true }
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
              <Button transparent onPress={() => Actions.pop()}>
                <Icon name="arrow-back" />
              </Button>
            </Left>
            <Body>
              <Title>{this.state.route.name} @ {this.state.stop.name}</Title>
            </Body>
            <Right></Right>
          </Header>
          <Content>
            <List dataArray={this.state.predictions} renderRow={(prediction) =>
              <ListItem>
                <Text>{prediction.distance}</Text>
              </ListItem>
            } />
          </Content>
        </Container>
      </StyleProvider>
    );
  }

  getStopPredictions(stop) {
    API.getStopRoutePredictions(this.state.route, stop, routeStopPredictions => {
      this.setState({ predictions: routeStopPredictions })
    }, error => alert(JSON.stringify(error)));

    setTimeout(() => { 
      if (this.state.isMounted) {
        this.getStopPredictions(stop);
      } 
    }, 10000);
  }
}
