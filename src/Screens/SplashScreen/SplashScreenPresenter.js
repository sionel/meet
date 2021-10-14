import React from 'react';
import { CustomAlert, ServerNotiveCheck, Splash } from '../../components';
import { getT } from '../../utils/translateManager';

export default function SplashScreenPresenter(props) {
  const { alert, servernoti } = props;
  const t = getT();
  if (alert)
    return (
      <CustomAlert
        visible={alert.visible}
        title={t('alert_title_notion')}
        width={320}
        description={alert.description}
        actions={alert.actions}
        onClose={alert.onClose}
      />
    );
  else if (servernoti) return <ServerNotiveCheck servernoti={servernoti} />;
  else return <Splash />;
}
