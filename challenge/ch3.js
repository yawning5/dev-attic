

function tokenize(xml) {
    const tagRegex = /(<[^>]+>)|([^<]+)/g;
    const tokens = [];
    let prolog = null;
    let match;

    while ((match = tagRegex.exec(xml))) {
        const [full, tagPart, textPart] = match;

        if (tagPart) {
            // Prolog(<?xml ... ?>) 만 저장, 나머지 선언/주석 무시
            if (tagPart.startsWith('<?')) {
                prolog = tagPart;
                continue;
            }
            if (tagPart.startsWith('<!')) continue;

            // 태그
            if (tagPart.startsWith('</')) {
                // 종료 태그
                const tagName = tagPart.match(/^<\/([\w\-:]+)/i)[1];
                tokens.push({ type: 'end', tag: tagName, attrs: null, text: null });
            } else if (tagPart.endsWith('/>')) {
                // 셀프 클로징
                const tagName = tagPart.match(/^<([\w\-:]+)/)[1];
                const attrs = parseAttrs(tagPart);
                tokens.push({ type: 'self', tag: tagName, attrs, text: null });
            } else {
                // 시작 태그
                const tagName = tagPart.match(/^<([\w\-:]+)/i)[1];
                const attrs = parseAttrs(tagPart);
                tokens.push({ type: 'start', tag: tagName, attrs, text: null });
            }
        } else if (textPart && textPart.trim()) {
            //텍스트 노드 (공백 제외)
            tokens.push({ type: 'text', tag: null, attrs: null, text: textPart.trim() });
        }
    }
    return { tokens, prolog }
}

// 콜론(:), 하이튼(-) 등 속성명까지 지원하는 속성 파서
function parseAttrs(tagStr) {
    const attrs = {};
    // (\w[\w\:\-]*) : 속성명 (콜론, 하이튼 포함)
    // (['"]) : 작은/큰 따옴표 구분
    // (.*?)\2 : 따옴표로 감싼 값 <\2 << 그룹 2에서 캡처한 동일 따옴표로 끝남을 보장 (열었던 따옴표와  같은 것으로 닫힘>
    const attrRegex = /([\w\-:]+)\s*=\s*(['"])(.*?)\2/g;
    let match;
    while ((match = attrRegex.exec(tagStr))) {
        attrs[match[1]] = match[3];
    }
    return Object.keys(attrs).length ? attrs : null;
}

function parseTree(tokens) {
    // 루트 노드(더미)와 스택 준비
    const root = { tag: 'ROOT', attrs: null, children: [] };
    const stack = [root];

    for (const token of tokens) {
        if (token.type === 'start') {
            // 새 노드 만들고 부모의 children에 추가, 스택에 push
            const node = {
                tag: token.tag,
                attrs: token.attrs,
                children: []
            };
            stack[stack.length - 1].children.push(node);
            stack.push(node);
        } else if (token.type === 'end') {
            // 종료 태그면 스택 pop (부모로 올라감)
            stack.pop();
        } else if (token.type === 'self') {
            // 셀프 클로징 태그는 children에 바로 추가 (스택 push 없음)
            const node = {
                tag: token.tag,
                attrs: token.attrs,
                children: []
            };
            stack[stack.length - 1].children.push(node);
        } else if (token.type === 'text') {
            // 텍스트 노드 추가
            stack[stack.length - 1].children.push({
                text: token.text
            });
        }
    }
    // ROOT 아래 첫 번째 자식이 진짜 루트!
    return root.children.length === 1 ? root.children[0] : root.children;
}

function displayJSON(tree) {
  return JSON.stringify(tree, null, 2);
}


function elementByAttribute() {

}

function reportByClass() {

}

function findXPath() {

}

const xml1 = `
<!DOCTYPE html>
<HTML lang="ko">
<BODY>
<P>BOOST<IMG SRC=\"codesquad.kr\"></IMG>
<BR/></P>
<FONT name="Seoul">CAMP</FONT>
</BODY></HTML>
`

const xml2 = `
<?xml version="1.0" encoding="utf-8"?>
  <LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:orientation="vertical" >

      <TextView android:id="@+id/text"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Hello, I am a TextView" />
      <Spacer>blank</Spacer>
      <Button android:id="@+id/button"
              android:layout_width="wrap_content"
              android:layout_height="wrap_content"
              android:text="Hello, I am a Button" />
  </LinearLayout>
`

const xml3 = `
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key>
<string>boost</string>
<blank/>
<key>CFBundleName</key>
<string>camp</string>
<blank/>
<key>Classes</key>
<array><string>Web</string><string>iOS</string><string>Android</string></array>
</dict></plist>
`

console.log(displayJSON(parseTree(tokenize(xml1).tokens), null, 2));
