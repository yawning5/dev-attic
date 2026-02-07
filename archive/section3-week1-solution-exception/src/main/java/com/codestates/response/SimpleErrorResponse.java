package com.codestates.response;

import com.codestates.exception.ExceptionCode;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * <h3>애플리케이션 예외 처리 실습 과제용 Solution 코드 포함</h3>
 * ErrorResponse는 애플리케이션에서 발생하는 예외를 이용해 클라이언트 측에 전달할 response body에 매핑되는 클래스입니다.
 *
 * status 필드와 message 필드만 가지고 있는 ErrorResponse입니다.
 * Solution 코드에 포함되는 코드는 아래와 같습니다.
 * <ul>
 *     <li>int status</li>
 *     <li>String message</li>
 *     <li>private ErrorResponse(int status, String message)</li>
 *     <li>{@link #of(ExceptionCode)}</li>
 *     <li>{@link #of(HttpStatus)}</li>
 *     <li>{@link #of(int, String)}</li>
 * </ul>
 */
@Getter
public class SimpleErrorResponse {

    private Integer status;
    private String message;

    /**
     * Http Status와 에러 메시지를 생성자 파라미터로 전달 받아 ErrorResponse의 status와 message 필드를 초기화 해줍니다.
     *
     * @param status    Http Status
     * @param message   에러 메시지
     */
    private SimpleErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }


    /**
     * {@link ExceptionCode}를 통해 ErrorResponse의 status와 message를 제공합니다.
     *
     * @param exceptionCode 발생한 예외의 {@link ExceptionCode} 정보
     * @return  ErrorResponse 객체
     */
    public static SimpleErrorResponse of(ExceptionCode exceptionCode) {
        return new SimpleErrorResponse(exceptionCode.getStatus(), exceptionCode.getMessage());
    }

    /**
     * <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/HttpStatus.html" target="_blank">
     *     HttpStatus
     * </a>를 통해 ErrorResponse의 status와 message를 제공합니다.
     * @param httpStatus 발생한 예외의 Http Status 정보
     * @return  ErrorResponse 객체
     */
    public static SimpleErrorResponse of(HttpStatus httpStatus) {
        return new SimpleErrorResponse(httpStatus.value(), httpStatus.getReasonPhrase());
    }

    /**
     * Http Status와 에러 메시지를 파라미터로 전달 받아 ErrorResponse의 status와 message 필드를 초기화 해줍니다.
     *
     * @param status    Http Status
     * @param message   에러 메시지
     * @return
     */
    public static SimpleErrorResponse of(int status, String message) {
        return new SimpleErrorResponse(status, message);
    }
}