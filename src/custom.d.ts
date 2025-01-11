declare namespace Express {
  export interface Request {
    session?: {
      email: string;
      userId: string;
      admin: boolean;
    };
  }
}
