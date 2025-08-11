import { useState } from "react";
import { fetchLogin, LoginRequest, LoginResponse } from "../api/user";
import { ErrorToText } from "../utils/errors";

const useAuth = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (req: LoginRequest): Promise<LoginResponse> => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchLogin(req);
      setUser(result.username);
      return result;
    } catch (err: unknown) {
      setError(ErrorToText(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, login };
};

export default useAuth;
