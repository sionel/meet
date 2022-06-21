import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  SafeAreaView
} from 'react-native';
import React, { Fragment } from 'react';
import { TopContentPresenterProps } from '@screens/ConferenceScreen/types';

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
  displayType,
  roomName,
  time,
  messageCount,
  isScreenShare
}) => {
  return (
    <SafeAreaView style={styles.topContentSAV}>
      <View style={styles.topContainer}>
        <View style={styles.topRow}>
          <Text style={styles.topRowText}>{`${time}`}</Text>
          {displayType === 'NAME' && (
            <Text style={styles.topRowText}>{`${roomName}`}</Text>
          )}
          <View style={styles.topButtonContainer}>
            {displayType === 'FUNCTION' && (
              <Fragment>
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0.2)'}
                  style={styles.buttonShadow}
                  onPress={onPressUserList}
                >
                  <Image
                    source={icUserW}
                    resizeMode={'cover'}
                    style={styles.UserIcon}
                  />
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor={'rgba(0,0,0,0.2)'}
                  style={styles.buttonShadow}
                  onPress={onPressChatting}
                >
                  <View style={styles.ChatIcon}>
                    <Image
                      source={icChatW}
                      resizeMode={'cover'}
                      style={styles.ChatIcon}
                    />
                    {messageCount > 0 && (
                      <View style={styles.messagesCountView}>
                        <Text style={styles.messagesCountText}>
                          {messageCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableHighlight>
                {!isScreenShare && (
                  <Fragment>
                    <TouchableHighlight
                      underlayColor={'rgba(0,0,0,0.2)'}
                      style={styles.buttonShadow}
                      onPress={onPressCamaraReverse}
                    >
                      <Image
                        source={icReverseW}
                        resizeMode={'cover'}
                        style={styles.ReverseIcon}
                      />
                    </TouchableHighlight>
                    <TouchableHighlight
                      underlayColor={'rgba(0,0,0,0.2)'}
                      style={styles.buttonShadow}
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
              </Fragment>
            )}
            <TouchableHighlight
              underlayColor={'rgba(0,0,0,0.2)'}
              style={styles.buttonShadow}
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
    height: '10%',
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
    marginLeft: 20,
    marginRight: 10,
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
  messagesCountView: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#1c90fb',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center'
  },
  messagesCountText: {
    color: '#fff',
    fontFamily: 'DOUZONEText50',
    fontSize: 10
  },
  UserIcon: {
    width: 24,
    height: 24
    // marginRight: 20
  },
  ChatIcon: {
    width: 24,
    height: 24
    // marginRight: 20.4
  },
  ReverseIcon: {
    width: 24,
    height: 24
    // marginRight: 20.4
  },
  InvertIcon: {
    width: 24,
    height: 24
    // marginRight: 20
  },
  MoreIcon: {
    width: 24,
    height: 24
  },
  buttonShadow: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default TopContentPresenter;
