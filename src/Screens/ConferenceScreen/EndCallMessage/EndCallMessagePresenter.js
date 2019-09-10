import React from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { CustomLottie, CustomIcon } from '../../../components';
import ProfileImage from '../../../../assets/icons/imgVcNophoto_2x.png';

const { height, width } = Dimensions.get('window');

const EndCallMessagePresenter = props => {
  console.log('props')
  const second2String = second => {
    let hours = Math.floor(second / 3600);
    let minutes = Math.floor((second - hours * 3600) / 60);
    let seconds = Math.floor(second - hours * 3600 - minutes * 60);

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
  };
  const time =
    props.createdTime && second2String((Date.now() - props.createdTime) / 1000);

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1D1D1D'
      }}
    >
      <View style={{ display: 'flex' }}>
        <CustomLottie source="cc" width={280} height={280}>
          <View
            style={{
              position: 'absolute',
              top: -205,
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 24,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              통화 종료
            </Text>
            <Text
              style={{
                fontSize: 24,
                color: '#fff',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              {props.createdTime ? time : '00:00:00'}
            </Text>
          </View>
          <Image
            style={{
              marginTop: -7,
              marginLeft: 7,
              padding: 0,
              width: 150,
              height: 150,
              borderRadius: 145 / 2,
              borderWidth: 2,
              backgroundColor: '#1D1D1D',
              borderColor: '#d1d1d1'
            }}
            source={
              props.user
                ? {
                    uri:
                      'https://www.wehago.com' + props.user.userInfo.profile_url
                  }
                : ProfileImage
            }
          />
          <View
            style={{
              position: 'absolute',
              top: 180,
              alignItems: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 25,
                // fontWeight: 'bold',
                color: '#fff',
                width: Math.min(height, width) * 0.8,
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              {props.user ? props.user.name : '연결에 실패했습니다.'}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#fff',
                paddingTop: 10,
                fontFamily: 'DOUZONEText30'
              }}
            >
              {props.user
                ? props.user.userInfo.companyFullpath
                : '상대방이 접속하지 않았습니다.'}
            </Text>
          </View>
        </CustomLottie>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: '10%',
          left: 0,
          right: 0,
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={props.onClose}
          activeOpacity={0.5}
          style={{
            width: 55,
            height: 55,
            borderRadius: 55 / 2,
            backgroundColor: '#f4484c',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CustomIcon width={24} height={24} name={'buttonClose'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EndCallMessagePresenter;
