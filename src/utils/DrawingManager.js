/**
 * Drawing maker
 */
import { Dimensions } from 'react-native';

class DrawingManager {
  /**
   *
   */
  constructor(dispatch) {
    // Singleton
    if (!DrawingManager.instance) {
      const width = Dimensions.get('window').width;
      const height = Dimensions.get('window').height;

      // 기본 화면비율
      this.BASE_WIDTH = 1024;
      this.BASE_HEIGHT = 768;
      this.SCREEN_WIDTH = width >= height ? height : width; // 화면 가로길이;
      this.SCREEN_HEIGHT =
        this.SCREEN_WIDTH * ((this.BASE_HEIGHT * 100) / this.BASE_WIDTH / 100); // 화면 가로길이;
      this.CONTRAST_SCALE = (this.SCREEN_WIDTH * 100) / this.BASE_WIDTH;

      this.canvas = null; // canvas
      this.tempId = 0; // 드로잉 아이디
      this.history = []; // 드로잉 기록

      // 싱글톤 변수 할당
      DrawingManager.instance = this;
      this._dispatch = dispatch;
    }
    return DrawingManager.instance;
  }

  /**
   * getter
   */
  get = target => {
    switch (target) {
      case 'BASE_WIDTH':
      case 'BASE_HEIGHT':
      case 'SCREEN_WIDTH':
      case 'SCREEN_HEIGHT':
      case 'canvas':
        return this[target];

      default:
        return null;
    }
  };

  /**
   *
   */
  setRef = ref => {
    this.canvas = ref;
  };

  /**
   *
   */
  clearAll = (send = false) => {
    this.canvas.clear();
    return true;
  };

  /**
   * 데이터 컨버터
   */
  handleConvertFormat = (to, data) => {
    /*
    to: mobile , pc
    */
    if (to === 'mobile') {
      const newData = this._handleConvertPcToMobile(data);
      if (this.canvas) {
        this.canvas.addPath(newData);
      }
    } else {
      return this._handleConvertMobileToPc(data);
    }
  };

  /**
   * PC데이터 -> Mobile데이터
   */
  _handleConvertPcToMobile = data => {
    let drawDataToJson = JSON.parse(data.attributes.data);
    let newData = {
      drawer: 'wehago_meet_web',
      size: {
        width: this.BASE_WIDTH,
        height: this.BASE_HEIGHT
        // width: 900,
        // height: 512
      },
      path: {
        id: 0,
        color: '',
        width: 0,
        data: []
      }
    };

    // newData.path.id = String(data.value);
    newData.path.id = Number(this.tempId++);
    newData.path.color = String(drawDataToJson.strokeColor);
    // 선 굵기 비율
    newData.path.width = Number(
      drawDataToJson.strokeWidth * (this.SCREEN_WIDTH / this.BASE_WIDTH)
    );
    // newData.path.width = Number(drawDataToJson.strokeWidth);
    newData.path.data = [];

    drawDataToJson.paths.map(item => {
      newData.path.data.push(`${item.x},${item.y}`);
    });
    this.history.push(newData);
    return newData;
  };

  /**
   * Mobile데이터 -> PC데이터
   */
  _handleConvertMobileToPc = drawingData => {
    const { id, color, width, data } = drawingData.path;

    // to drawData
    let newData = {
      value: id,
      tagName: 'UPDATE_DRAWING_DATA',
      attributes: {
        data: {
          drawMode: true,
          strokeColor: color,
          strokeWidth: width,
          paths: []
        },
        isMobile: true
      },
      children: []
    };
    let location;

    data.map(item => {
      location = item.split(',');
      newData.attributes.data.paths.push({
        x: Number((location[0] / this.SCREEN_WIDTH) * this.BASE_WIDTH),
        y: Number((location[1] / this.SCREEN_HEIGHT) * this.BASE_HEIGHT)
      });
    });

    newData.attributes.data = JSON.stringify(newData.attributes.data);
    return newData;
  };
}

export default DrawingManager;
