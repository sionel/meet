/**
 * LoginScreenContainer
 * 
 * 로그인페이지 컨테이너
 */

import React from "react";
import LoginScreenPresenter from "./LoginScreenPresenter";

class LoginScreenContainer extends React.Component {
    /**
     * STATE
     */
    state = {
        list : [
            {
                key: 'item1',
                img: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                title: 'Title Text1', 
                count: 5,
                active: false
            }, 
            {
                key: 'item2',
                img: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                title: 'Title Text2', 
                count: 5,
                active: false
            }, 
            {
                key: 'item3',
                img: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                title: 'Title Text3', 
                count: 5,
                active: false
            }, 
            {
                key: 'item4',
                img: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                title: 'Title Text4', 
                count: 5,
                active: false
            }, 
            {
                key: 'item5',
                img: 'https://facebook.github.io/react-native/docs/assets/favicon.png',
                title: 'Title Text5', 
                count: 5,
                active: false
            }, 
        ]
    }

    /**
     * handleRedirect
     * 페이지 이동
     */
    handleRedirect = url => {
        const { navigation } = this.props;
        navigation.navigate(url)
    }

    /**
     * Rendering
     */
    render(){
        const { navigation } = this.props;
        const { list } = this.state;

        return (

            <LoginScreenPresenter 
                navigation={navigation}
                onRedirect={this.handleRedirect}

                list={list}
            />

        )
    }// render
}

export default LoginScreenContainer;
