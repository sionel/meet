import React, { Fragment } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SectionList,
  Text,
  TextInput
} from 'react-native';
import { wehagoDummyImageURL, wehagoMainURL } from '../../../../utils';
import CustomCheckBox from '../../../../components/renewal/CustomCheckBox';
import { getT } from '../../../../utils/translateManager';

const ic_building = require('../../../../../assets/new/icons/ic_build.png');
const ic_empty = require('../../../../../assets/new/icons/ic_empty.png');
const ic_mail = require('../../../../../assets/new/icons/ic_mail.png');

const OrganizationTab = (props: any) => {
  const {
    tabType,
    keyword,
    organization,
    OrganizationFlatList,
    searchedEmployee,
    selectEmployee,
    auth,
    selectedEmployee,
    contacts,
    inviteText,
    setInviteText,
    // invited,
    // setInvited,
    recents,
    validateExter,
    exterError,
    focusOut,
    sendEmailRef,
    isHorizon
  } = props;
  const t = getT();
  return (
    <Fragment>
      {/* 조직도 */}
      {(tabType === 'org' &&
        (keyword === '' ? (
          <ScrollView bounces={false} style={{ flex: 1 }}>
            <View>
              <View
                style={[styles.lineContainer, { backgroundColor: '#fbfbfb' }]}
              >
                <Image source={ic_building} />
                {/* <CustomIcon name={'icoCompany'} size={24} /> */}
                <Text
                  style={[
                    styles.textStyle,
                    { color: '#1c90fb', marginLeft: 4 }
                  ]}
                >
                  {organization.organization_name}({organization.employee_count}
                  )
                </Text>
              </View>
              {OrganizationFlatList(organization.children)}
            </View>
          </ScrollView>
        ) : searchedEmployee.length === 0 ? (
          <View
            style={{
              paddingTop: 118,
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onTouchStart={() => focusOut()}
          >
            <Image source={ic_empty} style={styles.icEmpty45} />
            <Text>{t('검색결과가 존재하지 않습니다.')}</Text>
          </View>
        ) : (
          <SectionList
            sections={searchedEmployee}
            keyExtractor={(item, index) => index.toString()}
            renderSectionHeader={({ section }) => (
              <Text style={styles.category}>{section.title}</Text>
            )}
            renderItem={({ item, index, section }) => {
              return (
                <TouchableOpacity
                  disabled={item.user_no === auth.user_no}
                  onPress={() => selectEmployee('member', item)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10
                  }}
                >
                  <Image
                    source={{
                      uri: item.profile_url
                        ? wehagoMainURL + item.profile_url
                        : wehagoDummyImageURL
                    }}
                    style={styles.profileImg}
                  />
                  <View style={{ marginHorizontal: 10, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>
                      {item.user_name +
                        ' ' +
                        item.rank_name +
                        '(' +
                        item.portal_id +
                        ')'}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode={'tail'}
                      style={{
                        fontSize: 10,
                        color: '#8c8c8c',
                        marginTop: 5
                      }}
                    >
                      {item.full_path}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 'auto', width: 30 }}>
                    {item.user_no !== auth.user_no ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 10
                        }}
                      >
                        <CustomCheckBox
                          color="#ccc"
                          onCheck={() => selectEmployee('member', item)}
                          checked={
                            selectedEmployee.member.findIndex(
                              (i: any) => i.user_no === item.user_no
                            ) !== -1
                              ? true
                              : false
                          }
                          style={{ width: 18, height: 18 }}
                        />
                      </View>
                    ) : (
                      <Fragment></Fragment>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ))) ||
        // 연락처
        (tabType === 'contact' &&
          (keyword === '' ? (
            <SectionList
              sections={contacts}
              keyExtractor={(item, index) => index.toString()}
              renderSectionHeader={({ section }: any) => (
                <Text style={styles.category}>{section.title}</Text>
              )}
              renderItem={({ item, index, section }) => {
                return (
                  <TouchableOpacity
                    onPress={() => selectEmployee('member', item)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10
                    }}
                  >
                    <Image
                      source={{
                        uri: item.profile_image
                          ? wehagoMainURL + item.profile_image
                          : wehagoDummyImageURL
                      }}
                      style={styles.profileImg}
                    />
                    <View style={{ marginHorizontal: 10, flex: 1 }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {item.address_name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={{
                          fontSize: 13,
                          color: '#8c8c8c',
                          marginTop: 3
                        }}
                      >
                        {item.emailinfolist[0].email_address}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 'auto', width: 30 }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 10
                        }}
                      >
                        <CustomCheckBox
                          color="#ccc"
                          onCheck={() => selectEmployee('member', item)}
                          checked={
                            selectedEmployee.member.findIndex(
                              (i: any) =>
                                i.address_service_no === item.address_service_no
                            ) !== -1
                              ? true
                              : false
                          }
                          style={{ width: 18, height: 18 }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ) : searchedEmployee.length === 0 ? (
            <View
              style={{
                paddingTop: 118,
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onTouchStart={() => focusOut()}
            >
              <Image
                source={ic_empty}
                style={{
                  resizeMode: 'contain',
                  width: '45%',
                  height: '45%'
                }}
              />
              <Text>{t('등록된 연락처가 없습니다.')}</Text>
            </View>
          ) : (
            <SectionList
              sections={searchedEmployee}
              keyExtractor={(item, index) => index.toString()}
              renderSectionHeader={({ section }) => (
                <Text style={styles.category}>{section.title}</Text>
              )}
              renderItem={({ item, index, section }) => {
                return (
                  <TouchableOpacity
                    onPress={() => selectEmployee('member', item)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10
                    }}
                  >
                    <Image
                      source={{
                        uri: item.profile_image
                          ? wehagoMainURL + item.profile_image
                          : wehagoDummyImageURL
                      }}
                      style={styles.profileImg}
                    />
                    <View style={{ marginHorizontal: 10, flex: 1 }}>
                      <Text style={{ fontWeight: 'bold' }}>
                        {item.address_name}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 'auto', width: 30 }}>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 10
                        }}
                      >
                        <CustomCheckBox
                          color="#ccc"
                          onCheck={() => selectEmployee('member', item)}
                          checked={
                            selectedEmployee.member[item.user_no] ? true : false
                          }
                          style={{ width: 18, height: 18 }}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          ))) ||
        //   외부참여자
        (tabType === 'exter' && (
          <View
            style={{ flex: 1, justifyContent: 'flex-start' }}
            onTouchStart={() => focusOut()}
          >
            <View
              style={{
                paddingHorizontal: '5%',
                paddingVertical: '2%',
                height: '20%',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderBottomWidth: 2,
                borderBottomColor: '#8c8c8c'
              }}
            >
              <Text style={{ fontSize: 15 }}>{t('참여자 초대')}</Text>
              <View style={{ flexDirection: 'column', height: 60 }}>
                <View style={styles.rowView}>
                  <TextInput
                    style={[
                      styles.emailText,
                      inviteText && { borderColor: '#1c90fb' }
                    ]}
                    placeholder={t('초대할 사람의 이메일을 입력해주세요.')}
                    autoCapitalize={'none'}
                    autoCompleteType={'email' || 'tel'}
                    onSubmitEditing={() => validateExter()}
                    clearButtonMode={'always'}
                    onChangeText={setInviteText}
                    value={inviteText}
                    ref={sendEmailRef}
                  />
                  <TouchableOpacity
                    style={{
                      width: 40,
                      height: 30,
                      backgroundColor: '#1c90fb',
                      borderRadius: 5,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onPress={() => validateExter()}
                  >
                    <Image
                      source={ic_mail}
                      style={{
                        width: 35,
                        height: 25,
                        resizeMode: 'cover'
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {exterError && (
                  <Text style={styles.emailError}>
                    {t('이미 추가된 이메일입니다.')}
                  </Text>
                )}
              </View>
            </View>

            {/* {invited.length > 0 && (
              <>
                <View style={{ backgroundColor: '#f1f2f3' }}>
                  <Text style={{ margin: 10, fontSize: 15 }}>
                    {t('선택된 이메일')}
                  </Text>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  data={invited}
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={styles.selectedEmailRow}
                      >
                        {item.type === 'email' && (
                          <View
                            style={{
                              backgroundColor: '#1c90fb',
                              padding: 5,
                              borderRadius: 20
                            }}
                          >
                            <Image
                              source={ic_mail}
                              style={{
                                width: 18,
                                height: 18,
                                resizeMode: 'cover'
                              }}
                            />
                          </View>
                        )}
                        <Text style={{ paddingLeft: 10 }}>{item.value}</Text>
                      </View>
                    );
                  }}
                />
              </>
            )} */}
            {recents.length > 0 ? (
              <Fragment>
                <View style={{ borderBottomWidth: 1, borderColor: '#ccc' }} />
                <View style={{ backgroundColor: '#f1f2f3' }}>
                  <Text
                    style={[
                      {
                        fontSize: 15,
                        paddingHorizontal: '5%',
                        paddingVertical: '3%'
                      },
                      isHorizon && { paddingVertical: '2%' }
                    ]}
                  >
                    {t('최근 초대한 이메일')}
                  </Text>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  data={recents}
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={[styles.recentRow, isHorizon && {paddingVertical: '1%'}]}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          {item.type === 'email' && (
                            <View style={styles.mailBg}>
                              <Image source={ic_mail} style={styles.icMail18} />
                            </View>
                          )}
                          <Text style={{ paddingLeft: 10 }}>{item.value}</Text>
                        </View>
                        <View
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <CustomCheckBox
                            color="#ccc"
                            onCheck={() => selectEmployee('member', item)}
                            checked={
                              selectedEmployee.member.findIndex(
                                (i: any) => i.value === item.value
                              ) !== -1
                                ? true
                                : false
                            }
                            style={{ width: 18, height: 18 }}
                          />
                        </View>
                      </View>
                    );
                  }}
                />
              </Fragment>
            ) : (
              <View
                style={{
                  paddingTop: 118,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Image source={ic_empty} style={styles.icEmpty} />
                <Text style={{ margin: 10 }}>
                  {t('최근 초대한 참여자가 없습니다.')}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  {t('초대할 참여자의 이메일을 입력해보세요.')}
                </Text>
              </View>
            )}
          </View>
        ))}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  lineContainer: {
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
    // paddingVertical: 12,
    paddingHorizontal: 16
  },
  lineItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4
  },
  textStyle: {
    // flex: 1,
    // fontSize: 14,
    color: '#000'
  },
  category: {
    flex: 1,
    padding: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderColor: '#ececec',
    backgroundColor: '#f6f7f8',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    color: '#555555'
  },
  icEmpty: {
    resizeMode: 'contain',
    width: '43%',
    height: '43%'
  },
  icEmpty45: {
    resizeMode: 'contain',
    width: '45%',
    height: '45%'
  },
  icMail18: {
    width: 18,
    height: 18,
    resizeMode: 'cover'
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: '2%'
  },
  mailBg: {
    backgroundColor: '#1c90fb',
    padding: 5,
    borderRadius: 20
  },
  selectedEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  emailText: {
    // margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '80%',
    height: 40,
    paddingHorizontal: '3%'
  },
  emailError: {
    color: '#fc4c60',
    fontSize: 12,
    paddingLeft: '1%',
    paddingTop: -10,
    // marginTop: -10,
    paddingBottom: 10
  },
  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#000'
  },
  profileImg: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    backgroundColor: '#ececec'
  }
});

export default OrganizationTab;
