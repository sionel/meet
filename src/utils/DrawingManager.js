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
      this.history = []; // redo undo 기록

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
      case 'history':
        this[target] = value;
        break;
      default:
        return null;
    }
  };

  // 이미지 렌더링 > 드로잉 보드 렌더링 > 그리기 하도록 바꿔라!!!!
  drawCanvas = data => {
    if (!this.canvas) return;

    setTimeout(() => {
      if (!this.canvas) return;
      this.canvas.clear();

      const drawingData = data.objects || data;

      drawingData.map(item => {
        if (item.type === 'path') {
          let newData = {
            drawer: 'user',
            size: {
              width: this.BASE_WIDTH,
              height: this.BASE_HEIGHT
            },
            path: {
              id: item.drawId,
              // id: Number(this.tempId++),
              color: item.stroke,
              width: item.strokeWidthScale * this.BASE_WIDTH,
              data: []
            }
          };

          item.coordsPath.map(xy => {
            const location = xy.split(',');
            newData.path.data.push(
              `${Number(location[0]) * this.BASE_WIDTH},${Number(location[1]) *
                this.BASE_HEIGHT}`
            );
          });

          this.canvas.addPath(newData);
        }
      });
    }, 100);
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
    if (this.canvas) this.canvas.clear();
    return true;
  };

  /**
   * 데이터 컨버터
   */
  handleConvertFormat = (from, data) => {
    /*
    from: mobile , web
    */
    if (from === 'web') {
      return this._handleConvertPcToMobile(data);
    } else {
      return this._handleConvertMobileToPc(data);
    }
  };

  /**
   * PC데이터 -> Mobile데이터
   */
  _handleConvertPcToMobile = data => {
    // let objects = JSON.parse(data.attributes.objects);
    return data;
  };

  /**
   * Mobile데이터 -> PC데이터
   */
  _handleConvertMobileToPc = drawingData => {
    if (!drawingData) {
      return {
        type: 'image',
        tagName: 'UPDATE_DRAWING_DATA',
        attributes: {
          documentData: '[]',
          width: this.BASE_WIDTH,
          height: this.BASE_HEIGHT
        }
      };
    }

    // UNDO or REDO 의 경우 drawingData 가 배열로 옴
    if (Array.isArray(drawingData)) {
      return {
        value: id,
        tagName: 'UPDATE_DRAWING_DATA',
        attributes: {
          documentData: JSON.stringify(this.DRAW_DATA),
          width: width,
          height: height
        }
      };
    }

    // drawingData 가 추가 되었을 경우 (그냥 그렸을 때)
    const { id, color, width: strokeWidthScale, data } = drawingData.path;
    const { width, height } = drawingData.size;

    let object = {
      type: 'path',
      coordsPath: [],
      opacity: 1,
      stroke: color,
      strokeWidthScale: strokeWidthScale / this.BASE_WIDTH,
      drawId: id
    };
    data.map(item => {
      const location = item.split(',');
      object.coordsPath.push(
        `${Number(location[0]) / this.BASE_WIDTH}, ${Number(location[1]) /
          this.BASE_HEIGHT}`
      );
    });

    // to drawData
    let newData = {
      value: id,
      tagName: 'UPDATE_DRAWING_DATA',
      attributes: {
        documentData: this.DRAW_DATA,
        width: width,
        height: height
      }
    };
    this.DRAW_DATA.push(object);
    newData.attributes.documentData = JSON.stringify(this.DRAW_DATA);
    return newData;
  };

  /**
   * REDO
   */
  redo = () => {
    if (this.history.length > 0) {
      const temp = this.history.pop();
      this.DRAW_DATA.push(temp);

      let newData = {
        drawer: 'user',
        size: {
          width: this.BASE_WIDTH,
          height: this.BASE_HEIGHT
        },
        path: {
          id: Number(temp.drawId),
          color: temp.stroke,
          width: temp.strokeWidthScale * this.BASE_WIDTH,
          data: []
        }
      };

      temp.coordsPath.map(xy => {
        const location = xy.split(',');
        newData.path.data.push(
          `${Number(location[0]) * this.BASE_WIDTH},${Number(location[1]) *
            this.BASE_HEIGHT}`
        );
      });
      this.canvas.addPath(newData);
    }
  };

  /**
   * UNDO
   */
  undo = () => {
    if (this.DRAW_DATA.length > 0) {
      const temp = this.DRAW_DATA.pop();
      this.history.push(temp);
      this.canvas.deletePath(temp.drawId);
    }
  };
}

export default DrawingManager;
