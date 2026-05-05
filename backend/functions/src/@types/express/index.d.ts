
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      user?: {
        id: number;
        email?: string
      }
    }
  }
}

export {};
