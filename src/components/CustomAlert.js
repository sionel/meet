/**
 *
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar
} from 'react-native';

const CustomAlert = props => {
  const {
    visible,
    width,
    height,
    title,
    titleStyle,
    description,
    actions,
    onClose
  } = props;

  return (
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
      onRequestClose={onClose}
    >
      {/* <StatusBar
        barStyle={'light-content'}
        backgroundColor={'#000'}
        hidden={false}
      /> */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.container}
      >
        <View style={[styles.alertContainer, { width }]}>
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <Text style={styles.description}>{description}</Text>

            {actions.length > 0 && (
              <View style={styles.actions}>
                {actions.map((item, index) => {
                  if (!item.name || !item.action) return;
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={item.action}
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
  );
};

CustomAlert.defaultProps = {
  visible: true,
  width: '80%',
  height: 100,
  title: null,
  titleStyle: {},
  description: null,
  actions: [],
  onClose: () => {}
};

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
    maxWidth: '80%',
    minHeight: 30,
    padding: 12
  },
  title: {
    width: '100%',
    fontSize: 20,
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: '#00000010',
    borderBottomWidth: 1,
    fontFamily: 'DOUZONEText30',
    color: '#1c90fb'
  },
  description: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'DOUZONEText30',
    borderBottomColor: '#00000010',
    borderBottomWidth: 1
  },
  actions: {
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  action: { marginLeft: 5, height: '100%', paddingLeft: 5, paddingRight: 5 },
  actionName: {
    borderBottomColor: '#00000010',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'DOUZONEText30',
    color: '#1c90fb'
  }
});

export default CustomAlert;
