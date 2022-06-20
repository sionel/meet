import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform
} from 'react-native';
// import { Text } from '../StyledText';
const chk_on = require('@assets/icons/ic_check_wh.png');
const circle_checked = require('@assets/icons/circle_checkbox_checked.png');
const circle_nochecked = require('@assets/icons/circle_checkbox.png');

const CustomCheckBoxPresenter = (props: any) => {
  const { text, color, style, onCheck, checked, shape } = props;

  return shape === 'circle' ? (
    <TouchableOpacity
      onPress={onCheck}
      activeOpacity={0.7}
      style={styles.touchview}
    >
      <View
        style={[
          {
            ...styles.cirContainer,
            borderColor: color,
            borderWidth: color ? 1 : 0
          }
        ]}
      >
        {!checked ? (
          <Image
            source={circle_nochecked}
            resizeMode={'cover'}
            style={[{ width: 24, height: 24 }]}
          />
        ) : (
          <Image
            source={circle_checked}
            resizeMode={'cover'}
            style={[{ width: 24, height: 24 }]}
          />
        )}
      </View>
      <Text style={styles.chkboxText}>{text}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      onPress={onCheck}
      activeOpacity={0.7}
      style={styles.touchview}
    >
      <View
        style={[
          { ...styles.racContainer, borderColor: color },
          checked && { backgroundColor: 'rgb(28,144,251)' },
          shape === 'circle' && { borderRadius: 11.5 }
        ]}
      >
        {checked && (
          <Image
            source={chk_on}
            resizeMode={'contain'}
            style={[{ width: 16, height: 16 }, style]}
          />
        )}
      </View>
      <Text style={styles.chkboxText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchview: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'flex-start'
  },
  racContainer: {
    width: 23,
    height: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2
  },
  cirContainer: {
    width: 21,
    height: 21,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10.5
  },
  chkboxText: {
    fontSize: 14,
    color: 'rgb(51,51,51)',
    lineHeight: Platform.OS === 'ios' ? 25 : 21,
    paddingLeft: 5,
    fontFamily: 'DOUZONEText30'
  }
});

export default CustomCheckBoxPresenter;
