package com.yawn.study.noSecurityCORSConfig;

/*
spring security 가 활성화되면 WebMvc 는 무시되고 springSecurity 가 먼저 인정된다.
 */

//import org.springframework.context.annotation.Configuration;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//@Configuration
//public class CORSConfig implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**")
//                .allowedOrigins(
//                        "http://yawn-study-bucket.s3-website.ap-northeast-2.amazonaws.com",
//                        "http://localhost:3000")
//                .allowedMethods("*");
//    }
//}
