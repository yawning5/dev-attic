package com.codestates.utils;

import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Component;

import java.lang.reflect.Field;
import java.util.Collection;

@Component
public class CustomBeanUtils<T> {
    public T copyNonNullProperties(T source, T destination) {
        if (source == null || destination == null || source.getClass() != destination.getClass()) {
            return null;
        }

        // src와 dest는 각각 원본 클래스의 속성에 직접 접근함
        // 따라서 src, dest를 통해서 바꾸면 source, destination이 바뀌는 것
        final BeanWrapper src = new BeanWrapperImpl(source);
        final BeanWrapper dest = new BeanWrapperImpl(destination);

        // source 객체의 모든 필드를 가져온다 가져온 필드는 각각 아래의 작업을 수행한다.
        for (final Field property : source.getClass().getDeclaredFields()) {

            // 현재 반복중인 필드의 source 객체에 대한 값을 가져온다.
            Object sourceProperty = src.getPropertyValue(property.getName());

            // 가져온 속성 값이 null이 아니고 Collection의 인스턴스가 아니여한다
            if (sourceProperty != null && !(sourceProperty instanceof Collection<?>)) {

                // 위의 조건이 만족하면 해당 속성 값을 destination 객체에 설정하게 된다.
                dest.setPropertyValue(property.getName(), sourceProperty);
            }
        }

        // 설정이 끝난 destination 객체를 반환한다
        return destination;
    }
}
