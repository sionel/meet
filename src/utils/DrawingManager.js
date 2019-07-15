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

      this.DRAW_DATA = [];

      // 기본 화면비율
      this.BASE_WIDTH = 0;
      this.BASE_HEIGHT = 0;
      // this.SCREEN_WIDTH = width >= height ? height : width; // 화면 가로길이;
      // this.SCREEN_HEIGHT =
      //   this.SCREEN_WIDTH * ((this.BASE_HEIGHT * 100) / this.BASE_WIDTH / 100); // 화면 가로길이;
      // this.CONTRAST_SCALE = (this.SCREEN_WIDTH * 100) / this.BASE_WIDTH;
      this.SCALE = 1;

      this.canvas = null; // canvas
      this.tempId = 0; // 드로잉 아이디
      this.history = []; // 드로잉 기록
      this.wastebasket = []; // 드로잉 휴지통

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
      case 'DRAW_DATA':
      case 'BASE_WIDTH':
      case 'BASE_HEIGHT':
      case 'SCREEN_WIDTH':
      case 'SCREEN_HEIGHT':
      case 'SCALE':
      case 'canvas':
        return this[target];

      default:
        return null;
    }
  };

  /**
   * setter
   */
  set = (target, value) => {
    switch (target) {
      case 'DRAW_DATA':
      case 'BASE_WIDTH':
      case 'BASE_HEIGHT':
      case 'SCREEN_WIDTH':
      case 'SCREEN_HEIGHT':
      case 'SCALE':
        return (this[target] = value);
      default:
        return null;
    }
  };

  drawCanvas = data => {
    this.canvas.clear();
  };

  /**
   * 캔버스 바인딩
   */
  setRef = ref => {
    this.canvas = ref;
  };

  /**
   * 전체지우기
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
      return this._handleConvertPcToMobile(data);
    } else {
      return this._handleConvertMobileToPc(data);
    }
  };

  /**
   * PC데이터 -> Mobile데이터
   */
  _handleConvertPcToMobile = data => {
    let objects = JSON.parse(data.attributes.objects);

    this.canvas.clear();

    objects.map(item => {
      let newData = {
        drawer: 'wehago_meet_web',
        size: {
          width: this.BASE_WIDTH,
          height: this.BASE_HEIGHT
        },
        path: {
          id: Number(this.tempId++),
          color: item.stroke,
          width: item.strokeWidth,
          data: []
        }
      };

      item.coordsPath.map(xy => {
        const location = xy.split(',');
        newData.path.data.push(`${Number(location[0]) * this.BASE_WIDTH}, ${Number(location[1]) * this.BASE_HEIGHT}`);
      });

      this.canvas.addPath(newData);
    });

    return objects;
  };

  /**
   * Mobile데이터 -> PC데이터
   */
  _handleConvertMobileToPc = drawingData => {
    const { id, color, width: strokeWidth, data } = drawingData.path;
    const { width, height } = drawingData.size;

    let object = {
      coordsPath: [],
      width: width,
      height: height,
      opacity: 1,
      stroke: color,
      strokeWidth: strokeWidth,
    };
    data.map(item => {
      const location = item.split(',');
      object.coordsPath.push(`${Number(location[0]) / this.BASE_WIDTH}, ${Number(location[1]) / this.BASE_HEIGHT}`);
    });

    // to drawData
    let newData = {
      value: id,
      tagName: 'UPDATE_DRAWING_DATA',
      attributes: {
        objects: this.DRAW_DATA
        // objects: {
        //   coordsPath: [],
        //   width: width,
        //   height: height,
        //   opacity: 1,
        //   stroke: color,
        //   strokeWidth: strokeWidth,
        // }
      }
    }
    this.DRAW_DATA.push(object);
    newData.attributes.objects = JSON.stringify(this.DRAW_DATA);

    return newData;
  };

  /**
   * REDO
   */
  redo = () => {};

  /**
   * UNDO
   */
  undo = () => {
    if (this.history.length > 0) {
      this.wastebasket.push(this.history.pop());
    }
    this.canvas.undo();
  };
}

export default DrawingManager;
