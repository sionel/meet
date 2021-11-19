import React from 'react';
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
  TextInput,
} from 'react-native';
import { wehagoDummyImageURL, wehagoMainURL } from '../../../../utils';
import CustomCheckBox from '../../../../components/renewal/CustomCheckBox';
import { getT } from '../../../../utils/translateManager';

const ic_building = require('../../../../../assets/new/icons/ic_build.png');
const ic_empty = require('../../../../../assets/new/icons/ic_empty.png');

const OrganizationTab = (props: any) => {
  const {
    tabType,
    keyword,
    organization,
    OrganizationFlatList,
    searchedEmployee,
    selectEmployee,
    auth,
    invited,
    selectedEmployee,
    contacts,
    inviteText,
    setInvited,
    setInviteText,
    recents
  } = props;
  const t = getT();
  return (
    <>
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
          >
            <Image
              source={ic_empty}
              style={{
                resizeMode: 'contain',
                width: '45%',
                height: '45%'
              }}
            />
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
                    style={{
                      width: 40,
                      height: 40,
                      resizeMode: 'cover',
                      borderRadius: 20,
                      backgroundColor: '#ececec'
                    }}
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
                        />
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        ))) ||
        // 연락처
        (tabType === 'contact' && (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                //   onPress={() => setTabType('org')}
                style={{
                  flex: 1,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: tabType === 'org' ? '#1c90fb' : '#8c8c8c',
                  borderBottomWidth: tabType === 'org' ? 2 : 1
                }}
              >
                <Text
                  style={{ color: tabType === 'org' ? '#1c90fb' : '#8c8c8c' }}
                >
                  {t('조직도')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                //   onPress={() => setTabType('contact')}
                style={{
                  flex: 1,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: tabType === 'contact' ? '#1c90fb' : '#8c8c8c',
                  borderBottomWidth: tabType === 'contact' ? 2 : 1
                }}
              >
                <Text
                  style={{
                    color: tabType === 'contact' ? '#1c90fb' : '#8c8c8c'
                  }}
                >
                  연락처
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                //   onPress={() => setTabType('exter')}
                style={{
                  flex: 1,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderColor: tabType === 'exter' ? '#1c90fb' : '#8c8c8c',
                  borderBottomWidth: tabType === 'exter' ? 2 : 1
                }}
              >
                <Text
                  style={{
                    color: tabType === 'exter' ? '#1c90fb' : '#8c8c8c'
                  }}
                >
                  외부참여자
                </Text>
              </TouchableOpacity>
            </View>
          ) &&
          (keyword === '' ? (
            <SectionList
              sections={contacts}
              keyExtractor={(item, index) => index.toString()}
              renderSectionHeader={({ section }: any) => (
                <Text style={styles.category}>{section.title}</Text>
              )}
              renderItem={({ item, index, section }) => {
                // test(item);
                // console.log(contacts);

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
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'cover',
                        borderRadius: 20,
                        backgroundColor: '#ececec'
                      }}
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
            >
              <Image
                source={ic_empty}
                style={{
                  resizeMode: 'contain',
                  width: '45%',
                  height: '45%'
                }}
              />
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
                      style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'cover',
                        borderRadius: 20,
                        backgroundColor: '#ececec'
                      }}
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
          <View style={{ flex: 1, justifyContent: 'flex-start' }}>
            <Text style={{ marginHorizontal: 10, marginTop: 10 }}>
              {t('참여자 초대')}
            </Text>
            <TextInput
              style={{
                margin: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc'
              }}
              placeholder={t('초대할 사람의 이메일을 입력해주세요.')}
              autoCompleteType={'email' || 'tel'}
              onSubmitEditing={() => {
                let value = inviteText;
                let type = 'error';
                let flag = false;
                const numReg1 = /^\d{2,3}-\d{3,4}-\d{4}/;
                const numReg2 = /^01\d{9,11}/;
                const emailReg =
                  /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                if (inviteText.match(numReg1)) {
                  type = 'number';
                  flag = true;
                } else if (inviteText.match(numReg2)) {
                  value =
                    value.length <= 10
                      ? value.replace(/(\d{3})(\d{3})(\d{3,4})/g, '$1-$2-$3')
                      : value.replace(/(\d{3})(\d{4})(\d{4})/g, '$1-$2-$3');
                  type = 'number';
                  flag = true;
                } else if (inviteText.match(emailReg)) {
                  type = 'email';
                  flag = true;
                }
                if (flag) {
                  setInvited([
                    ...invited,
                    {
                      type,
                      value
                    }
                  ]);
                  setInviteText('');
                } else {
                  Alert.alert(
                    t('서식 오류'),
                    t('전화번호 또는 이메일을 입력해주세요.')
                  );
                  setInviteText('');
                }
              }}
              clearButtonMode={'always'}
              onChangeText={setInviteText}
              value={inviteText}
            />
            <View>
              {recents.length ? (
                <>
                  <Text>{t('최근 초대한 참여자')}</Text>
                  <FlatList
                    data={recents}
                    renderItem={({ index, item, separators }) => (
                      <View style={{ flexDirection: 'row' }}>
                        <Text>{item.type}</Text>
                        <Text>{item.value}</Text>
                      </View>
                    )}
                  />
                </>
              ) : (
                <></>
              )}
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc' }} />
            <Text style={{ margin: 10 }}>{t('화상회의 참여자')}</Text>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc' }} />
            {invited.length ? (
              <FlatList
                data={invited}
                renderItem={({ index, item, separators }) => {
                  //   test(item);
                  return (
                    <View style={{ flexDirection: 'row' }}>
                      <Text>{item.type}</Text>
                      <Text>{item.value}</Text>
                    </View>
                  );
                }}
              />
            ) : (
              <View
                style={{
                  paddingTop: 118,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {/* <Image
                              source={require('../../../assets/emptySearch.png')}
                              style={{
                                width: Math.min(width, height) / 2,
                                height: Math.min(width, height) / 2,
                                resizeMode: 'contain'
                              }}
                            /> */}
                <Text style={{ margin: 10 }}>
                  {t('등록된 참여자가 없습니다.')}
                </Text>
                <Text style={{ textAlign: 'center' }}>
                  {t('초대할 참여자의 이메일을 입력해보세요.')}
                </Text>
              </View>
            )}
          </View>
        ))}
    </>
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
  }
});

export default OrganizationTab;