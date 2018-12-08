import React, { Component } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Header from '../components/Header'
import HomePage from './HomePageV2'
import SensorStats from './SensorStats'

export default class Routes extends Component {
  render() {
    return (
      <div>
        <Header />
        <Router>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route exact path="/sensorStats" component={SensorStats} />
          </Switch>
        </Router>
      </div>
    )
  }
}
