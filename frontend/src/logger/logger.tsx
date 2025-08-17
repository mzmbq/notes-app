import { logger } from "react-native-logs";

// idk if this is the best way to do it, but it works
export type Logger = ReturnType<typeof logger.createLogger>;

export const log: Logger = logger.createLogger();
