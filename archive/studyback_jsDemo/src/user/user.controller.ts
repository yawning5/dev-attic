import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('signup')
    async signUp(@Body() body: { email: string; password: string }) {
        const user = await this.userService.signUp(body.email, body.password);
        return {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
        }
    }
}
