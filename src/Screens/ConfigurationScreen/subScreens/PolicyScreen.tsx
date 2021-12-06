import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Linking,
  Text,
  SafeAreaView,
  Image
} from 'react-native';

import { useSelector } from 'react-redux';
import { CustomIcon } from '../../../components';
import { wehagoMainURL } from '../../../utils';
import { WEHAGO_TYPE } from '../../../../config';
import { getT } from '../../../utils/translateManager';
import { RootState } from '../../../redux/configureStore';

import icBack from '../../../../assets/new/icons/ic_back_w.png';

export default function PolicyScreen(props: any) {
  const { navigation } = props;
  const auth = useSelector((state: RootState) => state.user['auth']);
  const membership = auth.last_company.membership_code;
  const t = getT();
  const config = {
    terms: {
      title: WEHAGO_TYPE + ` ${t('option_terms')}`,
      rightSide: <CustomIcon name={'btn_next'} width={24} height={24} />,
      action: () => {
        membership === 'WT1'
          ? Linking.openURL('https://www.wehagot.com/#/common/policy')
          : Linking.openURL(wehagoMainURL + '/#/common/policy');
      }
    },
    policy: {
      title: t('option_policy'),
      rightSide: <CustomIcon name={'btn_next'} width={24} height={24} />,
      action: () => {
        membership === 'WT1'
          ? Linking.openURL('https://www.wehagot.com/#/common/policy?code=002')
          : Linking.openURL(wehagoMainURL + '/#/common/policy?code=002');
      }
    }
    // openSource: {
    //   title: t('option_opensource'),
    //   rightSide: <CustomIcon name={'btn_next'} width={24} height={24} />,
    //   action: () => {
    //     navigation.navigate('OpenSource');
    //   }
    // }
  };

  return (
    <Fragment>
      <SafeAreaView style={{ flex: 0, backgroundColor: '#1c90fb' }} />
      <SafeAreaView style={styles.container}>
        <View
          style={{
            height: 50,
            backgroundColor: '#1c90fb',
            flexDirection: 'row',
            paddingHorizontal: 20,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}
          >
            <Image
              source={icBack}
              resizeMode={'contain'}
              style={{ width: 30 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 18,
              color: '#fff'
            }}
          >
            {'기본 설정'}
          </Text>
          <View style={{ width: 30 }} />
        </View>

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
      </SafeAreaView>
    </Fragment>
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
