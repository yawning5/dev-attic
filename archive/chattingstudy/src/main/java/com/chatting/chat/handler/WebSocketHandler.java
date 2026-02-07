/*
basic2
ChatController에서 해당 클래스가 하던 역할을 하게 되어서 삭제
 */

//package com.chatting.chat.handler;
//
//import com.chatting.chat.dto.ChatMessage;
//import com.chatting.chat.dto.ChatRoom;
//import com.chatting.chat.service.ChatService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
///*
//ChatService에서 만든 로직을 handler에 추가한다
// */
//public class WebSocketHandler extends TextWebSocketHandler {
//
//    private final ObjectMapper objectMapper;
//    private final ChatService chatService;
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload();
//        log.info("payload {}", payload);
////        TextMessage textMessage = new TextMessage("Welcome chatting server");
////        session.sendMessage(textMessage);
//
//        // - 웹소켓 클라이언트로부터 채팅 메시지를 전달받아 채팅 메시지 객체로 변환
//        ChatMessage chatMessage = objectMapper.readValue(payload, ChatMessage.class);
//
//        // - 전달받은 메시지에 담긴 채팅방 Id로 발송 대상 채팅방 정보를 조회
//        ChatRoom room = chatService.findRoomById(chatMessage.getRoomId());
//
//        // - 해당 채팅방에 입장해있는 모든 클라이언트들(Websocket session)에게 타입에 따른 메시지 발송
//        room.handleActions(session, chatMessage, chatService);
//    }
//}
