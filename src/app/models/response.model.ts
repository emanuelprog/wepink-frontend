export interface ResponseDTO {
    data: any;
    msg: string;
    status: number;
  }
  
  export class ResponseDTO implements ResponseDTO {
    constructor(
        public data: any,
        public msg: string,
        public status: number
    ) { }
  }