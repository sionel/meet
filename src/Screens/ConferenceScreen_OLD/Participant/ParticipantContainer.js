/**
 * ParticipantContainer
 * 참가자컴포넌트 컨테이너
 */

import React from 'react';
import ParticipantPresenter from './ParticipantPresenter';

class ParticipantContainer extends React.Component {
    /**
     * STATE
     */
    state = {  }

    /**
     * Render
     */
    render() { 
        return (  
            <ParticipantPresenter 
                participant={this.props.data}
            />
        );
    }
}

 
export default ParticipantContainer;
