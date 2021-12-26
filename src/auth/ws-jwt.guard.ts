import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    try {
      // Особым образом извлекаем информацию о клиенте
      const client = context.switchToWs().getClient();
      // Извлекаем токен
      const authToken: string =
        client.handshake.headers.authorization.split(' ')[1];
      // Вызываем метод проверки токена из сервиса authService
      const user = await this.authService.verify(authToken);
      if (user) {
        // Информацию о пользователе записываем в поле data нашего клиента
        context.switchToWs().getClient().data.user = user;
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }
}
