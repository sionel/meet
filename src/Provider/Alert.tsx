import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Image,
  Button
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/configureStore';
import { actionCreators } from '@redux/alert';
import { BlurView } from '@react-native-community/blur';

import icOut from '@assets/icons/ic_out.png';

export default function AlertScreenPresenter() {
  const alert = useSelector((state: RootState) => state.alert);

  const { visible, title, message, actions, onClose } = alert;

  const dispatch = useDispatch();
  const resetAlert = () => {
    dispatch(actionCreators.resetAlert());
  };

  return title !== 'alert_kick' ? (
    <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right'
        ]}
        onRequestClose={() => {
          resetAlert();
          onClose();
        }}
      >
        {/* <StatusBar
        barStyle={'light-content'}
        backgroundColor={'#000'}
        hidden={false}
      /> */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            resetAlert();
            onClose();
          }}
          style={styles.container}
        >
          <View style={[styles.alertContainer]}>
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <Text style={[styles.title]}>{title}</Text>
              <Text style={styles.message}>{message}</Text>

              {actions.length > 0 && (
                <View style={styles.actions}>
                  {actions.map((item: any, index: number) => {
                    if (!item.name || !item.action) return;
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          resetAlert();
                          item.action();
                        }}
                        style={styles.action}
                      >
                        <Text style={styles.actionName}>{item.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  ) : (
    <BlurView
      blurAmount={50}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <View
        style={{
          backgroundColor: '#fff',
          width: 268,
          height: 302,
          borderRadius: 14,
          alignItems: 'center'
        }}
      >
        <Image
          source={icOut}
          style={{ width: 48, height: 48, marginTop: 40 }}
        />
        <Text
          style={{
            fontFamily: 'DOUZONEText50',
            fontSize: 16,
            color: '#000',
            marginTop: 30,
            marginBottom: 18
          }}
        >{`추방되었습니다.`}</Text>
        <Text
          style={{
            fontFamily: 'DOUZONEText30',
            fontSize: 13,
            color: '#333333'
          }}
        >
          {message}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#1c90fb',
            width: 236,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 24,
            marginVertical: 30
          }}
          onPress={resetAlert}
        >
          <Text
            style={{
              fontFamily: 'DOUZONEText50',
              fontSize: 14,
              color: '#fff'
            }}
          >
            {`확인`}
          </Text>
        </TouchableOpacity>
      </View>
    </BlurView>
  );
}
/**
 *
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000099'
  },
  alertContainer: {
    backgroundColor: '#fff',
    maxWidth: 350,
    minHeight: 30,
    padding: 12,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 3, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 9
      },
      android: {
        elevation: 10
      }
    })
  },
  title: {
    width: '100%',
    fontSize: 17,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    // borderBottomColor: '#00000010',
    // borderBottomWidth: 1,
    fontFamily: 'DOUZONEText30',
    color: '#1c90fb'
  },
  message: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DOUZONEText30'
    // borderBottomColor: '#00000010',
    // borderBottomWidth: 1
  },
  actions: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 6,
    paddingRight: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  action: { marginLeft: 5, height: '100%', paddingLeft: 15, paddingRight: 15 },
  actionName: {
    borderBottomColor: '#00000010',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DOUZONEText30',
    color: '#1c90fb'
  }
});
