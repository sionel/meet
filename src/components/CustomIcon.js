import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';

import ico_folder from '../../assets/buttons/ico_folder.png';

const CustomIcon = props => {
  return (
    <Image
      source={getButtonSource(props.name)}
      resizeMode={'contain'}
      style={{
        ...styles.iconStyle,
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius
      }}
    />
  );
};

/**
 * CustomIcon PropTypes
 */
CustomIcon.propTypes = {
  name: PropTypes.oneOf([
    'folder',
  ]).isRequired
};

/**
 * 버튼 이미지를 얻어온다.
 */
const getButtonSource = name => {
  switch (name) {
    case 'folder':
      return ico_folder;
    default:
      return null;
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  iconStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

CustomIcon.defaultProps = {
  width: 30,
  height: 30,
  borderRadius: 0
};

export default CustomIcon;
