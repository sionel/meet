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
import { CustomIcon } from '@components/index';
import { wehagoMainURL } from '@utils/index';
import { WEHAGO_TYPE } from '../../../../config';
import { getT } from '@utils/translateManager';
import { RootState } from '../../../redux/configureStore';

import icBack from '@assets/icons/ic_back.png';
import icArrowRight from '@assets/icons/ic_arrow_right.png';
import { ConfigurationNavigationProps } from '@navigations/ConfigurationStack';

export default function PolicyScreen(props: any) {
  const { navigation }: ConfigurationNavigationProps<'Policy'> = props;
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
    <SafeAreaView style={styles.container}>
      <View style={[styles.topTitle]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={icBack}
            style={{ width: 24, height: 24 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        <Text style={styles.HeaderTitleText}>{t('renewal.option_legal')}</Text>
        <TouchableOpacity disabled={true}>
          <Text style={styles.emptyText}>확인</Text>
        </TouchableOpacity>
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
  );
}

PolicyScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  columnContainer: {
    flexDirection: 'row',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d1d1d1',
    paddingHorizontal: 10,
    backgroundColor: '#F7F8FA'
  },
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    borderColor: '#d1d1d1',
    borderBottomWidth: 1,
    backgroundColor: '#F7F8FA'
  },
  HeaderTitleText: {
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
    color: '#000'
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#00ff0000'
  }
});
