/**
 * HomeScreenContainer
 * 화상대화 히스토리 컨테이너
 */

import React from "react";
import HomeScreenPresenter from "./HomeScreenPresenter";

class HomeScreenContainer extends React.Component {
    /**
     * STATE
     */
    state = {
        list : [
            {
                key: 'item1',
                active: true,
                title: 'UI/UX', 
                count: 5,
            }, 
            {
                key: 'item2',
                active: false,
                title: '플랫폼기획부', 
                count: 5,
            }, 
            {
                key: 'item3',
                active: false,
                title: 'DBP본부', 
                count: 5,
            }, 
            {
                key: 'item4',
                active: true,
                title: '도우존', 
                count: 5,
            }, 
            {
                key: 'item5',
                active: false,
                title: '더존', 
                count: 5,
            }, 
        ]
    }

    // #region
    /**
     * Rendering
     */
    render(){
        const { navigation } = this.props;
        const { list } = this.state;

        return (
            <HomeScreenPresenter 
                navigation={navigation}
                onRedirect={this.handleRedirect}
                list={list}
            />
        )
    }
    // #endregion

    /**
     * handleRedirect
     * 페이지 이동
     */
    handleRedirect = url => {
        const { navigation } = this.props;
        navigation.navigate(url)
    }
}

export default HomeScreenContainer;
