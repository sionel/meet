import React, { Component } from 'react';
import { BackHandler } from 'react-native';
import ChangeCompanyScreenPresenter from './ChangeCompanyScreenPresenter';

export default class ChangeCompanyScreenContainer extends Component {
  componentWillUnmount() {
    this.props.onDisibleModal();
  }

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
