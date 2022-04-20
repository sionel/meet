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

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  let conference: Conference;

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const { state, testFlag, auth, participants, room } = useSelector(
    (state: RootState) => ({
      testFlag: state.test.testFlag,
      auth: state.user.auth,
      state,
      participants: state.participants_copy.list,
      room: state.conference.room
    })
  );

  const dispatch = useDispatch();
  const setRoom = (conference: Conference) => {
    dispatch(ConferenceActions.setRoom(conference));
  };
  // const testfunction = new test('asd')

  // testfunction.valtest()

  useEffect(() => {
    _connectConference();
  }, []);

  const _connectConference = async () => {
    // console.log('한번만 나와야하는데 이게 여러번 나오나 싶어서');
    const id = '4cd6a9ad-87f5-4209-83a4-28927da96962';
    const getMeetRoomToken = await MeetApi.getMeetRoomToken(auth, id);

    if (isSuccess(getMeetRoomToken)) {
      const token = getMeetRoomToken.resultData;
      conference = new Conference();
      setRoom(conference);

      conference.join({ id, token }, auth, dispatch);
      setIsConnected(true);
    }
  };
  const _handleClose = () => {
    room.dispose();
    setIsConnected(false);

    console.log('participants : ', participants);
    
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
