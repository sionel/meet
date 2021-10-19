import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { Text } from '../StyledText';
const chk_on = require('../../../assets/new/icons/color-check-wh_2x.png');

const CustomCheckBoxPresenter = (props: any) => {
  const { check, onCheck, text, color } = props;

  return (
    <TouchableOpacity
      onPress={onCheck}
      activeOpacity={0.7}
      style={styles.touchview}
    >
      <View style={[{...styles.container, borderColor:color}, check && {backgroundColor:'rgb(28,144,251)'}]}>
        {check && <Image source={chk_on} resizeMode={'contain'} />}
      </View>
      <Text style={styles.chkboxText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchview: {
    flexDirection: 'row', 
    alignSelf:'flex-start',
    zIndex: 1,
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
    // paddingTop: Platform.OS === 'ios' ? 8 : 5,
    // paddingLeft: Platform.OS === 'ios' ? 5 : 1,
    fontSize: 14,
    color: 'rgb(51,51,51)',
    lineHeight: 30,
    // paddingTop: 8,
    paddingLeft: 5
  }
});

export default CustomCheckBoxPresenter;
