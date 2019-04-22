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
import { CustomWebView, SectionListHeader } from '../../components';

const ConfigurationScreenPresenter = props => {
  const { webView } = props;
  const userConfig = [
    // {
    //   title: "onDestroyToken",
    //   action: () => props.onDestroyToken()
    // },
    {
      title: '이용약관',
      action: () => props.onChangeValue('webView', true)
    },
    {
      title: '개인정보 처리방침',
      action: () => props.onChangeValue('webView', true)
    },
    {
      title: '버전정보',
      content: Platform.OS === 'ios' ? '1.1.2' : '0.1.2'
      // action: () =>
      //   Alert.alert(
      //     '버전정보',
      //     Platform.OS === 'ios' ? '1.0.2' : '0.1.0',
      //     [{ text: 'OK' }],
      //     { cancelable: true }
      //   )
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
      action: () =>
        Alert.alert(
          '로그아웃 하시겠습니까?',
          '',
          [
            { text: '예', onPress: () => props.onLogout() },
            { text: '아니오', style: 'cancel' }
          ],
          { cancelable: false }
        )
    }
  ];

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, width: '100%' }}>
        <SectionList
          sections={[{ title: '시스템', data: userConfig }]}
          renderSectionHeader={({ section }) => (
            <SectionListHeader title={section.title} />
          )}
          renderItem={({ item }, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.action}
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.item}>{item.title}</Text>
              <Text style={[styles.item, styles.content]}>{item.content}</Text>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={webView}
        blurRadius={1}
        onRequestClose={() => props.onChangeValue('webView', false)}
      >
        <CustomWebView
          view={webView}
          contentTitle="약관 및 정책"
          buttonTitle="확인"
          url="https://www.wehago.com/#/common/policy"
          onClickButton={() => props.onChangeValue('webView', false)}
        />
      </Modal>
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

  item: {
    padding: 10,
    fontSize: 15,
    height: 44
  },
  content: {
    color: '#999'
  }
});

export default ConfigurationScreenPresenter;
