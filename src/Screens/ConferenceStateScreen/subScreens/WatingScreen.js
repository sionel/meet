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
  const { start } = props;
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
          <Image
            source={waiting}
            resizeMode="contain"
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ fontSize: 14, color: 'rgb(80,80,80)' }}>
            {'화상회의 시작전입니다.'}
          </Text>
          <View style={{ fontSize: 12, paddingTop: 25 }}>
            <Text style={{ textAlign: 'center', color: 'rgb(171,171,171)' }}>
              {'해당 화상회의방은 '}
              <Text style={{ color: 'rgb(28,144,251)' }}>{start}</Text>
              {
                ' 시작 예정입니다.\n화상회의에 진입되지 않는 경우, 앱 종료 후 재실행 해주세요'
              }
            </Text>
          </View>
        </View>
        <View style={styles.infoBox}>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {props.isTablet
                ? '화상회의 일정이 변경되거나 방이 삭제 될 경우, 이용하실수 없습니다.'
                : '화상회의 일정이 변경되거나 방이 삭제 될 경우,\n이용하실수 없습니다.'}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {'일정변경 및 취소에 대한 내용은 마스터에게 문의하세요.'}
            </Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.linedot}>{'\u2B24'}</Text>
            <Text style={{ fontSize: 12 }}>
              {props.isTablet
                ? '지속적으로 화면전환이 일어나지 않는 경우, 고객센터에 접수해주세요.'
                : '지속적으로 화면전환이 일어나지 않는 경우,\n고객센터에 접수해주세요.'}
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
    justifyContent: 'space-evenly',
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
