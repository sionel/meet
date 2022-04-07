import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

import LinearGradient from 'react-native-linear-gradient';
import { getT } from '../../../utils/translateManager';

const icLockwhite = require('../../../../assets/new/icons/ic_lock_white.png');
const icLive = require('../../../../assets/new/icons/ic_live.png');
const icClock = require('../../../../assets/new/icons/ic_clock.png');
const icMoreWhite = require('../../../../assets/new/icons/ic_more_w.png');
const icMaster = require('../../../../assets/new/icons/ic_master.png');

interface cardProps {
  index: number;
  conference: {
    roomId: string;
    conferenceName: string;
    time: string;
    onMinte: number;
    participants: [];
    isLock: boolean;
    goingMoreClick: (roomId: string) => void;
    enterConference: (roomId: string) => void;
  };
  isHorizon: boolean;
}

export default function ConferenceCard(props: cardProps) {
  const {
    index,
    conference: {
      roomId,
      conferenceName,
      time,
      onMinte,
      participants,
      isLock,
      goingMoreClick,
      enterConference
    },
    isHorizon
  } = props;
  const t = getT();
  const isTablet = deviceInfoModule.isTablet();
  const colors = [
    ['rgb(75,234,200)', 'rgb(34,172,204)'],
    ['rgb(74,198,252)', 'rgb(48,109,242)'],
    ['rgb(174,124,255)', 'rgb(99,93,245)'],
    ['rgb(238,135,206)', 'rgb(183,88,234)']
  ];
  // console.log('participants : ', participants);

  return (
    <View
      style={
        isHorizon ? { paddingRight: 40 } : { paddingLeft: isTablet ? 40 : 20 }
      }
    >
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.container}
        onPress={() => enterConference(roomId)}
      >
        <LinearGradient
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          colors={colors[index % 4]}
          style={styles.gradient}
        >
          <View style={styles.titleView}>
            <View style={styles.titleLeftView}>
              <Image
                source={icLive}
                resizeMode={'contain'}
                style={styles.icLive}
              />
              <Text style={styles.titleText} numberOfLines={1}>
                {conferenceName}
              </Text>
            </View>
            {isLock && (
              <Image
                source={icLockwhite}
                resizeMode={'contain'}
                style={styles.icLockWhite}
              />
            )}
          </View>

          <View style={styles.startTimeView}>
            <Text style={styles.timeText}>{time}</Text>
            <Text style={styles.timeText}>
              {t('renewal.create_room_start')}
            </Text>
            <View style={styles.onGoingTimeView}>
              <Image
                source={icClock}
                resizeMode={'contain'}
                style={styles.icClock}
              />
              <Text style={styles.onGoingText}>{`${onMinte}${t(
                'renewal.main_minute_during'
              )}`}</Text>
            </View>
          </View>

          <View style={styles.cardBotView}>
            <View style={styles.profileImageList}>
              {participants.map(
                (
                  user: {
                    type: string | number;
                    value: string;
                    isMaster: boolean;
                  },
                  index
                ) => {
                  return user.type === 'string' ? (
                    <View key={index}>
                      <Image
                        source={{
                          uri: user.value
                        }}
                        resizeMode={'cover'}
                        style={styles.userImage}
                      />
                      {user.isMaster === true && (
                        <View style={styles.masterView}>
                          <Image
                            source={icMaster}
                            style={{ width: 10, height: 10 }}
                          />
                        </View>
                      )}
                    </View>
                  ) : (
                    <TouchableOpacity
                      key={index}
                      style={styles.noImage}
                      onPress={() => goingMoreClick(roomId)}
                    >
                      <Text
                        style={{
                          fontFamily: 'DOUZONEText50',
                          fontSize: 10,
                          color: '#fff'
                        }}
                      >
                        {'+' + user.value}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
            <TouchableOpacity onPress={() => goingMoreClick(roomId)}>
              <Image
                source={icMoreWhite}
                style={{ width: 18, height: 18 }}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 294,
    height: 156,
    // marginBottom: 40,
    // backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: 'rgb(9,33,60)',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 8
    }
  },
  gradient: {
    width: 294,
    height: 148,
    padding: 20,
    borderRadius: 12
  },
  titleView: {
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginBottom: 10
  },
  titleLeftView: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  titleText: {
    color: '#fff',
    fontSize: 16,
    letterSpacing: -0.32,
    fontFamily: 'DOUZONEText50'
  },
  startTimeView: {
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 5,
    fontFamily: 'DOUZONEText30'
  },
  onGoingTimeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    width: 89,
    height: 20,
    borderRadius: 45,
    paddingHorizontal: 5
  },
  onGoingText: {
    color: '#fff',
    fontSize: 11,
    fontFamily: 'DOUZONEText30'
  },
  cardBotView: {
    // flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profileImageList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icLive: {
    width: 24,
    height: 24,
    marginRight: 4
  },
  icLockWhite: {
    width: 18,
    height: 18,
    marginVertical: 3
  },
  icClock: {
    height: 12,
    width: 12,
    marginRight: 1
  },
  userImage: {
    height: 32,
    width: 32,
    borderRadius: 16,
    marginRight: 4
  },
  noImage: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center'
    // zIndex: 10
  },
  masterView: {
    width: 14,
    height: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#febc2c',
    bottom: 0,
    left: -4,
    position: 'absolute'
  }
});
