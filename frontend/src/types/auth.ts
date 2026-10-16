export enum UserRoles {
  ADMIN = "ADMIN",
  USER = "USER",
}

export type User = {
  id: number;
  name: string;
  email: string;
  username: string;
  role: UserRoles;
  avatar: string;
  token: string;
};

export type UserProfile = {
  id: number;
  name: string;
  username: string;
  phone: string;
  email: string;
  type: UserRoles;
  avatar: string;
};

export type UserStats = {
  postCount: number;
  likesReceived: number;
  commentsReceived: number;
};

export type UserSimpleDetails = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  type: UserRoles;
};

export type UserDTO = {
  name: string;
  username?: string;
  phone: string;
  cpf: string;
  email: string;
  password: string;
  type: string;
  avatar: string;
};
