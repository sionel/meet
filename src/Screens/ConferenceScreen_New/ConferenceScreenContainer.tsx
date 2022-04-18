import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import { ConferenceScreenContainerProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
// import ConferenceManager from './conferenceUtil/ConferenceManager';
import test from './conferenceUtil/test';
import Conference from './conferenceUtil/Conference';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { isSuccess } from '@services/types';
import MeetApi from '@services/api/MeetApi';

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  let conference: Conference;

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);

  const { state, testFlag, auth } = useSelector((state: RootState) => ({
    testFlag: state.test.testFlag,
    auth: state.user.auth,
    state
  }));

  // const testfunction = new test('asd')

  // testfunction.valtest()

  useEffect(() => {
    _connectConference();
  }, []);
  const dispatch = useDispatch();

  const _connectConference = async () => {
    // console.log('한번만 나와야하는데 이게 여러번 나오나 싶어서');
    // const id = 'b896e8fb-008f-4fd3-98c9-240a2f166ce3';
    // const getMeetRoomToken = await MeetApi.getMeetRoomToken(auth, id);
    // if (isSuccess(getMeetRoomToken)) {
    //   const token = getMeetRoomToken.resultData;
    //   conference = new Conference();
    //   conference.join({ id, token }, auth, dispatch);
    // }
  };

  const _handleClose = () => {};
  const _handleSpeaker = () => {};

  return (
    <SafeAreaProvider>
      <ConferenceScreenPresenter
        isConnected={isConnected}
        handleClose={_handleClose}
        handleSpeaker={_handleSpeaker}
      />
    </SafeAreaProvider>
    // <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
    //   <View style={{ flex: 1, backgroundColor: '#ffa' }}>
    //     <TouchableOpacity
    //       style={{ top: 100, width: 100, height: 100, backgroundColor: '#0fa' }}
    //     >
    //       <Text>{'testtests'}</Text>
    //     </TouchableOpacity>
    //   </View>
    // </SafeAreaView>

    // <ConferenceScreenPresenter
    //   isConnected={isConnected}
    //   handleClose={_handleClose}
    //   handleSpeaker={_handleSpeaker}
    // />
  );
  // return <ConferenceScreenPresenter isConnected={isConnected} />;
};
export default ConferenceScreenContainer;
