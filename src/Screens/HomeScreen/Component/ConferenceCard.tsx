import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import deviceInfoModule from 'react-native-device-info';

import LinearGradient from 'react-native-linear-gradient';

const icLockwhite = require('../../../../assets/new/icons/ic_lock_white.png');
const icLive = require('../../../../assets/new/icons/ic_live.png');
const icClock = require('../../../../assets/new/icons/ic_clock.png');
const icMoreWhite = require('../../../../assets/new/icons/ic_more_w.png');

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
          <View
            style={{
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 3
            }}
          >
            <Image
              source={icLive}
              resizeMode={'contain'}
              style={{ width: 30, height: 30, marginRight: 5 }}
            />
            <Text
              style={{
                color: '#fff',
                fontSize: 20,
                fontWeight: 'bold',
                flex: 1
              }}
              numberOfLines={1}
            >
              {conferenceName}
            </Text>
            {isLock && (
              <Image
                source={icLockwhite}
                resizeMode={'contain'}
                style={{ width: 30, height: 30, marginLeft: 10 }}
              />
            )}
          </View>

          <View
            style={{
              height: 30,
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 3
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                marginRight: 5
              }}
            >
              {time}
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                marginRight: 5
              }}
            >
              {'시작'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 30,
                paddingHorizontal: 5
              }}
            >
              <Image
                source={icClock}
                resizeMode={'contain'}
                style={{ height: 12, width: 12, marginRight: 3 }}
              />
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14
                }}
              >
                {`${onMinte}분간 진행중`}
              </Text>
            </View>
          </View>

          <View
            style={{
              flex: 2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              {participants.map(
                (user: { type: string | number; value: string }) => {
                  return user.type === 'string' ? (
                    <Image
                      source={{
                        uri: user.value
                      }}
                      resizeMode={'cover'}
                      style={{
                        height: 40,
                        width: 40,
                        borderRadius: 40,
                        marginRight: 5
                      }}
                    />
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        height: 40,
                        width: 40,
                        borderRadius: 40,
                        alignItems: 'center',
                        justifyContent: 'center'
                        // zIndex: 10
                      }}
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
  }
});
