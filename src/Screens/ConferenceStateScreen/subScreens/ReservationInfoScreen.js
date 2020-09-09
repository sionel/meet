import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  Image,
  Dimensions
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { wehagoMainURL } from '../../../utils';

export default function ReservationInfoScreen(props) {
  const { name, accessUser, isPublic, start, end } = props;
  return (
    // <View style={styles.container}>
    <ScrollView
      style={{
        ...styles.container,
        paddingHorizontal: props.orientation === 'horizontal' ? '20%' : 15
      }}
    >
      <View style={styles.enterInfo}>
        <Text style={styles.enterInfoText}>
          {
            '시작 30분 전부터 참여가능합니다.\n예약정보 조회기능만 제공합니다.(변경은 PC에서만 가능)'
          }
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.wrap}>
          <Text style={styles.text3}>기본정보</Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>대화방 이름</Text>
          <Text style={styles.text1}>{name}</Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>공개여부</Text>
          <Text style={styles.text1}>{isPublic ? '공개' : '비공개'}</Text>
        </View>

        <View style={styles.hr}></View>

        <View style={styles.wrap}>
          <Text style={styles.text3}>예약시간</Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>시작시간</Text>
          <Text style={styles.text1}>{start}</Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>종료시간</Text>
          <Text style={styles.text1}>{end}</Text>
        </View>
      </View>

      <View style={styles.Participant}>
        <Text style={styles.text4}>{`참여자정보 (${accessUser.length})`}</Text>
      </View>
      <FlatList
        data={accessUser}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={1} style={styles.peopleComponent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.profileCover}>
                <Image
                  style={styles.profileImg}
                  source={
                    item
                      ? {
                          uri: wehagoMainURL + item.profile_url
                        }
                      : null
                  }
                  resizeMode={'center'}
                />
              </View>
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.nameField}
              >
                {item.user_name}
              </Text>
              {/* {item.id === 'localUser' && (
                <View style={[styles.presenter, { backgroundColor: '#fb0' }]}>
                  <Text style={styles.presenterText}>나</Text>
                </View>
              )} */}
            </View>
          </TouchableOpacity>
        )}
      ></FlatList>
    </ScrollView>
    // </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ebef'
    // paddingHorizontal: width > 850 ? '30%' : '0%'
    // width: isTablet ? '60%' : '100%',
    // justifyContent: 'center',
  },
  enterInfo: {
    marginTop: 20,
    paddingHorizontal: 15,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#e3deff',
    borderRadius: 5
  },
  enterInfoText: {
    color: 'rgb(68, 55, 141)',
    fontSize: 13
  },
  info: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 20,
    marginTop: 20,
    height: 300,
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  hr: {
    borderBottomWidth: 2,
    borderBottomColor: '#f0f0f0'
  },
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Participant: {
    marginTop: 20,
    marginBottom: 10
  },
  peopleComponent: {
    // alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: 60,
    marginBottom: 7,
    paddingLeft: 14,
    paddingRight: 14
  },
  profileCover: {
    width: 32,
    height: 32,
    borderWidth: 0,
    borderRadius: 15,
    backgroundColor: '#ccc',
    overflow: 'hidden',
    marginHorizontal: 10
  },
  profileImg: {
    width: 32,
    height: 32
  },
  nameField: {
    maxWidth: '80%',
    marginLeft: 10,
    fontSize: 15,
    color: '#000'
  },
  presenter: {
    marginLeft: 5,
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 3,
    paddingBottom: 3,
    backgroundColor: '#690',
    borderRadius: 20,
    borderWidth: 0
  },
  presenterText: {
    fontSize: 12,
    color: '#fff'
  },
  text1: { fontSize: 14, color: '#333333', fontFamily: 'DOUZONEText50' },
  text2: { fontSize: 13, color: '#8c8c8c' },
  text3: { fontSize: 12, color: '#000' },
  text4: { fontSize: 13, color: '#000' }
});
