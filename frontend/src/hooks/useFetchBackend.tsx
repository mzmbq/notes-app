import { useState } from "react";
import { ErrorToText } from "../utils/errors";
import { log } from "../logger/logger";
import { useAuth } from "./useAuth";

// export type FetchParams = {
//   url: string;
//   init?: RequestInit;
// };

// const isValidResponse = <T,>(response: any): response is T => {
//   return response !== null && typeof response === "object";
// };

// export const useFetchBackend2 = <ReqT, ResT>(
//   url: string,
//   init?: RequestInit
// ): {
//   response: ResT | null;
//   loading: boolean;
//   error: string;
//   doFetch: (req: ReqT) => Promise<ResT>;
// } => {
//   const [response, setResponse] = useState<ResT | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const auth = useAuth();
//   const token = auth.state.token;

//   const doFetch = async (req: ReqT): Promise<ResT> => {
//     setLoading(true);
//     setError("");
//     try {
//       log.debug("Fetching data with request:", req, "url:", url);

//       const result = await fetch(url, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!isValidResponse<ResT>(result)) {
//         throw new Error(`Resonse type is invalid`);
//       }

//       log.debug("Fetch result:", result);
//       setResponse(result);
//       return result;
//     } catch (err: unknown) {
//       setError(ErrorToText(err));
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { response, loading, error, doFetch };
// };

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
