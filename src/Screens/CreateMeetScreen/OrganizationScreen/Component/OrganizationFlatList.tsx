import React from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import CustomCheckBoxPresenter from '../../../../components/renewal/CustomCheckBox';

const OrganizationFlatList = (props: any) => {
  const {
    data,
    i = 1,
    type = 'group',
    depth = 0,
    isParentSelected,
    selectedEmployee,
    openGroup,
    auth,
    setOpenGroup,
    organizationEmployee,
    getOrganizationEmployeeTree,
    selectEmployee
  } = props;

  return (
    <FlatList
      data={data}
      extraData={[openGroup]}
      keyExtractor={(item, index) => String(index)}
      renderItem={({ item, index }) => {
        // 조직원 선택여부
        const selected =
          selectedEmployee.member.findIndex(
            (i: any) => i.user_no === item.user_no
          ) !== -1
            ? true
            : false;
        const isEmployeeSelected = type === 'member' && selected;
        // 조직단위 선택여부
        const isGroupSelected =
          type === 'group' && selectedEmployee.group[item.organization_no];
        // 그래서 선택이 되었느냐
        const isSelected = isEmployeeSelected || isGroupSelected;
        return (
          <View
            style={{
              backgroundColor: (index + i) % 2 === 0 ? '#fbfbfb' : '#f7f7f7'
              // marginLeft: 16
            }}
            key={index}
          >
            <TouchableHighlight
              disabled={item.user_no === auth.user_no}
              style={{ flexDirection: 'row' }}
              underlayColor={'#e9f5ff'}
              onPress={() => {
                if (type === 'group') {
                  // 조직일 경우 자식요소 토글
                  const group = JSON.parse(JSON.stringify(openGroup));
                  if (group[item.organization_no]) {
                    delete group[item.organization_no];
                  } else {
                    group[item.organization_no] = item;
                  }
                  setOpenGroup(group);
                  if (!item.children) {
                    if (!organizationEmployee[item.organization_no]) {
                      getOrganizationEmployeeTree(Number(item.organization_no));
                    }
                  }
                } else {
                  // 조직원일 경우 해당 조직원 선택
                  !isParentSelected && selectEmployee(type, item);
                }
              }}
            >
              <>
                <View
                  style={[
                    styles.lineContainer,
                    { flex: 1, marginLeft: 16 * (depth + 1) }
                  ]}
                >
                  <View
                    style={[
                      { flexDirection: 'row', alignItems: 'center' }
                      // (isParentSelected || isSelected) && styles.selectedItem
                    ]}
                  >
                    <Image
                      source={
                        type === 'group'
                          ? openGroup[item.organization_no]
                            ? isParentSelected || isSelected
                              ? ic_arrow_up
                              : ic_arrow_down
                            : isParentSelected || isSelected
                            ? ic_arrow_down
                            : ic_arrow_up
                          : isParentSelected || isSelected
                          ? ic_person
                          : ic_person
                      }
                      style={{ width: 24, height: 24 }}
                    />
                    <View style={styles.lineItem}>
                      <Text
                        style={[
                          styles.textStyle,
                          type === 'group'
                            ? openGroup[item.organization_no]
                              ? isParentSelected || isSelected
                                ? null
                                : {
                                    color: '#1c90fb'
                                  }
                              : isParentSelected || isSelected
                              ? {
                                  color: '#1c90fb'
                                }
                              : null
                            : isParentSelected || isSelected
                            ? {
                                color: '#1c90fb'
                              }
                            : null
                        ]}
                      >
                        {type === 'group'
                          ? item.organization_name
                          : item.user_name}
                        &nbsp;
                        {type === 'group' ? (
                          <Text
                            style={{
                              color:
                                isParentSelected || isSelected
                                  ? '#fff'
                                  : '#1c90fb',
                              fontWeight: 'bold'
                            }}
                          >
                            {item.employee_count}
                          </Text>
                        ) : (
                          item.rank_name
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* checkBox UI */}
                {!isParentSelected &&
                  type === 'member' &&
                  item.user_no !== auth.user_no && (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingRight: 10
                      }}
                    >
                      <CustomCheckBoxPresenter
                        color="#ccc"
                        onCheck={() => selectEmployee(type, item)}
                        checked={isSelected}
                      />
                    </View>
                  )}
              </>
            </TouchableHighlight>

            {/* 자식 조직이 존재할 때 */}
            {type === 'group' && openGroup[item.organization_no] && (
              <View>
                {item.children &&
                <OrganizationFlatList />
                  OrganizationFlatList(
                    item.children,
                    index,
                    type,
                    depth + 1,
                    isParentSelected || isSelected
                  )}
              </View>
            )}

            {/* 자식 조직이 더 없을 때 조직원 리스트 */}
            {type === 'group' &&
              openGroup[item.organization_no] &&
              organizationEmployee[item.organization_no] && (
                <View>
                  {!item.children &&
                    OrganizationFlatList(
                      organizationEmployee[item.organization_no],
                      index,
                      'member',
                      depth + 1,
                      isParentSelected || isSelected
                    )}
                </View>
              )}
          </View>
        );
      }}
    />
  );
};

export default OrganizationFlatList;
