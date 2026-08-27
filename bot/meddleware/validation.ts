import express from 'express';

export function validationMiddleware(schema: any) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({ erro: 'Dados inválidos' });
    }
  };
}

export default validationMiddleware;
