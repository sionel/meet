import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const icMore = require('../../../../assets/new/icons/ic_more.png');
const icLockBlack = require('../../../../assets/new/icons/ic_lock_black.png');

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
    <View
      style={{
        width: isTablet ? '48%' : '100%',
        height: 100,
        borderRadius: 20,
        borderColor: '#e6e6e6',
        borderWidth: 2,
        backgroundColor: '#fff',
        marginBottom: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row'
      }}
    >
      <View
        style={{
          flex: 2,
          alignItems: 'flex-start',
          justifyContent: 'center'
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'row',
            width: '80%'
          }}
        >
          <Text numberOfLines={1} style={{ fontSize: 20 }}>
            {conferenceName}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
            // backgroundColor:'black'
          }}
        >
          <Text style={{ height: '100%' }}>{timeString}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: 100,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onPress={() => finishedMoreClick(roomId)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {users.map(
            (user: { type: string | number; value: string }, index) => {
              return user.type === 'string' ? (
                <Image
                  source={{
                    uri: user.value
                  }}
                  resizeMode={'cover'}
                  style={{
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    right: index * 10,
                    zIndex: -index
                  }}
                />
              ) : (
                <View
                  style={{
                    backgroundColor: '#e9f5ff',
                    height: 30,
                    width: 30,
                    borderRadius: 30,
                    alignItems: 'center',
                    justifyContent: 'center',
                    right: index * 10,
                    zIndex: -index
                  }}
                >
                  <Text>{'+' + user.value}</Text>
                </View>
              );
            }
          )}
        </View>
        <Image
          source={icMore}
          resizeMode={'contain'}
          style={{ height: 25, width: 25 }}
        />
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
}
