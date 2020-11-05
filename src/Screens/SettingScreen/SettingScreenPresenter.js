import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
} from 'react-native';

import ButtonCamera from '../../../assets/buttons/btn_vc_camera_on.png';
import ButtonCameraOff from '../../../assets/buttons/btn_vc_camera_off.png';
import ButtonMic from '../../../assets/buttons/btn_vc_mike_on.png';
import ButtonMicOff from '../../../assets/buttons/btn_vc_mike_off.png';
import { RTCView } from 'react-native-webrtc';

export default function SettingScreenPresenter({
  tracks,
  orientation,
  onConferenceEnter,
  onToggleAudio,
  onToggleVideo,
  onSetName,
  nameField
}) {
  return (
    <KeyboardAvoidingView
      style={{
        ...styles.container,
        paddingHorizontal: orientation === 'horizontal' ? '20%' : 15,
        paddingVertical: orientation === 'horizontal' ? 20 : 0
      }}
      behavior={'height'}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => {
          // if (this.textInput.isFocused()) {
          //   Keyboard.dismiss();
          //   this.textInput.blur();
          // }
        }}
        activeOpacity={1}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1
          }}
        >
          <Text style={{ fontSize: 17, color: '#000', paddingBottom: 10 }}>
            {'화상대화 전 기본 설정을 진행해주세요.'}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgb(140,140,140)' }}>
            {'원치 않을 경우, 바로 화상대화 참여 버튼클릭 후 진입가능합니다.'}
          </Text>
        </View>
        <View
          style={{
            // justifyContent: 'center',
            alignItems: 'center',
            // height: '100%',
            flex: 3
            // backgroundColor: '#158'
          }}
        >
          <Text
            style={{ fontSize: 14, color: 'rgb(51,51,51)', paddingBottom: 5 }}
          >
            {'디스플레이 및 사운드 오디오 출력설정'}
          </Text>

          <View
            style={{
              flex: 1,
              width: '100%',
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'space-around',
              flexDirection: 'row'
            }}
          >
            {tracks[0] && !tracks[0]?.isMuted() && (
              <RTCView
                style={{
                  // flex: 1,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  // height: '100%',
                  backgroundColor: '#1D1D1D',
                  zIndex: 0
                }}
                mirror={true}
                // mirror={!isVideoReverse}
                objectFit={'cover'}
                streamURL={tracks[0]?.getOriginalStream().toURL()}
                zOrder={1} // zOrder 는 [0, 1] 만 사용가능 (아마?)
              />
            )}
            <View
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                backgroundColor: '#00000077'
              }}
            ></View>
            <TouchableOpacity style={{ flex: 1 }}></TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 2,
                alignItems: 'center',
                zIndex: 2
              }}
              onPress={onToggleVideo}
            >
              <Image
                source={tracks[0]?.isMuted() ? ButtonCameraOff : ButtonCamera}
                resizeMode={'contain'}
                style={{
                  width: 55,
                  height: 55
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 2,
                alignItems: 'center',
                zIndex: 2
              }}
              onPress={onToggleAudio}
            >
              <Image
                source={tracks[1]?.isMuted() ? ButtonMicOff : ButtonMic}
                resizeMode={'contain'}
                style={{
                  width: 55,
                  height: 55
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1 }}></TouchableOpacity>
          </View>
        </View>
        {nameField && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              flex: 1
            }}
          >
            <Text style={{ width: '100%', paddingLeft: 5 }}>{'이름 설정'}</Text>
            <TextInput
              ref={aaa => {
                this.textInput = aaa;
              }}
              placeholder={'대화방에서 사용할 이름을 설정해주세요.'}
              placeholderTextColor={'#999'}
              style={{
                borderColor: 'rgb(201,205,213)',
                borderWidth: 1,
                width: '100%',
                height: 52,
                marginVertical: 10,
                paddingHorizontal: 5
              }}
              maxLength={20}
              onChangeText={onSetName}
              onBlur={() => {
                console.log('@@@ehla');
              }}
              blurOnSubmit={true}
            ></TextInput>
            <Text
              style={{
                width: '100%',
                paddingLeft: 5,
                color: 'rgb(140,140,140)',
                fontSize: 11
              }}
            >
              {'입력하지 않을 경우, 기본값이 적용됩니다.(최대 20자 설정가능)'},
            </Text>
          </View>
        )}
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: 'rgb(28,144,251)',
              borderRadius: 110,
              width: '80%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPressOut={onConferenceEnter}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#fff',
                borderWidth: 0,
                borderColor: '#fff'
              }}
            >
              {'화상대화 참여'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
    // top: 80
  }
});
