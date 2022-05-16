import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { CustomIcon } from '../../../components';

const EndCallMessage = (props: { onClose: (isKick: boolean) => void }) => {
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
      <View style={{ display: 'flex' }}></View>

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
          onPress={() => props.onClose(false)}
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

export default EndCallMessage;
