import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import { FileCardPresenterProps } from '@screens/ConferenceScreen/types';

import CustomIcon from '@components/CustomIcon';

const FileCardPresenter: React.FC<FileCardPresenterProps> = ({
  file,
  onPressFile,
  ExtentionType,
  ConvertFileSize
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={() => {
        onPressFile(file);
      }}
      style={styles.itemBox}
    >
      <CustomIcon
        name={
          file.directory
            ? file.shareFolder
              ? 'shareFolder'
              : 'folder'
            : ExtentionType(file.fileName)
        }
      />
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemInfo}>
        {file.fileName}
      </Text>
      {!file.directory && (
        <Text style={styles.itemSize}>{ConvertFileSize(file.size)}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FileCardPresenter;

const styles = StyleSheet.create({
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  itemInfo: {
    flex: 5,
    color: '#fff',
    fontSize: 14,
    marginLeft: 11,
    fontFamily: 'DOUZONEText30'
  },
  itemSize: {
    flex: 2,
    fontSize: 12,
    color: '#fff',
    textAlign: 'right',
    fontFamily: 'DOUZONEText30'
  }
});
