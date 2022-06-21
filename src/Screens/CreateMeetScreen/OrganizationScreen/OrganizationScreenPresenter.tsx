import React, { Dispatch, Fragment, RefObject, SetStateAction } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Text,
  TextInput,
  Platform,
  Animated,
  TouchableHighlight
} from 'react-native';
import CustomCheckBox from '@components/renewal/CustomCheckBox';
import { CustomIcon } from '@components/index';
import SelectedPreview from './Component/SelectedPreview';
import OrganizationTab from './Component/OrganizationTab';
import SearchTextInputBox from '@components/renewal/SearchTextInputBox';

const ic_cancel = require('@assets/icons/ic_cancel_w.png');

const ic_search = require('@assets/icons/ic_search.png');
const ic_folder_close = require('@assets/icons/ic_folder_close.png');
const ic_folder_open = require('@assets/icons/ic_folder_open.png');
const ic_user = require('@assets/icons/ic_user.png');

interface PresenterProps {
  keyword: string;
  inviteText: string;
  tabType: 'org' | 'contact' | 'exter';
  searchedEmployee: any[];
  contacts: { title: string; data: {} }[];
  selectedEmployee: any;
  isOrgDataLoaded: boolean;
  exterError: boolean;
  isTablet: boolean;
  isHorizon: boolean;
  spin: Animated.AnimatedInterpolation;
  searchRef: RefObject<any>;
  sendEmailRef: RefObject<any>;
  openGroup: any;
  organization: any;
  organizationEmployee: any;
  emailInviteList: any[];
  errorMsg: string;
  // recents:any;
  t: any;
  auth: any;
  exterInputBlur: boolean;
  doSearch: () => void;
  validateExter: () => void;
  focusOut: () => void;
  participantListAdd: () => void;
  setTabType: (tap: 'org' | 'contact' | 'exter') => void;
  setKeyword: Dispatch<SetStateAction<string>>;
  setInviteText: (invite: string) => void;
  setOpenGroup: (object: {}) => void;
  selectEmployee: (type: string, item: any) => void;
  getOrganizationEmployeeTree: (organization: number) => any;
  // contactType:'one' | 'email' | 'sms';
  // setContactType:(contactType:'one' | 'email' | 'sms') => void;
  setExterError: any;
  setExterInputBlur: any;
}

