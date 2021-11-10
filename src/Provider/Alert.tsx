import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/configureStore';
import { actionCreators } from '../redux/modules/alert';

export default function AlertScreenPresenter(props: any) {
  const { children } = props;
  const alert = useSelector((state: RootState) => state.alert);

  const { visible, title, message, actions, onClose } = alert;

  const dispatch = useDispatch();
  const resetAlert = () => {
    dispatch(actionCreators.resetAlert());
  };

  return (
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
                  {actions.map((item, index) => {
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
