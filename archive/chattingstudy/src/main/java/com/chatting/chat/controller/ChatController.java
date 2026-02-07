package com.chatting.chat.controller;

import com.chatting.chat.dto.ChatMessage;
import com.chatting.chat.dto.ChatRoom;
//import com.chatting.chat.pubsub.RedisPublisher;
import com.chatting.chat.repository.ChatRoomRepository;
import com.chatting.chat.service.ChatService;
import com.chatting.chat.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
//@RequestMapping("/chat") -> basic2의 변경점
/*
basic2
publisher구현
@MessageMapping을 통해 WebSocket으로 들어오는 메시지 발행을 처리한다
클라이언트에서 prefix를 붙여서 /pub/chat/message로 발행요청을 하면 Controller가 해당 메시지를 받아 처리한다
메시지가 발행되면 /sub/chat/room/{roomId}로 메시지를 send하는 것을 볼 수 있는데
클라이언트에서는 해당 주소를 (/sub/chat/room/{roomId}) 구독(subscribe)하고 있다가 메시지가 전달되면 화면에 출력하면 된다.
여기서 /sub/chat/room/{roomId}는 채팅룸을 구분하는 값이므로 pub/sub에서 Topic의 역할이라고 보면된다.
기존의 WebSocketHandler가 했던 역할을 대체하므로 WebSocketHandler는 삭제
 */
/**
 * basic3
 * 클라이언트가 채팅방 입장시 채팅방(topic)에서 대화가 가능하도록 리스너를 연동하는
 * enterChatRoom 메서드를 세팅한다. 채팅방에 발행된 메시지는
 * 서로 다른 서버에 공유하기 위해 redis의 Topic으로 발행
 */
/**
 * basic4
 * Websocket을 통해 서버에 메시지가 Send(/pub/chat/message) 되었을 때도 Jwt token 유효성 검증이 필요
 * 다음과 같이 회원 대화명(id)를 조회하는 코드를 삽입해서 유효성이 체크될 수 있도록 한다.
 * 유효하지 않은 Jwt토큰이 세팅될 경우 websocket을 통해 보낸 메시지는 무시된다.
 */
/**
 * basic4-2
 * 헤더에서 token을 읽어 대화명을 세팅하도록 내용을 변경합니다.
 * 또한 redisPublisher가 삭제되었으므로. redisTemplate을 통해서 바로 ChannelTopic으로 메시지를 발행하도록 수정
 */
/**
 * basic5
 * 서버에서 보내는 메시지(입장, 퇴장) 이외의 대화 메시지는 ChatController 에서 처리한다.
 * 입장 시 메시지 처리 로직이 없어져서 기족 로직에 비해 간소화 되었고
 * ChatService.sendChatMessage 를 사용해서 메서드가 일원화 되었다.
 */
public class ChatController {

//    private final SimpMessageSendingOperations messagingTemplate;
//    private final RedisPublisher redisPublisher;
    private final ChatRoomRepository chatRoomRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate redisTemplate;
    private final ChannelTopic channelTopic;
    private final ChatService chatService;

    /**
     * websocket "/pub/chat/message"로 들어오는 메시징을 처리한다.
     */
    @MessageMapping("/chat/message")
    public void message(ChatMessage message, @Header("token") String token) {
        // jwt에서 닉네임 받아옴 -> 이 과정에 parser가 들어가있어서 jwt 토큰이 이상하면 거절처리 됨
        String nickname = jwtTokenProvider.getUserNameFromJwt(token);
        // 로그인 회원 정보로 대화명 설정
        message.setSender(nickname);
        // 채팅방 인원수 세팅
        message.setUserCount(chatRoomRepository.getUserCount(message.getRoomId()));
        // WebSocket 에 발행된 메시지를 redis 로 발행 (publish)
        chatService.sendChatMessage(message);

        // basic5 입장시 퇴장시 메시지 발송을 ChatService에서 처리하게 바꿈
        // 채팅방 입장시에는 대화명과 메시지를 자동으로 세팅한다.
//        if (ChatMessage.MessageType.ENTER.equals(message.getType())) {
////            chatRoomRepository.enterChatRoom(message.getRoomId());
////            message.setMessage(nickname + "님이 입장하셨습니다.");
//            message.setSender("[알림]");
//            message.setMessage(nickname + "님이 입장하셨습니다.");
//        }
        // Websocket에 발행된 메시지를 redis로 발행한다 (publish)
//        redisPublisher.publish(chatRoomRepository.getTopic(message.getRoomId()), message);
        // basic5 ChatService 에 sendChatMessage 메서드로 채팅을 전송하게 바꿈
//        redisTemplate.convertAndSend(channelTopic.getTopic(), message);
    }
    /*
    구독자(subscriber)구현
    서버단에서 따로 추가할 구현이 없다. 웹뷰에서 stomp 라이브러리를 이용해서 subscriber 주소를 바라보고 있는 코드만 작성하면 됨
     */
}
