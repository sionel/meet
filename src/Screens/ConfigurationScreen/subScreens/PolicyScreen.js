import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Text
} from 'react-native';

import { useSelector } from 'react-redux';
import { CustomIcon } from '../../../components';
import { wehagoMainURL } from '../../../utils';
import { WEHAGO_TYPE } from '../../../../config';

export default function PolicyScreen(props) {
  const { navigation } = props;
  const auth = useSelector(state => state.user['auth']);
  const membership = auth.last_company.membership_code;

  const config = {
    terms: {
      title: WEHAGO_TYPE + ' 이용약관',
      rightSide: <CustomIcon name={'btn_next'} width={24} height={24} />,
      action: () => {
        membership === 'WT1'
          ? Linking.openURL('https://www.wehagot.com/#/common/policy')
          : Linking.openURL(wehagoMainURL + '/#/common/policy');
      }
    },
    policy: {
      title: '개인정보 보호정책',
      rightSide: <CustomIcon name={'btn_next'} width={24} height={24} />,
      action: () => {
        membership === 'WT1'
          ? Linking.openURL('https://www.wehagot.com/#/common/policy?code=002')
          : Linking.openURL(wehagoMainURL + '/#/common/policy?code=002');
      }
    },
    openSource: {
      title: '오픈소스 라이선스',
      rightSide: <CustomIcon name={'btn_next'} width={24} height={24} />,
      action: () => {
        navigation.navigate('OpenSource');
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(config)}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={config[item].action}
            style={styles.columnContainer}
          >
            <Text
              style={{
                flex: 1,
                fontFamily: 'DOUZONEText30',
                marginHorizontal: 5
              }}
            >
              {config[item].title}
            </Text>
            {config[item].rightSide}
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

PolicyScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { flex: 1 },
  columnContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ececec',
    paddingHorizontal: 10
  }
});
