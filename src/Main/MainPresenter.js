import React from 'react';
import RootNavigation_new from '../Navigations/RootNavigation_new';
import Main from '../Screens/MainScreen';
import SplashScreen from '../Screens/SplashScreen';

const MainPresenter = props => {
  return (
    <RootNavigation_new />
    // <SplashScreen>
    //   <Main />
    // </SplashScreen>
  );
};

export default MainPresenter;
