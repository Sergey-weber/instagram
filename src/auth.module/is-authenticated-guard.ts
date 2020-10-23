import { CanActivate, ExecutionContext } from '@nestjs/common';

export class IsAuthenticatedGuard implements CanActive {
  canActive(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    return !!user;
  }
}