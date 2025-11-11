export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  isMfaEnabled?: boolean;
  createdAt?: boolean;
}