// export default function(url, options) {
//   return Promise.race([
//     fetch(url, options),
//     new Promise((_, reject) =>
//       setTimeout(() => {
//         return reject(new Error('timeout'));
//       }, 10000)
//     )
//   ]);
// }
import { Res } from '@services/types';
import axios from 'axios';

type options = {
  method: string;
  headers: {};
  body?: string;
};

export default async function <T>(
  url: string,
  options: options
): Promise<Res<T>> {
  const { method, headers, body } = options;
  // return new Promise(async (res, rej) => {
  switch (method) {
    case 'GET':
      return new Promise(async (res, rej) => {
        try {
          const response = await axios.get<Res<T>>(url, {
            headers
          });
          res(response.data);
        } catch (error: any) {
          res(
            error.response.data ?? {
              code: 500,
              message: '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.'
            }
          );
        }
      });
    case 'POST':
      return new Promise(async (res, rej) => {
        try {
          const response = await axios.post<Res<T>>(url, body, {
            headers
          });
          res(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            throw (
              error?.response?.data ?? {
                resultCode: 500,
                resultData:
                  '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.',
                resultMsg: '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.'
              }
            );
          }
        }
      });
    case 'DELETE':
      return new Promise(async (res, rej) => {
        try {
          const response = await axios.delete<Res<T>>(url, {
            headers
          });
          res(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            throw (
              error?.response?.data ?? {
                resultCode: 500,
                resultData:
                  '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.',
                resultMsg: '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.'
              }
            );
          }
        }
      });
    case 'PUT':
      return new Promise(async (res, rej) => {
        try {
          const response = await axios.put<Res<T>>(url, body, {
            headers
          });
          res(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            throw (
              error?.response?.data ?? {
                resultCode: 500,
                resultData:
                  '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.',
                resultMsg: '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.'
              }
            );
          }
        }
      });
    default:
      return new Promise(async (res, rej) => {
        try {
          const response = await axios.get<Res<T>>(url, {
            headers
          });
          res(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            throw (
              error?.response?.data ?? {
                resultCode: 500,
                resultData:
                  '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.',
                resultMsg: '서버에 응답이 없습니다.\n잠시 후 다시 시도해주세요.'
              }
            );
          }
        }
      });
  }
}
