package com.sparta.junit5practice;

import org.junit.jupiter.api.*;

public class BeforeAfterTest {
    @BeforeEach
    void setUp() {
        System.out.println("각각의 테스트 코드가 실행되기 전에 수행");

    }

    @AfterEach
    void tearDown() {
        System.out.println("각각의 테스트 코드가 실행된 후에 수행\n");

    }

    @BeforeAll
    static void beforeAll() {
        System.out.println("처음 한번만 수행\n");

    }

    @AfterAll
    static void afterAll() {
        System.out.println("마지막에 한번만 수행");
    }

    @Test
    void test1() {
        System.out.println("첫번째 테스트 코드");
    }


    @Test
    void test2() {
        System.out.println("두번째 테스트 코드");
    }
}
