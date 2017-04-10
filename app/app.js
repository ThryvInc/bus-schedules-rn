import React, { Component } from 'react';
import {
  AppRegistry
} from 'react-native';
import { Router, Scene } from 'react-native-router-flux';
import SavedStops from './components/SavedStops.js';
import RoutesForStop from './components/RoutesForStop.js';
import PredictionsForRouteStop from './components/PredictionsForRouteStop.js';
import ChooseStop from './components/ChooseStop.js';

export default class App extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar={true}>
          <Scene key="savedStops" component={SavedStops} initial={true} />
          <Scene key="routesForStop" component={RoutesForStop} />
          <Scene key="predictionsForRouteStop" component={PredictionsForRouteStop} />
          <Scene key="chooseStop" component={ChooseStop} />
        </Scene>
      </Router>
    );
  }
}

AppRegistry.registerComponent('BusSchedules', () => App);
