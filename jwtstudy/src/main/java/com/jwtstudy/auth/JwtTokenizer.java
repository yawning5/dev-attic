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

public class JwtTokenizer { // jwt 생성 및 검증하는 클래스

    // JWT의 서명에 사용할 Secret Key를 생성
    private Key getKeyFromBase64EncodedKey(String base64EncodedSecretKey) {
        // Base64형식으로 인코딩 된 SecretKey를 디코딩 한 후, byte array반환.
        byte[] keyBytes = Decoders.BASE64.decode(base64EncodedSecretKey);
        // key byte array를 기반으로 적절한 HMAC 알고리즘을 사용한
        // Key(java.Security.Key)객체 생성
        Key key = Keys.hmacShaKeyFor(keyBytes);

        return key;
    }

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

    // refresh 토큰을 생성해주는 메서드
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

    // jwt 검증관련 메서드
    // jjwt(java Jwt)에서는 jwt를 생성할 때 서명에 사용된 SecretKey를 이용해 내부적으로
    // Signature를 검증한 후, 검증에 성공하면 JWT를 파싱 해서 Claims(인증된 사용자 정보)를 얻을 수 있다.
    // 인자로는 jws = 완전한 jwt 토큰, 해당 jwt토큰을 생성할때 사용한 비밀키 = base64...key
    public void verifySignature(String jws, String base64EncodedSecretkey) {
        // Base64로 인코딩된 비밀키를 실제 키 객체로 반환한다.
        Key key = getKeyFromBase64EncodedKey(base64EncodedSecretkey);

        Jwts.parserBuilder()
                // 검증에 사용될 Secret Key 설정
                // key는 jwt가 생성될 때 사용된 것과 동일한 키여야함
                // 다른 키면 parseClaimsJws 단계에서 검증 실패
                .setSigningKey(key)
                // 설정된 정보를 바탕으로 jwt파서 객체 생성
                // jwt 파서 객체란?
                // jwt 문자열을 해석하고 그 구조를 분석해서 jwt의 클레임이나
                // 다른 부분들을 추출하거나 jwt의 유효성을 검증하는 역할을 함
                // 파서는 주어진 데이터나 문서를 해석하고, 그 구조를 분석하는 역할을 하는 객체나 도구
                .build()
                // jwt를 파싱해서 claims를 얻는다(jwt의 페이로드 부분)
                // 위에서 생성된 파서 객체의 parseClaimsJws(jws) 메서드를 호출하여 jwt를 파싱하고
                // 이때 입력된 jws 문자열(전체 jwt)내의 시그니처 부분이 'key'를 사용해서 생성 됐는지 검증.
                // 시그니처 잘못됐거나 jwt변조면 예외 발생
                // 여기서 받는 jws는 완전한 jwt 토큰이여야함.
                .parseClaimsJws(jws);
    }
}