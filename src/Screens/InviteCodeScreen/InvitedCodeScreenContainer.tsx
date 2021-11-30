import React, { RefObject, useEffect, useRef, useState } from 'react';
import InvitedCodeScreenPresenter from './InvitedCodeScreenPresenter';
import { MeetApi } from '../../services';
import { Linking, Platform } from 'react-native';
import { actionCreators as RootActions } from '../../redux/modules/root';
import { getT } from '../../utils/translateManager';
import { useDispatch, useSelector } from 'react-redux';
import deviceInfoModule from 'react-native-device-info';
import { RootState } from '../../redux/configureStore';

const InvitedCodeScreenContainer = ({ navigation }: any) => {
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

  const dispatch = useDispatch();
  const _setParams = (params: {}) => dispatch(RootActions.setParams(params));
  

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
    const result = await MeetApi.searchJoincode(joincode);
    
    if (!result) {
      setInputcodeErr(true);
      setFocusingNum(0);
    } else if (result.resultData.code === 'E00001') {
      setFocusingNum(0);
      setInputcodeErr(true);
    } else {
      _setParams({
        accesstype: 'joincode',
        roomId: result.resultData.room,
        joincode
      });
      navigation.navigate('ConferenceState', {
        id: result.resultData.room,
      });
    }

  };

  const onFocusInput = () => {
    setInputcodeErr(false);
    setFocusingNum(code.length);
  };

  const onFocusingCode = () => {
    codeLineRef.current.focus();
  };

  const goLoginInput = () => {
    navigation.navigate('LoginInput');
  };

  const onFocusOutInput = () => {
    // if (codeLineRef.current.isFocused()) codeLineRef.current.blur();
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
        goLoginInput,
        shadowCode,
        handleClickBack
      }}
    />
  );
};

export default InvitedCodeScreenContainer;
