import React, { Fragment } from 'react';
import {
  // ScrollView,
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  KeyboardAvoidingView
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { getT } from '@utils/translateManager';
import { ParticipantsTypes } from '@redux/participants';
import icTrans from '@assets/icons/ic_translator.png';
import icSend from '@assets/icons/ic_send.png';
import icSendW from '@assets/icons/ic_send_w.png';
import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';


const { width, height } = Dimensions.get('screen');

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

  const { OS } = Platform;
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={OS === 'ios' ? 'padding' : 'height'}
      enabled={true}
    >
      {/* <View style={styles.container}> */}
      <View style={[{ flex: 1.3 }]} />
      <ScrollView
        ref={el => (scrollRef.current = el)}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        onScrollBeginDrag={setIsEndScroll(false)}
        onScrollEndDrag={({ nativeEvent }) => {
          if (nativeEvent.targetContentOffset) {
            const contentOffsetY =
              OS === 'ios'
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
          <View style={{ flex: 1, alignItems: 'center', paddingBottom: 30 }}>
            <Text style={{ color: '#fff', fontFamily: 'DOUZONEText30' }}>
              {t('chatting_nochat')}
            </Text>
          </View>
        )}
        <FlatList
          bounces={false}
          data={messages}
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item, index }) => {

            if (!cdm && index === messages.length - 1) {
              setCdm(true);
            }
            const localUser = user.cid === item.user;
            const { userInfo } = item;
            const profileUrl = userInfo.profile_url
              ? wehagoMainURL + userInfo.profile_url
              : wehagoDummyImageURL;
            const userName = item.name ? item.name : userInfo.userName;

            return (
              <View style={styles.chatContainer}>
                <View
                  style={[
                    styles.normalChatView,
                    localUser && { backgroundColor: '#1c90fb' }
                  ]}
                >
                  <View style={styles.chatProfileView}>
                    <Image
                      source={{ uri: profileUrl }}
                      style={styles.chatProfile}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.chatTextView}>
                    <Text style={styles.userName}>
                      {userName}
                      {localUser && `(나)`}
                    </Text>

                    <Text style={styles.chatText}>{item.text}</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </ScrollView>
      <View
        style={[
          styles.inputArea,
          Platform.OS === 'ios' && { marginBottom: 20 }
        ]}
      >
        <TouchableOpacity style={{ marginRight: 4 }}>
          <Image source={icTrans} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>

        <View style={styles.textArea}>
          <TextInput
            multiline={true}
            value={myMessage}
            selectionColor="#fff"
            autoCapitalize="none"
            style={styles.chatInput}
            onChangeText={text => setMyMessage(text)}
            onFocus={() => {
              OS === 'android' && setMyMessage(' ');
            }}
          />
          <TouchableOpacity
            style={[
              styles.sendImageContainer,
              OS === 'android' && {
                backgroundColor:
                  myMessage.substring(0, 1) === '' ||
                  (myMessage.length === 1 && myMessage.substring(0, 2) === ' ')
                    ? 'rgba(255,255,255,0.3)'
                    : '#1c90fb'
              },
              OS === 'ios' && {
                backgroundColor:
                  myMessage.length > 0 ? '#1c90fb' : 'rgba(255,255,255,0.3)'
              }
            ]}
            onPressOut={onSendTextMessage}
          >
            <Image
              source={myMessage.length > 0 ? icSendW : icSend}
              style={styles.sendImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ backgroundColor: 'red' }}>
        <TextInput style={styles.none} value={myMessage} />
      </View>
      {/* </View> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  none: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 30,
    zIndex: 10,
    color: 'red',
    fontSize: 1
  },
  container: {
    // maxHeight: height * 0.5,
    flex: 1,
    paddingHorizontal: width * 0.04
  },
  chatContainer: {
    alignItems: 'flex-start',
    marginBottom: 5,
    width: '90%'
  },
  normalChatView: {
    flexDirection: 'row',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  chatProfileView: {
    marginLeft: 16,
    marginRight: 8,
    marginVertical: 8
  },
  chatProfile: {
    width: 32,
    height: 32,
    borderRadius: 16
  },
  userName: {
    fontFamily: 'DOUZONEText50',
    fontSize: 10,
    color: 'rgba(255,255,255,0.5)'
  },
  chatTextView: {
    marginVertical: 8,
    paddingRight: 16,
    maxWidth: '90%'
  },
  chatText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: 'rgba(255,255,255,0.87)',
    flex: 1
  },
  inputArea: {
    width: '100%',
    height: 56,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30
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
  chatInput: {
    // lineHeight: 15,
    fontSize: 13,
    fontFamily: 'DOUZONEText30',
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: '#fff',
    textDecorationColor: '#fff'
  },
  sendImageContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    margin: 5
  },
  sendImage: { width: 15, height: 15 }
});

export default ChattingPresenter;
