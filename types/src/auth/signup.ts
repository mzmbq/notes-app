export type SignUpReq = {
  email: string;
  username: string;
  password: string;
};

export type SignUpResp = {
  id: string;
  username: string;
  token: string;
};
