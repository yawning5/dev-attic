package com.jwtstudy.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;

public class JwtTokenizer { // jwt를 생성하고 검증하는 역할

    // Plain Text의 secretKey를 Base64로 암호화
    public String encodedBase64SecretKey(String secretKey) {
        return Encoders.BASE64.encode(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    // 인증된 사용자에게 JWT를 '최초'로 발급해 주기 위한 JWT 생성 메서드
    public String generateAccessToken(Map<String, Object> claims,
                                      String subject,
                                      Date expiration,
                                      String base64EncodedSecretKey) {
        // Base64 형식 Secret Key 문자열을 이용해서Key(java.security.Key)객체를 얻는다
        Key key = getKeyFromBase64EncodedKey(base64EncodedSecretKey);

        return Jwts.builder()
                // JWT에 포함시킬 Custom Claims 추가
                // Custom Claims에는 주로 인증된 사용자와 관련된 정보가 들어감
                .setClaims(claims)
                // JWT에 대한 제목을 추가
                .setSubject(subject)
                // JWT 발행일자 설정
                .setIssuedAt(Calendar.getInstance().getTime())
                // JWT 만료일시 지정
                .setExpiration(expiration)
                // 서명을 위한 Key(java.security.Key) 객체를 설정
                .signWith(key)
                // JWT 생성 및 직렬화
                .compact();
    }

    public String generateRefreshToken(String subject, Date expiration, String base64EncodedSecretKey) {
        Key key = getKeyFromBase64EncodedKey(base64EncodedSecretKey);

        return Jwts.builder()
                // .setClaims(claims) 왜 없나요
                // Access Token을 새로 발급해 주는 역할을 하는 토큰이라 사용자 정보가 필요 없다.
                .setSubject(subject)
                .setIssuedAt(Calendar.getInstance().getTime())
                .setExpiration(expiration)
                .signWith(key)
                .compact();
    }

    // JWT의 서명에 사용할 Secret Key를 생성
    private Key getKeyFromBase64EncodedKey(String base64EncodedSecretKey) {
        // Base64형식으로 인코딩 된 SecretKey를 디코딩 한 후, byte array반환.
        byte[] keyBytes = Decoders.BASE64.decode(base64EncodedSecretKey);
        // key byte array를 기반으로 적절한 HMAC 알고리즘을 사용한
        // Key(java.Security.Key)객체 생성
        Key key = Keys.hmacShaKeyFor(keyBytes);

        return key;
    }
}
