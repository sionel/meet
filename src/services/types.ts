import { rest } from "lodash";
import { errorType } from "./api/types";

interface BaseRes {
  resultCode: number;
}
interface SuccessRes<T> extends BaseRes {
  resultData: T;
}

interface ErrorRes extends BaseRes {
  errors: {
    code: string;
    message: string;
  };
}

export type Res<T> = SuccessRes<T> | ErrorRes;

export const isSuccess = <T>(res: Res<T>): res is SuccessRes<T> => {
  switch (res.resultCode) {
    case 200:
      return true;
    default:
      return false;
  }
};