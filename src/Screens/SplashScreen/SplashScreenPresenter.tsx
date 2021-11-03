import React from 'react';
import { CustomAlert, ServerNotiveCheck, Splash } from '../../components';
import { getT } from '../../utils/translateManager';

export default function SplashScreenPresenter(props: {
  servernoti: [];
  loaded: any;
  children: any;
}) {
  const { servernoti,  loaded, children } = props;

  if (servernoti) return <ServerNotiveCheck servernoti={servernoti} />;
  else return !loaded ? <Splash /> : children;
  // else return <Splash />
}

