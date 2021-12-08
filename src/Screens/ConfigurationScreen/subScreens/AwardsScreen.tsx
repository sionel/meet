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
  const { navigation, route }: ConfigurationNavigationProps<'Awards'> = props;
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
          <Text
            style={{
              fontFamily: 'DOUZONEText50',
              fontSize: 16,
              // fontWeight: 'bold',
              marginTop: 20
            }}
          >
            {t('option_auth')}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'DOUZONEText30' }}>
            {t('option_kisa')}
          </Text>
          <Text
            style={{
              fontFamily: 'DOUZONEText30',
              fontSize: 12,
              color: 'rgb(140,140,140)',
              marginTop: 20
            }}
          >
            {t('option_WEHAGOV')}
          </Text>
          <Text
            style={{
              fontFamily: 'DOUZONEText30',
              fontSize: 12,
              color: 'rgb(140,140,140)'
            }}
          >
            2019.08.28~2024.08.27
          </Text>
          <TouchableOpacity
            onPress={() =>
              moveToSite('https://isms.kisa.or.kr/main/csap/intro/')
            }
          >
            <Text
              style={{
                fontFamily: 'DOUZONEText30',
                marginTop: 20,
                fontSize: 13,
                color: 'rgb(39,67,222)'
              }}
            >
              {t('option_to')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

AwardsScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor:'#F7F8FA' },
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
    fontWeight: '600',
    color: '#000'
  },
  emptyText: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#00ff0000'
  }
});
