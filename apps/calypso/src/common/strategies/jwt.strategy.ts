import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { settings } from '../../settings';
import { DevicesRepository } from '../../features/devices/infrastructure/devices.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private devicesRepository: DevicesRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: settings.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const device = await this.devicesRepository.getInfoAboutDevice(
      payload.deviceId,
    );
    if (device) return { id: payload.userId };
    return false;
  }
}
