import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import ChattingPresenter from './ChattingPresenter';
import ConferenceManager from '@utils/conference/ConferenceManager';
import { actionCreators as localAction } from '@redux/local';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { Keyboard, Platform } from 'react-native';

const ChattingContainer = () => {
  const [myMessage, setMyMessage] = useState('');
  const [cdm, setCdm] = useState(false);
  const [isEndScroll, setIsEndScroll] = useState(true);
  const [keyboardShow, setKeyboardShow] = useState(false);

  const scrollRef: MutableRefObject<any> = useRef();
  const { OS } = Platform;
  const { messages, user, isHorizon } = useSelector((state: RootState) => {
    const { local, orientation } = state;
    return {
      messages: local.message,
      user: local.user,
      isHorizon: orientation.isHorizon
    };
  });

  const dispatch = useDispatch();
  const initMessageCount = () => dispatch(localAction.initMessageCount());

  let conferenceManager = new ConferenceManager();

  useEffect(() => {
    let timeout: number | NodeJS.Timeout = setTimeout(() => {});

    if (messages.length > 0) {
      if (scrollRef) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          scrollRef.current.scrollToEnd();
        }, 0);
      }
    } else if (isEndScroll) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        scrollRef.current.scrollToEnd();
      }, 0);
    }

    return () => {
      typeof timeout === 'number' && clearTimeout(timeout);
    };
  }, [messages, cdm, keyboardShow]);

  useEffect(() => {
    initMessageCount();
  }, [messages.length]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', () => handdleKeyboardShow());
    Keyboard.addListener('keyboardDidHide', () => handdleKeyboardHide());

    return () => {
      Keyboard.removeListener('keyboardDidShow', () => handdleKeyboardShow());
      Keyboard.removeListener('keyboardDidHide', () => handdleKeyboardHide());
    };
  }, []);

  const handdleKeyboardShow = () => {
    setKeyboardShow(true);
  };

  const handdleKeyboardHide = () => {
    setKeyboardShow(false);
  };

  const _handleSendTextMessage = () => {
    if (myMessage && myMessage.slice().replace(/(\s*)/g, '') !== '') {
      setMyMessage('');
      OS === 'android' && myMessage.substring(0, 1) === ' '
        ? conferenceManager.sendTextMessage(myMessage.substring(2))
        : conferenceManager.sendTextMessage(myMessage);
    }
  };

  return (
    <ChattingPresenter
      onSendTextMessage={_handleSendTextMessage}
      scrollRef={scrollRef}
      setIsEndScroll={setIsEndScroll}
      cdm={cdm}
      setCdm={setCdm}
      myMessage={myMessage}
      setMyMessage={setMyMessage}
      user={user}
      messages={messages}
      isHorizon={isHorizon}
    />
  );
};

export default ChattingContainer;
