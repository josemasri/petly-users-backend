export interface JwtPayload {
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  state: string;
  county: string;
  email: string;
  createdAt: Date;
}
