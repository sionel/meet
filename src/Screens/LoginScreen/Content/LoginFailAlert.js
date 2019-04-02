import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

const LoginFailAlert = (props) => {
  return (
    <Modal
      animationType="slide"
      visible={props.modal}
      transparent={true}
      animationType="fade"
      onRequestClose={props.onCancelTryLogin}
    >
      <View style={styles.modalWrap}>
        <View style={styles.modalContents}>
          <Text style={styles.modalMessage}>
            {props.modalText}
          </Text>
          <View style={styles.modalButtonView}>
            <Button
              style={styles.modalButton}
              title="취소"
              color="#FFF"
              onPress={props.onCancelTryLogin}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0, .75)'
  },
  modalContents: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 17,
    paddingBottom: 17
  },
  modalMessage: {
    color: '#fff',
    fontSize: 18,
    textAlign: "center"
  },
  modalButtonView: {
    borderWidth: 1,
    borderColor: "#FFF",
    borderRadius: 5,
    marginTop: 10,
    width: 80
  },
  modalButton: {
    color: '#fff',
    fontSize: 18
  }
})

export default LoginFailAlert;