export interface User {
  id: number;
  email: string;
  name: string;
  passwordHash: string;
}

export interface NewUser {
  email: string;
  name: string;
  passwordHash: string;
}