/**
 * SubScreen01Container
 * 
 * Drawer테스트 화면
 */

import React from "react";
import SubScreen01Presenter from "./SubScreen01Presenter";
// RN 네비게이션


class SubScreen01Container extends React.Component {

    /**
     * handleRedirect
     * 페이지 이동
     */
    handleRedirect = url => {
        const { navigation } = this.props;
        // alert(url)
        navigation.navigate(url)
    }

    render(){
        const { navigation } = this.props;
        return (

            <SubScreen01Presenter 
                navigation={navigation}
                onRedirect={this.handleRedirect}
            />

        )
    }// render
}

export default SubScreen01Container;
