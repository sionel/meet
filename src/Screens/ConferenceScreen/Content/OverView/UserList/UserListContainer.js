import React, { Component } from 'react';
import UserListPresenter from './UserListPresenter';

export default class UserListContainer extends Component {
  render() {
    const {
      auth,
      user,
      users,
      attributes,
      presenter,
      speaker,
      toggleMuteMic,
      onChangeSpeaker,
      // updateMuteAudio
      masters
    } = this.props;

    let userList = users.slice(0);
    userList.unshift({
      ...user,
      userInfo: {
        profile_url: auth.profile_url,
        wehagoId: auth.portal_id,
        userName: auth.user_name,
        nickname: auth.nickname
      }
    });

    userList.forEach(user => {
      user.isMaster = masters.includes(user?.userInfo?.wehagoId);
    });

    return (
      <UserListPresenter
        userList={userList}
        presenter={presenter}
        speaker={speaker}
        toggleMuteMic={toggleMuteMic}
        onChangeSpeaker={onChangeSpeaker}
        masters={masters}
        // updateMuteAudio={updateMuteAudio}
      />
    );
  }
}
