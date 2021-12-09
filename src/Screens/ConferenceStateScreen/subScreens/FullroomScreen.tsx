import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import waiting from '../../../../assets/wating.png';
import { getT } from '../../../utils/translateManager';

export default function FullroomScreen(props:any) {
  const content = () => {
    const t = getT();
    return (
      <View
        style={{
          ...styles.container,
          paddingHorizontal: props.orientation === 'horizontal' ? '20%' : 15,
          paddingVertical: props.orientation === 'horizontal' ? 20 : 0
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
            {t('roomstate_full_title')}
          </Text>
          <View style={{paddingTop: 25 }}>
            <Text style={{fontSize: 12, textAlign: 'center', color: 'rgb(171,171,171)' }}>
              {t('roomstate_full_master')}
            </Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>{t('roomstate_full_fifty')}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>{t('roomstate_full_center')}</Text>
          </View>
        </View>
      </View>
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
    height: 100,
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
