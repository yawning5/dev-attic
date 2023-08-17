package com.jwtstudy;

import com.jwtstudy.auth.JwtTokenizer;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.io.Decoders;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class JwtTokenizerTest {
    private static JwtTokenizer jwtTokenizer;
    private String secretKey;
    private String base64EncodedSecretKey;

    @BeforeAll
    public void init() {
        jwtTokenizer = new JwtTokenizer();
        secretKey = "kevin1234123412341234123412341234";

        // Secret Key를 Base64 형식으로 인코딩한 후, 인코딩 된 Secret Key를
        // 각 테스트 케이스에서 사용
        base64EncodedSecretKey = jwtTokenizer.encodedBase64SecretKey(secretKey);
    }

    @Test
    public void encodeBase64SecretKeyTest() {
        System.out.println(base64EncodedSecretKey);
        // Secret Key가 인코딩이 잘 됐는지 디코딩한 값이랑 비교
        assertThat(secretKey, is(new String(Decoders.BASE64.decode(base64EncodedSecretKey))));
    }

    @Test
    public void generateAccessTokenTest() {
        Map<String, Object> claims = new HashMap<>();
        claims.put("memberId", 1);
        claims.put("roles", List.of("USER"));

        String subject = "test access token";
        // 현재 날짜와 시간으로 초기화 된 calendar 객체를 가져옴
        Calendar calendar = Calendar.getInstance();
        // 현재 시간에 10분을 더함
        calendar.add(Calendar.MINUTE, 10);
        Date expiration = calendar.getTime();
        // 위의 정보를 바탕으로 jwt토큰 생성
        String accessToken = jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);

        System.out.println(accessToken);
        //jwt는 생성할 때 마다 그 값이 바뀌어서 생성된 Access Token이 null이 아닌지만 확인
        assertThat(accessToken, notNullValue());
    }

    @Test
    public void generateRefreshTokenTest() {
        String subject = "test refresh token";
        // 현재 날짜와 시간으로 초기화 된 calendar 객체를 가져옴
        Calendar calendar = Calendar.getInstance();
        // 현재 시간에 24시간을 더함
        calendar.add(Calendar.HOUR, 24);
        Date expiration = calendar.getTime();

        // Refresh Token을 정상적으로 생성 하는지 테스트
        String refreshToken = jwtTokenizer.generateRefreshToken(subject, expiration, base64EncodedSecretKey);

        System.out.println(refreshToken);

        assertThat(refreshToken, notNullValue());
    }

    // jwt에서 쓰는 Key 객체를 얻는 과정
    private String getAccessToken(int timeUnit, int timeAmount) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("memberId", 1);
        claims.put("roles", List.of("USER"));

        String subject = "test access token";
        Calendar calendar = Calendar.getInstance();
        calendar.add(timeUnit, timeAmount);
        Date expiration = calendar.getTime();

        // 위의 설정들은 전부다 jwt를 얻기위해 들어갈 인자들을 설정해준 것 뿐이다.
        // 여기서 위의 정보를 기반으로 한 jwt생성
        String accessToken = jwtTokenizer.generateAccessToken(claims, subject, expiration, base64EncodedSecretKey);

        return accessToken;
    }

    // JwtTokenizer 의 verifySignature() 메서드가 Signature을 잘 검증하는지 테스트
    // 예외 안 나면 잘 검증중인 것
    @DisplayName("does not throw any Exception when jws verify")
    @Test
    public void verifySignatureTest() {
        String accessToken = getAccessToken(Calendar.MINUTE, 10);
        assertDoesNotThrow(() -> jwtTokenizer.verifySignature(accessToken, base64EncodedSecretKey));
    }

    // Jwt 생성 시 지정한 만료일시가 지나면 Jwt가 진짜 만료되는지 검증
    // 예외 발생해야 잘 작동되고 있는 거임
    @DisplayName("throw ExpiredJwtException when jws verify")
    @Test
    public void verifyExpirationTest() throws InterruptedException {
        String accessToken = getAccessToken(Calendar.SECOND, 1);
        assertDoesNotThrow(() -> jwtTokenizer.verifySignature(accessToken, base64EncodedSecretKey));

        TimeUnit.MICROSECONDS.sleep(1500);

        assertThrows(ExpiredJwtException.class, () -> jwtTokenizer.verifySignature(accessToken, base64EncodedSecretKey));
    }
}
