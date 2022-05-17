import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';

import CalendarPickerComponent from '../../../custom_modules/react-native-calendar-picker/CalendarPicker';
import { useTranslation } from 'react-i18next';
import deviceInfoModule from 'react-native-device-info';

interface CalendarPickerProps {
  startTime: any;
  onDateChange: any;
}

const isTablet = deviceInfoModule.isTablet() === true;

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  startTime,
  onDateChange
}) => {
  const { t } = useTranslation();
  return (
    <View style={{ paddingTop: 16, height: 300 }}>
      <CalendarPickerComponent
        weekdays={[
          t('renewal.calendar_sun'),
          t('renewal.calendar_mon'),
          t('renewal.calendar_tue'),
          t('renewal.calendar_wed'),
          t('renewal.calendar_thur'),
          t('renewal.calendar_fri'),
          t('renewal.calendar_sat')
        ]}
        months={[
          t('renewal.calendar_jan'),
          t('renewal.calendar_feb'),
          t('renewal.calendar_mar'),
          t('renewal.calendar_apr'),
          t('renewal.calendar_may'),
          t('renewal.calendar_jun'),
          t('renewal.calendar_jul'),
          t('renewal.calendar_aug'),
          t('renewal.calendar_sep'),
          t('renewal.calendar_oct'),
          t('renewal.calendar_nov'),
          t('renewal.calendar_dec')
        ]}
        previousTitle="<"
        nextTitle=">"
        minDate={new Date()}
        selectedStartDate={startTime.current}
        selectedDayStyle={styles.selectedText}
        selectedDayTextColor="#fff"
        todayTextStyle={styles.todayText}
        todayBackgroundColor="rgba(18,126,255, 0.07)"
        dayShape="circle"
        width={isTablet ? 500 : 360}
        onDateChange={onDateChange}
        // selectYearTitle={t('renewal.main_select_year')}
        // selectMonthTitle={t('renewal.common_year')}
        textStyle={{ fontSize: isTablet ? 18 : 14 }}
        disabledDatesTextStyle={{ fontSize: isTablet ? 18 : 14 }}
      />
      {/* <TouchableOpacity
        style={styles.selectedTimeButton}
        onPress={onTimeConfirm}
      >
        <Text style={styles.selectedButtonText}>{`적용`}</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default CalendarPicker;

const styles = StyleSheet.create({
  selectedTimeButton: {
    backgroundColor: '#127eff',
    marginTop: 30,
    height: 48,
    width: 335,
    alignSelf: 'center',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  selectedButtonText: {
    color: '#fff',
    fontFamily: 'DOUZONEText50',
    fontSize: 14
  },
  selectedText: {
    backgroundColor: '#1c90fb',
    fontSize: 14,
    fontFamily: 'DOUZONEText50',
  },
  todayText: {
    color: '#1c90fb',
    fontSize: 14,
    fontFamily: 'DOUZONEText50'
  }
});
