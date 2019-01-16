/**
 * SearchFormContainer
 * 검색바 컨테이너
 */

import React from "react";
import SearchFormPresenter from "./SearchFormPresenter";

class SearchFormContainer extends React.Component {
    /**
     * STATE
     */
    state = {
        active: false, // 인풋 활성화 여부
        value: '', // 값
    }

    /**
     * Rendering
     */
    render(){
        const { active, value } = this.state;
        return (
            <SearchFormPresenter 
                active={active}
                value={value}
                onFocus={this._handleOnFocus}
                onChange={this._handleOnChange}
            />
        )
    }

    /**
     * _handleOnChange
     * 입력창 활성화 시 이벤트발생
     */
    _handleOnChange = value => {
        this.setState({ 
            value,
            active: (value) ? true : false
        })
    }
}

export default SearchFormContainer;
