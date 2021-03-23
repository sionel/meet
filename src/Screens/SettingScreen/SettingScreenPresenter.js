import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput
} from 'react-native';

import ButtonCamera from '../../../assets/buttons/btn_vc_camera_on.png';
import ButtonCameraOff from '../../../assets/buttons/btn_vc_camera_off.png';
import ButtonMic from '../../../assets/buttons/btn_vc_mike_on.png';
import ButtonMicOff from '../../../assets/buttons/btn_vc_mike_off.png';
import { RTCView } from 'react-native-webrtc';
import { getT } from '../../utils/translateManager';

export default function SettingScreenPresenter({
  tracks,
  orientation,
  onConferenceEnter,
  onToggleAudio,
  onToggleVideo,
  onSetName,
  nameField,
  buttonActive
}) {
  const t = getT();
  return (
    <KeyboardAvoidingView
      style={{
        ...styles.container,
        paddingHorizontal: orientation === 'horizontal' ? '20%' : 15,
        paddingVertical: orientation === 'horizontal' ? 20 : 0
      }}
      behavior={'height'}
    >
      <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            flex: 1
          }}
        >
          <Text style={{ fontSize: 17, color: '#000', paddingBottom: 10 }}>
            {t('roomstate.setting.title')}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgb(140,140,140)' }}>
            {t('roomstate.setting.detail')}
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
            {t('roomstate.setting.output')}
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
            {tracks && tracks[0] && !tracks[0]?.isMuted() && (
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
                source={
                  tracks && tracks[0]?.isMuted()
                    ? ButtonCameraOff
                    : ButtonCamera
                }
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
                source={
                  tracks && tracks[1]?.isMuted() ? ButtonMicOff : ButtonMic
                }
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
            <Text style={{ width: '100%', paddingLeft: 5 }}>
              {t('roomstate.setting.name')}
            </Text>
            <TextInput
              placeholder={t('roomstate.setting.setname')}
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
              {t('roomstate.setting.nameDefault')}
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
              backgroundColor: buttonActive
                ? 'rgb(28,144,251)'
                : 'rgb(125,125,125)',
              borderRadius: 110,
              width: '80%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPressOut={onConferenceEnter}
            disabled={!buttonActive}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#fff',
                borderWidth: 0,
                borderColor: '#fff'
              }}
            >
              {t('roomstate.setting.enter')}
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
