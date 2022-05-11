import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

import FileCard from './components/FileCard';

import { FileListPresenterProps } from '@screens/ConferenceScreen_New/types';

const FileListPresenter: React.FC<FileListPresenterProps> = ({
  isLoading,
  documentList,
  TokenID,
  onRefreshList,
  setLoading,
  setWedriveList,
  t
}) => {
  return (
    <BlurView
      style={styles.popupContainer}
      overlayColor="rgba(255,255,255,0.01)"
      // blurType='dark'
    >
      <View style={{
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}>
        <View style={styles.popupHeader}>
          <Text style={styles.headerText}>{t('meet_storage')}</Text>
        </View>
        <View
          style={{ height: 350 }} // 높이 하드코딩 패드보고 이상함 없으면 패스
        >
          {isLoading === 'LOADING' ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : documentList.length === 0 ? (
            <View
              style={{
                paddingTop: 20,
                paddingBottom: 10,
                alignItems: 'center'
              }}
            >
              <Text style={{ fontFamily: 'DOUZONEText30' }}>
                파일이 없습니다.
              </Text>
            </View>
          ) : (
            <FlatList
              data={documentList}
              style={styles.documentList}
              contentContainerStyle={styles.listContainer}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <FileCard
                  file={item}
                  TokenID={TokenID}
                  setLoading={setLoading}
                  setWedriveList={setWedriveList}
                />
              )}
              refreshControl={
                <RefreshControl
                  refreshing={isLoading === 'LOADING'}
                  onRefresh={onRefreshList}
                  tintColor={'#fff'}
                />
              }
              showsVerticalScrollIndicator={true}
            />
          )}
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  popupContainer: {
    flex: 1
  },
  popupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DOUZONEText50'
  },
  loadingContainer: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    paddingLeft: 16,
    paddingRight: 16
  },
  documentList: {
    paddingTop: 16,
    paddingBottom: 9
  }
});

export default FileListPresenter;
