/**
 * Drawing maker
 */

class DrawingManager {
	constructor(dispatch) {
		// Singleton
		if (!DrawingManager.instance) {
			// 싱글톤 변수 할당
			DrawingManager.instance = this;
			this._dispatch = dispatch;
		}
		return DrawingManager.instance;
	}
}

export default DrawingManager;
