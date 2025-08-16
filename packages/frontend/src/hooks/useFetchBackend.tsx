import { useState } from "react";
import { ErrorToText } from "../utils/errors";
import { log } from "../logger/logger";

export const useFetchBackend = <ReqT, ResT>(
  fetchMethod: (req: ReqT) => Promise<ResT>
): {
  response: ResT | null;
  loading: boolean;
  error: string;
  doFetch: (req: ReqT) => Promise<ResT>;
} => {
  const [response, setResponse] = useState<ResT | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const doFetch = async (req: ReqT): Promise<ResT> => {
    setLoading(true);
    setError("");
    try {
      log.debug(
        "Fetching data with request:",
        req,
        "using method:",
        fetchMethod.name
      );
      const result = await fetchMethod(req);
      log.debug("Fetch result:", result);
      setResponse(result);
      return result;
    } catch (err: unknown) {
      setError(ErrorToText(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { response, loading, error, doFetch };
};

export default useFetchBackend;
