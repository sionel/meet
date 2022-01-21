import React from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';
import { CustomIcon } from '@components/index';

const { height, width } = Dimensions.get('window');

const EndCallMessagePresenter = props => {
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
