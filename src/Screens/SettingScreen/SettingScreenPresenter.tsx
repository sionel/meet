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

import icVideoOn from '@assets/icons/ic_video_on.png';
import icVideoOff from '@assets/icons/ic_video_off.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';
import icCharacter1 from '@assets/icons/ic_setting_man.png';
import icCharacter2 from '@assets/icons/ic_setting_jessie.png';
import icCharacter3 from '@assets/icons/ic_setting_suzy.png';
import icCheckW from '@assets/icons/ic_check_wh.png';
import { RTCView } from 'react-native-webrtc';
import { getT } from '@utils/translateManager';

import icBack from '@assets/icons/ic_back.png';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import deviceInfoModule from 'react-native-device-info';

const isPad = deviceInfoModule.isTablet();

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
  selectedToon: 'jangok' | 'suzy' | 'jessie';
  setSelectedToon: (toon: 'jangok' | 'suzy' | 'jessie') => void;
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
    isLoading,
    selectedToon,
    setSelectedToon
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
              paddingHorizontal: isPad ? isHorizon ? '32%' : '25%' : 15,
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
                flex: isPad ? isHorizon ? 3 : 1.5 : 3
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
                    zOrder={1} // zOrder 는 [0, 1] 만 사용가능 (아마?)
                  />
                )}
                <View
                  style={[{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
                    elevation: 1,
                    backgroundColor:
                      tracks && tracks[0] && tracks[0]?.isMuted()
                        ? '#000'
                        : '#00000077'
                  }, isPad && {borderRadius: 15}]}
                />
                {tracks && tracks[0] && tracks[0]?.isMuted() && (
                  <View style={styles.toonRow}>
                    <TouchableOpacity
                      style={[styles.characterView, { marginRight: 10 }]}
                      onPressOut={() => setSelectedToon('jangok')}
                    >
                      <Image
                        source={icCharacter1}
                        resizeMode={'cover'}
                        style={[
                          styles.characterImage,
                          selectedToon === 'jangok' && { opacity: 0.8 }
                        ]}
                      />
                      {selectedToon === 'jangok' && (
                        <View style={styles.characterCheckVeiw}>
                          <Image
                            source={icCheckW}
                            resizeMode={'cover'}
                            style={styles.icCheck}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.characterView, { marginRight: 10 }]}
                      onPressOut={() => setSelectedToon('jessie')}
                    >
                      <Image
                        source={icCharacter2}
                        resizeMode={'cover'}
                        style={[
                          styles.characterImage,
                          selectedToon === 'jessie' && { opacity: 0.8 }
                        ]}
                      />
                      {selectedToon === 'jessie' && (
                        <View style={styles.characterCheckVeiw}>
                          <Image
                            source={icCheckW}
                            resizeMode={'cover'}
                            style={styles.icCheck}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.characterView}
                      onPressOut={() => setSelectedToon('suzy')}
                    >
                      <Image
                        source={icCharacter3}
                        resizeMode={'cover'}
                        style={[
                          styles.characterImage,
                          selectedToon === 'suzy' && { opacity: 0.8 }
                        ]}
                      />
                      {selectedToon === 'suzy' && (
                        <View style={styles.characterCheckVeiw}>
                          <Image
                            source={icCheckW}
                            resizeMode={'cover'}
                            style={styles.icCheck}
                          />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.buttonImageView}>
                  <TouchableOpacity
                    style={[styles.toggleView, { marginRight: 16 }]}
                    onPress={onToggleAudio}
                  >
                    <Image
                      source={
                        tracks && tracks[1]?.isMuted() ? icMicOff : icMicOn
                      }
                      resizeMode={'contain'}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.toggleView}
                    onPress={onToggleVideo}
                  >
                    <Image
                      source={
                        tracks && tracks[0]?.isMuted() ? icVideoOff : icVideoOn
                      }
                      resizeMode={'contain'}
                      style={styles.buttonImage}
                    />
                  </TouchableOpacity>
                </View>
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
              <LinearGradient
                end={{ x: 0, y: 0 }}
                start={{ x: 1, y: 0 }}
                colors={
                  !buttonActive || isLoading
                    ? ['rgb(125,125,125)', 'rgb(125,125,125)']
                    : ['#3BBFF0', '#1C90FB']
                }
                style={styles.settingRoomEnterTouch}
              >
                <TouchableOpacity
                  style={styles.settingRoomEnterTouch}
                  onPressOut={onConferenceEnter}
                  disabled={!buttonActive || isLoading}
                >
                  <Text style={styles.settingRoomEnterText}>
                    {t('renewal.roomstate_setting_enter')}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
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
    justifyContent: 'center',
    alignItems: 'center'
  },
  rctView: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1D1D1D',
    zIndex: 0,
    borderRadius: isPad ? 15 : 0 
  },
  toonRow: {
    flexDirection: 'row',
    zIndex: 2,
    elevation: 2,
    justifyContent: 'center'
  },
  characterView: {
    width: 104,
    height: 104
  },
  characterImage: {
    width: 104,
    height: 104
  },
  characterCheckVeiw: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1c90fb',
    position: 'absolute',
    top: 4,
    right: 4
  },
  toggleView: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonImageView: {
    position: 'absolute',
    bottom: 30,
    zIndex: 2,
    elevation: 2,
    paddingHorizontal: '35%',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonImage: {
    width: 24,
    height: 24
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
  },
  icCheck: { width: 11.1, height: 8.4 }
});
