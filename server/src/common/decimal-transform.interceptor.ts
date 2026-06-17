import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function transformDecimals(value: unknown): unknown {
  if (value instanceof Decimal) return value.toNumber();
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map(transformDecimals);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, transformDecimals(v)]));
  }
  return value;
}

@Injectable()
export class DecimalTransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map(transformDecimals));
  }
}
