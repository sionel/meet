/**
 * ConfigurationScreenPresenter
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity
} from 'react-native';
import { CustomAlert, CustomIcon } from '../../components';
import { WEHAGO_ENV } from '../../../config';
import { getT } from '../../utils/translateManager';

const ConfigurationScreenPresenter = props => {
  const t = getT();
  const userConfig = [
    {
      // 버전 수정
      title: t('option_version'),
      icon: 'ico_menu_info',
      content: '2.2.1'
    },
    {
      title: t('option_legal'),
      icon: 'ico_menu_info_law',
      action: () => props.navigation.navigate('Policy'),
      nextPage: true
    },
    {
      title: t('option_awards'),
      icon: 'icoMenuTrophy',
      action: () => props.navigation.navigate('Awards'),
      nextPage: true
    },
    {
      title: t('option_logout'),
      icon: 'ico_menu_login',
      action: () => props.onChangeValue('alert', true)
    }
  ];

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <SectionList
          sections={[{ title: t('option_system'), data: userConfig }]}
          renderItem={({ item }, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              activeOpacity={0.6}
              style={styles.listItem}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <CustomIcon name={item.icon} width={24} height={24} />
                <Text style={styles.item}>{item.title}</Text>
              </View>

              {item.content ? (
                <Text style={[styles.item, styles.content]}>
                  {item.content}
                </Text>
              ) : item.nextPage ? (
                <CustomIcon name={'btn_next'} width={24} height={24} />
              ) : null}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index}
          style={
            props.hasNotch && {
              paddingLeft: props.orientation === 'LANDSCAPE-LEFT' ? 24 : 0,
              paddingRight: props.orientation === 'LANDSCAPE-RIGHT' ? 24 : 0
            }
          }
        />
      </View>
      <CustomAlert
        visible={props.alert}
        title={t('alert_title_logout')}
        width={320}
        description={t('alert_text_logout')}
        actions={[
          {
            name: t('alert_button_cancel'),
            action: () => props.onChangeValue('alert', false)
          },
          { name: t('alert_button_confirm'), action: () => props.onLogout() }
        ]}
        onClose={() => {
          props.onChangeValue('alert', false);
        }}
      />
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },

  listContainer: {
    width: '100%',
    padding: '3%'
  },

  listItem: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ececec'
  },
  item: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
  },
  content: {
    color: '#999',
    fontSize: 12
  }
});

export default ConfigurationScreenPresenter;
