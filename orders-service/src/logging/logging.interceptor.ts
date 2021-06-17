import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Request, Response} from "express";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

//:ip :method :url - :status :res[content-length] - :response-time ms
export class LoggingInterceptor implements NestInterceptor{
  serviceName: string;

  constructor(serviceName) {
    this.serviceName = serviceName;
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const date = new Date();
    const request = context.switchToHttp().getRequest<Request>();
    const {ip, originalUrl, method }  = request
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      tap(() => console.log(`[Orders Service]   -   ${date.toISOString()}  ${ip}    ${method}:${response.statusCode}    ${originalUrl}    -    ${Date.now() - date.getTime()} ms`)),
      catchError((err) => {
        console.error(`[${this.serviceName}]   -   ${date.toISOString()}  ${ip}    ${method}:${response.statusCode}    ${originalUrl}    -    ${Date.now() - date.getTime()} ms`)
        return throwError(err)} )
    );
  }

}
