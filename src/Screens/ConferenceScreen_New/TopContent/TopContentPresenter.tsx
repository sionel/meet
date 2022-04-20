import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  SafeAreaView
} from 'react-native';
import React, { Fragment } from 'react';
import { TopContentPresenterProps } from '@screens/ConferenceScreen_New/types';

import icUserW from '@assets/icons/ic_user_w2.png';
import icChatW from '@assets/icons/ic_chat_w.png';
import icReverseW from '@assets/icons/ic_change_w2.png';
import icInvertW from '@assets/icons/ic_invert_w.png';
import icMoreW from '@assets/icons/ic_more_w.png';

//시간, 방제목, 상단 버튼
const TopContentPresenter: React.FC<TopContentPresenterProps> = ({
  onPressUserList,
  onPressChatting,
  onPressCamaraReverse,
  onPressDisplayInvert,
  onPressMore,
  displayType
}) => {
  return (
    <SafeAreaView style={styles.topContentSAV}>
      <View style={styles.topContainer}>
        <View style={styles.topRow}>
          <Text style={styles.topRowText}>{`01:20`}</Text>
          {displayType === 'NAME' && (
            <Text style={styles.topRowText}>{`기획팀 주간회의`}</Text>
          )}
          <View style={styles.topButtonContainer}>
            {displayType === 'FUNCTION' && (
              <Fragment>
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0)'}
                  onPress={onPressUserList}
                >
                  <Image
                    source={icUserW}
                    resizeMode={'cover'}
                    style={styles.UserIcon}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0)'}
                  onPress={onPressChatting}
                >
                  <Image
                    source={icChatW}
                    resizeMode={'cover'}
                    style={styles.ChatIcon}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0)'}
                  onPress={onPressCamaraReverse}
                >
                  <Image
                    source={icReverseW}
                    resizeMode={'cover'}
                    style={styles.ReverseIcon}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0)'}
                  onPress={onPressDisplayInvert}
                >
                  <Image
                    source={icInvertW}
                    resizeMode={'cover'}
                    style={styles.InvertIcon}
                  />
                </TouchableHighlight>
              </Fragment>
            )}
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0)'}
              onPress={onPressMore}
            >
              <Image
                source={icMoreW}
                resizeMode={'cover'}
                style={styles.MoreIcon}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topContentSAV: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    zIndex: 1
  },
  topContainer: {
    flex: 1
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
