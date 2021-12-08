import React from 'react';
import { StyleSheet, View, ScrollView, Image, Text } from 'react-native';
import { useSelector } from 'react-redux';
import waiting from '../../../../assets/wating.png';
import { RootState } from '../../../redux/configureStore';
import { getT } from '../../../utils/translateManager';

export default function WatingScreen(props:{start:string, isTablet: boolean}) {
  const { start } = props;
  const { isHorizon } = useSelector((state: RootState) => ({
    isHorizon: state.orientation.isHorizon
  }));
  const content = () => {
    const t = getT();
    return (
      <View
        style={{
          ...styles.container,
          paddingHorizontal: isHorizon ? '20%' : 15,
          paddingVertical: isHorizon ? 20 : 0
        }}
      >
        <View
          style={{
            height: isHorizon ? 260 : 500,
            marginBottom: isHorizon ? 10 : 0,
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
            {t('roomstate_wating_title')}
          </Text>
          <View style={{paddingTop: 25 }}>
            <Text style={{fontSize: 12, textAlign: 'center', color: 'rgb(171,171,171)' }}>
              {t('roomstate_wating_thisroom')}
              <Text style={{ color: 'rgb(28,144,251)' }}>{start}</Text>
              {t('roomstate_wating_willstart')}
            </Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {props.isTablet
                ? `${t('roomstate_wating_modify')} ${t(
                    'roomstate_wating_unable'
                  )}`
                : `${t('roomstate_wating_modify')}\n${t(
                    'roomstate_wating_unable'
                  )}`}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {t('roomstate_wating_master')}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {props.isTablet
                ? `${t('roomstate_wating_continue')} ${t(
                    'roomstate_wating_center'
                  )}`
                : `${t('roomstate_wating_continue')}\n${t(
                    'roomstate_wating_center'
                  )}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return !props.isTablet && isHorizon ? (
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
