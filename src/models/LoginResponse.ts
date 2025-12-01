// models/LoginResponse.ts
import { User } from "./User";

export class LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;

  constructor(user: User, accessToken: string, refreshToken: string) {
    this.user = user;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static fromJson(json: any): LoginResponse {
    const user = User.fromJson(json.user);
    return new LoginResponse(user, json.accessToken, json.refreshToken);
  }

  toJson(): Record<string, any> {
    return {
      user: this.user.toJson(),
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
    };
  }

  getAuthHeader(): string {
    return `Bearer ${this.accessToken}`;
  }
}
