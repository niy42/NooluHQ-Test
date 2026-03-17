declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: String;
        role: string;
        teamSize: string;
      };
    }
  }
}
