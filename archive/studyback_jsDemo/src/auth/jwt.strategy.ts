import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"; 
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || 'defaultSecretKey',
        });
    }

    async validate(payload: any) {
        // payload에는 JWT 토큰에서 추출한 사용자 정보가 담겨 있습니다.
        // 필요한 경우 추가적인 검증 로직을 여기에 작성할 수 있습니다.
        return { id: payload.sub, email: payload.email };
    }
}