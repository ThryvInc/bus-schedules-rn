import React, { Component } from 'react';
import { Icon, ListItem, Right, Text, Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import MixedList from './MixedList.js';

export default class RouteList extends Component {
  constructor(props){
    super(props);
    var routeItemModels = [];
    for (var i = 0; i < this.props.routes.length; i++) {
      routeItemModels.push(this.routeListItemModel(this.props.routes[i]))
    }
    this.state = { routeItemModels: routeItemModels };
  }

  render() {
    return (
      <MixedList listItemViewModels={this.state.routeItemModels} />
    );
  }

  routeListItemModel(route) {
    var listItemModel = {};
    listItemModel.listItem = () => {
        return <ListItem onPress={() => 
          Actions.predictionsForRouteStop()
        }>
          <Text>{route.shortName}</Text>
          <Right>
            <Text>{route.distance}</Text>
            <Icon name="arrow-forward" />
          </Right>
        </ListItem>
    }
    return listItemModel;
  }
}
