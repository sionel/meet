import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

import LinearGradient from 'react-native-linear-gradient';
import { getT } from '@utils/translateManager';

const icLockwhite = require('@assets/icons/ic_lock_white.png');
const icLive = require('@assets/icons/ic_live.png');
const icClock = require('@assets/icons/ic_clock.png');
const icMoreWhite = require('@assets/icons/ic_more_w.png');

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
            <Image
              source={icLive}
              resizeMode={'contain'}
              style={styles.icLive}
            />
            <Text style={styles.titleText} numberOfLines={1}>
              {conferenceName}
            </Text>
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
            <Text style={styles.timeText}>{t('renewal.create_room_start')}</Text>
            <View style={styles.onGoingTimeView}>
              <Image
                source={icClock}
                resizeMode={'contain'}
                style={styles.icClock}
              />
              <Text style={styles.onGoingText}>{`${onMinte}${t('renewal.main_minute_during')}`}</Text>
            </View>
          </View>

          <View style={styles.cardBotView}>
            <View style={styles.profileImageList}>
              {participants.map(
                (user: { type: string | number; value: string }, index) => {                
                  return user.type === 'string' ? (
                    <Image
                      key={index}
                      source={{
                        uri: user.value
                      }}
                      resizeMode={'cover'}
                      style={styles.userImage}
                    />
                  ) : (
                    <TouchableOpacity
                      key={index}
                      style={styles.noImage}
                      onPress={() => goingMoreClick(roomId)}
                    >
                      <Text>{'+' + user.value}</Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>
            <TouchableOpacity onPress={() => goingMoreClick(roomId)}>
              <Image
                source={icMoreWhite}
                style={{ height: '50%' }}
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
    width: 290,
    height: 150,
    marginBottom: 10,
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
    // width: 300,
    height: '100%',
    padding: 15,
    borderRadius: 12
  },
  titleView: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3
  },
  titleText: {
    color: '#fff',
    fontSize: 18,
    flex: 1,
    fontFamily: 'DOUZONEText50'
  },
  startTimeView: {
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5,
    fontFamily: 'DOUZONEText30'
  },
  onGoingTimeView: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 5
  },
  onGoingText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'DOUZONEText30'
  },
  cardBotView: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profileImageList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icLive: {
    width: 30,
    height: 30,
    marginRight: 5
  },
  icLockWhite: {
    width: 30,
    height: 30,
    marginLeft: 10
  },
  icClock: {
    height: 12,
    width: 12,
    marginRight: 3
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 40,
    marginRight: 5
  },
  noImage: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    height: 40,
    width: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center'
    // zIndex: 10
  }
});
