export type RegisterParams = {
  email: string;
  password: string;
  name: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data: {
    user: AuthUser;
    token: string;
  };
};

export type LoginResponse = RegisterResponse; // same shape