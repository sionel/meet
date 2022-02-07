import React, { RefObject, useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../redux/configureStore';
import { MainNavigationProps } from '@navigations/MainStack';

import { getT } from '@utils/translateManager';
import deviceInfoModule from 'react-native-device-info';

import { MeetApi } from '@services/index';

import InvitedCodeScreenPresenter from './InvitedCodeScreenPresenter';
import { isSuccess } from '@services/types';

const InvitedCodeScreenContainer = ({
  navigation,
  route
}: MainNavigationProps<'InviteCode'>) => {
  const [code, setCode] = useState('');
  const [shadowCode, setShadowCode] = useState('');
  const [joincodeErr, setJoincodeErr] = useState(false);
  const [inputcodeErr, setInputcodeErr] = useState(false);
  const [logging, setLogging] = useState(false);
  const [focusingNum, setFocusingNum] = useState(-1);

  const codeLineRef: RefObject<any> = useRef();

  const { isHorizon } = useSelector((state: RootState) => ({
    isHorizon: state.orientation.isHorizon
  }));

  const t = getT();
  const isTablet: boolean = deviceInfoModule.isTablet();

  const changeInputcode = async (value: string) => {
    const regex = /^[0-9|a-f|A-F|]*$/;
    setInputcodeErr(false);
    logging && setCode('');
    setLogging(false);
    setShadowCode('');
    let joincode = '';
    if (value.match(regex)) {
      joincode = value.trim();
      setCode(joincode);
      setJoincodeErr(false);
      setFocusingNum(joincode.length);

      if (joincode.length === 6) {
        setJoincodeErr(false);
        _goJoincode(joincode);
        setShadowCode(joincode);
        setCode('');
      }
    } else {
      setJoincodeErr(true);
    }
  };

  const _goJoincode = async (joincode: string) => {
    // V 고려해야할부분
    setLogging(true);
    const searchJoincode = await MeetApi.searchJoincode(joincode);
    let result: any;

    if (isSuccess(searchJoincode)) {
      result = searchJoincode.resultData;
      if (result.code === 'E00001') {
        setFocusingNum(0);
        setInputcodeErr(true);
        return;
      }
      const codeResult = await MeetApi.getMeetRoomNoCert(result.room);
      if (isSuccess(codeResult)) {
        const { name } = codeResult.resultData;
        navigation.navigate('ConferenceStateView', {
          id: result.room,
          accessType: 'joincode',
          joincode: joincode,
          selectedRoomName: name
        });
      } else {
        //error
      }
    } else {
      setFocusingNum(0);
      setInputcodeErr(true);
    }
  };

  const onFocusInput = () => {
    setInputcodeErr(false);
    setFocusingNum(code.length);
  };

  const onFocusingCode = () => {
    codeLineRef.current.focus();
  };

  const onFocusOutInput = () => {
    setFocusingNum(-1);
  };

  const handleClickBack = () => {
    navigation.goBack();
  };

  return (
    <InvitedCodeScreenPresenter
      {...{
        code,
        focusingNum,
        onFocusingCode,
        changeInputcode,
        onFocusInput,
        onFocusOutInput,
        codeLineRef,
        joincodeErr,
        inputcodeErr,
        isHorizon,
        isTablet,
        t,
        logging,
        shadowCode,
        handleClickBack
      }}
    />
  );
};

export default InvitedCodeScreenContainer;
