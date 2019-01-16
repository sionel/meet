/**
 * ConferenceScreenContainer
 * 화상대화 진입화면 컨테이너
 */

import React from "react";
import ConferenceScreenPresenter from "./ConferenceScreenPresenter";

class ConferenceScreenContainer extends React.Component {
    /**
     * STATE
     */
    state = {
        // 내 앱 상태
        conferenceStatus: {
            sound: true,
            camera: true,
            mic: true,
            cameraReverse: false,
            talk: false
        },
        activeTouch: false,
        selected: 0,
        participant: [
            {
                id: 0,
                name: '나',
                conferenceStatus: {
                    sound: true,
                    camera: true,
                    mic: true,
                    cameraReverse: false,
                    talk: false
                },
                img: 'https://i.dailymail.co.uk/i/pix/2017/04/20/13/3F6B966D00000578-4428630-image-m-80_1492690622006.jpg'
            },
            {
                id: 1,
                name: '박날두',
                conferenceStatus: {
                    mic: false,
                    camera: false
                },
                img: 'https://i.dailymail.co.uk/i/pix/2016/05/23/22/348B850600000578-3605456-image-m-32_1464040491071.jpg'
            },
            {
                id: 2,
                name: '홍루이스',
                conferenceStatus: {
                    mic: false,
                    camera: true
                },
                img: 'http://cfile206.uf.daum.net/image/227D0A3E57C6105A1E37E2'
            },
            {
                id: 3,
                name: '김크로스',
                conferenceStatus: {
                    mic: true,
                    camera: true
                },
                img: 'http://upload.inven.co.kr/upload/2014/07/29/bbs/i1752949248.jpg'
            },
            {
                id: 4,
                name: '정다이크',
                conferenceStatus: {
                    mic: true,
                    camera: false
                },
                img: 'http://mblogthumb2.phinf.naver.net/MjAxODAxMDFfMTgg/MDAxNTE0Nzk5Mjc5Njk2.Y-z0Uhp0ikSp76xDuh8wpjRQDfd3G_C3hnrmASJDq2Qg.1HELplr6n_AW5eJ5miCLdAjnylY4DzvgLgRTRF_ERo4g.JPEG.htpjk/DScfs26XUAAoCr6.jpg?type=w2'
            },
        ],
    }

    //#region
    /**
     * Rendering
     */
    render(){
        const { navigation } = this.props;
        const { 
            list, 
            activeTouch, 
            participant, 
            selected,
            conferenceStatus
        } = this.state;

        return (
            <ConferenceScreenPresenter 
                list={list}
                selected={selected}
                navigation={navigation}
                activeTouch={activeTouch}
                participant={participant}
                conferenceStatus={conferenceStatus}

                onRedirect={this.handleRedirect}
                onScreenTouch={this._handleScreenTouch}
                onToggleStatus={this._handleToggleStatus}
                onSelectPerson={this._handleSelectPerson}
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

    /**
     * _handleScreenTouch
     */
    _handleScreenTouch = () => {
        this.setState(prev=>({
            activeTouch: !prev.activeTouch
        }))
    }

    /**
     * _handleCustomPress
     * 상태전환 이벤트 [카메라, 마이크, 스피커, 좌우반전, 채팅창]
     */
    _handleToggleStatus = statusName => {
        let participant = this.state.participant.slice(0);
        participant[0]['conferenceStatus'][statusName] = !participant[0]['conferenceStatus'][statusName]

        this.setState(prev => ({
            participant,
            conferenceStatus: {
                ...prev.conferenceStatus,
                [statusName] : !prev.conferenceStatus[statusName]
            }
        }))
    }

    /**
     * _handleSelectPerson
     */
    _handleSelectPerson = selected => {
        this.setState({ selected })
    }
}

export default ConferenceScreenContainer;
