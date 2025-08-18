import { AuthResp } from "notes-app-types";
import { createContext, useState } from "react";
import { log } from "../logger/logger";

// TODO: use secure store for token

export type AuthState = {
  authenticated: boolean;
  token: string | null;
  username: string | null;
};

export type AuthProps = {
  authState: AuthState;
  signIn: (authResp: AuthResp) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthProps | undefined>(undefined);

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    token: null,
    username: null,
  });

  const signIn = async (authResp: AuthResp) => {
    setAuthState({
      authenticated: true,
      token: authResp.accessToken,
      username: authResp.username,
    });
    log.info("[AuthProvider] Signed in as:", authResp.username);
  };

  const signOut = async () => {
    setAuthState({
      authenticated: false,
      token: null,
      username: null,
    });
    log.info("[AuthProvider] Signed out");
  };

  const value: AuthProps = {
    authState: {
      authenticated: authState.authenticated,
      token: authState.token,
      username: authState.username,
    },
    signIn: signIn,
    signOut: signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
