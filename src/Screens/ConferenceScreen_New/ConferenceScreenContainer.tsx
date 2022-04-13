import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import ConferenceScreenPresenter from './ConferenceScreenPresenter';
import { ConferenceScreenContainerProps } from './types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import ConferenceManager from './conferenceUtil/ConferenceManager';
import test from './conferenceUtil/test';

const ConferenceScreenContainer: React.FC<
  ConferenceScreenContainerProps
> = props => {
  let conferenceManager = null;

  const [first, setfirst] = useState();
  const [isConnected, setIsConnected] = useState(false);
  const { testFlag } = useSelector((state: RootState) => ({
    testFlag: state.test.testFlag
  }));

  // const testfunction = new test('asd')
  
  // testfunction.valtest()

  useEffect(() => {
  }, []);

  const dispatch = useDispatch();

  const _connectConference = () => {
    conferenceManager = new ConferenceManager(dispatch)
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1, backgroundColor: '#ffa' }}>
        <TouchableOpacity
          style={{ top: 100, width: 100, height: 100, backgroundColor: '#0fa' }}
        >
          <Text>{'testtests'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
  // return <ConferenceScreenPresenter isConnected={isConnected} />;
};
export default ConferenceScreenContainer;