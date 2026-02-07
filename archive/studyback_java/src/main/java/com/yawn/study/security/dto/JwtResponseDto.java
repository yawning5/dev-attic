package com.yawn.study.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class JwtResponseDto {
    private String accessToken;
    private String tokenType;
}
