import React, { Component } from 'react';
import ChangeCompanyScreenPresenter from './ChangeCompanyScreenPresenter';

export default class ChangeCompanyScreenContainer extends Component {
  render() {
    return (
      <ChangeCompanyScreenPresenter
        visible={this.props.visible}
        items={this.props.items}
        onDisibleModal={this.props.onDisibleModal}
      />
    );
  }
}
