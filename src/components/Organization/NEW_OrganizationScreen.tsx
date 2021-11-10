import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SectionList,
  Dimensions,
  Animated,
  Easing,
  SafeAreaView,
  Text,
  TextInput
} from 'react-native';
// import {customIcon} from '../../components'
// component
import { CustomIcon, SectionListHeader } from '../../components';
// import { Text, TextInput } from '../StyledText';

// services
// import OrganizationApi from './OrganizationApi';
import { wehagoMainURL, wehagoDummyImageURL } from '../../utils';
import { OrganizationApi, MeetApi } from '../../services';

// type
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';
import { getT } from '../../utils/translateManager';
const { width, height } = Dimensions.get('screen');

export default function OrganizationScreen(props:any) {
  const {
    // organization,
    employee,
    selectedEmployee,
    setSelectedEmployee,
    invited,
    recents,
    setInvited,
    inviteText,
    setInviteText
  } = props;

  const [keyword, setKeyword] = useState('');
  const [openGroup, setOpenGroup] = useState({});
  const [searchedEmployee, setSearchedEmployee] = useState(employee);
  const [tabType, setTabType] = useState<'org' | 'contact' | 'exter'>('org');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [organizationEmployee, setOrganizationEmployee] = useState({});
  const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [contacts, setContacts] = useState([]);

  const [rotate] = useState(new Animated.Value(0));
  // const setParticipants = props.navigation.getParam('setParticipants');
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const auth = useSelector((state:RootState) => state.user.auth);
  const t = getT();

  // 조직 리스트 조회
  const getOrganizationTree = async () => {
    // 최적화 하려면 여기 코드를 상위로 옮기자
    const result = await OrganizationApi.getOrganizationTreeRequest(auth);
    if (result.error) {
      Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      props.navigation.pop();
    } else {
      const organization = result.resultData[0];
      setorganization(organization);
    }
  };

  const doSearch = async () => {
    if (tabType === 'org') {
      if (keyword === '') {
        setSearchedEmployee(contacts);
      } else {
        const data = employee.reduce((acc:any, item:any) => {
          const temp = item.data.filter((data:any) => data.user_name.match(keyword));
          if (temp.length > 0) acc.push({ title: item.title, data: temp });
          return acc;
        }, []);
        setSearchedEmployee(data);
      }
    } else if (tabType === 'contact') {
      if (keyword === '') {
        setSearchedEmployee(contacts);
      } else {
        const data = contacts.reduce((acc, item) => {
          const temp = item.data.filter(data => {
            return data.address_name.match(keyword);
          });
          if (temp.length > 0) acc.push({ title: item.title, data: temp });
          return acc;
        }, []);
        if (keyword === '김') console.log(data);
        setSearchedEmployee(data);
      }
    }
  };

  // const getAllEmployee = async () => {
  //   const result = await OrganizationApi.getOrganizationTreeAllEmployeeRequest(
  //     auth
  //   );
  //   if (result.error) {
  //     Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
  //   } else {
  //     const company = result.resultData;

  //     const hangleMapper = company.reduce((acc, i) => {
  //       const charCode = i.user_name.charCodeAt(0);
  //       let charIndex;
  //       if (
  //         charCode >= parseInt('0xac00', 16) &&
  //         charCode <= parseInt('0xd7af', 16)
  //       ) {
  //         const hangle =
  //           (charCode - parseInt('0xac00', 16)) / 28 / 21 +
  //           parseInt('0x1100', 16);
  //         charIndex = String.fromCharCode(hangle);
  //       } else {
  //         charIndex = String.fromCharCode(charCode);
  //       }

  //       if (acc.has(charIndex)) {
  //         acc.set(charIndex, [...acc.get(charIndex), i]);
  //       } else {
  //         acc.set(charIndex, [i]);
  //       }
  //       return acc;
  //     }, new Map());
  //     let obj = Array.from(hangleMapper).reduce((obj, [key, value]: any) => {
  //       return Object.assign(obj, { [key]: value });
  //     }, {});

  //     const sectionList = Object.keys(obj).map(key => ({
  //       title: key,
  //       data: obj[key]
  //     }));

  //     sectionList.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));

  //     setEmployee(sectionList);
  //     setSearchedEmployee(sectionList);
  //   }
  // };
  // 조직 멤버 조회
  const getOrganizationEmployeeTree = async (organizationNo: number) => {
    const result = await OrganizationApi.getOrganizationTreeEmployeeRequest(
      auth,
      organizationNo
    );
    if (result.error) {
      Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
    } else {
      const member = result.resultData;

      const employee = JSON.parse(JSON.stringify(organizationEmployee));
      employee[organizationNo] = member;
      setOrganizationEmployee(employee);
      return employee;
    }
  };

  const getContactsList = async () => {
    // 최적화 하려면 여기 코드를 상위로 옮기자
    const result = await OrganizationApi.getContactsList(auth);
    if (result.error || !result?.resultData) {
      Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      props.navigation.pop();
    } else {
      const chocungList: { dataindex: number; word: string }[] =
        result.resultData.chosungList;
      const indexList:any[] = [];
      type secction = { title: string; data: object[] }[];
      let arr: secction = [];
      chocungList.forEach(({ word }) => {
        arr.push({ title: word, data: [] });
        indexList.push(word);
      });

      const contactsList = [...result.resultData.contactsList];

      contactsList.forEach(item => {
        const index = indexList.indexOf(item.word);
        arr[index].data.push(item);
      });
      setContacts(arr);
    }
  };

  const dataLoad = async () => {
    await setIsDataLoading(true);
    await getOrganizationTree();
    await getContactsList();

    await setIsDataLoading(false);
  };

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(1))
      })
    ).start();
    dataLoad();
  }, []);

  // useEffect(() => {
  //   setParticipants(selectedEmployee);
  // }, [selectedEmployee]);

  useEffect(() => {
    doSearch();
  }, [keyword]);

  useEffect(() => {
    setKeyword('');
  }, [tabType]);

  // 조직/조직원 선택
  const selectEmployee = (type: string, item) => {
    // 조직원 선택 시
    if (type === 'member') {
      const newItem = JSON.parse(JSON.stringify(selectedEmployee.member));
      if (newItem[item.user_no]) {
        delete newItem[item.user_no];
      } else {
        newItem[item.user_no] = item;
      }
      setSelectedEmployee({
        member: newItem,
        group: selectedEmployee.group
      });
    } else {
      // 조직 선택 시
      const newItem = JSON.parse(JSON.stringify(selectedEmployee.group));
      if (newItem[item.organization_no]) {
        delete newItem[item.organization_no];
      } else {
        newItem[item.organization_no] = item;
      }
      setSelectedEmployee({
        member: selectedEmployee.member,
        group: newItem
      });
    }
  };

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
          const isEmployeeSelected =
            type === 'member' && selectedEmployee.member[item.user_no];
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
                <>
                  <View
                    style={[
                      styles.lineContainer,
                      { flex: 1, marginLeft: 16 * (depth + 1) }
                    ]}
                  >
                    <View
                      style={[
                        { flexDirection: 'row', alignItems: 'center' },
                        (isParentSelected || isSelected) && styles.selectedItem
                      ]}
                    >
                      <CustomIcon
                        name={
                          type === 'group'
                            ? openGroup[item.organization_no]
                              ? isParentSelected || isSelected
                                ? 'btnFolderCloseSele'
                                : 'btnFolderCloseNone'
                              : isParentSelected || isSelected
                              ? 'btnFolderOpenSele'
                              : 'btnFolderOpenNone'
                            : isParentSelected || isSelected
                            ? 'btnUserSele'
                            : 'btnUserNone'
                        }
                        size={24}
                      />
                      <View style={styles.lineItem}>
                        <Text
                          style={Object.assign(
                            {},
                            styles.textStyle,
                            (isParentSelected || isSelected) && {
                              color: '#fff'
                            }
                          )}
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
                                    : '#1c90fb'
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
                  {!isParentSelected && type === 'member' && (
                    <TouchableHighlight
                      underlayColor={'#e9f5ff00'} // 투명
                      style={{
                        width: 52, // 터치영역은 넓으면 편함
                        height: 52,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                      onPress={() => selectEmployee(type, item)}
                    >
                      <View
                        style={Object.assign(
                          {},
                          styles.checkBox,
                          isSelected && styles.checkBoxSelected
                        )}
                      >
                        {isSelected && (
                          <CustomIcon name={'btnTnaviCheckNone'} size={18} />
                        )}
                      </View>
                    </TouchableHighlight>
                  )}
                </>
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

  const selectedPreView = selectedEmployee => {
    const group = selectedEmployee.group;
    const member = selectedEmployee.member;
    if (Object.keys(group).length > 0)
      console.log('1wrjajs fhsjdgfhjksg hks dghkashgfjk');

    // 선택된 데이터가 없을 시 return null
    if (Object.keys(group).length + Object.keys(member).length === 0)
      return null;

    const createFlatList = (data: any[], type: string) => (
      <FlatList
        data={data}
        horizontal={true}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item, index }) => (
          <View style={styles.profile} key={index}>
            <TouchableOpacity
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
                )}
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -4,
                    width: 14,
                    height: 14,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 7,
                    backgroundColor: '#999'
                  }}
                >
                  <CustomIcon name={'btnCancelInput'} size={8} />
                </View>
              </View>

              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={{ fontSize: 12 }}
              >
                {
                  item[
                    type === 'group'
                      ? 'organization_name'
                      : item['user_name']
                      ? 'user_name'
                      : 'employee_name'
                  ]
                }
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
          {createFlatList(Object.values(member), 'member')}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
          <TouchableOpacity onPress={() => {
            props.setSelectMode(false);
          }}>
            <Text style={styles.ft14N}>{t('뒤로')}</Text>
          </TouchableOpacity>
          <Text style={styles.TitleText}>{t('참석자 추가')}</Text>
          <TouchableOpacity >
            <Text style={styles.ft14N}>{t('추가')}</Text>
          </TouchableOpacity>
        </View>
      <View style={{ backgroundColor: '#F7F8FA', flex: 0.005 }} />
    {/* <View
     style={{
       position: 'absolute',
       width: '100%',
       height: '100%'
     }}
   > */}
      {/* <View
        style={{
          height: 40,
          backgroundColor: '#1C90FB',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontFamily: 'DOUZONEText50'
          }}
        >
          {'참가자 선택'}
        </Text>
        <TouchableOpacity
          style={{ position: 'absolute', right: 10, padding: 10 }}
          onPress={() => {
            props.setSelectMode(false);
          }}
        >
          <CustomIcon name={'checkWhite'} size={23} />
        </TouchableOpacity>
      </View> */}
      

      
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
              {selectedPreView(selectedEmployee)}

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
                    조직도
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
                          <CustomIcon
                            width={8}
                            height={8}
                            name={'btnCancelInput'}
                          />
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
                        <CustomIcon name={'icoCompany'} size={24} />
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
                            {selectedEmployee.member[item.user_no] ? (
                              <CustomIcon name={'checkbox_on'} size={24} />
                            ) : (
                              <CustomIcon name={'checkbox_off'} size={24} />
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
                      renderSectionHeader={({ section }) => (
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
                              {selectedEmployee.member[item.user_no] ? (
                                <CustomIcon name={'checkbox_on'} size={24} />
                              ) : (
                                <CustomIcon name={'checkbox_off'} size={24} />
                              )}
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
                              {selectedEmployee.member[item.user_no] ? (
                                <CustomIcon name={'checkbox_on'} size={24} />
                              ) : (
                                <CustomIcon name={'checkbox_off'} size={24} />
                              )}
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
                        const emailReg = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
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
                    <View style={{borderBottomWidth:1 , borderColor:'#ccc'}}/>
                    <Text style={{ margin :10}}>{'화상회의 참여자'}</Text>
                    <View style={{borderBottomWidth:1 , borderColor:'#ccc'}}/>
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
}

OrganizationScreen.defaultProps = {
  onlyMember: false,
  selectedEmployee: {
    member: {},
    group: {}
  }, // 선택된 조직원
  setAllOrganization: () => {},
  setOrganizationEmployee: () => {},
  setSelectedEmployee: () => {}
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: 'red',
    justifyContent:'flex-start'
  },
  container: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: '600'
  },
  ft14N: {
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
    borderColor: '#999',
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
    height: 30,
    paddingLeft: 15
  },
  cancleIcon: {
    backgroundColor: '#888888',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  },
  searchIcon: {
    paddingTop: 2,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  }
});