const OrganizationScreenPresenter = (props: PresenterProps) => {
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
    selectEmployee,
    selectedEmployee,
    getOrganizationEmployeeTree,
    organizationEmployee,
    // invited,
    // setInvited,
    // recents,
    emailInviteList,
    isOrgDataLoaded,
    spin,
    t,
    participantListAdd,
    auth,
    validateExter,
    exterError,
    errorMsg,
    searchRef,
    focusOut,
    isTablet,
    isHorizon,
    sendEmailRef,
    setExterError,
    exterInputBlur,
    setExterInputBlur
  } = props;

  const OrganizationFlatList = (
    data: any[],
    i = 1,
    type = 'group',
    depth = 0,
    isParentSelected = false
  ) => {
    return (
      <FlatList
        data={data}
        extraData={[openGroup]}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => {
          // 조직원 선택여부
          const selected =
            selectedEmployee.member.findIndex(
              (i: any) => i.user_no === item.user_no
            ) !== -1
              ? true
              : false;
          const isEmployeeSelected = type === 'member' && selected;
          // 조직단위 선택여부
          const isGroupSelected =
            type === 'group' && selectedEmployee.group[item.organization_no];
          // 그래서 선택이 되었느냐
          const isSelected = isEmployeeSelected || isGroupSelected;
          return (
            <View
              style={{
                backgroundColor: (index + i) % 2 === 0 ? '#fbfbfb' : '#f7f7f7'
                // marginLeft: 16
              }}
              key={index}
            >
              <TouchableHighlight
                disabled={item.user_no === auth.user_no}
                style={{ flexDirection: 'row' }}
                underlayColor={'#e9f5ff'}
                onPress={() => {
                  if (type === 'group') {
                    // 조직일 경우 자식요소 토글
                    const group = JSON.parse(JSON.stringify(openGroup));
                    if (group[item.organization_no]) {
                      delete group[item.organization_no];
                    } else {
                      group[item.organization_no] = item;
                    }
                    setOpenGroup(group);
                    if (!item.children) {
                      if (!organizationEmployee[item.organization_no]) {
                        getOrganizationEmployeeTree(
                          Number(item.organization_no)
                        );
                      }
                    }
                  } else {
                    // 조직원일 경우 해당 조직원 선택
                    !isParentSelected && selectEmployee(type, item);
                  }
                }}
              >
                <Fragment>
                  <View
                    style={[
                      styles.lineContainer,
                      { flex: 1, marginLeft: 16 * (depth + 1) }
                    ]}
                  >
                    <View
                      style={[
                        { flexDirection: 'row', alignItems: 'center' }
                        // (isParentSelected || isSelected) && styles.selectedItem
                      ]}
                    >
                      <Image
                        source={
                          type === 'group'
                            ? openGroup[item.organization_no]
                              ? isParentSelected || isSelected
                                ? ic_folder_close
                                : ic_folder_open
                              : isParentSelected || isSelected
                              ? ic_folder_open
                              : ic_folder_close
                            : isParentSelected || isSelected
                            ? ic_user
                            : ic_user
                        }
                        style={{ width: 24, height: 24 }}
                      />
                      <View style={styles.lineItem}>
                        <Text
                          style={[
                            styles.textStyle,
                            type === 'group'
                              ? openGroup[item.organization_no]
                                ? isParentSelected || isSelected
                                  ? null
                                  : {
                                      color: '#1c90fb'
                                    }
                                : isParentSelected || isSelected
                                ? {
                                    color: '#1c90fb'
                                  }
                                : null
                              : isParentSelected || isSelected
                              ? {
                                  color: '#1c90fb'
                                }
                              : null
                          ]}
                        >
                          {type === 'group'
                            ? item.organization_name
                            : item.user_name}
                          &nbsp;
                          {type === 'group' ? (
                            <Text
                              style={{
                                color:
                                  isParentSelected || isSelected
                                    ? '#fff'
                                    : '#1c90fb',
                                fontFamily: 'DOUZONEText30'
                              }}
                            >
                              {item.employee_count}
                            </Text>
                          ) : (
                            item.rank_name
                          )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* checkBox UI */}
                  {!isParentSelected &&
                    type === 'member' &&
                    item.user_no !== auth.user_no && (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingRight: 10
                        }}
                      >
                        <CustomCheckBox
                          color="#ccc"
                          onCheck={() => selectEmployee(type, item)}
                          checked={isSelected}
                          shape={'circle'}
                        />
                      </View>
                    )}
                </Fragment>
              </TouchableHighlight>

              {/* 자식 조직이 존재할 때 */}
              {type === 'group' && openGroup[item.organization_no] && (
                <View>
                  {item.children &&
                    OrganizationFlatList(
                      item.children,
                      index,
                      type,
                      depth + 1,
                      isParentSelected || isSelected
                    )}
                </View>
              )}

              {/* 자식 조직이 더 없을 때 조직원 리스트 */}
              {type === 'group' &&
                openGroup[item.organization_no] &&
                organizationEmployee[item.organization_no] && (
                  <View>
                    {!item.children &&
                      OrganizationFlatList(
                        organizationEmployee[item.organization_no],
                        index,
                        'member',
                        depth + 1,
                        isParentSelected || isSelected
                      )}
                  </View>
                )}
            </View>
          );
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.topTitle]}>
        <TouchableOpacity disabled={true}>
          <Text style={[styles.ft14N, { color: '#00ff0000' }]}>
            {t('뒤로')}
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.TitleText}>
            {t('renewal.organization_page_title')}
          </Text>
          <Text style={styles.participantsCount}>
            {'  '}
            {selectedEmployee.member.length}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => participantListAdd()}
          // style={{ marginLeft: isHorizon ? '23%' : '27%' }}
        >
          <Text style={styles.ft14N}>{t('renewal.alert_button_confirm')}</Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#F7F8FA', flex: 0.005 }} />

      {isOrgDataLoaded ? (
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
            {t('renewal.organization_loading_messege')}
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
            <Fragment>
              {/* 선택된 조직/조직도 표시 */}
              <SelectedPreview
                selectedEmployee={selectedEmployee}
                auth={auth}
                selectEmployee={selectEmployee}
              />
              {tabType !== 'exter' && (
                <SearchTextInputBox
                  keyword={keyword}
                  inputboxPlaceholder={t('사용자명을 검색하세요.')}
                  setKeyword={setKeyword}
                  onSearchSubmitEditing={() => doSearch()}
                  searchRef={searchRef}
                />
              )}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderColor: '#e6e6e6',
                  borderBottomWidth: 1
                }}
              >
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setTabType('org');
                    focusOut();
                  }}
                  style={[
                    styles.tabText,
                    tabType === 'org' && styles.selectedTab
                  ]}
                >
                  <Text
                    style={{
                      color: tabType === 'org' ? '#1c90fb' : '#8c8c8c',
                      fontFamily:
                        tabType === 'org' ? 'DOUZONEText50' : 'DOUZONEText30',
                      fontSize: 14
                    }}
                  >
                    {t('renewal.organization_org')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setTabType('contact');
                    focusOut();
                  }}
                  style={[
                    styles.tabText,
                    tabType === 'contact' && styles.selectedTab
                  ]}
                >
                  <Text
                    style={{
                      color: tabType === 'contact' ? '#1c90fb' : '#8c8c8c',
                      fontFamily:
                        tabType === 'contact'
                          ? 'DOUZONEText50'
                          : 'DOUZONEText30',
                      fontSize: 14
                    }}
                  >
                    {t('renewal.organization_contacts')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setTabType('exter');
                    focusOut();
                  }}
                  style={[
                    styles.tabText,
                    tabType === 'exter' && styles.selectedTab
                  ]}
                >
                  <Text
                    style={{
                      color: tabType === 'exter' ? '#1c90fb' : '#8c8c8c',
                      fontFamily:
                        tabType === 'exter' ? 'DOUZONEText50' : 'DOUZONEText30',
                      fontSize: 14
                    }}
                  >
                    {t('renewal.organization_exter')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* {tabType === 'contact' && (
                <Fragment>
                  <View style={{ backgroundColor: '#F7F8FA', height: 15 }} />
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                        onPress={() => setContactType('one')}
                      style={{
                        flex: 1,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor: contactType === 'one' ? '#1c90fb' : '#8c8c8c',
                        borderBottomWidth: contactType === 'one' ? 2 : 1
                      }}
                    >
                      <Text
                        style={{
                          color: contactType === 'one' ? '#1c90fb' : '#8c8c8c'
                        }}
                      >
                        {t('ONE')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                        onPress={() => setContactType('email')}
                      style={{
                        flex: 1,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor:
                          contactType === 'email' ? '#1c90fb' : '#8c8c8c',
                        borderBottomWidth: contactType === 'email' ? 2 : 1
                      }}
                    >
                      <Text
                        style={{
                          color: contactType === 'email' ? '#1c90fb' : '#8c8c8c'
                        }}
                      >
                        {t('이메일')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                        onPress={() => setContactType('sms')}
                      style={{
                        flex: 1,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderColor:
                          contactType === 'sms' ? '#1c90fb' : '#8c8c8c',
                        borderBottomWidth: contactType === 'sms' ? 2 : 1
                      }}
                    >
                      <Text
                        style={{
                          color: contactType === 'sms' ? '#1c90fb' : '#8c8c8c'
                        }}
                      >
                        {t('SMS')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </Fragment>
              )} */}
              <OrganizationTab
                tabType={tabType}
                keyword={keyword}
                organization={organization}
                OrganizationFlatList={OrganizationFlatList}
                searchedEmployee={searchedEmployee}
                selectEmployee={selectEmployee}
                auth={auth}
                emailInviteList={emailInviteList}
                errorMsg={errorMsg}
                exterInputBlur={exterInputBlur}
                // invited={invited}
                selectedEmployee={selectedEmployee}
                contacts={contacts}
                inviteText={inviteText}
                // setInvited={setInvited}
                setInviteText={setInviteText}
                // recents={recents}
                validateExter={validateExter}
                exterError={exterError}
                focusOut={focusOut}
                isTablet={isTablet}
                isHorizon={isHorizon}
                sendEmailRef={sendEmailRef}
                setExterError={setExterError}
                setExterInputBlur={setExterInputBlur}
              />
            </Fragment>
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
    justifyContent: 'flex-start',
    backgroundColor: '#fff'
  },
  container: {
    flex: 1
    // backgroundColor: '#17a',
    // width: '100%'
  },
  topTitle: {
    paddingHorizontal: '5%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff'
  },
  TitleText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'DOUZONEText50'
  },
  participantsCount: {
    color: '#1c90fb',
    fontSize: 18,
    fontFamily: 'DOUZONEText50'
  },
  ft14N: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
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
    fontFamily: 'DOUZONEText30',
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
    color: '#000',
    fontSize: 14,
    fontFamily: 'DOUZONEText30'
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
  search: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6'
  },
  input: {
    flex: 1,
    height: Platform.OS === 'ios' ? 30 : 50,
    paddingLeft: 15
  },
  cancleIcon: {
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
  },
  tabText: {
    // flex: 1,
    width: 111,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center'
    // borderColor: '#e6e6e6',
    // borderBottomWidth: 1
  },
  selectedTab: {
    borderColor: '#1c90fb',
    borderBottomWidth: 2
  }
});

export default OrganizationScreenPresenter;
