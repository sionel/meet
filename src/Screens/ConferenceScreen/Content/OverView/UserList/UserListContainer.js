import React, { Component } from 'react';
import UserListPresenter from './UserListPresenter';

export default class UserListContainer extends Component {
  render() {
    const { auth, user, users, attributes, presenter } = this.props;
    let userList = users.slice(0);
    userList.unshift({
      ...user,
      userInfo: { profile_url: auth.profile_url, wehagoId: auth.portal_id }
    });

    return <UserListPresenter userList={userList} presenter={presenter} />;
  }
}
