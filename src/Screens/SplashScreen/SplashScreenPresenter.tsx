import React from 'react';
import { CustomAlert, ServerNotiveCheck, Splash } from '../../components';
import { getT } from '../../utils/translateManager';

export default function SplashScreenPresenter(props: {
  servernoti: [];
}) {
  const { servernoti } = props;
  
  return servernoti ?  <ServerNotiveCheck servernoti={servernoti} /> : <Splash /> 
  
  // if (servernoti) return <ServerNotiveCheck servernoti={servernoti} />;
  // else return !loaded || !destination ?  <Splash /> : <RootNavigation_new />;
  // else return !loaded || !destination ? <Splash /> : children;
  // else return <Splash />
}
