import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Text
} from 'react-native';
import waiting from '../../../../assets/wating.png';

export default function FullroomScreen(props) {
  const content = () => {
    const time = '2020-05-26 14:12';
    return (
      // <View style={styles.container}>
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
          <Image source={waiting} resizeMode="contain" />
          <Text style={{ fontSize: 14, color: 'rgb(80,80,80)' }}>
            {'접속가능한 인원을 초과했습니다.'}
          </Text>
          <View style={{ fontSize: 12, paddingTop: 25 }}>
            <Text style={{ textAlign: 'center', color: 'rgb(171,171,171)' }}>
              {`접속가능한 인원을 초과했습니다.\n해당방 마스터에게 문의해주세요`}
            </Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {'원활한 서비스 이용을 위해 최대 50명까지 접속가능합니다.'}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {'지속적으로 문제발생 시 고객센터로 접수 부탁드립니다.'}
            </Text>
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
    height: 150,
    justifyContent: 'space-around',
    backgroundColor: '#f8f8fa'
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  linedot: {
    marginLeft: 15,
    marginRight: 5,
    fontSize: 5,
    color: '#8c8c8c'
  },
  linetext: {
    color: '#8c8c8c',
    marginRight: 15
  }
});
