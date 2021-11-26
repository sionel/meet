import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

const icMore = require('../../../../assets/new/icons/ic_more.png');
const icLockBlack = require('../../../../assets/new/icons/ic_lock_black.png');

interface ReservationCardProps {
  roomName: string;
  date: string;
  start: string;
  end: string;
  users: [];
  roomId: string;
  isPublic: boolean;
  reservationMoreClick: (roomId: string) => void;
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
    reservationMoreClick
  } = props;

  return (
    <View
      style={{
        width: '100%',
        height: 100,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderColor: '#e6e6e6',
        borderWidth: 2,
        marginVertical: 8,
        padding: 14,
        flexDirection: 'row'
      }}
    >
      <View
        style={{
          flex: 2,
          alignItems: 'flex-start',
          justifyContent: 'center',
          marginRight: 10
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
            {roomName}
          </Text>
          {!isPublic && (
            <Image
              source={icLockBlack}
              resizeMode={'contain'}
              style={{ height: 20, width: 20 }}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text>{date + '\n' + start + ' ~ ' + end}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          width: '35%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onPress={() => reservationMoreClick(roomId)}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          {users.map((user: { type: string | number; value: string }) => {
            return user.type === 'string' ? (
              <Image
                source={{
                  uri: user.value
                }}
                resizeMode={'cover'}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 30
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
                  justifyContent: 'center'
                }}
              >
                <Text>{'+' + user.value}</Text>
              </View>
            );
          })}
        </View>

        <Image
          source={icMore}
          resizeMode={'contain'}
          style={{ height: 30, width: 30 }}
        />
      </TouchableOpacity>
    </View>
  );
}
