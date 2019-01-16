/**
 * ParticipantItemContainer
 * 참가자컴포넌트 컨테이너
 */

import React from 'react';
import ParticipantItemPresenter from './ParticipantItemItemPresenter';

class ParticipantItemContainer extends React.Component {
    /**
     * STATE
     */
    state = {  }

    /**
     * Render
     */
    render() { 
        return (  
            <ParticipantItemPresenter 
            />
        );
    }
}

 
export default ParticipantItemContainer;
