import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const icMore = require('@assets/icons/ic_more.png');
const icLockBlack = require('@assets/icons/ic_lock_black.png');

interface conferenceBoxProps {
  conferenceName: string;
  usageTime: string;
  users: [];
  roomId: string;
  timeString: string;
  finishedMoreClick: (roomId: string) => void;
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

  return (
    <View style={[styles.cardView, { width: isTablet ? '48%' : '100%' }]}>
      <View style={styles.cardLeftContents}>
        <View style={styles.cardTitleView}>
          <Text numberOfLines={1} style={styles.cardTitle}>
            {conferenceName}
          </Text>
        </View>
        <View
          style={
            styles.dateTimeView
            // backgroundColor:'black'
          }
        >
          <Text style={styles.dateTimeText}>{timeString}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.cardRightView}
        onPress={() => finishedMoreClick(roomId)}
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
                  style={[
                    styles.profileImage,
                    { right: index * 10, zIndex: -index }
                  ]}
                />
              ) : (
                <View
                  key={index}
                  style={[
                    styles.noImage,
                    { right: index * 10, zIndex: -index }
                  ]}
                >
                  <Text>{'+' + user.value}</Text>
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
    height: 25,
    width: 25
  },
  cardView: {
    height: 100,
    borderRadius: 20,
    borderColor: '#e6e6e6',
    borderWidth: 2,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row'
  },
  cardLeftContents: {
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  cardTitleView: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    width: '80%'
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
    height: '100%',
    fontFamily: 'DOUZONEText30',
    color: '#333'
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
