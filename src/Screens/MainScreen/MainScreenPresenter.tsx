import React from 'react';
import Orientation from 'react-native-orientation-locker';
import { getT } from '../../utils/translateManager';
import RootNavigation from '../..//Navigations/RootNavigation';
import Deeplink1Navigation from '../../Navigations/Deeplink1Navigation';
import Deeplink2Navigation from '../../Navigations/Deeplink2Navigation';
import LoginNavigation from '../../Navigations/LoginNavigation';
import CompanySelect from '../../components/CompanySelect';
import AppIntroSlide from '../../components/AppIntroSlide';
import { StatusBar, View } from 'react-native';

const MainScreenPresenter = (props: any) => {
  
  const t = getT();
  // Orientation.unlockAllOrientations();
  const { destination } = props;
  const screenProps = {t};
  switch (destination) {
    case 'Login':
      return <LoginNavigation screenProps={screenProps} />;

    case 'List':
      return (
        <AppIntroSlide>
          <StatusBar />
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

  return <View />
};

export default MainScreenPresenter;
