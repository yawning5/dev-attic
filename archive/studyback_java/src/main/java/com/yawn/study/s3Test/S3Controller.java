package com.yawn.study.s3Test;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/s3test")
@Slf4j
public class S3Controller {
    @GetMapping
    public ResponseEntity<Map<String,Object>> isWork() {
        log.info("[S3 테스트] S3 연결 성공 - /s3test 엔드포인트 호출됨");
        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("message", "S3 연결 테스트 성공!");

        return ResponseEntity
                .ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(response);

    }
}
