import {
  StyleSheet,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  TouchableOpacity
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

const MainPresenter: React.FC<MainPresenterProps> = ({
  displayType,
  onPressMainView,
  // RTCVIEW, CHARACTER
  isMaster,
  userName,
  // RTCVIEW
  streamURL,
  videoType,
  mirrorMode,
  // CHARACTER
  avatar,
  // SCREENSHARE
  onPressShareStop
}) => {
  return (
    <SafeAreaView style={styles.mainVideoSAV}>
      <KeyboardAvoidingView
        style={styles.avoidingContainer}
        keyboardVerticalOffset={1}
        enabled={false}
        behavior={Platform.OS === 'android' ? 'height' : undefined}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={onPressMainView}
        >
          {displayType === 'screen' && (
            <ScreenShare onPressShareStop={onPressShareStop} />
          )}
          {displayType === 'track' && (
            <RtcView
              streamURL={streamURL}
              videoType={videoType}
              isMaster={isMaster}
              userName={userName}
              mirrorMode={mirrorMode}
            />
          )}
          {displayType === 'character' && (
            <Character
              avatar={avatar}
              isMaster={isMaster}
              userName={userName}
            />
          )}
          {displayType === 'document' && <DocumentShare />}
          {displayType === 'sketch' && <Sketch />}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
