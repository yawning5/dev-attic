import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; 

/**
 * NestJS 의 서비스 클래스가 Prisma 의 데이터 베이스 클라이언트 역할까지 직접 맡도록 함
 * 이렇게 하면 PrismaService 를 통해 바로 DB 쿼리 등 Prisma 기능을 사용할 수 있음
 * OnModuleInit, OnModuleDestroy 인터페이스를 구현하여 NestJS 모듈의 생명주기에 맞춰 Prisma 클라이언트 연결과 해제를 관리함
 * @export
 * @class PrismaService
 * @extends {PrismaClient}
 * @implements {OnModuleInit} // NestJS 모듈 초기화 시 Prisma 클라이언트 연결
 * @implements {OnModuleDestroy} // NestJS 모듈 종료 시 Prisma 클라이언트 연결 해제
 */
@Injectable()

export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    async onModuleInit() {
        await this.$connect();
    }
    
    async onModuleDestroy() {
        await this.$disconnect();
    }   
}
