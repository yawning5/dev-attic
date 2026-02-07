# Spring Data JPA 실습 과제 Solution 코드

### Description
Spring Data JPA 실습 과제 Solution 코드는 유어클래스의 실습 과제에 사용된 코드로 구성되어 있습니다.

* Spring Data JPA 실습 과제 Solution과 관련이 있는 클래스
  * [Order](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/order/entity/Order.java)
  * [OrderCoffee](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/order/entity/OrderCoffee.java)
  * [Coffee](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/coffee/entity/Coffee.java)
  * [Money](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/values/Money.java)
  * [Member](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/member/entity/Member.java)
  * [Stamp](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/stamp/Stamp.java)
  * [Auditable](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/audit/Auditable.java)
  * [AuditorAwareImpl](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/audit/AuditorAwareImpl.java)
  * [OrderService](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/order/service/OrderService.java)
  * [OrderController](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/order/controller/OrderController.java)
  * [OrderMapper](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/order/mapper/OrderMapper.java)
  * [OrderResponseDto](https://github.com/codestates-seb/be-solution-jpa/blob/5703b335b8a38da3ebefe689cc32f9c6471b67dd/src/main/java/com/codestates/order/dto/OrderResponseDto.java)
  
* Advanced 예제
  * [static 멤버 클래스를 이용한 DTO 클래스 리팩토링](#static-멤버-클래스를-이용한-dto-클래스-리팩토링)
  * [Mapstruct 매핑 예제 코드](#mapstruct-매핑-예제-코드)
  * [Value Object를 타입으로 사용하기 위한 예제 코드](#value-object를-타입으로-사용하기-위한-예제-코드)
  * [Projection 기능 활용한 읽기 전용 엔티티 사용 예제 코드](#projection-기능-활용한-읽기-전용-엔티티-사용-예제-코드)
  
> 예제 코드에 대한 더 구체적인 정보는 아래에서 확인하세요.

---

### Solution 코드 설명을 위한 javadoc(index.html) 문서 확인 방법
* IntelliJ 화면 오른쪽 상단의 `[Gradle]` 탭에서 `Tasks > documentation > javadoc` task를 더블 클릭해서 실행하세요.
* 아래 경로의 index.html을 더블 클릭하세요.
  * `build/docs/index.html`
* index.html 파일에 마우스를 올리면 오른쪽 상단에 웹 브라우저 아이콘이 표시됩니다.
  * 해당 아이콘을 클릭해서 index.html을 브라우저에서 오픈합니다.
  * 만약 웹 브라우저 아이콘이 보이지 않는다면 index.html 파일에서 마우스 오른쪽 버튼을 클릭해 오픈된 Context 메뉴의 아래 경로를 통해 브라우저 아이콘을 클릭하세요.
    * `Open In > Browser > Chrome`
* 브라우저에 오픈된 index.html 파일의 화면에서 `[Packages] 또는 [ALL CLASSES]`를 통해 Solution 코드가 포함된 클래스의 javadoc 문서를 확인할 수 있습니다.

---

### static 멤버 클래스를 이용한 DTO 클래스 리팩토링
static 멤버 클래스를 이용해 DTO 클래스의 개수를 줄이는 예제 코드입니다.
* 소스 코드 경로
  * DTO
    * [src/main/java/com/codestates/member/dto/MemberDto.java](https://github.com/codestates-seb/be-solution-jpa/blob/93bf231948a1188fa4ec8005f2cc23f629239878/src/main/java/com/codestates/member/dto/MemberDto.java)
  * Mapper
    * [src/main/java/com/codestates/member/mapper/MemberMapper.java](https://github.com/codestates-seb/be-solution-jpa/blob/93bf231948a1188fa4ec8005f2cc23f629239878/src/main/java/com/codestates/member/mapper/MemberMapper.java)

---

### Mapstruct 매핑 예제 코드
Mapstruct의 @Mapping 애너테이션을 이용해 필드를 매핑하는 예제 코드입니다.
* 소스 코드 경로
  * DTO
    * [src/main/java/com/codestates/member/dto/MemberDto.java](https://github.com/codestates-seb/be-solution-jpa/blob/93bf231948a1188fa4ec8005f2cc23f629239878/src/main/java/com/codestates/member/dto/MemberDto.java)
  * Mapper
    * [src/main/java/com/codestates/member/mapper/MemberMapper.java](https://github.com/codestates-seb/be-solution-jpa/blob/93bf231948a1188fa4ec8005f2cc23f629239878/src/main/java/com/codestates/member/mapper/MemberMapper.java)
---

### Value Object를 타입으로 사용하기 위한 예제 코드
Spring Data JPA에서 Value Object를 데이터 타입으로 사용하기 위해 @Embeddable / @Embedded 애너테이션을 사용할 수 있습니다.
* 소스 코드 경로
  * Money 타입 Value Object
    * [src/main/java/com/codestates/values](https://github.com/codestates-seb/be-solution-jpa/tree/main/src/main/java/com/codestates/values)
  * Entity
    * [src/main/java/com/codestates/coffee/entity](https://github.com/codestates-seb/be-solution-jpa/tree/main/src/main/java/com/codestates/coffee/entity)
  * Mapper
    * [src/main/java/com/codestates/coffee/mapper](https://github.com/codestates-seb/be-solution-jpa/tree/main/src/main/java/com/codestates/coffee/mapper)

---

### Projection 기능 활용한 읽기 전용 엔티티 사용 예제 코드
JPA에서는 Projection 이라는 기능을 통해 특정 엔티티 클래스의 필드 중에서 필요한 필드의 정보만 조회할 수 있습니다.
Projection 기능을 이용하면 간단한 읽기 전용 엔티티를 사용할 수 있으므로 Mapper를 이용한 DTO 변환 과정을 거치지 않아도 됩니다.
하지만 코드의 일관성을 위해 간단한 읽기 전용 엔티티를 위해서만 사용하는 것이 더 나은 선택일 수 있습니다.
* 소스 코드 경로
  * MemberExcludeName
    * [src/main/java/com/codestates/member/entity/MemberExcludeName](https://github.com/codestates-seb/be-solution-jpa/blob/main/src/main/java/com/codestates/member/entity/MemberExcludeName.java)
  * MemberRepository
    * [src/main/java/com/codestates/member/repository/MemberRepository/findByMemberId(long memberId)](https://github.com/codestates-seb/be-solution-jpa/blob/main/src/main/java/com/codestates/member/repository/MemberRepository.java)
  * MemberService
    * [src/main/java/com/codestates/member/service/MemberService/findMemberExcludeName(long memberId)](https://github.com/codestates-seb/be-solution-jpa/blob/main/src/main/java/com/codestates/member/service/MemberService.java)
  * MemberController
    * [src/main/java/com/codestates/member/service/MemberController/getMember2(@PathVariable("member-id") @Positive long memberId)](https://github.com/codestates-seb/be-solution-jpa/blob/main/src/main/java/com/codestates/member/controller/MemberController.java)
