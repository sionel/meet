import { rest } from "lodash";
import { errorType } from "./api/types";

interface BaseRes {
  resultCode: number;
}
interface SuccessRes<T> extends BaseRes {
  resultData: T;
}

interface ErrorRes extends BaseRes {
  errors: errorType
}

export type Res<T> = SuccessRes<T> | ErrorRes;

export const isSuccess = <T>(res: Res<T>): res is SuccessRes<T> => {
  switch (res.resultCode) {
    case 200:
    case 201:
    case 204:
    // case undefined:
      return true;
    default:
      return false;
  }
};