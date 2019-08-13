import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FileList from './FileList';
import UserList from './UserList';
import CustomButton from '../../../../components/CustomButton';

const isTablet = DeviceInfo.isTablet();

const OverViewPresenter = props => {
  const {
    isLoading,
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
        return (
          <FileList
            isLoading={isLoading}
            onChangeSharingMode={onChangeSharingMode}
          />
        );
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
            color: view === tab ? 'rgb(28, 144, 251)' : 'rgb(140, 140, 140)',
            fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif'
          }}
        >
          {/* <Image source={iconDocShare} style={styles.iconDocShare} /> */}
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  const fileLoadingModal = (
    <View style={styles.loadingModal}>
      <CustomButton
        name={'buttonClose'}
        onPress={() => props.cancelLoadDocument('getFileInfo')}
        style={{ position: 'absolute', top: 20, right: 20 }}
        width={24}
        height={24}
        areaWdith={24}
        areaHeight={24}
      />
      <ActivityIndicator
        size={Platform.OS === 'ios' ? 'large' : 100}
        color={'rgb(28, 144, 251)'}
      />
      <Text style={styles.loadingModalText}>문서를 불러오고 있습니다.</Text>
    </View>
  );

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

        <View
          style={[
            styles.listContainer,
            props.orientation !== 'vertical'
              ? styles.listContainerVertical
              : styles.listContainerHorizontal
          ]}
        >
          {ViewComponent()}
        </View>
      </View>

      {isLoading === 'FILE_LOADING' && fileLoadingModal}
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
    // height: '100%'
    flex: 1
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
  },

  loadingModal: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000AA',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingModalText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif'
  }
});

export default OverViewPresenter;
