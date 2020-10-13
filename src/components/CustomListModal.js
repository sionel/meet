import * as React from 'react';
import {
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';
import { Text } from './StyledText';

export default function CustomListModal(props) {
  const {
    visible,
    list,
    activeOpacity,
    underlayColor,
    selectedColor,
    width,
    maxHeight,
    modalStyle,
    backgroundColor,
    top,
    onClose
  } = props;
  const [colorOnPressDown, setColorOnPressDown] = React.useState({
    0: '#000'
  });

  if (!visible) return null;

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={Object.assign(
        {},
        styles.container,
        {
          backgroundColor
        },
        top && { justifyContent: 'flex-start', paddingTop: top }
      )}
      onPress={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {}}
        style={Object.assign({}, styles.mainContainer, modalStyle, {
          maxHeight,
          width
        })}
      >
        <ScrollView style={{}}>
          <FlatList
            data={list}
            extraData={[colorOnPressDown]}
            renderItem={({ item, index }) => (
              <TouchableHighlight
                activeOpacity={activeOpacity}
                underlayColor={underlayColor}
                onPress={item.action}
                onShowUnderlay={() => {
                  selectedColor &&
                    setColorOnPressDown({ [index + 1]: selectedColor });
                }}
                onHideUnderlay={() => {
                  selectedColor && setColorOnPressDown({ 0: '#000' });
                }}
                style={Object.assign({}, styles.renderItem)}
              >
                <Text
                  numberOfLines={1}
                  ellipsizeMode={'tail'}
                  style={{ color: colorOnPressDown[index + 1] || '#000' }}
                >
                  {item.title}
                </Text>
              </TouchableHighlight>
            )}
          />
        </ScrollView>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

CustomListModal.defaultProps = {
  visible: false, // boolean
  list: [],
  activeOpacity: 1,
  backgroundColor: '#00000090',
  underlayColor: '#00000020',
  selectedColor: '#000',
  width: 300,
  maxHeight: 600,
  modalStyle: {},
  top: null,
  onClose: () => {}
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100
  },
  mainContainer: {
    display: 'flex',
    backgroundColor: '#fff',
    maxWidth: '80%'
  },
  renderItem: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start'
  }
});
