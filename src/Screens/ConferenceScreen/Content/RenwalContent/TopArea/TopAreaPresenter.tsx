import React, { Fragment } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';

// import {TouchableHighlight, TouchableOpacity} from 'react-native-gesture-handler'
import icUserW from '@assets/icons/ic_user_w2.png';
import icChatW from '@assets/icons/ic_chat_w.png';
import icChangeW from '@assets/icons/ic_change_w2.png';
import icInvertW from '@assets/icons/ic_invert_w.png';
import icMoreW from '@assets/icons/ic_more_w.png';
import icMaster from '@assets/icons/ic_master.png';
import deviceInfoModule from 'react-native-device-info';

const isPad = deviceInfoModule.isTablet();
const { height, width } = Dimensions.get('screen');

type TopAreaPresenterProps = {
  talkButton: boolean;
  penButton: boolean;
  docShareButton: boolean;
  screenShareButton: boolean;
  switchButton: boolean;
  reverseButton: boolean;
  orientation: 'horizontal' | 'vertical';
  onChangeDrawingMode: (value: any) => void;
  toggleDocumentListMode: Function;
  toggleCameraFacingMode: () => void;
  onReverseVideo: () => void;
  conferenceMode: string;
  mainUser: any;
  elapsedTime: string;
  isMaster: boolean;
  handdleMoreClick: () => void;
  handdleUserListClick: (e:GestureResponderEvent) => void;
  handdleChattingClick: () => void;
  isMultipleView: boolean;
  selectedRoomName: string;
  messageCount: number;
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
    toggleCameraFacingMode,
    onReverseVideo,
    conferenceMode,
    mainUser,
    elapsedTime,
    isMaster,
    handdleMoreClick,
    handdleUserListClick,
    handdleChattingClick,
    isMultipleView,
    selectedRoomName,
    messageCount
  } = props;

  return (
    <View style={styles.topContainer}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.timeText}>
            {elapsedTime !== '00:00:00' ? elapsedTime : ''}
          </Text>
        </View>

        {!isMultipleView && isPad && (
          <View style={styles.mainUserNamePadView}>
            {isMaster && (
              <Image
                source={icMaster}
                resizeMode={'cover'}
                style={{ width: 18, height: 18, marginRight: 4 }}
              />
            )}
            <Text style={styles.name}>{mainUser.userInfo?.userName}</Text>
          </View>
        )}

        {isMultipleView ? (
          <Fragment>
            <View style={{ marginRight: width * 0.03 }}>
              <Text
                style={{
                  fontFamily: 'DOUZONEText50',
                  fontSize: 18,
                  color: '#fff'
                }}
              >
                {selectedRoomName}
              </Text>
            </View>
            <View>
              <TouchableHighlight
                style={styles.moreClickView}
                underlayColor="rgba(112,112,112,0.5)"
                onPress={handdleMoreClick}
              >
                <Image
                  source={icMoreW}
                  resizeMode={'cover'}
                  style={styles.iconSize}
                />
              </TouchableHighlight>
            </View>
          </Fragment>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableHighlight
              style={styles.topMenuIcon}
              underlayColor="rgba(112,112,112,0.5)"
              onPress={handdleUserListClick}
            >
              <Image
                source={icUserW}
                resizeMode={'cover'}
                style={styles.iconSize}
              />
            </TouchableHighlight>

            {talkButton && (
              <TouchableHighlight
                style={styles.topMenuIcon}
                underlayColor="rgba(112,112,112,0.5)"
                onPress={handdleChattingClick}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    source={icChatW}
                    resizeMode={'cover'}
                    style={styles.iconSize}
                  />
                  {messageCount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        backgroundColor: '#1c90fb',
                        width: 18,
                        height: 18,
                        borderRadius: 9,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text
                        style={{
                          color: '#fff',
                          fontFamily: 'DOUZONEText50',
                          fontSize: 10
                        }}
                      >
                        {messageCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableHighlight>
            )}
            {switchButton && (
              <TouchableHighlight
                style={styles.topMenuIcon}
                underlayColor="rgba(112,112,112,0.5)"
                onPress={toggleCameraFacingMode}
              >
                <Image
                  source={icChangeW}
                  resizeMode={'cover'}
                  style={styles.iconSize}
                />
              </TouchableHighlight>
            )}
            {reverseButton && (
              <TouchableHighlight
                style={styles.topMenuIcon}
                underlayColor="rgba(112,112,112,0.5)"
                onPress={onReverseVideo}
              >
                <Image
                  source={icInvertW}
                  resizeMode={'cover'}
                  style={styles.iconSize}
                />
              </TouchableHighlight>
            )}
            <TouchableHighlight
              style={styles.moreClickView}
              underlayColor="rgba(112,112,112,0.5)"
              onPress={handdleMoreClick}
            >
              <Image
                source={icMoreW}
                resizeMode={'cover'}
                style={styles.iconSize}
              />
            </TouchableHighlight>
          </View>
        )}
      </View>
      {!isMultipleView && !isPad && (
        <View style={styles.mainUserNameView}>
          {isMaster && (
            <Image
              source={icMaster}
              resizeMode={'cover'}
              style={{ width: 18, height: 18, marginRight: 4 }}
            />
          )}
          <Text style={styles.name}>{mainUser.userInfo?.userName}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '5%',
    zIndex: 1,
    elevation: 1
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 30,
    height: 48
    // backgroundColor:'red'
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.87)',
    textAlign: 'center',
    fontFamily: 'DOUZONEText50'
  },
  topMenuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreClickView: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconSize: {
    width: 24,
    height: 24
  },
  mainUserNameView: {
    paddingHorizontal: 15,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  mainUserNamePadView: {
    paddingHorizontal: 15,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: -width * 0.16
  },
  name: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 16
  }
});

export default TopAreaPresenter;
