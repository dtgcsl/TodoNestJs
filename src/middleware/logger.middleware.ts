import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class Handle implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.params.uid;
    if (!userId || isNaN(Number(userId))) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    next();
  }
}

// @Injectable()
// export class TodoMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     const todoId = req.params.id;
//     if (!todoId || isNaN(Number(todoId))) {
//       return res.status(400).json({ error: 'Invalid Todo ID' });
//     }
//     next();
//   }
// }
