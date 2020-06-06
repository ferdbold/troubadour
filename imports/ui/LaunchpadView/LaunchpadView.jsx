import React, { Component } from 'react';

import LaunchpadAgent from '/imports/ui/LaunchpadAgent/LaunchpadAgent';

import './LaunchpadView.scss';

class LaunchpadViewCell extends Component {
  render() {
    return (
      <div className="t-launchpad-view-cell">
      </div>
    );
  }
}

export default class LaunchpadView extends Component {
  render() {
    // Generate grid
    let grid = [];
    for (let i = 0; i < LaunchpadAgent.GRID_SIZE; i++) {
      for (let j = 0; j < LaunchpadAgent.GRID_SIZE; j++) {
        grid.push(<LaunchpadViewCell key={'cell-'+j} />);
      }
    }

    return (
      <div className="t-launchpad-view">
        <h2>Launchpad S</h2>

        <div className="t-launchpad-view-grid">
          {grid}
        </div>
      </div>
    );
  }
}
