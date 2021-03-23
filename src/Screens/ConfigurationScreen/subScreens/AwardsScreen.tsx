import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  Text
} from 'react-native';
import { getT } from '../../../utils/translateManager';

export default function AwardsScreen(props) {
  const moveToSite = url => {
    Linking.openURL(url);
  };
  const t = getT()
  return (
    <View style={styles.container}>
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
            {t('option.인증')}
          </Text>
          <Text style={{ fontSize: 12, fontFamily: 'DOUZONEText30' }}>
            {t('option.kisa')}
          </Text>
          <Text
            style={{
              fontFamily: 'DOUZONEText30',
              fontSize: 12,
              color: 'rgb(140,140,140)',
              marginTop: 20
            }}
          >
            {t('option.WEHAGOV')}
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
              {t('option.바로가기')}
            </Text>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.card}>
          <Image
            source={require('../../../../assets/logoAppqward2019.png')}
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
            스마트앱 어워드 코리아 2019
          </Text>
          <Text style={{ fontFamily: 'DOUZONEText30', fontSize: 12 }}>
            기능서비스부분 통합대상 수상
          </Text>
          <Text
            style={{
              fontFamily: 'DOUZONEText30',
              fontSize: 12,
              color: 'rgb(140,140,140)',
              marginTop: 20
            }}
          >
            서비스명: 더존 위하고 모바일
          </Text>
          <Text
            style={{
              fontFamily: 'DOUZONEText30',
              fontSize: 12,
              color: 'rgb(140,140,140)'
            }}
          >
            수상기관: 더존비즈온
          </Text>
          <TouchableOpacity
            onPress={() =>
              moveToSite(
                'http://www.i-award.or.kr/Smart/Assess/FinalCandidateView.aspx?REG_SEQNO=9188'
              )
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
              사이트바로가기
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
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
