import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  Dimensions
} from 'react-native';
import DrawingSketch from '../DrawingSketch'

const { height, width } = Dimensions.get('window');

const FileSharingPresenter = props => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: props.uri }}
        resizeMode={'contain'}
        style={styles.imageBackground}
      >
        <Text onPress={() => props.onChangeSharingMode(!props.sharing)}>
          Close Component
        </Text>
        {/* <DrawingSketch/> */}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  imageBackground: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default FileSharingPresenter;
