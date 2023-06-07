class HttpException extends Error {
    public httpCode: number;
    public httpReason: string;
    public message: string;
  
    constructor(httpCode: number, httpReason: string, message: string) {
      super(message);
      this.httpCode = httpCode;
      this.httpReason = httpReason;
      this.message = message;
    }
  }
  
  export default HttpException;