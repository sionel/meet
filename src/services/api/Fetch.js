import { Alert } from 'react-native';

export default function(url: string, options?: any): any {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => {
        Alert.alert('네트워크가 불안정합니다.', '잠시후 다시 시도해주세요.');
        return reject(new Error('timeout'));
      }, 10000)
    )
  ]);
}
