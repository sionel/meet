import { MeetParamList } from '@navigations/RootNavigation';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { MutableRefObject } from 'react';
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

export interface TopPopupContainerProps {}
export interface TopPopupPresenterProps {}

export interface TopContentContainerProps {}
export interface TopContentPresenterProps {
  UserListClick: () => void;
  ChattingClick: () => void;
  ReverseCamaraClick: () => void;
  DisplayInvertClick: () => void;
  MoreClick: () => void;
}

export interface MainVideoContainerProps {}
export interface MainVideoPresenterProps {}

export interface SplitVideoContainerProps {}
export interface SplitVideoPresenterProps {}

export interface BottomPopupContainerProps {
  handleSpeaker: () => void;
}
export interface BottomPopupPresenterProps
  extends MenuListProps,
    ChattingProps,
    ParticipantsProps {}

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
  insets: EdgeInsets;
}

export interface ChattingProps {
  onPressSend: () => void;
  myMessage: string;
  insets: EdgeInsets;
}
export interface ParticipantsProps {
  ToggleSpeakerClick: () => void;
  onPressProfile: () => void;
  onPressMaster: () => void;
  onPressKick: () => void;
  onPressInvite: () => void;
  isRoomMaster: boolean;
  swipeRef: MutableRefObject<any>;
  insets: EdgeInsets;
}
