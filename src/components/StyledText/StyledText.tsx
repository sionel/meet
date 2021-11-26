import * as React from 'react';
import {
  Text as ReactText,
  TextInput as ReactTextInput,
  TextStyle,
  TextInputProps,
  TextComponent,
  TextInputComponent
} from 'react-native';

interface textProps extends TextComponent{
  // children: string;
  style: TextStyle;
  douzone: 1 | 3 | 5;
}
interface textInputProps extends TextInputComponent {
  // children: string;
  style: TextInputProps;
  douzone: 1 | 3 | 5;
}

export function Text(props: textProps) {
  const { style, douzone } = props;
  const fontFamily =
    douzone === 1
      ? 'DOUZONEText10'
      : douzone === 5
      ? '  DOUZONEText50'
      : 'DOUZONEText30';

  // let fontSize= 14; // 기본 폰트 사이즈
  // const RATIO = Platform.OS === 'android' ? 1 : 1; // 크기 비율

  // // NOTE fontFamily 일괄 변경
  // // fontSize 는 iOS 대비 안드로이드는 0.8 로 변경
  // if (Array.isArray(props.style)) {
  //   for (let i in props.style) {
  //     // FontFamily
  //     const fontWeight = Object.keys(props.style[i]).find(
  //       i => i === 'fontWeight'
  //     );
  //     if (
  //       fontWeight &&
  //       (props.style[i]['fontWeight'] === 'bold' ||
  //         props.style[i]['fontWeight'] >= 700)
  //     ) {
  //       fontFamily = 'DOUZONEText50';
  //       // fontFamily = Font.isLoaded('DOUZONEText50')
  //       //   ? 'DOUZONEText50'
  //       //   : 'DOUZONEText30';
  //     } else if (
  //       fontWeight &&
  //       (props.style[i]['fontWeight'] === 'lighter' ||
  //         props.style[i]['fontWeight'] <= 200)
  //     ) {
  //       fontFamily = 'DOUZONEText10';
  //       // fontFamily = Font.isLoaded('DOUZONEText10')
  //       //   ? 'DOUZONEText10'
  //       //   : 'DOUZONEText30';
  //     }
  //     // FontSize
  //     const size = Object.keys(props.style[i]).find(i => i === 'fontSize');
  //     if (size) {
  //       fontSize = props.style[i]['fontSize'];
  //     }
  //   }
  // } else {
  //   // FontFamily
  //   if (
  //     props.style['fontWeight'] === 'bold' ||
  //     props.style['fontWeight'] >= 700
  //   ) {
  //     fontFamily = 'DOUZONEText50';
  //     // fontFamily = Font.isLoaded('DOUZONEText50')
  //     //   ? 'DOUZONEText50'
  //     //   : 'DOUZONEText30';
  //   } else if (
  //     props.style['fontWeight'] === 'lighter' ||
  //     props.style['fontWeight'] <= 200
  //   ) {
  //     fontFamily = 'DOUZONEText10';
  //     // fontFamily = Font.isLoaded('DOUZONEText10')
  //     //   ? 'DOUZONEText10'
  //     //   : 'DOUZONEText30';
  //   }

  //   // FontSize
  //   if (props.style['fontSize']) {
  //     fontSize = props.style['fontSize'];
  //   }
  // }

  return <ReactText style={[style, { fontFamily }]} />;
}

export function TextInput(props: textInputProps) {
  const { style, douzone } = props;
  const fontFamily =
    douzone === 1
      ? 'DOUZONEText10'
      : douzone === 5
      ? '  DOUZONEText50'
      : 'DOUZONEText30';
  // let fontFamily = 'DOUZONEText30'; // 기본 폰트
  // let fontSize = 14; // 기본 폰트 사이즈
  // const RATIO = Platform.OS === 'android' ? 1 : 1; // 크기 비율

  // // NOTE fontFamily 일괄 변경
  // // fontSize 는 iOS 대비 안드로이드는 0.8 로 변경
  // if (Array.isArray(props.style)) {
  //   for (let i in props.style) {
  //     // FontFamily
  //     const fontWeight = Object.keys(props.style[i]).find(
  //       i => i === 'fontWeight'
  //     );
  //     if (
  //       fontWeight &&
  //       (props.style[i]['fontWeight'] === 'bold' ||
  //         props.style[i]['fontWeight'] >= 700)
  //     ) {
  //       fontFamily = 'DOUZONEText50';
  //       // fontFamily = Font.isLoaded('DOUZONEText50')
  //       //   ? 'DOUZONEText50'
  //       //   : 'DOUZONEText30';
  //     } else if (
  //       fontWeight &&
  //       (props.style[i]['fontWeight'] === 'lighter' ||
  //         props.style[i]['fontWeight'] <= 200)
  //     ) {
  //       fontFamily = 'DOUZONEText10';
  //       // fontFamily = Font.isLoaded('DOUZONEText10')
  //       //   ? 'DOUZONEText10'
  //       //   : 'DOUZONEText30';
  //     }
  //     // FontSize
  //     const size = Object.keys(props.style[i]).find(i => i === 'fontSize');
  //     if (size) {
  //       fontSize = props.style[i]['fontSize'];
  //     }
  //   }
  // } else {
  //   // FontFamily
  //   if (
  //     props.style['fontWeight'] === 'bold' ||
  //     props.style['fontWeight'] >= 700
  //   ) {
  //     fontFamily = 'DOUZONEText50';
  //     // fontFamily = Font.isLoaded('DOUZONEText50')
  //     //   ? 'DOUZONEText50'
  //     //   : 'DOUZONEText30';
  //   } else if (
  //     props.style['fontWeight'] === 'lighter' ||
  //     props.style['fontWeight'] <= 200
  //   ) {
  //     fontFamily = 'DOUZONEText10';
  //     // fontFamily = Font.isLoaded('DOUZONEText10')
  //     //   ? 'DOUZONEText10'
  //     //   : 'DOUZONEText30';
  //   }
  //   // FontSize
  //   if (props.style['fontSize']) {
  //     fontSize = props.style['fontSize'];
  //   }
  // }

  return <ReactTextInput style={[style, { fontFamily }] } />;
}
export default { Text, TextInput };
