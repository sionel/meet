import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { FileCardProps } from '@screens/ConferenceScreen_New/types';
import CustomIcon from '@components/CustomIcon';

const FileCard: React.FC<FileCardProps> = ({
  setConvertFileSize,
  setSharingMode,
  getExtentionType,
  file
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.3}
      onPress={() => {
        setSharingMode(file);
      }}
      style={styles.itemBox}
    >
      <CustomIcon
        name={
          file.directory
            ? file.shareFolder
              ? 'shareFolder'
              : 'folder'
            : getExtentionType(file.fileName)
        }
      />
      <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.itemInfo}>
        {file.fileName}
      </Text>
      {!file.directory && (
        <Text style={styles.itemSize}>{setConvertFileSize(file.size)}</Text>
      )}
    </TouchableOpacity>
  );
};

export default FileCard;

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
