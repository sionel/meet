import { MeetParamList } from '@navigations/RootNavigation';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { ParticipantsTypes } from '@redux/participants';
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
}

export interface TopPopupContainerProps {
  insets: EdgeInsets;
}
export interface TopPopupPresenterProps
  extends RequestMessagesProps,
    ToastMessageProps {}

export interface RequestMessagesProps {
  userList: any[];
  insets: EdgeInsets;
}
export interface ToastMessageProps {
  insets: EdgeInsets;
  message: string | undefined;
  fadeAnimation: Animated.Value;
}

export interface TopContentContainerProps {
  insets: EdgeInsets;
}
export interface TopContentPresenterProps {
  insets: EdgeInsets;
  isMaster: boolean;
  UserListClick: () => void;
  ChattingClick: () => void;
  ReverseCamaraClick: () => void;
  DisplayInvertClick: () => void;
  MoreClick: () => void;
}

export interface MainVideoContainerProps {
  insets: EdgeInsets;
}
export interface MainVideoPresenterProps {
  insets: EdgeInsets;
  isScreenShare: boolean;
  isMuteVideo: boolean;
  presenter: any;
  character: string;
  stream: any;
  onPressShareStop: () => void;
}

export interface SplitVideoContainerProps {}
export interface SplitVideoPresenterProps {}

export interface BottomPopupContainerProps {
  insets: EdgeInsets;
  roomId: string;
  handleSpeaker: () => void;
}
export interface BottomPopupPresenterProps
  extends MenuListProps,
    ChattingProps,
    ParticipantsProps {
  insets: EdgeInsets;
  getUserName: (uesr: ParticipantsTypes) => string;
}

export interface BottomContentContainerProps {
  insets: EdgeInsets;
  handleCloseConf: () => void;
}
export interface BottomContentPresenterProps {
  insets: EdgeInsets;
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
  insets: EdgeInsets;
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
  insets: EdgeInsets;
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
  insets: EdgeInsets;
}

export interface ProfileProps {
  user: any;
}

export interface InviteListProps {
  insets: EdgeInsets;
  onClickEmail: () => void;
  onClickSms: () => void;
  onClickShare: () => void;
  onClickLink: () => void;
  onClickCode: () => void;
}
