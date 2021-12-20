import React, { Fragment, RefObject } from 'react';
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
import CustomCheckBox from '../../../components/renewal/CustomCheckBox';
import { CustomIcon } from '../../../components';
import SelectedPreview from './Component/SelectedPreview';
import OrganizationTab from './Component/OrganizationTab';

const ic_cancel = require('../../../../assets/new/icons/ic_cancel_w.png');

const ic_arrow_up = require('../../../../assets/new/icons/ic_arrow_up.png');
const ic_arrow_down = require('../../../../assets/new/icons/ic_arrow_down.png');
const ic_user = require('../../../../assets/new/icons/ic_user.png');

interface PresenterProps {
  keyword:string;
  inviteText:string;
  tabType:'org' | 'contact' | 'exter';
  searchedEmployee:any[];
  contacts:{title: string, data:{}}[];
  selectedEmployee: any;
  isOrgDataLoaded:boolean;
  exterError:boolean;
  isTablet:boolean;
  isHorizon:boolean;
  spin:Animated.AnimatedInterpolation;
  searchRef:RefObject<any>;
  sendEmailRef:RefObject<any>;
  openGroup:any;
  organization:any;
  organizationEmployee:any;
  recents:any;
  t:any;
  auth:any;
  doSearch:() => void;
  validateExter:() => void;
  focusOut:() => void;
  participantListAdd:() => void;
  setTabType:(tap:'org' | 'contact' | 'exter') =>  void;
  setKeyword:(keyword:string) => void;
  setInviteText:(invite:string) => void;
  setOpenGroup:(object:{}) => void;
  selectEmployee:(type:string, item:any) => void;
  getOrganizationEmployeeTree:(organization: number) => any;
  // contactType:'one' | 'email' | 'sms';
  // setContactType:(contactType:'one' | 'email' | 'sms') => void;
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
    recents,
    isOrgDataLoaded,
    spin,
    t,
    participantListAdd,
    auth,

    validateExter,
    exterError,

    searchRef,
    focusOut,
    isTablet,
    isHorizon,
    sendEmailRef
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
                                ? ic_arrow_up
                                : ic_arrow_down
                              : isParentSelected || isSelected
                              ? ic_arrow_down
                              : ic_arrow_up
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
          <Text style={styles.TitleText}>{t('renewal.organization_page_title')}</Text>
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
              <View style={{ flexDirection: 'row' }}>
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
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    {t('renewal.organization_org')}
                  </Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
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
                      fontFamily: 'DOUZONEText30'
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
                      fontFamily: 'DOUZONEText30'
                    }}
                  >
                    {t('renewal.organization_exter')}
                  </Text>
                </TouchableOpacity> */}
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
                      ref={searchRef}
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
              <OrganizationTab
                tabType={tabType}
                keyword={keyword}
                organization={organization}
                OrganizationFlatList={OrganizationFlatList}
                searchedEmployee={searchedEmployee}
                selectEmployee={selectEmployee}
                auth={auth}
                // invited={invited}
                selectedEmployee={selectedEmployee}
                contacts={contacts}
                inviteText={inviteText}
                // setInvited={setInvited}
                setInviteText={setInviteText}
                recents={recents}
                validateExter={validateExter}
                exterError={exterError}
                focusOut={focusOut}
                isTablet={isTablet}
                isHorizon={isHorizon}
                sendEmailRef={sendEmailRef}
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
  },
  tabText: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#8c8c8c',
    borderBottomWidth: 2
  },
  selectedTab: {
    borderColor: '#1c90fb',
    borderBottomWidth: 3
  }
});

export default OrganizationScreenPresenter;
