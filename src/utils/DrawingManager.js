/**
 * Drawing maker
 */

class DrawingManager {
  /**
   *
   */
  constructor(dispatch) {
    // Singleton
    if (!DrawingManager.instance) {
      // 싱글톤 변수 할당
      this.canvas = null;
      this.tempId = 0;
      this.history = [];
      DrawingManager.instance = this;
      this._dispatch = dispatch;
    }
    return DrawingManager.instance;
  }

  /**
   *
   */
  setRef = ref => {
    this.canvas = ref;
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
    console.log('RAW DATA : ', data);
    let drawDataToJson = JSON.parse(data.attributes.drawData);
    let newData = {
      drawer: 'wehago_meet_web',
      size: {
        width: 900,
        height: 512
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
    newData.path.color = String(drawDataToJson.lineColor);
    newData.path.width = Number(drawDataToJson.lineWidth);
    newData.path.data = [];
    drawDataToJson.data.map(item => {
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
      drawData: '',
      children: []
    };
    let attributes = {
      lineColor: color,
      lineWidth: width,
      data: []
    };
    let location;

    data.map(item => {
      location = item.split(',');
      attributes.data.push({
        x: location[0],
        y: location[1]
      });
    });

    newData.drawData = JSON.stringify(attributes);
    return newData;
  };
}

export default DrawingManager;
