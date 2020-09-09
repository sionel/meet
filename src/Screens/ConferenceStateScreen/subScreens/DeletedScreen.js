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

export default function DeletedScreen(props) {
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
            {'화상대화방이 존재하지 않습니다.'}
          </Text>
          <View style={{ fontSize: 12, paddingTop: 25 }}>
            <Text style={{ textAlign: 'center', color: 'rgb(171,171,171)' }}>
              {`화상대화방이 삭제되었거나 진입가능한 시간이 아닙니다. \n 지속적으로 문제발생 시 고객센터로 접수 부탁드립니다.`}
            </Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {'화상대화방의 경우, 시작시간 30분전부터 접속이 가능합니다.'}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {props.isTablet
                ? '참여자로 지정되지 않은 경우, 참여가 불가합니다. 마스터에게 문의해주세요.'
                : '참여자로 지정되지 않은 경우, 참여가 불가합니다. \n마스터에게 문의해주세요.'}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {'시작시간 변경 및 일정이 삭제된 경우 진입이 불가합니다.'}
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
