import { MeetParamList } from '@navigations/RootNavigation';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { ParticipantsTypes } from '@redux/participants';
import { Participant } from '@redux/participants_copy';
import { MutableRefObject } from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';

type ConferenceScreenNavigationProps = StackNavigationProp<
  MeetParamList,
  'ConferenceView_new'
>;

export interface ConferenceScreenContainerProps
  extends StackScreenProps<MeetParamList, 'ConferenceView_new'> {}
export interface ConferenceScreenPresenterProps {
  isConnected: boolean;
  handleClose: () => void;
  handleSpeaker: () => void;
  participants: Participant[];
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

export interface TopContentContainerProps {}
export interface TopContentPresenterProps {
  isMaster: boolean;
  UserListClick: () => void;
  ChattingClick: () => void;
  ReverseCamaraClick: () => void;
  DisplayInvertClick: () => void;
  MoreClick: () => void;
}

export interface MainVideoContainerProps {
  mainUser: Participant;
}
export interface MainVideoPresenterProps {
  isScreenShare: boolean;
  isMuteVideo: boolean;
  presenter: any;
  character: string;
  stream: any;
  videoType: string;
  mainUser: Participant;
  onPressShareStop: () => void;
}

export interface SplitVideoContainerProps {}
export interface SplitVideoPresenterProps {}

export interface BottomPopupContainerProps {
  roomId: string;
  handleSpeaker: () => void;
}
export interface BottomPopupPresenterProps
  extends MenuListProps,
    ChattingProps,
    ParticipantsProps {
  getUserName: (uesr: ParticipantsTypes) => string;
}

export interface BottomContentContainerProps {
  handleCloseConf: () => void;
}
export interface BottomContentPresenterProps {
  ToggleSpeakerClick: () => void;
  ToggleMikeClick: () => void;
  ToggleVideoClick: () => void;
  EndCallClick: () => void;
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
  getUserName: (uesr: ParticipantsTypes) => string;
  scrollRef: MutableRefObject<any>;
  myMessage: string;
  cdm: boolean;
  messages: any[];
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
}

export interface ProfileProps {
  user: any;
}

export interface InviteListProps {
  onClickEmail: () => void;
  onClickSms: () => void;
  onClickShare: () => void;
  onClickLink: () => void;
  onClickCode: () => void;
}
