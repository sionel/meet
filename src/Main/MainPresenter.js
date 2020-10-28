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
  const {
    destination,
    onChangeRootState,
    onChangeMainState,
    params,
    from
  } = props;
  switch (destination) {
    case 'Login':
      return (
        <LoginNavigation
          screenProps={{
            onChangeRootState,
            onChangeMainState,
            params,
            destination,
            from
          }}
        />
      );

    case 'List':
      return (
        <RootNavigation
          screenProps={{
            onChangeRootState,
            onChangeMainState,
            params,
            destination,
            from
          }}
        />
      );

    case 'SelectCompany':
      return (
        <CompanySelect
          screenProps={{
            onChangeRootState,
            onChangeMainState,
            params,
            destination,
            from
          }}
        />
      );

    case 'Setting':
      return (
        <Deeplink1Navigation
          screenProps={{
            onChangeRootState,
            onChangeMainState,
            params,
            destination,
            from
          }}
        />
      );

    case 'Conference':
      return (
        <Deeplink2Navigation
          screenProps={{
            onChangeRootState,
            onChangeMainState,
            params,
            destination,
            from
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
