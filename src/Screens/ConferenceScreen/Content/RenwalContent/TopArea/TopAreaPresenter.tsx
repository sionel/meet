import React, { Fragment } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
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
  handdleMoreClick: () => void;
  handdleUserListClick: () => void;
  isMultipleView: boolean;
  selectedRoomName: string;
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
    isMaster,
    handdleMoreClick,
    handdleUserListClick,
    isMultipleView,
    selectedRoomName
  } = props;

  return (
    <View style={styles.topContainer}>
      <View
        style={[
          styles.topRow,
          isMultipleView && { justifyContent: 'space-between' }
        ]}
      >
        <View style={{ justifyContent: 'flex-start' }}>
          <Text style={styles.timeText}>
            {elapsedTime !== '00:00:00' ? elapsedTime : ''}
          </Text>
        </View>

        {isMultipleView ? (
          <Fragment>
            <View style={{ alignItems: 'center' }}>
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
            <View style={{ alignItems: 'flex-end' }}>
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
          <View style={{ flexDirection: 'row' }}>
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
                onPress={() => toggleDocumentListMode(['CHATTING'])}
              >
                <Image
                  source={icChatW}
                  resizeMode={'cover'}
                  style={styles.iconSize}
                />
              </TouchableHighlight>
            )}
            {/* docShareButton && null
             <CustomButton
               name="docShare"
               width={28}
               height={28}
               areaWidth={42}
               areaHeight={36}
               onPress={_.throttle(() => toggleDocumentListMode(['FILELIST']), 500)}
             />

            screenShareButton && null
             <CustomButton
               name="icoScreenShagre"
               width={28}
               height={28}
               areaWidth={42}
               areaHeight={36}
               onPress={toggleScreenFlag}
             /> */}
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
      {!isMultipleView && (
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
    flexDirection: 'column',
    justifyContent: 'center'
  },
  topRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: '5%',
    height: 48
  },
  timeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.87)',
    textAlign: 'center',
    fontFamily: 'DOUZONEText50'
  },
  topMenuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreClickView: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
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
  name: {
    color: '#fff',
    fontFamily: 'DOUZONEText30',
    fontSize: 16
  }
});

export default TopAreaPresenter;
