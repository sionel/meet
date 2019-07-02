import React, { Component } from 'react';
import FileSharingPresenter from './FileSharingPresenter';

class FileSharingContainer extends Component {
  state = {
    uri:
      'https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
  };

  componentDidMount = () => {
    // this._handleCheckInitInfo();
    // setTimeout(() => {
    //   this.setState({
    //     uri:
    //       'data:image/png;base64,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'
    //   });
    // }, 2000);
  };
  

  render() {
    return <FileSharingPresenter {...this.props} {...this.state} />;
  }

  // _handleCheckInitInfo = async () => {
  //   const {
  //     AUTH_A_TOKEN,
  //     AUTH_R_TOKEN,
  //     last_access_company_no,
  //     last_company,
  //     HASH_KEY
  //   } = this.props.auth;

  //   const authData = {
  //     AUTH_A_TOKEN,
  //     AUTH_R_TOKEN,
  //     cno: last_access_company_no,
  //     ccode: last_company.company_code,
  //     HASH_KEY
  //   };

  //   // wedrive file 상세 정보
  //   const fileInfo = {
  //     Ext: 'jpeg',
  //     FileName: "9c68f870-9971-11e9-b124-530e005e83db",
  //     method: 'getImageURL'
  //   };
  //   // const fileInfo = {
  //   //   Ext: initInfoResponse.initInfo.storageList[0].extentionType,
  //   //   FileName: '6c11ed71-2cae-388e-9b0e-9a7b78b641e6_1554800260115'
  //   // };
  //   const fileInfoResponse = await this.props.getFileInfoRequest(authData, fileInfo);
  //   console.log(fileInfoResponse)
  //   if (!fileInfoResponse.fileInfo) {
  //     alert(
  //       '파일 정보를 불러오지 못했습니다.\nerror: ' +
  //         fileInfo.resultCode +
  //         fileInfo.resultMsg
  //     );
  //     return;
  //   }
  //   alert(JSON.stringify(fileInfoResponse));
  //   console.log('fileInfo', this.props.wedrive.fileInfo);
  // };
}

export default FileSharingContainer;
