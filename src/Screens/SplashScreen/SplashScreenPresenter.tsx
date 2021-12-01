import React from 'react';
import { CustomAlert, ServerNotiveCheck, Splash } from '../../components';
import { getT } from '../../utils/translateManager';

export default function SplashScreenPresenter(props: {
  servernoti: [];
  loaded: any;
  children: any;
  destination: any;
}) {
  const { servernoti, loaded, children, destination } = props;
  console.log(loaded);
  console.log(children);
  
  
  if (servernoti) return <ServerNotiveCheck servernoti={servernoti} />;
  else return !loaded || !destination ? <Splash /> : children;
  // else return <Splash />
}
