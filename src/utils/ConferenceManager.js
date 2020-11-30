

let globalConferenceManager = null;

export function setConferenceManager(conferenceManager) {
  globalConferenceManager = conferenceManager;
}

export function getConferenceManager() {
  return globalConferenceManager;
}
