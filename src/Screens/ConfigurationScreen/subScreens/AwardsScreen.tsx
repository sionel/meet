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
import icBack from '../../../../assets/new/icons/ic_back_w.png';

export default function AwardsScreen(props: any) {
  const moveToSite = (url: string) => {
    Linking.openURL(url);
  };
  const t = getT();
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
            {t('option_awards')}
          </Text>
          <View style={{ width: 30 }} />
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
    </Fragment>
  );
}

AwardsScreen.defaultProps = {};

const styles = StyleSheet.create({
  container: { flex: 1 },
  img: {
    resizeMode: 'contain',
    width: 80,
    height: 80
  },
  list: {
    backgroundColor: 'rgb(235,238,240)'
  },
  card: {
    height: 300,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
