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
  SafeAreaView,
  Text,
  TextInput,
  Platform,
  Animated
} from 'react-native';
import CustomCheckBox from '../../../components/renewal/CustomCheckBox';
import { CustomIcon } from '../../../components';
import { wehagoDummyImageURL, wehagoMainURL } from '../../../utils';
import SelectedPreview from './Component/SelectedPreview';
import OrganizationFlatList from './Component/OrganizationFlatList';

const ic_cancel = require('../../../../assets/new/icons/ic_cancel_w.png');
const ic_building = require('../../../../assets/new/icons/ic_build.png');
const ic_arrow_up = require('../../../../assets/new/icons/ic_arrow_up.png');
const ic_arrow_down = require('../../../../assets/new/icons/ic_arrow_down.png');
const ic_person = require('../../../../assets/new/icons/ic_person.png');

const OrganizationScreenPresenter = (props: any) => {
  const {
    contacts,
    tabType,
    setTabType,
    keyword,
    setKeyword,
    doSearch,
    inviteText,
    setInviteText,
    searchedEmployee,
    openGroup,
    setOpenGroup,
    organization,
    setSelectMode,
    selectEmployee,
    selectedEmployee,
    getOrganizationEmployeeTree,
    organizationEmployee,
    invited,
    setInvited,
    recents,
    isDataLoading,
    spin,
    t,
    participantListAdd,
    onClickCancel,
    auth,
    listLng
  } = props;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity
          disabled={Object.keys(selectedEmployee.member).length > listLng}
          onPress={() => onClickCancel()}
        >
          <Text
            style={[
              styles.ft14N,
              Object.keys(selectedEmployee.member).length > listLng && {
                color: '#d3d3d3'
              }
            ]}
          >
            {t('뒤로')}
          </Text>
        </TouchableOpacity>
        <Text style={styles.TitleText}>{t('참석자 추가')}</Text>
        <TouchableOpacity onPress={() => participantListAdd()}>
          <Text style={styles.ft14N}>{t('추가')}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#F7F8FA', flex: 0.005 }} />

      {isDataLoading ? (
        <View style={styles.dimmed}>
          <Animated.View
            style={{
              transform: [{ rotate: spin }],
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CustomIcon name={'loading'} size={48} />
          </Animated.View>
          <Text style={styles.loadingText}>
            {'조직도를 불러오고 있습니다.'}
          </Text>
        </View>
      ) : (
        <View style={styles.container}>
          {organization.company_no === -1 ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#00000050'
              }}
            >
              <CustomIcon name={'btnTnaviHomeNone'} size={36} />
            </View>
          ) : (
            <>
              {/* 선택된 조직/조직도 표시 */}
              <SelectedPreview
                selectedEmployee={selectedEmployee}
                auth={auth}
                selectEmployee={selectEmployee}
              />
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setTabType('org')}
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
                  onPress={() => setTabType('contact')}
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
                  onPress={() => setTabType('exter')}
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
              {tabType !== 'exter' ? (
                <View
                  style={{
                    height: 36,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e8ebef',
                    padding: 3
                  }}
                >
                  <View style={styles.search}>
                    <TextInput
                      style={styles.input}
                      returnKeyType="search"
                      value={keyword}
                      onChangeText={setKeyword}
                      onSubmitEditing={() => {
                        doSearch();
                      }}
                    />
                    {keyword ? (
                      <TouchableOpacity onPress={() => setKeyword('')}>
                        <View style={styles.cancleIcon}>
                          <Image source={ic_cancel} style={styles.icCancel} />
                        </View>
                      </TouchableOpacity>
                    ) : null}
                    <TouchableOpacity onPress={doSearch}>
                      <View style={styles.searchIcon}>
                        <CustomIcon
                          name={'btn_navi_search_press'}
                          width={20}
                          height={20}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View></View>
              )}

              {(tabType === 'org' &&
                (keyword === '' ? (
                  <ScrollView bounces={false} style={{ flex: 1 }}>
                    <View>
                      <View
                        style={[
                          styles.lineContainer,
                          { backgroundColor: '#fbfbfb' }
                        ]}
                      >
                        <Image source={ic_building} />
                        {/* <CustomIcon name={'icoCompany'} size={24} /> */}
                        <Text
                          style={[
                            styles.textStyle,
                            { color: '#1c90fb', marginLeft: 4 }
                          ]}
                        >
                          {organization.organization_name}(
                          {organization.employee_count})
                        </Text>
                      </View>
                      <OrganizationFlatList
                        selectedEmployee={selectedEmployee}
                        openGroup={openGroup}
                        auth={auth}
                        setOpenGroup={setOpenGroup}
                        organizationEmployee={organizationEmployee}
                        getOrganizationEmployeeTree={
                          getOrganizationEmployeeTree
                        }
                        selectEmployee={selectEmployee}
                      />
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
                    {/* <Image
                          source={''}
                          style={{
                            width: Math.min(width, height) / 2,
                            height: Math.min(width, height) / 2,
                            resizeMode: 'contain'
                          }}
                        /> */}
                    <Text>검색결과가 존재하지 않습니다.</Text>
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
                (tabType === 'contact' &&
                  (keyword === '' ? (
                    <SectionList
                      sections={contacts}
                      keyExtractor={(item, index) => index.toString()}
                      renderSectionHeader={({ section }: any) => (
                        <Text style={styles.category}>{section.title}</Text>
                      )}
                      renderItem={({ item, index, section }) => {
                        test(item);
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
                                    selectedEmployee.member[item.user_no]
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
                      {/* <Image
                            source={require('../../../assets/emptySearch.png')}
                            style={{
                              width: Math.min(width, height) / 2,
                              height: Math.min(width, height) / 2,
                              resizeMode: 'contain'
                            }}
                          /> */}
                      <Text>검색결과가 존재하지 않습니다.</Text>
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
                                    selectedEmployee.member[item.user_no]
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
                  ))) ||
                (tabType === 'exter' && (
                  <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <Text style={{ marginHorizontal: 10, marginTop: 10 }}>
                      {'참여자 초대'}
                    </Text>
                    <TextInput
                      style={{
                        margin: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: '#ccc'
                      }}
                      placeholder={
                        '초대할 사람의 이메일 또는 전화번호를 입력해주세요'
                      }
                      autoCompleteType={'email' || 'tel'}
                      onSubmitEditing={() => {
                        let value = inviteText;
                        let type = 'error';
                        let flag = false;
                        const numReg1 = /^\d{2,3}-\d{3,4}-\d{4}/;
                        const numReg2 = /^01\d{9,11}/;
                        const emailReg =
                          /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                        if (numReg1.test(inviteText)) {
                          type = 'number';
                          flag = true;
                        } else if (numReg2.test(inviteText)) {
                          value =
                            value.length <= 10
                              ? value.replace(
                                  /(\d{3})(\d{3})(\d{3,4})/g,
                                  '$1-$2-$3'
                                )
                              : value.replace(
                                  /(\d{3})(\d{4})(\d{4})/g,
                                  '$1-$2-$3'
                                );
                          type = 'number';
                          flag = true;
                        } else if (emailReg.test(inviteText)) {
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
                            '서식 오류',
                            '전화번호 또는 이메일을 입력해주세요.'
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
                          <Text>{'최근 초대한 참여자'}</Text>
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
                    <View
                      style={{ borderBottomWidth: 1, borderColor: '#ccc' }}
                    />
                    <Text style={{ margin: 10 }}>{'화상회의 참여자'}</Text>
                    <View
                      style={{ borderBottomWidth: 1, borderColor: '#ccc' }}
                    />
                    {invited.length ? (
                      <FlatList
                        data={invited}
                        renderItem={({ index, item, separators }) => {
                          test(item);
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
                          {'등록된 참여자가 없습니다.'}
                        </Text>
                        <Text style={{ textAlign: 'center' }}>
                          {
                            '초대할 참여자의 이메일 또는\n전화번호를 입력해보세요.'
                          }
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
            </>
          )}
        </View>
      )}
    </SafeAreaView>
    // </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: 'red',
    justifyContent: 'flex-start'
  },
  container: {
    flex: 1
    // backgroundColor: '#17a',
    // width: '100%'
  },
  topTitle: {
    paddingLeft: '5%',
    paddingRight: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '6%',
    backgroundColor: '#fff'
  },
  TitleText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600'
  },
  ft14N: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'normal'
  },
  dimmed: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#00000060',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    color: '#dfdfdf',
    marginTop: 10
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
  selectedPreView: {
    height: 80,
    backgroundColor: '#f6f7f8',
    borderColor: '#ececec',
    borderBottomWidth: 1
  },
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
  selectedItem: {
    backgroundColor: '#1C90FB',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 25
  },
  checkBox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkBoxSelected: {
    backgroundColor: '#1C90FB',
    borderColor: '#1C90FB'
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
  search: {
    flex: 1,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    height: Platform.OS === 'ios' ? 30 : 50,
    paddingLeft: 15
  },
  cancleIcon: {
    backgroundColor: '#1c90fb',
    width: 18,
    height: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  },
  searchIcon: {
    // paddingTop: 2,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  },
  icCancel: {
    resizeMode: 'cover',
    width: 14,
    height: 14
  }
});

export default OrganizationScreenPresenter;
