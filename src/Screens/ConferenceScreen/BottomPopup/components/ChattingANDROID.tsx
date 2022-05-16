import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import React from 'react';
import { ChattingProps } from '@screens/ConferenceScreen/types';
import { getT } from '@utils/translateManager';
import { wehagoMainURL, wehagoDummyImageURL } from '@utils/index';
import { Dimensions } from 'react-native';

import icTrans from '@assets/icons/ic_translator.png';
import icSend from '@assets/icons/ic_send.png';
import icSendW from '@assets/icons/ic_send_w.png';
import deviceInfoModule from 'react-native-device-info';
import ChattingCard from './chatComponents/ChattingCard';

const isPad = deviceInfoModule.isTablet();

const Chatting: React.FC<ChattingProps> = ({
  onPressSend,
  setMyMessage,
  setCdm,
  setIsEndScroll,
  cdm,
  myMessage,
  scrollRef,
  messages,
  myJitsiId
}) => {
  return (
      <View
        style={[styles.container, isPad && { width: true ? '36%' : '49%' }]}
      >
        <View style={{ height: 120 }} />
        <ScrollView
          ref={el => (scrollRef.current = el)}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          onScrollBeginDrag={setIsEndScroll(false)}
          onScrollEndDrag={({ nativeEvent }) => {
            if (nativeEvent.targetContentOffset) {
              const contentOffsetY = nativeEvent.contentOffset.y; // 현재 스크롤 좌표
              const layoutMeasurementHeight =
                nativeEvent.layoutMeasurement.height; // 자식의 단일 component 높이
              const contentSizeHeight = nativeEvent.contentSize.height; // 전체 component 높이
              const isOverScroll =
                contentOffsetY + layoutMeasurementHeight + 2 >
                contentSizeHeight; //  2 은 오차계산
              setIsEndScroll(isOverScroll);
            }
          }}
        >
          <FlatList
            bounces={false}
            data={messages}
            onContentSizeChange={() => scrollRef.current.scrollToEnd()}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
            renderItem={({ item, index }) => {
              if (!cdm && index === messages.length - 1) {
                setCdm(true);
              }
              const isLocalUser = myJitsiId === item.user;
              const profileUrl = item.profileUrl
                ? wehagoMainURL + item.profileUrl
                : wehagoDummyImageURL;

              return (
                <ChattingCard
                  isLocalUser={isLocalUser}
                  profileUrl={profileUrl}
                  userName={item.name}
                  text={item.text}
                />
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
              value={myMessage}
              autoCapitalize="none"
              style={styles.chatInput}
              onChangeText={text => setMyMessage(text)}
              underlineColorAndroid={'rgba(0,0,0,0)'}
            />
            <TouchableOpacity
              style={[
                styles.sendImageContainer,
                {
                  backgroundColor:
                    myMessage.length > 0 ? '#1c90fb' : 'rgba(255,255,255,0.3)'
                }
              ]}
              onPressOut={onPressSend}
            >
              <Image
                source={myMessage.length > 0 ? icSendW : icSend}
                style={styles.sendImage}
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
    flex: 1,
    paddingHorizontal: 15
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
    paddingTop: 8,
    paddingBottom: 10
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
export default Chatting;
