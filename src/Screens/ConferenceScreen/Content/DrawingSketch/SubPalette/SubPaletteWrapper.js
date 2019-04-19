/**
 *
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

const PaletteSubItem = props => {
  return <View style={styles.detailSettingWrapper}>{props.children}</View>;
};

const styles = StyleSheet.create({
  detailSettingWrapper: {
    height: 60,
    paddingLeft: 15,
    backgroundColor: '#333',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#c1c1c1'
  }
});

export default PaletteSubItem;
