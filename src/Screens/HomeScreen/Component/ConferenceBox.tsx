import React from 'react';
import { View, Text, Image } from 'react-native';

const icMore = require('../../../../assets/new/icons/ic_more.png');
const icLockBlack = require('../../../../assets/new/icons/ic_lock_black.png');

export default function ConferenceBox(props: any) {
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
            {'어디어디12312311223112323121321323121323123112233123'}
          </Text>
          <Image
            source={icLockBlack}
            resizeMode={'contain'}
            style={{ height: 20, width: 20 }}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text>{'01:00 PM ~ 06:00 PM | 10분뒤 시작'}</Text>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row'
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row-reverse'
            // flex:1
            // alignContent:'space-around'
            // alignSelf:'center'
          }}
        >
          <Image
            source={{
              uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
            }}
            resizeMode={'center'}
            style={{
              height: 45,
              width: 45,
              borderRadius: 45,
              left: 0,
              borderColor: '#fff',
              borderWidth: 2
            }}
          />
          <Image
            source={{
              uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
            }}
            resizeMode={'center'}
            style={{
              height: 45,
              width: 45,
              borderRadius: 45,
              left: -10,
              borderColor: '#fff',
              borderWidth: 2
            }}
          />
          <Image
            source={{
              uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
            }}
            resizeMode={'center'}
            style={{
              height: 45,
              width: 45,
              borderRadius: 45,
              left: -20,
              borderColor: '#fff',
              borderWidth: 2
            }}
          />
        </View>

        <Image
          source={icMore}
          resizeMode={'contain'}
          style={{ height: 30, width: 30, marginRight: 3 }}
        />
      </View>
    </View>
  );
}
