import * as React from 'react';
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';

import { Text } from '../StyledText';
import CustomIcon from '../CustomIcon';
import CustomListModal from '../CustomListModal';

import {
  // wehago
  wehagoMainURL,
  wehagoDummyImageURL
} from '@utils';

export default function DrawerPresenter(props) {
  const {
    navigation,
    user,
    serviceDeploy,
    logoComponent,
    subActions,
    selectedCompany,
    companyChange,
    statusBarHeight,
    setCompanyChange,
    onTouchSetting,
    onShowProfile,
    onChangeCompany
  } = props;

  // state
  const [companyXY, setCompanyXY] = React.useState([0, 0]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: statusBarHeight
      }}
    >
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* header */}
        <View style={styles.header}>
          {logoComponent}

          <View style={{ flexDirection: 'row' }}>
            {subActions}
            <TouchableOpacity onPress={onTouchSetting}>
              <CustomIcon
                name={'btnDrawSettingNone'}
                size={24}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={navigation.closeDrawer}>
              <CustomIcon
                name={'btnDrawCloseNone'}
                size={24}
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* profile */}
        <TouchableOpacity
          style={styles.profile}
          activeOpacity={1}
          onPress={onShowProfile}
        >
          <View style={styles.profile_img}>
            <Image
              source={{
                uri: user.profile_url
                  ? wehagoMainURL + user.profile_url
                  : wehagoDummyImageURL
              }}
              resizeMode={'cover'}
              style={styles.profile_img_detail}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15 }}>
              {user.user_name}&nbsp;{selectedCompany.rank_name}
            </Text>
            <Text style={{ fontSize: 10, color: '#828282', marginTop: 7 }}>
              {serviceDeploy.mail === 'T'
                ? user.user_default_email
                : user.user_email}
            </Text>
          </View>
        </TouchableOpacity>
        {/* company */}
        {/* {true && (
          <View
            style={styles.company}
            onLayout={event =>
              setCompanyXY([
                event.nativeEvent.layout.y,
                event.nativeEvent.layout.height
              ])
            }
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginRight: 15
              }}
            >
              <CustomIcon
                name={'ico_space'}
                size={18}
                style={{ marginRight: 4 }}
              />
              <Text>{'Space'}</Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                flex: 1
              }}
              onPress={() => setCompanyChange(true)}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode={'tail'}
                style={{ flex: 1, marginRight: 4, textAlign: 'right' }}
              >
                {123123}
              </Text>
              <CustomIcon name={'btnExpandSmallNone'} size={12} />
            </TouchableOpacity>
          </View>
        )} */}

        {companyChange && (
          <CustomListModal
            visible={companyChange}
            list={
              user.employee_list &&
              user.employee_list.map(emp => ({
                key: String(emp.company_no),
                title: emp.company_name_kr,
                action: async () => {
                  if (
                    String(emp.company_no) ===
                    String(selectedCompany.company_no)
                  ) {
                    setCompanyChange(false);
                  } else {
                    onChangeCompany(emp.company_no, emp.company_code);
                  }
                }
              }))
            }
            backgroundColor={'transeparent'}
            underlayColor={'#fff'} // Option
            selectedColor={'#1C90FB'} // Option
            width={'60%'}
            maxHeight={200}
            top={companyXY[0] + companyXY[1] - 10}
            modalStyle={{
              borderRadius: 4,
              ...Platform.select({
                ios: {
                  shadowColor: '#00000090',
                  shadowOffset: { width: 1, height: 1 },
                  shadowOpacity: 0.4,
                  shadowRadius: 3
                },
                android: {
                  elevation: 5
                }
              })
            }}
            onClose={() => setCompanyChange(false)}
          />
        )}
        <View style={styles.children}>{props.children}</View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    borderTopWidth: 4,
    borderTopColor: '#1C90FB',
    borderBottomWidth: 1,
    borderBottomColor: '#f6f7f8',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  profile: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 24,
    paddingRight: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f6f7f8',
    flexDirection: 'row',
    alignItems: 'center'
  },
  profile_img: {
    width: 40,
    height: 40,
    backgroundColor: '#ccc',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12
  },
  profile_img_detail: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  company: {
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 24,
    paddingRight: 24,
    borderBottomWidth: 8,
    borderBottomColor: '#f6f7f8',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  children: {
    flex: 1,
    borderBottomWidth: 8,
    borderBottomColor: '#f6f7f8'
  },
  approvalItem: {
    height: 48,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24
    // borderBottomWidth: 1,
    // borderBottomColor: '#f6f7f8'
  },
  service: {
    height: 50
  },
  addon: { height: 50, backgroundColor: '#1C90FB40' },
  notice: { flexDirection: 'row' },
  noticeItem: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: '#f6f7f8',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
