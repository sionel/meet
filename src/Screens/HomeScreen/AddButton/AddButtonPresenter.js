/**
 * AddButtonPresenter
 * 추가버튼 프레젠터
 */

import React from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Platform,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const plusIcon = require('./plus.png');

const AddButtonPresenter = props => {
  const size = Platform.isPad ? 80 : props.size;
  return (
    <TouchableHighlight
      style={{ ...styles.wrap, width: size, height: size }}
      onPress={props.onClick}
      underlayColor="#0C80EB"
    >
      <View style={{ ...styles.text }}>
        <Image source={plusIcon} style={{ width: 25, height: 25 }} />
      </View>
    </TouchableHighlight>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 71,
    height: 71,
    borderRadius: 100,
    backgroundColor: '#1C90FB',
    zIndex: 50,
    flexDirection: 'row',
    shadowOffset: { width: 1, height: 2 },
    shadowColor: 'black',
    shadowOpacity: 0.35,
    elevation: 3
  },

  text: {
    flex: 1,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

AddButtonPresenter.defaultProps = {
  size: 65,
  onClick: () => {
    alert('Call');
  }
};

export default AddButtonPresenter;
