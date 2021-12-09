import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/configureStore';
import { wehagoMainURL } from '../../../utils';
import { getT } from '../../../utils/translateManager';

export type reservationInfo = {
  name: string;
  accessUser: any[];
  isPublic: boolean;
  start: string;
  end: string;
  iscret: boolean;
}

export default function ReservationInfoScreen(props: reservationInfo) {
  const { name, accessUser, isPublic, start, end, iscret } = props;
  const t = getT();
  const { isHorizon } = useSelector((state: RootState) => ({
    isHorizon: state.orientation.isHorizon
  }));
  return (
    <ScrollView
      style={{
        ...styles.container,
        paddingHorizontal: isHorizon ? '20%' : 15
      }}
    >
      <View style={styles.enterInfo}>
        <Text style={styles.enterInfoText}>
          {t('roomstate_reservation_title')}
        </Text>
      </View>

      <View style={styles.info}>
        <View style={styles.wrap}>
          <Text style={styles.text3}>
            {t('roomstate_reservation_basicinfo')}
          </Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>{t('roomstate_reservation_name')}</Text>
          <Text style={styles.text1}>{name}</Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>{t('roomstate_reservation_open')}</Text>
          <Text style={styles.text1}>
            {isPublic
              ? t('roomstate_reservation_open')
              : t('roomstate_reservation_close')}
          </Text>
        </View>

        <View style={styles.hr}></View>

        <View style={styles.wrap}>
          <Text style={styles.text3}>
            {t('roomstate_reservation_reservedtime')}
          </Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>
            {t('roomstate_reservation_starttime')}
          </Text>
          <Text style={styles.text1}>{start}</Text>
        </View>

        <View style={styles.wrap}>
          <Text style={styles.text2}>{t('roomstate_reservation_endtime')}</Text>
          <Text style={styles.text1}>{end}</Text>
        </View>
      </View>
      {iscret ? (
        <>
          <View style={styles.Participant}>
            <Text style={styles.text4}>{`${t('roomstate_reservation_info')} (${
              accessUser.length
            })`}</Text>
          </View>
          <FlatList
            data={accessUser}
            renderItem={({ item }) => {
              const { user, user_name, user_type, profile_url } = item;
              return (
                <TouchableOpacity
                  activeOpacity={1}
                  style={styles.peopleComponent}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.profileCover}>
                      <Image
                        style={styles.profileImg}
                        source={
                          user_type === 1
                            ? {
                                uri: wehagoMainURL + profile_url
                              }
                            : {
                                uri: 'https://static.wehago.com/imgs/common/no_profile.png'
                              }
                        }
                        resizeMode={'center'}
                      />
                    </View>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={styles.nameField}
                    >
                      {user_type === 1 ? user_name : user}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          ></FlatList>
        </>
      ) : (
        <></>
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8ebef'
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
