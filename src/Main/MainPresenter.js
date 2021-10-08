import React from 'react';
import Main from '../Screens/MainScreen';
import SplashScreen from '../Screens/SplashScreen';

const MainPresenter = props => {
  const { loaded } = props;
  return loaded ? <Main /> : <SplashScreen />;
};

export default MainPresenter;
