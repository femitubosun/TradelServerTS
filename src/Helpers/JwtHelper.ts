import { jwtConfig } from "Config/index";
import jwt from "jsonwebtoken";
import { IUser } from "Logic/Services/Users/TypeChecking";
import { UnauthenticatedError } from "Exceptions/UnauthenticatedError";

export class JwtHelper {
  public static signUser(user: IUser) {
    const token = jwt.sign(
      {
        identifier: user.identifier,
        email: user.email,
      },
      jwtConfig.jwtSecret,
      {
        expiresIn: "2d",
        algorithm: "HS256",
      }
    );
    const decoded = this.verifyToken(token);

    return token;
  }

  public static verifyToken(token: string) {
    const secret = jwtConfig.jwtSecret;
    try {
      const decoded = jwt.verify(token, secret, {
        algorithms: ["HS256"],
      });
      return decoded;
    } catch (err) {
      throw new UnauthenticatedError();
    }
  }
}
