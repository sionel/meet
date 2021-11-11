import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const icLockWhite = require('../../../../assets/new/icons/ic_lock_white.png');
const icLive = require('../../../../assets/new/icons/ic_live.png');
const icClock = require('../../../../assets/new/icons/ic_clock.png');
const icMore = require('../../../../assets/new/icons/ic_more.png');

interface cardProps {
  index: number;
}

export default function ConferenceCard(props: cardProps) {
  const { index } = props;
  const a = [1, 2, 3, 4, 5, 6];
  const b = [1, 2];
  const c = [1, 2, 4, 5, 6];
  const d = [1, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6, 2, 3, 4, 5, 6];
  const arr = [a, b, c, d];

  const colors = [
    ['rgb(75,234,200)', 'rgb(34,172,204)'],
    ['rgb(74,198,252)', 'rgb(48,109,242)'],
    ['rgb(174,124,255)', 'rgb(99,93,245)'],
    ['rgb(238,135,206)', 'rgb(183,88,234)']
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        shadowColor: 'rgb(9,33,60)',
        shadowOpacity: 0.3,
        shadowOffset: {
          width: 0,
          height: 8
        },
        paddingBottom:10
      }}
    >
      <LinearGradient
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 0 }}
        colors={colors[index % 4]}
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
            style={{ width: 30, height: 30, marginRight: 5 }}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
              flex: 1
              // backgroundColor: '#661'
            }}
          >
            {'어디어디 주간회의'}
          </Text>
          <Image
            source={icLockWhite}
            resizeMode={'contain'}
            style={{ width: 18, height: 18 }}
          />
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
            {'01:00 PM'}
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
              {'72분간 진행중'}
            </Text>
          </View>
        </View>

        <View
          style={{
            flex: 2
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              paddingTop: 15
            }}
          >
            {arr[index % 4]
              .reduce<{ type: string; value: string | number }[]>(
                (prev, present) => {
                  if (prev.length > 4) return prev;

                  let type;
                  let value;

                  if (arr[index % 4].length <= 5) {
                    type = 'string';
                    value =
                      'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg';
                  } else {
                    type = prev.length < 4 ? 'string' : 'number';
                    value =
                      prev.length < 4
                        ? 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
                        : arr[index % 4].length - 4;
                  }

                  return [...prev, { type, value }];
                },
                []
              )
              .map(v => {
                return v.type === 'string' ? (
                  <Image
                    source={{
                      uri: 'https://www.wehago.com/uploads/profile/338136/hejevjsiwr.jpg'
                    }}
                    resizeMode={'center'}
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
                  >
                    <Text>{'+' + v.value}</Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
