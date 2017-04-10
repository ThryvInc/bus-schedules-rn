import React, { Component } from 'react';
import { Container, Header, Body, Button, Content, Title, Left, Right, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import StopList from './StopList.js'

export default class SavedStops extends Component {
  constructor(props){
    super(props);
    var stops = [];
    for (var i = 0; i < 10; i++) {
      var busStop = {};
      busStop.name = "Stop #" + i;
      stops.push(busStop)
    }
    this.state = { stops: stops };
  }

  componentDidMount(){
    Actions.chooseStop()
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
            </Button>
          </Left>
          <Body>
            <Title>Bus Stops</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => Actions.chooseStop()}>
              <Icon name='add' />
            </Button>
          </Right>
        </Header>
        <Content>
          <StopList stops={this.state.stops} />
        </Content>
      </Container>
    );
  }
}
