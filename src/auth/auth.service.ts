import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { matchPassword } from 'src/shared/utils/hash.utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) throw new NotFoundException('User Not Found');

    const isPassword = await matchPassword(password, user.password);
    if (!isPassword) throw new UnauthorizedException();

    const role =
      user.email === this.configService.get<string>('ADMIN')
        ? 'admin'
        : 'organization';

    const payload = { id: user.id, role };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
