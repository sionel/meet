import i18next from 'i18next';

let globalT = (value: string) => {
  return value;
};

export function setT(t: i18next.TFunction) {
  globalT = t;
}

export function getT() {
  return globalT;
}
