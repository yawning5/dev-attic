//package com.chatting.chat.pubsub;
//
//import com.chatting.chat.dto.ChatMessage;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.listener.ChannelTopic;
//import org.springframework.stereotype.Service;
//
//import java.nio.channels.Channel;
//
///**
// * 채팅방에 입장하여 메시지를 작성하면 해당 메시지를 Redis Topic에 발행하는 기능의 서비스
// * 이 서비스를 통해 메시지를 발행하면 대기하고 있던 redis 구독 서비스가 메시지를 처리한다
// */
//@RequiredArgsConstructor
//@Service
//public class RedisPublisher {
//    private final RedisTemplate<String, Object> redisTemplate;
//
//    public void publish(ChannelTopic topic, ChatMessage message) {
//        redisTemplate.convertAndSend(topic.getTopic(), message);
//    }
//}

/**
 * basic4-2
 * 메시지 리스너 단일화 및 redisTemplate을 이용하여 기능 대체가 가능하므로 삭제
 */