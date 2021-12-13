import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Text,
  SafeAreaView
} from 'react-native';
import { getT } from '../../../utils/translateManager';
import icBack from '../../../../assets/new/icons/ic_back.png';
import { ConfigurationNavigationProps } from '../../../Navigations/ConfigurationStack';

export default function AwardsScreen(props: any) {
  const moveToSite = (url: string) => {
    Linking.openURL(url);
  };
  const t = getT();
  const { navigation }: ConfigurationNavigationProps<'Awards'> = props;
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
        <Text style={styles.HeaderTitleText}>{t('option_awards')}</Text>
        <TouchableOpacity disabled={true}>
          <Text style={styles.emptyText}>확인</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        <View style={[styles.card, { marginTop: 15 }]}>
          <Image
            source={require('../../../../assets/logoCsap.png')}
            style={styles.img}
          />
          <Text style={styles.authText}>{t('option_auth')}</Text>
          <Text style={styles.kisaText}>{t('option_kisa')}</Text>
          <Text style={styles.wehagoVText}>{t('option_WEHAGOV')}</Text>
          <Text style={styles.expDate}>2019.08.28~2024.08.27</Text>
          <TouchableOpacity
            onPress={() =>
              moveToSite('https://isms.kisa.or.kr/main/csap/intro/')
            }
          >
            <Text style={styles.linkStyle}>{t('option_to')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

AwardsScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F8FA' },
  img: {
    resizeMode: 'contain',
    width: 80,
    height: 80
  },
  list: {
    backgroundColor: '#F7F8FA'
  },
  card: {
    height: 300,
    marginHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  authText: {
    fontFamily: 'DOUZONEText50',
    fontSize: 16,
    marginTop: 20
  },
  kisaText: {
    fontSize: 12,
    fontFamily: 'DOUZONEText30'
  },
  wehagoVText: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: 'rgb(140,140,140)',
    marginTop: 20
  },
  expDate: {
    fontFamily: 'DOUZONEText30',
    fontSize: 12,
    color: 'rgb(140,140,140)'
  },
  linkStyle: {
    fontFamily: 'DOUZONEText30',
    marginTop: 20,
    fontSize: 13,
    color: 'rgb(39,67,222)'
  }
});
