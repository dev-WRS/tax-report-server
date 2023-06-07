import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
const ErrorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Middleware Error Hadnling");
    const errStatus = err.statusCode || 500;
    const errMsg = err.message || 'Something went wrong';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: err.stack
    })
}

export default ErrorMiddleware;