import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  SafeAreaView
} from 'react-native';
import React from 'react';
import { TopContentPresenterProps } from '../types';

import icUserW from '@assets/icons/ic_user_w2.png';
import icChatW from '@assets/icons/ic_chat_w.png';
import icReverseW from '@assets/icons/ic_change_w2.png';
import icInvertW from '@assets/icons/ic_invert_w.png';
import icMoreW from '@assets/icons/ic_more_w.png';
import icMaster from '@assets/icons/ic_master.png';

//시간, 방제목, 상단 버튼
const TopContentPresenter: React.FC<TopContentPresenterProps> = ({
  isMaster,
  UserListClick,
  ChattingClick,
  ReverseCamaraClick,
  DisplayInvertClick,
  MoreClick
}) => {
  return (
    <SafeAreaView
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        zIndex: 1
      }}
    >
      <View style={[styles.topContainer]}>
        <View style={styles.topRow}>
          <Text style={styles.topRowText}>{`01:20`}</Text>
          <Text style={styles.topRowText}>{`기획팀 주간회의`}</Text>
          <View style={styles.topButtonContainer}>
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={UserListClick}
            >
              <Image
                source={icUserW}
                resizeMode={'cover'}
                style={styles.UserIcon}
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={ChattingClick}
            >
              <Image
                source={icChatW}
                resizeMode={'cover'}
                style={styles.ChatIcon}
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={ReverseCamaraClick}
            >
              <Image
                source={icReverseW}
                resizeMode={'cover'}
                style={styles.ReverseIcon}
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={DisplayInvertClick}
            >
              <Image
                source={icInvertW}
                resizeMode={'cover'}
                style={styles.InvertIcon}
              />
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={MoreClick}
            >
              <Image
                source={icMoreW}
                resizeMode={'cover'}
                style={styles.MoreIcon}
              />
            </TouchableHighlight>
          </View>
        </View>
        <View
          style={[styles.mainUserNameView, isMaster && { paddingLeft: 12 }]}
        >
          {isMaster && (
            <Image
              source={icMaster}
              resizeMode={'cover'}
              style={styles.MasterIcon}
            />
          )}
          <Text style={styles.name}>{`김연길`}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1
    // position: 'absolute',
    // left: 0,
    // right: 0,
    // zIndex: 1,
    // elevation: 1
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    height: 48
  },
  topRowText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 14,
    color: 'rgba(255,255,255,0.87)'
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 24
  },
  mainUserNameView: {
    flexDirection: 'row',
    marginTop: 10,
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
  UserIcon: {
    width: 24,
    height: 24,
    marginRight: 20
  },
  ChatIcon: {
    width: 24,
    height: 24,
    marginRight: 20.4
  },
  ReverseIcon: {
    width: 23.2,
    height: 19.3,
    marginRight: 20.4
  },
  InvertIcon: {
    width: 24,
    height: 24,
    marginRight: 20
  },
  MoreIcon: {
    width: 24,
    height: 24
  },
  MasterIcon: {
    width: 18,
    height: 18,
    marginRight: 4
  }
});

export default TopContentPresenter;
