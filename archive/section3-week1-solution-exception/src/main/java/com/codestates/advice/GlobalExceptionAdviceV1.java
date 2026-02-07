package com.codestates.advice;

import com.codestates.exception.BusinessLogicException;
import com.codestates.exception.ExceptionCode;
import com.codestates.response.ErrorResponseV1;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.validation.ConstraintViolationException;

/**
 * <h3>애플리케이션 예외 처리 실습 과제용 Solution 코드 포함</h3>
 * GlobalExceptionAdvice는 애플리케이션에서 발생하는 예외를 처리하기 위한 다섯 개의 예외 처리 전용 메서드를 포함하고 있습니다.
 * 그 중에서 실습 과제를 위해 구현된 예외 처리 전용 메서드는 아래와 같이 세 개의 메서드입니다.
 *
 * <h4>실습 과제를 위해 구현된 예외 처리 전용 메서드</h4>
 * <ul>
 *     <li>{@link #handleBusinessLogicException(BusinessLogicException)}</li>
 *     <li>{@link #handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException)}</li>
 *     <li>{@link #handleException(Exception)}</li>
 * </ul>
 * @see <a href="https://github.com/codestates-seb/be-solution-exception/blob/94ae2dc4e0ed2ceba9ce304d227a532902251208/src/main/java/com/codestates/exception/BusinessLogicException.java" target="_blank">BusinessLogicException</a>
 * @see <a href="https://github.com/codestates-seb/be-solution-exception/blob/94ae2dc4e0ed2ceba9ce304d227a532902251208/src/main/java/com/codestates/exception/ExceptionCode.java" target="_blank">ExceptionCode</a>
 * @see ErrorResponseV1
 * @see <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseStatus.html" target="_blank">@ResponseStatus</a>
 * @see <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ExceptionHandler.html" target="_blank">@ResponseStatus</a>
 */
@Slf4j
//@RestControllerAdvice
public class GlobalExceptionAdviceV1 {
    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponseV1 handleMethodArgumentNotValidException(
            MethodArgumentNotValidException e) {
        final ErrorResponseV1 response = ErrorResponseV1.of(e.getBindingResult());

        return response;
    }

    @ExceptionHandler
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponseV1 handleConstraintViolationException(
            ConstraintViolationException e) {
        final ErrorResponseV1 response = ErrorResponseV1.of(e.getConstraintViolations());

        return response;
    }

    /**
     * 서비스 계층에서 throw 되는 BusinessLogicException을 catch해서 처리하기 위한 예외 처리 메서드를 구현한 Solution 코드입니다.
     * <p>
     *      <b>Solution 키 포인트</b>
     * </p>
     *
     * <p>
     *  homework에서 요구하는 것은 클라이언트 측에 전달하는 JSON 포맷에서 아래와 같은 status와 message 프로퍼티를 추가하는 것입니다.
     * </p>
     * <pre>
     *  {
     *     "status": 404,
     *     "message": "Member Not Found",
     *     "fieldErrors": null,
     *     "violationErrors": null
     *  }
     * </pre>
     * <ul>
     *     <li>
     *         JSON 포맷의 response body는 Java에서 객체의 필드와 1대1로 매핑이 됩니다. 따라서 {@link ErrorResponseV1} 클래스에
     *         status 필드와 message 필드가 없다면 status 필드와 message 필드를 ErrorResponse에 추가하면 됩니다.
     *         필드를 추가할 경우에는 JSON 프로퍼티에서 표현하는 데이터 타입과 객체의 필드 타입을 적절하게 맞춰 주어야 합니다.
     *         따라서 ErrorResponse에서 status 필드와 messgage 필드를 추가할 수 있도록 {@link ErrorResponseV1#of(ExceptionCode)}를 추가합니다.
     *     </li>
     *     <li>
     *         ErrorResponse의 status와 message 필드의 값은
     *         <a href="https://github.com/codestates-seb/be-solution-exception/blob/94ae2dc4e0ed2ceba9ce304d227a532902251208/src/main/java/com/codestates/exception/BusinessLogicException.java" target="_blank">
     *             BusinessLogicException
     *          </a>에 포함되어 있는
     *         <a href="https://github.com/codestates-seb/be-solution-exception/blob/94ae2dc4e0ed2ceba9ce304d227a532902251208/src/main/java/com/codestates/exception/ExceptionCode.java" target="_blank">
     *             ExceptionCode
     *         </a>를 통해서 얻을 수 있습니다.
     *     </li>
     *     <li>
     *         <a href="https://github.com/codestates-seb/be-solution-exception/blob/94ae2dc4e0ed2ceba9ce304d227a532902251208/src/main/java/com/codestates/exception/BusinessLogicException.java" target="_blank">
     *             BusinessLogicException
     *         </a>의 경우, 서비스 계층 쪽에서 throw되는
     *         <a href="https://github.com/codestates-seb/be-solution-exception/blob/94ae2dc4e0ed2ceba9ce304d227a532902251208/src/main/java/com/codestates/exception/ExceptionCode.java" target="_blank">
     *             ExceptionCode
     *         </a>에 따라 HTTP Status가 동적으로 변할 수 있기 때문에
     *         <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseStatus.html" target="_blank">
     *             {@literal @}ResponseStatus
     *         </a>를 이용해 HTTP Status를 고정하는 것은 적절하지 않습니다.
     *     </li>
     * </ul>
     *
     * @param e 서비스 계층에서 throw 되는 BusinessLogicException 객체
     * @return  ErrorResponse 객체와 HTTP Status를 포함하고 있는 ResponseEntity 객체
     */
    @ExceptionHandler
    public ResponseEntity handleBusinessLogicException(BusinessLogicException e) {
        final ErrorResponseV1 response = ErrorResponseV1.of(e.getExceptionCode());

        return new ResponseEntity<>(response, HttpStatus.valueOf(e.getExceptionCode().getStatus()));
    }


