import React from 'react';
import { getT } from '../../utils/translateManager';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';

import checkbox_login_on from '../../../assets/icons/loginIcon/checkbox_login_on.png';

const SelectCompanyPresenter = (props: any) => {
  const { employee_list, selectedCompany, handleChangeCompany ,onLogout} = props;
  const t = getT();
  return (
    <View style={styles.container}>
      <View style={styles.companyList}>
        <View style={styles.title}>
          <Text style={styles.titleText}>
            {t('selectcompany_title_notpurchase')}
          </Text>
          <TouchableOpacity activeOpacity={0.5} onPress={onLogout}>
            <Text style={{ color: '#1C90FB' }}>
              {t('selectcompany_logout')}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.message}>{t('selectcompany_message')}</Text>

        <View style={styles.header}>
          <Text>{t('selectcompany_select')}</Text>
        </View>
        <View style={styles.listArea}>
          <FlatList
            data={employee_list}
            renderItem={({ item, index }) => (
              <TouchableHighlight
                underlayColor={'#e9f5ff'}
                disabled={selectedCompany.company_no === item.company_no}
                onPress={() => {
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
                    <Image
                      source={checkbox_login_on}
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                </>
              </TouchableHighlight>
            )}
            style={styles.flatList}
          />
        </View>
      </View>
    </View>
  );
};

export default SelectCompanyPresenter;

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
