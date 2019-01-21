/**
 * Input
 * 커스텀 입력창
 */

import React from 'react';
import {
    View,
    Text,
    TextInput,
} from 'react-native'

const TextField = props => {
    const {
        // data
        width,
        height,
        marginTop,
        color,
        borderBottomWidth,
        borderBottomColor,
        value,
        placeholder,
        placeholderTextColor,
        // methods
        onChange
    } = props;
    return (  
        <TextInput 
            style={{
                width,
                height,
                marginTop,
                color,
                borderBottomWidth,
                borderBottomColor,
            }}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            value={value}
            onChangeText={onChange}
        />
    );
}

TextField.defaultProps = {
    width: '100%', 
    height: 40, 
    marginTop: 15, 
    color:'#8C8C8C', 
    borderBottomWidth: 1, 
    borderBottomColor: '#CACACA',
    value: '',
    placeholder: "내용을 입력하세요",
    placeholderTextColor: "#CACACA",
    onChange: () => alert('onChange'),
}
 
export default TextField;