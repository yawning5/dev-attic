import { use, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMyInfo } from '../api/member';
import type { MemberInfo } from '../types/Member';
import useUserStore from '../stores/useUserStore';

function MyPage() {

    // useQuery로 대체되는 내용
    // const [me, setMe] = useState<MemberInfo | null>(null);

    // useEffect(() => {
    //     fetchMyInfo()
    //         .then(setMe)
    //         .catch((error) => {
    //             console.error("Failed to fetch member info:", error);
    //             alert("Failed to fetch member info");
    //         });
    // }, []);

    const {
        data: me,
        isLoading,
        isError,
        error,
    } = useQuery<MemberInfo>({
        queryKey: ['myInfo'],
        queryFn: fetchMyInfo,
    });

    if (!me) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>My Page</h2>
            <p>이메일: {me.email}</p>
            <p>닉네임: {me.nickname}</p>

            {/*내가 쓴 글 목록 */}
            {me.boards && me.boards.length > 0 && (
                <div>
                    <h3>내가 쓴 글 목록</h3>
                    <ul>
                        {me.boards.map((board) => (
                            <li key={board.id}>
                                {board.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/*내가 쓴 댓글 목록 */}
            {me.comments && me.comments.length > 0 && (
                <div>
                    <h3>내가 쓴 댓글 목록</h3>
                    <ul>
                        {me.comments.map((comment) => (
                            <li key={comment.id}>
                                {comment.content}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
export default MyPage;