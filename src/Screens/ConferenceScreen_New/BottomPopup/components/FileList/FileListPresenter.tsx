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
  Animated
} from 'react-native';
import { useDispatch } from 'react-redux';
import { actionCreators as DocumentActions } from '@redux/documentShare';
import CustomIcon from '../../../../../components/CustomIcon';
import { useTranslation } from 'react-i18next';
import FileCard from './components/FileCard';
import { BlurView } from '@react-native-community/blur';

const FileListPresenter: React.FC<FileListPresenterProps> = ({
  isLoading,
  documentList,
  spin,
  setSharingMode,
  setConvertFileSize,
  getWedriveToken,
  getExtentionType,
  t
}) => {  
  return isLoading === 'LOADING' ? (
    <View
      style={{
        width: '100%',
        height: 350,
        backgroundColor: 'rgba(0,0,0,0.4)'
      }}
    >
      <Animated.View
        style={{
          flex: 1,
          height: '100%',
          transform: [{ rotate: spin }],
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CustomIcon name={'loading'} width={40} height={40} />
      </Animated.View>
    </View>
  ) : (
    <BlurView
      style={styles.popupContainer}
      overlayColor="rgba(255,255,255,0.01)"
    >
      <View //이거 없애는 방향으로 디자인 하고 조금 안맞아도 그냥 패스
        style={{
          backgroundColor: 'rgba(0,0,0,0.4)'
        }}
      >
        <View style={styles.popupHeader}>
          <Text style={styles.headerText}>{t('meet_storage')}</Text>
        </View>
        <View style={{ height: 350 }} // 높이 하드코딩 패드보고 이상함 없으면 패스
        > 
          <ScrollView // 스크롤뷰는 삭제
            refreshControl={
              <RefreshControl
                refreshing={isLoading === 'LOADING'}
                onRefresh={getWedriveToken}
                // onRefresh={onRefreshWedriveToken} 함수 이름들 재 정의
                tintColor={'#fff'}
              />
            }
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.listContainer}
            style={{ height: '100%' }}
          >
            {documentList.length === 0 && isLoading !== 'LOADING' ? ( // 이즈로딩 삭제
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
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <FileCard
                    file={item}
                    getExtentionType={getExtentionType} // 아래 함수들 필요없어 보임
                    setConvertFileSize={setConvertFileSize}
                    setSharingMode={setSharingMode}
                  />
                )}
              />
            )}
          </ScrollView>
        </View>
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  backGroundView: {
    flex: 1
  },
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
