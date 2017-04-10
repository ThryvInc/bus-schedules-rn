import React, { Component } from 'react';
import { Container, Header, Body, Button, Content, Title, Left, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import PredictionList from './PredictionList.js'

export default class PredictionsForRouteStop extends Component {
  constructor(props){
    super(props);
    var predictions = [];
    for (var i = 0; i < 10; i++) {
      predictions.push({minutes: i + "min"})
    }
    this.state = { predictions: predictions };
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
            <Title>Predictions</Title>
          </Body>
          <Right></Right>
        </Header>
        <Content>
          <PredictionList predictions={this.state.predictions} />
        </Content>
      </Container>
    );
  }
}
