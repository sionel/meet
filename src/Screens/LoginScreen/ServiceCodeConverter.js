import { Platform } from 'react-native';

const getLoginType = (serviceCode, wehagoType) => {
  let _serviceCode = serviceCode;

  if (wehagoType === 'WEHAGOV') {
    _serviceCode = Platform.OS === 'ios' ? 'wehagovmeet' : 'meetv';
  } else {
    _serviceCode = Platform.OS === 'ios' ? 'wehagomeet' : 'meet';
  }
  return _serviceCode;
};

export { getLoginType };
