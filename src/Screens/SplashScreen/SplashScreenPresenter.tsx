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

// if (alert.visible)
//   return (
//     <CustomAlert
//       visible={alert.visible}
//       title={t('renewal.alert_title_notion')}
//       width={320}
//       description={alert.description}
//       actions={alert.actions}
//       onClose={alert.onClose}
//     />
//   );
