import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ChangeCompanyScreenPresenter = props => {
  return (
    <Modal
      visible={props.visible}
      transparent={true}
      animationType={'fade'}
      supportedOrientations={[
        'portrait',
        'portrait-upside-down',
        'landscape',
        'landscape-left',
        'landscape-right'
      ]}
      onRequestClose={() => {}}
    >
      <TouchableOpacity
        onPress={props.onDisibleModal}
        style={{
          width: '100%',
          height: '100%',
          paddingLeft: '10%',
          paddingRight: '10%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00000088'
        }}
        activeOpacity={1}
      >
        <View
          style={{
            width: '100%',
            maxWidth: 486,
            height: props.items.length * 50,
            maxHeight: Math.min(width, height) * 0.8
          }}
        >
          <ScrollView style={styles.container}>
            {props.items.map(item => (
              <TouchableOpacity
                onPress={item.action}
                style={{
                  height: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: '#ccc'
                }}
                key={item.key}
              >
                <Text
                  style={{
                    backgroundColor: '#fff',
                    padding: 16,
                    fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal'
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff'
  }
});

ChangeCompanyScreenPresenter.defaultProps = {
  items: [
    {
      title: '',
      key: '',
      action: () => {}
    }
  ]
};

export default ChangeCompanyScreenPresenter;
