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
import { wehagoDummyImageURL, wehagoMainURL } from '@utils/index';
import CustomCheckBox from '@components/renewal/CustomCheckBox';
import { getT } from '@utils/translateManager';

const ic_company = require('@assets/icons/ic_company.png');
const ic_empty = require('@assets/icons/ic_empty.png');
const ic_noInvited = require('@assets/icons/ic_NoInvited.png');
const ic_send = require('@assets/icons/ic_send_w2.png');
const ic_cancel = require('@assets/icons/ic_cancel.png');
const ic_mail_w = require('@assets/icons/ic_mail_w.png');

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
    emailInviteList,
    // setemailInviteList,
    // recents,
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
                <Image
                  source={ic_company}
                  resizeMode={'cover'}
                  style={{ width: 24, height: 24 }}
                />
                {/* <CustomIcon name={'icoCompany'} size={24} /> */}
                <Text style={styles.textStyle}>
                  {`${organization.organization_name} `}
                </Text>
                <Text style={[styles.textStyle, { color: '#1c90fb' }]}>
                  {`${organization.employee_count}`}
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
            <Text style={styles.searchEmpty}>
              {t('renewal.organization_org_empty')}
            </Text>
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
                    <Text style={styles.orgMain}>
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
                      style={styles.orgSub}
                    >
                      {item.full_path}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 'auto', width: 30 }}>
                    {item.user_no !== auth.user_no ? (
                      <View style={styles.chkboxView}>
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
                          shape={'circle'}
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
                      <Text
                        style={{ fontFamily: 'DOUZONEText30', fontSize: 15 }}
                      >
                        {item.address_name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={styles.contactSub}
                      >
                        {item.emailinfolist[0].email_address}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 'auto', width: 30 }}>
                      <View style={styles.chkboxView}>
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
                          shape={'circle'}
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
              <Text style={styles.searchEmpty}>
                {t('renewal.organization_contacts_empty')}
              </Text>
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
                      <Text style={{ fontFamily: 'DOUZONEText30' }}>
                        {item.address_name}
                      </Text>
                    </View>
                    <View style={{ marginLeft: 'auto', width: 30 }}>
                      <View style={styles.chkboxView}>
                        <CustomCheckBox
                          color="#ccc"
                          onCheck={() => selectEmployee('member', item)}
                          checked={
                            selectedEmployee.member[item.user_no] ? true : false
                          }
                          style={{ width: 18, height: 18 }}
                          shape={'circle'}
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
            style={{
              flex: 1,
              justifyContent: 'flex-start',
              paddingHorizontal: 20
            }}
            onTouchStart={() => focusOut()}
          >
            <View
              style={{
                paddingVertical: 14,
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              {/* <Text style={styles.emailInviteView}>
                {t('renewal.organization_email_invite')}
              </Text> */}
              <View style={{ flexDirection: 'column', height: 60 }}>
                <View style={styles.rowView}>
                  <TextInput
                    style={[
                      styles.emailText,
                      inviteText && { borderColor: '#1c90fb' }
                    ]}
                    placeholder={t(
                      'renewal.organization_eamil_input_placeholder'
                    )}
                    autoCapitalize={'none'}
                    autoCompleteType={'email' || 'tel'}
                    onSubmitEditing={() => validateExter()}
                    clearButtonMode={'always'}
                    onChangeText={setInviteText}
                    value={inviteText}
                    ref={sendEmailRef}
                    placeholderTextColor={'rgb(147,147,147)'}
                  />
                  <TouchableOpacity
                    style={{ width: 24, height: 24 }}
                    onPress={() => validateExter()}
                  >
                    <Image
                      source={ic_send}
                      style={{
                        width: 24,
                        height: 24,
                        resizeMode: 'cover'
                      }}
                    />
                  </TouchableOpacity>
                </View>
                {exterError && (
                  <Text style={styles.emailError}>
                    {t('renewal.organization_eamil_input_error')}
                  </Text>
                )}
              </View>
            </View>

            {/* {emailInviteList.length > 0 && (
              <>
                <View style={{ backgroundColor: '#f1f2f3' }}>
                  <Text style={{ margin: 10, fontSize: 15 }}>
                    {t('선택된 이메일')}
                  </Text>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  data={emailInviteList}
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
                              source={ic_send}
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
            {emailInviteList.length > 0 ? (
              <Fragment>
                <View>
                  <Text
                    style={[
                      styles.recentemailText,
                      isHorizon && { paddingVertical: '2%' }
                    ]}
                  >
                    {t('초대 이메일')}
                  </Text>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  data={emailInviteList}
                  keyExtractor={(item, index) => String(index)}
                  renderItem={({ item, index }) => {
                    return (
                      <View
                        style={[
                          styles.recentRow,
                          isHorizon && { paddingVertical: '1%' }
                        ]}
                      >
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center'
                          }}
                        >
                          {item.type === 'email' && (
                            <View style={styles.mailBg}>
                              <Image
                                source={ic_mail_w}
                                style={styles.icMail24}
                              />
                            </View>
                          )}
                          <Text
                            style={{
                              paddingLeft: 10,
                              fontFamily: 'DOUZONEText30'
                            }}
                          >
                            {item.value}
                          </Text>
                        </View>
                        {/* {TODO: 체크 박스 말고 X 버튼으로} */}
                        <TouchableOpacity
                          onPress={() => selectEmployee('member', item)}
                          style={{ width: 18, height: 18 }}
                        >
                          <Image
                            source={ic_cancel}
                            resizeMode={'cover'}
                            style={{ width: 18, height: 18 }}
                          />
                          {/* <CustomCheckBox
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
                          /> */}
                        </TouchableOpacity>
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
                <Image source={ic_noInvited} style={styles.icEmpty} />
                <Text style={{ margin: 10, fontFamily: 'DOUZONEText30' }}>
                  {t('renewal.organization_email_recent_empty1')}
                </Text>
                <Text
                  style={{ textAlign: 'center', fontFamily: 'DOUZONEText30' }}
                >
                  {t('renewal.organization_email_recent_empty2')}
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
    fontSize: 16,
    color: '#000',
    fontFamily: 'DOUZONEText50'
  },
  category: {
    flex: 1,
    padding: 12,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    // borderWidth: 1,
    // borderColor: '#ececec',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
    color: '#333',
    fontFamily: 'DOUZONEText50'
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
  icMail24: {
    width: 24,
    height: 24,
    resizeMode: 'cover'
  },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: '2%'
  },
  mailBg: {
    backgroundColor: 'rgb(155,174,199)',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20
  },
  selectedEmailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  emailText: {
    // margin: 10,
    flex: 1,
    height: 18,
    fontFamily: 'DOUZONEText30',
    fontSize: 14
  },
  emailError: {
    color: '#fc4c60',
    fontSize: 12,
    paddingLeft: '1%',
    paddingTop: -10,
    // marginTop: -10,
    paddingBottom: 10,
    fontFamily: 'DOUZONEText30'
  },
  rowView: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    paddingHorizontal: 16
  },
  profileImg: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderRadius: 20,
    backgroundColor: '#ececec'
  },
  contactSub: {
    fontSize: 12,
    color: 'rgb(147,147,147)',
    marginTop: 3,
    fontFamily: 'DOUZONEText30'
  },
  searchEmpty: { fontFamily: 'DOUZONEText30' },
  emailInviteView: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30'
  },
  recentemailText: {
    fontSize: 12,
    paddingVertical: '3%',
    fontFamily: 'DOUZONEText50'
  },
  orgMain: {
    fontFamily: 'DOUZONEText50'
  },
  orgSub: {
    fontFamily: 'DOUZONEText30',
    fontSize: 10,
    color: '#8c8c8c',
    marginTop: 5
  },
  chkboxView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10
  }
});

export default OrganizationTab;
