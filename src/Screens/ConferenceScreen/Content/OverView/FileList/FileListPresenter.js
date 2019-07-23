import React, { Fragment } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import CustomIcon from '../../../../../components/CustomIcon';

const FileListPresenter = props => {
  const getExtentionType = fileName => {
    const ext = fileName
      .split('.')
      .pop()
      .toLowerCase();
    return ext;
  };

  return (
    <Fragment>
      {props.isLoading ? (
        <View
          style={{ paddingTop: 20, paddingBottom: 10, alignItems: 'center' }}
        >
          <Text>로딩 중입니다.</Text>
        </View>
      ) : props.documentList.length === 0 ? (
        <View
          style={{ paddingTop: 20, paddingBottom: 10, alignItems: 'center' }}
        >
          <Text>파일이 없습니다.</Text>
        </View>
      ) : null}
      <FlatList
        data={props.documentList}
        style={styles.documentList}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => {
              props.setSharingMode(item);
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
                {props.setConvertFileSize(item.size)}
              </Text>
            )}
          </TouchableOpacity>
        )}
      />
    </Fragment>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: '100%'
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
    paddingBottom: 16
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
    marginLeft: 11
  },
  itemSize: {
    flex: 2,
    fontSize: 12,
    textAlign: 'right'
  }
});

export default FileListPresenter;
