export interface IResponseData<T> {
  status: number | string;
  message: string;
  data: T | T[];
}
