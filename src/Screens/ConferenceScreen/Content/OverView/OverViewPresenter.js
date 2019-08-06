import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FileList from './FileList';
import UserList from './UserList';

const isTablet = DeviceInfo.isTablet();

const OverViewPresenter = props => {
  const {
    view,
    tabs,
    orientation,
    speaker,
    setDocumentListMode,
    onChangeSharingMode,
    onChangeState,
    onChangeSpeaker
  } = props;

  const ViewComponent = () => {
    switch (view) {
      case 'USERLIST':
        return <UserList speaker={speaker} onChangeSpeaker={onChangeSpeaker} />;
      case 'FILELIST':
        return <FileList onChangeSharingMode={onChangeSharingMode} />;
      default:
        return null;
    }
  };

  const TabComponent = (tab, tabName) => {
    return (
      <TouchableOpacity
        key={tab}
        onPress={() => onChangeState('view', tab)}
        style={[
          styles.headerView,
          view === tab
            ? {
                borderBottomWidth: 2,
                borderBottomColor: 'rgb(28, 144, 251)'
              }
            : {
                borderBottomWidth: 1,
                borderBottomColor: 'rgb(232, 235, 239)'
              }
        ]}
      >
        <Text
          style={{
            color: view === tab ? 'rgb(28, 144, 251)' : 'rgb(140, 140, 140)'
          }}
        >
          {/* <Image source={iconDocShare} style={styles.iconDocShare} /> */}
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { top: 0 }]}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.topArea}
        onPress={() => setDocumentListMode(false)}
      />

      <View style={styles.bottomArea}>
        <View style={styles.header}>
          {tabs.map(item => TabComponent(item.key, item.name))}
        </View>

        <ScrollView
          style={[
            styles.listContainer,
            props.orientation !== 'vertical'
              ? styles.listContainerVertical
              : styles.listContainerHorizontal
          ]}
        >
          {ViewComponent()}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 11,
    top: 100,
    bottom: 0,
    left: 0,
    width: '100%',
    // height: '100%',
    backgroundColor: 'transparent'
  },
  topArea: {
    // height: '50%',
    flex: 1,
    backgroundColor: '#00000090'
  },
  bottomArea: {
    // height: '50%',
    flex: 2,
    backgroundColor: 'rgb(232, 235, 239)',
    borderTopColor: '#ddd',
    borderTopWidth: 1
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
    alignItems: 'center'
  },
  headerText: {},
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

export default OverViewPresenter;
