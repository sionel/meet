import React from 'react';
import { getT } from '../../utils/translateManager';
import RootNavigation_new from '../../Navigations/RootNavigation_new';

const MainScreenPresenter = (props: any) => {
  
  const t = getT();
  return <RootNavigation_new />
};

export default MainScreenPresenter;
