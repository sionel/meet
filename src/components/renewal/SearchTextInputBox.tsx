import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import React, { Dispatch, SetStateAction } from 'react';

import { ic_cancel_w as icCancel, ic_search as icSearch } from '@assets/index';
import { useTranslation } from 'react-i18next';

import deviceInfoModule from 'react-native-device-info';
const isPad = deviceInfoModule.isTablet();

interface searchInputProps {
  keyword: string;
  inputboxPlaceholder?: string;
  searchRef?: any;
  setKeyword: Dispatch<SetStateAction<string>>;
  onSearchSubmitEditing?: () => void;
}

const SearchTextInputBox: React.FC<searchInputProps> = ({
  keyword,
  inputboxPlaceholder,
  searchRef,
  setKeyword,
  onSearchSubmitEditing
}) => {
  const { t } = useTranslation();
  return (
    <View style={styles.searchContainer}>
      <View
        style={[
          styles.search,
          keyword !== '' && { borderColor: '#333', borderWidth: 1 }
        ]}
      >
        <TextInput
          style={styles.input}
          returnKeyType="search"
          value={keyword}
          onChangeText={setKeyword}
          onSubmitEditing={
            onSearchSubmitEditing ? () => onSearchSubmitEditing() : undefined
          }
          placeholder={inputboxPlaceholder}
          placeholderTextColor={'rgb(147,147,147)'}
          ref={searchRef}
        />
        {keyword !== '' ? (
          <TouchableOpacity onPress={() => setKeyword('')}>
            <View style={styles.cancelIconContainer}>
              <Image
                source={icCancel}
                resizeMode={'cover'}
                style={styles.icCancel}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.searchIconContainer}>
            <Image
              source={icSearch}
              resizeMode={'cover'}
              style={{ width: 24, height: 24 }}
            />
          </View>
        )}
      </View>
      {keyword !== '' && (
        <TouchableOpacity onPress={() => setKeyword('')}>
          <Text style={styles.serachCancelText}>
            {t('renewal.alert_button_cancel')}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchTextInputBox;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f8fa',
    paddingHorizontal: isPad ? 30 : 20,
    paddingVertical: 6
  },
  search: {
    height: 40,
    flex: 1,
    backgroundColor: 'rgb(250,250,250)',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    paddingHorizontal: 14
  },
  input: {
    flex: 1,
    height: Platform.OS === 'ios' ? 30 : 50,
    fontFamily: 'DOUZONEText30',
    fontSize: 15,
    color: '#333'
  },
  cancelIconContainer: {
    backgroundColor: 'rgb(147,147,147)',
    width: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4
  },
  icCancel: {
    width: 11,
    height: 11
  },
  searchIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  serachCancelText: {
    marginLeft: 10,
    fontFamily: 'DOUZONEText30',
    fontSize: 15,
    color: '#333',
    letterSpacing: -0.3
  }
});
