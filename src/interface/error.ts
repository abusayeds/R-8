
export type TErrorSoureces = {
  path: string | number;
  message: string;
}[];
export type TGenericErrorResponse ={
  statusCode: number;
  message: string
  errorSoures : TErrorSoureces
  
}