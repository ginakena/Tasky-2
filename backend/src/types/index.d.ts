export type UserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  avatar: null | string;
  dateJoined: Date;
  lastUpdated: Date;
};

export declare global {
  namespace Express {
    interface Request {
      user: UserPayload;
    }
  }
}