import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const icMore = require('../../../../assets/new/icons/ic_more.png');
const icLockBlack = require('../../../../assets/new/icons/ic_lock_black.png');
const icMaster = require('../../../../assets/new/icons/ic_master.png');

interface conferenceBoxProps {
  conferenceName: string;
  usageTime: string;
  users: [];
  roomId: string;
  timeString: string;
  finishedMoreClick: () => void;
  isTablet: boolean;
}

export default function ConferenceBox(props: conferenceBoxProps) {
  const {
    conferenceName,
    timeString,
    usageTime,
    users,
    roomId,
    finishedMoreClick,
    isTablet
  } = props;

  // console.log('users : ', users);

  return (
    <View style={[styles.cardView, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.cardLeftContents}>
        <View style={styles.cardTitleView}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {conferenceName}
          </Text>
        </View>
        <View style={styles.dateTimeView}>
          <Text style={styles.dateTimeText}>{timeString}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.cardRightView}
        onPress={() => finishedMoreClick()}
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
                    style={[
                      styles.profileImage
                      // { right: index * 4, zIndex: -index }
                    ]}
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
                      fontFamily: 'DOUZONEText50',
                      fontSize: 8,
                      color: '#1c90fb'
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
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  icMore: {
    marginLeft: 10,
    height: 18,
    width: 18
  },
  cardView: {
    height: 97,
    borderRadius: 12,
    borderColor: '#e6e6e6',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 8,
    paddingLeft: 20,
    paddingRight: 14,
    paddingVertical: 10,
    flexDirection: 'row'
  },
  cardLeftContents: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 10
  },
  cardTitleView: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    // marginBottom: 6
  },
  cardTitle: {
    fontSize: 15,
    color: '#333',
    fontFamily: 'DOUZONEText30'
    // lineHeight: 20
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
  },
  cardRightView: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
    justifyContent: 'center',
    alignItems: 'center'
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
