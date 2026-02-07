import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBoardById } from "../api/board";
import { postComment } from "../api/comment";
import type { Board } from "../types/Board";
import { deleteBoard } from "../api/board";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Textarea from "../components/Textarea";
import axios from "axios";

function BoardDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    // const [board, setBoard] = useState<Board | null>(null);

    const [commentInput, setCommentInput] = useState("");
    const handleCommentSubmit = async () => {
        if (!commentInput.trim() || !id) return;

        try {
            console.log("전송할 boardId:", id);
            await postComment(Number(id), { content: commentInput });
            setCommentInput("");

            // 댓글 추가 후 게시글 다시 조회
            // const updated = await fetchBoardById(Number(id));
            // setBoard(updated);

            // React Query를 사용하여 게시글을 다시 가져오도록 트리거
            refetch(); // useQuery의 refetch 메서드 사용
            alert("댓글이 추가되었습니다.");
        } catch (error) {
            console.error("댓글 추가 실패:", error);
            alert("댓글 추가에 실패했습니다.");
        }
    };


    const handleDelete = async () => {
        console.log("삭제 버튼 클릭");
        console.log("삭제 시도 ID:", id);
        console.log("board 상태:", board);
        if (!window.confirm("정말 삭제하시겠습니까?")) return;


        try {
            console.log("삭제 요청 ID:", board!.id);
            await deleteBoard(board!.id);
            alert("게시글이 삭제되었습니다.");
            navigate("/boards");
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            alert("게시글 삭제에 실패했습니다.");
        }

    }

    // useEffect(() => {
    //     if (id) {
    //         fetchBoardById(Number(id))
    //             .then((data) => setBoard(data))
    //             .catch((error) => console.error("상세 조회 실패:", error));
    //     }
    // }, [id]);

    const {
        data: board,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<Board>({
        queryKey: ["board", id],
        queryFn: () => fetchBoardById(Number(id)),
        enabled: !!id,
        retry: false,
    });


    if (!id || isNaN(Number(id))) {
        return <div>잘못된 요청입니다.</div>;
    }

    if (!board) {
        return <div>Loading...</div>;
    }

    if (isError) {
        if (axios.isAxiosError(error)) { // axios.isAxiosError(error) 를 통해 타입 좁히기를 해주는 게 포인트
            if (error.response?.status === 404) {
                return <div>존재하지 않는 게시글입니다.</div>;
            }
            if (error.response?.status === 401) {
                alert("로그인이 필요합니다.");
                navigate("/login");
                return null;
            }
        }
        return <div>게시글을 불러오는 중 오류가 발생했습니다.</div>;
    }


    return (
        <div>
            <h1>{board.title}</h1>
            <p>작성자: {board.nickname}</p>
            <p>{board.content}</p>

            {/* 댓글 목록 */}
            {board.comments && board.comments.length > 0 && (
                <div>
                    <h3>댓글</h3>
                    <ul>
                        {board.comments.map((comment) => (
                            <li key={comment.id}>
                                <strong>{comment.nickname}</strong>: {comment.content}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* 댓글 입력 */}
            <div>
                <h4>댓글 작성</h4>
                <Textarea
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="댓글을 입력하세요"
                /><br />
                <Button onClick={handleCommentSubmit}>댓글 작성</Button>
            </div>
            {/* 삭제 버튼 */}
            <Button onClick={handleDelete}>삭제</Button>
        </div>
    );
}

export default BoardDetailPage;