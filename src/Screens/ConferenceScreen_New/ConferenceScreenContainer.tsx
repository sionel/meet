import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
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

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  let conference: Conference;

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const { testFlag, auth } = useSelector((state: RootState) => ({
    testFlag: state.test.testFlag,
    auth: state.user.auth
  }));

  // const testfunction = new test('asd')

  // testfunction.valtest()

  useEffect(() => {
    
    
    _connectConference();
  }, []);
  const dispatch = useDispatch();

  const _connectConference = async () => {
    console.log("한번만 나와야하는데 이게 여러번 나오나 싶어서");
    const id = '60babe23-21e0-4456-87be-8856ed78e905';
    const getMeetRoomToken = await MeetApi.getMeetRoomToken(auth, id);
    if (isSuccess(getMeetRoomToken)) {
      const token = getMeetRoomToken.resultData;
      conference = new Conference();
      conference.join({ id, token }, auth, dispatch);
    }
  };

  const _handleClose = () => {};
  const _handleSpeaker = () => {};

  return (
    // <ConferenceScreenPresenter
    //   isConnected={isConnected}
    //   handleClose={_handleClose}
    //   handleSpeaker={_handleSpeaker}
    // />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, backgroundColor: '#ffa' }}>
        <TouchableOpacity
          style={{ top: 100, width: 100, height: 100, backgroundColor: '#0fa' }}
          onPress={() => {
            conference?.dispose();
          }}
        >
          <Text>{'testtests'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  // return <ConferenceScreenPresenter isConnected={isConnected} />;
};
export default ConferenceScreenContainer;
