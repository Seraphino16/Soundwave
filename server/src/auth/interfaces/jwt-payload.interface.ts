export interface JwtPayload {
  id: number;
  email: string;
  username: string;
  roles: string[];
}
