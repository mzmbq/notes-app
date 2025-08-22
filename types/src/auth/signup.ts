import type { AuthResp } from "./login.js";

export type SignUpReq = {
  email: string;
  username: string;
  password: string;
};

export type SignUpResp = AuthResp;
