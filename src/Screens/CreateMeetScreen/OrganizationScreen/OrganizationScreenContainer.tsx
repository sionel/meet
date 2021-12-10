import React, { useState, useEffect, RefObject, useRef } from 'react';
import { Alert, Animated, Easing } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../../redux/configureStore';
import { actionCreators as RecentsActions } from '../../../redux/modules/recentsInvited';

import { getT } from '../../../utils/translateManager';
import { OrganizationApi } from '../../../services';

import OrganizationScreenPresenter from './OrganizationScreenPresenter';
import { values } from 'lodash';
import { wehagoDummyImageURL, wehagoMainURL } from '../../../utils';
import { PartialUserInfoParam } from '../../ConferenceModifyScreen/ConferenceModifyScreenContainer';

const OrganizationScreenContainer = (props: any) => {
  const {
    employee,
    selectedEmployee,
    setSelectedEmployee,
    // invited,
    // setInvited,
    // inviteText,
    // setInviteText,
    // participantList,
    // setParticipantList,
    setSelectMode,
    organization,
    contacts,
    isOrgDataLoaded,
    isTablet,
    searchRef,
    sendEmailRef
  } = props;

  const [keyword, setKeyword] = useState('');
  const [openGroup, setOpenGroup] = useState({});
  const [searchedEmployee, setSearchedEmployee] = useState(employee);
  const [tabType, setTabType] = useState<'org' | 'contact' | 'exter'>('org');
  const [inviteText, setInviteText] = useState('');
  const [contactType, setContactType] = useState<'one' | 'email' | 'sms'>(
    'email'
  );
  // const [isDataLoading, setIsDataLoading] = useState(false);
  const [organizationEmployee, setOrganizationEmployee] = useState({});
  // const [organization, setorganization] = useState<any>({ company_no: -1 });
  // const [contacts, setContacts] = useState<{ title: string; data: Object }[]>(
  //   []
  // );
  const [exterError, setExterError] = useState(false);

  const [rotate] = useState(new Animated.Value(0));

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const t = getT();

  const { recents, auth, isHorizon } = useSelector((state: RootState) => ({
    recents: state.recents.recents,
    auth: state.user.auth,
    isHorizon: state.orientation.isHorizon
  }));

  const dispatch = useDispatch();
  const setRecents = (recents: Object) =>
    dispatch(RecentsActions.setRecents(recents));

  //#region 검색 이벤트
  const doSearch = async () => {
    if (tabType === 'org') {
      if (keyword === '') {
        // setSearchedEmployee(contacts);?
      } else {
        const data = employee.reduce((acc: any, item: any) => {
          const temp = item.data.filter((data: any) =>
            data.user_name.match(keyword)
          );
          if (temp.length > 0) acc.push({ title: item.title, data: temp });
          return acc;
        }, []);
        setSearchedEmployee(data);
      }
    } else if (tabType === 'contact') {
      if (keyword === '') {
        setSearchedEmployee(contacts);
      } else {
        const data = contacts.reduce((acc: any, item: any) => {
          const temp = item.data.filter((data: any) => {
            return data.address_name.match(keyword);
          });
          if (temp.length > 0) acc.push({ title: item.title, data: temp });
          return acc;
        }, []);
        setSearchedEmployee(data);
      }
    }
  };
  //#endregion

  //#region 조직도 세부트리 조회
  const getOrganizationEmployeeTree = async (organizationNo: number) => {
    const result = await OrganizationApi.getOrganizationTreeEmployeeRequest(
      auth,
      organizationNo
    );

    if (result.error) {
      //   Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      console.log('조직도를 가져올 수 없습니다.');
    } else {
      const member = result;

      const employee = JSON.parse(JSON.stringify(organizationEmployee));
      employee[organizationNo] = member;
      setOrganizationEmployee(employee);
      return employee;
    }
  };
  //#endregion

  //#region 조직 / 조직원 클릭시
  const selectEmployee = (type: string, item: any) => {
    if (selectedEmployee.member.length > 49) {
      Alert.alert(
        t('초대가능 인원을 초과하였습니다.'),
        t('참석자는 최대 50명을 넘을수 없습니다.')
      );

      return false;
    }
    // 조직원 선택 시
    if (type === 'member') {
      const selectedList: any[] = selectedEmployee.member;
      let tmpList: any[] = [];
      let idx = selectedList.findIndex((i: any) => {
        if (item.user_no) return i.user_no === item.user_no;
        else if (item.address_service_no)
          return i.address_service_no === item.address_service_no;
        else return i.value === item.value;
      });

      if (idx !== -1) {
        tmpList = selectedList
          .filter((v, i) => i !== idx)
          .map(user => {
            const data: PartialUserInfoParam = {
              portal_id: user.portal_id,
              rank_name: user.rank_name,
              user_no: user.user_no,
              user_name: user.user_name ? user.user_name : user.user,
              profile_url: user.profile_url
                ? user.profile_url
                : wehagoDummyImageURL,
              full_path: user.user_no
                ? user.full_path
                : user.user_name !== null
                ? user.user
                : '',
              user_type: user.user_type === 2 ? 'ext' : 'org',
              is_master: user.is_master
            };
            return data;
          });
      } else {
        item.is_master = false;
        selectedList.push({
          portal_id: item.portal_id,
          rank_name: item.rank_name,
          user_no: item.user_no,
          user_name: item.user_name ? item.user_name : item.user,
          profile_url: item.profile_url
            ? wehagoMainURL + item.profile_url
            : wehagoDummyImageURL,
          full_path: item.user_no
            ? item.full_path
            : item.user_name !== null
            ? item.user
            : '',
          user_type: item.user_type === 2 ? 'ext' : 'org',
          is_master: false
        });
      }

      setSelectedEmployee({
        member: idx === -1 ? selectedList : tmpList,
        group: selectedEmployee.group
      });

      // const invitedList: { type: string; value: string }[] = invited;
      // let tmpList2: { type: string; value: string }[] = [];
      // let idx2 = invitedList.findIndex((i: any) => i.value === item.value);
      // if (item.type) {
      //   if (idx2 !== -1) {
      //     tmpList2 = invitedList.filter((v, i) => i !== idx2);
      //     setInvited([...tmpList2]);
      //   } else {
      //     invitedList.push(item);
      //     setInvited([...invitedList]);
      //   }
      // }
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
  //#endregion

  const participantListAdd = () => {
    const selectedList = selectedEmployee.member;
    const resList: any[] = [];

    const partListUserNoOrderList: any[] = selectedList.sort(
      (a: any, b: any) => {
        return a.user_no === auth.user_no ? -1 : 1;
      }
    );

    partListUserNoOrderList.map(value => resList.push(value));

    setSelectedEmployee({ member: resList, group: {} });
    setSelectMode(false);
  };

  const onClickCancel = () => {
    setSelectMode(false);
  };

  const validateExter = () => {
    let value = inviteText;
    let type = 'error';
    let flag = false;
    const numReg1 = /^\d{2,3}-\d{3,4}-\d{4}/;
    const numReg2 = /^01\d{9,11}/;
    const emailReg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
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
      // const invitedList: { type: string; value: string }[] = invited;
      // let idx: number = invitedList.findIndex(
      //   (i: any) => i.value === inviteText
      // );
      const selectedList: any[] = selectedEmployee.member;
      let idx: number = selectedList.findIndex(
        (i: any) => i.value === inviteText
      );

      if (idx !== -1) {
        // setInvited([...invited]);
        setExterError(true);
      } else {
        // setInvited([
        //   ...invited,
        //   {
        //     type,
        //     value
        //   }
        // ]);
        selectedList.push({ type, value });
        setExterError(false);
      }
      setRecents({ type, value });
      setSelectedEmployee({ member: selectedList, group: {} });
      setInviteText('');
    } else {
      Alert.alert(
        t('양식 오류'),
        t('올바른 이메일 양식으로 입력해주세요.(aaaa@bbbb.com)')
      );
      setInviteText('');
    }
  };

  // const recentAdd = (item: { type: string; value: string }) => {
  //   const newList: { type: string; value: string }[] = invited;
  //   const newList2: any[] = selectedEmployee.member;

  //   let idx: number = newList.findIndex((i: any) => i.value === item.value);
  //   let idx2: number = newList2.findIndex((i: any) => i.value == item.value);
  //   if (idx !== -1) {
  //     const deletedList: any[] = newList.filter(
  //       (v: any, i: number) => i !== idx
  //     );
  //     const deletedList2: any[] = newList2.filter(
  //       (v: any, i: number) => i !== idx2
  //     );
  //     setInvited([...deletedList]);
  //     setSelectedEmployee({ member: deletedList2, group: {} });
  //   } else {
  //     newList.push(item);
  //     newList2.push(item);
  //     setInvited([...newList]);
  //     setSelectedEmployee({ member: newList2, group: {} });
  //   }
  // };

  //#region 직원목록 초기화
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.out(Easing.poly(1))
      })
    ).start();
    // dataLoad();
  }, []);
  //#endregion

  //#region 검색어 변경 UseEffect
  useEffect(() => {
    doSearch();
  }, [keyword]);
  //#endregion

  //#region 탭변경 UseEffect
  useEffect(() => {
    setKeyword('');
  }, [tabType]);
  //#endregion

  const focusOut = () => {
    if (searchRef.current?.isFocused()) searchRef.current.blur();
    else if (sendEmailRef.current?.isFocused()) sendEmailRef.current.blur();
  };
  return (
    <OrganizationScreenPresenter
      // setSelectMode={setSelectMode}
      contacts={contacts}
      tabType={tabType}
      setTabType={setTabType}
      keyword={keyword}
      setKeyword={setKeyword}
      doSearch={doSearch}
      inviteText={inviteText}
      setInviteText={setInviteText}
      searchedEmployee={searchedEmployee}
      openGroup={openGroup}
      setOpenGroup={setOpenGroup}
      organization={organization}
      selectEmployee={selectEmployee}
      selectedEmployee={selectedEmployee}
      getOrganizationEmployeeTree={getOrganizationEmployeeTree}
      organizationEmployee={organizationEmployee}
      recents={recents}
      isOrgDataLoaded={isOrgDataLoaded}
      spin={spin}
      t={t}
      participantListAdd={participantListAdd}
      auth={auth}
      // contactType={contactType}
      // setContactType={setContactType}
      validateExter={validateExter}
      exterError={exterError}
      searchRef={searchRef}
      focusOut={focusOut}
      isTablet={isTablet}
      isHorizon={isHorizon}
      sendEmailRef={sendEmailRef}
    />
  );
};

OrganizationScreenContainer.defaultProps = {
  onlyMember: false,
  selectedEmployee: {
    member: {},
    group: {}
  }, // 선택된 조직원
  setAllOrganization: () => {},
  setOrganizationEmployee: () => {},
  setSelectedEmployee: () => {}
};

export default OrganizationScreenContainer;
