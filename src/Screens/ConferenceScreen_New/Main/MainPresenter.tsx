import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform
} from 'react-native';
import React from 'react';
import { MainPresenterProps } from '@screens/ConferenceScreen_New/types';
import {
  Character,
  DocumentShare,
  RtcView,
  ScreenShare,
  Sketch
} from './components';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const MainPresenter: React.FC<MainPresenterProps> = ({
  displayType,
  // RTCVIEW, CHARACTER
  isMaster,
  userName,
  // RTCVIEW
  streamURL,
  videoType,
  // CHARACTER
  avartar,
  // SCREENSHARE
  onPressShareStop
}) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainVideoSAV}>
        <KeyboardAvoidingView
          style={styles.avoidingContainer}
          keyboardVerticalOffset={1}
          enabled={false}
          behavior={Platform.OS === 'android' ? 'height' : undefined}
        >
          {displayType === 'SCREENSHARE' && (
            <ScreenShare onPressShareStop={onPressShareStop} />
          )}
          {displayType === 'RTCVIEW' && (
            <RtcView
              streamURL={streamURL}
              videoType={videoType}
              isMaster={isMaster}
              userName={userName}
            />
          )}
          {displayType === 'CHARACTER' && (
            <Character
              avartar={avartar}
              isMaster={isMaster}
              userName={userName}
            />
          )}
          {displayType === 'DOCUMENTSHARE' && <DocumentShare />}
          {displayType === 'SKETCH' && <Sketch />}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainVideoSAV: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    zIndex: 0
  },
  avoidingContainer: {
    flex: 1
  }
});

export default MainPresenter;
