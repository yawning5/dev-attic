package com.yawn.study;

import com.yawn.study.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class StudyApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudyApplication.class, args);
	}

	public final MemberRepository memberRepository;

//	@Bean
//	CommandLineRunner init(MemberRepository memberRepository) {
//		return args -> {
//			Member member = new Member();
//			member.setName("test-user");
//			memberRepository.save(member);
//		};
//	}
}
