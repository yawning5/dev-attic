// AST 데이터 구조로 변환해서 처리하는 프로그램 작성
// var a = new A.init();

function tokenizer(input) {

    // 코드에서 위치를 추적하기 위한 current
    let current = 0;

    // 토큰을 푸시할 배열
    let tokens = [];

    // 공백 판별용 정규식
    const WHITESPACE = /\s/;

    // 식별자 (키워드 포함) 판별용 정규식: 영문자 또는 _
    const IDENT = /[a-zA-Z_]/;

    // 인풋을 도는 동안 current 의 루프를 생성한다
    while (current < input.length) {

        // 인풋을 도는동안 current 문자를 저장한다
        let char = input[current];

        // 괄호
        if (char === '(' || char === ')') {
            tokens.push({ type: 'paren', value: char });
            current++;
            continue;
        }

        // 세미 콜론
        if (char === ';') {
            tokens.push({ type: 'semicolon', value: ';' });
            current++;
            continue;
        }

        // 점 .
        if (char === '.') {
            tokens.push({ type: 'dot', value: '.' });
            current++;
            continue;
        }

        // 연산자
        if (char === '=') {
            tokens.push({ type: 'operator', value: '=' })
            current++;
            continue;
        }

        // 공백 (토큰 아님)
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }

        // 키워드 또는 식별자
        if (IDENT.test(char)) {
            let value = '';
            // 식별자/키워드는 영문자, 숫자, _ 로 연속된다
            while (IDENT.test(char) || /[0-9]/.test(char)) {
                value += char;
                char = input[++current];
            }

            // 현재 문자열이 키워드인지 판별
            if (value === 'var' || value === 'new') {
                tokens.push({ type: 'keyword', value });
            } else {
                tokens.push({ type: 'identifier', value });
            }
            continue;
        }

        // 이 위 조건을 만족시키지 못하면 지원하지 않는 문자
        throw new TypeError(`알 수 없는 문자: '${char}`);
    }

    return tokens;
}

/*
1. 토큰 배열을 받아
2. AST(Program 노드) 로 변환
*/
function parser(tokens) {
    // 토큰 배열 위치
    let current = 0;

    // 토큰 조회: 범위 밖이면 오류
    const peek = () => tokens[current] || error("토큰 부족");

    // 지금 토큰이 예상 타입/값인지 검사 후, 맞으면 한 칸 전진
    function expect(type, value = null) {
        const tok = peek();
        if (tok.type !== type || (value !== null && tok.value !== value)) {
            error(`토큰 기대: ${type} ${value ?? ''} / 실제: ${tok.type} ${tok.value}`);
        }
        current++;
        return tok;
    }

    // 오류 헬퍼
    function error(msg) {
        throw new SyntaxError(`ParseError: ${msg}`);
    }

    // 변수 관련
    function parseVariableDeclaration() {
        expect('keyword', 'var');

        const idTok = expect('identifier')

        const idNode = { type: 'Identifier', name: idTok.value };

        expect('operator', '=');

        const initNode = parseNewExpression();
        
        expect('semicolon', ';');

        return {
            type: 'VariableDeclaration',
            kind: 'var',
            declarations: [
                {
                    type: 'VariableDeclarator',
                    id: idNode,
                    init: initNode,
                },
            ],
        };
    }

    // new 표현식 관련
    function parseNewExpression() {
        expect('keyword', 'new');

        const objectTok = expect('identifier');
        let calleeNode = { type: 'Identifier', name: objectTok.value };

        if (peek().type === 'dot') {
            expect('dot');
            const propTok = expect('identifier');
            calleeNode = {
                type: 'MemberExpression',
                object: { type: 'Identifier', name: objectTok.value },
                property: { type: 'Identifier', name: propTok.value }, 
            };
        }

        expect('paren', '(');
        expect('paren', ')');

        return {
            type: 'NewExpression',
            callee: calleeNode,
            arguments: [],
        };
    }


    // 파서 진입부
    const body = [parseVariableDeclaration()];

    if (current !== tokens.length) {
        error('잔여 토큰 존재');
    }

    return {
        type: 'Program',
        body,
    };
}

const code = 'var a = new A.init();'
const tokens = tokenizer(code);
const ast = parser(tokens);

console.log(JSON.stringify(ast, null, 2));