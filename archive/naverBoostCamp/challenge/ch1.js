class meetUp {
    constructor(timeList, memberMap) {
        this.timeList = timeList;
        this.memberMap = memberMap;
    }
}

const pattern = /([가-힣])(\d+)-(\d+)/;
const meetUpList = new Map();



function arrange(meetUpId, timeList, members) {
    const timeLine = timeSep(timeList);
    console.log(`멤버들` + members)
    const memberMap = new Map(members.map(k => [k, []]));
    console.log(`멤버맵` + [...memberMap.keys()]);
    const meet = new meetUp(timeLine, memberMap);
    meetUpList.set(meetUpId, meet)



    console.log(meet.timeList)
    console.log(`\n`)
    console.log(meet.memberMap)
}

function vote(meetUpId, userVotes) {
    validateMeetUpId(meetUpId);
    const meetUp = meetUpList.get(meetUpId);
    const memberMap = meetUp.memberMap;
    for (const userVote of userVotes) {
        validateUser(meetUp, userVote);
        memberMap.set(userVote.userId, timeSep(userVote.vote));
    }
    console.log(JSON.stringify(Object.fromEntries(memberMap), null, 2));
}

function validateUser(meetUp, userVote) {
    if (!meetUp.memberMap.has(userVote.userId)) throw new Error(`밋업에 등록되지 않은 사용자 ${userVote.userId}`);
}

function validateMeetUpId(meetUpId) {
    if (!meetUpList.has(meetUpId)) throw new Error('존재하지 않는 밋업');
}

function timeSep(timeList) {
    const timeLine = [];
    for (const str of timeList) {
        const match = str.match(pattern);
        for (let i = +match[2]; i < +match[3]; i++) {
            timeLine.push(`${match[1]} ${i}-${i + 1}`);
        }
    }
    return timeLine;
}

function close(meetUpId) {
    validateMeetUpId(meetUpId);
    const meetUp = meetUpList.get(meetUpId);
    const timeList = meetUp.timeList;           // ['월 10-11', ...]
    const members = Array.from(meetUp.memberMap.keys()); // ['A','B',...]
    const memberMap = meetUp.memberMap;         // Map<member, vote[]>

    /* 1. 각 시간대 행(row) 생성 */
    const rows = timeList.map(slot => {
        const cells = members.map(m => {
            const voted = memberMap.get(m).includes(slot);
            return voted ? '🁢🁢🁢' : '   ';
        });
        const total = cells.filter(c => c.trim()).length;
        return { slot, cells, total };
    });

    /* 2. 최대 인원 계산 & 추천 슬롯 추출 */
    const maxTotal = Math.max(...rows.map(r => r.total));
    const bestRows = rows.filter(r => r.total === maxTotal && maxTotal > 0);

    /* 3. 표(header + body) 조립 */
    const header = `밋업${meetUpId}  | ${members.join(' | ')} | Total`;
    const line = '-'.repeat(header.length);
    const out = [header, line];

    let curDay = '';
    for (const r of rows) {
        const [day] = r.slot.split(' ');      // '월'
        if (curDay && curDay !== day) out.push(line); // 요일 구분선
        curDay = day;
        out.push(`${r.slot}|${r.cells.join('|')}| ${r.total || ''}`);
    }
    out.push(line);

    /* 4. 추천 시간대 출력 */
    out.push(`${meetUpId} 추천 시간대`);
    for (const r of bestRows) {
        const participants = members.filter((m, i) => r.cells[i].trim());
        out.push(`${r.slot} : ${r.total}명 ${participants.join(', ')}`);
    }

    console.log(out.join('\n'));
}

const meetUpId = 'M1';
timeList = ['월10-16', '화10-13', '수12-16', '목17-18', '금19-20'];
members = ['A', 'B', 'C', 'D']
const userVotes = [
    { userId: 'A', vote: ['월10-11', '화10-11', '수12-13', '수17-18'] },
    { userId: 'B', vote: ['월10-12', '수12-14', '목16-17'] },
    { userId: 'C', vote: ['화10-12', '수12-15', '금19-20'] },
    { userId: 'D', vote: ['월10-15', '수12-16', '수17-18', '금19-20'] },
];
arrange(meetUpId, timeList, members)
console.log(`객체` + JSON.stringify([...meetUpList.get('M1').memberMap.keys()]))
vote('M1', userVotes)
close('M1')