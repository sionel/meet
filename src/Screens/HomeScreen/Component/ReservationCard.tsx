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
    isTablet
  } = props;

  // console.log('users : ', users);

  return (
    <View style={[styles.cardView, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.cardLeftContents}>
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
            {date + '\n' + start + ' ~ ' + end}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.cardRightView}
        onPress={() => reservationMoreClick(roomId)}
      >
        <View style={styles.profileImageList}>
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
        </View>

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
    marginLeft: 10,
    height: 18,
    width: 18
  },
  cardView: {
    height: 97,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    marginBottom: 8,
    paddingLeft: 20,
    paddingRight: 14,
    paddingVertical: 20,
    flexDirection: 'row'
  },
  cardLeftContents: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 10
  },
  cardTitleView: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginBottom: 6
  },
  cardTitle: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'DOUZONEText30'
  },
  dateTimeView: {
    flex: 1,
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
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
    // backgroundColor:'#21f'
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
  }
});
