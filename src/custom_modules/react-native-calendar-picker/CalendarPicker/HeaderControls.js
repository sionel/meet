import React from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { Utils } from './Utils';
import Controls from './Controls';
import { getT } from '@utils/translateManager';

export default function HeaderControls(props) {
  const {
    styles,
    currentMonth,
    currentYear,
    onPressNext,
    onPressPrevious,
    onPressMonth,
    onPressYear,
    months,
    previousComponent,
    nextComponent,
    previousTitle,
    nextTitle,
    previousTitleStyle,
    nextTitleStyle,
    monthTitleStyle,
    yearTitleStyle,
    textStyle,
    restrictMonthNavigation,
    maxDate,
    minDate,
    headingLevel,
    monthYearHeaderWrapperStyle,
    headerWrapperStyle
  } = props;
  const MONTHS = months || Utils.MONTHS; // English Month Array
  const monthName = MONTHS[currentMonth];
  const year = currentYear;

  const disablePreviousMonth =
    restrictMonthNavigation &&
    Utils.isSameMonthAndYear(minDate, currentMonth, currentYear);
  const disableNextMonth =
    restrictMonthNavigation &&
    Utils.isSameMonthAndYear(maxDate, currentMonth, currentYear);

  const accessibilityProps = { accessibilityRole: 'header' };
  if (Platform.OS === 'web') {
    accessibilityProps['aria-level'] = headingLevel;
  }

  const t = getT();

  return (
    <View style={[styles.headerWrapper]}>
      <View
        style={[
          styles.monthYearHeaderWrapper,
          monthYearHeaderWrapperStyle,
          { flexDirection: 'row', justifyContent: 'center' }
        ]}
      >
        {/* <TouchableOpacity onPress={onPressYear}> */}
        <Controls
          disabled={disablePreviousMonth}
          label={previousTitle}
          component={previousComponent}
          onPressControl={() => onPressPrevious('year')}
          styles={styles.previousContainer}
          textStyles={[
            styles.navButtonText,
            { fontSize: 20, fontFamily: 'DOUZONEText30' },
            previousTitleStyle
          ]}
        />
        <Text
          style={[
            styles.yearHeaderMainText,
            { fontSize: 18, fontFamily: 'DOUZONEText50', marginHorizontal: 16 },
            yearTitleStyle
          ]}
        >
          {year}
        </Text>
        <Controls
          disabled={disableNextMonth}
          label={nextTitle}
          component={nextComponent}
          onPressControl={() => onPressNext('year')}
          styles={styles.nextContainer}
          textStyles={[
            styles.navButtonText,
            { fontSize: 20, fontFamily: 'DOUZONEText30' },
            nextTitleStyle
          ]}
        />
        <Controls
          disabled={disablePreviousMonth}
          label={previousTitle}
          component={previousComponent}
          onPressControl={() => onPressPrevious('month')}
          styles={styles.previousContainer}
          textStyles={[
            styles.navButtonText,
            { fontSize: 20, fontFamily: 'DOUZONEText30' },
            previousTitleStyle
          ]}
        />
        <Text
          style={[
            styles.monthHeaderMainText,
            { fontSize: 18, fontFamily: 'DOUZONEText50', marginHorizontal: 16 },
            monthTitleStyle
          ]}
          {...accessibilityProps}
        >
          {monthName}
          {/* {t('renewal.common_month')} */}
        </Text>
        <Controls
          disabled={disableNextMonth}
          label={nextTitle}
          component={nextComponent}
          onPressControl={() => onPressNext('month')}
          styles={styles.nextContainer}
          textStyles={[
            styles.navButtonText,
            { fontSize: 18, fontFamily: 'DOUZONEText30' },
            nextTitleStyle
          ]}
        />
        {/* </TouchableOpacity> */}
        {/* </View> */}
      </View>
    </View>
  );
}

HeaderControls.propTypes = {
  currentMonth: PropTypes.number,
  currentYear: PropTypes.number,
  onPressNext: PropTypes.func,
  onPressPrevious: PropTypes.func,
  onPressMonth: PropTypes.func,
  onPressYear: PropTypes.func
};
