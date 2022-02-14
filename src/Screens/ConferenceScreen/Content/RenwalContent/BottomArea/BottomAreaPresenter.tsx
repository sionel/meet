import React, { Fragment } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import deviceInfoModule from 'react-native-device-info';
import icSpeakerOn from '@assets/icons/ic_speaker_on.png';
import icSpeakerOff from '@assets/icons/ic_speaker_off.png';
import icVideoOn from '@assets/icons/ic_video_on.png';
import icVideoOff from '@assets/icons/ic_video_off.png';
import icMicOn from '@assets/icons/ic_mic_on.png';
import icMicOff from '@assets/icons/ic_mic_off.png';
import icCallEnd from '@assets/icons/ic_call_end.png';
import { ConferenceModes } from '@utils/Constants';
import ParticipantBox from './ParticipantBox';
import { FlatList } from 'react-native-gesture-handler';
import { ParticipantsTypes } from '@redux/participants';

type BottomAreaProps = {
  orientation: 'horizontal' | 'vertical';
  callType: number;
  speaker: number;
  isScreenShare: boolean;
  conferenceMode: string;
  isMuteVideo: boolean;
  isMuteMic: boolean;
  onClose: () => void;
  onChangeSpeaker: () => void;
  onChangeMicMaster: () => void;
  handleToggleMic: () => void;
  toggleMuteVideo: () => void;
  toggleMuteMic: () => void;
  user: any;
  mainUserId: any;
  list: ParticipantsTypes[];
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: any;
};

const isTablet = deviceInfoModule.isTablet();
const { height } = Dimensions.get('window');

const BottomAreaPresenter = (props: BottomAreaProps) => {
  const {
    callType,
    speaker,
    isMuteVideo,
    toggleMuteVideo,
    isMuteMic,
    toggleMuteMic,
    isScreenShare,
    onChangeSpeaker,
    onClose,
    conferenceMode,
    orientation,
    user,
    mainUserId,
    list,
    userList,
    isMultipleView,
    setIsMultipleView
  } = props;

  const multiViewHeight = height * 0.75;

  return (
    <View
      style={[
        styles.bottomArea,
        { left: 0, right: 0, bottom: '5%', flexDirection: 'column' }
      ]}
    >
      {Number(callType) === 2
        ? null
        : (conferenceMode === ConferenceModes.NORMAL || isScreenShare) && (
            <Fragment>
              <TouchableOpacity
                style={{
                  width: 100,
                  height: 20,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onPress={() => setIsMultipleView(!isMultipleView)}
              >
                <View
                  style={{
                    width: 52,
                    height: 5,
                    borderRadius: 3,
                    backgroundColor: '#fff'
                  }}
                />
              </TouchableOpacity>
              {isMultipleView ? (
                <FlatList
                  data={userList}
                  windowSize={6}
                  numColumns={2}
                  style={{
                    // paddingLeft: '5%',
                    flex: 1,
                    height: multiViewHeight
                  }}
                  renderItem={({ item, index }) => {
                    const { length } = list;
                    return length > -1 ? (
                      <ParticipantBox
                        key={item.id}
                        index={index}
                        user={item}
                        videoTrack={item.videoTrack}
                        isSelect={mainUserId === item.id}
                        isMultipleView={true}
                        setIsMultipleView={setIsMultipleView}
                      />
                    ) : null;
                  }}
                />
              ) : (
                <ScrollView
                  horizontal={orientation === 'vertical'}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.scrollView,
                    list.length === 0 ? { margin: 0, padding: 0 } : {}
                  ]}
                  scrollEventThrottle={0} // ios전용 이벤트를 얼마나 발생할지에 대한 빈도 0-16 16하면 디게많이 발생
                >
                  {user && mainUserId !== user.id ? (
                    <ParticipantBox
                      key={user.id}
                      user={user}
                      videoTrack={user.videoTrack}
                      isSelect={mainUserId === user.id}
                      isMultipleView={false}
                    />
                  ) : null}
                  {list.map(
                    (participant: any) =>
                      mainUserId !== participant.id && (
                        <ParticipantBox
                          key={participant.id}
                          user={participant}
                          isSelect={mainUserId === participant.id}
                          isMultipleView={false}
                        />
                      )
                  )}
                </ScrollView>
              )}
            </Fragment>
          )}
      <View
        style={{ flexDirection: 'row' }}
        // style={[
        //   styles.bottomArea,
        //   orientation === 'vertical'
        //     ? styles.bottomAreaVertical
        //     : styles.bottomAreaHorizontal
        // ]}
      >
        {/* 스피커 */}
        {!isTablet && (
          <TouchableOpacity
            style={styles.bottonTouch}
            onPressOut={onChangeSpeaker}
          >
            <Image
              source={speaker == 2 ? icSpeakerOff : icSpeakerOn}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        )}
        {/* 마이크 */}
        <TouchableOpacity style={styles.bottonTouch} onPressOut={toggleMuteMic}>
          <Image
            source={isMuteMic ? icMicOff : icMicOn}
            style={styles.buttonImage}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
        {/* 카메라 */}
        {Number(callType) !== 2 && !isScreenShare && (
          <TouchableOpacity
            style={styles.bottonTouch}
            onPressOut={toggleMuteVideo}
          >
            <Image
              source={isMuteVideo ? icVideoOff : icVideoOn}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        )}
        {isScreenShare && (
          <TouchableOpacity style={styles.bottonTouch} onPress={() => {}}>
            <Image
              source={icVideoOff}
              style={styles.buttonImage}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        )}
        {/* 회의종료 */}
        <TouchableOpacity
          style={[styles.bottonTouch, { backgroundColor: '#ef5334' }]}
          onPressOut={onClose}
        >
          <Image
            source={icCallEnd}
            style={styles.buttonImage}
            resizeMode={'cover'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottonTouch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    margin: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonImage: {
    width: 24,
    height: 24
  },
  bottomArea: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  bottomAreaVertical: {
    bottom: '5%',
    left: 0,
    right: 0,
    flexDirection: 'row'
  },
  bottomAreaHorizontal: {
    right: '5%',
    top: 0,
    bottom: 0,
    flexDirection: 'column'
  },
  scrollView: {
    margin: 10,
    flexGrow: 1,
    justifyContent: 'center',
    flex: 1
  }
});

export default BottomAreaPresenter;
