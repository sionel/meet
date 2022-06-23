export type Auth = {
  AUTH_A_TOKEN: string;
  AUTH_R_TOKEN: string;
  url: string;
  HASH_KEY: string;
};

export type WehagoAPI = () => Promise<ResponseWehagoAPI>;

export type ResponseWehagoAPI<T = any> = {
  resultData: T;
  resultCode: number;
  resultMsg: string;
};
// export interface AxiosResponse<T = any, D = any> {
//   data: T;
//   status: number;
//   statusText: string;
//   headers: AxiosResponseHeaders;
//   config: AxiosRequestConfig<D>;
//   request?: any;
// }
