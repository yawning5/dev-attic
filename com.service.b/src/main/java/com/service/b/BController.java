package com.service.b;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BController {

    @GetMapping("hello")
    public String hello(){
        return "hello";
    }

}
