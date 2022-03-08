import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const icMore = require('@assets/icons/ic_more.png');
const icLockBlack = require('@assets/icons/ic_lock_black.png');

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
    isTablet
  } = props;

  return (
    <View
      style={
        // flex:0.45,
        [styles.cardView, { width: isTablet ? '48%' : '100%' }]
      }
    >
      <TouchableOpacity style={styles.cardLeftContents} activeOpacity={0.5} onPress={() => enterConference(roomId)}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            width: '80%'
          }}
        >
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
            {date + '\n' + start + ' ~ ' + end}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.cardRightView}
        onPress={() => reservationMoreClick(roomId)}
      >
        <View style={styles.profileImageList}>
          {users.map(
            (user: { type: string | number; value: string }, index) => {
              return user.type === 'string' ? (
                <Image
                  key={index}
                  source={{
                    uri: user.value
                  }}
                  resizeMode={'cover'}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.noImage}>
                  <Text>{'+' + user.value}</Text>
                </View>
              );
            }
          )}
        </View>

        <Image source={icMore} resizeMode={'contain'} style={styles.icMore} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  icLock: {
    height: 20,
    width: 20
  },
  icMore: {
    height: 30,
    width: 30
  },
  cardView: {
    height: 120,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderColor: '#e6e6e6',
    borderWidth: 2,
    marginBottom: 15,
    padding: 20,
    flexDirection: 'row'
  },
  cardLeftContents: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 10
  },
  cardTitle: {
    fontSize: 17,
    color: '#333',
    fontFamily: 'DOUZONEText30'
  },
  dateTimeView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateTimeText: {
    fontFamily: 'DOUZONEText30',
    color: '#333'
    // 예약회의 시간 표현에 따라 바뀔 예정
  },
  cardRightView: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
    // backgroundColor:'#21f'
  },
  profileImageList: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  profileImage: {
    height: 30,
    width: 30,
    borderRadius: 30
  },
  noImage: {
    backgroundColor: '#e9f5ff',
    height: 30,
    width: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
