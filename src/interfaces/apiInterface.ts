export interface IResponse {
  message: {
    severity: string;
    summary: string;
    detail: string;
  };
  data: any;
}
