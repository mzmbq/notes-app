import { AuthResp } from "notes-app-types";
import { createContext, useEffect, useState } from "react";
import { log } from "../logger/logger";
import secureStore from "../utils/secureStore";
import { fetchMe } from "../api/user";
import { logError } from "../utils/errors";

// TODO: use secure store for token

export type AuthState = {
  authenticated: boolean;
  token: string | null;
  username: string | null;
};

export type AuthProps = {
  state: AuthState;
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

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await secureStore.get("userToken");
        log.debug("[AuthProvider] Loaded the token from the store");
        log.debug("[AuthProvider] Validating the token");

        const resp = await fetchMe(token);
        log.debug(
          "[AuthProvider] Found a valid token for the user:",
          resp.username
        );

        setAuthState({
          authenticated: true,
          token: token,
          username: resp.username,
        });
      } catch (err) {
        logError(err, "[AuthProvider] Loading the stored token failed");
      }
    };
    loadToken();
  }, []);

  const signIn = async (authResp: AuthResp) => {
    setAuthState({
      authenticated: true,
      token: authResp.accessToken,
      username: authResp.username,
    });
    await secureStore.save("userToken", authResp.accessToken);
    log.info("[AuthProvider] Signed in as:", authResp.username);
  };

  const signOut = async () => {
    setAuthState({
      authenticated: false,
      token: null,
      username: null,
    });
    await secureStore.clear("userToken");
    log.info("[AuthProvider] Signed out");
  };

  const value: AuthProps = {
    state: {
      authenticated: authState.authenticated,
      token: authState.token,
      username: authState.username,
    },
    signIn: signIn,
    signOut: signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
