import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  SafeAreaView,
  Platform
} from 'react-native';

import ButtonCamera from '../../../assets/buttons/btn_vc_camera_on.png';
import ButtonCameraOff from '../../../assets/buttons/btn_vc_camera_off.png';
import ButtonMic from '../../../assets/buttons/btn_vc_mike_on.png';
import ButtonMicOff from '../../../assets/buttons/btn_vc_mike_off.png';
import { RTCView } from 'react-native-webrtc';
import { getT } from '../../utils/translateManager';

import icBack from '../../../assets/new/icons/ic_back.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface PresenterProps {
  tracks: any[] | null;
  onConferenceEnter: () => void;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  setName: (name: string) => void;
  nameField: boolean;
  buttonActive: boolean;
  goBack: () => void;
  isHorizon: boolean;
  roomName: string;
  isLoading: boolean;
}

export default function SettingScreenPresenter(props: PresenterProps) {
  const {
    tracks,
    onConferenceEnter,
    onToggleAudio,
    onToggleVideo,
    setName,
    nameField,
    buttonActive,
    goBack,
    isHorizon,
    roomName,
    isLoading
  } = props;
  const t = getT();

  return (
    <Fragment>
      <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
          contentContainerStyle={{
            ...styles.container
          }}
          bounces={false}
          enableOnAndroid={true}
          enableAutomaticScroll={Platform.OS === 'ios'}
          extraHeight={90}
        >
        <View style={[styles.topTitle]}>
          <TouchableOpacity onPress={goBack}>
            <Image source={icBack} style={styles.icBack} resizeMode="cover" />
          </TouchableOpacity>
          <Text style={styles.HeaderTitleText}>{roomName}</Text>
          <TouchableOpacity disabled={true}>
            <Text style={styles.emptyText}>
              {t('renewal.alert_button_confirm')}
            </Text>
          </TouchableOpacity>
        </View>
        
          <TouchableOpacity
            style={{
              flex: 1,
              paddingHorizontal: isHorizon ? '20%' : 15,
              paddingVertical: isHorizon ? 20 : 0
            }}
            activeOpacity={1}
          >
            <View style={styles.settingTitleView}>
              <Text style={styles.settingTitle}>
                {t('renewal.roomstate_setting_title')}
              </Text>
              <Text style={styles.settingSubTitle}>
                {t('renewal.roomstate_setting_detail')}
              </Text>
            </View>
            <View
              style={{
                alignItems: 'center',

                flex: 3
              }}
            >
              <Text style={styles.settingOutputText}>
                {t('renewal.roomstate_setting_output')}
              </Text>

              <View style={styles.settingOutputView}>
                {tracks && tracks[0] && !tracks[0]?.isMuted() && (
                  <RTCView
                    style={styles.rctView}
                    mirror={true}
                    objectFit={'cover'}
                    streamURL={tracks[0]?.getOriginalStream().toURL()}
                    zOrder={1} // zOrder ??? [0, 1] ??? ???????????? (???????)
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
                  style={styles.toggleView}
                  onPress={onToggleVideo}
                >
                  <Image
                    source={
                      tracks && tracks[0]?.isMuted()
                        ? ButtonCameraOff
                        : ButtonCamera
                    }
                    resizeMode={'contain'}
                    style={styles.buttonImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.toggleView}
                  onPress={onToggleAudio}
                >
                  <Image
                    source={
                      tracks && tracks[1]?.isMuted() ? ButtonMicOff : ButtonMic
                    }
                    resizeMode={'contain'}
                    style={styles.buttonImage}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }}></TouchableOpacity>
              </View>
            </View>
            {nameField && (
              <View style={styles.nameFieldView}>
                <Text style={styles.settingUserNameTitle}>
                  {t('renewal.roomstate_setting_name')}
                </Text>
                <TextInput
                  placeholder={t('renewal.roomstate_setting_setname')}
                  placeholderTextColor={'#999'}
                  style={styles.settingUserName}
                  maxLength={20}
                  onChangeText={setName}
                  blurOnSubmit={true}
                ></TextInput>
                <Text style={styles.settingUserNameDafault}>
                  {t('renewal.roomstate_setting_nameDefault')}
                </Text>
              </View>
            )}
            <View style={styles.settingRoomEnterView}>
              <TouchableOpacity
                style={[
                  {
                    backgroundColor: buttonActive && !isLoading
                      ? 'rgb(28,144,251)'
                      : 'rgb(125,125,125)'
                  },
                  styles.settingRoomEnterTouch
                ]}
                onPressOut={onConferenceEnter}
                disabled={!buttonActive || isLoading}
              >
                <Text style={styles.settingRoomEnterText}>
                  {t('renewal.roomstate_setting_enter')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
    // top: 80
  },
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderColor: '#d1d1d1',
    borderBottomWidth: 1
  },
  HeaderTitleText: {
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
    color: '#000'
  },
  emptyText: {
    fontSize: 14,
    color: '#00ff0000'
  },
  icBack: {
    width: 24,
    height: 24
  },
  nameFieldView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 1
  },
  settingTitle: {
    fontSize: 17,
    color: '#000',
    paddingBottom: 10,
    fontFamily: 'DOUZONEText50'
  },
  settingSubTitle: {
    fontSize: 13,
    color: 'rgb(140,140,140)',
    fontFamily: 'DOUZONEText30'
  },
  settingTitleView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 1
  },
  settingOutputText: {
    fontSize: 14,
    color: 'rgb(51,51,51)',
    paddingBottom: 5,
    fontFamily: 'DOUZONEText30'
  },
  settingOutputView: {
    flex: 1,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row'
  },
  rctView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1D1D1D',
    zIndex: 0
  },
  buttonImage: {
    width: 55,
    height: 55
  },
  toggleView: {
    flex: 2,
    alignItems: 'center',
    zIndex: 2
  },
  settingUserNameTitle: {
    width: '100%',
    paddingLeft: 5,
    fontFamily: 'DOUZONEText30'
  },
  settingUserName: {
    borderColor: 'rgb(201,205,213)',
    borderWidth: 1,
    width: '100%',
    height: 52,
    marginVertical: 10,
    paddingHorizontal: 10,  
    fontFamily: 'DOUZONEText30'
  },
  settingUserNameDafault: {
    width: '100%',
    paddingLeft: 5,
    color: 'rgb(140,140,140)',
    fontSize: 11,
    fontFamily: 'DOUZONEText30'
  },
  settingRoomEnterView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    flex: 1
  },
  settingRoomEnterTouch: {
    borderRadius: 110,
    width: '80%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingRoomEnterText: {
    fontSize: 16,
    color: '#fff',
    borderWidth: 0,
    borderColor: '#fff',
    fontFamily: 'DOUZONEText30'
  }
});

