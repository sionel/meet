import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actionCreators as mainUserActionCreators } from '@redux/mainUser';
import ParticipantBoxPresenter from './ParticipantBoxPresenter';
import { ParticipantsTypes } from '@redux/participants';
import { RootState } from 'src/redux/configureStore';
import { Dimensions, Platform } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

const isTablet = deviceInfoModule.isTablet();

const ParticipantBoxContainer = (props: {
  user: ParticipantsTypes;
  isSelect: any;
  isMultipleView: boolean;
  width: number;
  height: number;
  index?: number;
  videoTrack?: any;
  setIsMultipleView?: (flag: boolean) => void;
}) => {
  const { user, isMultipleView, index, setIsMultipleView, width, height } =
    props;

  
  const { isMuteVideo } = user;
  const videoTrack = props.videoTrack ? props.videoTrack : user.videoTrack;

  const { orientation } = useSelector((state: RootState) => state.orientation);

  const dispatch = useDispatch();
  const setMainUser = (id: string) =>
    dispatch(mainUserActionCreators.setMainUser(id));

  const multiWidth = isTablet
    ? orientation === 'horizontal'
      ? width * 0.47
      : width * 0.46
    : width * 0.425;
  const multiViewHeight = isTablet
    ? orientation === 'horizontal'
      ? (height * 0.55) / 2
      : (height * 0.65) / 2
    : Platform.OS === 'ios'
    ? (height * 0.67) / 2
    : (height * 0.61) / 2;
  const multiView = { width: multiWidth, height: multiViewHeight };

  let character = '';
  if (user?.userInfo?.avatar) {
    character = JSON.parse(user?.userInfo?.avatar)?.value;
  } else {
    character = isMuteVideo ? 'jangok' : character;
  }
  const handleTouchView = () => {
    setMainUser(user.id);
    isMultipleView && setIsMultipleView && setIsMultipleView(false);
  };

  return (
    <ParticipantBoxPresenter
      videoTrack={videoTrack}
      user={user}
      isMuteVideo={isMuteVideo}
      character={character}
      setMainUser={setMainUser}
      isMultipleView={isMultipleView}
      index={index}
      handleTouchView={handleTouchView}
      multiView={multiView}
      orientation={orientation}
    />
  );
};

export default ParticipantBoxContainer;
