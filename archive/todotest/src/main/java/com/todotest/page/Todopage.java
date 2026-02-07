package com.todotest.page;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class Todopage {
    @GetMapping
    public String helloTodo() {
        return "To-do Application!";
    }
    // dev 브랜치 push 확인
    // dfasdf asdf
    // ajskdfljkasdfjkla
}
