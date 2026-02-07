package com.codestates.response;

import lombok.Getter;
import org.springframework.validation.BindingResult;

import javax.validation.ConstraintViolation;
import java.util.List;
import java.util.Set;

/**
 * <h3>애플리케이션 예외 처리 실습 과제용 Solution 코드 포함</h3>
 * <ul>
 *     <li>
 *         {@link #of(BindingResult)}에서는 Error 인터페이스의 구현 클래스인
 *         FieldError.of(bindingResult)로 에러 정보를 얻는다.
 *     </li>
 *     <li>
 *         {@link #of(Set<ConstraintViolation<?>>)}에서는 Error 인터페이스의 구현 클래스인
 *         ConstraintViolationError.of(violations)로 에러 정보를 얻는다.
 *     </li>
 * </ul>
 * Solution 코드에 포함되는 코드는 아래와 같습니다.
 * <ul>
 *     <li>List<FieldError> errors</li>
 *     <li>private ErrorResponse(int status, String message)</li>
 *     <li>{@link #of(BindingResult)}</li>
 *     <li>{@link #of(Set<ConstraintViolation<?>>)}</li>
 * </ul>
 */
@Getter
public class ErrorResponseV3 {
    private List<Error> errors;

    private ErrorResponseV3(List<Error> errors) {
        this.errors = errors;
    }

    public static ErrorResponseV3 of(BindingResult bindingResult) {
        List<Error> errors = FieldError.of(bindingResult);
        return new ErrorResponseV3(errors);
    }

    public static ErrorResponseV3 of(Set<ConstraintViolation<?>> violations) {
        List<Error> errors = ConstraintViolationError.of(violations);
        return new ErrorResponseV3(errors);
    }
}