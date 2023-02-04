import { jwtConfig } from "AppConfig/index";
import jwt from "jsonwebtoken";
import { IUser } from "Logic/Services/Users/TypeSetting";

export class JwtProvider {
  //  TODO add expiresIn
  public static signUser(user: IUser) {
    return jwt.sign(
      {
        identifier: user.identifier,
        email: user.email,
      },
      jwtConfig.JWT_SECRET
    );
  }

  public static verifyToken(token: string) {
    return jwt.verify(token, jwtConfig.JWT_SECRET);
  }
}
