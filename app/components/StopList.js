import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { Icon, ListItem, Right, Text } from 'native-base';
import MixedList from './MixedList.js';

export default class StopList extends Component {
  constructor(props){
    super(props);
    var stopItemModels = [];
    for (var i = 0; i < this.props.stops.length; i++) {
      stopItemModels.push(this.stopListItemModel(this.props.stops[i]))
    }
    this.state = { stopItemModels: stopItemModels };
  }

  render() {
    return (
      <MixedList listItemViewModels={this.state.stopItemModels} />
    );
  }

  stopListItemModel(stop) {
    var listItemModel = {};
    listItemModel.stop = stop
    listItemModel.listItem = () => {
        return <ListItem onPress={() => {
          Actions.routesForStop({ stop: stop });
        }}>
          <Text>{stop.name}</Text>
          <Right>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
    }
    return listItemModel;
  }
}
