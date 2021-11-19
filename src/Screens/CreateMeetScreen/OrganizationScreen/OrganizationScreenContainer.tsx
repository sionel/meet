import React, { useState, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/configureStore';
import { getT } from '../../../utils/translateManager';
import { OrganizationApi } from '../../../services';
import OrganizationScreenPresenter from './OrganizationScreenPresenter';
import { values } from 'lodash';

const OrganizationScreenContainer = (props: any) => {
  const {
    employee,
    selectedEmployee,
    setSelectedEmployee,
    invited,
    recents,
    setInvited,
    inviteText,
    setInviteText,
    // participantList,
    setParticipantList,
    setSelectMode,
    listLng,
    setListLng
  } = props;

  const [keyword, setKeyword] = useState('');
  const [openGroup, setOpenGroup] = useState({});
  const [searchedEmployee, setSearchedEmployee] = useState(employee);
  const [tabType, setTabType] = useState<'org' | 'contact' | 'exter'>('org');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [organizationEmployee, setOrganizationEmployee] = useState({});
  const [organization, setorganization] = useState<any>({ company_no: -1 });
  const [contacts, setContacts] = useState<{ title: string; data: Object }[]>(
    []
  );

  const [rotate] = useState(new Animated.Value(0));

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const t = getT();

  const auth = useSelector((state: RootState) => state.user.auth);

  //#region 조직도 초기화
  const getOrganizationTree = async () => {
    const result = await OrganizationApi.getOrganizationTreeRequest(auth);
    if (result.error) {
      //   Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      // 조직도 조회 안됨 에러 표현
      // 생성화면으로 Back
    } else {
      const organization = result[0];
      setorganization(organization);
    }
  };
  //#endregion

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

  //#region 연락처 조회
  const getContactsList = async () => {
    // 최적화 하려면 여기 코드를 상위로 옮기자
    const result = await OrganizationApi.getContactsList(auth);
    if (result.error || !result) {
      //   Alert.alert('조직도', '조직도를 가져올 수 없습니다.');
      console.log('연락처를 가져올 수 없습니다.');

      //   props.navigation.pop();
      // 생성하기 화면으로
    } else {
      const chocungList: { dataindex: number; word: string }[] =
        result.chosungList;
      const indexList: any[] = [];
      type secction = { title: string; data: object[] }[];
      let arr: secction = [];
      chocungList.forEach(({ word }) => {
        arr.push({ title: word, data: [] });
        indexList.push(word);
      });

      const contactsList = [...result.contactsList];

      contactsList.forEach(item => {
        const index = indexList.indexOf(item.word);
        arr[index].data.push(item);
      });
      setContacts(arr);
    }
  };
  //#endregion

  //#region 조직 / 조직원 클릭시
  const selectEmployee = (type: string, item: any) => {
    // 조직원 선택 시
    if (type === 'member') {
        const newList: any[] = selectedEmployee.member;
        let tmpList: any[] = [];
        let idx = newList.findIndex((i: any) => {
          if (item.user_no) return i.user_no === item.user_no;
          else return i.address_service_no === item.address_service_no;
        });

        if (idx !== -1) {
          tmpList = newList.filter((v, i) => i !== idx);
        } else {
          item.is_master = false;
          newList.push(item);
        }
        setSelectedEmployee({
          member: idx === -1 ? newList : tmpList,
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
  //#endregion

  const dataLoad = async () => {
    await setIsDataLoading(true);

    await getOrganizationTree();
    await getContactsList();

    await setIsDataLoading(false);
  };

  const participantListAdd = () => {
    setListLng(Object.keys(selectedEmployee.member).length);
    const newList = selectedEmployee.member;
    const roomMaster = newList[0];
    // 방 생서 제외한 유저리스트 선언
    const userList = newList.filter((v: any, i: number) => i !== 0);
    // 참석자 넘겨줄 리스트 선언
    const resList: any[] = [];
    // 방생성자 정보 먼저 넘김
    resList.push(roomMaster);

    // 사번별 정렬된 리스트 선언
    const userNoOrderList: any[] = userList.sort((a: any, b: any) => {
      return a.user_no - b.user_no;
    });
    userNoOrderList.map(value => resList.push(value));

    setSelectedEmployee({ member: resList, group: {} });
    setSelectMode(false);
  };

  const onClickCancel = () => {
    setSelectMode(false);
  };

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
    dataLoad();
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

  return (
    <OrganizationScreenPresenter
      setSelectMode={setSelectMode}
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
      setorganization={setorganization}
      selectEmployee={selectEmployee}
      selectedEmployee={selectedEmployee}
      getOrganizationEmployeeTree={getOrganizationEmployeeTree}
      organizationEmployee={organizationEmployee}
      invited={invited}
      setInvited={setInvited}
      recents={recents}
      isDataLoading={isDataLoading}
      spin={spin}
      t={t}
      participantListAdd={participantListAdd}
      onClickCancel={onClickCancel}
      auth={auth}
      listLng={listLng}
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
