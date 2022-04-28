import { MeetParamList } from '@navigations/RootNavigation';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { messageType } from '@redux/conference';
import { Participant } from '@redux/participants_copy';
import { MutableRefObject } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';

type ConferenceScreenNavigationProps = StackNavigationProp<
  MeetParamList,
  'ConferenceView_new'
>;

export interface ConferenceScreenContainerProps
  extends StackScreenProps<MeetParamList, 'ConferenceView_new'> {}
export interface ConferenceScreenPresenterProps {
  roomName: string;
  id: string;
  isConnected: boolean;
  isChatting: boolean;
  handleClose: () => void;
}

export interface TopPopupContainerProps {}
export interface TopPopupPresenterProps
  extends RequestMessagesProps,
    ToastMessageProps {}

export interface RequestMessagesProps {
  userList: any[];
}
export interface ToastMessageProps {
  message: string | undefined;
  fadeAnimation: Animated.Value;
}

export interface TopContentContainerProps {
  roomName: string;
  id: string;
  handleClose: () => void;
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
}
export interface MainPresenterProps
  extends CharacterProps,
    RtcViewProps,
    DocumentShareProps,
    SketchProps,
    ScreenShareProps {
  // isScreenShare: boolean;
  // isMuteVideo: boolean;
  // presenter: any;
  // isStream: boolean;
  displayType: 'track' | 'sketch' | 'document' | 'screen' | 'character';
  videoType: string;
  onPressShareStop: () => void;
  onPressExit: () => void;
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
export interface DocumentShareProps {
  isMikeOn: boolean;
  roomName: string;
  onPressExit: () => void;
  onPressMike: () => void;
}
export interface SketchProps {
  isMikeOn: boolean;
  roomName: string;
  onPressExit: () => void;
  onPressMike: () => void;
}
export interface ScreenShareProps {
  onPressShareStop: () => void;
}
export interface SplitVideoContainerProps {}
export interface SplitVideoPresenterProps {}

export interface BottomPopupContainerProps {
  roomId: string;
}
export interface BottomPopupPresenterProps
  extends MenuListProps,
    ChattingProps,
    ParticipantsProps {
  bottomDisplayType: 'MENU' | 'CHATTING' | 'PARTICIPANTS' | 'NONE';
}

export interface BottomContentContainerProps {
  handleCloseConf: () => void;
}
export interface BottomContentPresenterProps {
  onPressSpeaker: () => void;
  onPressMike: () => void;
  onPressVideo: () => void;
  onPressEndCall: () => void;
  // userInfo: any;
  isVideoOn: boolean;
  isMikeOn: boolean;
  isSpeakerOn: boolean;
  mode: "track" | "sketch" | "document" | "screen" | "character";
}

export interface MenuListProps {
  onPressSketch: () => void;
  onPressDocumentShare: () => void;
  onPressScreenShare: () => void;
  onPressRequestMic: () => void;
  isMaster: Boolean;
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
  ToggleSpeakerClick: () => void;
  onPressProfile: (user: any) => void;
  onPressMaster: () => void;
  onPressKick: () => void;
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
  onPressMaster: () => void;
  onPressKick: () => void;
}

export interface ProfileProps {
  user: any;
}

export interface InviteListProps {
  onPressEmail: () => void;
  onPressSms: () => void;
  onPressShare: () => void;
  onPressLink: () => void;
  onPressCode: () => void;
}
