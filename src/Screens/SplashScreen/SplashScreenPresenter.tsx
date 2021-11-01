import React from 'react';
import { CustomAlert, ServerNotiveCheck, Splash } from '../../components';
import { getT } from '../../utils/translateManager';

export default function SplashScreenPresenter(props:{alert:any, servernoti:[], t:any}) {
  const { alert, servernoti, t } = props;
  if (alert)
    return (
      <CustomAlert
        visible={alert.visible}
        title={t('renewal.alert_title_notion')}
        width={320}
        description={alert.description}
        actions={alert.actions}
        onClose={alert.onClose}
      />
    );
  else if (servernoti) return <ServerNotiveCheck servernoti={servernoti} />;
  else return <Splash />;
}
