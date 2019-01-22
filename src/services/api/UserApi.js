/**
 * User API
 * 사용자 관련 API
 */

const wehagoBaseURL = `http://dev.api.wehago.com`;
const tempBaseUrl = `https://jsonplaceholder.typicode.com`

// #region
export default {
    /**
     * TEST 
     * 테스트 api
     */
    login: () => fetch(`${tempBaseUrl}/posts`)
        .then(response => response.json())
        .then(responseJson => responseJson)
        .catch(err => {
            // alert('Login Error!')
            console.log('login err: ', err)
        }),

    /**
     * TEST 
     * 테스트 api
     */
    test: async data => {
        console.log("RJ : ", data);
        try{
            const timestamp = new Date();
            // const url = `${wehagoBaseURL}/auth/login/mobile?timestamp=${timestamp.getMilliseconds()}`;
            const url = `https://dev.api.wehago.com/auth/login/mobile`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Postman-Token': '9b80fd7d-bd83-4840-ae96-7de32e4d0956',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data
                })
            });
            const responseJson = await response.json();
            console.log("RJ : ", response);
            return responseJson;
        }catch(err){
            // alert('Test Error!')
            console.log('Test err: ', err)
        }
    }
}
// #endregion

