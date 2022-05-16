import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ScreenShareProps } from '@screens/ConferenceScreen/types';

import icoScreenShagre from '@oldassets/icons/icoScreenShagre.png';

const ScreenShare: React.FC<ScreenShareProps> = ({ onPressShareStop }) => {
  return (
    <View style={styles.shareContainer}>
      <Image
        source={icoScreenShagre}
        style={{ width: 70, height: 70 }}
        resizeMode={'contain'}
      />
      <Text style={styles.sharingText}>{'화면을 공유 중 입니다.'}</Text>
      <Text style={styles.introText}>
        {'현재 참석자들이 알림을 포함한 모든화면을\n확인할 수 있습니다'}
      </Text>
      <TouchableOpacity
        style={styles.sharingStopButton}
        onPress={onPressShareStop}
      >
        <Text style={styles.sharingStopText}>{'공유중지'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  shareContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250
  },
  sharingText: {
    fontSize: 20,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: 'white',
    marginVertical: 20
  },
  introText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: 'white'
  },
  sharingStopButton: {
    width: 200,
    marginVertical: 40,
    backgroundColor: 'red',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  sharingStopText: {
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
    textAlign: 'center',
    color: 'white'
  }
});

export default ScreenShare;
