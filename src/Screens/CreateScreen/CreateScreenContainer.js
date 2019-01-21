/**
 * CreateScreenContainer
 * 화상대화 진입화면 컨테이너
 */

import React from "react";
import CreateScreenPresenter from "./CreateScreenPresenter";

class CreateScreenContainer extends React.Component {
    /**
     * STATE
     */
    state = {
    }

    //#region
    /**
     * Rendering
     */
    render(){
        return (
            <CreateScreenPresenter 
                onRedirect={this.handleRedirect}
            />
        )
    }
    //#endregion

    /**
     * handleRedirect
     * 페이지 이동
     */
    handleRedirect = url => {
        const { navigation } = this.props;
        navigation.navigate(url)
    }

}

export default CreateScreenContainer;
