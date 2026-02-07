package com.codestates.response;

import lombok.Getter;
import org.springframework.validation.BindingResult;

import java.util.List;

/**
 * Error 인터페이스를 implements함으로써 Error Response의 필드가 공통화 됨.
 * Error.from(..)을 이용함으로써 에러 정보 추출이 공통화 됨.
 */
@Getter
public class FieldError implements Error{
    private String field;
    private String rejectedValue;
    private String reason;

    private FieldError(String field, String rejectedValue, String reason) {
        this.field = field;
        this.rejectedValue = rejectedValue;
        this.reason = reason;
    }

    public static List<Error> of(BindingResult bindingResult) {
        final List<org.springframework.validation.FieldError> fieldErrors = bindingResult.getFieldErrors();

        return Error.from(fieldErrors,
                            error -> new FieldError(
                                            error.getField(),
                                            error.getRejectedValue() == null ?
                                                    "" : error.getRejectedValue().toString(),
                                            error.getDefaultMessage()));
    }
}
