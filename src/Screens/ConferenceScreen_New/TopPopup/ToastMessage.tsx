import React, { useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { ToastMessageProps } from '../types';

const ToastMessage: React.FC<ToastMessageProps> = ({
  insets,
  message,
  fadeAnimation
}) => {
  const [height, setHeight] = useState(Dimensions.get('screen').height);
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnimation, // Bind opacity to animated value
          marginHorizontal: 16,
          bottom: height * 0.7
        }
        // isPad && {
        //   bottom: height * 0.3,
        //   width: 343,
        //   marginHorizontal: (width - 343) / 2
        // }
      ]}
    >
      {/* <View style={[styles.container, { opacity: fadeAnimation }]}> */}
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.noti}>{message}</Text>
      </View>
      {/* </View> */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flex: 1,
    height: 48,
    borderRadius: 10,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    elevation: 4,
    zIndex: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noti: {
    fontFamily: 'DOUZONEText30',
    fontSize: 13,
    lineHeight: 21,
    color: '#fff'
  }
});

export default ToastMessage;
