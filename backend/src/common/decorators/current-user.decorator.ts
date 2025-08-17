// common/decorators/current-user.decorator.ts
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { CurrentUser as CurrentUserPayload } from "notes-app-types";

export const CurrentUser = createParamDecorator<CurrentUserPayload>(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const req = ctx.switchToHttp().getRequest<{ user?: CurrentUserPayload }>();

    if (!req.user) {
      throw new UnauthorizedException();
    }

    return req.user;
  },
);
