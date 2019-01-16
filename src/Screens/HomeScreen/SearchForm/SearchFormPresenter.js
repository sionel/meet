/**
 * SearchFormPresenter
 * 검색바 프레젠터
 */

import React from 'react';
import { 
    StyleSheet,
    View, 
    TextInput,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const SearchFormPresenter = (props) => {
    const { active, value } = props;
    return (  
        <View style={{...styles.wrap}}>
            <Icon 
                name="search" 
                size={20} 
                color="#c8c8c8" 
                style={{...styles.searchIcon}} 
            />
            <TextInput
                placeholder="Search..."
                style={{...styles.input}}
                onChangeText={newText => props.onChange(newText)}
                value={value}
            />
            {active && (
                <TouchableOpacity onPress={()=>props.onChange('')} style={{...styles.closeIcon}}>
                <Icon 
                    name="times-circle" 
                    size={20} 
                    color="#c8c8c8"
                />
                </TouchableOpacity>
            )}
        </View>
    );
}

/**
 * Styles
 */
const styles = StyleSheet.create({
    wrap: {
        position: 'relative',
        width:'100%',
        backgroundColor: '#f1f1f1',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderColor: '#D2D2D2'
    },

    searchIcon: {
        position: 'absolute',
        left: 22,
        top: 15,
        zIndex:10,
    },

    closeIcon: {
        position: 'absolute',
        right: 20,
        top: 17,
        zIndex:10,
    },

    input: {
        height: 37, 
        borderColor: '#d2d2d2', 
        borderWidth: 1,
        backgroundColor: '#fff',
        paddingLeft: 38,
        paddingRight: 10,
        borderRadius: 5.5,
        zIndex:9,
    },
})

export default SearchFormPresenter;
