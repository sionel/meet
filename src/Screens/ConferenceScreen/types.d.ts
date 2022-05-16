import { MeetParamList } from '@navigations/RootNavigation';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { messageType } from '@redux/conference';
import { requestUser } from '@redux/master';
import { Participant } from '@redux/participants_copy';
import i18next from 'i18next';
import React, { MutableRefObject } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { OrientationType } from 'react-native-orientation-locker';
import Conference from './conferenceUtil/Conference';

type ConferenceScreenNavigationProps = StackNavigationProp<
  MeetParamList,
  'ConferenceView_new'
>;

export interface ConferenceScreenContainerProps
  extends StackScreenProps<MeetParamList, 'ConferenceView_new'> {}
export interface ConferenceScreenPresenterProps {
  roomName: string;
  id: string;
  roomToken: string;
  isConnected: boolean;
  isChatting: boolean;
  handleClose: (isKick: boolean) => void;
}

export interface TopPopupContainerProps {}
export interface TopPopupPresenterProps
  extends RequestMessagesProps,
    ToastMessageProps {
      isMaster: boolean | undefined;
    }

export interface RequestMessagesProps {
  requestUserList: any[];
}

export interface MessagesCardProps {
  requestUser: requestUser;
  replyUserRequest: (requestUser: requestUser, reply: boolean) => void;
  t: any;
}
export interface ToastMessageProps {
  message: string | undefined;
  fadeAnimation: Animated.Value;
}

export interface TopContentContainerProps {
  roomName: string;
  id: string;
  handleClose: (isKick: boolean) => void;
}
export interface TopContentPresenterProps {
  onPressUserList: () => void;
  onPressChatting: () => void;
  onPressCamaraReverse: () => void;
  onPressDisplayInvert: () => void;
  onPressMore: () => void;
  displayType: 'FUNCTION' | 'NAME';
  roomName: string;
  time: string;
  messageCount: number;
  isScreenShare: boolean;
}

export interface MainContainerProps {
  roomName: string;
  onClose: (isKick: boolean) => void;
}
export interface MainPresenterProps
  extends CharacterProps,
    RtcViewProps,
    DocumentShareContainerProps,
    SketchProps,
    ScreenShareProps {
  displayType: 'track' | 'sketch' | 'document' | 'screen' | 'character';
  videoType: string;
  onPressShareStop: () => void;
}

export interface CharacterProps {
  avatar?: string;
  isMaster: boolean;
  userName: string;
  onPressMainView: () => void;
}

export interface RtcViewProps {
  videoType: string;
  streamURL: string;
  isMaster: boolean;
  userName: string;
  mirrorMode: boolean;
  onPressMainView: () => void;
}
export interface DocumentShareContainerProps {
  onClose: (isKick: boolean) => void;
}
export interface DocumentSharePresenterProps extends ShareHeader {
  fileName: string;
  imageSize: any[];
  orientation: string;
  presenter: string;
  viewSize: { viewWidth: number; viewHeight: number };
  setViewSize: any;
  setShowTool: any;
  handleDrawingData: (data: any, page: number) => void;
}
export interface SketchProps {
  roomName: string;
  onClose: (isKick: boolean) => void;
}
export interface ScreenShareProps {
  onPressShareStop: () => void;
}
export interface SplitVideoContainerProps {}
export interface SplitVideoPresenterProps {}

export interface BottomPopupContainerProps {
  roomId: string;
  roomToken: string;
}
export interface BottomPopupPresenterProps
  extends MenuListProps,
    ChattingProps,
    ParticipantsProps {
  bottomDisplayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'FILELIST' | 'NONE';
}

export interface BottomContentContainerProps {
  handleCloseConf: (isKick: boolean) => void;
}
export interface BottomContentPresenterProps {
  onPressSpeaker: () => void;
  onPressMike: () => void;
  onPressVideo: () => void;
  onPressEndCall: (isKick: boolean) => void;
  // userInfo: any;
  isVideoOn: boolean;
  isMikeOn: boolean;
  isSpeakerOn: boolean;
  mode: 'track' | 'sketch' | 'document' | 'screen' | 'character';
}

export interface FileListContainerProps {}
export interface FileListPresenterProps {
  isLoading: string;
  documentList: any[];
  TokenID: string;
  onRefreshList: () => void;
  setLoading: React.Dispatch<React.SetStateAction<string>>;
  setWedriveList: React.Dispatch<React.SetStateAction<any>>;
  t: any;
}

export interface MenuListProps {
  onPressSketch: () => void;
  onPressDocumentShare: () => void;
  onPressScreenShare: () => void;
  onPressRequestMic: () => void;
  isMaster: boolean;
  isMicControl: boolean;
}

export interface ChattingProps {
  onPressSend: () => void;
  setMyMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsEndScroll: Function;
  setCdm: React.Dispatch<React.SetStateAction<boolean>>;
  scrollRef: MutableRefObject<any>;
  myMessage: string;
  cdm: boolean;
  messages: messageType[];
  myJitsiId: string;
}

export interface ChattingCardProps {
  isLocalUser: boolean;
  profileUrl: string;
  userName: string;
  text: string;
}
export interface ParticipantsProps extends InviteListProps {
  setIsProfile: any;
  onPressProfile: (user: any) => void;
  onPressMaster: (wehagoID: string) => void;
  onPressKick: (kickJitsiID: string, kickUserName: string) => void;
  onPressMike: (jitsiID: string, isMute: boolean) => void;
  onPressInvite: () => void;
  userInfo: any;
  isRoomMaster: boolean;
  isProfile: boolean;
  isInviteList: boolean;
  swipeRef: MutableRefObject<any>;
  participants: Participant[];
  roomId: string;
}

export interface ParticipantCardPros {
  participants: Participant[];
  swipeRef: MutableRefObject<any>;
  isRoomMaster: boolean;
  isPad: boolean;
  onPressProfile: (user: any) => void;
  onPressMaster: (wehagoID: string) => void;
  onPressKick: (kickJitsiID: string, kickUserName: string) => void;
  onPressMike: (jitsiID: string, isMute: boolean) => void;
}

export interface ProfileProps {
  user: any;
}

export interface ShareHeader {
  showTool: boolean;
  isMikeOn: boolean;
  fileName: string;
  resources: any;
  scrollRef: any;
  showPreView: boolean;
  imgList: any[];
  page: number;
  onPressExit: () => void;
  onPressMike: () => void;
  onPressImageList: (pressPage: number) => void;
  onPressArrow: () => void;
}

export interface InviteListProps {
  onPressEmail: () => void;
  onPressSms: () => void;
  onPressShare: () => void;
  onPressLink: () => void;
  onPressCode: () => void;
}

export interface FileCardContainerProps {
  file: any;
  TokenID: string;
  setLoading: React.Dispatch<React.SetStateAction<string>>;
  setWedriveList: React.Dispatch<React.SetStateAction<any>>;
}

export interface FileCardPresenterProps {
  file: any;
  onPressFile: (file: any) => void;
  ExtentionType: (fileName: any) => any;
  ConvertFileSize: (byte: any) => string;
}
