import React from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { CustomLottie } from '../../../components';
import ProfileImage from '../../../../assets/icons/imgVcNophoto_2x.png';

const { height, width } = Dimensions.get('window');

const MainVideoPresenter = props => {
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
        <CustomLottie source="voiceBroadcast" width={280} height={280}>
          <View
            style={{
              position: 'absolute',
              top: -205,
              justifyContent: 'center'
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: '#c0c0c0',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              통화 종료
            </Text>
            <Text
              style={{
                fontSize: 25,
                color: '#c0c0c0',
                textAlign: 'center',
                fontFamily: 'DOUZONEText30'
              }}
            >
              {/* {second2String(props.time)} */}
              10초간
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
            source={ProfileImage}
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
                fontFamily: 'DOUZONEText50'
              }}
            >
              {/* {mainUser.name} */}
              김씨
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: '#fff',
                paddingTop: 10,
                fontFamily: 'DOUZONEText30'
              }}
            >
              {/* {userInfo && userInfo.companyFullpath
                ? userInfo.companyFullpath
                : ''} */}
              어디부서
            </Text>
          </View>
        </CustomLottie>
      </View>

      <TouchableOpacity
        onPress={props.onClose}
        style={{ position: 'absolute', bottom: '10%', left: '50%' }}
      >
        <Text style={{ color: '#fff', fontSize: 30 }}>닫기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MainVideoPresenter;
