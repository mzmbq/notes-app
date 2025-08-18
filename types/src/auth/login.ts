export type AuthReq = { username: string; password: string };

export type AuthResp = {
  accessToken: string;
  userId: string;
  username: string;
};

export type SignInData = { userId: string; username: string };
