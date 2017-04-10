import React, { Component } from 'react';
import { Content, List } from 'native-base';

export default class MixedList extends Component {
  render() {
    return (
      <List dataArray={this.props.listItemViewModels} renderRow={(listItemViewModel) =>
        <Content>{listItemViewModel.listItem()}</Content>
      } />
    );
  }
}
