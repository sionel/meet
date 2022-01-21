import React, { Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Platform
} from 'react-native';
import CustomIcon from '@components/CustomIcon';

const FileListPresenter = props => {
  const {
    isLoading,
    documentList,
    setSharingMode,
    setConvertFileSize,
    getWedriveToken
  } = props;

  const getExtentionType = fileName => {
    const ext = fileName
      .split('.')
      .pop()
      .toLowerCase();
    return ext;
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoading === 'LOADING'}
          onRefresh={getWedriveToken}
        />
      }
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.listContainer}
      style={{ height: '100%' }}
    >
      {documentList.length === 0 && isLoading !== 'LOADING' ? (
        <View
          style={{ paddingTop: 20, paddingBottom: 10, alignItems: 'center' }}
        >
          <Text style={{fontFamily: 'DOUZONEText30'}}>파일이 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={documentList}
          style={styles.documentList}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.3}
              onPress={() => {
                setSharingMode(item);
              }}
              style={styles.itemBox}
            >
              <CustomIcon
                name={
                  item.directory
                    ? item.shareFolder
                      ? 'shareFolder'
                      : 'folder'
                    : getExtentionType(item.fileName)
                }
              />
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={styles.itemInfo}
              >
                {/* {item.shareFolder && '[공유] '} */}
                {item.fileName}
              </Text>
              {!item.directory && (
                <Text style={styles.itemSize}>
                  {setConvertFileSize(item.size)}
                </Text>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingLeft: 16,
    paddingRight: 16
  },
  listContainerVertical: {
    paddingLeft: 36,
    paddingRight: 36
  },
  listContainerHorizontal: {
    paddingLeft: 16,
    paddingRight: 16
  },
  documentList: {
    paddingTop: 16,
    paddingBottom: 9
  },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    marginBottom: 7,
    paddingLeft: 14,
    paddingRight: 14
  },
  itemInfo: {
    // maxWidth: '80%',
    flex: 5,
    color: 'rgb(51, 51, 51)',
    fontSize: 14,
    marginLeft: 11,
    fontFamily: 'DOUZONEText30'
  },
  itemSize: {
    flex: 2,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'DOUZONEText30'
  }
});

export default FileListPresenter;
