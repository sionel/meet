/**
 * LoginScreenPresenter
 * 
 * 로그인페이지 프레젠터
 */

import React from "react";
import { 
  View,
  Text, 
  TextInput,
  StyleSheet, 
  Svg,
  Path,
  Button,
  TouchableOpacity
} from "react-native";
// import Svg from 'react-native-svg';


const rootPath = `../../../assets`;
const logo = require(`${rootPath}/wehago_b.svg`);

/**
 * LoginScreenPresenter
 */
const LoginScreenPresenter = (props) => (
  <View style={styles.container}>
    {/* TITLE */}
    <View 
      style={{
        flex: 0.1,
        justifyContent: 'flex-start',
        marginBottm: 50
      }}
    >
      <Text style={{ fontSize: 33, color:"#333" }}>WEHAGO</Text>
    </View>

    {/* INPUTS */}
    <View 
      style={{
        flex: 0.2
      }}
    >
      <TextInput
        placeholder="아이디를 입력하세요"
        placeholderTextColor="#CACACA"
        style={{width: 270, height: 40, marginTop: 15, color:'#8C8C8C', borderBottomWidth: 1, borderBottomColor: '#CACACA'}}
      />
      <TextInput
        placeholder="패스워드를 입력하세요"
        placeholderTextColor="#CACACA"
        style={{width: 270, height: 40, marginTop: 15, color:'#8C8C8C', borderBottomWidth: 1, borderBottomColor: '#CACACA'}}
      />
    </View>

    {/* BUTTONS */}
    <View style={{
      flex: 0.7,
      justifyContent: 'flex-start'
      // marginTop: 20,
    }}>
      <View 
        style={{
          width: 270,
          height: 47,
          backgroundColor: '#1C90FB',
          color: '#fff',
          borderRadius: 20,
          textAlign:'center',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{
          color: '#fff',
        }}>로그인</Text>
      </View>

      {/* SUB BUTTONS */}
      <View style={{
        paddingTop: 20,
        flexDirection: 'row',
      }}>
        <View style={{flex: 0.4}}>
          <Text>자동로그인</Text>
        </View>
        <View style={{flex: 0.6}}>
          <Text>아이디찾기 | 패스워드찾기</Text>
        </View>
      </View>
    </View>

    

    <View>
      <Button 
        title="나가기"
        onPress={() => props.onRedirect('Home')}
      />
    </View>
  </View>
);

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // justifyContent: "center",
    alignItems: "center",
    width: '100%',
    paddingTop:100
  },

  listContainer: {
    width:"100%",
    padding:"3%"
  }
});

export default LoginScreenPresenter;
