/**
 *
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CustomButton } from '../components';

const SectionListHeader = props => {
  const { title, collapse, customStyle, onPress } = props;

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} style={{ flex: 1 }}>
      <View key={title} style={{ ...styles.sectionHeader, ...customStyle }}>
        <Text style={styles.textStyle}>{title}</Text>
        {collapse && (
          <CustomButton
            name={'btnArrowDown'}
            width={20}
            height={20}
            areaWidth={20}
            areaHeight={20}
            onPress={onPress}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

SectionListHeader.defaultProps = {
  title: '목록',
  collapse: false,
  customStyle: {},
  onPress: () => {}
};

const styles = StyleSheet.create({
  sectionHeader: {
    paddingTop: 3,
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 3,
    backgroundColor: 'rgb(255,255,255)',
    borderColor: 'rgba(0,0,0, 0.10)',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textStyle: {
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 11,
    lineHeight: 14,
    // height: 14,
    // fontWeight: 'bold',
    color: 'rgb(140, 140, 140)',
    fontFamily: 'DOUZONEText30'
  }
});

export default SectionListHeader;
