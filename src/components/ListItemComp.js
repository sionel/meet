/**
 * ListItemCopm
 * 화상대화 히스토리 항목
 */

import React from 'react';
import {
    View, 
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const ListItemComp = (props) => {
    // active가 true일 경우 활성화 색
    const activeColor = (props.active) ? '#1C90FB' : '#eaeaea';
    
    // render
    return (  
        <TouchableOpacity 
            style={{...styles.container}}
            onPress={props.onClick}
        >
            {/* 아이콘 */}
            <View style={{...styles.iconWrapper}}>
                <View style={{...styles.roomIcon, borderColor: activeColor}}>
                    {/* 아이콘 텍스트 */}
                    <Text style={{...styles.iconText, color: (props.active) ? '#1C90FB' : '#c1c1c1'}}>
                        {props.title[0]}
                    </Text>
                </View>
            </View>
            {/* 내용 */}
            <View style={{...styles.textFlex}}>
                {/* 방제목 */}
                <Text style={{...styles.roomName}}>
                    {props.title}
                </Text>
                {/* 참가자 */}
                <Text style={{...styles.participant}}>
                    호날두 외 {props.personnel} 명
                </Text>
                {/* 활성화 라이트 */}
                <View style={{...styles.activeLight, backgroundColor: activeColor}} />
            </View>
        </TouchableOpacity>
    );
}


/**
 * styles
 */
const styles = StyleSheet.create({
    // wrapper
    container: {
        width:"100%",
        height: 57,
        display: "flex",
        flexDirection:'row',
        marginBottom: 12,
    },
        // 아이콘 랩
        iconWrapper: {
            flex:0.2,
        },
        // 룸아이콘
        roomIcon: {
            flex:1,
            width: 57,
            height: 57,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            backgroundColor: '#eaeaea',
            borderWidth: 3,
        },
        // 아이콘 텍스트
        iconText: {
            fontSize: 22,
            fontWeight: 'bold',
        },
        // 방 제목 
        roomName: {
            fontSize: 16,
            fontWeight: '600',
            color: '#3c3c3c'
        },
        // 참가자 
        participant: {
            fontSize: 13.5,
            fontWeight: '400',
            color: '#3f3f3f'
        },
    
    textFlex: {
        flex:0.8,
        height:'100%',
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: "#ececec",
        justifyContent: "center",
        alignItems: "flex-start",
    },
        activeLight: {
            position: 'absolute',
            width: 12, 
            height: 12,
            right: 3,
            top: 20,
            borderRadius: 100,
        },
  });
 
export default ListItemComp;