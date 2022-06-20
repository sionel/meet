import React from 'react';
import {
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import { CustomIcon } from '@components/index';

import { wehagoDummyImageURL, wehagoMainURL } from '@utils/index';

const ic_cancel = require('@assets/icons/ic_cancel_w.png');
const ic_mail = require('@assets/icons/ic_mail_w.png');

const SelectedPreview = (props: any) => {
  const { selectedEmployee, auth, selectEmployee } = props;

  const group = selectedEmployee.group;
  const member: any[] = selectedEmployee.member;

  if (Object.keys(group).length > 0)
    if (Object.keys(group).length + Object.keys(member).length === 0)
      // console.log('1wrjajs fhsjdgfhjksg hks dghkashgfjk');
      // 선택된 데이터가 없을 시 return null
      return null;

  const createFlatList = (data: any[], type: string) => (
    <FlatList
      bounces={false}
      data={data}
      horizontal={true}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item, index }) => {
        return (
          <View style={styles.profile} key={index}>
            <TouchableOpacity
              disabled={item.user_no === auth.user_no}
              activeOpacity={0.6}
              style={styles.profileTouchArea}
              onPress={() => selectEmployee(type, item)}
            >
              <View
                style={{
                  width: 40,
                  height: 40
                }}
              >
                {type === 'group' ? (
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                      backgroundColor: '#ececec'
                    }}
                  >
                    <CustomIcon name={'icoMenuPlace'} size={30} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.mailStyle,
                      item.value && {
                        backgroundColor: 'rgb(155,174,199)',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }
                    ]}
                  >
                    <Image
                      source={
                        item.value
                          ? ic_mail
                          : {
                              uri: item.profile_url
                            }
                      }
                      style={[
                        styles.mailStyle,
                        item.value && {
                          width: 24,
                          height: 24,
                          backgroundColor: 'transparent'
                        }
                      ]}
                    />
                  </View>
                )}
                {item.user_no !== auth.user_no && (
                  <View style={styles.cancelContainer}>
                    <Image
                      source={ic_cancel}
                      style={{ width: 10, height: 10 }}
                    />
                  </View>
                )}
              </View>

              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.profileName}
              >
                {
                  item[
                    type === 'group'
                      ? 'organization_name'
                      : item['user_name']
                      ? 'user_name'
                      : item['value']
                      ? 'value'
                      : 'address_name'
                  ]
                }
              </Text>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );

  return (
    <View style={styles.selectedPreView}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          flex: 1,
          paddingHorizontal: 6
        }}
      >
        {createFlatList(Object.values(group), 'group')}
        {createFlatList(member, 'member')}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  selectedPreView: {
    height: 80,
    backgroundColor: '#f6f7f8',
    borderColor: '#ececec',
    borderBottomWidth: 1
  },
  profile: {
    alignItems: 'center',
    marginHorizontal: 2,
    width: 60
  },
  profileTouchArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cancelContainer: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7,
    backgroundColor: '#1c90fb'
  },
  mailStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    backgroundColor: '#ececec'
  },
  profileName: {
    fontSize: 12,
    fontFamily: 'DOUZONEText30'
  }
});

export default SelectedPreview;
