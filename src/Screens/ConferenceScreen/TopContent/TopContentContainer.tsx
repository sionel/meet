import React, { useEffect, useState } from 'react';
import TopContentPresenter from './TopContentPresenter';

import { useDispatch, useSelector } from 'react-redux';

import { TopContentContainerProps } from '@screens/ConferenceScreen/types';
import { RootState } from 'src/redux/configureStore';
import { MeetApi } from '@services/index';
import { isSuccess } from '@services/types';
import { Alert } from 'react-native';
import { actionCreators as ConferenceActions } from '@redux/conference';
import _ from 'lodash';

// import { actionCreators as ConferenceActions } from '@redux/conference';

const TopContentContainer: React.FC<TopContentContainerProps> = ({
  roomName,
  id,
  handleClose
}) => {
  //#region selector
  const {
    topDisplayType,
    bottomDisplayType,
    facingMode,
    expireTime,
    messages,
    isScreenShare
  } = useSelector((state: RootState) => ({
    topDisplayType: state.conference.topDisplayType,
    bottomDisplayType: state.conference.bottomDisplayType,
    facingMode: state.conference.facingMode,
    expireTime: state.conference.expireTime,
    messages: state.conference.messages,
    isScreenShare: state.screenShare.isScreenShare
  }));
  //#endregion selector

  //#region dispatch
  const dispatch = useDispatch();
  const setBottomDisplayType = (
    displayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'NONE'
  ) => dispatch(ConferenceActions.setBottomDisplayType(displayType));
  const setFacingMode = (mode: 'FRONT' | 'BACK') =>
    dispatch(ConferenceActions.setFacingMode(mode));
  const setMirrorMode = () => dispatch(ConferenceActions.setMirrorMode());
  const initMessagesCount = () =>
    dispatch(ConferenceActions.initMessagesCount());
  //#endregion dispatch

  const [createdTime, setCreatedTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [limitedTime, setLimitedTime] = useState(3600000);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    const _timer = setInterval(() => {
      if (createdTime) {
        if (expireTime !== null) {
          let limitTime = limitedTime - 500;
          let remainTime = Math.floor(limitTime / 1000);

          setElapsedTime(remainTime);
          setLimitedTime(limitTime);

          if (limitTime < 500) {
            handleClose(false);
            Alert.alert('회의 종료', '회의시간이 60분 지나 회의가 종료됩니다.');
          }
        } else {
          let nowTime = Date.now();
          let normalTime = Math.floor((nowTime - createdTime) / 1000);

          normalTime > 0 && setElapsedTime(normalTime);
        }
      }
    }, 500);
    return () => {
      _timer && clearInterval(_timer);
    };
  }, [createdTime]);

  useEffect(() => {
    timeInit();
  }, []);

  useEffect(() => {
    let count = 0;
    if (bottomDisplayType === 'CHATTING') {
      initMessagesCount();
    }
    messages.forEach(list => {
      if (!list.isRead) {
        count = count + 1;
      }
    });
    setMessageCount(count);
  }, [messages.length, bottomDisplayType]);

  const _handlePressUserList = () => {
    setBottomDisplayType(
      bottomDisplayType === 'NONE' ? 'PARTICIPANTS' : 'NONE'
    );
  };

  const _handlePressChatting = () => {
    setBottomDisplayType(bottomDisplayType === 'NONE' ? 'CHATTING' : 'NONE');
  };

  const _handlePressCamaraReverse = () => {
    setFacingMode(facingMode === 'FRONT' ? 'BACK' : 'FRONT');
  };

  const _handlePressDisplayInvert = () => {
    setMirrorMode();
  };

  const _handlePressMore = () => {
    setBottomDisplayType(bottomDisplayType === 'NONE' ? 'MENU' : 'NONE');
  };

  const timeInit = async () => {
    let roomInfo = await MeetApi.getMeetRoomNoCert(id);
    let start_datetime;
    if (isSuccess(roomInfo)) {
      start_datetime = roomInfo.resultData.start_datetime;
    }
    let cnt = 1;
    while (!start_datetime) {
      roomInfo = await MeetApi.getMeetRoomNoCert(id);
      if (isSuccess(roomInfo)) {
        start_datetime = roomInfo.resultData.start_datetime;
      }
      cnt = cnt + 1;
      cnt > 60 &&
        Alert.alert(
          '네트연결 지연',
          '네트연결 상태가 좋지 않습니다. 회의를 재입장 해주세요.',
          [
            {
              text: '확인',
              onPress: () => handleClose(false)
            }
          ]
        );
    }
    setCreatedTime(start_datetime);
  };

  const second2String = (second: number) => {
    let hours: any = Math.floor(second / 3600);
    let minutes: any = Math.floor((second - hours * 3600) / 60);
    let seconds: any = Math.floor(second - hours * 3600 - minutes * 60);

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };

  let time = second2String(elapsedTime);

  return (
    <TopContentPresenter
      onPressUserList={_handlePressUserList}
      onPressChatting={_handlePressChatting}
      onPressCamaraReverse={_handlePressCamaraReverse}
      onPressDisplayInvert={_handlePressDisplayInvert}
      onPressMore={_handlePressMore}
      displayType={topDisplayType}
      roomName={roomName}
      time={time}
      messageCount={messageCount}
      isScreenShare={isScreenShare}
    />
  );
};

export default TopContentContainer;