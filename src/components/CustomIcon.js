import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';

import ico_folder from '../../assets/icons/wedrive/ico_folder_160.imageset/ico_folder_160.png';
import ico_shareFolder from '../../assets/icons/wedrive/ico_folder_group_160-1.imageset/ico_folder_group_160.png';
import ico_bmp from '../../assets/icons/wedrive/ico_fn_bmp_120.imageset/ico_fn_bmp_120.png';
import ico_doc from '../../assets/icons/wedrive/ico_fn_doc_120.imageset/ico_fn_doc_120.png';
import ico_docx from '../../assets/icons/wedrive/ico_fn_docx_120.imageset/ico_fn_docx_80_2x.png';
import ico_etc from '../../assets/icons/wedrive/ico_fn_etc_120.imageset/ico_fn_etc_120.png';
import ico_gif from '../../assets/icons/wedrive/ico_fn_gif_120.imageset/ico_fn_gif_120.png';
import ico_hwp from '../../assets/icons/wedrive/ico_fn_hwp_120.imageset/ico_fn_hwp_120.png';
import ico_jpeg from '../../assets/icons/wedrive/ico_fn_jpeg_120.imageset/ico_fn_jpeg_120.png';
import ico_jpg from '../../assets/icons/wedrive/ico_fn_jpg_120.imageset/ico_fn_jpg_120.png';
import ico_one from '../../assets/icons/wedrive/ico_fn_one_120.imageset/ico_fn_one_120.png';
import ico_pdf from '../../assets/icons/wedrive/ico_fn_pdf_120.imageset/ico_fn_pdf_120.png';
import ico_png from '../../assets/icons/wedrive/ico_fn_png_120.imageset/ico_fn_png_120.png';
import ico_ppt from '../../assets/icons/wedrive/ico_fn_ppt_120.imageset/ico_fn_ppt_120.png';
import ico_pptx from '../../assets/icons/wedrive/ico_fn_pptx_120.imageset/ico_fn_pptx_80_2x.png';
import ico_tif from '../../assets/icons/wedrive/ico_fn_tif_120.imageset/ico_fn_tif_120.png';
import ico_txt from '../../assets/icons/wedrive/ico_fn_txt_120.imageset/ico_fn_txt_120.png';
import ico_word from '../../assets/icons/wedrive/ico_fn_word_120.imageset/ico_fn_word_120.png';
import ico_xls from '../../assets/icons/wedrive/ico_fn_xls_120.imageset/ico_fn_xls_120.png';
import ico_xlsx from '../../assets/icons/wedrive/ico_fn_xlsx_120.imageset/ico_fn_xlsx_80_2x.png';
import btn_mike_on from '../../assets/icons/speaker/btn-mike-on_2x.png';
import btn_mike_off from '../../assets/icons/speaker/btn-mike-off_2x.png';
import ico_mike_off from '../../assets/icons/speaker/ico-vc-mike-small-off_2x.png';
import btn_camera_on from '../../assets/icons/speaker/btn-camera-on_2x.png';
import btn_camera_off from '../../assets/icons/speaker/btn-camera-off_2x.png';

const CustomIcon = props => {
  return (
    <Image
      source={getButtonSource(props.name)}
      resizeMode={'contain'}
      style={{
        ...styles.iconStyle,
        ...props.style,
        width: props.width,
        height: props.height,
        borderRadius: props.borderRadius
      }}
    />
  );
};

/**
 * CustomIcon PropTypes
 */
CustomIcon.propTypes = {
  name: PropTypes.string
};

/**
 * 버튼 이미지를 얻어온다.
 */
const getButtonSource = name => {
  switch (name) {
    case 'folder':
      return ico_folder;
    case 'shareFolder':
      return ico_shareFolder;
    case 'txt':
      return ico_txt;
    case 'one':
      return ico_one;
    case 'hwp':
      return ico_hwp;
    case 'ppt':
      return ico_ppt;
    case 'pptx':
      return ico_pptx;
    case 'show':
      return ico_show;
    case 'rtf':
      return ico_rtf;
    case 'word':
      return ico_word;
    case 'doc':
      return ico_doc;
    case 'docx':
      return ico_docx;
    case 'xls':
      return ico_xls;
    case 'xlsx':
      return ico_xlsx;
    case 'bmp':
      return ico_bmp;
    case 'jpg':
      return ico_jpg;
    case 'jpeg':
      return ico_jpeg;
    case 'gif':
      return ico_gif;
    case 'png':
      return ico_png;
    case 'pdf':
      return ico_pdf;
    case 'mikeOn':
      return btn_mike_on;
    case 'mikeOff':
      return btn_mike_off;
    case 'icoMikeOff':
      return ico_mike_off;
    default:
      return ico_etc;
  }
};

/**
 * styles
 */
const styles = StyleSheet.create({
  iconStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});

CustomIcon.defaultProps = {
  width: 45,
  height: 45,
  borderRadius: 0
};

export default CustomIcon;
