import React from 'react';
import { CustomAlert, ServerNotiveCheck, Splash } from '../../components';

export default function SplashScreenPresenter(props) {
  const { alert, servernoti } = props;
  if (alert)
    return (
      <CustomAlert
        visible={alert.visible}
        title={'알림'}
        width={320}
        description={alert.description}
        actions={alert.actions}
        onClose={alert.onClose}
      />
    );
  else if (servernoti) return <ServerNotiveCheck servernoti={servernoti} />;
  else
    return (
      <Splash/>
    );
}
