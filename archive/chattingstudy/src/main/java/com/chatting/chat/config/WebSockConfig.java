package com.chatting.chat.config;

import com.chatting.chat.config.handler.StompHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
/*
Stomp를 사용하기 위해서 @EnableWebSocketMessageBroker를 선언하고
WebSocketMessageBrokerConfigurer를 상속받아 configureMessageBroker를 구현한다  -> WebSocketConfigurer와 다른점은 복잡한 기능 지원
pub/sub 메시징을 구현하기 위해 메시지를 발행하는 요청의 prefix는 /pub로 시작하도록 설정하고
메시지를 구독하는 요청의 profix는 /sub으로 시작하도록 설정한다. 그리고 stomp websocket의 연결 endpoint는 /ws-stomp로 설정
개발서버의 접속 주소는 다음과 같이 된다. ws://localhost:8080/ws-stomp
 */
public class WebSockConfig implements WebSocketMessageBrokerConfigurer {

    private final StompHandler stompHandler;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/sub");
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-stomp").setAllowedOriginPatterns("*")
                // 목적은 웹소켓 연결이 가능하지 않을 때
                // (예: 웹소켓을 지원하지 않는 브라우저, 인터넷 중간에 프록시나 방화벽이 있어 웹소켓을 차단하는 경우)에도
                // 가능한 가장 유사한 대체 수단을 사용하여 통신할 수 있게 하는 것입니다.
                .withSockJS(); // 이거 있으면 apic 테스트가 안 됨;
    }

    @Override
    // 위에 생성한 StompHandler가 WebSocket 앞단에서 token을 체크할 수 있도록 다음과 같이 인터셉터로 설정한다.
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(stompHandler);
    }
}
