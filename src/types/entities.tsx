export interface UserEntity {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  emailVerified: Date;
  image: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface UserSession {
  expires: string;
  user: UserEntity;
}
