import React, { useEffect, useRef, useState } from 'react';
import ChattingPresenter from './ChattingPresenter';
import ConferenceManager from '@utils/conference/ConferenceManager';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/configureStore';
import { Keyboard } from 'react-native';

const ChattingContainer = () => {
  const [myMessage, setMyMessage] = useState('');
  const [cdm, setCdm] = useState(false);
  const [isEndScroll, setIsEndScroll] = useState(true);
  const [keyboardShow, setKeyboardShow] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const scrollRef: any = useRef();

  const { messages, user } = useSelector((state: RootState) => {
    const { local } = state;
    return {
      messages: local.message,
      user: local.user
    };
  });

  let conferenceManager = new ConferenceManager();

  useEffect(() => {
    let timeout: number | NodeJS.Timeout = setTimeout(() => {});

    if (
      (messages.length > 0 &&
        messages[messages.length - 1].user === user.cid) ||
      messages.length === 0
    ) {
      if (scrollRef && scrollRef.scrollToEnd) {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
          scrollRef.scrollToEnd();
        }, 0);
      }
    } else if (isEndScroll) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        scrollRef.scrollToEnd();
      }, 0);
    }
    return () => {
      typeof timeout === 'number' && clearTimeout(timeout);
    };
  }, [messages, cdm]);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', (e) => handdleKeyboardShow(e));
    Keyboard.addListener('keyboardDidHide', (e) => handdleKeyboardHide(e));

    return () => {
      Keyboard.removeListener('keyboardDidShow', (e) => handdleKeyboardShow(e));
      Keyboard.removeListener('keyboardDidHide', (e) => handdleKeyboardHide(e));
    };
  }, []);

  const handdleKeyboardShow = (e: any) => {
    setKeyboardHeight(e.endCoordinates.height);
    setKeyboardShow(true);
  }

  const handdleKeyboardHide = (e: any) => {
    setKeyboardHeight(0);
    setKeyboardShow(false)
  }

  const _handleSendTextMessage = () => {
    if (myMessage && myMessage.slice().replace(/(\s*)/g, '') !== '') {
      setMyMessage('');
      conferenceManager.sendTextMessage(myMessage);
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
      keyboardShow={keyboardShow}
      keyboardHeight={keyboardHeight}
    />
  );
};

export default ChattingContainer;
