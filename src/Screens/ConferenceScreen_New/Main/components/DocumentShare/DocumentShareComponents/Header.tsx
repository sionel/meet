import React, { Fragment } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShareHeader } from '@screens/ConferenceScreen_New/types';
import CustomButton from '@components/CustomButton';

import icMicOff from '@assets/icons/mic_off.png';
import icMicOn from '@assets/icons/mic_on.png';
import buttonClose from '@oldassets/buttons/btnTnaviCloseNone_3x.png';

const Header: React.FC<ShareHeader> = ({
  showTool,
  fileName,
  isMikeOn,
  resources,
  scrollRef,
  showPreView,
  imgList,
  page,
  onPressExit,
  onPressMike,
  onPressImageList,
  onPressArrow
}) => {
  return (
    <Fragment>
      {showTool && (
        <View
          style={{
            ...styles.topButtonBar,
            paddingTop: 11,
            paddingBottom: 11,
            paddingLeft: 16,
            paddingRight: 16
          }}
        >
          <TouchableOpacity style={styles.exitButton} onPress={onPressExit}>
            <Image
              source={buttonClose}
              resizeMode={'cover'}
              style={{ width: 16.5, height: 17 }}
            />
          </TouchableOpacity>

          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={[styles.headerText, { flex: 1 }]}
          >
            {fileName}
          </Text>

          <TouchableOpacity
            style={[
              styles.micButton,
              isMikeOn && { backgroundColor: '#1c90fb' }
            ]}
            onPress={onPressMike}
          >
            <Image
              source={isMikeOn ? icMicOn : icMicOff}
              resizeMode={'cover'}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        </View>
      )}
      {resources.length > 0 && (
        <View style={[styles.preView, !showPreView && styles.preViewHidden]}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
          >
            <FlatList
              data={imgList}
              horizontal={true}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={onPressImageList}
                  style={[
                    styles.resourceItem,
                    index === imgList.length - 1 && { marginRight: 10 }
                  ]}
                >
                  <Text style={styles.preViewPageNumber}>{index + 1}</Text>
                  <View
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor:
                        index === page
                          ? 'rgb(28, 144, 251)'
                          : 'rgb(210, 210, 210)'
                    }}
                  >
                    {item}
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      )}
      {resources.length > 0 && (
        <CustomButton 
          name={showPreView ? 'btnArrowUp' : 'btnArrowDown'}
          onPress={onPressArrow}
          style={{ padding: 0, margin: 0 }}
          width={24}
          height={24}
          areaWidth={24}
          areaHeight={24}
        />
      )}
    </Fragment>
  );
};

export default Header;

const styles = StyleSheet.create({
  topButtonBar: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // zIndex: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  exitButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 7.5
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    height: 28,
    lineHeight: 28,
    fontFamily: 'DOUZONEText30'
  },
  micButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center'
  },
  preView: {
    width: '100%',
    height: 85,
    paddingTop: 5,
    paddingBottom: 10,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomColor: 'rgb(210, 210, 210)',
    borderBottomWidth: 1,
    backgroundColor: 'rgb(242, 242, 242)'
  },
  preViewHidden: {
    height: 0,
    overflow: 'hidden',
    paddingTop: 0,
    paddingBottom: 0,
    borderBottomWidth: 0
  },
  resourceItem: {
    position: 'relative',
    width: 68,
    height: 68,
    marginLeft: 10
  },
  preViewPageNumber: {
    fontSize: 12,
    marginBottom: 3,
    fontFamily: 'DOUZONEText30'
  },
});
