// import { useEffect, useState } from "react"; useQuery 로 대체됨  
import { useQuery } from "@tanstack/react-query";
import { fetchBoards } from "../api/board";
import type { Board } from "../types/Board";   
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function BoardListPage() {
    // const [boards, setBoards] = useState<Board[]>([]);

    // useEffect(() => {
    //     fetchBoards()
    //     .then(setBoards)
    //     .catch((error) => console.error("게시판 불러오기 실패:", error));
    // }, []);

    const { data: boards = [], isLoading, isError, error } = useQuery<Board[]>({
        queryKey: ['boards'],
        queryFn: fetchBoards,
        staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 신선하다고 간주(5분동안은 새로고침 해도 API 호출 안함)
        gcTime: 1000 * 60 * 10, // 10분간 다시 안 보면 캐시 삭제
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (isError && error instanceof Error) {
        return <div>게시판을 불러오는 데 실패했습니다: {error.message}</div>;
    }


    return (
        <Layout>
            <h2>게시판 목록</h2>
            <table border={1} cellPadding={8}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>댓글 수</th>
                    </tr>
                </thead>
                <tbody>
                    {boards.map((board) => (
                        <tr key={board.id}>
                            <td>{board.id}</td>
                            <td>
                                <Link to={`/board/${board.id}`}>{board.title}</Link>
                            </td>
                            <td>{board.nickname}</td>
                            <td>{board.commentCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}

export default BoardListPage;