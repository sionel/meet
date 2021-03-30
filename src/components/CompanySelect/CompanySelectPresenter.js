import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import CustomAlert from '../CustomAlert';
import CustomIcon from '../CustomIcon';

import { Text } from '../StyledText';
import { getT } from '../../utils/translateManager';

export default function CompanySelectPresenter(props) {
  const {
    isSP,
    employee_list,
    selectedCompany,
    handleChangeCompany,
    onLogout
  } = props;

  const [visible, setVisible] = useState(false);
  const t = getT();
  return (
    <View style={styles.container}>
      <View style={styles.companyList}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {isSP
              ? t('selectcompany.title.팩미구매')
              : t('selectcompany.title.미구매')}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setVisible(true)}
          >
            <Text style={{ color: '#1C90FB' }}>
              {t('selectcompany.logout')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{t('selectcompany.message')}</Text>

        <View style={styles.header}>
          <Text>{t('selectcompany.회사선택')}</Text>
        </View>
        <View style={styles.listArea}>
          <FlatList
            data={employee_list}
            renderItem={({ item, index }) => (
              <TouchableHighlight
                underlayColor={'#e9f5ff'}
                disabled={selectedCompany.company_no === item.company_no}
                onPress={() => {
                  // const company = {
                  //   company_no: item.company_no,
                  //   company_code: item.company_code
                  // };
                  handleChangeCompany(item.company_no);
                }}
                style={[
                  styles.touchArea,
                  {
                    borderBottomWidth:
                      employee_list.length - 1 === index ? 0 : 1
                  }
                ]}
              >
                <>
                  <Text style={styles.companyName}>{item.company_name_kr}</Text>
                  {selectedCompany.company_no === item.company_no && (
                    <CustomIcon name={'checkbox_login_on'} size={24} />
                  )}
                </>
              </TouchableHighlight>
            )}
            style={styles.flatList}
          />
        </View>
      </View>

      <CustomAlert
        visible={visible}
        width={320}
        title={t('alert.title.logout')}
        description={t('alert.text.로그아웃')}
        onClose={() => setVisible(false)}
        actions={[
          {
            name: t('alert.button.cancel'),
            action: () => setVisible(false)
          },
          {
            name: t('alert.button.confirm'),
            action: onLogout
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
  },
  companyList: {
    flex: 1,
    width: '80%',
    // height: '80%',
    maxWidth: 400,
    maxHeight: 500,
    borderWidth: 1,
    borderColor: '#1c000000',
    borderRadius: 5,
    backgroundColor: '#fff',
    padding: 10
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ebef'
  },
  titleText: {
    fontSize: 16
  },
  message: {
    fontSize: 11,
    marginBottom: 10
  },
  flatList: {
    borderWidth: 1,
    borderColor: '#e8ebef'
  },
  header: {
    backgroundColor: '#e8ebef',
    padding: 10
  },
  listArea: {
    flex: 1
  },
  touchArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e8ebef'
  },
  companyName: {
    fontSize: 14
  }
});