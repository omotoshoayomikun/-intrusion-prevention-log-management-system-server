export interface IResponse<T>  {
  success: boolean;
  code: string | number;
  message: string;
  data?: T;
}

export const createResponse = <T>(success: boolean, code: string | number, message: string, data?: T): IResponse<T> => {
  return {
    success,
    code,
    message,
    data
  };
}