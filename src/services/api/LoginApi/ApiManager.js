export async function ApiManager(url, options, alert = true) {
  const response = await Promise.race([
    fetch(url, options),
    new Promise((_, reject) => {
      setTimeout(() => {
        // Alert.alert('네트워크가 불안정합니다.', '잠시후 다시 시도해주세요.');
        return reject(new Error('timeout'));
      }, 10000);
    })
  ]);
  const responseJson = await response.json();
  return responseJson;
}

export default ApiManager;
