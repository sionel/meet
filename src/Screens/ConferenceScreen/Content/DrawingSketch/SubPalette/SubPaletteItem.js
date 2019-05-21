/**
 *
 */

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';

const PaletteSubItem = props => {
  const { key, onPress, isActive, activeStyle } = props;

  return (
    <TouchableOpacity key={String(key)} onPress={onPress}>
      <View
        style={{
          ...styles.detailSettingItem,
          opacity: isActive ? 0.45 : 1
        }}
      >
        {props.children}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  detailSettingItem: {
    width: 30,
    height: 30,
    backgroundColor: '#f1f1f1',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 25,
    marginBottom: 7.5,
    marginLeft: 7.5,
    marginRight: 7.5,

    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default PaletteSubItem;
