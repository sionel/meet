import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import waiting from '@oldassets/wating.png';
import { CustomIcon } from '@components/index';
import { getT } from '@utils/translateManager';

const backBtn = require('@oldassets/buttons/back_btn.png');

export default function WatingScreen(props) {
  const { start } = props;
  const content = () => {
    const t = getT();
    return (
      <Fragment>
        <SafeAreaView style={{ flex: 0, backgroundColor: '#1C90FB' }} />
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              width: '100%',
              height: 50,
              backgroundColor: '#1C90FB',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 2
            }}
          >
            <View style={{ flex: 1 }}>
              <TouchableHighlight
                style={{ paddingLeft: 10 }}
                onPress={() => {
                  props.onClose();
                }}
              >
                <Image
                  source={backBtn}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 30
                  }}
                />
              </TouchableHighlight>
            </View>
            <Text
              style={{
                flex: 1,
                color: '#fff',
                fontSize: 18,
                fontFamily: 'DOUZONEText50',
                textAlign: 'center'
              }}
            >
              {'화상회의'}
            </Text>
            <View
              style={{
                flex: 1
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-around',
              paddingHorizontal:
                props.orientation === 'horizontal' ? '20%' : 15,
              paddingVertical: props.orientation === 'horizontal' ? 20 : 0,
              zIndex: 1
            }}
          >
            <View
              style={{
                height: props.orientation === 'horizontal' ? 260 : 500,
                marginBottom: props.orientation === 'horizontal' ? 10 : 0,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Image
                source={waiting}
                resizeMode="contain"
                style={{ width: 200, height: 200 }}
              />
              <Text style={{ fontSize: 14, color: 'rgb(80,80,80)' }}>
                {t('conference_wating_1')}
              </Text>
              <View style={{ fontSize: 12, paddingTop: 25 }}>
                <Text
                  style={{ textAlign: 'center', color: 'rgb(171,171,171)' }}
                >
                  {t('conference_wating_2')}
                </Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <View style={styles.line}>
                <Text style={styles.linedot}>{'\u2B24'}</Text>
                <Text style={{ fontSize: 12 }}>{t('conference_wating_3')}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.linedot}>{'\u2B24'}</Text>
                <Text style={{ fontSize: 12 }}>{t('conference_wating_4')}</Text>
              </View>
              <View style={styles.line}>
                <Text style={styles.linedot}>{'\u2B24'}</Text>
                <Text style={{ fontSize: 12 }}>{t('conference_wating_5')}</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  };

  return !props.isTablet && props.orientation === 'horizontal' ? (
    <ScrollView>{content()}</ScrollView>
  ) : (
    <View style={{ flex: 1 }}>{content()}</View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around'
  },
  infoBox: {
    height: 150,
    justifyContent: 'center',
    backgroundColor: '#f8f8fa',
    marginVertical: 20
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  linedot: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 5,
    color: '#8c8c8c'
  },
  linetext: {
    color: '#8c8c8c',
    marginRight: 15
  }
});
