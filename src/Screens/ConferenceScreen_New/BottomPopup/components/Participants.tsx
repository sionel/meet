import React, { Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  FlatList,
  Animated,
  TouchableOpacity,
  GestureResponderEvent,
  Platform,
  Dimensions
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import deviceInfoModule from 'react-native-device-info';
import { ParticipantsProps } from '@screens/ConferenceScreen_New/types';

import icPersonPlusW from '@assets/icons/ic_person_plus_w.png';
import icBackW from '@assets/icons/ic_back_w.png';
import { getT } from '@utils/translateManager';
import { Profile, ParticipantCard, InviteList } from './participantsComponents';

const isPad = deviceInfoModule.isTablet();
const Participant: React.FC<ParticipantsProps> = ({
  isRoomMaster,
  isProfile,
  isInviteList,
  swipeRef,
  userInfo,
  participants,
  onPressInvite,
  onPressProfile,
  onPressMaster,
  onPressKick,
  setIsProfile,
  // InviteList
  onPressEmail,
  onPressSms,
  onPressShare,
  onPressLink,
  onPressCode
}) => {
  const t = getT();
  // const userList = [
  // ];

  return isInviteList ? (
    <InviteList
      onPressEmail={onPressEmail}
      onPressSms={onPressSms}
      onPressShare={onPressShare}
      onPressLink={onPressLink}
      onPressCode={onPressCode}
    />
  ) : (
    <BlurView
      style={styles.userListContainer}
      overlayColor="rgba(255,255,255,0.01)"
    >
      <View
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <View style={styles.userListHeader}>
          <View style={styles.userListHeaderRow}>
            {isProfile ? (
              <Fragment>
                <TouchableHighlight
                  activeOpacity={0.5}
                  onPress={() => setIsProfile(false)}
                  underlayColor="transparent"
                >
                  <Image source={icBackW} style={styles.iconSize24} />
                </TouchableHighlight>
                <Text style={styles.headerText}>{`프로필`}</Text>
                <View style={styles.iconSize24} />
              </Fragment>
            ) : (
              <Fragment>
                <View style={styles.iconSize24} />
                <Text style={styles.headerText}>{`참석자 리스트`}</Text>
                <TouchableHighlight
                  activeOpacity={0.5}
                  onPress={() => onPressInvite()}
                  underlayColor="transparent"
                >
                  <Image source={icPersonPlusW} style={styles.iconSize24} />
                </TouchableHighlight>
              </Fragment>
            )}
          </View>
        </View>
        <View>
          {isProfile ? (
            <Profile user={userInfo} />
          ) : (
            <ParticipantCard
              participants={participants}
              isPad={isPad}
              isRoomMaster={isRoomMaster}
              swipeRef={swipeRef}
              onPressProfile={onPressProfile}
              onPressMaster={onPressMaster}
              onPressKick={onPressKick}
            />
          )}
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  userListContainer: {
    flex: 1
  },
  userListHeader: {
    flex: 1,
    height: 48,
    marginTop: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  userListHeaderRow: {
    height: 24,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DOUZONEText50'
  },
  profileSize: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  iconSize24: {
    width: 24,
    height: 24
  },
  iconSize18: {
    width: 18,
    height: 18
  }
});

export default Participant;
