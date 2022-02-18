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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';

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
    <Fragment>
      <View style={{ flex: 1 }} />
      <KeyboardAvoidingView
        style={[styles.container, keyboardShow && { flex: 2.8 }]}
        behavior={'padding'}
      >
        <ScrollView
          ref={el => (scrollRef.current = el)}
          showsVerticalScrollIndicator={false}
          // style={{ backgroundColor: 'red' }}
          scrollEnabled={true}
          contentContainerStyle={{ flexGrow: 1 }}
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
                contentOffsetY + layoutMeasurementHeight + 2 >
                contentSizeHeight; // + 2 은 오차계산
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
          <View>
            <FlatList
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
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
                    contentOffsetY + layoutMeasurementHeight + 2 >
                    contentSizeHeight; // + 2 은 오차계산
                  setIsEndScroll(isOverScroll);
                }
              }}
              bounces={false}
              data={messages}
              keyExtractor={(item, index) => String(index)}
              contentContainerStyle={{ flexGrow: 1 }}
              renderItem={({ item, index }) => {
                if (!cdm && index === messages.length - 1) {
                  setCdm(true);
                }
                const localUser = user.cid === item.user;
                const { userInfo, text } = item;
                const profileUrl = userInfo.profile_url
                  ? wehagoMainURL + userInfo.profile_url
                  : wehagoDummyImageURL;

                return (
                  <View
                    style={{
                      alignItems: 'flex-start',
                      marginBottom: 5,
                      width: '90%'
                    }}
                  >
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          borderTopLeftRadius: 15,
                          borderTopRightRadius: 15,
                          borderBottomRightRadius: 15,
                          backgroundColor: 'rgba(0,0,0,0.4)'
                        },
                        localUser && { backgroundColor: '#1c90fb' }
                      ]}
                    >
                      <View
                        style={{
                          marginLeft: 16,
                          marginRight: 8,
                          marginVertical: 8
                        }}
                      >
                        <Image
                          source={{ uri: profileUrl }}
                          style={{ width: 32, height: 32, borderRadius: 16 }}
                        />
                      </View>
                      <View
                        style={{
                          marginVertical: 8,
                          paddingRight: 16,
                          maxWidth: '90%'
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: 'DOUZONEText50',
                            fontSize: 10,
                            color: 'rgba(255,255,255,0.5)'
                          }}
                        >
                          {item.name}
                          {localUser && `(나)`}
                        </Text>

                        <Text
                          style={{
                            fontFamily: 'DOUZONEText30',
                            fontSize: 12,
                            color: 'rgba(255,255,255,0.87)',
                            flex: 1
                          }}
                        >
                          {item.text}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
        <View style={styles.inputArea}>
          <TouchableOpacity style={{ marginRight: 4 }}>
            <Image source={icTrans} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>

          <View style={styles.textArea}>
            <TextInput
              multiline={true}
              value={myMessage}
              onChangeText={text => setMyMessage(text)}
              selectionColor="#fff"
              autoCapitalize="none"
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
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 14,
                margin: 5,
                backgroundColor:
                  myMessage.length > 0 ? '#1c90fb' : 'rgba(255,255,255,0.3)'
              }}
              onPressOut={onSendTextMessage}
            >
              <Image
                source={myMessage.length > 0 ? icSendW : icSend}
                style={{ width: 15, height: 15 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    // maxHeight: height * 0.5,
    flex: 1,
    paddingHorizontal: width * 0.04
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
  }
});

export default ChattingPresenter;
