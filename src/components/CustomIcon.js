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
import ico_show from '../../assets/icons/wedrive/ico_fn_show_120.imageset/ico_fn_hanshow_120.png';
import ico_pdf from '../../assets/icons/wedrive/ico_fn_pdf_120.imageset/ico_fn_pdf_120.png';
import ico_png from '../../assets/icons/wedrive/ico_fn_png_120.imageset/ico_fn_png_120.png';
import ico_ppt from '../../assets/icons/wedrive/ico_fn_ppt_120.imageset/ico_fn_ppt_120.png';
import ico_pptx from '../../assets/icons/wedrive/ico_fn_pptx_120.imageset/ico_fn_pptx_80_2x.png';
import ico_tif from '../../assets/icons/wedrive/ico_fn_tif_120.imageset/ico_fn_tif_120.png';
import ico_tiff from '../../assets/icons/wedrive/ico_fn_tif_120.imageset/ico_fn_tif_120.png';
import ico_txt from '../../assets/icons/wedrive/ico_fn_txt_120.imageset/ico_fn_txt_120.png';
import ico_rtf from '../../assets/icons/wedrive/ico_fn_txt_120.imageset/ico_fn_txt_120.png';
import ico_word from '../../assets/icons/wedrive/ico_fn_word_120.imageset/ico_fn_word_120.png';
import ico_xls from '../../assets/icons/wedrive/ico_fn_xls_120.imageset/ico_fn_xls_120.png';
import ico_xlsx from '../../assets/icons/wedrive/ico_fn_xlsx_120.imageset/ico_fn_xlsx_80_2x.png';

// import btn_mike_on from '../../assets/icons/speaker/btn-mike-on_2x.png';
// import btn_mike_off from '../../assets/icons/speaker/btn-mike-off_2x.png';
import btn_mike_on from '../../assets/icons/speaker/btn-mike-on_2x_re.png';
import btn_mike_off from '../../assets/icons/speaker/btn-mike-off_2x_re.png';
import ico_mike_off from '../../assets/icons/speaker/ico-vc-mike-small-off_2x.png';
// import btn_camera_on from '../../assets/icons/speaker/btn-camera-on_2x.png';
// import btn_camera_off from '../../assets/icons/speaker/btn-camera-off_2x.png';
// import btn_speaker_on from '../../assets/icons/speaker/btn-speaker-on_2x.png';
// import btn_speaker_off from '../../assets/icons/speaker/btn-speaker-off_2x.png';
import btn_speaker_on from '../../assets/icons/speaker/btn-speaker-on_2x_re.png';
import btn_speaker_off from '../../assets/icons/speaker/btn-speaker-off_2x_re.png';

import btn_edit_none from '../../assets/buttons/btn_docedit_edit_none.png';
import btn_edit_sele from '../../assets/buttons/btn_docedit_edit_sele.png';
import btn_eraser_none from '../../assets/buttons/btn_docedit_eraser_none.png';
import btn_eraser_sele from '../../assets/buttons/btn_docedit_eraser_sele.png';
import btn_laser_none from '../../assets/buttons/btn_docedit_laser_none.png';
import btn_laser_sele from '../../assets/buttons/btn_docedit_laser_sele.png';
import btn_back from '../../assets/buttons/btn_back_none.png';
import btn_forward from '../../assets/buttons/btn_forward_none.png';
import buttonClose from '../../assets/buttons/btnTnaviCloseNone_3x.png';
import buttonMenu from '../../assets/buttons/btn-tnavi-menu-none_3x.png';

import ico_check_white from '../../assets/icons/palette/color-check-wh_2x.png';
import ico_check_blue from '../../assets/icons/palette/color-check_2x.png';
import ico_decrease from '../../assets/icons/palette/btn_docedit_redu_none.png';
import ico_increase from '../../assets/icons/palette/btn_docedit_incr_none.png';

import person_icon from '../../assets/icons/img-vc-nophoto_2x.png';

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
    // case 'rtf':
    //   return ico_rtf;
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
    // case 'rtf':
    //   return ico_rtf;
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
    case 'tif':
      return ico_tif;
    case 'tiff':
      return ico_tiff;
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
    case 'speakerOn':
      return btn_speaker_on;
    case 'speakerOff':
      return btn_speaker_off;
    case 'btnEditNone':
      return btn_edit_none;
    case 'btnEditSele':
      return btn_edit_sele;
    case 'btnEraserNone':
      return btn_eraser_none;
    case 'btnEraserSele':
      return btn_eraser_sele;
    case 'btnLaserNone':
      return btn_laser_none;
    case 'btnLaserSele':
      return btn_laser_sele;
    case 'btnBack':
      return btn_back;
    case 'btnForward':
      return btn_forward;
    case 'checkWhite':
      return ico_check_white;
    case 'checkBlue':
      return ico_check_blue;
    case 'icoDecrease':
      return ico_decrease;
    case 'icoIncrease':
      return ico_increase;
    case 'personIcon':
      return person_icon;
    case 'buttonClose':
      return buttonClose;
    case 'buttonMenu':
      return buttonMenu;
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
