/**
 * SearchFormPresenter
 * 검색바 프레젠터
 */

import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

const SafetyView = Platform.OS === 'ios' ? SafeAreaView : View;

const SearchFormPresenter = props => {
  const { active, value } = props;
  return (
    <View style={styles.wrap}>
      <SafetyView style={{ width: '100%' }}>
        <View style={{ position: 'relative' }}>
          <Icon
            name="search1"
            size={18}
            color="#c8c8c8"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="검색"
            style={styles.input}
            disableFullscreenUI={true}
            onChangeText={newText => props.onChange(newText)}
            value={value}
          />
          {active && (
            <TouchableOpacity
              onPress={() => props.onChange('')}
              style={styles.closeIcon}
            >
              <Icon name="closecircle" size={20} color="#c8c8c8" />
            </TouchableOpacity>
          )}
        </View>
      </SafetyView>
    </View>
  );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    width: '100%',
    backgroundColor: '#fafafa',
    // backgroundColor: '#e7e7e7',
    padding: 8,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: '#dfdfdf',
    zIndex: 5
  },

  searchIcon: {
    position: 'absolute',
    left: 15,
    top: '50%',
    marginTop: -10,
    zIndex: 10
  },

  closeIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    marginTop: -10,
    zIndex: 10
  },

  input: {
    height: 32,
    borderColor: '#dadada',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingLeft: 41,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 16,
    zIndex: 9,
    fontFamily: 'DOUZONEText30',
    fontSize: 13
  }
});

export default SearchFormPresenter;
