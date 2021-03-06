/**
 *
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 *
 */
const CustomModal = props => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.display}
      blurRadius={1}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right'
      ]}
      onRequestClose={props.onClickClose}
    >
      <View style={styles.modalWrap}>
        <View style={styles.modalContentWrap}>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              zIndex: 11
            }}
            onPress={props.onClickClose}
          >
            <Icon
              name="times-circle"
              size={30}
              color="#CACACA"
              style={{
                zIndex: 10
              }}
            />
          </TouchableOpacity>

          <View style={styles.modalMessage}>
            <Text
              style={{
                fontSize: 22,
                color: '#1C90FB',
                marginBottom: 20,
                fontFamily: 'DOUZONEText30'
              }}
            >
              {props.title}
            </Text>
            <Text style={{fontFamily: 'DOUZONEText30'}}>{props.text}</Text>
            {props.children}
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={{ ...styles.modalButton, ...styles.modalButtonConfirm }}
              onPress={props.onClickFeedback}
            >
              <Text style={{ color: '#fff', fontFamily: 'DOUZONEText30' }}>{props.feedbackText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

/**
 *
 */
CustomModal.defaultProps = {
  display: false,
  title: '',
  text: '',
  children: null,
  feedbackText: '',
  onClickClose: () => alert('Close modal'),
  onClickFeedback: () => alert('Feedback modal')
};

/**
 *
 */
const styles = StyleSheet.create({
  modalWrap: {
    // marginTop: 22,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, .75)'
  },

  modalContentWrap: {
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

  modalMessage: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
    // borderWidth: 1,
    // borderColor: '#1C90FB'
  },

  modalButtons: { flexDirection: 'row' },
  modalButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: -1
  },
  modalButtonCancel: { backgroundColor: '#f1f1f1' },
  modalButtonConfirm: { backgroundColor: '#1C90FB' }
});

export default CustomModal;
