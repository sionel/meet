import React from 'react';
import { Image, StyleSheet, TouchableOpacity,TouchableHighlight, View } from 'react-native';
const chk_on = require('../../../assets/icons/palette/color-check_2x.png');

const CustomCheckBoxPresenter = (props: any) => {
  const { check, onCheck, onChange } = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onCheck}
    >
      <View style={styles.container}>
        {check && <Image source={chk_on} resizeMode={'contain'}/>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderColor: '#000',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
    paddingLeft: 2,
  }
});

export default CustomCheckBoxPresenter;
