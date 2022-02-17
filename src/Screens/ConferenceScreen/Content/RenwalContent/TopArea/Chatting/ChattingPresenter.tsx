import React, { Fragment } from 'react';
import {
  ScrollView,
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image
} from 'react-native';
import { getT } from '@utils/translateManager';
import { ParticipantsTypes } from '@redux/participants';
import icTrans from '@assets/icons/ic_translator.png';
import icSend from '@assets/icons/ic_send.png';
import icSendW from '@assets/icons/ic_send_w.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const isIOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

const ChattingPresenter = (props: any) => {
  const {
    cdm,
    user,
    messages,
    myMessage,
    onSendTextMessage,
    scrollRef,
    setIsEndScroll,
    setCdm,
    setMyMessage,
    keyboardShow,
    keyboardHeight
  } = props;

  const t = getT();
  /**
   * 닉네임 표기 방법
   * 닉네임(이름) > 이름
   * @param {*} user
   */
  const getUserName = (user: ParticipantsTypes) => {
    if (user.userInfo) {
      if (user.userInfo.nickname) {
        return user.userInfo.nickname + '(' + user.userInfo.userName + ')';
      } else return user.userInfo.userName;
    } else return user.name;
  };

  return (
    <View
      style={[styles.container, keyboardShow && { bottom: keyboardHeight }]}
    >
      <ScrollView
        ref={scrollRef}
        onScrollBeginDrag={setIsEndScroll(false)}
        onScrollEndDrag={({ nativeEvent }) => {
          if (nativeEvent.targetContentOffset) {
            const contentOffsetY = isIOS
              ? nativeEvent.targetContentOffset.y
              : nativeEvent.contentOffset.y; // 현재 스크롤 좌표
            const layoutMeasurementHeight =
              nativeEvent.layoutMeasurement.height; // 자식의 단일 component 높이
            const contentSizeHeight = nativeEvent.contentSize.height; // 전체 component 높이
            const isOverScroll =
              contentOffsetY + layoutMeasurementHeight + 2 > contentSizeHeight; // + 2 은 오차계산
            setIsEndScroll(isOverScroll);
          }
        }}
      >
        {messages.length === 0 && (
          <View style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
            <Text style={{ color: '#999', fontFamily: 'DOUZONEText30' }}>
              {t('chatting_nochat')}
            </Text>
          </View>
        )}
        <FlatList
          data={messages}
          renderItem={({ item, index }) => {
            if (!cdm && index === messages.length - 1) {
              setCdm(true);
            }
            const localUser = user.cid === item.user;

            return (
              <View
                style={[
                  styles.messageItem,
                  {
                    justifyContent: !localUser ? 'flex-start' : 'flex-end'
                  },
                  index === 0 && { paddingTop: 10 }
                ]}
              >
                {/* {!localUser && (
                  <View style={styles.profileField}>
                    <Text>img</Text>
                  </View>
                )} */}
                <View
                  style={[
                    styles.messageData,
                    localUser && { alignItems: 'flex-end' }
                  ]}
                >
                  {!localUser && (
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.nameField}
                    >
                      {getUserName(item)}
                    </Text>
                  )}
                  <View
                    style={[
                      styles.messageView,
                      {
                        flexDirection: localUser ? 'row-reverse' : 'row'
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.messageField,
                        {
                          backgroundColor: localUser ? '#aaf2ff' : '#fff',
                          marginLeft: localUser ? 10 : 0
                        }
                      ]}
                    >
                      <Text style={{ fontFamily: 'DOUZONEText30' }}>
                        {item.text}
                      </Text>
                    </View>
                    <View style={styles.dateField}>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                          color: '#939598',
                          fontSize: 10,
                          fontFamily: 'DOUZONEText30'
                        }}
                      >
                        {/* {item.date} */}
                        {(() => {
                          const date = new Date(item.date);
                          const renderDate =
                            (date.getHours() < 10 ? '0' : '') +
                            date.getHours() +
                            ':' +
                            (date.getMinutes() < 10 ? '0' : '') +
                            date.getMinutes();
                          return renderDate;
                        })()}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
      <View style={styles.inputArea}>
        <TouchableOpacity style={{ marginRight: 4 }}>
          <Image source={icTrans} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        <View style={styles.textArea}>
          <TextInput
            multiline={true}
            numberOfLines={2}
            value={myMessage}
            onChangeText={text => setMyMessage(text)}
            selectionColor="#fff"
            style={{
              lineHeight: 20,
              fontSize: 13,
              fontFamily: 'DOUZONEText30',
              flex: 1,
              paddingHorizontal: 12,
              paddingVertical: 11,
              color: '#fff'
            }}
          />
          <TouchableOpacity
            style={{
              width: 28,
              height: 28,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 14,
              margin: 5,
              backgroundColor:
                myMessage.length > 0 ? '#1c90fb' : 'rgba(255,255,255,0.3)'
            }}
          >
            <Image
              source={myMessage.length > 0 ? icSendW : icSend}
              style={{ width: 15, height: 15 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: '100%',
    maxHeight: height * 0.62,
    paddingHorizontal: width * 0.04
  },
  messageItem: {
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10
  },
  inputArea: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: height * 0.04
  },
  textArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    height: 38,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)'
  },
  profileField: {
    width: 30,
    height: 30,
    backgroundColor: 'red',
    borderRadius: 25
  },
  messageData: { maxWidth: '100%', alignItems: 'flex-start' },
  nameField: {
    marginLeft: 2,
    marginBottom: 3,
    color: '#58595a',
    fontFamily: 'DOUZONEText30'
  },
  messageView: { flexDirection: 'row', maxWidth: '90%' },
  messageField: {
    borderRadius: 4,
    padding: 8
  },
  dateField: {
    // width: 80,
    justifyContent: 'flex-end',
    paddingLeft: 4,
    paddingBottom: 2
  }
});

export default ChattingPresenter;
