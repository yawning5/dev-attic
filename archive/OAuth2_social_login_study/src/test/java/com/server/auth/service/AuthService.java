package com.server.auth.service;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.web.client.RestTemplate;

import com.server.auth.jwt.service.JwtProvider;
import com.server.auth.oauth.service.OAuthProvider;
import com.server.auth.oauth.service.OAuthService;
import com.server.domain.channel.service.ChannelService;
import com.server.domain.member.repository.MemberRepository;

@SpringBootTest
public class AuthService {

	@Autowired InMemoryClientRegistrationRepository inMemoryRepository;
	@Autowired MemberRepository memberRepository;
	@Autowired ChannelService channelService;
	@Autowired JwtProvider jwtProvider;
	@Autowired DefaultOAuth2UserService defaultOAuth2UserService;
	@Autowired RestTemplate restTemplate;
	@Autowired OAuthService oAuthService;

	@Test
	void getToken() {
		//given
		String code = "4%0Adeu5BUWErH9w8qOzsmUVeu8Rnl0EjSUZCeMV4mGy-NnH4iTXwHEGydNXqxI1_Owy1ktEg";
		ClientRegistration clientRegistration = inMemoryRepository.findByRegistrationId(OAuthProvider.GOOGLE.getDescription());

		String token = oAuthService.getToken(code, clientRegistration);

		assertThat(token).isNotNull();
	}
}
