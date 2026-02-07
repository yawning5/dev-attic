package com.chatting.chat.config.handler;

import com.chatting.chat.dto.ChatMessage;
import com.chatting.chat.repository.ChatRoomRepository;
import com.chatting.chat.service.ChatService;
import com.chatting.chat.service.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import javax.swing.text.html.Option;
import java.nio.channels.Channel;
import java.security.Principal;
import java.util.Optional;


/**
 * basic5
 * 추가내용
 * StompHandler에서는 클라이언트의 액션에 따른 이벤트를 다음 정보로 캐치할 수 있음
 * - 채팅방 입장시 이벤트: StompCommand.SUBSCRIBE
 * - 채팅방 퇴장시 이벤트: StompCommand.DISCONNECT
 * <p>
 * 채팅방 입장/퇴장 시 이벤틀르 체크할 수 있므로 입장/퇴장 시 채팅룸의 인원수도 +-처리가 가능하다.
 * Redis에 관련 정보를 저장하고 불러오는 방식으로 구현 예정
 * - 채팅방 입장시 채팅방 인원수를 +1 갱신하여 캐시에 저장한다.
 * ㄴ 이때 해당 클라이언트 세션이 어떤 채팅방에 들어가있는지 sessionId와 roomId를 조합하여 캐시를 남겨놓는다
 * <p>
 * - 채팅방 퇴장시 채팅방 인원수를 -1 갱신해서 캐시에 저장한다.
 * ㄴ 퇴장시에는 해당 클라이언트 세션이 어떤 방에서 퇴장된것인지 정보를 알수 없으므로
 * 위에서 저장한 sessionId와 roomId를 조합한 캐시에서 채팅방 정보를 얻어 인원수를 -1로 갱신한다
 */
@Slf4j
@RequiredArgsConstructor
@Component
// ChannelInterceptor -> Spring 에서 제공하는 Stomp메시지를 처리하기 전후에 로직을 실행할 수 있게 해주는 인터페이스
public class StompHandler implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;

    // websocket을 통해 들어온 요청이 처리 되기전 실행된다.
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        /*
        StompHeaderAccessor 를 통해 메시지의 메타데이터에 접근할 수 있게 도와준다.
        StompHeaderAccessor.warp(message)를 통해 원본 메시지를 래핑하고 이후
        StompHeaderAccesser 의 메서드를 이용해서 헤더 정보를 관리하고 추출 가능
         */
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        // websocket 연결시 헤더의 jwt token 검증
        if (StompCommand.CONNECT == accessor.getCommand()) { // webSocket 연결요청
            String jwtToken = accessor.getFirstNativeHeader("token");
            log.info("CONNECT {}", jwtToken);
            // Header 의 jwt token 검증
            jwtTokenProvider.validateToken(jwtToken);

            //채팅룸 구독요청
        } else if (StompCommand.SUBSCRIBE == accessor.getCommand()) {

            // header 정보에서 구독 destination 정보를 얻고, roomId 를 추출한다.
            String roomId = chatService.getRoomId(Optional.ofNullable((String) message.getHeaders().get("simpDestination"))
                    .orElse("InvalidRoomId"));

            // 채팅방에 들어온 클라이언트 sessionId 를 roomId 와 매핑해 놓는다.
            // (나중에 특정 세션이 어떤 채팅방에 들어가 있는지 알기 위함)
            String sessionId = (String) message.getHeaders().get("simpSessionId");
            chatRoomRepository.setUserEnterInfo(sessionId, roomId);

            // 채팅방의 인원수를 +1 한다.
            chatRoomRepository.plusUserCount(roomId);

            // 클라이언트 입장 메시지를 채팅방에 발송한다. (redis publish)
            String name = Optional.ofNullable((Principal) message.getHeaders().get("simpUser"))
                    .map(Principal::getName)
                    .orElse("UnknownUser");
            chatService.sendChatMessage(ChatMessage.builder()
                    .type(ChatMessage.MessageType.ENTER)
                    .roomId(roomId)
                    .sender(name)
                    .build()
            );
            log.info("SUBSCRIBED {}, {}", name, roomId);
        } else if (StompCommand.DISCONNECT == accessor.getCommand()) { // Websocket 연결 종료
            // 연결이 종료된 클라이언트 sessionId로 채팅방 id를 얻는다.
            String sessionId = (String) message.getHeaders().get("simpSessionId");
            String roomId = chatRoomRepository.getUserEnterRoomId(sessionId);

            // 채팅방의 인원수를 -1한다.
            chatRoomRepository.minusUserCount(roomId);

            /*
            클라이언트 퇴장 메시지를 채팅방에 발송한다.(redis publish)
            "simpUser"는 무엇인가
            Spring Security가 설정 되어 있을 경우, Http 세션에 저장된 Security Context가 WebSocket 과 공유될 수 있는데
            이 때 사용자가 WebSocket에 연결할 때 이미 인증된 상태라면,
            해당 인증 정보('Principal' 객체 포함)가 WebSocket 세션에 자동 할당

            이렇게 되면, WebSocket 메시지를 처리하는 동안에도 'simpUser' 헤더를 통해 인증된 사용자의 정보를 가져올 수 있음
             */
            String name = Optional.ofNullable((Principal) message.getHeaders().get("simpUser"))
                    .map(Principal::getName)
                    .orElse("UnknownUser");
            chatService.sendChatMessage(ChatMessage.builder()
                    .type(ChatMessage.MessageType.QUIT)
                    .roomId(roomId)
                    .sender(name)
                    .build()
            );

            // 퇴장한 클라이언트의 roomId 매핑 정보를 삭제한다
            chatRoomRepository.removeUserEnterInfo(sessionId);
            log.info("DISCONNECTED {}, {}", sessionId, roomId);
        }
        return message;
    }
}
