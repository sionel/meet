/**
 * ConfigurationScreenPresenter
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  Platform
} from 'react-native';
import {
  CustomWebView,
  CustomAlert,
  SectionListHeader,
  CustomIcon
} from '../../components';
import { WEHAGO_ENV } from '../../../config';

const ConfigurationScreenPresenter = props => {
  const { webView } = props;
  const userConfig = [
    // {
    //   title: "onDestroyToken",
    //   action: () => props.onDestroyToken()
    // },
    // {
    //   title: '이용약관',
    //   action: () => {
    //     props.onChangeValue('subUrl', '?code=001');
    //     props.onChangeValue('webView', true);
    //   },
    //   nextPage: true
    // },
    // {
    //   title: '개인정보 처리방침',
    //   action: () => {
    //     props.onChangeValue('subUrl', '?code=002');
    //     props.onChangeValue('webView', true);
    //   },
    //   nextPage: true
    // },
    {
      title: '버전정보',
      icon: 'ico_menu_info',
      content:
        WEHAGO_ENV === 'WEHAGOV'
          ? '1.0.0'
          : Platform.OS === 'ios'
          ? '1.24.19'
          : '1.6.1'
    },
    {
      title: '이용약관 및 법률정보',
      icon: 'ico_menu_info_law',
      action: () => props.navigation.navigate('Policy'),
      nextPage: true
    },
    {
      title: '수상 및 인증내역',
      icon: 'icoMenuTrophy',
      action: () => props.navigation.navigate('Awards'),
      nextPage: true
    },
    // {
    // 	title: '앱인트로 보기',
    // 	action: () => props.onToggleVisibleAppIntro()
    // },
    // {
    // 	title: '로그 보기',
    // 	action: () => alert(JSON.stringify(props.log).replace(/,/gi, /,\n/))
    // },
    {
      title: '로그아웃',
      icon: 'ico_menu_login',
      action: () => props.onChangeValue('alert', true)
    }
  ];

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <SectionList
          sections={[{ title: '시스템', data: userConfig }]}
          renderSectionHeader={({ section }) =>
            // <SectionListHeader title={section.title} />
            null
          }
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

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={webView}
        blurRadius={1}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right'
        ]}
        onRequestClose={() => props.onChangeValue('webView', false)}
      >
        <CustomWebView
          view={webView}
          contentTitle="약관 및 정책"
          buttonTitle="확인"
          url={'https://www.wehago.com/#/common/policy' + props.subUrl}
          onClickButton={() => props.onChangeValue('webView', false)}
        />
      </Modal> */}

      <CustomAlert
        visible={props.alert}
        title={'로그아웃'}
        width={320}
        description={'로그아웃 하시겠습니까?'}
        actions={[
          { name: '취소', action: () => props.onChangeValue('alert', false) },
          { name: '확인', action: () => props.onLogout() }
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
