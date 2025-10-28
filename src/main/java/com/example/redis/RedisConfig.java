package com.example.redis;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.RedisSerializer;

@Configuration
public class RedisConfig {
    @Bean
    public RedisTemplate<String, ItemDto> itemDtoRedisTemplate(
        RedisConnectionFactory connectionFactory
    ) {
        RedisTemplate<String, ItemDto> template
            = new RedisTemplate<>();
        // redis 연결관리 yml 세팅정보를 바탕으로 동작
        template.setConnectionFactory(connectionFactory);
        // redis 키 직렬화시 어떤 직렬화를 쓸 것인지
        template.setKeySerializer(RedisSerializer.string());
        // redis 값 직렬화시 어떤 직렬화를 쓸 것인지
        template.setValueSerializer(RedisSerializer.json());
        return template;
    }

}
