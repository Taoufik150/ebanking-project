export interface User {
  id: number;
  username: string;
  password?: string;
  nom: string;
  prenom: string;
  email: string;
  phone: number | null;
  role: string;
}

export type UserRequest = Omit<User, 'id'>;
