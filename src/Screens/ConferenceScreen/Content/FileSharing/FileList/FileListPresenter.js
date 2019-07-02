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
// import iconDocShare from '../../../../../../assets/buttons/doc_share_3x.png';

const FileListPresenter = props => {
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
              <View style={styles.itemBox}>
                <Image
                  source={{
                    uri:
                      'data:image/png;base64,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'
                  }}
                  resizeMode={'contain'}
                  style={styles.thumbImg}
                />
                <Text
                  onPress={props.onChangeSharingMode}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={styles.itemInfo}
                >
                  {item.fileName}.{item.ext}
                </Text>
              </View>
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
    paddingLeft: 18,
    paddingRight: 18
  },
  thumbImg: {
    width: 24,
    height: 24
  },
  itemInfo: {
    width: '80%',
    color: 'rgb(51, 51, 51)',
    fontSize: 16,
    marginLeft: 11
  }
});

export default FileListPresenter;
