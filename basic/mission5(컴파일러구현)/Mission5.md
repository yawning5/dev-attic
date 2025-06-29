## 컴파일러 동작 방식에 대해
> 코드를 컴퓨터가 이해할 수 있는 언어로 바꿔주는 역할
동작 방식에 대해선 생각해보지 않았다
>
## 자료 조사 및 학습 경로
<a href = "https://www.youtube.com/watch?v=ZI198eFghJk">현대적인 컴파일러 디자인</a>
> 컴파일러의 동작 순서를 설명해주고 전통적인 컴파일러의 문제점과 현재 개발중인 컴파일러의 특징 파서의 자료구조를 어떤걸 사용하는지에 관해 설명한다

<a href ="https://gyujincho.github.io/2018-06-19/AST-for-JS-devlopers">AST for JavaScript developers</a>
> AST 가 어떤식으로 출력되고 어떤 형태인지 보기쉽게 사진으로 정리되어있고 AST 추출과정에 대해 설명되어있다

AST 는 사용자가 작성한 코드를 구조적으로 분석해 문법적/의미적 구조를 트리형태로 표현한 자료구조

컴파일러가 사용자의 코드를 해석하고 의미분석, 이름 해석, 타입검사, 프로그램 검증 등에서 효율적이고 안정적으로 처리하기 위해 생성

AST 는 아래의 3과정을 거쳐 생성 및 정제 된다
### 1. Lexing
> 텍스트를 토큰으로 변환한다 -> 토큰 스트림 생성
>
- 문자, 유니코드, 공백, 주석 등 텍스트와 관련된 것들을 처리한다
- 처리결과로는 여러 규칙에 따라 분리하여 토큰 스트림을 생성
```
const a = "5";

// [{value: 'const', type: 'keyword}, {value: 'a', type: 'identifier'}, ...]
```
---
### 2. Parser
> 토큰을 구조화된 AST 로 변환
>
- 중첩을 처리하고 사물의 구조와 관계를 처리함
- 재귀적 디센트 파서가 흔히 사용된다
---

### 3. Syntactic Analysis, Semantic analysis
> AST 에 의미부여, 이름 해석, 타입 검사, 프로그램 검증을 수행한다
>
- 중첩을 처리하고 사물의 구조와 관계를 처리한다
- 문법으로는 문맥 자유 문법 또는 문맥 민감 문법을 사용함
- 재귀적 디센트 파서가 흔히 사용된다
---

## AST 구조 및 데이터 설계
<a href = "https://github.com/jamiebuilds/the-super-tiny-compiler">the super tiny compiler</a>
> js 로 구현한 컴파일러 예시




