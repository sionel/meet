import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Platform,
  TouchableHighlight
} from 'react-native';
import RNRestart from 'react-native-restart';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/configureStore';
import { actionCreators as selectCompanyAction } from '@redux/selectCompany';
import { actionCreators as userAction, authInfo, companyParamInfo } from '@redux/user';
import { getT } from '@utils/translateManager';
import { companyInfo } from '@services/api/types';
const { OS } = Platform;
const { width, height } = Dimensions.get('window');

const icCheckB = require('@assets/icons/ic_check_b.png');

//다국어
export default function CompanyChange() {
  const [prevAuth, setPrevAuth] = useState<any>(null);
  const { isHorizon, auth, contentList } = useSelector((state: RootState) => {
    const {
      user: { auth },
      orientation: { isHorizon }
    } = state;

    const contentList = auth?.employee_list.map((company: companyInfo) => ({
      name: company.company_name_kr,
      onClick: () => {
        String(company.company_no) !== String(auth.cno)
          ? changeCompanyRequest(auth, {
              company_no: company.company_no,
              company_code: company.company_code
            })
          : _closeCompany();
      },
      icon2: String(company.company_no) === String(auth.cno) ? icCheckB : null
    }));

    return {
      isHorizon,
      auth,
      contentList
    };
  });

  const t = getT();

  const dispatch = useDispatch();
  const _closeCompany = () => {
    dispatch(selectCompanyAction.closeCompany());
  };
  const changeCompanyRequest = (auth: authInfo, company: companyParamInfo) =>
    dispatch(userAction.changeCompanyRequest(auth, company));

  useEffect(() => {
    if (prevAuth === null) {
      setPrevAuth(auth);
    } else if (prevAuth.cno !== auth.cno) {
      RNRestart.Restart();
    }
  }, [auth]);

  return isHorizon ? (
    <View
      style={{
        position: 'absolute',
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2
      }}
    >
      <TouchableOpacity
        onPress={_closeCompany}
        style={{
          position: 'absolute',
          width,
          height,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}
        activeOpacity={1}
      />
      <View
        style={{
          width: '30%',
          backgroundColor: '#fff',
          zIndex: 3,
          borderRadius: 30
        }}
      >
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            borderBottomWidth: 2,
            borderBottomColor: '#d1d1d1'
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'DOUZONEText50'
            }}
          >
            {t('renewal.company_change')}
          </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={contentList}
          renderItem={data => {
            const { item } = data;
            return (
              <TouchableOpacity
                style={{
                  marginHorizontal: 20,
                  marginVertical: 10,
                  flexDirection: 'row',
                  height: 40,
                  alignItems: 'center'
                }}
                activeOpacity={0.3}
                onPress={item.onClick}
              >
                {item.icon1 && (
                  <Image
                    source={item.icon1}
                    resizeMode={'contain'}
                    style={{ height: '80%', marginRight: 10 }}
                  />
                )}
                <Text
                  style={{
                    fontSize: 18,
                    flex: 1,
                    fontFamily: 'DOUZONEText30'
                  }}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {item.icon2 && (
                  <Image
                    source={item.icon2}
                    resizeMode={'contain'}
                    style={{ height: '80%' }}
                  />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  ) : (
    <View
      style={styles.companyOuterView}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={_closeCompany}
      />

      <View style={styles.companyContainer}>
        <View style={styles.companyTitle}>
          <Text style={styles.companyTitleText}>
            {t('renewal.company_select')}
          </Text>
        </View>
        <FlatList
          keyExtractor={(item, index) => index.toString()}
          data={contentList}
          renderItem={data => {
            const { item } = data;
            return (
              <TouchableHighlight
                style={styles.companyRow}
                onPress={item.onClick}
                underlayColor={'rgba(0,0,0,0.05)'}
              >
                <View style={styles.rowInner}>
                  <Text style={styles.companyText} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {item.icon2 && (
                    <Image
                      source={item.icon2}
                      resizeMode={'contain'}
                      style={styles.companyCheck}
                    />
                  )}
                </View>
              </TouchableHighlight>
            );
          }}
        />
        {OS === 'ios' && <View style={styles.iosBottomPadding} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  companyOuterView: {
    position: 'absolute',
    width: width,
    height: height,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2
  },
  companyContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 600,
    zIndex: 3
  },
  companyTitle: {
    marginTop: 16,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#e6e6e6'
  },
  companyTitleText: {
    fontSize: 18,
    fontFamily: 'DOUZONEText50',
    color: '#000',
    letterSpacing: -0.36
  },
  companyRow: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    paddingHorizontal: 20,
  },
  companyText: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'DOUZONEText30',
    color: '#333',
    letterSpacing: -0.3,
    lineHeight: 20
  },
  companyCheck: {
    width: 24,
    height: 24
  },
  iosBottomPadding: {
    height: 24
  }
});
