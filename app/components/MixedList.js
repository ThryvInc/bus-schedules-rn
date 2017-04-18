import React, { Component } from 'react';
import { Content, List } from 'native-base';

export default class MixedList extends Component {
	constructor(props) {
    super(props);

    this.state = { listItemViewModels: this.props.listItemViewModels }
  }

  render() {
    return (
      <List dataArray={this.state.listItemViewModels} renderRow={(listItemViewModel) =>
        <Content>{listItemViewModel.listItem()}</Content>
      } />
    );
  }
}
