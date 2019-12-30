/**
 *
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SectionListHeader = props => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={props.onPress}
      style={{ flex: 1 }}
    >
      <View
        key={props.title}
        style={{ ...styles.sectionHeader, ...props.customStyle }}
      >
        <Text style={styles.textStyle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

SectionListHeader.defaultProps = {
  title: '목록',
  customStyle: {},
  onPress: () => {}
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 7,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 7,
    marginBottom: 10,
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgba(0,0,0, 0.10)',
    borderBottomWidth: 1
  },
  textStyle: {
    fontSize: 11,
    lineHeight: 14,
    // height: 14,
    // fontWeight: 'bold',
    color: 'rgb(140, 140, 140)',
    fontFamily: 'DOUZONEText30'
  }
});

export default SectionListHeader;
