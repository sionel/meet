import React, { Fragment } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

import { CharacterProps } from '@screens/ConferenceScreen/types';

import icMan1 from '@assets/icons/ic_man1.png';
import icWoman1 from '@assets/icons/ic_woman1.png';
import icWoman2 from '@assets/icons/ic_woman2.png';
import icMaster from '@assets/icons/ic_master.png';

const Character: React.FC<CharacterProps> = ({
  isMaster,
  userName,
  avatar,
  onPressMainView
}) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{ flex: 1 }}
      onPress={onPressMainView}
    >
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
        <Text style={styles.name}>{`${userName}`}</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={
            avatar === 'jessie'
              ? icWoman1
              : avatar === 'suzy'
              ? icWoman2
              : icMan1
          }
          style={{ width: '100%', height: '100%' }}
          resizeMode={'cover'}
        />
      </View>
    </TouchableOpacity>
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    zIndex: 1
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
  imageContainer: {
    flex: 1,
    backgroundColor: 'rgb(187,197,208)'
  }
});

export default Character;
