/**
 * LoginScreenPresenter
 *
 * 로그인페이지 프레젠터
 */

import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  StatusBar,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import {
  FlatButton,
  TextField,
  ListItemComp,
  CustomWebView
} from '../../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import Orientation from 'react-native-orientation-locker';
import DeviceInfo from 'react-native-device-info';

const rootPath = `../../../assets`;
const logo_login = require(`${rootPath}/logo_login.png`);
const wehago_favicon = require(`${rootPath}/wehago_favicon.png`);

// const { width, height } = Dimensions.get('window');
// const hasNotch = (
//   Platform.OS === 'ios' &&
//   !Platform.isPad &&
//   !Platform.isTVOS &&
//   (height === 812 || width === 812 || height === 896 || width === 896)
// );

/**
 * LoginScreenPresenter
 */
const LoginScreenPresenter = props => {
  const { userId, userPwd, autoLoginFlag, webView } = props;
  DeviceInfo.isTablet()
    ? Orientation.unlockAllOrientations()
    : Orientation.lockToPortrait();

  if (webView) {
    return (
      <CustomWebView
        view={webView}
        contentTitle="약관 및 정책"
        buttonTitle="확인"
        url="https://www.wehago.com/#/common/policy"
        onClickButton={() => props.onChangeValue('webView', false)}
      />
    );
  }

  const rotate = new Animated.Value(0);
  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });
  const spinning = Animated.loop(
    Animated.timing(rotate, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.out(Easing.poly(1))
    })
  );

  if (props.logging) {
    spinning.start();
  } else {
    spinning.stop();
  }

  /**
   * RETURN
   */

  const mainView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: props.height - (StatusBar.currentHeight || 0)
      }}
    >
      {/* TITLE */}
      <View style={styles.topArea}>
        {/* <Text style={styles.logo}>WEHAGO</Text> */}
        <Image
          style={{
            width: 200,
            height: 64
          }}
          source={logo_login}
          resizeMode="contain"
        />
      </View>

      {/* INPUTS */}
      <View style={styles.middleArea}>
        <TextField
          placeholder={'아이디'}
          width={285}
          height={40}
          onChange={text => props.onChangeValue('userId', text)}
          value={userId}
          onSubmit={'inputPwd'}
          refs={'inputId'}
        />
        <TextField
          placeholder={'패스워드'}
          width={285}
          height={40}
          secret={true}
          onChange={text => props.onChangeValue('userPwd', text)}
          onSubmit={props.onEnterKeyDown}
          value={userPwd}
          refs={'inputPwd'}
        />
      </View>

      {/* Login BUTTONS */}
      <View style={styles.bottomArea}>
        <FlatButton
          title={'로그인'}
          color={props.userId && props.userPwd.length > 7 ? '#fff' : '#818181'}
          backgroundColor={
            props.userId && props.userPwd.length > 7 ? '#1C90FB' : '#E1E1E1'
          }
          borderColor={
            props.userId && props.userPwd.length > 7 ? '#1C90FB' : '#E1E1E1'
          }
          borderWidth={1}
          width={295}
          height={52}
          borderRadius={30}
          onClick={
            props.userPwd.length > 7
              ? props.onLogin
              : () => props.onActivateModal('아이디와 패스워드를 확인해 주세요')
          }
        >
          {props.logging && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Animated.View
                style={{
                  transform: [{ rotate: spin }],
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon name="spinner" size={20} color="#fff" />
              </Animated.View>
            </View>
          )}
        </FlatButton>
      </View>

      {/* Login with WEHAGO BUTTONS */}
      <View style={styles.bottomArea2}>
        <FlatButton
          title={'WEHAGO 앱으로 로그인'}
          width={295}
          height={52}
          borderRadius={5}
          color={'#fff'}
          backgroundColor={'#1C90FB'}
          borderColor={'#1C90FB'}
          borderWidth={1}
          customStyle={{ flexDirection: 'row' }}
          onClick={props.onLoginForWehago}
        >
          <Image
            style={{
              width: 24,
              height: 24,
              marginRight: 5
            }}
            source={wehago_favicon}
          />
          <Text style={{ color: '#fff', fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}>WEHAGO 앱으로 로그인</Text>
        </FlatButton>
        <Text
          style={{
            paddingTop: 12,
            paddingBottom: 15,
            textAlign: 'center',
            color: 'rgb(51,51,51)',
            fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal'
          }}
        >
          WEHAGO 앱이 설치되어 있다면 바로 시작하세요.
        </Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={'transparent'}
        hidden={false}
      />

      {Platform.OS === 'ios' ? (
        mainView
      ) : (
        <ScrollView style={{ width: '100%', height: props.height }}>
          {mainView}
        </ScrollView>
      )}

      {/* 모달 */}
      <Modal
        animationType="slide"
        visible={props.modal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => props.onActivateModal('', false)}
      >
        <View
          style={[
            styles.modalWrap,
            {
              paddingTop:
                0 + (props.hasNotch ? 24 : 0) + (Platform.OS === 'ios' ? 12 : 0)
            }
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.modalContents}>
              <Text style={[styles.modalMessage, {fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal'}]}>{props.modalText}</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => props.onActivateModal('', false)}
            >
              <Icon name="times" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 권한 컨펌모달 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={!props.permissionModal}
        blurRadius={1}
        onRequestClose={props.onAgreement}
      >
        {/* <Modal animationType="fade" transparent={true} visible={!props.permissionModal} blurRadius={1}> */}
        <View style={styles.permission_modalWrap}>
          <View style={styles.permission_modalContentWrap}>
            <View style={styles.permission_modalMessage}>
              <Text
                style={{
                  fontSize: 16,
                  // color: '#1C90FB',
                  color: 'rgb(51,51,51)',
                  marginBottom: 10,
                  fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal'
                }}
              >
                {'WEHAGO Meet\n앱 이용을 위한 권한 안내'}
              </Text>
              <View
                style={{
                  borderTopWidth: 1,
                  // borderBottomWidth: 1,
                  borderColor: 'rgb(200,200,200)',
                  paddingTop: 18,
                  paddingBottom: 15
                }}
              >
                <Text
                  style={{ fontSize: 15, color: '#1C90FB', fontFamily: Platform.OS === 'ios' ? 'NanumSquareEB' : 'normal' }}
                >
                  필수적 접근권한
                </Text>
                <View
                  style={{
                    backgroundColor: '#f1f1f1',
                    marginTop: 8,
                    marginBottom: 12,
                    paddingTop: 5
                  }}
                >
                  <FlatList
                    data={[
                      {
                        key: '0',
                        title: '카메라',
                        description: '사진 및 동영상 촬영, QR코드 스캔',
                        icon: 'camera'
                      },
                      {
                        key: '1',
                        title: '마이크',
                        description: '화상대화 내 음성 전송',
                        icon: 'microphone'
                      },
                      {
                        key: '2',
                        title: '기기 및 앱기록',
                        description: '앱서비스 최적화 및 기기오류',
                        icon: 'cogs'
                      }
                    ]}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row'
                        }}
                      >
                        <View
                          style={{
                            flex: 2,
                            marginBottom: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <View
                            style={{
                              padding: 10,
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              backgroundColor: 'rgb(28,144,251)',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Icon name={item.icon} size={17} color="#fff" />
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 8,
                            height: 40,
                            paddingLeft: 8,
                            justifyContent: 'center'
                          }}
                        >
                          <Text style={{ fontSize: 15, marginBottom: 3.5, fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}>
                            {item.title}
                          </Text>
                          <Text
                            style={{ fontSize: 12, color: 'rgb(114,125,134)', fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>
                <Text
                  style={{ fontSize: 15, color: '#1C90FB', fontFamily: Platform.OS === 'ios' ? 'NanumSquareEB' : 'normal' }}
                >
                  선택적 접근권한
                </Text>
                <View
                  style={{
                    backgroundColor: '#f1f1f1',
                    marginTop: 8,
                    marginBottom: 12,
                    paddingTop: 5
                  }}
                >
                  <FlatList
                    data={[
                      {
                        key: '1',
                        title: '알림',
                        description: '푸시 알림 등록 및 수신',
                        icon: 'bell'
                      }
                    ]}
                    renderItem={({ item }) => (
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row'
                        }}
                      >
                        <View
                          style={{
                            flex: 2,
                            marginBottom: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <View
                            style={{
                              padding: 10,
                              width: 40,
                              height: 40,
                              borderRadius: 50,
                              backgroundColor: 'rgb(28,144,251)',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}
                          >
                            <Icon name={item.icon} size={17} color="#fff" />
                          </View>
                        </View>
                        <View
                          style={{
                            flex: 8,
                            height: 40,
                            paddingLeft: 8,
                            justifyContent: 'center'
                          }}
                        >
                          <Text style={{ fontSize: 15, marginBottom: 3.5, fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}>
                            {item.title}
                          </Text>
                          <Text
                            style={{ fontSize: 12, color: 'rgb(114,125,134)', fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal' }}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                    )}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 13,
                    textAlign: 'center',
                    color: 'rgb(114,125,134)',
                    fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal'
                  }}
                >
                  선택적 접근권한은 해당 기능 사용 시 동의가 필요하며 미동의
                  시에도 서비스 이용가능합니다.
                </Text>
                {/* <Text style={{ fontSize: 16, fontWeight: '500' }}>이용약관 및 법률고지</Text>
								<View
									style={{
										// backgroundColor: '#f1f1f1',
										marginTop: 8,
										marginBottom: 12
										// padding: 10
									}}
								>
									<FlatButton
										height={40}
										borderRadius={0}
										color={'#333'}
										borderWidth={1}
										borderColor={'#c8c8c8'}
										backgroundColor={'none'}
										onClick={() => props.onChangeValue('webView', true)}
										title="이용약관 보기"
									/>
									<FlatButton
										height={40}
										borderRadius={0}
										color={'#333'}
										borderWidth={1}
										borderColor={'#c8c8c8'}
										backgroundColor={'none'}
										customStyle={{ borderTopWidth: 0 }}
										onClick={() => props.onChangeValue('webView', true)}
										title="법률고지 보기"
									/>
								</View> */}
              </View>
            </View>
            <View style={styles.permission_modalButtons}>
              <TouchableOpacity
                style={{
                  ...styles.permission_modalButton,
                  ...styles.permission_modalButtonConfirm
                }}
                // onPress={() => props.onChangeValue('permissionModal', false)}
                onPress={props.onAgreement}
              >
                <Text style={{ color: '#fff' }}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 웹뷰모달 */}

      {/* <CustomWebView
				view={webView}
				contentTitle="약관 및 정책"
				buttonTitle="확인"
				url="https://www.wehago.com/#/common/policy"
			/> */}
    </View>
  );
};

/**
 * styles
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    // alignItems: 'center',
    width: '100%'
  },

  topArea: {
    flex: 0.75,
    paddingTop: 100,
    justifyContent: 'flex-start'
  },
  logo: { fontSize: 33, color: '#333' },

  middleArea: {
    flex: 3,
    justifyContent: 'center'
  },

  bottomArea: {
    flex: 4,
    justifyContent: 'flex-start'
  },
  bottomArea2: {
    flex: 2,
    justifyContent: 'center'
  },

  listContainer: {
    width: '100%',
    padding: '3%'
  },

  modalWrap: {
    // paddingTop: props.hasNotch ? 32 : 0,
    backgroundColor: '#F15F5F',
    justifyContent: 'space-between'
  },
  modalContents: {
    // flex: 5,
    flex: 1,
    justifyContent: 'center',
    paddingTop: 17,
    paddingBottom: 17,
    paddingLeft: 17
  },
  modalMessage: { color: '#fff', fontSize: 15 },
  modalCloseButton: {
    // flex: 1,
    width: 40,
    justifyContent: 'center',
    // alignItems: 'flex-end',
    paddingRight: 17
    // backgroundColor: '#FF8383'
  },

  permission_modalWrap: {
    // marginTop: 22,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, .75)'
  },

  permission_modalContentWrap: {
    backgroundColor: '#fff',
    width: '100%',
    maxWidth: 300,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  permission_modalMessage: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
    // borderWidth: 1,
    // borderColor: '#1C90FB'
  },

  permission_modalButtons: { flexDirection: 'row' },
  permission_modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: -1
  },
  permission_modalButtonCancel: { backgroundColor: '#f1f1f1' },
  permission_modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default LoginScreenPresenter;
