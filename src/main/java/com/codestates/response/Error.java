package com.codestates.response;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public interface Error {
    String getField();
    String getRejectedValue();
    String getReason();

    /**
     * FieldError와 ConstraintViolation에서 에러 정보를 추출하는 공통 메서드
     *
     * @param collection 에러 정보가 포함된 컬렉션(List or Set)
     * @param mapper Stream map()의 파라미터인 Function
     * @return 에러 정보 List
     * @param <V> Function의 파라미터 타입. 여기서는 org.springframework.validation.FieldError 또는 ConstraintViolation)
     * @param <T> Function의 리턴 타입. 여기서는 Error 인터페이스의 하위 타입
     */
    static <V, T> List<T> from(Collection<V> collection, Function<? super V, ? extends T> mapper) {
        return collection.stream()
                .map(mapper)
                .collect(Collectors.toList());
    }
}