// export default function SettingScreenPresenter(props: any) {
//   const {tracks, onConferenceEnter, onToggleAudio, onToggleVideo, setName,  nameField, buttonActive, goBack} = props;
//   const t = getT();
//   return (
//     <Fragment>
//       {/* <SafeAreaView style={{ flex: 0, backgroundColor: '#1c90fb' }} /> */}
//       <SafeAreaView style={styles.container}>
//         <View style={[styles.topTitle]}>
//           <TouchableOpacity onPress={goBack}>
//             <Image
//               source={icBack}
//               style={{ width: 24, height: 24 }}
//               resizeMode="cover"
//             />
//           </TouchableOpacity>
//           <Text style={styles.HeaderTitleText}>?????? ??????</Text>
//           <TouchableOpacity disabled={true}>
//             <Text style={styles.emptyText}>??????</Text>
//           </TouchableOpacity>
//         </View>
//         {/* <View
//           style={{
//             height: 50,
//             backgroundColor: '#1c90fb',
//             flexDirection: 'row',
//             paddingHorizontal: 20,
//             justifyContent: 'center',
//             alignItems: 'center'
//           }}
//         >
//           <TouchableOpacity onPress={goBack}>
//             <Image
//               source={icBack}
//               resizeMode={'contain'}
//               style={{ width: 30 }}
//             />
//           </TouchableOpacity>
//           <Text
//             style={{
//               flex: 1,
//               textAlign: 'center',
//               fontSize: 18,
//               color: '#fff'
//             }}
//           >
//             {t('option_awards')}
//           </Text>
//           <View style={{ width: 30 }} />
//         </View> */}
//         <KeyboardAvoidingView
//           style={{
//             ...styles.container,
//             paddingHorizontal: orientation === 'horizontal' ? '20%' : 15,
//             paddingVertical: orientation === 'horizontal' ? 20 : 0
//           }}
//           behavior={'height'}
//         >
//           <TouchableOpacity style={{ flex: 1 }} activeOpacity={1}>
//             <View
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100%',
//                 flex: 1
//               }}
//             >
//               <Text style={{ fontSize: 17, color: '#000', paddingBottom: 10 }}>
//                 {t('roomstate_setting_title')}
//               </Text>
//               <Text style={{ fontSize: 12, color: 'rgb(140,140,140)' }}>
//                 {t('roomstate_setting_detail')}
//               </Text>
//             </View>
//             <View
//               style={{
//                 // justifyContent: 'center',
//                 alignItems: 'center',
//                 // height: '100%',
//                 flex: 3
//                 // backgroundColor: '#158'
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   color: 'rgb(51,51,51)',
//                   paddingBottom: 5
//                 }}
//               >
//                 {t('roomstate_setting_output')}
//               </Text>

