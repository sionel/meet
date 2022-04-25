import React, { Fragment } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RTCView } from 'react-native-webrtc';

import { RtcViewProps } from '@screens/ConferenceScreen_New/types';

import icMaster from '@assets/icons/ic_master.png';

const RtcView: React.FC<RtcViewProps> = ({
  videoType,
  streamURL,
  isMaster,
  userName,
  mirrorMode
}) => {
  return (
    <Fragment>
      <View
        style={[
          styles.mainUserNameView,
          { top: 58 },
          isMaster && { paddingLeft: 12 }
        ]}
      >
        {isMaster && (
          <Image
            source={icMaster}
            resizeMode={'cover'}
            style={styles.MasterIcon}
          />
        )}
        <Text style={styles.name}>{userName}</Text>
      </View>
        <RTCView
          style={styles.RTCVideo}
          mirror={mirrorMode}
          objectFit={'contain'}
          // streamURL={stream.toURL()}
          streamURL={streamURL}
          zOrder={0} // zOrder 는 [0, 1] 만 사용가능 (아마?)
        />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  mainUserNameView: {
    position: 'absolute',
    flexDirection: 'row',
    paddingHorizontal: 15,
    height: 32,
    borderRadius: 4,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  name: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 16
  },
  MasterIcon: {
    width: 18,
    height: 18,
    marginRight: 4
  },
  RTCVideo: {
    flex: 1
  }
});

export default RtcView;