    /**
     * 클라이언트 측에서 적절하지 않은 HTTP Method를 통해 request 전송 시, throw되는
     * <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/HttpRequestMethodNotSupportedException.html" target="_blank">
     *      HttpRequestMethodNotSupportedException
     * </a>을 catch해서 처리하기 위한 예외 처리 메서드를 구현한 Solution 코드입니다.
     * <p>
     *     <b>Solution 키 포인트</b>
     * </p>
     * <p>
     * homework에서 요구하는 것은 클라이언트 측에 전달하는 JSON 포맷에서 아래와 같은 status와 message 프로퍼티를 추가하는 것입니다.
     * </p>
     * <pre>
     *  {
     *     "status": 405,
     *     "message": "Method Not Allowed",
     *     "fieldErrors": null,
     *     "violationErrors": null
     *  }
     * </pre>
     * <ul>
     *     <li>
     *         첫 번째 실습 과제를 통해 {@link ErrorResponseV1#of(ExceptionCode)}를 추가했지만
     *         {@link ErrorResponseV1#of(ExceptionCode)}를 통해 두 번째 실습 과제의 요구 사항을 만족시킬 수 없습니다.
     *         따라서
     *         <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/HttpStatus.html" target="_blank">
     *            HttpStatus
     *         </a> 를 통해 status와 message 필드의 값을 얻을 수 있는 {@link ErrorResponseV1#of(HttpStatus)}를 추가합니다.
     *     </li>
     *     <li>
     *         {@link #handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException)}는
     *         <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/HttpRequestMethodNotSupportedException.html" target="_blank">
     *             HttpRequestMethodNotSupportedException
     *         </a>에 대한 처리만 하므로,
     *         <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/bind/annotation/ResponseStatus.html" target="_blank">
     *            {@literal @}ResponseStatus
     *         </a>를 메서드 레벨에 추가해서 Http Status를 적용할 수 있습니다.
     *     </li>
     * </ul>
     * @param e 클라이언트 측에서 적절하지 않은 HTTP Method를 통해 request 전송 시, throw되는
     *          <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/HttpRequestMethodNotSupportedException.html" target="_blank">
     *              HttpRequestMethodNotSupportedException
     *          </a> 객체
     * @return  ErrorResponse 객체
     */
    @ExceptionHandler
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public ErrorResponseV1 handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException e) {

        final ErrorResponseV1 response = ErrorResponseV1.of(HttpStatus.METHOD_NOT_ALLOWED);

        return response;
    }

    /**
     * 애플리케이션에서 발생하는 개발자의 구현 오류 등으로 발생하는 Exception을 처리하기 위한 에러 처리 전용 메서드를 구현한 Solution 코드입니다.
     * <p>
     *   <b>Solution 키 포인트</b>
     * </p>
     * <p>
     *   homework에서 요구하는 것은 클라이언트 측에 전달하는 JSON 포맷에서 아래와 같은 status와 message 프로퍼티를 추가하는 것입니다.
     * </p>
     * <pre>
     *  {
     *     "status": 500,
     *     "message": "Internal Server Error",
     *     "fieldErrors": null,
     *     "violationErrors": null
     *  }
     * </pre>
     * <ul>
     *     <li>
     *         {@link #handleException(Exception)}은 각각의 에러 전용 처리 메서드에서 catch 하지 않는 나머지 Exception들을
     *         모두 처리하게 됩니다.
     *     </li>
     *     <li>
     *         {@link ErrorResponseV1#of(HttpStatus)}를 이미 두 번째 과제에서 구현했기 때문에
     *         적절한 Http Status만 파라미터로 제공하면 됩니다.
     *     </li>
     *     <li>
     *         여기서는 서버 내부에서  발생하는 에러를 의미하는
     *         <a href="https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/HttpStatus.html#INTERNAL_SERVER_ERROR" target="_blank">
     *              HttpStatus.INTERNAL_SERVER_ERROR
     *         </a>를 파라미터로 전달합니다.
     *     </li>
     *     <li>
     *         {@link #handleException(Exception)}은 서버 내부에서 발생하는 애플리케이션 에러를 catch하므로,
     *         에러 로그를 로그에 기록하고, 관리자에게 이메일이나 카카오 톡,슬랙 등으로 관리자에게 알림을 전송하는 로직이
     *         포함되기 좋은 포인트입니다.
     *     </li>
     * </ul>
     * @param e 클라이언트 측에서 적절하지 않은 HTTP Method를 통해 request 전송 시, throw되는
     *          <a href="https://docs.oracle.com/javase/7/docs/api/java/lang/Exception.html" target="_blank">
     *              Exception
     *          </a> 객체
     * @return  ErrorResponse 객체
     */
    @ExceptionHandler
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponseV1 handleException(Exception e) {
        log.error("# handle Exception", e);
        // TODO 애플리케이션의 에러는 에러 로그를 로그에 기록하고, 관리자에게 이메일이나 카카오 톡,
        //  슬랙 등으로 알려주는 로직이 있는게 좋습니다.

        final ErrorResponseV1 response = ErrorResponseV1.of(HttpStatus.INTERNAL_SERVER_ERROR);

        return response;
    }
}
