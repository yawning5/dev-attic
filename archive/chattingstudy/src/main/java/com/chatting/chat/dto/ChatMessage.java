package com.chatting.chat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
/*
채팅 메시지 구현 -> 채팅 메시지를 주고받기 위한 Dto를 만든다
채팅방에 입장, 메시지 보내기 두가지 상황이있어 2가지 enum을 선언
 */
public class ChatMessage {

    // basic5 추가내용
    @Builder
    public ChatMessage(MessageType type, String roomId, String sender, String message, long userCount) {
        this.type = type;
        this.roomId = roomId;
        this.sender = sender;
        this.message = message;
        this.userCount = userCount;
    }

    // 메시지 타입: 입장, 채팅
    // basic5 추가 -> userCount와 QUIT상수 추가
    public enum MessageType {
        ENTER, QUIT, TALK
    }
    private MessageType type;
    private String roomId;
    private String sender;
    private String message;
    private long userCount;
}
