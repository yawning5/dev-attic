package com.chatting.chat.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import redis.embedded.RedisServer;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

/**
로컬 환경일경우 내장 레디스가 실행된다.
 */
@Profile("local")
@Configuration
public class EmbeddedRedisConfig {

    @Value("${spring.redis.port}")
    private int redisPort;

    private RedisServer redisServer;

    // 해당 어노테이션이 붙은 메서든느 빈이 생성된 후 자동으로 한 번 실행됨
    // 빈이 초기화될 때 Redis 서버를 시작하는 로직을 담고 있다.
    @PostConstruct
    public void redisServer() {
        redisServer = new RedisServer(redisPort);
        redisServer.start();
    }

    // 해당 어노테이션은 빈이 제거되기 전에 자동으로 한 번 실행된다.
    // 애플리케이션이 종료되기 전에 Redis 서벌르 중지하는 로직을 담고 있다.
    @PreDestroy
    public void stopRedis() {
        if (redisServer != null) {
            redisServer.stop();
        }
    }
}
