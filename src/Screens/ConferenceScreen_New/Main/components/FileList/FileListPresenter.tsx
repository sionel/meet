import { FileListPresenterProps } from '@screens/ConferenceScreen_New/types';
import { getT } from '@utils/translateManager';
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { actionCreators as DocumentActions } from '@redux/documentShare';
import CustomIcon from '../../../../../components/CustomIcon';

const FileListPresenter: React.FC<FileListPresenterProps> = ({
  isLoading,
  documentList,
  setSharingMode,
  setConvertFileSize,
  getWedriveToken
}) => {
  const t = getT();
  const dispatch = useDispatch();
  const setDocumentListMode = () => {
    dispatch(DocumentActions.setDocumentListMode());
  };
  
  const getExtentionType = (fileName: any) => {
    const ext = fileName
      .split('.')
      .pop()
      .toLowerCase();
    return ext;
  };

  return (
    <View style={styles.backGroundView}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.topArea}
        onPress={() => setDocumentListMode()}
      />
      <View style={styles.bottomArea}>
        <View style={styles.header}>
          <View style={styles.headerView}>
            <Text style={styles.listHeaderText}>{t('meet_storage')}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
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
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backGroundView: {
    flex: 1
  },
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
  },
  topArea: {
    flex: 1,
    backgroundColor: '#00000090'
  },
  bottomArea: {
    flex: 3,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(232, 235, 239)'
  },
  header: {
    flexDirection: 'row',
    height: 45,
    width: '100%',
    backgroundColor: '#fff'
  },
  headerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'rgb(28, 144, 251)'
  },
  listHeaderText: {
    color: 'rgb(28, 144, 251)',
    fontFamily: 'DOUZONEText30'
  }
});

export default FileListPresenter;
