import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import icUserW from '@assets/icons/ic_user_w2.png';
import icChatW from '@assets/icons/ic_chat_w.png';
import icChangeW from '@assets/icons/ic_change_w2.png';
import icInvertW from '@assets/icons/ic_invert_w.png';
import icMoreW from '@assets/icons/ic_more_w.png';
import icMaster from '@assets/icons/ic_master.png';

type TopAreaPresenterProps = {
  talkButton: boolean;
  penButton: boolean;
  docShareButton: boolean;
  screenShareButton: boolean;
  switchButton: boolean;
  reverseButton: boolean;
  orientation: 'horizontal' | 'vertical';
  onChangeDrawingMode: () => void;
  toggleDocumentListMode: Function;
  toggleScreenFlag: () => void;
  toggleCameraFacingMode: () => void;
  onReverseVideo: () => void;
  conferenceMode: string;
  mainUser: any;
  elapsedTime: string;
  isMaster: boolean;
};

const TopAreaPresenter = (props: TopAreaPresenterProps) => {
  const {
    talkButton,
    penButton,
    docShareButton,
    screenShareButton,
    switchButton,
    reverseButton,
    orientation,
    onChangeDrawingMode,
    toggleDocumentListMode,
    toggleScreenFlag,
    toggleCameraFacingMode,
    onReverseVideo,
    conferenceMode,
    mainUser,
    elapsedTime,
    isMaster
  } = props;

    // console.log('userList : ', userList);
    // console.log('mainUser2 : ', mainUser);
    

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '5%',
        zIndex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
        // alignItems:'center'
      }}
    >
      <View
        style={{
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          paddingHorizontal: '5%',
          height: 48
        }}
      >
        <View style={{}}>
          <Text
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.87)',
              textAlign: 'center',
              fontFamily: 'DOUZONEText50'
            }}
          >
            {elapsedTime !== '00:00:00' ? elapsedTime : ''}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          {penButton && (
            <TouchableOpacity
              style={{ width: 24, height: 24, marginHorizontal: 10 }}
              onPress={() => toggleDocumentListMode(['USERLIST'])}
            >
              <Image
                source={icUserW}
                resizeMode={'cover'}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            // <CustomButton
            //   name="pen"
            //   width={24}
            //   height={24}
            //   areaWidth={42}
            //   areaHeight={36}
            //   onPress={_.throttle(() => onChangeDrawingMode(true), 500)}
            // />
          )}
          {talkButton && (
            <TouchableOpacity
              style={{ width: 24, height: 24, marginHorizontal: 10 }}
              onPress={() => toggleDocumentListMode(['CHATTING'])}
            >
              <Image
                source={icChatW}
                resizeMode={'cover'}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          )}

          {
            docShareButton && null
            // <CustomButton
            //   name="docShare"
            //   width={28}
            //   height={28}
            //   areaWidth={42}
            //   areaHeight={36}
            //   onPress={_.throttle(() => toggleDocumentListMode(['FILELIST']), 500)}
            // />
          }
          {
            screenShareButton && null
            // <CustomButton
            //   name="icoScreenShagre"
            //   width={28}
            //   height={28}
            //   areaWidth={42}
            //   areaHeight={36}
            //   onPress={toggleScreenFlag}
            // />
          }
          {switchButton && (
            <TouchableOpacity
              style={{ width: 24, height: 24, marginHorizontal: 10 }}
              onPress={toggleCameraFacingMode}
            >
              <Image
                source={icChangeW}
                resizeMode={'cover'}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            // <CustomButton
            //   name="switch"
            //   width={30}
            //   height={30}
            //   areaWidth={42}
            //   areaHeight={36}
            //   onPress={toggleCameraFacingMode}
            // />
          )}
          {reverseButton && (
            <TouchableOpacity
              style={{ width: 24, height: 24, marginLeft: 10 }}
              onPress={onReverseVideo}
            >
              <Image
                source={icInvertW}
                resizeMode={'cover'}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
            // <CustomButton
            //   name="reverse"
            //   onPress={onReverseVideo}
            //   width={24}
            //   height={24}
            //   areaWidth={42}
            //   areaHeight={36}
            //   // style={{
            //   //   backgroundColor: '#faf'
            //   // }}
            // />
          )}
          <TouchableOpacity
            style={{ width: 24, height: 24, marginLeft: 10 }}
            onPress={() => {}}
          >
            <Image
              source={icMoreW}
              resizeMode={'cover'}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 15,
          height: 32,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignSelf: 'center',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        {isMaster && (
          <Image
            source={icMaster}
            resizeMode={'cover'}
            style={{ width: 18, height: 18, marginRight: 4 }}
          />
        )}
        <Text style={styles.name}>{mainUser.userInfo.userName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#000'
  },
  containerVertical: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 40,
    marginHorizontal: 10,
    alignItems: 'flex-start'
  },
  containerHorizontal: {
    flex: 1,
    flexDirection: 'column',
    marginVertical: 10,
    marginHorizontal: 20
  },
  timeBoxVertical: {
    flex: 2,
    justifyContent: 'flex-end',
    alignItems: 'flex-start'
  },
  timeBoxHorizontal: {
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
//   settingBoxVertical: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'flex-end'
//     // backgroundColor: '#d12d'
//   },
//   settingBoxHorizontal: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'flex-start',
//     marginVertical: 10
//     // backgroundColor: '#12d'
//   },
  name: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 16,
  },
});

export default TopAreaPresenter;
