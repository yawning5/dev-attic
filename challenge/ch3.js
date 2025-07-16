function tokenize(xml) {
    const tagRegex = /(<[^>]+>)|([^<]+)/g;
    const tokens = [];
    let match;

    while((match = tagRegex.exec(xml))) {
        const [full, tagPart, textPart] = match;

        if (tagPart) {
            if (/^<\?/.test(tagPart) || /^<!--/.test(tagPart) || /^<!DOCTYPE/i.test(tagPart)) continue;

            // 태그
            if (tagPart.startsWith('</')) {
                // 종료 태그
                const tagName = tagPart.match(/^<\/([\w\-:]+)/i)[1];
                tokens.push({ type: 'end', tag: tagName, attrs: null, text: null});
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
    return tokens
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

function displayJSON() {

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

console.log(JSON.stringify(tokenize(xml1), null, 2));
