class User {
  constructor(id, isLocal, videoTrack, audioTrack) {
    this._id = id;
    this._isLocal = isLocal;
    this._videoTrack = videoTrack;
    this._audioTrack = audioTrack;
  }

  //#region isLocal

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = id;
  }

  //#endregoin

  //#region isLocal

  get isLocal() {
    return this._isLocal;
  }

  set isLocal(isLocal) {
    this._isLocal = isLocal;
  }

  //#endregoin

  //#region videoTrack

  get videoTrack() {
    return this._videoTrack;
  }

  set videoTrack(videoTrack) {
    this._videoTrack = videoTrack;
  }

  //#endregoin

  //#region videoTrack

  get audioTrack() {
    return this._audioTrack;
  }

  set audioTrack(audioTrack) {
    this._audioTrack = audioTrack;
  }

  //#endregoin
}

export default User;
