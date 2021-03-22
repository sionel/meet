import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import RootNavigation from '../Navigations/RootNavigation';
import Deeplink1Navigation from '../Navigations/Deeplink1Navigation';
import Deeplink2Navigation from '../Navigations/Deeplink2Navigation';
import LoginNavigation from '../Navigations/LoginNavigation';
import CompanySelect from '../components/CompanySelect';
import AppIntroSlide from '../components/AppIntroSlide';
import { getT } from '../utils/translateManager';

const MainPresenter = props => {
  t = getT();
  Orientation.unlockAllOrientations();
  const {
    destination,
    onChangeRootState,
    onChangeMainState,
    params,
    from
  } = props;
  const screenProps = {
    onChangeRootState,
    onChangeMainState,
    params,
    destination,
    from,
    t
  };
  switch (destination) {
    case 'Login':
      return <LoginNavigation screenProps={screenProps} />;

    case 'List':
      return (
        <AppIntroSlide>
          <RootNavigation screenProps={screenProps} />
        </AppIntroSlide>
      );

    case 'SelectCompany':
      return <CompanySelect screenProps={screenProps} />;

    case 'Setting':
      return <Deeplink1Navigation screenProps={screenProps} />;

    case 'Conference':
      return <Deeplink2Navigation screenProps={screenProps} />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

export default MainPresenter;
