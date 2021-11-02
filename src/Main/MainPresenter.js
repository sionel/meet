import React from 'react';
import Main from '../Screens/MainScreen';
import SplashScreen from '../Screens/SplashScreen';

const MainPresenter = props => {
  return (
    <SplashScreen>
      <Main />
    </SplashScreen>
  );
};

export default MainPresenter;
