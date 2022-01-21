import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
// import { Text } from '../StyledText';
const chk_on = require('@assets/icons/ic_check_wh.png');

const CustomCheckBoxPresenter = (props: any) => {
  const { text, color, style, onCheck, checked } = props;

  return (
    <TouchableOpacity
      onPress={onCheck}
      activeOpacity={0.7}
      style={[styles.touchview,style]}
    >
      <View style={[{...styles.container, borderColor:color}, checked && {backgroundColor:'rgb(28,144,251)'}]}>
        {checked && <Image source={chk_on} resizeMode={'contain'} />}
      </View>
      <Text style={styles.chkboxText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchview: {
    flexDirection: 'row', 
    alignSelf:'flex-start',
  },
  container: {
    width: 30,
    height: 30,
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 2
  },
  chkboxText: {
    fontSize: 14,
    color: 'rgb(51,51,51)',
    lineHeight: 30,
    paddingLeft: 5,
    fontFamily: 'DOUZONEText30'
  }
});

export default CustomCheckBoxPresenter;
