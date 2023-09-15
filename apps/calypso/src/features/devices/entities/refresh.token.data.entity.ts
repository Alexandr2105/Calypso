export class RefreshTokenDataEntity {
  iat: number;
  exp: number;
  deviceId: string;
  ip: string;
  deviceName: string;
  userId: string;
  dateCreate: Date;

  constructor(
    iat: number,
    exp: number,
    deviceId: string,
    ip: string,
    deviceName: string,
    userId: string,
    dateCreate: Date,
  ) {
    this.iat = iat;
    this.exp = exp;
    this.deviceId = deviceId;
    this.ip = ip;
    this.deviceName = deviceName;
    this.userId = userId;
    this.dateCreate = dateCreate;
  }
}
