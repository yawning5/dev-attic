package com.chatting.chat.repository;

import com.chatting.chat.dto.ChatRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Repository
/*
basic2
채팅방을 생성하고 정보르 조회하는 Repository를 생성한다 실습에서는 간단하게 만들거라 채팅방 정보를 Map으로 관리하지만
서비스에선s DB나 다른 저장 매체에 채팅방 정보를 저장하도록 구현해야 함.
ChatRoomRepository가 ChatService를 대체할거임
 */

/*
 * 채팅방 정보는 초기화 되지 않도록 생성 시 Redis Hash에 저장하도록 처리.
 * 채팅방 정보를 조회할 때는 Redis Hash에 저장된 데이터를 불러오도록 메서드 내용을 수정
 * 채팅방 입장 시에는 채팅방 id로 Redis topic을 조회하여 pub/sub 메시지 리스너와 연동한다.
 */

/*
 * basic4-2
 * 채팅방 입장시 Topic을 신규로 생성하고, redisMessageListner와 연동시키던 작업이 모두 필요없게 되어
 * 다음과 같이 코드 간소화가 된다
 */

/*
 * basic5
 * 채팅방에 관련된 데이터를 한 곳에서 처리하기 위해서 수정
 */
public class ChatRoomRepository {
////    private Map<String, ChatRoom> chatRoomMap;
//    // 채팅방 (topic)에 발행되는 메시지를 처리할 Listner
//    private final RedisMessageListenerContainer redisMessageListener;
//    // 구독 처리 서비스
//    private final RedisSubscriber redisSubscriber;
    // Redis
    private static final String CHAT_ROOMS = "CHAT_ROOM";
    public static final String USER_COUNT = "USER_COUNT";
    public static final String ENTER_INFO = "ENTER_INFO";

    @Resource(name = "redisTemplate")
    private HashOperations<String, String, ChatRoom> hashOpsChatRoom;
    @Resource(name = "redisTemplate")
    private HashOperations<String, String, String> hashOpsEnterInfo;
    @Resource(name = "redisTemplate")
    private ValueOperations<String, String> valueOps;

//    private final RedisTemplate<String, Object> redisTemplate;

    // 채팅방의 대화 메시지를 발행하기 위한 redis topic 정보
    // 서버별로 채팅방에 매치되는 topic 정보를 Map에 넣어 roomId로 찾을 수 있도록 한다
//    private Map<String, ChannelTopic> topics;

//    @PostConstruct
//    private void  init(){
//        hashOpsChatRoom = redisTemplate.opsForHash();
////        topics = new HashMap<>();
//    }

    // 모든 채팅방 조회
    public List<ChatRoom> findAllRoom() {
        return hashOpsChatRoom.values(CHAT_ROOMS);
    }

    // 특정 채팅방 조회
    public ChatRoom findRoomById(String id) {
        return hashOpsChatRoom.get(CHAT_ROOMS, id);
    }

    // 채팅방 생성: 서버간 채팅방 공유를 위해 redis hash에 저장한다.
    public ChatRoom createChatRoom(String name) {
        ChatRoom chatRoom = ChatRoom.create(name);
        hashOpsChatRoom.put(CHAT_ROOMS, chatRoom.getRoomId(), chatRoom);
        return chatRoom;
    }

    // 아래부터 basic5 추가내용

    // 유저가 입장한 채팅방ID 와 유저 세션 ID 매핑 정보 저장
    public void setUserEnterInfo(String sessionId, String roomId) {
        hashOpsEnterInfo.put(ENTER_INFO, sessionId, roomId);
    }

    // 유저 세션으로 입장해 있는 채팅방 ID 조회
    public String getUserEnterRoomId(String sessionId) {
        return hashOpsEnterInfo.get(ENTER_INFO, sessionId);
    }

    // 유저 세션정보와 매핑된 채팅방 Id 삭제
    public void removeUserEnterInfo(String sessionId) {
        hashOpsEnterInfo.delete(ENTER_INFO, sessionId);
    }

    // 채팅방 유저수 조회
    public long getUserCount(String roomId) {
        return Long.valueOf(Optional.ofNullable(valueOps.get(USER_COUNT + "_" + roomId)).orElse("0"));
    }

    // 채팅방에 입장한 유저수 +1
    public long plusUserCount(String roomId) {
        return Optional.ofNullable(valueOps.increment(USER_COUNT + "_" + roomId)).orElse(0L);
    }

    // 채팅방에 입장한 유저수 -1
    public long minusUserCount(String roomId) {
        return Optional.ofNullable(valueOps.decrement(USER_COUNT + "_" + roomId)).filter(count -> count > 0).orElse(0L);
    }

//    basic4-2
//    /**
//     * 채팅방 입장: redis에 topic을 만들고 pub/sub 통신을 하기 위해 리스너를 설정한다.
//     * @param roomId
//     */
//    public void enterChatRoom(String roomId) {
//        ChannelTopic topic = topics.get(roomId);
//        if (topic == null) {
//            topic =  new ChannelTopic(roomId);
//            redisMessageListener.addMessageListener(redisSubscriber, topic);
//            topics.put(roomId, topic);
//        }
//    }
//
//    public ChannelTopic getTopic(String roomId) {
//        return topics.get(roomId);
//    }
}
