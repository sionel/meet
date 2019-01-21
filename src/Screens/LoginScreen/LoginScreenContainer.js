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
        userId: '',
        userPwd: '',
    }

    /**
     * Rendering
     */
    render(){
        const { navigation } = this.props;
        const { 
            list,
            userId,
            userPwd
        } = this.state;

        return (

            <LoginScreenPresenter 
                onRedirect={this._handleRedirect}
                onChangeValue={this._handleChangeValue}

                navigation={navigation}
                userPwd={userPwd}
                userId={userId}
                list={list}
            />

        )
    }// render

    /**
     * _handleChangeValue
     * 페이지 이동
     */
    _handleChangeValue = (target, value) => {
        this.setState({ [target] : value })
    }

    /**
     * _handleRedirect
     * 페이지 이동
     */
    _handleRedirect = url => {
        const { navigation } = this.props;
        navigation.navigate(url)
    }

    /**
     * _handleLogin
     * 로그인함수
     */
    _handleLogin = () => {
        const { userId, userPwd } = this.state;

    }

}

export default LoginScreenContainer;
