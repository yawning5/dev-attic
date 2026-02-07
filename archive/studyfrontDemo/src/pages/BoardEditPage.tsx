import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchBoardById, patchBoard } from "../api/board";
import type { Board, BoardWriteInput } from "../types/Board";
import Button from "../components/Button";

function BoardEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState<BoardWriteInput>({
        title: "",
        content: "",
    });

    useEffect(() => {
        if (id) {
            fetchBoardById(Number(id))
                .then((board: Board) => {
                    setForm({
                        title: board.title,
                        content: board.content ?? ""
                    });
                })
                .catch((error) => {
                    console.error("게시글 불러오기 실패:", error);
                    alert("게시글을 불러오는 데 실패했습니다.");
                });
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        try {
            await patchBoard(Number(id), form);
            alert("게시글이 수정되었습니다.");
            navigate(`/board/${id}`);
        } catch (error) {
            console.error("게시글 수정 실패:", error);
            alert("게시글 수정에 실패했습니다.");
        }
    };

    return (
        <div>
            <h2>게시글 수정</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="제목"
                /><br />
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="내용"
                /><br />
                <Button type="submit">수정하기</Button>
            </form>
        </div>
    );
}
export default BoardEditPage;