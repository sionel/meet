import React, { Fragment } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  FlatList,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
const { width, height } = Dimensions.get('window');

export interface ConferenceBotPopupContent {
  icon1: ImageSourcePropType;
  name: string;
  onClick: () => void;
}

interface BottomPopupProps {
  title: string;
  contentList: ConferenceBotPopupContent[];
}

export default function BottomPopup(
  props: BottomPopupProps
  // & { isHorizon: boolean }
) {
  const { title, contentList } = props;
  // const { isHorizon } = props;
  return (
    <BlurView style={styles.botVerPopContainer} blurAmount={50}>
      <View style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View style={styles.verHeaderConatainer}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={contentList}
          bounces={false}
          renderItem={data => {
            const { item } = data;
            return (
              <TouchableHighlight
                style={[styles.verMenuRow]}
                activeOpacity={0.9}
                underlayColor="rgba(214,255,239,0.1)"
                onPress={item.onClick}
              >
                <View style={styles.verMenuRowView}>
                  {item.icon1 && (
                    <Image
                      source={item.icon1}
                      resizeMode={'contain'}
                      style={styles.frontIcon}
                    />
                  )}
                  <Text style={styles.menuText} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>
              </TouchableHighlight>
            );
          }}
        />
        <View style={{ height: 20 }}></View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  botPopContainer: {
    position: 'absolute',
    width,
    height,
    backgroundColor: 'rgb(0,0,0)'
  },
  botVerPopContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    width: '100%',
    maxHeight: height * 0.62,
    borderRadius: 10
  },
  verHeaderConatainer: {
    marginTop: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)'
  },
  verMenuRow: {
    height: 48
  },
  verMenuRowView: {
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  botPopupContainer: {
    width: '30%',
    backgroundColor: '#fff',
    zIndex: 2,
    borderRadius: 30
  },
  headerConatainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#d1d1d1'
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'DOUZONEText50'
  },
  menuRow: {
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center'
  },
  frontIcon: { width: 24, height: 24, marginRight: 16 },
  menuText: {
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#fff'
  }
});

// isHorizon ? (
//   <View style={styles.botPopContainer}>
//     <SafeAreaView style={styles.popupSafeAreaView}>
//       <TouchableOpacity
//         onPress={onClickOutside}
//         style={styles.outsideTouch}
//         activeOpacity={1}
//       />
//       <View style={styles.botPopupContainer}>
//         <View style={styles.headerConatainer}>
//           <Text style={styles.headerText}>{title}</Text>
//         </View>
//         <FlatList
//           keyExtractor={(item, index) => index.toString()}
//           data={contentList}
//           renderItem={data => {
//             const { item } = data;
//             return (
//               <TouchableOpacity
//                 style={styles.menuRow}
//                 activeOpacity={0.3}
//                 onPress={item.onClick}
//               >
//                 {item.icon1 && (
//                   <Image
//                     source={item.icon1}
//                     resizeMode={'contain'}
//                     style={styles.frontIcon}
//                   />
//                 )}
//                 <Text style={styles.menuText} numberOfLines={1}>
//                   {item.name}
//                 </Text>
//                 {item.icon2 && (
//                   <Image
//                     source={item.icon2}
//                     resizeMode={'contain'}
//                     style={{ height: '80%' }}
//                   />
//                 )}
//               </TouchableOpacity>
//             );
//           }}
//         />
//       </View>
//     </SafeAreaView>
//   </View>
// ) :
