import React, { Component } from 'react';
import { ListItem, Text, Toast } from 'native-base';
import MixedList from './MixedList.js';

export default class PredictionList extends Component {
  constructor(props){
    super(props);
    var predictionItemModels = [];
    for (var i = 0; i < this.props.predictions.length; i++) {
      predictionItemModels.push(this.predictionListItemModel(this.props.predictions[i]))
    }
    this.state = { predictionItemModels: predictionItemModels };
  }

  render() {
    return (
      <MixedList listItemViewModels={this.state.predictionItemModels} />
    );
  }

  predictionListItemModel(prediction) {
    var listItemModel = {};
    listItemModel.listItem = () => {
        return <ListItem onPress={() => 
          Toast.show({
              text: 'Wrong password!',
              position: 'bottom',
              buttonText: 'Okay'
            })}>
          <Text>{prediction.minutes}</Text>
        </ListItem>
    }
    return listItemModel;
  }
}
