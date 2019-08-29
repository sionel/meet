/**
 * MainPresenter
 * 최상위화면
 */
import React from 'react';
import { View, StyleSheet, StatusBar, Text } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import RootNavigation from '../Navigations/RootNavigation';

const MainPresenter = props => {
  Orientation.unlockAllOrientations();

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} />
      <RootNavigation uriPrefix={'com.wehago.meet'} screenProps={props.url} />
      <Text style={{ fontFamily: 'DOUZONEText50' }}>main 임미다</Text>
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default MainPresenter;
