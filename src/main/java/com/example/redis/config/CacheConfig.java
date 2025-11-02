package com.example.redis.config;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.CacheKeyPrefix;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.RedisSerializer;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public RedisCacheManager cacheManager(
        RedisConnectionFactory redisConnectionFactory
    ) {
        // 설정 구성을 먼저 진행한다.
        // Redis 를 이용해서 Spring Cache 를 사용할 때
        // Redis 관련 설정을 모아두는 클래스
        RedisCacheConfiguration configuration = RedisCacheConfiguration
            .defaultCacheConfig()
            // null 을 캐싱하는지
            .disableCachingNullValues()
            // 기본 캐시 유지 시간 (Time To Live)
            .entryTtl(Duration.ofSeconds(10))
            // 캐시를 구분하는 접두사 설정
            .computePrefixWith(CacheKeyPrefix.simple())
            // 캐시에 저장할 값을 어떻게 직렬화 / 역직렬화 할것인지
            .serializeValuesWith(
                RedisSerializationContext
                    .SerializationPair
                    .fromSerializer(RedisSerializer.java())
            );

        return RedisCacheManager
            .builder(redisConnectionFactory)
            .cacheDefaults(configuration)
            // 캐시 네임에 따른 별도 컨피그레이션 설정하는 메서드
//            .withInitialCacheConfigurations()
            .build();
    }
}
