import React, { Component } from 'react';
import ChangeCompanyScreenPresenter from './ChangeCompanyScreenPresenter';

export default class ChangeCompanyScreenContainer extends Component {
  render() {
    return (
      <ChangeCompanyScreenPresenter
        visible={this.props.visible}
        companyList={this.props.companyList}
        onDisibleModal={this.props.onDisibleModal}
      />
    );
  }
}
