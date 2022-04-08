
import { View, Text } from 'react-native'
import React from 'react'
import { BottomPopupContainerProps } from '../types'
import BottomPopupPresenter from './BottomPopupPresenter'

const BottomPopupContainer:React.FC<BottomPopupContainerProps>=()=> {
  return (
    <BottomPopupPresenter />
  )
}
export default BottomPopupContainer