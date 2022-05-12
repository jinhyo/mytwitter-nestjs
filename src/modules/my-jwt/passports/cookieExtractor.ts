import { Request } from 'express';

export function cookieExtractor(req: Request) {
  if (req && req.cookies) {
    return req.cookies['token'];
  }
}
