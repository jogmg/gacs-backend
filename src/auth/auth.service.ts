import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { matchPassword } from 'src/shared/utils/hash.utils';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async sigIn(userEmail: string, userPassword: string) {
    const user = await this.userService.findOneByEmail(userEmail);
    if (!user) throw new NotFoundException('User Not Found');

    const isPassword = await matchPassword(userPassword, user?.password!);
    if (!isPassword) throw new UnauthorizedException();

    const payload = { sub: user?.id, email: user?.email };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
