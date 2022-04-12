import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image
} from 'react-native';
import React from 'react';
import { TopContentPresenterProps } from '../types';

import icUserW from '@assets/icons/ic_user_w2.png';
import icChatW from '@assets/icons/ic_chat_w.png';
import icReverseW from '@assets/icons/ic_change_w2.png';
import icInvertW from '@assets/icons/ic_invert_w.png';
import icMoreW from '@assets/icons/ic_more_w.png';

//시간, 방제목, 상단 버튼
const TopContentPresenter: React.FC<TopContentPresenterProps> = (
  props: TopContentPresenterProps
) => {
  const {
    UserListClick,
    ChattingClick,
    ReverseCamaraClick,
    DisplayInvertClick,
    MoreClick
  } = props;

  return (
    <View style={styles.topContainer}>
      <View style={styles.topRow}>
        <Text style={styles.topRowText}>{`01:20`}</Text>
        <Text style={styles.topRowText}>{`기획팀 주간회의`}</Text>
        <View style={styles.topButtonContainer}>
          <TouchableHighlight onPress={UserListClick}>
            <Image
              source={icUserW}
              resizeMode={'cover'}
              style={styles.UserIcon}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={ChattingClick}>
            <Image
              source={icChatW}
              resizeMode={'cover'}
              style={styles.ChatIcon}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={ReverseCamaraClick}>
            <Image
              source={icReverseW}
              resizeMode={'cover'}
              style={styles.ReverseIcon}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={DisplayInvertClick}>
            <Image
              source={icInvertW}
              resizeMode={'cover'}
              style={styles.InvertIcon}
            />
          </TouchableHighlight>
          <TouchableHighlight onPress={MoreClick}>
            <Image
              source={icMoreW}
              resizeMode={'cover'}
              style={styles.MoreIcon}
            />
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 48,
    zIndex: 1,
    elevation: 1,
    backgroundColor: 'blue'
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
    height: 48,
    backgroundColor: 'yellow'
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
  }
});

export default TopContentPresenter;
