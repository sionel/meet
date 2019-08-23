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
import Icon from 'react-native-vector-icons/FontAwesome';

const SafetyView = Platform.OS === 'ios' ? SafeAreaView : View;

const SearchFormPresenter = props => {
  const { active, value } = props;
  return (
    <View style={styles.wrap}>
      <SafetyView style={{ width: '100%' }}>
        <View style={{ position: 'relative' }}>
          <Icon
            name="search"
            size={18}
            color="#c8c8c8"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="검색"
            style={styles.input}
            onChangeText={newText => props.onChange(newText)}
            value={value}
          />
          {active && (
            <TouchableOpacity
              onPress={() => props.onChange('')}
              style={styles.closeIcon}
            >
              <Icon name="times-circle" size={25} color="#c8c8c8" />
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
    marginTop: -9,
    zIndex: 10
  },

  closeIcon: {
    position: 'absolute',
    right: 23,
    top: '50%',
    marginTop: -12,
    zIndex: 10
  },

  input: {
    height: 40,
    borderColor: '#dadada',
    borderWidth: 1,
    backgroundColor: '#fff',
    paddingLeft: 41,
    paddingRight: 10,
    // borderRadius: 5,
    borderRadius: 25.5,
    zIndex: 9,
    fontFamily: Platform.OS === 'ios' ? 'NanumSquareB' : 'normal'
  }
});

export default SearchFormPresenter;
