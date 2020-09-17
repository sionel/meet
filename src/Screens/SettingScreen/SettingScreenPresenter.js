import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  Text,
  TextInput,
  Button,
  ImageBackground,
  Dimensions
} from 'react-native';
// 이건 좀 많이 추후에
import test from '../../../assets/ttttest.png';
import test1 from '../../../assets/Basic.png';
import ButtonCamera from '../../../assets/buttons/btn_vc_camera_on.png';
import ButtonCameraOff from '../../../assets/buttons/btn_vc_camera_off.png';
import ButtonMic from '../../../assets/buttons/btn_vc_mike_on.png';
import ButtonMicOff from '../../../assets/buttons/btn_vc_mike_off.png';
import { RTCView } from 'react-native-webrtc';

export default function SettingScreenPresenter(props) {
  const { height, width } = Dimensions.get('window');

  return (
    <>
      {/* <SafeAreaView
        style={{
          // position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 53,
          backgroundColor: '#1C90FB',
          // paddingTop:30,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text
          style={{
            fontSize: 18,
            marginHorizontal: 12,
            fontFamily: 'DOUZONEText50',
            color: '#FFF'
          }}
        >
          {'WEHAGO Meet'}
        </Text>
      </SafeAreaView> */}

      <View
        style={{
          ...styles.container,
          paddingHorizontal: props.orientation === 'horizontal' ? '20%' : 15,
          paddingVertical: props.orientation === 'horizontal' ? 20 : 0
        }}
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
              backgroundColor: '#a42',
              width: '100%',
              marginBottom: 20
            }}
          >
            {props.tracks[0] && (
              <RTCView
                style={{
                  // flex: 1,
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  // height: '100%',
                  backgroundColor: '#1D1D1D'
                }}
                mirror={true}
                // mirror={!isVideoReverse}
                objectFit={'cover'}
                streamURL={props.tracks[0]?.getOriginalStream().toURL()}
                zOrder={1} // zOrder 는 [0, 1] 만 사용가능 (아마?)
              />
            )}
          </View>
        </View>
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
          ></TextInput>
          <Text style={{ width: '100%', paddingLeft: 5 }}>
            {'입력하지 않을 경우, 기본값이 적용됩니다.\n(최대 20자 설정가능)'}
          </Text>
        </View>
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
              borderWidth: 1,
              borderRadius: 110,
              width: '80%',
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            onPressOut={props.onBack}
          >
            <Text style={{ fontSize: 15, color: '#fff' }}>
              {'화상대화 참여'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
    // top: 80
  }
});
