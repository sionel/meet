import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const icLock = require('../../../../assets/new/icons/ic_lock_white.png');
const icLive = require('../../../../assets/new/icons/ic_live.png');
const icClock = require('../../../../assets/new/icons/ic_clock.png');
const icMore = require('../../../../assets/new/icons/ic_more.png');

interface cardProps {
  index: number;
}

export default function ConferenceCard(props: cardProps) {
  const { index } = props;
  const a = [1, 2, 3, 4, 5];
  const colors = [
    ['rgb(75,234,200)', 'rgb(34,172,204)'],
    ['rgb(74,198,252)', 'rgb(48,109,242)'],
    ['rgb(174,124,255)', 'rgb(99,93,245)'],
    ['rgb(238,135,206)', 'rgb(183,88,234)']
  ];

  return (
    <TouchableOpacity activeOpacity={0.8}>
      <LinearGradient
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        colors={colors[index]}
        style={{
          width: 300,
          height: '100%',
          marginLeft: 20,
          padding: 15,
          borderRadius: 12
        }}
      >
        <View
          style={{
            height: 30,
            // backgroundColor: '#953',
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 3
          }}
        >
          <Image
            source={icLive}
            resizeMode={'contain'}
            style={{ width: 24, height: 24, marginRight: 5 }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 16,
              fontWeight: 'bold',
              flex: 1
              // backgroundColor: '#661'
            }}
          >
            {'어디어디 주간회의'}
          </Text>
          <Image
            source={icLock}
            resizeMode={'contain'}
            style={{ width: 18, height: 18 }}
          />
        </View>

        <View
          style={{
            height: 25,
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 3
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              marginRight: 5
            }}
          >
            {'01:00 PM'}
          </Text>
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
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
              {'72분간 진행중'}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 2,
            backgroundColor: '#519',
            flexDirection: 'row',
            paddingTop: 20,
            alignItems: 'center'
          }}
        >
          {a.reduce((prev, present) => {
            
            return prev.length < 5
              ? [...prev, present]
              : a.length > 5
              ? [...prev, a.length - 4]
              : prev;
            // <Image
            //   source={{
            //     uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
            //   }}
            //   resizeMode={'center'}
            //   style={{
            //     backgroundColor: '#ff0',
            //     height: 40,
            //     width: 40,
            //     borderRadius: 40
            //   }}
            // />;
          }, [] as number[])}
          {/* {[1, 2, 3, 4, 5].map((v, i) => (
            <Image
              source={{
                uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
              }}
              resizeMode={'center'}
              style={{
                backgroundColor: '#ff0',
                height: 40,
                width: 40,
                borderRadius: 40
              }}
            />
          ))} */}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