//               <View
//                 style={{
//                   flex: 1,
//                   width: '100%',
//                   marginBottom: 20,
//                   alignItems: 'center',
//                   justifyContent: 'space-around',
//                   flexDirection: 'row'
//                 }}
//               >
//                 {tracks && tracks[0] && !tracks[0]?.isMuted() && (
//                   <RTCView
//                     style={{
//                       // flex: 1,
//                       position: 'absolute',
//                       top: 0,
//                       bottom: 0,
//                       left: 0,
//                       right: 0,
//                       // height: '100%',
//                       backgroundColor: '#1D1D1D',
//                       zIndex: 0
//                     }}
//                     mirror={true}
//                     // mirror={!isVideoReverse}
//                     objectFit={'cover'}
//                     streamURL={tracks[0]?.getOriginalStream().toURL()}
//                     zOrder={1} // zOrder ??? [0, 1] ??? ???????????? (???????)
//                   />
//                 )}
//                 <View
//                   style={{
//                     position: 'absolute',
//                     top: 0,
//                     bottom: 0,
//                     left: 0,
//                     right: 0,
//                     zIndex: 1,
//                     backgroundColor: '#00000077'
//                   }}
//                 ></View>
//                 <TouchableOpacity style={{ flex: 1 }}></TouchableOpacity>
//                 <TouchableOpacity
//                   style={{
//                     flex: 2,
//                     alignItems: 'center',
//                     zIndex: 2
//                   }}
//                   onPress={onToggleVideo}
//                 >
//                   <Image
//                     source={
//                       tracks && tracks[0]?.isMuted()
//                         ? ButtonCameraOff
//                         : ButtonCamera
//                     }
//                     resizeMode={'contain'}
//                     style={{
//                       width: 55,
//                       height: 55
//                     }}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   style={{
//                     flex: 2,
//                     alignItems: 'center',
//                     zIndex: 2
//                   }}
//                   onPress={onToggleAudio}
//                 >
//                   <Image
//                     source={
//                       tracks && tracks[1]?.isMuted() ? ButtonMicOff : ButtonMic
//                     }
//                     resizeMode={'contain'}
//                     style={{
//                       width: 55,
//                       height: 55
//                     }}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity style={{ flex: 1 }}></TouchableOpacity>
//               </View>
//             </View>
//             {nameField && (
//               <View
//                 style={{
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   height: '100%',
//                   flex: 1
//                 }}
//               >
//                 <Text style={{ width: '100%', paddingLeft: 5 }}>
//                   {t('roomstate_setting_name')}
//                 </Text>
//                 <TextInput
//                   placeholder={t('roomstate_setting_setname')}
//                   placeholderTextColor={'#999'}
//                   style={{
//                     borderColor: 'rgb(201,205,213)',
//                     borderWidth: 1,
//                     width: '100%',
//                     height: 52,
//                     marginVertical: 10,
//                     paddingHorizontal: 5
//                   }}
//                   maxLength={20}
//                   onChangeText={onSetName}
//                   blurOnSubmit={true}
//                 ></TextInput>
//                 <Text
//                   style={{
//                     width: '100%',
//                     paddingLeft: 5,
//                     color: 'rgb(140,140,140)',
//                     fontSize: 11
//                   }}
//                 >
//                   {t('roomstate_setting_nameDefault')}
//                 </Text>
//               </View>
//             )}
//             <View
//               style={{
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 height: '100%',
//                 flex: 1
//               }}
//             >
//               <TouchableOpacity
//                 style={{
//                   backgroundColor: buttonActive
//                     ? 'rgb(28,144,251)'
//                     : 'rgb(125,125,125)',
//                   borderRadius: 110,
//                   width: '80%',
//                   height: 50,
//                   justifyContent: 'center',
//                   alignItems: 'center'
//                 }}
//                 onPressOut={onConferenceEnter}
//                 disabled={!buttonActive}
//               >
//                 <Text
//                   style={{
//                     fontSize: 15,
//                     color: '#fff',
//                     borderWidth: 0,
//                     borderColor: '#fff'
//                   }}
//                 >
//                   {t('roomstate_setting_enter')}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </TouchableOpacity>
//         </KeyboardAvoidingView>
//       </SafeAreaView>
//     </Fragment>
//   );
// }
