/**
 * MainPresenter
 * 최상위화면
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from "react-native";
import RootNavigation from '../RootNavigation';

const MainPresenter = props => {
    return (  
        <View style={styles.container}>
            <StatusBar hidden={false} />
            <RootNavigation />
        </View>
    );
}

/**
 * styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
});   
 
export default MainPresenter;