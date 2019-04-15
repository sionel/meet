import React, { Component } from 'react';
import UserInfoScreenPresenter from './UserInfoScreenPresenter';

class UserInfoScreenContainer extends Component {
  render() {
    const { auth } = this.props;
    return <UserInfoScreenPresenter auth={auth} />;
  }
}

export default UserInfoScreenContainer;
