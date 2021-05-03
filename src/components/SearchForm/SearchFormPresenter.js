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
import CustomIcon from '../CustomIcon';
import { getT } from '../../utils/translateManager';
const SafetyView = Platform.OS === 'ios' ? SafeAreaView : View;

const SearchFormPresenter = props => {
  const { active, value } = props;
  const t = getT();
  return (
    <View style={styles.wrap}>
      <SafetyView style={{ width: '100%' }}>
        <View style={{ position: 'relative' }}>
          <CustomIcon
            width={18}
            height={18}
            name={'btn_navi_search_press'}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder={t('create_room.search')}
            style={styles.input}
            disableFullscreenUI={true}
            onChangeText={newText => {
              props.onChange(newText);
            }}
            value={value}
          />
          {active && (
            <TouchableOpacity
              onPress={() => props.onChange('')}
              style={styles.closeIcon}
            >
              <CustomIcon
                style={{ position: 'absolute', top: 4, right: 5 }}
                width={25}
                height={25}
                name={'btnUserCancelNone'}
              />
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
    width: 50,
    height: 50,
    right: 0,
    // top: 4,
    // marginTop: 10,
    zIndex: 10,
    padding: 15
    // paddingRight:10,
    // backgroundColor:"rgba(255,0,0,0.5)"
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
