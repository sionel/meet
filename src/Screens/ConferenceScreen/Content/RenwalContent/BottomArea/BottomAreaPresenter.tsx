import React, { Fragment } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
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
import { ConferenceBottomPopupProps } from '../../ContentContainer';

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
  user: any;
  mainUserId: any;
  list: ParticipantsTypes[];
  userList: ParticipantsTypes[];
  isMultipleView: boolean;
  setIsMultipleView: any;
  bottomPopup: ConferenceBottomPopupProps;
  width: number;
  height: number;
};

const isTablet = deviceInfoModule.isTablet();

const BottomAreaPresenter = (props: BottomAreaProps) => {
  const {
    callType,
    speaker,
    isMuteVideo,
    toggleMuteVideo,
    handleToggleMic,
    isMuteMic,
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
    setIsMultipleView,
    bottomPopup,
    width,
    height
  } = props;

  return bottomPopup.popupType === 'CHATTING' ? null : (
    <View
      style={[
        styles.bottomArea,
        { left: 0, right: 0, bottom: '5%', flexDirection: 'column' }
      ]}
    >
      {Number(callType) === 2
        ? null
        : conferenceMode === ConferenceModes.CONTROL &&
          !isScreenShare && (
            <Fragment>
              {/* <PanGestureHandler
            onHandlerStateChange={({ nativeEvent }) => {
              const { velocityY, state, numberOfPointers } = nativeEvent;
              if (velocityY !== 0 && (state > 4 || numberOfPointers === 0)) {
                !bottomPopup.show && setIsMultipleView(!isMultipleView);
              } else {
              }
            }}
            onGestureEvent={onPanGestureEvent}
          /> */}

              <TouchableOpacity
                style={styles.multiViewTouch}
                onPress={() => {
                  !bottomPopup.show && setIsMultipleView(!isMultipleView);
                }}
              >
                <View style={styles.multiViewBar}></View>
              </TouchableOpacity>

              {isMultipleView ? (
                <FlatList
                  data={userList}
                  windowSize={6}
                  numColumns={2}
                  style={{
                    marginTop: 10,
                    flex: 1,
                    marginBottom: Platform.OS === 'ios' ? 10 : 0,
                    height: Platform.OS === 'ios' ? height * 0.7 : height * 0.65
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
                        width={width}
                        height={height}
                      />
                    ) : null;
                  }}
                />
              ) : (
                <ScrollView
                  horizontal={true}
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
                      width={width}
                      height={height}
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
                          width={width}
                          height={height}
                        />
                      )
                  )}
                </ScrollView>
              )}
            </Fragment>
          )}
      <View style={{ flexDirection: 'row', marginTop: 24 }}>
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
        <TouchableOpacity
          style={styles.bottonTouch}
          onPressOut={handleToggleMic}
        >
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
    zIndex: 1,
    elevation: 1
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
  },
  multiViewTouch: {
    width: 120,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  multiViewBar: {
    width: 80,
    height: 8,
    borderRadius: 3,
    backgroundColor: '#fff',
    elevation: 2,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  }
});

export default BottomAreaPresenter;
