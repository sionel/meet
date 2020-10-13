import * as React from 'react';
import {
  Text as ReactText,
  TextInput as ReactTextInput,
  Platform
} from 'react-native';


export function Text(props) {
  let fontFamily = 'DOUZONEText30'; // 기본 폰트
  let fontSize= 14; // 기본 폰트 사이즈
  const RATIO = Platform.OS === 'android' ? 1 : 1; // 크기 비율

  // NOTE fontFamily 일괄 변경
  // fontSize 는 iOS 대비 안드로이드는 0.8 로 변경
  if (Array.isArray(props.style)) {
    for (let i in props.style) {
      // FontFamily
      const fontWeight = Object.keys(props.style[i]).find(
        i => i === 'fontWeight'
      );
      if (
        fontWeight &&
        (props.style[i]['fontWeight'] === 'bold' ||
          props.style[i]['fontWeight'] >= 700)
      ) {
        fontFamily = 'DOUZONEText50';
        // fontFamily = Font.isLoaded('DOUZONEText50')
        //   ? 'DOUZONEText50'
        //   : 'DOUZONEText30';
      } else if (
        fontWeight &&
        (props.style[i]['fontWeight'] === 'lighter' ||
          props.style[i]['fontWeight'] <= 200)
      ) {
        fontFamily = 'DOUZONEText10';
        // fontFamily = Font.isLoaded('DOUZONEText10')
        //   ? 'DOUZONEText10'
        //   : 'DOUZONEText30';
      }
      // FontSize
      const size = Object.keys(props.style[i]).find(i => i === 'fontSize');
      if (size) {
        fontSize = props.style[i]['fontSize'];
      }
    }
  } else {
    // FontFamily
    if (
      props.style['fontWeight'] === 'bold' ||
      props.style['fontWeight'] >= 700
    ) {
      fontFamily = 'DOUZONEText50';
      // fontFamily = Font.isLoaded('DOUZONEText50')
      //   ? 'DOUZONEText50'
      //   : 'DOUZONEText30';
    } else if (
      props.style['fontWeight'] === 'lighter' ||
      props.style['fontWeight'] <= 200
    ) {
      fontFamily = 'DOUZONEText10';
      // fontFamily = Font.isLoaded('DOUZONEText10')
      //   ? 'DOUZONEText10'
      //   : 'DOUZONEText30';
    }

    // FontSize
    if (props.style['fontSize']) {
      fontSize = props.style['fontSize'];
    }
  }

  return (
    <ReactText
      {...props}
      style={[
        props.style,
        { fontWeight: 'normal', fontFamily, fontSize: fontSize * RATIO }
      ]}
    >
      {/* {props.children} */}
    </ReactText>
  );
}
Text.defaultProps = {
  style: {}
};

export function TextInput(props) {
  let fontFamily = 'DOUZONEText30'; // 기본 폰트
  let fontSize = 14; // 기본 폰트 사이즈
  const RATIO = Platform.OS === 'android' ? 1 : 1; // 크기 비율

  // NOTE fontFamily 일괄 변경
  // fontSize 는 iOS 대비 안드로이드는 0.8 로 변경
  if (Array.isArray(props.style)) {
    for (let i in props.style) {
      // FontFamily
      const fontWeight = Object.keys(props.style[i]).find(
        i => i === 'fontWeight'
      );
      if (
        fontWeight &&
        (props.style[i]['fontWeight'] === 'bold' ||
          props.style[i]['fontWeight'] >= 700)
      ) {
        fontFamily = 'DOUZONEText50';
        // fontFamily = Font.isLoaded('DOUZONEText50')
        //   ? 'DOUZONEText50'
        //   : 'DOUZONEText30';
      } else if (
        fontWeight &&
        (props.style[i]['fontWeight'] === 'lighter' ||
          props.style[i]['fontWeight'] <= 200)
      ) {
        fontFamily = 'DOUZONEText10';
        // fontFamily = Font.isLoaded('DOUZONEText10')
        //   ? 'DOUZONEText10'
        //   : 'DOUZONEText30';
      }
      // FontSize
      const size = Object.keys(props.style[i]).find(i => i === 'fontSize');
      if (size) {
        fontSize = props.style[i]['fontSize'];
      }
    }
  } else {
    // FontFamily
    if (
      props.style['fontWeight'] === 'bold' ||
      props.style['fontWeight'] >= 700
    ) {
      fontFamily = 'DOUZONEText50';
      // fontFamily = Font.isLoaded('DOUZONEText50')
      //   ? 'DOUZONEText50'
      //   : 'DOUZONEText30';
    } else if (
      props.style['fontWeight'] === 'lighter' ||
      props.style['fontWeight'] <= 200
    ) {
      fontFamily = 'DOUZONEText10';
      // fontFamily = Font.isLoaded('DOUZONEText10')
      //   ? 'DOUZONEText10'
      //   : 'DOUZONEText30';
    }
    // FontSize
    if (props.style['fontSize']) {
      fontSize = props.style['fontSize'];
    }
  }

  return (
    <ReactTextInput
      ref={props.customRef}
      {...props}
      style={[props.style, { fontFamily, fontSize: fontSize * RATIO }]}
    />
  );
}
TextInput.defaultProps = {
  customRef: null,
  style: {}
};

export default { Text, TextInput };
