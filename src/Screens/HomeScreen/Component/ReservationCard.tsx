import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const icMore = require('../../../../assets/new/icons/ic_more.png');
const icLockBlack = require('../../../../assets/new/icons/ic_lock_black.png');
const icMaster = require('../../../../assets/new/icons/ic_master.png');

interface ReservationCardProps {
  roomName: string;
  date: string;
  start: string;
  end: string;
  users: [];
  roomId: string;
  isPublic: boolean;
  reservationMoreClick: (roomId: string) => void;
  enterConference: (roomId: string) => void;
  isTablet: boolean;
  day: string;
}

export default function ConferenceBox(props: ReservationCardProps) {
  const {
    roomName,
    date,
    start,
    end,
    users,
    roomId,
    isPublic,
    reservationMoreClick,
    enterConference,
    isTablet,
    day
  } = props;

  return (
    <View style={[styles.cardView, isTablet && { width: '48%' }]}>
      <View
        style={styles.dayCircleStyle}
      >
        <Text style={styles.dayNumberTextStyle}>
          {date.substring(date.length - 3, date.length - 1)}
        </Text>
        <Text style={styles.dayWordTextStyle}>{day}</Text>
      </View>
      <View style={styles.cardCenterContents}>
        <View style={styles.cardTitleView}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {roomName}
          </Text>
          {!isPublic && (
            <Image
              source={icLockBlack}
              resizeMode={'contain'}
              style={styles.icLock}
            />
          )}
        </View>
        <View style={styles.dateTimeView}>
          <Text style={styles.dateTimeText}>
            {date.substring(0, date.length - 1) + ' | ' + start + ' ~ ' + end}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cardRightView}
        onPress={() => reservationMoreClick(roomId)}
      >
        {/* <View style={styles.profileImageList}>
          {users.map(
            (
              user: { type: string | number; value: string; isMaster: boolean },
              index
            ) => {
              return user.type === 'string' ? (
                <View key={index}>
                  <Image
                    key={index}
                    source={{
                      uri: user.value
                    }}
                    resizeMode={'cover'}
                    style={styles.profileImage}
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
                <View key={index} style={styles.noImage}>
                  <Text
                    style={{
                      color: '#1c90fb',
                      fontSize: 8,
                      fontFamily: 'DOUZONEText50'
                    }}
                  >
                    {'+' + user.value}
                  </Text>
                </View>
              );
            }
          )}
        </View> */}

        <Image source={icMore} resizeMode={'contain'} style={styles.icMore} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  icLock: {
    marginLeft: 4,
    height: 18,
    width: 18
  },
  icMore: {
    height: 18,
    width: 18
  },
  cardView: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    marginBottom: 8,
    paddingRight: 16,
    paddingLeft: 14,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardCenterContents: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 10
    // backgroundColor:'#faa'
  },
  cardTitleView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    // marginBottom: 6,
    flex: 1
  },
  cardTitle: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'DOUZONEText30',
    letterSpacing: -0.3
  },
  dateTimeView: {
    flex: 1,
    marginTop: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateTimeText: {
    height: '100%',
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: 'rgb(147,147,147)'
    // 예약회의 시간 표현에 따라 바뀔 예정
  },
  cardRightView: {
    width: 18,
    height: 18
  },
  profileImageList: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  profileImage: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.1)',
    borderWidth: 1
  },
  noImage: {
    backgroundColor: '#e9f5ff',
    height: 24,
    width: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  // 요일 동그라미 스타일
  dayCircleStyle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 6,
    backgroundColor: '#e9f5ff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  dayNumberTextStyle: {
    color: '#1c90fb',
    fontFamily: 'DOUZONEText50',
    fontSize: 14,
    letterSpacing: -0.28
  },
  dayWordTextStyle: {
    color: '#1c90fb',
    fontFamily: 'DOUZONEText50',
    fontSize: 10
  }
});
