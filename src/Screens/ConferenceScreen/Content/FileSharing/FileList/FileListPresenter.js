import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
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
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.topArea}
        onPress={() => props.setDocumentListMode(false)}
      />

      <View style={styles.bottomArea}>
        <View style={styles.header}>
          <View style={styles.headerView}>
            <Text style={styles.headerText}>
              {/* <Image source={iconDocShare} style={styles.iconDocShare} /> */}
              WeDrive 목록
            </Text>
          </View>
          {/* <View style={styles.headerView}>
          <Text style={styles.headerText}>WeDrive 목록</Text>
        </View> */}
        </View>

        <ScrollView
          style={[
            styles.listContainer,
            props.orientation !== 'vertical'
              ? styles.listContainerVertical
              : styles.listContainerHorizontal
          ]}
        >
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
                <CustomIcon name={item.directory ? 'folder' : getExtentionType(item.fileName)} />
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={styles.itemInfo}
                >
                  {item.shareFolder && '[공유] '}
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
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 11,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent'
  },
  topArea: {
    // height: '50%',
    flex: 1,
    backgroundColor: 'transparent'
  },
  bottomArea: {
    // height: '50%',
    flex: 2,
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
  headerText: {
    color: 'rgb(28, 144, 251)'
  },
  iconDocShare: {},
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
