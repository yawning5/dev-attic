package com.chatting.chat.pubsub;

import com.chatting.chat.dto.ChatMessage;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

/**
 * basic 4-2
 * 메시지 리스너에 메시지가 수신되면 아래 RedisSubscriber.sendMessage가 수행된다
 * 수신된 메시지는 /sub/chat/room/{roomId}를 구독한 websocket 클라이언트에게 메시지가 발송됨.
 */
@Slf4j
@RequiredArgsConstructor
@Service
public class RedisSubscriber {
    private final ObjectMapper objectMapper;
    private final SimpMessageSendingOperations messagingTemplate;

//    /**
//     * Redis에서 메시지가 발행(publish)되면 대기하고 있던 onMessage가 해당 메시지를 받아 처리한다.
//     */
//    @Override
//    public void onMessage(Message message, byte[] pattern) {
//        try {
//            // redis 에서 발행된 데이터를 받아 deserialize
//            String publishMessage = (String) redisTemplate.getStringSerializer().deserialize(message.getBody());
//            // ChatMessage 객체로 매핑
//            ChatMessage roomMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
//            // Websocket 구독자에게 채팅 메시지 Send
//            messagingTemplate.convertAndSend("/sub/chat/room/" + roomMessage.getRoomId(), roomMessage);
//        } catch (Exception e) {
//            log.error(e.getMessage());
//        }
//    }

    /**
     * basic4-2
     * Redis에서 메시지가 발행(publish)되면 대기하고 있던 Redis Subscriber가 해당 메시지를 받아 처리한다
     */
    public void sendMessage(String publishMessage) {
        try {
            //ChatMessage 객체로 매핑
            ChatMessage chatMessage = objectMapper.readValue(publishMessage, ChatMessage.class);
            // 채팅방을 구독한 클라이언트에게 메시지 발송
            messagingTemplate.convertAndSend("/sub/chat/room/" + chatMessage.getRoomId(), chatMessage);
        } catch (Exception e) {
            log.error("Exception {}", e);
        }
    }
}
