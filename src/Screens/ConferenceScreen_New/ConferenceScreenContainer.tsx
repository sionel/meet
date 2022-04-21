import React, { useEffect, useState } from 'react';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import { ConferenceScreenContainerProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
// import ConferenceManager from './conferenceUtil/ConferenceManager';
import test from './conferenceUtil/test';
import Conference from './conferenceUtil/Conference';
import { isSuccess } from '@services/types';
import MeetApi from '@services/api/MeetApi';

import { actionCreators as ConferenceActions } from '@redux/conference';
import { actionCreators as ParticipantsActions } from '@redux/participants_copy';

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  const {
    navigation,
    route: { params }
  } = props;
  // console.log('navigation : ', navigation);
  // console.log('route : ', route);

  let conference: Conference;

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const { state, testFlag, auth, participants, room, isLogin } = useSelector(
    (state: RootState) => ({
      testFlag: state.test.testFlag,
      auth: state.user.auth,
      state,
      participants: state.participants_copy.list,
      room: state.conference.room,
      isLogin: state.user.isLogin
    })
  );

  const dispatch = useDispatch();
  const setRoom = (conference: Conference) => {
    dispatch(ConferenceActions.setRoom(conference));
  };
  const resetUserlist = () => {
    dispatch(ParticipantsActions.resetUserlist());
  };
  // const testfunction = new test('asd')

  // testfunction.valtest()

  useEffect(() => {
    console.log('ttt');    
    _connectConference();
  }, []);

  const _connectConference = async () => {
    conference = new Conference();

    try {
      const userInfo = {
        wehagoId: auth.portal_id,
        companyFullpath: auth.last_company?.full_path,
        profile_url: auth.profile_url ? auth.profile_url : '',
        userName: params.name,
        nickname: auth.nickname,
        isExternalParticipant: !isLogin,
        externalUserId: params.externalUser,
        isMobile: true,
        user_contact: auth.user_contact,
        user_email: auth.user_eamil ? auth.user_eamil : auth.user_default_email,
        avatar: params.avatar,
        videoTrack: params.tracks[0],
        audioTrack: params.tracks[1]
      };
      await conference.join(
        { id: params.id, token: params.roomToken },
        userInfo,
        dispatch,
        params.tracks
      );
      setRoom(conference);
      setIsConnected(true);
    } catch (error) {
      console.log('error: ', error);
      
      console.log('화상대화 접속에 실패하였습니다');
      //TODO: 화상대화 dispose 처리 필요
      // _handleClose();
    }

    // console.log('한번만 나와야하는데 이게 여러번 나오나 싶어서');
    // const id = '4cd6a9ad-87f5-4209-83a4-28927da96962';
    // const getMeetRoomToken = await MeetApi.getMeetRoomToken(auth, params.id);
    // if (isSuccess(getMeetRoomToken)) {
    //   const token = getMeetRoomToken.resultData;
    // }
  };
  const _handleClose = () => {
    room.dispose();
    setIsConnected(false);
    resetUserlist();
    if (!isLogin) {
      navigation.reset({ routes: [{ name: 'LoginStack' }] });
    } else {
      navigation.reset({ routes: [{ name: 'MainStack' }] });
    }
    // console.log('participants : ', participants);

    // participants[0].audioTrack.dispose();
    // participants[0].videoTrack.dispose();
  };
  const _handleSpeaker = () => {};

  return (
    <ConferenceScreenPresenter
      participants={participants}
      isConnected={isConnected}
      handleClose={_handleClose}
      handleSpeaker={_handleSpeaker}
    />
  );
};
export default ConferenceScreenContainer;
