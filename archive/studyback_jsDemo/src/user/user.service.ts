import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async signUp(email: string, password: string) {
        const hashed = await bcrypt.hash(password, 10);
        return this.prisma.user.create({
            data: {
                email,
                password: hashed,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
}