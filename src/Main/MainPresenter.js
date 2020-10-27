import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import RootNavigation from '../Navigations/RootNavigation';
import Deeplink1Navigation from '../Navigations/Deeplink1Navigation';
import Deeplink2Navigation from '../Navigations/Deeplink2Navigation';
import LoginNavigation from '../Navigations/LoginNavigation';
import CompanySelect from '../components/CompanySelect';

const MainPresenter = props => {
  Orientation.unlockAllOrientations();
  const { destination, onChangeRootState, onChangeMainState } = props;
  switch (destination) {
    case 'login':
      return (
        <LoginNavigation
          screenProps={{
            onChangeRootState: onChangeRootState,
            onChangeMainState: onChangeMainState
          }}
        />
      );

    case 'list':
      return (
        <RootNavigation
          screenProps={{
            onChangeRootState: onChangeRootState,
            onChangeMainState: onChangeMainState
          }}
        />
      );

    case 'selectCompany':
      return (
        <CompanySelect
          screenProps={{
            onChangeRootState: onChangeRootState,
            onChangeMainState: onChangeMainState
          }}
        />
      );

    case 'Setting':
      return (
        <Deeplink1Navigation
          screenProps={{
            onChangeRootState: onChangeRootState,
            onChangeMainState: onChangeMainState
          }}
        />
      );

    case 'Conference':
      return (
        <Deeplink2Navigation
          screenProps={{
            onChangeRootState: onChangeRootState,
            onChangeMainState: onChangeMainState
          }}
        />
      );
  }
  // return (
  //   <View style={styles.container}>
  //     {/* <StatusBar hidden={false} />
  //     <RootNavigation
  //       uriPrefix={'com.wehago.meet'}
  //       screenProps={{ ...props.url, conferenceCall: props.conferenceCall }}
  //     /> */}
  //   </View>
  // );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default MainPresenter;
