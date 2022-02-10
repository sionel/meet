import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { actionCreators as mainUserActionCreators } from '@redux/mainUser';
import ParticipantBoxPresenter from './ParticipantBoxPresenter';

const ParticipantBoxContainer = (props: {
  user: any;
  isSelect: any;
  isMultipleView: boolean;
  index?: number;
  multiViewHeight?: number;
  videoTrack?: any;
}) => {
  const { user, isMultipleView, multiViewHeight, index } = props;
  const { isMuteVideo } = user;
  const videoTrack = props.videoTrack ? props.videoTrack : user.videoTrack;

  let character = '';
  if (user?.userInfo?.avatar) {
    character = JSON.parse(user?.userInfo?.avatar)?.value;
  }
  character = isMuteVideo ? 'jangok' : character;

  const dispatch = useDispatch();
  const setMainUser = (id: string) =>
    dispatch(mainUserActionCreators.setMainUser(id));

  /**
   * 닉네임 표기 방법
   * 닉네임(이름) > 이름
   * @param {*} user
   */
  const getUserName = (user: any) => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };

  return (
    <ParticipantBoxPresenter
      videoTrack={videoTrack}
      user={user}
      isMuteVideo={isMuteVideo}
      character={character}
      setMainUser={setMainUser}
      getUserName={getUserName}
      isMultipleView={isMultipleView}
      multiViewHeight={multiViewHeight}
      index={index}
    />
  );
};

export default ParticipantBoxContainer;
