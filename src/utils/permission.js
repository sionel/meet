
import { Alert, BackHandler, NativeModules, Platform } from 'react-native';
import Permissions from 'react-native-permissions';
const { AndroidSettings } = NativeModules;

/**
 * checkPermissions
 */
export const checkPermissions = async () => {
  // 권한 목록 설정
  const permissions =
    Platform.OS === 'ios'
      ? [
          { key: 'microphone', name: '마이크' },
          { key: 'camera', name: '카메라' }
        ]
      : [
          { key: 'microphone', name: '마이크' },
          { key: 'camera', name: '카메라' }
        ];
  // 현재 권한 체크
  const response = await Permissions.checkMultiple(permissions.map(p => p.key));
  // 권한 설정 요청
  setPermissions(response, permissions);
};

/**
 * setPermissions
 */
const setPermissions = async (response, permissions, length = 0) => {
  // 재귀
  let len = length;
  if (length >= permissions.length) return;

  if (response[permissions[len].key] === 'authorized') {
    // 권한 승인 상태이면 다음 권한 설정
    return setPermissions(response, permissions, ++len);
  } else {
    // 권한이 없으므로 권한 요청
    const result = await Permissions.request(permissions[len].key, {
      type: 'whenInUse'
    });
    // 권한 미승인 시 앱 종료 또는 환경설정으로 이동
    if (result !== 'authorized') {
      Alert.alert(
        permissions[len].name + ' 권한 요청',
        '화상회의 기능을 사용하시려면 해당 권한을 부여하세요.',
        [
          {
            text: 'OK',
            // 권한 다시 알리지 않음 설정 시 환경설정으로 이동
            onPress: () => {
              Platform.OS === 'ios'
                ? checkPermissions()
                : BackHandler.exitApp();
              Platform.OS === 'ios'
                ? Permissions.openSettings()
                : AndroidSettings.open();
            }
          }
        ]
      );

      return;
    }
    // 권한 승인 시 다음 권한 설정
    return setPermissions(response, permissions, ++len);
  }
};
