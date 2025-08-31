import { Transform, TransformFnParams } from "class-transformer";

export const TrimString = () =>
  Transform(({ value }: TransformFnParams) => {
    if (typeof value !== "string") {
      throw new Error("TrimString can only be applied to string properties");
    }
    return value.trim();
  });
