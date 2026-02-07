package com.example.redis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericToStringSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Integer> articleTemplate(
            RedisConnectionFactory redisConnectionFactory
    ) {
        RedisTemplate<String, Integer> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        // 이 key Serializer 안 넣으면 String 키가 바이트코드로 변환되서 저장됨
        template.setKeySerializer(RedisSerializer.string());
        // 스프링 내부에서 리퀘스트 바디나 리스폰스 바디 변환할때 사용되는 그 기능을 사용하는 것
        // 문자열 byte 배열을 정수로서 번역해서 진행을 하려고하는 Serializer
        // 저장 -> 정수, 가지고 오는 것 -> 정수
        template.setValueSerializer(new GenericToStringSerializer<>(Integer.class));
        return template;
    }
}
